"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronDown, FileSearch, LoaderCircle } from "lucide-react";
import {
  catalogFor,
  languageNames,
  levelNames,
  levels,
  revisionDate,
  sourceLink,
} from "../data/official-syllabus";
import { courseInfo } from "../data/curriculum-data";
import type { Selection } from "../lib/review/document";
import { reviewFile, type PaperReport } from "../lib/review/pdf-client";
import PdfUploader from "./PdfUploader";
import ExamAnalysisResult, { type ReportContext } from "./ExamAnalysisResult";
import { syllabusHref } from "../lib/syllabus-links";
import { field, heading, lead, primary, shell, sourceStyle } from "./review-styles";

export default function PaperWorkspace({ initial }: { initial: Selection }) {
  const [selection, setSelection] = useState(initial),
    [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState(""),
    [error, setError] = useState(""),
    [report, setReport] = useState<PaperReport | null>(null);
  const [teacher, setTeacher] = useState(""),
    [student, setStudent] = useState(""),
    [course, setCourse] = useState(0),
    [lesson, setLesson] = useState(1);
  const [reportFile, setReportFile] = useState("");
  const active = useRef<AbortController | null>(null),
    original = useRef("");
  const entries = catalogFor(selection.level).filter(
    (e) => e.level === selection.level && e.kind === "topic",
  );
  const currentCourse = courseInfo.levels.find((c) => course === c.id);
  const context: ReportContext = {
    teacher: teacher.trim(),
    student: student.trim(),
    course: currentCourse ? `${currentCourse.name} 第 ${lesson} 课` : "",
  };
  useEffect(
    () => () => {
      active.current?.abort();
      if (original.current) URL.revokeObjectURL(original.current);
    },
    [],
  );
  function clearReport() {
    setReport(null);
    setError("");
    if (original.current) {
      URL.revokeObjectURL(original.current);
      original.current = "";
    }
  }
  function change(s: Selection) {
    clearReport();
    setSelection(s);
  }
  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (!file || active.current) return;
    clearReport();
    const controller = new AbortController();
    active.current = controller;
    setStatus("正在打开 PDF");
    try {
      const result = await reviewFile(file, selection, controller.signal, (s) => {
        if (!controller.signal.aborted) setStatus(s);
      });
      if (controller.signal.aborted) return;
      original.current = URL.createObjectURL(file);
      setReportFile(original.current);
      setReport(result);
      requestAnimationFrame(() => {
        const target = document.getElementById("paper-report");
        target?.focus({ preventScroll: true });
        target?.scrollIntoView({ block: "start" });
      });
    } catch (err) {
      if (!controller.signal.aborted) {
        const message = err instanceof Error ? err.message : "未能读取试卷，请重试。";
        setError(
          /invalid pdf|password|invalidpdf|invalid root/i.test(message)
            ? "无法读取 PDF，请检查文件是否损坏或已加密。"
            : message,
        );
      }
    } finally {
      controller.abort();
      if (active.current === controller) {
        active.current = null;
        setStatus("");
      }
    }
  }
  const busy = Boolean(status);
  return (
    <main id="main-content" className={shell}>
      <div className="mb-8 print:hidden">
        <h1 className={heading}>试卷分析</h1>
        <p className={lead}>上传试卷，逐题查看考点、得分要点和超纲依据。</p>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)] print:hidden">
        <form onSubmit={run} className="min-w-0 rounded-lg border border-line bg-surface p-5 sm:p-7">
          <fieldset disabled={busy} className="min-w-0">
            <legend className="mb-4 text-xl font-semibold">试卷文件</legend>
            <PdfUploader
              file={file}
              disabled={busy}
              onChange={(f) => {
                clearReport();
                setFile(f);
              }}
              onError={(msg) => {
                clearReport();
                setFile(null);
                setError(msg);
              }}
            />
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-sm font-medium">
                考试语言<p className="mt-2 flex min-h-11 items-center font-semibold">C++</p>
              </div>
              <label className="text-sm font-medium">
                目标等级
                <select
                  className={field}
                  value={selection.level}
                  onChange={(e) => change({ ...selection, level: Number(e.target.value) })}
                >
                  {levels.map((l) => (
                    <option key={l} value={l}>
                      GESP {levelNames[l]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <details className="group mt-5 border-y border-line">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm font-medium">
                报告署名与学习进度 <span className="ml-auto mr-2 font-normal text-muted">选填</span>
                <ChevronDown size={15} className="group-open:rotate-180" />
              </summary>
              <div className="grid gap-4 pb-5 sm:grid-cols-2">
                <label className="text-sm">
                  教师署名
                  <input
                    className={field}
                    maxLength={60}
                    value={teacher}
                    onChange={(e) => setTeacher(e.target.value)}
                  />
                </label>
                <label className="text-sm">
                  学生姓名
                  <input
                    className={field}
                    maxLength={60}
                    value={student}
                    onChange={(e) => setStudent(e.target.value)}
                  />
                </label>
                <label className="text-sm">
                  课程级别
                  <select
                    className={field}
                    value={course}
                    onChange={(e) => {
                      setCourse(Number(e.target.value));
                      setLesson(1);
                    }}
                  >
                    <option value={0}>不填写</option>
                    {courseInfo.levels.map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.name} · {c.description}
                      </option>
                    ))}
                  </select>
                </label>
                {currentCourse && (
                  <label className="text-sm">
                    已完成课次
                    <select
                      className={field}
                      value={lesson}
                      onChange={(e) => setLesson(Number(e.target.value))}
                    >
                      {Array.from({ length: currentCourse.totalLessons }, (_, i) => (
                        <option value={i + 1} key={i + 1}>
                          第 {i + 1} 课
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            </details>
          </fieldset>
          {error && (
            <p
              role="alert"
              className="mt-4 rounded-md bg-red-50 p-3 text-sm leading-6 text-red-800 dark:bg-red-950 dark:text-red-200"
            >
              {error}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={busy || !file} className={primary}>
              {busy ? (
                <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" />
              ) : (
                <FileSearch size={17} />
              )}{" "}
              {busy ? "分析中" : "开始分析"}
            </button>
            {busy && (
              <button
                type="button"
                className="min-h-11 px-3 text-sm text-brand"
                onClick={() => {
                  active.current?.abort();
                  active.current = null;
                  setStatus("");
                }}
              >
                取消分析
              </button>
            )}
            <span role="status" aria-live="polite" className="text-sm text-muted">
              {status}
            </span>
          </div>
        </form>
        <aside className="overflow-hidden rounded-lg border border-line bg-surface">
          <div className="border-b border-line bg-wash px-5 py-5 sm:px-6">
            <h2 className="text-lg font-semibold">本次对照标准</h2>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-brand">
              {languageNames[selection.language]} · {levelNames[selection.level]}
            </p>
          </div>
          <div className="space-y-5 p-5 sm:p-6">
            <div>
              <h3 className="mb-1 text-sm font-medium">本级考点</h3>
              <p className="text-sm leading-7 text-muted">{entries.map((e) => e.title).join("、")}。</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium">判定口径</h3>
              <p className="text-sm leading-7 text-muted">
                按完成题目所需的最低知识要求判断。可选解法和干扰项单独注明。
              </p>
            </div>
            <div className="border-t border-line pt-4">
              <a href={sourceLink(entries[0])} target="_blank" rel="noreferrer" className={sourceStyle}>
                CCF 标准 · 第 {entries[0].page} 页 <ArrowUpRight size={14} />
              </a>
              <p className="mt-1 text-xs leading-5 text-muted">{revisionDate} 修订</p>
            </div>
            <Link
              className={sourceStyle}
              href={syllabusHref(selection.level, selection.language)}
            >
              展开本级条款 <ArrowRight size={14} />
            </Link>
          </div>
        </aside>
      </div>
      {report && (
        <div className="mt-8 print:mt-0">
          <ExamAnalysisResult report={report} fileUrl={reportFile} context={context} />
        </div>
      )}
    </main>
  );
}
