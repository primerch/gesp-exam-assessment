"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, FileSearch, LoaderCircle } from "lucide-react";
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
import { syllabusHref } from "../lib/syllabus-links";
import PdfUploader from "./PdfUploader";
import ExamAnalysisResult, { type ReportContext } from "./ExamAnalysisResult";
import { field, primary, shell } from "./review-styles";

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
  const reduceMotion = useReducedMotion();
  const entries = catalogFor(selection.level).filter(
    (entry) => entry.level === selection.level && entry.kind === "topic",
  );
  const currentCourse = courseInfo.levels.find((item) => course === item.id);
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

  function change(selection: Selection) {
    clearReport();
    setSelection(selection);
  }

  async function run(event: React.FormEvent) {
    event.preventDefault();
    if (!file || active.current) return;
    clearReport();
    const controller = new AbortController();
    active.current = controller;
    setStatus("正在打开 PDF");
    try {
      const result = await reviewFile(file, selection, controller.signal, (message) => {
        if (!controller.signal.aborted) setStatus(message);
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
          /invalid pdf|password|invalid root/i.test(message)
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
  const currentStep = report ? 3 : file ? 2 : 1;

  return (
    <main id="main-content" className={shell}>
      <div className="print:hidden">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] tracking-[0.16em] text-brand">PAPER → EVIDENCE</p>
            <h1 className="mt-3 font-display text-4xl tracking-[-0.035em] text-ink sm:text-5xl">把试卷放进来，逐题看依据</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">识别题目、对照 CCF 考纲，再查看纲内、超纲与依据不足的结论。</p>
          </div>
          <p className="font-mono text-xs text-muted">PDF / MAX 64 PAGES</p>
        </div>

        <ol aria-label="试卷分析步骤" className="mt-8 grid grid-cols-3 border-y border-line py-4">
          {["上传试卷", "对照标准", "生成报告"].map((name, index) => {
            const step = index + 1;
            const reached = currentStep >= step;
            return (
              <li key={name} aria-current={currentStep === step ? "step" : undefined} className="flex items-center gap-2 px-1 sm:px-3">
                <span className={`grid size-7 shrink-0 place-items-center rounded-full border font-mono text-[11px] ${reached ? "border-brand bg-brand text-on-brand" : "border-line text-muted"}`}>
                  {currentStep > step ? <Check size={13} aria-hidden /> : step}
                </span>
                <span className={`text-xs sm:text-sm ${reached ? "font-medium text-ink" : "text-muted"}`}>{name}</span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.85fr)] print:hidden">
        <form onSubmit={run} className="min-w-0 rounded-2xl border border-line bg-surface p-5 sm:p-8">
          <fieldset disabled={busy} className="min-w-0">
            <legend className="text-xl font-medium tracking-[-0.02em]">试卷文件</legend>
            <p className="mb-5 mt-2 text-sm leading-6 text-muted">文件只在当前分析流程中使用；选择后可随时移除。</p>
            <PdfUploader
              file={file}
              disabled={busy}
              onChange={(nextFile) => {
                clearReport();
                setFile(nextFile);
              }}
              onError={(message) => {
                clearReport();
                setFile(null);
                setError(message);
              }}
            />
            <div className="mt-7 grid grid-cols-2 gap-4 border-t border-line pt-6">
              <div className="text-sm font-medium">
                考试语言
                <p className="mt-2 flex min-h-11 items-center font-medium text-muted">C++</p>
              </div>
              <label className="text-sm font-medium">
                目标等级
                <select
                  className={field}
                  value={selection.level}
                  onChange={(event) => change({ ...selection, level: Number(event.target.value) })}
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>GESP {levelNames[level]}</option>
                  ))}
                </select>
              </label>
            </div>
            <details className="group mt-6 border-y border-line">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-sm font-medium">
                报告署名与学习进度 <span className="ml-auto mr-2 font-normal text-muted">选填</span>
                <ChevronDown size={15} className="transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <div className="grid gap-4 pb-6 sm:grid-cols-2">
                <label className="text-sm">教师署名<input className={field} maxLength={60} value={teacher} onChange={(event) => setTeacher(event.target.value)} /></label>
                <label className="text-sm">学生姓名<input className={field} maxLength={60} value={student} onChange={(event) => setStudent(event.target.value)} /></label>
                <label className="text-sm">
                  课程级别
                  <select className={field} value={course} onChange={(event) => { setCourse(Number(event.target.value)); setLesson(1); }}>
                    <option value={0}>不填写</option>
                    {courseInfo.levels.map((item) => <option value={item.id} key={item.id}>{item.name} · {item.description}</option>)}
                  </select>
                </label>
                {currentCourse && (
                  <label className="text-sm">
                    已完成课次
                    <select className={field} value={lesson} onChange={(event) => setLesson(Number(event.target.value))}>
                      {Array.from({ length: currentCourse.totalLessons }, (_, index) => <option value={index + 1} key={index + 1}>第 {index + 1} 课</option>)}
                    </select>
                  </label>
                )}
              </div>
            </details>
          </fieldset>

          {error && (
            <p role="alert" className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm leading-6 text-destructive">
              {error}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={busy || !file} className={primary}>
              {busy ? <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" aria-hidden /> : <FileSearch size={17} aria-hidden />}
              {busy ? "分析中" : "开始分析"}
            </button>
            {busy && (
              <button type="button" className="min-h-11 px-3 text-sm text-brand" onClick={() => { active.current?.abort(); active.current = null; setStatus(""); }}>
                取消分析
              </button>
            )}
            <span role="status" aria-live="polite" className="text-sm text-muted">{status}</span>
          </div>
        </form>

        <aside className="overflow-hidden rounded-2xl bg-[#17231d] text-[#edf3ef] lg:sticky lg:top-6">
          <div className="border-b border-white/10 px-5 py-6 sm:px-6">
            <h2 className="font-mono text-[11px] tracking-[0.16em] text-[#d4ad66]">本次对照标准</h2>
            <p className="mt-3 font-display text-3xl">
              {languageNames[selection.language]} · {levelNames[selection.level]}
            </p>
            <p className="mt-2 font-mono text-xs text-[#a8b5ad] tabular-nums">{entries.length} 项考点 · {revisionDate} 修订</p>
          </div>
          <div className="p-5 sm:p-6">
            <details className="group border-b border-white/10 pb-5">
              <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between text-sm font-medium">
                查看本级考点 <ChevronDown size={15} className="transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <p className="pt-2 text-sm leading-7 text-[#a8b5ad]">{entries.map((entry) => entry.title).join("、")}。</p>
            </details>
            <div className="border-b border-white/10 py-5">
              <h3 className="mb-2 text-sm font-medium">判定口径</h3>
              <p className="text-sm leading-6 text-[#a8b5ad]">按完成题目所需的最低知识要求判断，可选解法和干扰项单独注明。</p>
            </div>
            <div className="flex flex-col items-start gap-3 pt-5">
              <a href={sourceLink(entries[0])} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-[#d4ad66] underline-offset-4 hover:underline">
                CCF 标准 · 第 {entries[0].page} 页 <ArrowUpRight size={14} aria-hidden />
              </a>
              <Link className="inline-flex items-center gap-1 text-sm text-[#c4d2c8] underline-offset-4 hover:underline" href={syllabusHref(selection.level, selection.language)}>
                展开本级条款 <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {report && (
        <motion.div
          className="mt-8 print:mt-0"
          initial={{ opacity: 0, transform: "translateY(12px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.23, 1, 0.32, 1] }}
        >
          <ExamAnalysisResult report={report} fileUrl={reportFile} context={context} />
        </motion.div>
      )}
    </main>
  );
}
