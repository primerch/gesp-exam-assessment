"use client";

import { useId, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, Search } from "lucide-react";
import { NumberTicker } from "@/app/components/ui/number-ticker";
import { TransitionPanel } from "@/app/components/motion";
import {
  courseLessons,
  lessonClauses,
  lessonPointKinds,
  syllabusCoverageThrough,
  type CppCourseLevel,
} from "../../data/cpp-lessons";
import { calculatePassProbability, getRecommendedExam } from "../../data/curriculum-data";
import { clauseLabel, levelNames, levels, sourceLink } from "../../data/official-syllabus";
import { shell, sourceStyle } from "../review-styles";
import CourseLevelRail from "./CourseLevelRail";

function lessonLabel(number: number, title: string) {
  return `第 ${number} 课 · ${title}`;
}

export default function CourseProgressWorkspace() {
  const [level, setLevel] = useState<CppCourseLevel>(1);
  const [lessonNumber, setLessonNumber] = useState(1);
  const [query, setQuery] = useState("");
  const listId = useId();
  const lessons = courseLessons(level);
  const lesson = lessons.find(({ number }) => number === lessonNumber) ?? lessons[0];
  const covered = syllabusCoverageThrough(lesson);
  const recommendation = getRecommendedExam(level, lessonNumber);
  const probabilities = calculatePassProbability(level, lessonNumber);
  const probability = recommendation ? probabilities[recommendation.level] : null;

  function changeLevel(next: CppCourseLevel) {
    setLevel(next);
    setLessonNumber(1);
    setQuery("");
  }

  function changeLesson(next: number) {
    setLessonNumber(Math.max(1, Math.min(lessons.length, next)));
    setQuery("");
  }

  return (
    <main id="main-content" className={shell}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] text-brand">COURSE → EXAM</p>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.035em] text-ink sm:text-5xl">你学到哪了？</h1>
          <p className="mt-3 text-sm leading-6 text-muted">选择课程级别和已完成课次，先查看参考报考等级。</p>
        </div>
        <p className="font-mono text-xs text-muted">LEVEL {level} / {String(lessonNumber).padStart(2, "0")}</p>
      </div>

      <section className="mt-8" aria-label="课程与课次选择">
        <CourseLevelRail current={level} onChange={changeLevel} />
        <div className="mt-5 grid gap-3 rounded-xl border border-line bg-surface p-4 sm:grid-cols-[1fr_auto] sm:items-end sm:p-5">
          <label className="min-w-0 text-sm font-medium text-ink">
            搜索并选择课次
            <span className="relative mt-2 block">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} aria-hidden />
              <input
                type="search"
                list={listId}
                value={query}
                placeholder={lessonLabel(lesson.number, lesson.title)}
                onChange={(event) => {
                  const value = event.target.value;
                  setQuery(value);
                  const match = lessons.find((item) => lessonLabel(item.number, item.title) === value);
                  if (match) changeLesson(match.number);
                }}
                className="min-h-12 w-full rounded-lg border border-input bg-paper pl-10 pr-3 text-base text-ink placeholder:text-muted"
              />
              <datalist id={listId}>
                {lessons.map((item) => <option key={item.number} value={lessonLabel(item.number, item.title)} />)}
              </datalist>
            </span>
          </label>
          <div className="flex gap-2">
            <button type="button" aria-label="上一课" disabled={lessonNumber === 1} onClick={() => changeLesson(lessonNumber - 1)} className="inline-grid size-12 place-items-center rounded-lg border border-line text-ink transition-colors hover:bg-wash disabled:cursor-not-allowed disabled:opacity-35">
              <ArrowLeft size={17} aria-hidden />
            </button>
            <button type="button" aria-label="下一课" disabled={lessonNumber === lessons.length} onClick={() => changeLesson(lessonNumber + 1)} className="inline-grid size-12 place-items-center rounded-lg border border-line text-ink transition-colors hover:bg-wash disabled:cursor-not-allowed disabled:opacity-35">
              <ArrowRight size={17} aria-hidden />
            </button>
          </div>
        </div>
      </section>

      <section aria-labelledby="exam-result-title" className="mt-6 overflow-hidden rounded-2xl bg-[#17231d] text-[#edf3ef]">
        <TransitionPanel
          activeIndex={lessonNumber - 1}
          variants={{ enter: { opacity: 0, y: 12 }, center: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 } }}
          transition={{ duration: 0.22 }}
        >
          {lessons.map((item) => (
            <div key={item.number} className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="font-mono text-[11px] tracking-[0.16em] text-[#d4ad66]">LEVEL {level} · 第 {lessonNumber} 课</p>
                <h2 id="exam-result-title" className="mt-3 font-display text-3xl sm:text-4xl">{item.title}</h2>
                <p className="mt-4 text-sm text-[#a8b5ad]">参考报考等级</p>
                <p className="mt-2 font-display text-4xl text-[#f2f0e8] sm:text-5xl">
                  {recommendation ? `GESP ${levelNames[recommendation.level]}` : "暂未形成报考建议"}
                </p>
                {!recommendation && <p className="mt-3 max-w-md text-sm leading-6 text-[#a8b5ad]">当前课程覆盖尚未达到现有推荐规则的阈值，继续学习后可再查看。</p>}
              </div>
              {probability !== null && (
                <div className="lg:min-w-44 lg:text-right">
                  <div className="whitespace-nowrap text-[#d4ad66]">
                    <NumberTicker value={probability} startValue={probability} aria-label={`${probability}%`} className="font-mono text-6xl tracking-[-0.05em]" />
                    <span className="font-mono text-2xl">%</span>
                  </div>
                  <p className="mt-1 text-xs text-[#a8b5ad]">准备程度估算</p>
                </div>
              )}
            </div>
          ))}
        </TransitionPanel>
        <div className="border-t border-white/10 px-6 py-4 text-xs leading-5 text-[#82968b] sm:px-8">只按课程覆盖估算，不代表考试成绩；报考前还要结合独立作答表现。</div>
      </section>

      <section className="mt-6 rounded-xl border border-line bg-surface p-5 sm:p-6" aria-labelledby="level-overview-title">
        <div className="flex items-center justify-between gap-4">
          <h2 id="level-overview-title" className="text-sm font-medium">八级准备程度参考</h2>
          <span className="text-xs text-muted">现有课程映射</span>
        </div>
        <ol className="mt-5 grid grid-cols-4 gap-x-4 gap-y-5 sm:grid-cols-8">
          {levels.map((gespLevel) => (
            <li key={gespLevel}>
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-xs text-muted">{gespLevel} 级</span>
                <span className="font-mono text-sm text-ink tabular-nums">{probabilities[gespLevel]}%</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-quiet">
                <div className={`h-full ${recommendation?.level === gespLevel ? "bg-current" : "bg-brand/45"}`} style={{ width: `${probabilities[gespLevel]}%` }} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <details className="group mt-6 rounded-xl border border-line bg-surface">
        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium sm:px-6">
          查看本课讲点与出处
          <ChevronDown size={16} className="transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <div className="border-t border-line px-5 pb-6 pt-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span>Level {lesson.level} · 第 {lesson.number} 课</span>
            {lesson.status === "partial" && <span>· 部分课件已核实</span>}
            {lesson.status === "unverified" && <span>· 课件未核实</span>}
            {lesson.catalogTitle && <span>· 原目录课名：{lesson.catalogTitle}</span>}
          </div>
          {lesson.points.length ? (
            Object.entries(lessonPointKinds).map(([kind, label]) => {
              const points = lesson.points.filter((point) => point.kind === kind);
              if (!points.length) return null;
              return (
                <section key={kind} className="mt-6">
                  <h3 className="text-sm font-medium text-ink">{label}</h3>
                  <ul className="mt-3 divide-y divide-line border-y border-line">
                    {points.map((point) => (
                      <li key={point.title} className="py-4">
                        <p className="max-w-3xl text-base leading-6 text-ink">{point.title}</p>
                        <p className="mt-1 break-words text-sm leading-6 text-muted">{point.sources.join("、")}</p>
                        {point.clauses.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                            {lessonClauses(point).map((entry) => (
                              <a className={sourceStyle} key={entry.id} href={sourceLink(entry)} target="_blank" rel="noreferrer">
                                {entry.kind === "topic" ? `GESP ${levelNames[entry.level]} · ${entry.title}` : entry.title}
                                <span className="sr-only"> · {clauseLabel(entry)}（新窗口）</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })
          ) : <p className="mt-4 leading-7 text-muted">这节课暂无可引用的原课件讲点。</p>}
        </div>
      </details>

      <details className="group mt-4 rounded-xl border border-line bg-surface">
        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium sm:px-6">
          截至本课已涉及的 GESP 考纲条款 · {covered.length} 项
          <ChevronDown size={16} className="transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <div className="border-t border-line px-5 pb-6 pt-4 sm:px-6">
          <p className="text-sm leading-6 text-muted">按原课件中的讲解和复习去重统计，原文出处可核对。</p>
          {covered.length > 0 && (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {covered.map((entry) => (
                <li key={entry.id}>
                  <a className={sourceStyle} href={sourceLink(entry)} target="_blank" rel="noreferrer">
                    GESP {entry.level} 级 · {entry.title}
                    <span className="sr-only"> · {clauseLabel(entry)}（新窗口）</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </details>
    </main>
  );
}
