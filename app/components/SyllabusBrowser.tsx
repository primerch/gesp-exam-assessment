import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, ChevronRight, FileSearch } from "lucide-react";
import {
  catalogFor,
  clauseLabel,
  formatPages,
  languageNames,
  levelNames,
  levels,
  revisionDate,
  sourceLink,
  syllabusSources,
  type Language,
} from "../data/official-syllabus";
import { syllabusHref } from "../lib/syllabus-links";
import { heading, lead, primary, shell, sourceStyle } from "./review-styles";
export const unitTitles = {
  cpp: [
    "",
    "程序设计基础",
    "嵌套控制与编码",
    "数组与基础算法",
    "函数与基础排序",
    "数论与算法策略",
    "树与动态规划",
    "图与进阶动态规划",
    "组合数学与算法优化",
  ],
};
export function getSelection(n?: string | string[], defaultLevel = 1) {
  const language: Language = "cpp";
  const level = typeof n === "string" && levels.includes(Number(n)) ? Number(n) : defaultLevel;
  return { language, level };
}
const urlFor = (lang: Language, n: number) => syllabusHref(n, lang);
export default function SyllabusBrowser({ language, level }: { language: Language; level: number }) {
  const catalog = catalogFor(level);
  const entries = catalog
    .filter((e) => e.kind === "topic" && e.level === level)
    .sort((a, b) => a.clause.localeCompare(b.clause, "en", { numeric: true }));
  const boundaries = catalog.filter((e) => e.kind !== "topic");
  const pdf = syllabusSources.code;
  const grade = languageNames[language] + " " + levelNames[level];
  return (
    <main id="main-content" className={shell}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className={heading}>等级考纲</h1>
          <p className={lead}>查看 C++ 一级至八级的考点、适用边界和 CCF 原文条款。</p>
        </div>
        <Link className={primary} href={`/analyze?language=${language}&level=${level}`}>
          <FileSearch size={17} aria-hidden /> 分析一份试卷 <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="rounded-lg border border-line bg-surface">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-semibold">C++ 考试等级</h2>
          </div>
          <nav
            aria-label="考试等级"
            className="grid grid-cols-4 gap-1 p-2 sm:grid-cols-8 lg:block lg:space-y-1"
          >
            {levels.map((n) => (
              <Link
                key={n}
                scroll={false}
                href={urlFor(language, n)}
                aria-current={level === n ? "page" : undefined}
                className={`flex min-h-11 items-center justify-center gap-3 rounded-md px-2 text-sm lg:justify-start lg:px-3 ${level === n ? "bg-wash font-semibold text-brand" : "text-muted hover:bg-quiet"}`}
              >
                <span className="hidden w-5 font-mono text-xs lg:inline">{String(n).padStart(2, "0")}</span>
                {levelNames[n]}
                <ChevronRight
                  size={14}
                  className={`ml-auto hidden ${level === n ? "lg:block" : ""}`}
                  aria-hidden
                />
              </Link>
            ))}
          </nav>
        </aside>
        <article className="min-w-0 overflow-hidden rounded-lg border border-line bg-surface">
          <div className="border-b border-line bg-wash px-5 py-6 sm:px-8">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-brand">
              <BookOpen size={16} aria-hidden />
              {grade}
            </div>
            <h2 className="text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
              {unitTitles[language][level]}
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
              <span>本级 {entries.length} 项考点</span>
              <a
                className={sourceStyle}
                href={pdf + "#page=" + entries[0].page}
                target="_blank"
                rel="noreferrer"
              >
                标准原文 · 第 {entries[0].page} 页 <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
          <div className="divide-y divide-line px-5 sm:px-8">
            {entries.map((e) => (
              <div
                key={e.id}
                className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[minmax(9rem,0.8fr)_minmax(0,1.7fr)_auto] sm:items-baseline"
              >
                <h3 className="font-medium">{e.title}</h3>
                <p className="text-sm leading-6 text-muted">{e.detail}</p>
                <a
                  href={sourceLink(e)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={e.title + "，查看官方" + clauseLabel(e)}
                  className="justify-self-start whitespace-nowrap text-xs text-brand hover:underline"
                >
                  {clauseLabel(e)} ↗
                </a>
              </div>
            ))}
          </div>
          <div className="border-t border-line px-5 py-5 sm:px-8">
            <h3 className="mb-2 font-medium">官方题型与配分</h3>
            <p className="text-sm leading-7 text-muted">
              单选 15 题，每题 2 分。判断 10 题，每题 2 分。编程 2 题，每题 25 分。全卷 100 分。{" "}
              <a
                href={syllabusSources.code + "#page=" + formatPages[level]}
                target="_blank"
                rel="noreferrer"
                className={sourceStyle}
              >
                原文第 {formatPages[level]} 页 ↗
              </a>
            </p>
          </div>
          {boundaries.length > 0 && (
            <div className="border-t border-line bg-quiet px-5 py-5 sm:px-8">
              <h3 className="mb-2 font-medium">适用边界</h3>
              <ul className="space-y-1">
                {boundaries.map((e) => (
                  <li key={e.id} className="text-sm leading-6 text-muted">
                    {e.detail}{" "}
                    <a
                      className="text-brand hover:underline"
                      target="_blank"
                      rel="noreferrer"
                      href={sourceLink(e)}
                    >
                      第 {e.page} 页 ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </div>
      {
        <p className="mt-5 text-sm text-muted">
          C++ 考纲采用 {revisionDate} 修订版。{" "}
          <a className={sourceStyle} href={syllabusSources.revision} target="_blank" rel="noreferrer">
            查看修订说明 <ArrowUpRight size={14} />
          </a>
        </p>
      }
    </main>
  );
}
