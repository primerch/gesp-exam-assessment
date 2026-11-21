import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import CourseTimeline from "../app/components/landing/CourseTimeline";
import FaqAccordion from "../app/components/landing/FaqAccordion";
import LevelPath from "../app/components/landing/LevelPath";
import ProcessStepper from "../app/components/landing/ProcessStepper";
import SyllabusTabs from "../app/components/landing/SyllabusTabs";
import ToolPanels from "../app/components/landing/ToolPanels";
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

function attributes(tag: string) {
  return Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((match) => [match[1], match[2]]));
}

test("stepper tabs control real labelled panels and identify the visitor demo", () => {
  const markup = renderToStaticMarkup(createElement(ProcessStepper));
  const tabs = [...markup.matchAll(/<button\b[^>]*role="tab"[^>]*>/g)].map((match) => attributes(match[0]));
  const panels = [...markup.matchAll(/<div\b[^>]*role="tabpanel"[^>]*>/g)].map((match) => attributes(match[0]));

  assert.match(markup, /aria-label="备考步骤"/);
  assert.match(markup, /演示流程 · 点击步骤查看说明/);
  assert.equal(tabs.length, 4);
  assert.equal(panels.length, 1);
  assert.equal(tabs[0]["aria-controls"], panels[0].id);
  assert.equal(tabs[0].id, panels[0]["aria-labelledby"]);
});

test("stepper rendering does not emit a multiple-child wait-mode animation warning", () => {
  const warnings: string[] = [];
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => warnings.push(args.join(" "));
  try {
    renderToStaticMarkup(createElement(ProcessStepper));
  } finally {
    console.warn = originalWarn;
  }
  assert.equal(warnings.filter((warning) => warning.includes("multiple children within AnimatePresence")).length, 0);
});

test("tool and syllabus cards expose heading navigation", () => {
  const tools = renderToStaticMarkup(createElement(ToolPanels));
  const syllabus = renderToStaticMarkup(createElement(SyllabusTabs));

  assert.equal((tools.match(/<h3\b[^>]*data-slot="card-title"/g) || []).length, 3);
  assert.match(syllabus, /<h3\b[^>]*data-slot="card-title"/);
});

test("nested level path keeps a logical heading level", () => {
  const markup = renderToStaticMarkup(createElement(LevelPath, { showHeader: false }));
  assert.match(markup, /<h2\b[^>]*>程序设计基础<\/h2>/);
});

test("learning demo renders sourced totals and distinct feature badges", () => {
  const timeline = renderToStaticMarkup(createElement(CourseTimeline));
  const tools = renderToStaticMarkup(createElement(ToolPanels));

  assert.match(timeline, /课程阶段演示 · 点击查看对应 GESP 目标/);
  assert.equal((timeline.match(/24 课次/g) || []).length, 4);
  assert.match(tools, /96 个课次/);
  assert.match(tools, /已学与未学/);
  assert.match(tools, /参考报考等级/);
});

test("FAQ and syllabus previews expose their expanded content and real links", () => {
  const faq = renderToStaticMarkup(createElement(FaqAccordion));
  const syllabus = renderToStaticMarkup(createElement(SyllabusTabs));

  assert.match(faq, /aria-expanded="true"/);
  assert.match(faq, /role="region"/);
  assert.match(faq, /不是。GESP 考级宝是 Reacher 独立作品/);
  assert.match(syllabus, /role="tablist"/);
  assert.match(syllabus, /href="\/syllabus\?language=cpp&amp;level=1"/);
});

test("Orbit hero exposes both tasks and a readable evidence equivalent", () => {
  const markup = renderToStaticMarkup(createElement(OrbitHero));

  assert.match(markup, /GESP/);
  assert.match(markup, /href="\/plan"/);
  assert.match(markup, /href="\/analyze"/);
  assert.match(markup, /产品演示/);
  assert.match(markup, /试卷原文/);
  assert.match(markup, /CCF 条款/);
  assert.match(markup, /判断结论/);
});

test("learning scene uses sourced course totals and the existing example estimate", () => {
  const markup = renderToStaticMarkup(createElement(LearningExamScene));

  assert.match(markup, /96/);
  assert.match(markup, /93%/);
  assert.match(markup, /不代表考试成绩/);
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
  assert.match(selected, /break-all/);
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
