"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Target, TrendingUp } from "lucide-react";
import { gespLevels } from "../data/curriculum-data";
import { AnimatedNumber } from "./animations";

interface ExamPredictionProps {
  probabilities: Record<number, number>;
  recommendedExam: { level: number; probability: number } | null;
  currentLevel: number;
}

function statusFor(probability: number) {
  if (probability >= 90) return "掌握较充分";
  if (probability >= 70) return "建议巩固";
  if (probability >= 50) return "可冲刺";
  return "准备中";
}

function explanationFor(probability: number) {
  if (probability >= 95) return "知识点覆盖较全面";
  if (probability >= 85) return "掌握大部分知识点";
  if (probability >= 70) return "掌握主要知识点，建议巩固";
  if (probability >= 50) return "基础有缺口，需针对性复习";
  return "知识点不足，建议继续学习";
}

export default function ExamPrediction({ probabilities, recommendedExam }: ExamPredictionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={19} strokeWidth={1.5} className="text-brand" aria-hidden />
          <h2 className="text-lg font-medium text-ink">GESP 准备程度估算</h2>
        </div>
        <span className="text-xs text-muted">基于课程覆盖，不代表实际考试结果</span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-xl bg-wash p-5">
          <div className="flex items-center gap-2 text-sm text-brand"><Target size={16} aria-hidden />建议报考</div>
          {recommendedExam ? (
            <motion.div
              key={recommendedExam.level}
              initial={{ opacity: 0, transform: "translateY(8px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.23, 1, 0.32, 1] }}
              className="mt-5"
            >
              <p className="text-3xl font-medium tracking-[-0.03em] text-ink">GESP {recommendedExam.level} 级</p>
              <p className="mt-2 text-sm text-muted">{gespLevels[recommendedExam.level - 1]?.description}</p>
              <div className="mt-6 flex items-baseline gap-2">
                <AnimatedNumber value={recommendedExam.probability} suffix="%" className="font-mono text-4xl text-brand tabular-nums" />
                <span className="text-xs text-muted">课程覆盖估算</span>
              </div>
              <p className="mt-5 border-t border-line pt-4 text-sm leading-6 text-muted">{explanationFor(recommendedExam.probability)}</p>
            </motion.div>
          ) : (
            <div className="mt-5">
              <p className="text-xl font-medium text-ink">暂不建议报考</p>
              <p className="mt-3 text-sm leading-6 text-muted">当前进度对应的各级估算均不足 70%，建议先继续学习并独立练习。</p>
            </div>
          )}
        </aside>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {recommendedExam ? `建议报考 GESP ${recommendedExam.level} 级，准备程度估算 ${recommendedExam.probability}%` : "当前进度暂不建议报考"}
        </p>

        <div className="flex flex-col gap-1">
          {gespLevels.map((level) => {
            const probability = probabilities[level.level] || 0;
            const recommended = recommendedExam?.level === level.level;
            return (
              <div key={level.level} className={`grid grid-cols-[64px_1fr_48px] items-center gap-3 rounded-lg border px-3 py-2.5 ${recommended ? "border-current bg-wash" : "border-transparent"}`}>
                <div>
                  <span className="block text-sm font-medium text-ink">GESP {level.level}</span>
                  <span className="mt-0.5 block text-[11px] text-muted">{statusFor(probability)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-quiet" role="progressbar" aria-label={`GESP ${level.level} 准备程度`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={probability}>
                  <motion.div
                    className={`h-full w-full origin-left ${probability >= 50 ? "bg-brand" : "bg-line"}`}
                    initial={{ transform: "scaleX(0)" }}
                    animate={{ transform: `scaleX(${Math.min(probability, 100) / 100})` }}
                    transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.23, 1, 0.32, 1] }}
                  />
                </div>
                <span className={`text-right font-mono text-sm tabular-nums ${probability >= 70 ? "text-brand" : "text-muted"}`}>{probability}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
