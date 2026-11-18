import { z } from "zod";
import { catalogFor, type SyllabusEntry } from "../../data/official-syllabus";
import type { PaperQuestion, Selection } from "./document";

export const reportStates = {
  within: "纲内", beyond: "超纲", invalid: "题设问题", insufficient: "依据不足",
} as const;
export type Verdict = keyof typeof reportStates;
export const readingSchema = z.object({
  id: z.number().int(),
  complete: z.boolean(),
  reason: z.string().trim().min(1).max(500),
  difficulty: z.enum(["基础", "综合", "挑战"]),
  findings: z.array(z.object({
    topic: z.string().max(60),
    role: z.enum(["required", "optional", "mention"]),
    page: z.number().int(),
    quote: z.string().trim().min(1).max(400),
    why: z.string().trim().min(1).max(400),
  })).max(12),
});
export type Reading = z.infer<typeof readingSchema>;
export type Evidence = { entry: SyllabusEntry; role: "required" | "optional" | "mention"; page: number; quote: string; why: string };
export interface QuestionJudgment {
  id: number; label: string; page: number; verdict: Verdict; reason: string;
  difficulty: Reading["difficulty"] | null; evidence: Evidence[];
}
export function unresolved(q: PaperQuestion, reason: string): QuestionJudgment {
  return { id: q.id, label: q.label, page: q.parts[0].page, verdict: "insufficient", reason, difficulty: null, evidence: [] };
}
const compact = (text: string) => text.replace(/\s+/gu, "");
export function gradeReading(q: PaperQuestion, selection: Selection, raw: unknown): QuestionJudgment {
  const parsed = readingSchema.safeParse(raw);
  if (!parsed.success || parsed.data.id !== q.id) return unresolved(q, "模型返回的题号或考点格式无法核实。");
  const r = parsed.data;
  const catalog = new Map(catalogFor(selection.language, selection.level).map((s) => [s.id, s]));
  const evidence: Evidence[] = [];
  let ungrounded = false;
  for (const f of r.findings) {
    const entry = catalog.get(f.topic);
    const page = q.parts.find((p) => p.page === f.page);
    const quote = compact(f.quote);
    if (!entry || !page || quote.length < 2 || !compact(page.text).includes(quote)) {
      if (f.role === "required") ungrounded = true;
      continue;
    }
    evidence.push({ entry, role: f.role, page: page.page, quote: f.quote, why: f.why });
  }
  const required = evidence.filter((e) => e.role === "required");
  const missing = q.issue ?? q.parts.find((p) => p.issue)?.issue;
  if (missing || !r.complete || ungrounded || !required.length) {
    const reason = missing || (!r.complete ? r.reason : ungrounded ? "必要考点没有可定位的题面或大纲依据。" : "题面未提供能定位到大纲的必要考点。");
    return { ...unresolved(q, reason), evidence };
  }
  let verdict: Verdict = "within";
  if (required.some(({entry}) => entry.kind === "exclusion" || entry.level > selection.level)) verdict = "beyond";
  if (required.some(({entry}) => entry.kind === "validity")) verdict = "invalid";
  return { id: q.id, label: q.label, page: q.parts[0].page, verdict, reason: r.reason, difficulty: r.difficulty, evidence };
}
function decisiveEvidence(j: QuestionJudgment, level: number) {
  const required = j.evidence.filter((e) => e.role === "required");
  if (j.verdict === "beyond") return required.filter(({entry}) => entry.kind === "exclusion" || entry.level > level);
  if (j.verdict === "invalid") return required.filter(({entry}) => entry.kind === "validity");
  return required;
}
export function agree(a: QuestionJudgment, b: QuestionJudgment, level: number) {
  if (a.verdict === "insufficient" || a.verdict !== b.verdict) return false;
  const ids = new Set(decisiveEvidence(a, level).map((e) => e.entry.id));
  const others = new Set(decisiveEvidence(b, level).map((e) => e.entry.id));
  return ids.size > 0 && ids.size === others.size && [...ids].every((id) => others.has(id));
}
export function reconcile(q: PaperQuestion, selection: Selection, first: QuestionJudgment, second: QuestionJudgment, last?: QuestionJudgment) {
  if (agree(first, second, selection.level)) return second;
  if (last && (agree(first, last, selection.level) || agree(second, last, selection.level))) return last;
  const limitation = [last, second, first].find((j) => j?.verdict === "insufficient");
  return unresolved(q, limitation?.reason || "模型对必要解法的判断不一致，现有题面与条款无法支持唯一结论。");
}
