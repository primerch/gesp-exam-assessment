"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { catalogFor, levelNames, levels } from "../../data/official-syllabus";
import { syllabusHref } from "../../lib/syllabus-links";
import { unitTitles } from "../SyllabusBrowser";

const positions = [
  [10, 25], [36.7, 25], [63.3, 25], [90, 25],
  [90, 72], [63.3, 72], [36.7, 72], [10, 72],
];

export default function LevelPath({ initialLevel = 1 }: { initialLevel?: number }) {
  const [selected, setSelected] = useState(initialLevel);
  const reduceMotion = useReducedMotion();
  const topics = catalogFor(selected).filter((entry) => entry.kind === "topic" && entry.level === selected);

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_20px_60px_rgb(27_48_41/8%)]" aria-label="GESP 八级互动路径">
      <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-sm font-medium text-ink">GESP C++ 备考路径</h2>
          <p className="mt-1 text-xs text-muted">选择等级，查看对应学习阶段</p>
        </div>
        <span className="font-mono text-xs text-muted tabular-nums">01—08</span>
      </div>

      <div data-level-path className="relative mx-3 h-[260px] sm:mx-6 sm:h-[280px]">
        <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <path d="M10 25 H90 Q94 25 94 29 V68 Q94 72 90 72 H10" fill="none" stroke="var(--workspace-line)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <motion.path
            d="M10 25 H90 Q94 25 94 29 V68 Q94 72 90 72 H10"
            fill="none"
            stroke="var(--workspace-brand)"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduceMotion ? 0 : 1.2, ease: [0.23, 1, 0.32, 1] }}
          />
        </svg>
        {levels.map((level, index) => {
          const active = selected === level;
          return (
            <button
              key={level}
              type="button"
              aria-pressed={active}
              aria-label={`GESP ${levelNames[level]}：${unitTitles.cpp[level]}`}
              onClick={() => setSelected(level)}
              className="absolute flex w-[24%] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-lg text-center"
              style={{ left: `${positions[index][0]}%`, top: `${positions[index][1]}%` }}
            >
              <span className={`relative grid size-10 place-items-center rounded-full border font-mono text-xs transition-[border-color,background-color,color] duration-200 ${active ? "border-[var(--workspace-current)] bg-[var(--workspace-current)] text-white" : "border-line bg-surface text-muted hover:border-brand hover:text-brand"}`}>
                {String(level).padStart(2, "0")}
                {active && <motion.span layoutId="level-current" className="absolute -inset-1.5 rounded-full border border-[var(--workspace-current)]" transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.23, 1, 0.32, 1] }} />}
              </span>
              <span className={`text-xs ${active ? "font-medium text-ink" : "text-muted"}`}>{levelNames[level]}</span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-line bg-quiet px-5 py-5 sm:px-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selected}
            initial={{ opacity: 0, transform: "translateY(8px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            exit={{ opacity: 0, transform: "translateY(-8px)" }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-brand">GESP {levelNames[selected]}</p>
                <h3 className="mt-1 text-xl font-medium tracking-[-0.02em] text-ink">{unitTitles.cpp[selected]}</h3>
              </div>
              <span className="whitespace-nowrap font-mono text-xs text-muted tabular-nums">{topics.length} 项考点</span>
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{topics.slice(0, 4).map((entry) => entry.title).join("、")}</p>
            <Link href={syllabusHref(selected)} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
              查看本级完整考纲 <ArrowUpRight size={14} aria-hidden />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
