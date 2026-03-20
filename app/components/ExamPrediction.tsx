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
    if (prob >= 90) return "from-emerald-500 to-emerald-400";
    if (prob >= 70) return "from-blue-500 to-blue-400";
    if (prob >= 50) return "from-amber-500 to-amber-400";
    return "from-slate-400 to-slate-300";
  };

  const getBgColor = (prob: number) => {
    if (prob >= 90) return "bg-emerald-50 border-emerald-200";
    if (prob >= 70) return "bg-blue-50 border-blue-200";
    if (prob >= 50) return "bg-amber-50 border-amber-200";
    return "bg-slate-50 border-slate-200";
  };

  const getRecommendationBadge = (prob: number) => {
    if (prob >= 90) return { text: "稳过", color: "bg-emerald-500 text-white" };
    if (prob >= 70) return { text: "推荐", color: "bg-blue-500 text-white" };
    if (prob >= 50) return { text: "冲刺", color: "bg-amber-500 text-white" };
    return { text: "准备中", color: "bg-slate-400 text-white" };
  };

  const getExplanation = (prob: number) => {
    if (prob >= 95) return "知识点全面掌握，稳过考试";
    if (prob >= 85) return "掌握大部分知识点，通过率高";
    if (prob >= 70) return "掌握主要知识点，建议巩固";
    if (prob >= 50) return "基础有缺口，需针对性复习";
    return "知识点不足，建议继续学习";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-xl">
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">GESP 考级通过率预测</h2>
          <p className="text-sm text-slate-500">8个等级实时概率分析</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Recommended Exam Card */}
        <div className="lg:col-span-1">
          <div className="h-full bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-500/20">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5" />
                <span className="font-semibold">推荐报考</span>
              </div>
              
              {recommendedExam ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-6xl font-bold mb-2 tabular-nums">
                    {recommendedExam.level}
                    <span className="text-2xl font-normal text-blue-100">级</span>
                  </div>
                  <div className="text-blue-100 mb-6">
                    {gespLevels[recommendedExam.level - 1]?.description}
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <AnimatedNumber 
                      value={recommendedExam.probability}
                      suffix="%"
                      className="text-4xl font-bold tabular-nums"
                    />
                    <span className="text-sm text-blue-100">预估通过率</span>
                  </div>
                  
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getRecommendationBadge(recommendedExam.probability).color}`}>
                    <CheckCircle2 className="w-4 h-4" />
                    {getRecommendationBadge(recommendedExam.probability).text}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-sm text-blue-100 leading-relaxed">
                      {getExplanation(recommendedExam.probability)}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col justify-center">
                  <div className="text-3xl font-bold mb-3">暂不建议报考</div>
                  <div className="text-blue-100 text-sm">
                    当前课程进度对应的所有GESP级别通过率均不足70%，建议继续学习
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* All Levels */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500">通过率分析</span>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-500">稳过</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-slate-500">推荐</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-slate-500">冲刺</span>
              </span>
            </div>
          </div>

          {/* Level List */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {gespLevels.map((level) => {
              const prob = probabilities[level.level] || 0;
              const badge = getRecommendationBadge(prob);
              
              return (
                <motion.div 
                  key={level.level}
                  variants={itemVariants}
                  className={`group p-4 rounded-2xl border transition-all duration-300 hover:shadow-md ${getBgColor(prob)}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Level Info */}
                    <div className="w-20 flex-shrink-0">
                      <div className="font-semibold text-slate-900">{level.name}</div>
                      <div className="text-xs text-slate-500">{level.description}</div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="flex-1">
                      <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(prob, 100)}%` }}
                          transition={{ duration: 0.8, delay: level.level * 0.05 }}
                          className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(prob)}`}
                        />
                      </div>
                    </div>
                    
                    {/* Probability */}
                    <div className="w-24 flex-shrink-0 text-right">
                      <div className={`text-xl font-bold tabular-nums ${getProbabilityColor(prob)}`}>
                        {prob}%
                      </div>
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${badge.color}`}>
                        <Zap className="w-3 h-3" />
                        {badge.text}
                      </div>
                    </div>
                  </div>
                  
                  {/* Explanation on hover */}
                  <div className="mt-2 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {getExplanation(prob)}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
