"use client";

import { useState } from "react";
import {
  courseLessons,
  cppCourseLevels,
  cppLessons,
  lessonClauses,
  lessonPointKinds,
  syllabusCoverageThrough,
  type CppCourseLevel,
} from "../data/cpp-lessons";
import { clauseLabel, levelNames, sourceLink } from "../data/official-syllabus";
import { field, heading, lead, shell, sourceStyle } from "../components/review-styles";

export default function PlanPage() {
  const [level, setLevel] = useState<CppCourseLevel>(1);
  const [lessonNumber, setLessonNumber] = useState(1);
  const lessons = courseLessons(level);
  const lesson = lessons.find(({ number }) => number === lessonNumber) ?? lessons[0];
  const covered = syllabusCoverageThrough(lesson);

  return (
    <main id="main-content" className={shell}>
      <h1 className={heading}>学习规划</h1>
      <p className={lead}>查阅新版 C++ 的 {cppLessons.length} 节课，对照原课件讲点和 CCF 考纲。</p>

      <div className="mt-8 overflow-hidden rounded-lg border border-line bg-surface">
        <div className="grid gap-4 border-b border-line bg-quiet p-5 sm:grid-cols-[minmax(9rem,1fr)_minmax(0,3fr)] sm:px-6">
          <label className="min-w-0 text-sm font-medium">
            课程级别
            <select className={field} value={level} onChange={(event) => {
              setLevel(Number(event.target.value) as CppCourseLevel);
              setLessonNumber(1);
            }}>
              {cppCourseLevels.map((value) => <option key={value} value={value}>Level {value}</option>)}
            </select>
          </label>
          <label className="min-w-0 text-sm font-medium">
            课节
            <select className={field} value={lessonNumber} onChange={(event) => setLessonNumber(Number(event.target.value))}>
              {lessons.map(({ number, title }) => (
                <option key={number} value={number}>第 {number} 课 · {title}</option>
              ))}
            </select>
          </label>
        </div>

        <section className="p-5 sm:px-6" aria-labelledby="lesson-title">
          <h2 id="lesson-title" className="text-xl font-semibold text-ink">{lesson.title}</h2>
          <p className="mt-2 text-sm text-muted">
            Level {lesson.level} · 第 {lesson.number} 课
            {lesson.status === "partial" && " · 部分课件已核实"}
            {lesson.status === "unverified" && " · 课件未核实"}
          </p>
          {lesson.catalogTitle && (
            <p className="mt-1 text-sm text-muted">原目录课名 · {lesson.catalogTitle}</p>
          )}
          {lesson.points.length ? (
            Object.entries(lessonPointKinds).map(([kind, label]) => {
              const points = lesson.points.filter((point) => point.kind === kind);
              if (!points.length) return null;
              return (
                <section key={kind} className="mt-6">
                  <h3 className="text-sm font-semibold text-ink">{label}</h3>
                  <ul className="mt-2 divide-y divide-line border-y border-line">
                    {points.map((point) => (
                      <li key={point.title} className="py-3">
                        <div className="max-w-3xl text-base leading-6 text-ink">{point.title}</div>
                        <p className="mt-1 break-words text-sm leading-6 text-muted">{point.sources.join("、")}</p>
                        {point.clauses.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
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
        </section>
      </div>

      <details className="mt-6 rounded-lg border border-line bg-surface">
        <summary className="min-h-11 cursor-pointer px-5 py-3 text-sm font-semibold sm:px-6">
          截至本课已涉及的 GESP 考纲条款 · {covered.length} 项
        </summary>
        <div className="border-t border-line px-5 pb-5 pt-4 sm:px-6">
          <p className="text-sm leading-6 text-muted">按原课件中的讲解和复习去重统计。报考准备程度需结合实际作答。</p>
          {covered.length > 0 && (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {covered.map((entry) => (
                <li key={entry.id}>
                  <a className={sourceStyle} href={sourceLink(entry)} target="_blank" rel="noreferrer">
                    GESP {levelNames[entry.level]} · {entry.title}
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
