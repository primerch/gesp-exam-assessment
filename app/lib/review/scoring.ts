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
