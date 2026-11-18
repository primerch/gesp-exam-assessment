import { z } from "zod";
import { limits, pageSchema, questionSchema, selectionSchema } from "@/app/lib/review/document";
import { assessBatch, indexPaper, models, ServiceError, transcribePage } from "@/app/lib/review/model";
import { revisionDate } from "@/app/data/official-syllabus";
import { legacyReport } from "@/app/lib/review/legacy";

export const runtime = "nodejs";
export const maxDuration = 300;
const bodySchema = z.union([
  z.object({
    phase: z.literal("read"),
    image: z
      .string()
      .max(3400000)
      .regex(/^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/),
    native: z.string().max(40000),
  }),
  z.object({
    phase: z.literal("index"),
    selection: selectionSchema,
    pages: z
      .array(pageSchema)
      .min(1)
      .max(limits.pages)
      .refine(
        (pages) =>
          pages.every((p, i) => p.page === i + 1) &&
          pages.reduce((n, p) => n + p.text.length, 0) <= limits.characters,
      ),
  }),
  z.object({
    phase: z.literal("assess"),
    selection: selectionSchema,
    questions: z
      .array(questionSchema)
      .min(1)
      .max(limits.batch)
      .refine(
        (qs) =>
          new Set(qs.map((q) => q.id)).size === qs.length &&
          qs.reduce((n, q) => n + q.parts.reduce((s, p) => s + p.text.length, 0), 0) <= limits.characters,
      ),
  }),
  z.object({
    phase: z.undefined(),
    pdfBase64: z
      .string()
      .min(1)
      .max(4 * Math.ceil(limits.bytes / 3)),
    examLevel: z.number().int().min(1).max(8),
    studentLevel: z.number().int().min(1).max(4),
    studentLesson: z.number().int().min(1).max(24),
    teacherName: z.string().max(80).default(""),
    studentName: z.string().max(80).default(""),
  }),
]);
export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  try {
    const body = bodySchema.safeParse(await request.json().catch(() => null));
    if (!body.success) throw new ServiceError("试卷数据、大小或语言等级无效，请检查后重试。", 400);
    const v = body.data;
    const signal = AbortSignal.any([request.signal, AbortSignal.timeout(285000)]);
    let data;
    if (v.phase === "read") data = await transcribePage(v.image, v.native, signal);
    else if (v.phase === "index") data = await indexPaper(v.pages, v.selection.language, signal);
    else if (v.phase === "assess") data = await assessBatch(v.questions, v.selection, signal);
    else data = await legacyReport(v.pdfBase64, v.examLevel, v.teacherName, v.studentName, signal);
    return Response.json({ success: true, data }, { headers });
  } catch (err) {
    const known = err instanceof ServiceError;
    const timedOut = err instanceof Error && ["TimeoutError", "AbortError"].includes(err.name);
    return Response.json(
      {
        success: false,
        retryable: timedOut || (known && err.retryable),
        error: known ? err.message : timedOut ? "本次分析超时，请重试。" : "未能完成试卷分析，请稍后重试。",
      },
      { status: known ? err.status : timedOut ? 504 : 500, headers },
    );
  }
}
export function GET() {
  return Response.json({ status: "ok", models, codeSyllabusRevision: revisionDate });
}
