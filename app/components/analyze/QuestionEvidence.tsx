"use client";

import { ArrowUpRight, ChevronDown, Maximize2, X } from "lucide-react";
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "@/app/components/motion";
import { clauseLabel, levelNames, sourceLink } from "../../data/official-syllabus";
import { hasDefect, reportStates, type QuestionJudgment, type Verdict } from "../../lib/review/judgment";
import { secondary, sourceStyle } from "../review-styles";

const colors: Record<Verdict, string> = {
  within: "text-brand",
  beyond: "text-current-text",
  invalid: "text-destructive",
  insufficient: "text-muted",
};
const roles = { required: "必要考点", optional: "可选解法", mention: "题面提及" };

function EvidenceBody({ row, fileUrl }: { row: QuestionJudgment; fileUrl: string }) {
  return (
    <div className="space-y-4">
      <p className="max-w-4xl text-sm leading-7">{row.reason}</p>
      <div>
        <h4 className="mb-2 text-sm font-medium">得分要点</h4>
        {row.marks && (
          <p className="mb-2 text-sm leading-6 text-muted">
            本题 {row.marks.points} 分 · {row.marks.source === "section" ? "分节说明" : "题面标注"}{" "}
            <a className={sourceStyle} href={`${fileUrl}#page=${row.marks.page}`} target="_blank" rel="noreferrer">第 {row.marks.page} 页 ↗</a>
            {"　"}{row.marks.quote}
          </p>
        )}
        {row.answerKey && (
          <p className="mb-2 text-sm leading-6">
            卷面答案 <strong>{row.answerKey.answer}</strong>{" "}
            <a className={sourceStyle} href={`${fileUrl}#page=${row.answerKey.page}`} target="_blank" rel="noreferrer">答案表第 {row.answerKey.page} 页 ↗</a>
            {row.answer && row.answer !== row.answerKey.answer && <span className="ml-2 font-medium text-current-text">模型解得 {row.answer}，与卷面答案有出入。</span>}
          </p>
        )}
        {row.scoring.length ? (
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6">
            {row.scoring.map((score, index) => (
              <li key={index}>
                {score.text}
                {score.points != null && <strong>（卷面注明 {score.points} 分）</strong>}{" "}
                <a className="text-brand hover:underline" href={`${fileUrl}#page=${score.page}`} target="_blank" rel="noreferrer">第 {score.page} 页 ↗</a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm leading-6 text-muted">
            {row.verdict === "insufficient" ? "现有题面不足以还原具体作答要求。" : row.evidence.filter((item) => item.role === "required").map((item) => item.why).join(" ")}
          </p>
        )}
      </div>
      {row.evidence.map((item, index) => (
        <div key={index} className="rounded-lg bg-quiet px-4 py-3 text-sm">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <strong className="font-medium">{item.outsideTitle ?? item.entry.title}</strong>
            <span className="text-xs text-muted">
              {roles[item.role]}
              {item.outsideTitle ? " · 一至八级未列" : item.entry.level > 0 && ` · ${levelNames[item.entry.level]}`}
            </span>
          </div>
          <blockquote className="mt-2 whitespace-pre-wrap break-words leading-6">“{item.quote}”</blockquote>
          <p className="mt-1.5 leading-6 text-muted">{item.why}</p>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
            <a className={sourceStyle} href={`${fileUrl}#page=${item.page}`} target="_blank" rel="noreferrer">
              {item.visual ? "图文识别页" : "试卷原文"} · 第 {item.page} 页 <ArrowUpRight size={13} aria-hidden />
            </a>
            <a className={sourceStyle} href={sourceLink(item.entry)} target="_blank" rel="noreferrer">
              {item.outsideTitle ? "对照条款" : "大纲"}第 {item.entry.page} 页 · {clauseLabel(item.entry)} <ArrowUpRight size={13} aria-hidden />
            </a>
          </div>
        </div>
      ))}
      {!row.evidence.length && (
        <a className={sourceStyle} href={`${fileUrl}#page=${row.page}`} target="_blank" rel="noreferrer">打开试卷第 {row.page} 页 <ArrowUpRight size={14} aria-hidden /></a>
      )}
    </div>
  );
}

export default function QuestionEvidence({
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
      <summary className="grid min-h-16 cursor-pointer list-none grid-cols-[auto_1fr_auto] items-center gap-3 py-3 transition-colors hover:bg-quiet sm:grid-cols-[minmax(110px,auto)_1fr_auto_auto_auto] sm:gap-4">
        <span className="min-w-0 font-medium">{row.label}</span>
        <span className="hidden min-w-0 truncate text-sm text-muted sm:block">
          {row.evidence.find((item) => item.role === "required")?.outsideTitle ?? row.evidence.find((item) => item.role === "required")?.entry.title ?? "判定依据"}
        </span>
        <span className="hidden text-xs tabular-nums text-muted sm:inline">{row.marks ? `${row.marks.points} 分` : "分值未注明"}</span>
        <span className={`text-sm font-medium ${colors[row.verdict]}`}>
          {reportStates[row.verdict]}{row.verdict === "beyond" && hasDefect(row) ? " · 题设问题" : ""}
        </span>
        <ChevronDown className="text-muted transition-transform group-open:rotate-180" size={15} aria-hidden />
      </summary>
      <div className="pb-6 pt-1">
        <EvidenceBody row={row} fileUrl={fileUrl} />
        <MorphingDialog>
          <div className="mt-5 print:hidden">
            <MorphingDialogTrigger aria-label={`聚焦查看${row.label}的证据`} className={secondary}>
              <Maximize2 size={15} aria-hidden /> 聚焦查看证据
            </MorphingDialogTrigger>
          </div>
          <MorphingDialogContainer>
            <MorphingDialogContent className="relative max-h-[88vh] w-[min(920px,calc(100vw-32px))] overflow-y-auto rounded-2xl border border-line bg-surface p-6 text-ink shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:p-8">
              <MorphingDialogClose aria-label="关闭证据聚焦" className="grid size-10 place-items-center rounded-lg text-muted transition-colors hover:bg-quiet hover:text-ink">
                <X size={18} aria-hidden />
              </MorphingDialogClose>
              <MorphingDialogTitle>
                <h3 className="pr-12 font-display text-3xl">{row.label} · {reportStates[row.verdict]}</h3>
              </MorphingDialogTitle>
              <MorphingDialogDescription className="mt-6">
                <EvidenceBody row={row} fileUrl={fileUrl} />
              </MorphingDialogDescription>
            </MorphingDialogContent>
          </MorphingDialogContainer>
        </MorphingDialog>
      </div>
    </details>
  );
}
