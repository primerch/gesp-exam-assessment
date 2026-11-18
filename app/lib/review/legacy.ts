import PDFParser from "pdf2json";
import { limits, type PaperPage } from "./document";
import { assessBatch, indexPaper, ServiceError } from "./model";
import { languageNames, levelNames } from "../../data/official-syllabus";
import { type QuestionJudgment } from "./judgment";

async function textPages(buffer: Buffer): Promise<PaperPage[]> {
  const parser = new PDFParser();
  return new Promise((resolve, reject) => {
    parser.on("pdfParser_dataError", () =>
      reject(new ServiceError("无法读取 PDF，请检查文件是否损坏或加密。", 422)),
    );
    parser.on("pdfParser_dataReady", (pdf) => {
      try {
        if (pdf.Pages.length > limits.pages) throw new ServiceError("页数超过单份上限，请拆分试卷。", 422);
        const pages = pdf.Pages.map((p, i) => {
          let text = "",
            lastY: number | undefined;
          for (const t of p.Texts) {
            const value = t.R.map((r) => decodeURIComponent(r.T)).join("");
            text += (lastY !== undefined && Math.abs(t.y - lastY) > 0.15 ? "\n" : " ") + value;
            lastY = t.y;
          }
          return { page: i + 1, text: text.trim() };
        });
        resolve(pages);
      } catch {
        reject(new ServiceError("PDF 内容不能完整读取，请在新版上传页重新打开。", 422));
      }
    });
    parser.parseBuffer(buffer);
  });
}
export async function legacyReport(
  pdfBase64: string,
  level: number,
  teacherName: string,
  studentName: string,
  signal: AbortSignal,
) {
  const buf = Buffer.from(pdfBase64, "base64");
  if (!buf.length || buf.length > limits.bytes || buf.subarray(0, 5).toString() !== "%PDF-")
    throw new ServiceError("请上传 10 MB 以内的 PDF。", 400);
  const pages = await textPages(buf);
  if (pages.some((p) => !p.text || /如图|下图|图中|如下图/.test(p.text)))
    throw new ServiceError("这份试卷包含图示或扫描页，请刷新上传页以使用图文识别。", 422);
  if (pages.reduce((sum, p) => sum + p.text.length, 0) > limits.characters)
    throw new ServiceError("试卷文字超过处理上限，请分卷上传。", 422);
  const index = await indexPaper(pages, "cpp", signal);
  const rows: QuestionJudgment[] = [];
  for (let i = 0; i < index.questions.length; i += limits.batch) {
    rows.push(
      ...(await assessBatch(
        index.questions.slice(i, i + limits.batch),
        { language: "cpp", level },
        signal,
      )),
    );
  }
  if (index.notes.length || rows.some((r) => ["insufficient", "invalid"].includes(r.verdict))) {
    throw new ServiceError("本卷含题设或证据问题。请刷新后查看逐题报告。", 422);
  }
  const beyond = rows.filter((r) => r.verdict === "beyond");
  if (rows.some((r) => r.evidence.some((e) => e.outsideTitle)))
    throw new ServiceError("试卷包含八级大纲未列的必要考点，请刷新后查看完整依据。", 422);
  const score = Math.round(
    rows.reduce((n, r) => n + { 基础: 3, 综合: 6, 挑战: 9 }[r.difficulty || "基础"], 0) / rows.length,
  );
  const summary = `${languageNames.cpp} ${levelNames[level]}，共 ${rows.length} 题，${beyond.length} 题超纲。`;
  const isBeyond = (e: QuestionJudgment["evidence"][number]) =>
    e.role === "required" && (e.entry.kind === "exclusion" || e.entry.level > level);
  return {
    difficultyScore: score,
    isBeyondSyllabus: beyond.length > 0,
    summary,
    confidence: 1,
    teacherName,
    studentName,
    parentFeedback:
      (teacherName ? `你好，我是${teacherName}老师。\n` : "") +
      summary +
      "\n" +
      rows.map((r) => r.label + " · " + r.reason).join("\n"),
    beyondPoints: beyond.flatMap((r) =>
      r.evidence
        .filter(isBeyond)
        .map((e) => ({
          name: e.entry.title,
          gespLevel: e.entry.level,
          reason: e.why,
          questionNumbers: [r.id],
        })),
    ),
    questions: rows.map((r) => ({
      number: r.id,
      type: r.label.split(" · ")[0],
      content: r.reason,
      isBeyond: r.verdict === "beyond",
      knowledgePoints: r.evidence.map((e) => ({
        name: e.entry.title,
        category: "官方大纲",
        estimatedLevel: e.entry.level,
        confidence: 1,
      })),
      beyondPoints: r.evidence
        .filter(isBeyond)
        .map((e) => ({ name: e.entry.title, actualLevel: e.entry.level })),
    })),
    quality: { score: 100, isReliable: true, issues: [] },
  };
}
