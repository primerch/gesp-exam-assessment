"use client";
import { useState } from "react";
import { ArrowUpRight, ChevronDown, Copy, FileText, Printer } from "lucide-react";
import {
  clauseLabel,
  languageNames,
  levelNames,
  revisionDate,
  sourceLink,
} from "../data/official-syllabus";
import { hasDefect, reportStates, type QuestionJudgment, type Verdict } from "../lib/review/judgment";
import type { PaperReport } from "../lib/review/pdf-client";
import { secondary, sourceStyle } from "./review-styles";
export interface ReportContext {
  teacher: string;
  student: string;
  course: string;
}
const colors: Record<Verdict, string> = {
  within: "text-brand",
  beyond: "text-current-text",
  invalid: "text-destructive",
  insufficient: "text-muted",
};
const roles = { required: "必要考点", optional: "可选解法", mention: "题面提及" };
const states = ["within", "beyond", "invalid", "insufficient"] as const;
function Row({
  row,
  initiallyOpen,
  fileUrl,
}: {
  row: QuestionJudgment;
  initiallyOpen: boolean;
  fileUrl: string;
}) {
  return (
    <details open={initiallyOpen} className="group border-b border-line last:border-b-0">
      <summary className="flex min-h-14 cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 py-3 hover:bg-quiet">
        <span className="min-w-28 font-medium">{row.label}</span>
        <span className="min-w-0 flex-1 text-sm text-muted">
          {row.evidence.find((e) => e.role === "required")?.outsideTitle ??
            row.evidence.find((e) => e.role === "required")?.entry.title ??
            "判定依据"}
        </span>
        <span className="text-xs tabular-nums text-muted">
          {row.marks ? row.marks.points + " 分" : "分值未注明"}
        </span>
        <span className={`text-sm font-semibold ${colors[row.verdict]}`}>
          {reportStates[row.verdict]}
          {row.verdict === "beyond" && hasDefect(row) ? " · 题设问题" : ""}
        </span>
        <ChevronDown className="text-muted group-open:rotate-180" size={15} aria-hidden />
      </summary>
      <div className="space-y-4 pb-6">
        <p className="max-w-4xl text-sm leading-7">{row.reason}</p>
        <div>
          <h4 className="mb-2 font-semibold">得分要点</h4>
          {row.marks && (
            <p className="mb-2 text-sm text-muted">
              本题 {row.marks.points} 分 · {row.marks.source === "section" ? "分节说明" : "题面标注"}{" "}
              <a
                className={sourceStyle}
                href={fileUrl + "#page=" + row.marks.page}
                target="_blank"
                rel="noreferrer"
              >
                第 {row.marks.page} 页 ↗
              </a>
              　{row.marks.quote}
            </p>
          )}
          {row.answerKey && (
            <p className="mb-2 text-sm">
              卷面答案 <strong>{row.answerKey.answer}</strong>{" "}
              <a
                className={sourceStyle}
                href={fileUrl + "#page=" + row.answerKey.page}
                target="_blank"
                rel="noreferrer"
              >
                答案表第 {row.answerKey.page} 页 ↗
              </a>
              {row.answer && row.answer !== row.answerKey.answer && (
                <span className="ml-2 font-medium text-current-text">
                  模型解得 {row.answer}，与卷面答案有出入。
                </span>
              )}
            </p>
          )}
          {row.scoring.length ? (
            <ul className="list-disc space-y-2 pl-5 text-sm leading-6">
              {row.scoring.map((s, i) => (
                <li key={i}>
                  {s.text}
                  {s.points != null && <strong>（卷面注明 {s.points} 分）</strong>}{" "}
                  <a
                    className="text-brand hover:underline"
                    href={fileUrl + "#page=" + s.page}
                    target="_blank"
                    rel="noreferrer"
                  >
                    第 {s.page} 页 ↗
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">
              {row.verdict === "insufficient"
                ? "现有题面不足以还原具体作答要求。"
                : row.evidence
                    .filter((e) => e.role === "required")
                    .map((e) => e.why)
                    .join(" ")}
            </p>
          )}
        </div>
        {row.evidence.map((e, i) => (
          <div key={i} className="rounded-md bg-quiet px-4 py-3 text-sm">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <strong className="font-semibold">{e.outsideTitle ?? e.entry.title}</strong>
              <span className="text-xs text-muted">
                {roles[e.role]}
                {e.outsideTitle
                  ? " · 一至八级未列"
                  : e.entry.level > 0 && " · " + levelNames[e.entry.level]}
              </span>
            </div>
            <blockquote className="mt-2 whitespace-pre-wrap break-words leading-6">“{e.quote}”</blockquote>
            <p className="mt-1.5 leading-6 text-muted">{e.why}</p>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
              <a
                className={sourceStyle}
                href={fileUrl + "#page=" + e.page}
                target="_blank"
                rel="noreferrer"
              >
                {e.visual ? "图文识别页" : "试卷原文"} · 第 {e.page} 页 <ArrowUpRight size={13} />
              </a>
              <a className={sourceStyle} href={sourceLink(e.entry)} target="_blank" rel="noreferrer">
                {e.outsideTitle ? "对照条款" : "大纲"}第 {e.entry.page} 页 · {clauseLabel(e.entry)}{" "}
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        ))}
        {!row.evidence.length && (
          <a className={sourceStyle} href={fileUrl + "#page=" + row.page} target="_blank" rel="noreferrer">
            打开试卷第 {row.page} 页 <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </details>
  );
}
export default function ExamAnalysisResult({
  report,
  context,
  fileUrl,
}: {
  report: PaperReport;
  context: ReportContext;
  fileUrl: string;
}) {
  const [filter, setFilter] = useState<Verdict | "all">("all");
  const [copyStatus, setCopyStatus] = useState("");
  const counts = Object.fromEntries(
    states.map((v) => [
      v,
      report.rows.filter((q) => (v === "invalid" ? hasDefect(q) : q.verdict === v)).length,
    ]),
  ) as Record<Verdict, number>;
  const { language, level } = report.selection;
  const scored = report.rows.filter((r) => r.marks != null);
  const total = scored.reduce((sum, r) => sum + r.marks!.points, 0);
  const scoredBeyond = scored
    .filter((r) => r.verdict === "beyond")
    .reduce((sum, r) => sum + r.marks!.points, 0);
  const bySection = new Map<string, { count: number; marked: number; sum: number }>();
  const topics = new Map<string, number>();
  for (const row of report.rows) {
    const label = row.label.split(" · ")[0],
      group = bySection.get(label) ?? { count: 0, marked: 0, sum: 0 };
    group.count++;
    if (row.marks) {
      group.marked++;
      group.sum += row.marks.points;
    }
    bySection.set(label, group);
    for (const name of new Set(
      row.evidence
        .filter((e) => e.role === "required" && e.entry.kind === "topic")
        .map((e) => e.outsideTitle ?? e.entry.title),
    ))
      topics.set(name, (topics.get(name) ?? 0) + 1);
  }
  const targets = [
    ...new Set(
      report.rows.flatMap((r) =>
        r.evidence
          .filter((e) => e.role === "required" && e.entry.kind === "topic")
          .map((e) => e.outsideTitle ?? e.entry.title),
      ),
    ),
  ];
  const summary = states
    .filter((s) => counts[s] > 0)
    .map((s) => `${counts[s]} 题${reportStates[s]}`)
    .join("，");
  const advice =
    counts.invalid || counts.beyond
      ? "练习时可优先选用纲内试题，把超出范围或存在题设问题的题目单独处理。"
      : targets.length
        ? "复习时可以先独立完成相应题目，再回到下面的条款核对解题方法。"
        : "现有材料不足以推荐练习题。";
  const feedback = [
    context.teacher && `你好，我是${context.teacher}老师。`,
    `${context.student ? context.student + "的练习卷" : "这份试卷"}按 ${languageNames[language]} ${levelNames[level]}分析，共 ${report.rows.length} 题，${summary}。`,
    context.course && "当前课程进度为" + context.course + "。",
    targets.length && "主要考点包括" + targets.slice(0, 6).join("、") + "。",
    advice,
  ]
    .filter(Boolean)
    .join("");
  const firstFlag = report.rows.find((q) => q.verdict !== "within")?.id ?? report.rows[0]?.id;
  const visible = report.rows.filter(
    (r) => filter === "all" || (filter === "invalid" ? hasDefect(r) : r.verdict === filter),
  );
  return (
    <section
      id="paper-report"
      aria-labelledby="report-title"
      tabIndex={-1}
      className="scroll-mt-5 rounded-2xl border border-line bg-surface px-5 py-7 sm:px-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="report-title" className="text-2xl font-semibold">
            试卷分析报告
          </h2>
          <p className="mt-2 flex items-center gap-2 break-all text-sm text-muted">
            <FileText size={15} className="shrink-0" />
            {report.fileName}
          </p>
        </div>
        <button className={secondary + " print:hidden"} onClick={() => window.print()}>
          <Printer size={16} />
          打印报告
        </button>
      </div>
      <p className="mt-5 text-sm text-muted">
        {languageNames[language]} {levelNames[level]} · {report.pages} 页 · 已识别 {report.rows.length} 题 ·
        大纲修订 {revisionDate}
      </p>
      <div className="mt-3 grid grid-cols-2 divide-x divide-line border-y border-line sm:grid-cols-4">
        {states.map((v) => (
          <div className="px-3 py-4 first:pl-0" key={v}>
            <div className={`font-mono text-3xl font-medium tabular-nums ${colors[v]}`}>{counts[v]}</div>
            <div className="mt-1 text-sm text-muted">{reportStates[v]}</div>
          </div>
        ))}
      </div>
      {report.notes.length > 0 && (
        <div className="mt-4 rounded-md bg-quiet p-4">
          <h3 className="text-sm font-semibold">卷面说明</h3>
          {report.notes.map((n) => (
            <p key={n} className="mt-1 text-sm text-muted">
              {n}
            </p>
          ))}
        </div>
      )}
      <section className="mt-6 border-b border-line pb-5">
        {report.rows.some((r) => r.verdict === "beyond" && hasDefect(r)) && (
          <p className="mb-2 text-sm text-muted">同一道题可以同时超纲并存在题设问题。</p>
        )}
        <h3 className="text-lg font-semibold">分值与考点分布</h3>
        <p className="mt-2 text-sm leading-7">
          {scored.length === report.rows.length
            ? `卷面总分 ${total} 分，已判定超纲 ${scoredBeyond} 分。`
            : scored.length
              ? `已识别 ${scored.length} 题的分值，合计 ${total} 分，另有 ${report.rows.length - scored.length} 题未注明分值。`
              : "卷面未注明分值。以下按题数统计，各题的作答要点可在下方展开。"}
        </p>
        {counts.insufficient > 0 && (
          <p className="mt-1 text-sm text-muted">
            另有 {counts.insufficient} 题的范围依据不足，已注明的分值合计{" "}
            {scored
              .filter((r) => r.verdict === "insufficient")
              .reduce((sum, r) => sum + r.marks!.points, 0)}{" "}
            分。
          </p>
        )}
        <p className="mt-1 text-sm text-muted">
          分值取自卷面，作答要点由模型结合题意提炼。分步给分仅在试卷有明确说明时显示。
        </p>

        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
          {[...bySection].map(([name, g]) => (
            <li key={name}>
              {name} {g.count} 题
              {g.marked === g.count ? ` · ${g.sum} 分` : g.marked ? ` · 已知 ${g.sum} 分` : ""}
            </li>
          ))}
        </ul>
        {topics.size > 0 && (
          <details className="mt-3 text-sm">
            <summary className="inline-flex min-h-10 cursor-pointer items-center gap-2 font-medium text-brand">
              查看 {topics.size} 个必要考点 <ChevronDown size={14} />
            </summary>
            <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
              {[...topics]
                .sort((a, b) => b[1] - a[1])
                .map(([name, n]) => (
                  <li key={name} className="flex justify-between border-b border-line pb-1">
                    <span>{name}</span>
                    <span className="text-muted">{n} 题</span>
                  </li>
                ))}
            </ul>
          </details>
        )}
      </section>
      <h3 className="mt-7 mb-3 text-lg font-semibold">逐题依据</h3>
      <div className="mb-2 flex flex-wrap gap-1 print:hidden">
        {(["all", ...states] as const).map((s) => (
          <button
            key={s}
            aria-pressed={filter === s}
            className={`min-h-10 rounded px-3 text-sm ${filter === s ? "bg-wash font-semibold text-brand" : "text-muted hover:bg-quiet"}`}
            onClick={() => setFilter(s)}
          >
            {s === "all" ? "全部" : reportStates[s]}
          </button>
        ))}
      </div>
      <div className="print:hidden">
        {visible.length ? (
          visible.map((r) => (
            <Row key={r.id} row={r} fileUrl={fileUrl} initiallyOpen={r.id === firstFlag} />
          ))
        ) : (
          <p className="py-6 text-sm text-muted">本卷没有这一类判定。</p>
        )}
      </div>
      <div className="hidden print:block">
        {report.rows.map((r) => (
          <Row key={r.id} row={r} fileUrl={fileUrl} initiallyOpen />
        ))}
      </div>
      <section className="mt-7 border-t border-line pt-5">
        <h3 className="text-lg font-semibold">
          教学反馈
          {context.teacher && (
            <span className="ml-3 text-sm font-normal text-muted">署名 {context.teacher}</span>
          )}
        </h3>
        <p className="mt-2 max-w-4xl text-sm leading-7">{feedback}</p>
        <button
          className={secondary + " mt-3 print:hidden"}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(feedback);
              setCopyStatus("已复制教学反馈");
            } catch {
              setCopyStatus("浏览器未开放剪贴板，可选中反馈文字复制。");
            }
          }}
        >
          <Copy size={15} />
          复制反馈
        </button>
        <span role="status" className="ml-3 text-sm text-muted">
          {copyStatus}
        </span>
      </section>
    </section>
  );
}
