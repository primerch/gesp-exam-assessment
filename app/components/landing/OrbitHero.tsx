"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, FileUp, Route } from "lucide-react";
import { TextMorph } from "@/app/components/motion";
import useHydratedReducedMotion from "@/app/components/motion/useHydratedReducedMotion";
import OrbitPaperScene from "./OrbitPaperScene";

const stageNames = ["看题目", "查考点", "看结果"];

export default function OrbitHero() {
  const [active, setActive] = useState(0);
  const reduceMotion = useHydratedReducedMotion();
  const displayedActive = active;
  const enter = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="relative isolate min-h-[calc(100svh-5rem)] overflow-hidden bg-[#0b120f] text-[#edf3ef]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(145,167,153,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(145,167,153,0.2)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" aria-hidden />
      <motion.div
        className="pointer-events-none absolute left-[-0.035em] top-[2%] whitespace-nowrap font-sans text-[29vw] font-bold leading-none tracking-[-0.075em] text-[#d8dfd5]/[0.075] sm:top-[-4%]"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.4, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden
      >
        GESP
      </motion.div>
      <motion.div
        className="pointer-events-none absolute right-[4%] top-[8%] hidden font-mono text-[11px] tracking-[0.2em] text-[#82968b] lg:block"
        {...enter(0.7)}
        aria-hidden
      >
        C++ 一级至八级
      </motion.div>

      <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-[1600px] grid-rows-[auto_1fr] px-5 pb-6 pt-8 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:grid-rows-1 lg:items-center lg:gap-4 lg:px-12 lg:pb-10 lg:pt-0">
        <div className="relative z-20 self-start lg:self-center">
          <h1 className="font-display text-4xl leading-[1.12] tracking-[-0.035em] text-[#f2f0e8] sm:text-5xl lg:text-[clamp(2.625rem,4.25vw,4rem)]">
            <motion.span {...enter(0.05)} className="block">GESP C++</motion.span>
            <motion.span {...enter(0.15)} className="block">考纲与试卷分析</motion.span>
          </h1>
          <motion.p {...enter(0.28)} className="mt-5 max-w-md text-sm leading-7 text-[#a8b5ad] sm:text-base">
            上传 PDF 试卷，逐题看考了什么、有没有超纲。选最后学完的一课，也能查适合准备哪一级。
          </motion.p>
          <motion.div {...enter(0.4)} className="mt-7 flex flex-wrap gap-3">
            <Link href="/plan" className="inline-flex min-h-12 items-center gap-2 rounded-md bg-[#edf3ef] px-5 text-sm font-medium text-[#132019] transition-[background-color,transform] hover:bg-white active:scale-[0.98]">
              <Route size={16} aria-hidden /> 查报考建议 <ArrowRight size={15} aria-hidden />
            </Link>
            <Link href="/analyze" className="inline-flex min-h-12 items-center gap-2 rounded-md border border-[#52685b] bg-[#101a15]/70 px-5 text-sm font-medium text-[#edf3ef] backdrop-blur-sm transition-[background-color,border-color,transform] hover:border-[#d4ad66] hover:bg-[#17231d] active:scale-[0.98]">
              <FileUp size={16} aria-hidden /> 上传 PDF 试卷
            </Link>
          </motion.div>
          <motion.div {...enter(0.52)} className="mt-4 text-sm text-[#a8b5ad]">
            <Link href="/syllabus" className="inline-flex min-h-11 items-center underline decoration-[#52685b] underline-offset-4 transition-colors hover:text-[#d4ad66]">查 CCF 一级至八级考纲</Link>
          </motion.div>
        </div>

        <motion.div {...enter(0.3)} className="relative z-10 -mx-2 self-end lg:mx-0 lg:self-center">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#294638]/20 blur-[100px]" aria-hidden />
          <OrbitPaperScene active={displayedActive} onActiveChange={setActive} />
          <div className="pointer-events-none absolute -top-6 left-2 hidden items-center gap-3 font-mono text-[11px] tracking-[0.16em] text-[#82968b] sm:flex" aria-hidden>
            <span className="size-1 rounded-full bg-[#d4ad66]" />
            <TextMorph className="text-[#c4d2c8]">{stageNames[displayedActive]}</TextMorph>
            <span>0{displayedActive + 1} / 03</span>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#learning-exam"
        className="absolute bottom-5 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-[#82968b] transition-colors hover:text-[#d4ad66] lg:inline-flex"
        {...enter(0.85)}
      >
        看课程和报考建议 <ArrowDown size={12} aria-hidden />
      </motion.a>
      <p className="sr-only">同一道程序阅读题可以查看题目、对应的考纲和分析结果。</p>
    </section>
  );
}
