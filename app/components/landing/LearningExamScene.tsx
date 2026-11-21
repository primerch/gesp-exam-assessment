"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BookOpen, FileSearch, ShieldCheck } from "lucide-react";
import useHydratedReducedMotion from "@/app/components/motion/useHydratedReducedMotion";
import { NumberTicker } from "@/app/components/ui/number-ticker";
import { calculatePassProbability, courseInfo, getRecommendedExam } from "../../data/curriculum-data";
import { levelNames, syllabusSources } from "../../data/official-syllabus";
import { getCourseSummary } from "../../lib/course-summary";

export default function LearningExamScene() {
  const reduceMotion = useHydratedReducedMotion();
  const summary = getCourseSummary();
  const probability = calculatePassProbability(1, 12)[1];
  const recommendation = getRecommendedExam(1, 12);

  return (
    <section id="learning-exam" className="relative overflow-hidden bg-[#eeeae0] px-5 py-20 text-[#17231d] sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-[#7b531d]">COURSE → EXAM</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.12] tracking-[-0.035em] sm:text-5xl"><span className="block">把课程进度，</span><span className="block">放到考试坐标里</span></h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-lg text-sm leading-7 text-[#55665f]">四个课程阶段，{summary.total} 个真实课次。选择已完成的课次，查看当前覆盖和参考报考等级。</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link href="/plan" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#285f51] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1e4c40]">选择我的课次 <ArrowRight size={15} /></Link>
              <Link href="/analyze" className="inline-flex min-h-11 items-center gap-2 px-2 text-sm font-medium text-[#285f51] underline-offset-4 hover:underline"><FileSearch size={15} /> 分析一份试卷</Link>
            </div>
          </div>
        </div>

        <div className="relative mt-14 border-y border-[#c9c7bc] py-10 sm:mt-16">
          <motion.div
            className="absolute left-[6%] right-[6%] top-[47px] h-px origin-left bg-[#8b9a90]"
            initial={reduceMotion ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden
          />
          <ol className="relative grid grid-cols-2 gap-y-10 sm:grid-cols-4">
            {courseInfo.levels.map((level, index) => (
              <motion.li
                key={level.id}
                className="relative px-3 sm:px-5"
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : index * 0.1 }}
              >
                <div className="relative z-10 grid size-7 place-items-center rounded-full border border-[#8b9a90] bg-[#eeeae0] font-mono text-[10px] text-[#285f51]">0{level.id}</div>
                <p className="mt-5 font-mono text-[10px] tracking-[0.12em] text-[#6b756f]">LEVEL {level.id} / 24 课次</p>
                <h3 className="mt-2 font-display text-2xl">{level.description}</h3>
                <p className="mt-2 text-sm text-[#55665f]">目标 GESP {level.targetGesp}</p>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.article
            className="relative overflow-hidden rounded-xl bg-[#17231d] p-6 text-[#edf3ef] sm:p-8"
            initial={reduceMotion ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: reduceMotion ? 0 : 0.7 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] tracking-[0.16em] text-[#d4ad66]">学习进度示例</p>
                <h3 className="mt-3 font-display text-3xl">Level 1 · 第 12 课</h3>
              </div>
              <BookOpen className="text-[#82968b]" size={22} strokeWidth={1.5} aria-hidden />
            </div>
            <div className="mt-10 grid items-end gap-8 sm:grid-cols-[1fr_auto]">
              <div>
                <p className="text-sm text-[#a8b5ad]">参考报考等级</p>
                <p className="mt-2 font-display text-4xl text-[#f2f0e8]">GESP {recommendation ? levelNames[recommendation.level] : "暂未推荐"}</p>
                <Link href="/plan" className="mt-5 inline-flex items-center gap-2 text-sm text-[#d4ad66] underline-offset-4 hover:underline">查看自己的结果 <ArrowRight size={14} /></Link>
              </div>
              <div className="sm:text-right">
                <NumberTicker value={probability} startValue={probability} aria-label={`${probability}%`} className="font-mono text-6xl tracking-[-0.05em] text-[#d4ad66]" />
                <span className="font-mono text-2xl text-[#d4ad66]">%</span>
                <p className="mt-1 text-xs text-[#a8b5ad]">一级准备程度估算</p>
              </div>
            </div>
            <div className="mt-7 h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full origin-left bg-[#d4ad66]" initial={reduceMotion ? false : { scaleX: 0 }} whileInView={{ scaleX: probability / 100 }} viewport={{ once: true }} transition={{ duration: reduceMotion ? 0 : 0.9 }} />
            </div>
            <p className="mt-4 text-xs leading-5 text-[#82968b]">只按课程覆盖估算，不代表考试成绩。报考前还要结合独立作答表现。</p>
          </motion.article>

          <motion.article
            className="rounded-xl border border-[#c9c7bc] bg-[#f7f4ec] p-6 sm:p-8"
            initial={reduceMotion ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.08 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] tracking-[0.16em] text-[#7b531d]">试卷报告演示</p>
                <h3 className="mt-3 font-display text-3xl">每道题，都能追到依据</h3>
              </div>
              <ShieldCheck className="text-[#285f51]" size={22} strokeWidth={1.5} aria-hidden />
            </div>
            <div className="mt-7 rounded-lg border border-[#d5d0c3] bg-white/60 p-4">
              <div className="flex items-center justify-between gap-3 text-xs text-[#6b756f]"><span>程序阅读 · 第 12 题</span><span className="text-[#285f51]">纲内</span></div>
              <div className="mt-4 flex items-center gap-2 text-[11px] text-[#55665f]"><span>单层循环</span><ArrowRight size={12} /><span>CCF 一级 · 第 5 页</span></div>
              <div className="mt-4 border-t border-[#d5d0c3] pt-3 text-xs leading-6 text-[#55665f]">解题需要跟踪 for 循环的起点、终点与每次输出，对应一级“单层循环”。</div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <Link href="/analyze" className="inline-flex items-center gap-2 text-sm font-medium text-[#285f51] underline-offset-4 hover:underline">上传我的试卷 <ArrowRight size={14} /></Link>
              <a href={syllabusSources.code} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-[#6b756f] hover:text-[#285f51]">CCF 标准原文 <ArrowUpRight size={12} /></a>
            </div>
          </motion.article>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-[#c9c7bc] pt-5 text-xs leading-6 text-[#6b756f] sm:flex-row sm:items-center sm:justify-between">
          <span>结论附 CCF 原文与页码 · 原课件出处可核对</span>
          <span>Reacher 独立作品 · 不代表 CCF 官方立场</span>
        </div>
      </div>
    </section>
  );
}
