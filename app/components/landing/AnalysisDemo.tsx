"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, FileText, ScanSearch } from "lucide-react";
import { syllabusSources } from "../../data/official-syllabus";

const stages = [
  {
    name: "读取题目",
    label: "识别题目要求",
    title: "先理解程序实际要求",
    description: "读取题目文字、代码与答案结构，保留题号和原始内容，再进入考点对照。",
  },
  {
    name: "对照考点",
    label: "关联一级第 12 条",
    title: "单层循环是本题的直接要求",
    description: "解题需要跟踪 for 循环的初始值、边界和每次输出，对应 GESP 一级“单层循环”考点。",
  },
  {
    name: "形成判断",
    label: "回到 CCF 原文",
    title: "每个结论都保留出处",
    description: "报告同时呈现考点、得分要点与原文页码；可选解法和干扰项不会混淆最低知识要求。",
  },
];

export default function AnalysisDemo() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2 text-sm text-muted">
          <ScanSearch size={17} strokeWidth={1.5} aria-hidden />
          逐题研判界面演示
        </div>
        <span className="text-xs text-muted">示例内容，非用户成绩</span>
      </div>

      <div className="relative grid grid-cols-3 border-b border-line" role="group" aria-label="研判步骤">
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-wash" aria-hidden />
        <motion.span
          className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-brand"
          animate={{ transform: `scaleX(${(active + 1) / stages.length})` }}
          transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.23, 1, 0.32, 1] }}
          aria-hidden
        />
        {stages.map((stage, index) => (
          <button
            key={stage.name}
            type="button"
            aria-pressed={active === index}
            onClick={() => setActive(index)}
            className={`flex min-h-20 flex-col items-start justify-center gap-1 px-3 text-left transition-colors sm:px-6 ${active === index ? "text-brand" : "text-muted hover:text-ink"}`}
          >
            <span className="font-mono text-[11px] tabular-nums">0{index + 1}</span>
            <span className="text-sm font-medium">{stage.name}</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-line bg-[#1d302b] p-5 text-[#e8eee9] sm:p-6 lg:border-r lg:border-b-0">
          <div className="flex items-center gap-2 text-xs text-[#b8c9bf]">
            <FileText size={15} aria-hidden /> 一级示例题 · 程序阅读
          </div>
          <pre className="mt-5 overflow-x-auto font-mono text-sm leading-7"><code>{`for (int i = 1; i <= 5; i++) {\n  cout << i;\n}`}</code></pre>
          <p className="mt-5 text-sm leading-6 text-[#b8c9bf]">问题：程序按顺序输出哪些数字？</p>
          <div className="mt-4 border-t border-[#3b5146] pt-4 font-mono text-sm text-[#d4ad66]">输出：12345</div>
        </div>

        <div className="flex min-h-[280px] flex-col justify-between p-5 sm:p-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, transform: "translateY(10px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={{ opacity: 0, transform: "translateY(-10px)" }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.23, 1, 0.32, 1] }}
            >
              <p className="text-sm text-brand">{stages[active].label}</p>
              <h3 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-ink">{stages[active].title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted">{stages[active].description}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <span className="inline-flex items-center gap-2 text-sm text-ink"><Check size={16} className="text-brand" aria-hidden />依据随结论保留</span>
            <a href={`${syllabusSources.code}#page=5`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-brand hover:underline">
              CCF 一级原文 · 第 5 页 <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
