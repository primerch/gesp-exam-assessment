import { hasEmptyFormula, textLines } from "./page-layout";
import { limits, type PaperPage, type Selection, type PaperIndex, type PaperQuestion } from "./document";
import { unresolved, type QuestionJudgment } from "./judgment";

export class ReviewRequestError extends Error {
  constructor(
    message: string,
    readonly retryable: boolean,
  ) {
    super(message);
  }
}
export async function reviewRequest<T>(body: unknown, signal: AbortSignal): Promise<T> {
  const response = await fetch("/api/analyze-exam", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new ReviewRequestError(
      response.status === 413 ? "页面数据过大，请拆分试卷后重试。" : "连接分析服务失败，请稍后重试。",
      [502, 503, 504].includes(response.status),
    );
  }
  const payload = await response.json();
  if (!response.ok || !payload.success)
    throw new ReviewRequestError(payload.error || "分析未能完成，请重试。", payload.retryable === true);
  return payload.data as T;
}
export async function recoverBatch(
  batch: PaperQuestion[],
  assess: (qs: PaperQuestion[]) => Promise<QuestionJudgment[]>,
  signal: AbortSignal,
  failed: Set<number>,
): Promise<QuestionJudgment[]> {
  signal.throwIfAborted();
  try {
    return await assess(batch);
  } catch (error) {
    signal.throwIfAborted();
    if (!(error instanceof ReviewRequestError && error.retryable) && !(error instanceof TypeError))
      throw error;
    if (batch.length === 1) {
      failed.add(batch[0].id);
      return [unresolved(batch[0], "模型服务未能完成本题分析。")];
    }
    const mid = Math.ceil(batch.length / 2);
    const first = await recoverBatch(batch.slice(0, mid), assess, signal, failed);
    const second = await recoverBatch(batch.slice(mid), assess, signal, failed);
    return [...first, ...second];
  }
}
async function readPaper(
  file: File,
  selection: Selection,
  signal: AbortSignal,
  status: (s: string) => void,
) {
  const pdfjs = await import("pdfjs-dist");
  const asset = "/api/pdf-assets/";
  pdfjs.GlobalWorkerOptions.workerSrc = asset + "build/pdf.worker.min.mjs?v=" + pdfjs.version;
  const task = pdfjs.getDocument({
    data: await file.arrayBuffer(),
    cMapUrl: asset + "cmaps/",
    cMapPacked: true,
    standardFontDataUrl: asset + "standard_fonts/",
    wasmUrl: asset + "wasm/",
    iccUrl: asset + "iccs/",
    useSystemFonts: true,
  });
  const password = new Promise<never>((_, reject) => {
    task.onPassword = () => reject(new Error("PDF 已加密，请上传解除密码保护的副本。"));
  });
  const cancel = () => {
    void task.destroy();
  };
  signal.addEventListener("abort", cancel, { once: true });
  try {
    signal.throwIfAborted();
    const doc = await Promise.race([task.promise, password]);
    if (doc.numPages > limits.pages) throw new Error(`每份最多 ${limits.pages} 页，请拆分试卷后上传。`);
    const pages: PaperPage[] = [];
    for (let page = 1; page <= doc.numPages; page++) {
      signal.throwIfAborted();
      status(`正在读取第 ${page} / ${doc.numPages} 页`);
      const pdfPage = await doc.getPage(page);
      const native = textLines(
        (await pdfPage.getTextContent()).items,
        pdfPage.getViewport({ scale: 1 }).transform,
      );
      const ops = await pdfPage.getOperatorList();
      const images = ops.fnArray.some((op, i) => {
        if (op === pdfjs.OPS.paintInlineImageXObject || op === pdfjs.OPS.paintImageMaskXObject) return true;
        if (op !== pdfjs.OPS.paintImageXObject) return false;
        const [, width, height] = ops.argsArray[i];
        return width * height >= 2500;
      });
      const visual =
        native.replace(/\s/g, "").length < 40 ||
        native.split("\n").some(hasEmptyFormula) ||
        /如下图|如图|下图|图中|如.{0,16}图所示|积木|见图/.test(native) ||
        images;
      if (visual) {
        status(`正在识别第 ${page} / ${doc.numPages} 页图文`);
        const base = pdfPage.getViewport({ scale: 1 });
        const viewport = pdfPage.getViewport({
          scale: Math.min(2.6, 2100 / Math.max(base.width, base.height)),
        });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await pdfPage.render({ canvas, viewport, background: "#fff" }).promise;
        const image = canvas.toDataURL("image/jpeg", 0.85);
        canvas.width = canvas.height = 0;
        const read = await reviewRequest<Pick<PaperPage, "text" | "issue" | "notice" | "gaps">>(
          { phase: "read", image, native },
          signal,
        );
        pages.push({
          page,
          text: read.text,
          issue: read.issue || undefined,
          notice: read.notice || undefined,
          gaps: read.gaps,
          visual: true,
        });
      } else pages.push({ page, text: native });
      pdfPage.cleanup();
    }
    return pages;
  } finally {
    signal.removeEventListener("abort", cancel);
    await task.destroy();
  }
}
export interface PaperReport {
  selection: Selection;
  fileName: string;
  pages: number;
  notes: string[];
  rows: QuestionJudgment[];
}
export async function reviewFile(
  file: File,
  selection: Selection,
  signal: AbortSignal,
  status: (s: string) => void,
): Promise<PaperReport> {
  const pages = await readPaper(file, selection, signal, status);
  status("正在核对题号、分节与跨页题");
  const { questions, notes } = await reviewRequest<PaperIndex>(
    { phase: "index", selection, pages },
    signal,
  );
  let cursor = 0,
    finished = 0;
  const rows: QuestionJudgment[] = [];
  const failed = new Set<number>();
  const worker = async () => {
    while (cursor < questions.length) {
      const batch = questions.slice(cursor, cursor + limits.batch);
      cursor += batch.length;
      const result = await recoverBatch(
        batch,
        (qs) => reviewRequest<QuestionJudgment[]>({ phase: "assess", selection, questions: qs }, signal),
        signal,
        failed,
      );
      rows.push(...result);
      finished += batch.length;
      status(`已分析 ${finished} / ${questions.length} 题`);
    }
  };
  status(`正在逐题分析，共 ${questions.length} 题`);
  await Promise.all(
    Array.from({ length: Math.min(2, Math.ceil(questions.length / limits.batch)) }, worker),
  );
  if (failed.size === questions.length) throw new Error("模型服务暂时无法完成这份试卷，请稍后重试。");
  if (failed.size)
    notes.push(
      "模型服务未完成的题目：" +
        questions
          .filter((q) => failed.has(q.id))
          .map((q) => q.label)
          .join("、") +
        "。其余题目的分析已保留。",
    );
  return {
    selection,
    fileName: file.name,
    pages: pages.length,
    notes,
    rows: rows.sort((a, b) => a.id - b.id),
  };
}
