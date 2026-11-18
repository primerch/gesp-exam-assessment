import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, FileSearch } from "lucide-react";
import SyllabusLevelNav from "./SyllabusLevelNav";
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

export default function SyllabusBrowser({ language, level }: { language: Language; level: number }) {
  const catalog = catalogFor(level);
  const entries = catalog
    .filter((entry) => entry.kind === "topic" && entry.level === level)
    .sort((a, b) => a.clause.localeCompare(b.clause, "en", { numeric: true }));
  const boundaries = catalog.filter((entry) => entry.kind !== "topic");
  const pdf = syllabusSources.code;
  const grade = `${languageNames[language]} ${levelNames[level]}`;

  return (
    <main id="main-content" className={shell}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className={heading}>等级考纲</h1>
          <p className={lead}>查看 GESP C++ 一至八级的考点、适用边界和 CCF 原文，选择等级即可直接阅读。</p>
        </div>
        <Link className={primary} href={`/analyze?language=${language}&level=${level}`}>
          <FileSearch size={17} aria-hidden /> 分析一份试卷 <ArrowRight size={16} aria-hidden />
        </Link>
      </div>

      <SyllabusLevelNav language={language} level={level} />

      <article className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
        <header className="grid gap-6 border-b border-line px-5 py-7 sm:px-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-brand">
              <BookOpen size={16} aria-hidden /> {grade}
            </div>
            <h2 className="mt-3 text-3xl leading-tight font-medium tracking-[-0.03em] text-ink sm:text-4xl">
              {unitTitles[language][level]}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">本级内容按官方条款顺序排列。每项要求都可以回到对应 PDF 页码核对。</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted md:flex-col md:items-end">
            <span className="tabular-nums">本级 {entries.length} 项考点</span>
            <a className={sourceStyle} href={`${pdf}#page=${entries[0].page}`} target="_blank" rel="noreferrer">
              标准原文 · 第 {entries[0].page} 页 <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>
        </header>

        <div className="hidden grid-cols-[72px_minmax(150px,0.7fr)_minmax(0,1.6fr)_88px] gap-5 border-b border-line bg-quiet px-8 py-3 text-xs text-muted lg:grid">
          <span>条款</span><span>考点</span><span>能力要求</span><span>原文</span>
        </div>
        <div className="divide-y divide-line px-5 sm:px-8">
          {entries.map((entry) => (
            <section key={entry.id} className="grid gap-3 py-5 lg:grid-cols-[72px_minmax(150px,0.7fr)_minmax(0,1.6fr)_88px] lg:gap-5 lg:items-start" aria-label={`${entry.title}，${clauseLabel(entry)}`}>
              <span className="font-mono text-xs text-brand tabular-nums">{clauseLabel(entry)}</span>
              <h3 className="font-medium leading-6 text-ink">{entry.title}</h3>
              <p className="text-sm leading-6 text-muted">{entry.detail}</p>
              <a
                href={sourceLink(entry)}
                target="_blank"
                rel="noreferrer"
                aria-label={`${entry.title}，查看官方${clauseLabel(entry)}，第 ${entry.page} 页`}
                className="inline-flex items-center gap-1 justify-self-start whitespace-nowrap text-xs text-brand hover:underline"
              >
                第 {entry.page} 页 <ArrowUpRight size={12} aria-hidden />
              </a>
            </section>
          ))}
        </div>

        <div className="grid border-t border-line md:grid-cols-2">
          <section className="border-b border-line px-5 py-6 sm:px-8 md:border-b-0 md:border-r">
            <h3 className="font-medium text-ink">官方题型与配分</h3>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div><dt className="text-muted">单选</dt><dd className="mt-1 font-medium text-ink">15 题 × 2 分</dd></div>
              <div><dt className="text-muted">判断</dt><dd className="mt-1 font-medium text-ink">10 题 × 2 分</dd></div>
              <div><dt className="text-muted">编程</dt><dd className="mt-1 font-medium text-ink">2 题 × 25 分</dd></div>
            </dl>
            <p className="mt-4 text-sm text-muted">
              全卷 100 分。 <a href={`${syllabusSources.code}#page=${formatPages[level]}`} target="_blank" rel="noreferrer" className={sourceStyle}>原文第 {formatPages[level]} 页 <ArrowUpRight size={12} aria-hidden /></a>
            </p>
          </section>
          {boundaries.length > 0 && (
            <section className="bg-quiet px-5 py-6 sm:px-8">
              <h3 className="font-medium text-ink">适用边界</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {boundaries.map((entry) => (
                  <li key={entry.id} className="text-sm leading-6 text-muted">
                    {entry.detail}{" "}
                    <a className="whitespace-nowrap text-brand hover:underline" target="_blank" rel="noreferrer" href={sourceLink(entry)}>
                      第 {entry.page} 页 <ArrowUpRight size={11} className="inline" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>

      <p className="mt-5 text-sm text-muted">
        C++ 考纲采用 {revisionDate} 修订版。{" "}
        <a className={sourceStyle} href={syllabusSources.revision} target="_blank" rel="noreferrer">
          查看修订说明 <ArrowUpRight size={14} aria-hidden />
        </a>
      </p>
    </main>
  );
}
