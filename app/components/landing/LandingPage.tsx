"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Printer,
  ShieldCheck,
  Waypoints,
} from "lucide-react";
import { Badge } from "@/components/reui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/reui/alert";
import HeroWorkspace from "./HeroWorkspace";
import { Button } from "@/app/components/ui/button";
import { ButtonGroup } from "@/app/components/ui/button-group";
import { Progress } from "@/app/components/ui/progress";
import Reveal from "../motion/Reveal";
import AnalysisDemo from "./AnalysisDemo";
import ProcessStepper from "./ProcessStepper";
import CourseTimeline from "./CourseTimeline";
import ToolPanels from "./ToolPanels";
import SyllabusTabs from "./SyllabusTabs";
import FaqAccordion from "./FaqAccordion";
import { revisionDate, syllabusSources } from "../../data/official-syllabus";
import { calculatePassProbability } from "../../data/curriculum-data";
import { getCourseSummary } from "../../lib/course-summary";

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
  const courseSummary = getCourseSummary();

  return (
    <main id="main-content" className="overflow-hidden">
      <section className="border-b border-[#2d4037] bg-[#14231d] text-[#edf3ef]">
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
          <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h1 className="max-w-[13ch] text-[44px] leading-[1.08] font-medium tracking-[-0.045em] text-balance sm:text-[64px] lg:text-[76px]">
                GESP 备考，先把标准看清楚
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#b8c9bf]">
                考纲能查，试卷能析，学习进度能排。每一项判断都附 CCF 原文和页码，给教师、教育管理者和家长使用。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="min-h-11 bg-[#edf3ef] text-[#1d302b] hover:bg-white">
                  <a href="#tools">选择要用的功能 <ArrowRight size={16} aria-hidden /></a>
                </Button>
                <Button asChild variant="outline" size="lg" className="min-h-11 border-[#6f8c7d] bg-transparent text-[#edf3ef] hover:bg-[#243a30] hover:text-white">
                  <a href="#method">看看判断依据</a>
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Badge variant="outline" className="border-[#466054] bg-transparent text-[#c4d2c8]">C++ 一至八级</Badge>
              <Badge variant="outline" className="border-[#466054] bg-transparent text-[#c4d2c8]">CCF 原文页码可核对</Badge>
            </div>
          </div>
          <Reveal className="mt-12" delay={0.08}>
            <HeroWorkspace />
          </Reveal>
        </div>
      </section>

      <section id="tools" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1344px]">
          <Reveal>
            <SectionHeading title="你想先做什么？" description="查某一级的要求、分析手上的试卷，或者看看当前学习进度，直接进入对应功能。" />
          </Reveal>
          <div className="mt-12">
            <ToolPanels />
          </div>
        </div>
      </section>

      <section className="bg-[#1d302b] px-5 py-20 text-[#edf3ef] sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1344px]">
          <Reveal>
            <div className="mb-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <h2 className="text-3xl leading-tight font-medium tracking-[-0.03em] sm:text-4xl">从看考纲到安排学习</h2>
              <p className="max-w-2xl text-base leading-8 text-[#b8c9bf] lg:justify-self-end">先确定等级，再看要求、分析题目，最后决定接下来补什么。需要时，随时回到考纲或试卷核对。</p>
            </div>
          </Reveal>
          <ProcessStepper />
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1344px]">
          <Reveal>
            <SectionHeading title="八级考什么，直接点开看" description="不用在整份 PDF 里来回翻。选一级，就能看到这一级的考点、题型和限制。" />
          </Reveal>
          <div className="mt-12">
            <SyllabusTabs />
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
            <Button asChild className="min-h-11">
              <Link data-tool-link href="/analyze">上传一份试卷 <ArrowRight size={16} aria-hidden /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1344px]">
          <Reveal>
            <SectionHeading title="根据已完成的课次安排下一步" description={`${courseSummary.total} 节真实课程分为四个阶段。选课程和课次后，会看到已学内容、未学内容和参考报考等级。`} />
          </Reveal>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            <Reveal>
              <CourseTimeline />
            </Reveal>
            <Reveal delay={0.08}>
              <aside className="rounded-xl border border-line bg-surface p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted">示例：Level 1 学到第 12 课</p>
                  <Badge variant="primary-light">准备程度估算</Badge>
                </div>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-mono text-5xl text-brand tabular-nums">{sampleProbability}%</span>
                  <span className="text-sm text-muted">GESP 一级</span>
                </div>
                <Progress value={sampleProbability} className="mt-5 h-2" aria-label="GESP 一级准备程度估算" />
                <p className="mt-4 text-sm leading-6 text-muted">这个数字只按课程覆盖情况估算，不代表考试成绩。报考前还要结合学生的独立作答表现。</p>
                <Button asChild variant="outline" className="mt-5 w-full min-h-11">
                  <Link data-tool-link href="/plan">查看我的学习进度 <ArrowRight size={15} aria-hidden /></Link>
                </Button>
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
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <Alert variant="default" className="border-line bg-surface shadow-none">
              <ShieldCheck aria-hidden />
              <AlertTitle>考纲有出处</AlertTitle>
              <AlertDescription>C++ 考纲采用 {revisionDate} 修订版。考点、题型和适用边界都附 CCF 原文页码。</AlertDescription>
            </Alert>
            <Alert variant="info" className="shadow-none">
              <Waypoints aria-hidden />
              <AlertTitle>按解题所需判断</AlertTitle>
              <AlertDescription>看完成这道题最少需要哪些知识。可选解法和干扰项另外说明。</AlertDescription>
            </Alert>
            <Alert variant="default" className="border-line bg-surface shadow-none">
              <Printer aria-hidden />
              <AlertTitle>报告能核对也能打印</AlertTitle>
              <AlertDescription>报告保留题目、考点和理由，也可以填写教师、学生和课程进度。</AlertDescription>
            </Alert>
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
          <FaqAccordion />
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
              <Badge variant="primary-light" size="xl">GESP 考级宝</Badge>
            </div>
          </Reveal>
          <ButtonGroup className="mt-10 w-full sm:w-auto">
            <Button asChild variant="outline" className="min-h-11 flex-1">
              <Link data-tool-link href="/syllabus">等级考纲 <ArrowRight size={15} aria-hidden /></Link>
            </Button>
            <Button asChild variant="outline" className="min-h-11 flex-1">
              <Link data-tool-link href="/analyze">试卷分析 <ArrowRight size={15} aria-hidden /></Link>
            </Button>
            <Button asChild variant="outline" className="min-h-11 flex-1">
              <Link data-tool-link href="/plan">学习规划 <ArrowRight size={15} aria-hidden /></Link>
            </Button>
          </ButtonGroup>
        </div>
      </section>
    </main>
  );
}
