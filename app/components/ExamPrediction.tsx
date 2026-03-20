"use client";

import { motion } from "framer-motion";
import { TrendingUp, Target, Award, Zap, CheckCircle2 } from "lucide-react";
import { gespLevels } from "../data/curriculum-data";
import { AnimatedNumber } from "./animations";

interface ExamPredictionProps {
  probabilities: Record<number, number>;
  recommendedExam: { level: number; probability: number } | null;
  currentLevel: number;
}

export default function ExamPrediction({
  probabilities,
  recommendedExam,
}: ExamPredictionProps) {
  const getProbabilityColor = (prob: number) => {
    if (prob >= 90) return "text-emerald-600";
    if (prob >= 70) return "text-blue-600";
    if (prob >= 50) return "text-amber-600";
    return "text-slate-500";
  };

  const getProgressColor = (prob: number) => {
    if (prob >= 90) return "bg-emerald-500";
    if (prob >= 70) return "bg-blue-500";
    if (prob >= 50) return "bg-amber-500";
    return "bg-slate-400";
  };

  const getBgColor = (prob: number) => {
    if (prob >= 90) return "bg-emerald-50/70 border-emerald-200";
    if (prob >= 70) return "bg-blue-50/70 border-blue-200";
    if (prob >= 50) return "bg-amber-50/70 border-amber-200";
    return "bg-slate-50 border-slate-200";
  };

  const getRecommendationBadge = (prob: number) => {
    if (prob >= 90) return { text: "稳过", class: "bg-emerald-600" };
    if (prob >= 70) return { text: "推荐", class: "bg-blue-600" };
    if (prob >= 50) return { text: "冲刺", class: "bg-amber-500" };
    return { text: "准备中", class: "bg-slate-500" };
  };

  const getExplanation = (prob: number) => {
    if (prob >= 95) return "知识点全面掌握，稳过考试";
    if (prob >= 85) return "掌握大部分知识点，通过率高";
    if (prob >= 70) return "掌握主要知识点，建议巩固";
    if (prob >= 50) return "基础有缺口，需针对性复习";
    return "知识点不足，建议继续学习";
  };

  return (
    <div className="h-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 bg-blue-100 rounded-lg">
          <TrendingUp className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">GESP 考级通过率预测</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1">
        {/* Recommended Exam Card */}
        <div className="lg:col-span-1">
          <div className="h-full bg-blue-600 rounded-xl p-5 text-white relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
            
            <div className="relative">
              <div className="flex items-center gap-1.5 mb-4">
                <Target className="w-4 h-4 text-blue-200" />
                <span className="text-sm font-medium text-blue-100">推荐报考</span>
              </div>
              
              {recommendedExam ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-5xl font-bold tabular-nums">
                      {recommendedExam.level}
                    </span>
                    <span className="text-lg text-blue-200">级</span>
                  </div>
                  <div className="text-sm text-blue-200 mb-4">
                    {gespLevels[recommendedExam.level - 1]?.description}
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-3">
                    <AnimatedNumber 
                      value={recommendedExam.probability}
                      suffix="%"
                      className="text-3xl font-bold tabular-nums"
                    />
                    <span className="text-sm text-blue-200">预估通过率</span>
                  </div>
                  
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white ${getRecommendationBadge(recommendedExam.probability).class}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {getRecommendationBadge(recommendedExam.probability).text}
                  </span>
                  
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-sm text-blue-100">
                      {getExplanation(recommendedExam.probability)}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div>
                  <div className="text-2xl font-bold mb-2">暂不建议报考</div>
                  <p className="text-sm text-blue-200">
                    当前课程进度对应的所有GESP级别通过率均不足70%，建议继续学习
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* All Levels */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">通过率分析</span>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-slate-500">稳过</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-slate-500">推荐</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="text-slate-500">冲刺</span>
              </span>
            </div>
          </div>

          {/* Level List */}
          <div className="space-y-2">
            {gespLevels.map((level) => {
              const prob = probabilities[level.level] || 0;
              const badge = getRecommendationBadge(prob);
              
              return (
                <motion.div 
                  key={level.level}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: level.level * 0.03 }}
                  className={`group p-3 rounded-lg border transition-all hover:shadow-sm ${getBgColor(prob)}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Level Info */}
                    <div className="w-16 flex-shrink-0">
                      <div className="text-sm font-semibold text-slate-900">{level.name}</div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="flex-1 min-w-0">
                      <div className="h-2 bg-slate-200/70 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(prob, 100)}%` }}
                          transition={{ duration: 0.6, delay: level.level * 0.05 }}
                          className={`h-full rounded-full ${getProgressColor(prob)}`}
                        />
                      </div>
                    </div>
                    
                    {/* Probability */}
                    <div className="w-20 flex-shrink-0 text-right">
                      <div className={`text-lg font-bold tabular-nums ${getProbabilityColor(prob)}`}>
                        {prob}%
                      </div>
                      <div className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs text-white ${badge.class}`}>
                        <Zap className="w-3 h-3" />
                        {badge.text}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
