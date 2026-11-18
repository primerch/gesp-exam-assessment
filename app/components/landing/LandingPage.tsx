"use client";

import Link from "next/link";
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
    description: "从一级到八级，逐项查看 C++ 考点、适用边界、题型配分与 CCF 原文页码。",
    details: ["8 个等级", "条款级定位", "适用边界"],
    action: "查询考纲",
  },
  {
    href: "/analyze",
    icon: FileSearch,
    title: "试卷分析",
    description: "上传 PDF 试卷，逐题对照考点、得分要点和超纲依据，形成可打印的研判报告。",
    details: ["文字版与扫描件", "逐题研判", "原文依据"],
    action: "分析试卷",
  },
  {
    href: "/plan",
    icon: Gauge,
    title: "学习规划",
    description: "按现有课程级别与课次，查看知识覆盖、GESP 准备程度和建议报考等级。",
    details: ["95 个课次", "知识覆盖", "路径估算"],
    action: "规划进度",
  },
] as const;

const process = [
  ["选择目标等级", "先明确学生当前面对的 GESP 等级，不把不同级的要求混在一起。"],
  ["回到官方条款", "查看本级考点、适用边界与 CCF 原文，建立共同判断口径。"],
  ["检查真实题目", "把试卷中的每道题关联到所需知识、得分要点与依据。"],
  ["安排后续学习", "结合课程进度与知识覆盖，决定巩固内容和下一阶段的报考目标。"],
];

const faqs = [
  ["这是 CCF 官方工具吗？", "不是。GESP 考纲研判是 Reacher 独立作品，考纲内容与原文链接来自中国计算机学会，分析结果不代表 CCF 官方结论。"],
  ["目前支持哪些考试语言和等级？", "当前支持 C++ 一级至八级。考纲页可以逐级切换，试卷分析与学习规划也会保留所选等级。"],
  ["可以上传哪些 PDF 试卷？", "支持文字版、扫描件和包含图示的 PDF，单次最多 64 页、10 MB。加密或损坏的文件会显示明确的读取错误。"],
  ["超纲判断采用什么口径？", "按完成题目所需的最低知识要求判断。可选解法、干扰项和题目本身存在的问题会单独注明，避免因一种更复杂的解法而误判。"],
  ["学习规划中的通过概率代表什么？", "它是根据课程进度与知识点覆盖得到的估算，用于安排学习，不等于真实考试结果。实际报考能力仍需结合独立作答表现。"],
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

export default function LandingPage() {
  const sampleProbability = calculatePassProbability(1, 12)[1];

  return (
    <main id="main-content" className="overflow-hidden">
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16 lg:px-12 lg:py-24">
          <div>
            <h1 className="max-w-[12ch] text-[42px] leading-[1.12] font-medium tracking-[-0.045em] text-balance text-ink sm:text-[60px] lg:text-[68px]">
              从考纲条款到备考路径，每一步都有依据
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              为教育管理者、教师与家长整理的 GESP C++ 工作工具：查清各级要求，看懂一份试卷，再安排下一段学习。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#tools" className={primary}>选择你的工具 <ArrowRight size={16} aria-hidden /></a>
              <a href="#method" className={secondary}>了解研判依据</a>
            </div>
          </div>
          <Reveal delay={0.08}>
            <LevelPath />
          </Reveal>
        </div>
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 border-t border-line px-5 sm:grid-cols-3 sm:px-8 lg:px-12">
          {[
            ["01—08", "C++ 全等级覆盖"],
            ["CCF", "官方原文逐条追溯"],
            ["3 项", "考纲、分析、规划工作流"],
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
            <SectionHeading title="先确定任务，再进入工具" description="三项能力共享同一套等级与条款体系。你可以从任何一项开始，也可以把它们串成完整的教研流程。" />
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
              <h2 className="text-3xl leading-tight font-medium tracking-[-0.03em] sm:text-4xl">一条路径，串起四个判断</h2>
              <p className="max-w-2xl text-base leading-8 text-[#b8c9bf] lg:justify-self-end">不是把功能堆在一起，而是让目标、标准、题目和课程进度沿着同一条证据链前进。</p>
            </div>
          </Reveal>
          <ol className="relative mt-14 grid gap-8 md:grid-cols-4 md:gap-6">
            <span className="absolute left-0 right-0 top-5 hidden h-px bg-[#466054] md:block" aria-hidden />
            {process.map(([title, description], index) => (
              <Reveal key={title} delay={index * 0.07}>
                <li className="relative border-t border-[#466054] pt-6 md:border-t-0 md:pt-0">
                  <span className="relative z-10 grid size-10 place-items-center rounded-full border border-[#6f8c7d] bg-[#1d302b] font-mono text-xs text-[#d4ad66]">0{index + 1}</span>
                  <h3 className="mt-5 text-lg font-medium">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#b8c9bf]">{description}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1344px]">
          <Reveal>
            <SectionHeading title="八级要求，不需要在文档里反复寻找" description="每一级都有明确主题、考点数量和原文入口。选择等级即可进入完整条款，不用先下载再逐页查找。" />
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
            <SectionHeading title="试卷分析，不只给出一个“超纲”标签" description="从原始题目出发，关联所需知识和官方条款，再形成可检查、可打印的逐题报告。点击步骤，查看判断如何形成。" />
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
            <SectionHeading title="把课程进度放到 GESP 路径上理解" description="四个课程阶段对应不同 GESP 目标。选择已完成课次后，知识覆盖、通过概率估算和建议报考等级会一起更新。" />
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
                <p className="text-sm text-muted">课程进度示例 · Level 1 第 12 课</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-mono text-5xl text-brand tabular-nums">{sampleProbability}%</span>
                  <span className="text-sm text-muted">GESP 一级估算</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">这是课程覆盖模型的演示结果，不是个体考试预测。实际报考还需结合独立作答。</p>
                <Link data-tool-link href="/plan" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline">查看我的学习路径 <ArrowRight size={15} aria-hidden /></Link>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="method" className="scroll-mt-24 border-y border-line bg-surface px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1344px]">
          <Reveal>
            <SectionHeading title="专业判断，需要把依据和边界一起展示" description="工具不替代教师判断，也不把估算包装成确定结论。所有关键信息都应能被检查。" />
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {[
              [ShieldCheck, "原文可查", `C++ 考纲采用 ${revisionDate} 修订版。考点、题型和适用边界保留 CCF 原文页码与链接。`],
              [Waypoints, "按最低要求判断", "逐题分析以完成题目所需的最低知识要求为口径，可选解法和干扰项单独说明。"],
              [Printer, "报告保留上下文", "教师、学生、课程进度与目标等级可进入报告，打印时保留判断依据而非营销内容。"],
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
              <p className="mt-4 text-base leading-7 text-muted">关于工具范围、判断口径与使用方式的具体说明。</p>
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
                <h2 className="max-w-2xl text-3xl leading-tight font-medium tracking-[-0.03em] text-ink sm:text-4xl">从当前最需要弄清的问题开始</h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted">查一级要求、看一份试卷，或把已经完成的课次放到完整备考路径中。</p>
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
