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
