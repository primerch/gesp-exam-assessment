import { z } from "zod";
import {
  objectiveAnswer,
  printedPartial,
  type PrintedAnswer,
  type PrintedMarks,
  type ScoringPoint,
} from "./scoring";
import { catalogFor, clauseLabel, type SyllabusEntry } from "../../data/official-syllabus";
import type { PaperQuestion, Selection } from "./document";

export const reportStates = {
  within: "纲内",
  beyond: "超纲",
  invalid: "题设问题",
  insufficient: "依据不足",
} as const;
export type Verdict = keyof typeof reportStates;
export const readingSchema = z.object({
  id: z.number().int(),
  complete: z.boolean(),
  reason: z.string().trim().min(1).max(500),
  difficulty: z.enum(["基础", "综合", "挑战"]),
  answer: z.string().trim().max(12).nullish(),
  resolvedGaps: z
    .array(
      z.object({
        gapPage: z.number().int(),
        page: z.number().int(),
        quote: z.string().trim().min(2).max(400),
        why: z.string().trim().min(2).max(350),
      }),
    )
    .max(64)
    .optional(),
  scoring: z
    .array(
      z.object({
        text: z.string().trim().min(1).max(350),
        page: z.number().int(),
        quote: z.string().trim().min(2).max(400),
        points: z.number().min(0).max(1000).nullable().optional(),
      }),
    )
    .max(8)
    .optional(),
  findings: z
    .array(
      z.object({
        topic: z.string().max(60),
        outsideTitle: z.string().trim().min(2).max(50).optional(),
        nearest: z.string().max(60).optional(),
        role: z.enum(["required", "optional", "mention"]),
        page: z.number().int(),
        quote: z.string().trim().min(1).max(400),
        why: z.string().trim().min(1).max(400),
      }),
    )
    .max(12),
});
export type Reading = z.infer<typeof readingSchema>;
export type Evidence = {
  visual?: boolean;
  entry: SyllabusEntry;
  outsideTitle?: string;
  role: "required" | "optional" | "mention";
  page: number;
  quote: string;
  why: string;
};
export interface QuestionJudgment {
  id: number;
  label: string;
  page: number;
  verdict: Verdict;
  reason: string;
  difficulty: Reading["difficulty"] | null;
  evidence: Evidence[];
  answer?: string;
  answerKey?: PrintedAnswer;
  marks?: PrintedMarks;
  scoring: ScoringPoint[];
}
export function unresolved(q: PaperQuestion, reason: string): QuestionJudgment {
  return {
    id: q.id,
    label: q.label,
    page: q.parts[0].page,
    verdict: "insufficient",
    reason,
    difficulty: null,
    evidence: [],
    marks: q.marks,
    answerKey: q.answerKey,
    scoring: [],
  };
}
const compact = (text: string) =>
  text.replace(/[\u2e80-\u2fdf\uf900-\ufaff]/gu, (ch) => ch.normalize("NFKC")).replace(/\s+/gu, "");
export function gradeReading(q: PaperQuestion, selection: Selection, raw: unknown): QuestionJudgment {
  const parsed = readingSchema.safeParse(raw);
  if (!parsed.success || parsed.data.id !== q.id)
    return unresolved(q, "模型返回的题号或考点格式无法核实。");
  const r = parsed.data;
  const catalog = new Map(catalogFor(selection.level).map((s) => [s.id, s]));
  const prose = (s: string) =>
    s.replace(/\b(?:code|cpp)-[a-z0-9]+(?:\.[a-z0-9]+)?\b/g, (id) => {
      const item = catalog.get(id);
      return item ? `《${item.title}》${clauseLabel(item)}` : id;
    });
  const evidence: Evidence[] = [];
  let ungrounded = false;
  for (const f of r.findings) {
    const outside =
      f.topic === "unlisted" &&
      f.role === "required" &&
      f.outsideTitle &&
      compact(f.quote).includes(compact(f.outsideTitle))
        ? f.outsideTitle
        : undefined;
    const entry = catalog.get(outside ? (f.nearest ?? "") : f.topic);
    const page = q.parts.find((p) => p.page === f.page);
    const quote = compact(f.quote);
    if (
      !entry ||
      (outside && (entry.kind !== "topic" || entry.level > selection.level)) ||
      !page ||
      quote.length < 2 ||
      !compact(page.text).includes(quote)
    ) {
      if (f.role === "required") ungrounded = true;
      continue;
    }
    evidence.push({
      entry,
      outsideTitle: outside,
      role: f.role,
      page: page.page,
      visual: page.visual,
      quote: f.quote,
      why: prose(f.why),
    });
  }
  const scoring: ScoringPoint[] = [];
  for (const step of r.scoring ?? []) {
    const part = q.parts.find((p) => p.page === step.page);
    if (!part || !compact(part.text).includes(compact(step.quote))) continue;
    scoring.push({ ...step, text: prose(step.text), points: printedPartial(step.quote, step.points) });
  }
  // A declared section total is never distributed across steps by inference.
  if (q.marks && scoring.reduce((sum, s) => sum + (s.points ?? 0), 0) > q.marks.points)
    for (const step of scoring) step.points = null;
  const required = evidence.filter((e) => e.role === "required");
  const unverifiedGap = q.parts.find(
    (p) =>
      p.gaps?.length &&
      !r.resolvedGaps?.some(
        (g) =>
          g.gapPage === p.page &&
          q.parts.some((part) => part.page === g.page && compact(part.text).includes(compact(g.quote))),
      ),
  );
  const missing = q.issue ?? q.parts.find((p) => p.issue)?.issue ?? unverifiedGap?.gaps?.[0].note;
  const defect = required.some(({ entry }) => entry.kind === "validity");
  if (missing || (!defect && (!r.complete || ungrounded)) || !required.length) {
    const reason =
      missing ||
      (!r.complete
        ? prose(r.reason)
        : ungrounded
          ? "必要考点没有可定位的题面或大纲依据。"
          : "题面未提供能定位到大纲的必要考点。");
    return { ...unresolved(q, reason), evidence, scoring };
  }
  // A solved explanation and its verified question excerpt still describe the scoring point when a
  // model omitted the separate step or supplied a nonliteral citation for it.
  if (!scoring.length)
    scoring.push({ text: prose(r.reason), page: required[0].page, quote: required[0].quote, points: null });
  let verdict: Verdict = defect ? "invalid" : "within";
  if (
    required.some(
      ({ entry, outsideTitle }) =>
        Boolean(outsideTitle) || entry.kind === "exclusion" || entry.level > selection.level,
    )
  )
    verdict = "beyond";

  return {
    id: q.id,
    label: q.label,
    page: q.parts[0].page,
    verdict,
    reason: prose(r.reason),
    difficulty: r.difficulty,
    answer: objectiveAnswer(r.answer) || undefined,
    evidence,
    marks: q.marks,
    answerKey: q.answerKey,
    scoring,
  };
}
export function hasDefect(j: QuestionJudgment) {
  return (
    j.verdict === "invalid" ||
    (j.verdict === "beyond" && j.evidence.some((e) => e.role === "required" && e.entry.kind === "validity"))
  );
}
function decisiveEvidence(j: QuestionJudgment, level: number) {
  const required = j.evidence.filter((e) => e.role === "required");
  if (j.verdict === "beyond")
    return required.filter(
      ({ entry, outsideTitle }) =>
        Boolean(outsideTitle) || entry.kind === "exclusion" || entry.level > level,
    );
  if (j.verdict === "invalid") return required.filter(({ entry }) => entry.kind === "validity");
  return required;
}
export function agree(a: QuestionJudgment, b: QuestionJudgment, level: number) {
  if (a.verdict === "insufficient" || a.verdict !== b.verdict) return false;
  if (a.verdict === "beyond" && hasDefect(a) !== hasDefect(b)) return false;
  // Independent grounded solutions may choose different elementary operations (e.g. comparison or branch).
  if (a.verdict === "within") return true;
  const ids = new Set(
    decisiveEvidence(a, level).map((e) =>
      e.outsideTitle ? "outside:" + compact(e.outsideTitle) : e.entry.id,
    ),
  );
  const others = new Set(
    decisiveEvidence(b, level).map((e) =>
      e.outsideTitle ? "outside:" + compact(e.outsideTitle) : e.entry.id,
    ),
  );
  return ids.size > 0 && ids.size === others.size && [...ids].every((id) => others.has(id));
}
export function reconcile(
  q: PaperQuestion,
  selection: Selection,
  first: QuestionJudgment,
  second: QuestionJudgment,
  last?: QuestionJudgment,
) {
  const rows = [last, second, first].filter((j): j is QuestionJudgment => !!j);
  const confirmed = rows.filter((j) =>
    rows.some((other) => other !== j && agree(j, other, selection.level)),
  );
  if (confirmed.length) {
    if (q.answerKey) {
      const matchesKey = confirmed.find((j) => j.answer === q.answerKey?.answer);
      if (matchesKey) return matchesKey;
    }
    return (
      confirmed.find(
        (j) => j.answer && confirmed.some((other) => other !== j && other.answer === j.answer),
      ) ?? confirmed[0]
    );
  }
  const limitation = [last, second, first].find((j) => j?.verdict === "insufficient");
  const result = unresolved(
    q,
    limitation?.reason || "模型对必要解法的判断不一致，现有题面与条款无法支持唯一结论。",
  );
  const solution = rows.find(
    (j) =>
      j.scoring.length &&
      j.answer &&
      (j.answer === q.answerKey?.answer || rows.some((other) => other !== j && other.answer === j.answer)),
  );
  return solution ? { ...result, answer: solution.answer, scoring: solution.scoring } : result;
}
