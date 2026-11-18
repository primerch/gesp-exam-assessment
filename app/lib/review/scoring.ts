import { z } from "zod";
import type { PaperLine, Boundary } from "./document";

export const marksSchema = z.object({
  points: z.number().min(0).max(1000),
  page: z.number().int().positive(),
  quote: z.string().min(1).max(600),
  source: z.enum(["question", "section"]),
});
export type PrintedMarks = z.infer<typeof marksSchema>;
export type ScoringPoint = { text: string; page: number; quote: string; points: number | null };
const perItem = /每(?:小?题|道题?)\s*(?:计|为|各|得|有)?\s*(\d+(?:\.\d+)?)\s*分/;
const totalForQuestion = /本题(?:满分|分值|总分|共计|共|计)\s*(?:为|是)?\s*[:：]?\s*(\d+(?:\.\d+)?)\s*分/;
const inTitle =
  /(?:第\s*\d+\s*题|编程题\s*\d+|^\s*\d+[.、)])\s*[:：]?\s*[（(\[]\s*(?:满分\s*)?(\d+(?:\.\d+)?)\s*分[）)\]]/;
export function marksByStart(lines: PaperLine[], starts: Boundary[], isSection: (s: string) => boolean) {
  let section: PrintedMarks | undefined,
    cursor = 0,
    sectionLine = -3;
  return starts.map((start, i) => {
    while (cursor < start.line) {
      const l = lines[cursor++];
      if (isSection(l.text)) {
        section = undefined;
        sectionLine = cursor - 1;
      }
      if (cursor - 1 === sectionLine || cursor - 1 === sectionLine + 1) {
        const n = l.text.normalize("NFKC").match(perItem)?.[1];
        if (n)
          section = {
            points: Number(n),
            page: l.page,
            quote: l.text.trim().slice(0, 600),
            source: "section",
          };
      }
    }
    const end = starts[i + 1]?.line ?? lines.length;
    for (let j = start.line; j < end; j++) {
      const l = lines[j];
      if (j > start.line && isSection(l.text)) break;
      const normalized = l.text.normalize("NFKC").trim();
      const n =
        normalized.match(totalForQuestion)?.[1] ??
        (j === start.line ? normalized.match(inTitle)?.[1] : undefined);
      if (n)
        return {
          points: Number(n),
          page: l.page,
          quote: l.text.trim().slice(0, 600),
          source: "question",
        } satisfies PrintedMarks;
    }
    return section;
  });
}
export function printedPartial(quote: string, candidate: number | null | undefined) {
  if (candidate == null || !Number.isFinite(candidate) || candidate < 0) return null;
  const text = quote.normalize("NFKC");
  if (
    !/得\s*\d|给\s*\d|计\s*\d|占\s*\d|奖励\s*\d|测试点|子任务|满分条件/.test(text) ||
    /本题(?:共|满分|总分)|每(?:小?题|道)/.test(text)
  )
    return null;
  const values = [...text.matchAll(/(\d+(?:\.\d+)?)\s*分/g)].map((m) => Number(m[1]));
  return values.length === 1 && values[0] === candidate ? candidate : null;
}

export const answerKeySchema = z.object({
  answer: z.string().min(1).max(8),
  page: z.number().int().positive(),
  quote: z.string().min(1).max(1000),
});
export type PrintedAnswer = z.infer<typeof answerKeySchema>;

const objectiveGroup = (name: string) =>
  /^(单选题|单项选择题|选择题)$/.test(name) ? "单选" : name === "判断题" ? "判断" : "";
export function objectiveAnswer(value: string | null | undefined) {
  const s = value?.normalize("NFKC").trim().toUpperCase() ?? "";
  if (/^[A-H]$/.test(s)) return s;
  if (/^(?:正确|对|是|√|✓|✔|TRUE)$/.test(s)) return "正确";
  if (/^(?:错误|错|否|×|✗|✘|FALSE)$/.test(s)) return "错误";
  return "";
}
export const blankAnswerRow = /^\s*(?:参\s*考\s*)?答\s*案\s*[:：]?\s*$/;
export function printedQuestionNumbers(line: string) {
  const header = line
    .normalize("NFKC")
    .trim()
    .match(/^题\s*号\s*[:：]?\s*(\d+(?:[\s、,]+\d+)*)$/);
  if (!header) return undefined;
  const numbers = header[1].match(/\d+/g)!.map(Number);
  return new Set(numbers).size === numbers.length ? numbers : undefined;
}
/** Only join explicit question-number / answer rows in an identifiable objective section. */
export function answerKeysByStart(
  lines: PaperLine[],
  starts: Boundary[],
  sectionOf: (s: string) => string | undefined,
) {
  const keys = new Map<string, PrintedAnswer | null>();
  let group = "";
  for (let i = 0; i + 1 < lines.length; i++) {
    const line = lines[i].text.normalize("NFKC").trim();
    const heading = sectionOf(line);
    if (heading !== undefined) group = objectiveGroup(heading);
    if (!group) continue;
    const numbers = printedQuestionNumbers(line);
    const next = lines[i + 1];
    const row = next.text
      .normalize("NFKC")
      .trim()
      .match(/^(?:参\s*考\s*)?答\s*案\s*[:：]?\s*(.+)$/);
    if (!numbers || !row || lines[i].page !== next.page) continue;
    const compact = row[1].replace(/[\s、,]/g, "");
    const entries = compact.match(group === "单选" ? /[A-H]/gi : /正确|错误|[对错√✓✔×✗✘]/g) ?? [];
    if (entries.join("") !== compact || entries.length !== numbers.length) continue;
    for (const [j, n] of numbers.entries()) {
      const id = group + n,
        answer = objectiveAnswer(entries[j]);
      const key = {
        answer,
        page: next.page,
        quote: (lines[i].text.trim() + "\n" + next.text.trim()).slice(0, 1000),
      };
      keys.set(id, keys.has(id) && keys.get(id)?.answer !== answer ? null : key);
    }
  }
  return starts.map((s) => {
    const m = s.label.match(/^(.+?)\s*·\s*第\s*(\d+)\s*题$/);
    return m ? (keys.get(objectiveGroup(m[1].trim()) + Number(m[2])) ?? undefined) : undefined;
  });
}

/** Printed output requirements remain usable even when the problem's syllabus classification is inconclusive. */
export function printedOutputRequirements(
  parts: { page: number; text: string; issue?: string }[],
): ScoringPoint[] {
  const rows: ScoringPoint[] = [];
  let inOutput = false;
  for (const part of parts) {
    const lines = part.text.split(/\r?\n/);
    for (const line of lines) {
      const t = line.trim(),
        heading = t.normalize("NFKC").replace(/^(?:\d+\.)*\d+\s+/, "");
      if (/^(?:输出格式|输出要求|输出描述)\s*[:：]?$/.test(heading)) {
        inOutput = true;
        continue;
      }
      if (!inOutput) continue;
      if (
        /^(?:输入|输出)?样例|^(?:输入格式|题目描述|参考程序|数据范围|评分标准|测试说明|子任务|提示)(?:\s|[:：]|$)/.test(
          heading,
        )
      ) {
        inOutput = false;
        continue;
      }
      if (part.issue || !t || /^\d+\s*\/\s*\d+$/.test(t) || t.length > 400 || rows.length >= 6) continue;
      rows.push({ text: "卷面输出要求 · " + t, page: part.page, quote: t, points: null });
    }
  }
  return rows;
}
