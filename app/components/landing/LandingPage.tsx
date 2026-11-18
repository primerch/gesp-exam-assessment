"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  FileSearch,
  Gauge,
  Printer,
  Route,
  ShieldCheck,
  Waypoints,
} from "lucide-react";
import Reveal from "../motion/Reveal";
import LevelPath from "./LevelPath";
import AnalysisDemo from "./AnalysisDemo";
import {
  catalogFor,
  levelNames,
  levels,
  revisionDate,
  syllabusSources,
} from "../../data/official-syllabus";
import { calculatePassProbability, courseInfo } from "../../data/curriculum-data";
import { syllabusHref } from "../../lib/syllabus-links";
import { primary, secondary } from "../review-styles";
import { unitTitles } from "../SyllabusBrowser";

const tools = [
  {
    href: "/syllabus",
    icon: BookOpen,
    title: "等级考纲",
    description: "准备某一级考试前，先看看它到底考什么。每个考点都附 CCF 原文页码。",
    details: ["C++ 一至八级", "逐项查看", "原文页码"],
    action: "查看考纲",
  },
  {
    href: "/analyze",
    icon: FileSearch,
    title: "试卷分析",
    description: "上传 PDF，逐题看考了什么、有没有超纲、得分点在哪里。分析结果可以打印。",
    details: ["支持扫描件", "逐题分析", "报告可打印"],
    action: "上传试卷",
  },
  {
    href: "/plan",
    icon: Gauge,
    title: "学习规划",
    description: "选择课程和已完成的课次，看看哪些内容学过、哪些还没学，以及目前更适合报哪一级。",
    details: ["95 个课次", "已学与未学", "参考报考等级"],
    action: "查看学习进度",
  },
] as const;

const process = [
  ["确定要考哪一级", "先选目标等级，避免拿其他级别的要求来分析这套试卷。"],
  ["看这一级考什么", "考点、题型和限制都列出来，CCF 原文页码也一并附上。"],
  ["逐题分析试卷", "看每道题需要什么知识、有哪些得分点，是否超出这一级范围。"],
  ["决定接下来学什么", "结合课程进度，先补还没学过的内容，再考虑报考等级。"],
];

const faqs = [
  ["这是 CCF 官方工具吗？", "不是。GESP 考级宝是 Reacher 独立作品，考纲内容与原文链接来自中国计算机学会，分析结果不代表 CCF 官方结论。"],
  ["目前支持哪些考试语言和等级？", "当前支持 C++ 一级至八级。考纲页可以逐级切换，进入试卷分析时会保留所选等级。"],
  ["可以上传哪些 PDF 试卷？", "支持文字版、扫描件和包含图示的 PDF，单次最多 64 页、10 MB。加密或损坏的文件会显示明确的读取错误。"],
  ["怎么判断一道题是否超纲？", "看完成这道题最少需要哪些知识。可选解法、干扰项和题目本身的问题会单独注明，不会因为存在更复杂的解法就判成超纲。"],
  ["学习规划里的百分比是什么意思？", "它是根据课程进度与知识覆盖算出的准备程度估算，不是考试通过率。实际报考能力仍需结合独立作答表现。"],
  ["分析报告可以保存或打印吗？", "可以。分析报告保留题目、考点、得分要点和依据，并提供适合打印的版面；署名与学习进度为选填信息。"],
];

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="max-w-3xl">
      <h2 className="text-3xl leading-tight font-medium tracking-[-0.03em] text-balance text-ink sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-muted sm:text-lg sm:leading-8">{description}</p>
    </div>
  );
}

function ProcessItem({ children, delay }: { children: React.ReactNode; delay: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.li
      initial={{ opacity: 0, transform: "translateY(12px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : delay, ease: [0.23, 1, 0.32, 1] }}
      className="relative border-t border-[#466054] pt-6 md:border-t-0 md:pt-0"
    >
      {children}
    </motion.li>
  );
}

export default function LandingPage() {
  const sampleProbability = calculatePassProbability(1, 12)[1];

  return (
    <main id="main-content" className="overflow-hidden">
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16 lg:px-12 lg:py-24">
          <div>
            <h1 className="max-w-[12ch] text-[42px] leading-[1.12] font-medium tracking-[-0.045em] text-balance text-ink sm:text-[60px] lg:text-[68px]">
              GESP 考纲、试卷和学习进度，放在一个工具里看
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              给教师、教育管理者和家长使用。查 C++ 一到八级考点，上传 PDF 试卷逐题分析，再按课程进度安排下一步学习。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#tools" className={primary}>选择要用的功能 <ArrowRight size={16} aria-hidden /></a>
              <a href="#method" className={secondary}>看看判断依据</a>
            </div>
          </div>
          <Reveal delay={0.08}>
            <LevelPath />
          </Reveal>
        </div>
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 border-t border-line px-5 sm:grid-cols-3 sm:px-8 lg:px-12">
          {[
            ["01—08", "C++ 一至八级"],
            ["CCF", "考纲原文有出处"],
            ["3 项", "考纲、试卷、学习规划"],
          ].map(([value, label], index) => (
            <div key={label} className={`flex items-baseline gap-4 py-5 sm:px-6 ${index > 0 ? "border-t border-line sm:border-t-0 sm:border-l" : ""}`}>
              <span className="font-mono text-lg text-brand tabular-nums">{value}</span>
              <span className="text-sm text-muted">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="tools" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1344px]">
          <Reveal>
            <SectionHeading title="你想先做什么？" description="查某一级的要求、分析手上的试卷，或者看看当前学习进度，直接进入对应功能。" />
          </Reveal>
          <div className="mt-12 grid border-y border-line lg:grid-cols-3">
            {tools.map((tool, index) => (
              <Reveal key={tool.href} delay={index * 0.06} className={`${index > 0 ? "border-t border-line lg:border-t-0 lg:border-l" : ""}`}>
                <article className="flex h-full flex-col px-1 py-8 sm:px-6 lg:px-8">
                  <tool.icon size={22} strokeWidth={1.5} className="text-brand" aria-hidden />
                  <h3 className="mt-5 text-2xl font-medium tracking-[-0.02em] text-ink">{tool.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-muted">{tool.description}</p>
                  <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
                    {tool.details.map((detail) => <li key={detail} className="flex items-center gap-1.5"><Check size={13} className="text-brand" aria-hidden />{detail}</li>)}
                  </ul>
                  <Link data-tool-link href={tool.href} className="mt-7 inline-flex min-h-11 items-center justify-between border-t border-line pt-4 text-sm font-medium text-brand hover:underline">
                    {tool.action} <ArrowRight size={15} aria-hidden />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1d302b] px-5 py-20 text-[#edf3ef] sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1344px]">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <h2 className="text-3xl leading-tight font-medium tracking-[-0.03em] sm:text-4xl">从看考纲到安排学习</h2>
              <p className="max-w-2xl text-base leading-8 text-[#b8c9bf] lg:justify-self-end">先确定等级，再看要求、分析题目，最后决定接下来补什么。需要时，随时回到考纲或试卷核对。</p>
            </div>
          </Reveal>
          <div className="relative mt-14">
            <span className="absolute left-0 right-0 top-5 hidden h-px bg-[#466054] md:block" aria-hidden />
            <ol className="grid gap-8 md:grid-cols-4 md:gap-6">
              {process.map(([title, description], index) => (
                <ProcessItem key={title} delay={index * 0.07}>
                  <span className="relative z-10 grid size-10 place-items-center rounded-full border border-[#6f8c7d] bg-[#1d302b] font-mono text-xs text-[#d4ad66]">0{index + 1}</span>
                  <h3 className="mt-5 text-lg font-medium">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#b8c9bf]">{description}</p>
                </ProcessItem>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1344px]">
          <Reveal>
            <SectionHeading title="八级考什么，直接点开看" description="不用在整份 PDF 里来回翻。选一级，就能看到这一级的考点、题型和限制。" />
          </Reveal>
          <div className="mt-12 grid border-t border-line md:grid-cols-2">
            {levels.map((level) => {
              const count = catalogFor(level).filter((entry) => entry.kind === "topic" && entry.level === level).length;
              return (
                <Link
                  key={level}
                  href={syllabusHref(level)}
                  className="group grid grid-cols-[48px_1fr_auto] items-center gap-4 border-b border-line py-5 md:odd:border-r md:odd:pr-6 md:even:pl-6"
                >
                  <span className="font-mono text-sm text-brand tabular-nums">{String(level).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-medium text-ink group-hover:text-brand">{unitTitles.cpp[level]}</span>
                    <span className="mt-1 block text-xs text-muted">GESP {levelNames[level]} · {count} 项考点</span>
                  </span>
                  <ArrowRight size={16} className="text-muted transition-[color,transform] group-hover:translate-x-1 group-hover:text-brand" aria-hidden />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-quiet px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1344px]">
          <Reveal>
            <SectionHeading title="不是只告诉你“超纲”" description="每道题都列出相关考点、得分点和原文位置。你可以展开看理由，也可以回到试卷和考纲核对。" />
          </Reveal>
          <Reveal className="mt-12" delay={0.08}>
            <AnalysisDemo />
          </Reveal>
          <div className="mt-6 flex justify-end">
            <Link data-tool-link href="/analyze" className={primary}>上传一份试卷 <ArrowRight size={16} aria-hidden /></Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1344px]">
          <Reveal>
            <SectionHeading title="根据已完成的课次安排下一步" description="四个课程阶段对应不同 GESP 等级。选课程和课次后，会看到已学内容、未学内容和参考报考等级。" />
          </Reveal>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            <Reveal>
              <ol className="grid gap-0 border-y border-line sm:grid-cols-4">
                {courseInfo.levels.map((course, index) => (
                  <li key={course.id} className={`relative py-6 sm:px-5 ${index > 0 ? "border-t border-line sm:border-t-0 sm:border-l" : ""}`}>
                    <span className="font-mono text-xs text-brand">LEVEL {course.id}</span>
                    <h3 className="mt-3 text-lg font-medium text-ink">{course.description}</h3>
                    <p className="mt-2 text-sm text-muted">GESP {course.targetGesp}</p>
                    <p className="mt-4 text-xs text-muted tabular-nums">{course.totalLessons} 课次</p>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal delay={0.08}>
              <aside className="border-y border-line py-6 lg:px-2">
                <p className="text-sm text-muted">示例：Level 1 学到第 12 课</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-mono text-5xl text-brand tabular-nums">{sampleProbability}%</span>
                  <span className="text-sm text-muted">GESP 一级准备程度</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">这个数字只按课程覆盖情况估算，不代表考试成绩。报考前还要结合学生的独立作答表现。</p>
                <Link data-tool-link href="/plan" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline">查看我的学习进度 <ArrowRight size={15} aria-hidden /></Link>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="method" className="scroll-mt-24 border-y border-line bg-surface px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1344px]">
          <Reveal>
            <SectionHeading title="结论旁边，能看到理由和出处" description="工具只提供参考，不替老师下结论。遇到超纲判断或报考建议，可以查看依据，也要注意估算的限制。" />
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {[
              [ShieldCheck, "考纲有出处", `C++ 考纲采用 ${revisionDate} 修订版。考点、题型和适用边界都附 CCF 原文页码。`],
              [Waypoints, "按解题所需判断", "看完成这道题最少需要哪些知识。可选解法和干扰项另外说明。"],
              [Printer, "报告能核对也能打印", "报告保留题目、考点和理由，也可以填写教师、学生和课程进度。"],
            ].map(([Icon, title, description]) => (
              <div key={title as string} className="border-t border-line pt-6">
                <Icon size={20} strokeWidth={1.5} className="text-brand" aria-hidden />
                <h3 className="mt-4 text-lg font-medium text-ink">{title as string}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{description as string}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-5 border-t border-line pt-6 text-sm">
            <a href={syllabusSources.revision} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand hover:underline">查看考纲修订说明 <ArrowUpRight size={14} aria-hidden /></a>
            <a href={syllabusSources.code} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand hover:underline">打开 CCF 标准原文 <ArrowUpRight size={14} aria-hidden /></a>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[1344px] gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <Reveal>
            <div>
              <h2 className="text-3xl font-medium tracking-[-0.03em] text-ink sm:text-4xl">常见问题</h2>
              <p className="mt-4 text-base leading-7 text-muted">关于支持范围、判断方法和使用方式，这里直接回答。</p>
            </div>
          </Reveal>
          <div className="border-t border-line">
            {faqs.map(([question, answer]) => (
              <details data-faq key={question} className="group border-b border-line">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-medium text-ink marker:hidden">
                  {question}
                  <ChevronDown size={17} className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" aria-hidden />
                </summary>
                <p className="max-w-3xl pb-6 pr-8 text-sm leading-7 text-muted">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-wash px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1344px]">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h2 className="max-w-2xl text-3xl leading-tight font-medium tracking-[-0.03em] text-ink sm:text-4xl">现在，先从你要做的事开始</h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted">查考纲、分析试卷，或看看目前的学习进度。</p>
              </div>
              <Route size={36} strokeWidth={1.25} className="hidden text-brand lg:block" aria-hidden />
            </div>
          </Reveal>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {tools.map((tool) => (
              <Link data-tool-link key={tool.href} href={tool.href} className={secondary}>{tool.title} <ArrowRight size={15} aria-hidden /></Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
