import { z } from "zod";
import { levelsFor, type Language } from "../../data/official-syllabus";

export const limits = { bytes: 10 * 1024 * 1024, pages: 64, characters: 240000, questions: 100, batch: 4 };
export const selectionSchema = z.object({
  language: z.enum(["cpp", "python", "blocks"]),
  level: z.number().int(),
}).refine((s) => levelsFor(s.language).includes(s.level), "此语言没有该等级");
export type Selection = { language: Language; level: number };
export const pageSchema = z.object({
  page: z.number().int().min(1).max(limits.pages),
  text: z.string().max(40000),
  issue: z.string().max(300).optional(),
  visual: z.boolean().optional(),
});
export type PaperPage = z.infer<typeof pageSchema>;
export const questionSchema = z.object({
  id: z.number().int().min(1).max(limits.questions),
  label: z.string().min(1).max(100),
  parts: z.array(pageSchema).min(1).max(limits.pages),
  issue: z.string().max(300).optional(),
});
export type PaperQuestion = z.infer<typeof questionSchema>;
export interface PaperIndex { questions: PaperQuestion[]; notes: string[] }
export type PaperLine = { page: number; text: string };
export type Boundary = { line: number; label: string };

export function linesOf(pages: PaperPage[]): PaperLine[] {
  return pages.flatMap(({ page, text }) => text.split(/\r?\n/).map((line) => line.trim())
    .filter(Boolean).map((line) => ({ page, text: line })));
}
export function locateBoundaries(lines: PaperLine[]) {
  const found: Boundary[] = [];
  let section = "";
  for (const [i, line] of lines.entries()) {
    const t = line.text.normalize("NFKC").trim();
    const sectionTitle = t.match(/^(?:[一二三四五六七八九十\d]+\s*[、.)]?\s*)?(单项选择题|单选题|选择题|判断题|填空题|程序阅读题|编程题)(?:\s*[（(].*|\s*)$/);
    if (sectionTitle) { section = sectionTitle[1]; continue; }
    const program = t.match(/^(?:\d+\.\d+\s*)?编程题\s*([一二三四五六七八九十\d]+)(?:\s|[：:、.]|$)/);
    const numbered = t.match(/^(?:第\s*(\d{1,3})\s*题|(?:Q(?:uestion)?\s*)(\d{1,3})(?=\s|[.:、]))/i);
    // Dotted section numbers (3.1.2), line numbers in code and decimal literals are not questions.
    const simple = t.match(/^(\d{1,3})\s*[.、)](?![\d.])\s*(?=\S)/);
    const number = program?.[1] ?? numbered?.[1] ?? numbered?.[2] ?? simple?.[1];
    if (number) found.push({ line: i, label: `${program ? "编程题" : section || "试题"} · 第 ${number} 题` });
  }
  return found;
}

export function buildIndex(pages: PaperPage[], lines: PaperLine[], starts: Boundary[], notes: string[] = []): PaperIndex {
  if (!starts.length) throw new Error("没有识别到可分析的题目。请上传含完整题干的试卷。");
  if (starts.length > limits.questions) throw new Error(`单份支持 ${limits.questions} 道题，请分卷上传。`);
  const byPage = new Map(pages.map((page) => [page.page, page]));
  const questions = starts.map((start, index) => {
    const end = starts[index + 1]?.line ?? lines.length;
    const parts: PaperPage[] = [];
    for (const line of lines.slice(start.line, end)) {
      const previous = parts.at(-1);
      if (previous?.page === line.page) previous.text += "\n" + line.text;
      else parts.push({ ...byPage.get(line.page)!, text: line.text });
    }
    return { id: index + 1, label: start.label, parts };
  });
  for (const p of pages) {
    if (p.issue) notes.push(`第 ${p.page} 页 · ${p.issue}`);
  }
  return { questions, notes: [...new Set(notes)] };
}
