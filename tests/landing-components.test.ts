import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AnimatedBeam } from "../app/components/ui/animated-beam";
import { NumberTicker } from "../app/components/ui/number-ticker";
import LandingPage from "../app/components/landing/LandingPage";
import LearningExamScene from "../app/components/landing/LearningExamScene";
import OrbitHero from "../app/components/landing/OrbitHero";
import CourseProgressWorkspace from "../app/components/plan/CourseProgressWorkspace";
import ExamAnalysisResult from "../app/components/ExamAnalysisResult";
import PaperWorkspace from "../app/components/PaperWorkspace";
import PdfUploader from "../app/components/PdfUploader";
import PaperIdentity from "../app/components/analyze/PaperIdentity";
import QuestionEvidence from "../app/components/analyze/QuestionEvidence";
import BrandMark from "../app/components/BrandMark";
import { catalogFor, revisionDate } from "../app/data/official-syllabus";
import type { PaperReport } from "../app/lib/review/pdf-client";
import type { QuestionJudgment } from "../app/lib/review/judgment";

test("motion registry primitives render their server-safe initial state", () => {
  const beam = renderToStaticMarkup(createElement(AnimatedBeam, {
    containerRef: { current: null },
    fromRef: { current: null },
    toRef: { current: null },
  }));
  const number = renderToStaticMarkup(createElement(NumberTicker, { value: 93, startValue: 80 }));

  assert.match(beam, /<svg\b/);
  assert.match(number, />80</);
});

test("Orbit hero exposes both tasks and a readable evidence equivalent", () => {
  const markup = renderToStaticMarkup(createElement(OrbitHero));

  assert.match(markup, /GESP C\+\+/);
  assert.match(markup, /考纲与试卷分析/);
  assert.match(markup, /href="\/plan"/);
  assert.match(markup, /href="\/analyze"/);
  assert.match(markup, /href="\/syllabus"/);
  assert.match(markup, /程序阅读示例/);
  assert.match(markup, /考纲依据/);
  assert.match(markup, /分析结果/);
});

test("learning scene uses sourced course totals and the existing example estimate", () => {
  const markup = renderToStaticMarkup(createElement(LearningExamScene));

  assert.match(markup, /96/);
  assert.match(markup, /93%/);
  assert.match(markup, /准备程度（估算）/);
  assert.match(markup, /按课程讲过的考点估算/);
});

test("landing removes the repeated long-form sections", () => {
  const markup = renderToStaticMarkup(createElement(LandingPage));

  assert.doesNotMatch(markup, /常见问题/);
  assert.doesNotMatch(markup, /你想先做什么？/);
});

test("course workspace puts honest exam guidance before lesson detail", () => {
  const markup = renderToStaticMarkup(createElement(CourseProgressWorkspace));

  assert.match(markup, /暂未形成报考建议/);
  assert.match(markup, /变量和数据的输入输出/);
  assert.match(markup, /搜索并选择课次/);
  assert.match(markup, /aria-label="上一课"/);
  assert.match(markup, /aria-label="下一课"/);
  assert.match(markup, /查看本课讲点与出处/);
  assert.ok(markup.indexOf("暂未形成报考建议") < markup.indexOf("查看本课讲点与出处"));
});

const evidenceEntry = catalogFor(1).find((entry) => entry.id === "cpp-1.12");
if (!evidenceEntry) throw new Error("missing test syllabus entry");
const judgment: QuestionJudgment = {
  id: 1,
  label: "程序阅读 · 第 1 题",
  page: 2,
  verdict: "within",
  reason: "解题需要跟踪 for 循环的起点、终点与输出。",
  difficulty: "基础",
  evidence: [{ entry: evidenceEntry, role: "required", page: 2, quote: "for (int i = 1; i <= 5; i++)", why: "完成本题必须理解单层循环。" }],
  marks: { points: 2, source: "question", page: 2, quote: "第 1 题（2 分）" },
  scoring: [{ text: "写出 12345", page: 2, quote: "12345", points: 2 }],
};
const report: PaperReport = {
  selection: { language: "cpp", level: 1 },
  fileName: "GESP-一级-练习卷-这是用于检查长文件名不会破坏布局的试卷名称.pdf",
  pages: 3,
  notes: [],
  rows: [judgment],
};

test("PDF uploader exposes file input and removable long-name file card", () => {
  const empty = renderToStaticMarkup(createElement(PdfUploader, { file: null, disabled: false, onChange: () => {}, onError: () => {} }));
  const file = new File(["%PDF-1.7"], report.fileName, { type: "application/pdf" });
  const selected = renderToStaticMarkup(createElement(PdfUploader, { file, disabled: false, onChange: () => {}, onError: () => {} }));

  assert.match(empty, /accept="application\/pdf,.pdf"/);
  assert.match(selected, /aria-label="移除试卷"/);
  assert.match(selected, /break-words/);
  assert.match(selected, /GESP-一级-练习卷/);
});

test("paper identity and question evidence keep real report metadata and sources", () => {
  const identity = renderToStaticMarkup(createElement(PaperIdentity, { report }));
  const evidence = renderToStaticMarkup(createElement(QuestionEvidence, { row: judgment, fileUrl: "blob:paper", initiallyOpen: true }));

  assert.match(identity, /GESP-一级-练习卷/);
  assert.match(identity, /3 页/);
  assert.match(identity, /C\+\+/);
  assert.match(identity, /一级/);
  assert.match(identity, /1 题/);
  assert.match(identity, new RegExp(revisionDate));
  assert.match(identity, /print:bg-white/);
  assert.match(identity, /print:text-ink/);
  assert.match(evidence, /解题需要跟踪 for 循环/);
  assert.match(evidence, /本题 2 分/);
  assert.match(evidence, /试卷原文/);
  assert.match(evidence, /大纲/);
  assert.match(evidence, /blob:paper#page=2/);
});

test("paper workspace exposes live status and report keeps verdict filters", () => {
  const workspace = renderToStaticMarkup(createElement(PaperWorkspace, { initial: { language: "cpp", level: 1 } }));
  const result = renderToStaticMarkup(createElement(ExamAnalysisResult, {
    report,
    fileUrl: "blob:paper",
    context: { teacher: "", student: "", course: "" },
  }));

  assert.match(workspace, /role="status"/);
  for (const label of ["全部", "纲内", "超纲", "题设问题", "依据不足"]) {
    assert.match(result, new RegExp(`>${label}<`));
  }
  assert.match(result, /aria-pressed="true"/);
});

test("brand mark uses the product-specific evidence glyph", () => {
  const markup = renderToStaticMarkup(createElement(BrandMark));

  assert.match(markup, /data-brand-mark="gesp-evidence"/);
  assert.match(markup, /aria-hidden="true"/);
  assert.match(markup, /<circle/);
});

test("number ticker does not override the consumer's foreground color", () => {
  const markup = renderToStaticMarkup(createElement(NumberTicker, { value: 93, startValue: 93, className: "text-[#d4ad66]" }));

  assert.doesNotMatch(markup, /text-black|dark:text-white/);
});

test("Orbit scene exposes the full current evidence as live text", () => {
  const markup = renderToStaticMarkup(createElement(OrbitHero));

  assert.match(markup, /id="orbit-evidence-text"/);
  assert.match(markup, /aria-live="polite"/);
  assert.match(markup, /for \(int i = 1; i &lt;= 5; i\+\+\)/);
  assert.match(markup, /CCF 考纲第 5 页/);
});

test("course workspace accepts a shared lesson selection", () => {
  const markup = renderToStaticMarkup(createElement(CourseProgressWorkspace, { initialLevel: 1, initialLesson: 12 }));

  assert.match(markup, /GESP 一级/);
  assert.match(markup, /aria-label="93%"/);
});

test("report exposes one five-choice verdict filter", () => {
  const markup = renderToStaticMarkup(createElement(ExamAnalysisResult, {
    report,
    fileUrl: "blob:paper",
    context: { teacher: "", student: "", course: "" },
  }));

  assert.equal((markup.match(/aria-pressed=/g) || []).length, 5);
});
