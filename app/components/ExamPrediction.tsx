"use client";

import { TrendingUp, Target, Award, AlertCircle, Info, ChevronRight } from "lucide-react";
import { gespLevels, calculateGespCoverage } from "../data/curriculum-data";

interface ExamPredictionProps {
  probabilities: Record<number, number>;
  recommendedExam: { level: number; probability: number } | null;
}

export default function ExamPrediction({
  probabilities,
  recommendedExam,
}: ExamPredictionProps) {
  // 根据概率获取颜色
  const getProbabilityColor = (prob: number) => {
    if (prob >= 90) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (prob >= 70) return "text-blue-600 bg-blue-50 border-blue-200";
    if (prob >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-slate-500 bg-slate-100 border-slate-200";
  };

  const getProgressColor = (prob: number) => {
    if (prob >= 90) return "bg-emerald-500";
    if (prob >= 70) return "bg-blue-500";
    if (prob >= 50) return "bg-amber-500";
    return "bg-slate-400";
  };

  const getRecommendationBadge = (prob: number) => {
    if (prob >= 90) return { text: "稳过", color: "bg-emerald-100 text-emerald-700" };
    if (prob >= 70) return { text: "推荐", color: "bg-blue-100 text-blue-700" };
    if (prob >= 50) return { text: "冲刺", color: "bg-amber-100 text-amber-700" };
    return { text: "准备中", color: "bg-slate-100 text-slate-600" };
  };

  // 生成通过率解释
  const getProbabilityExplanation = (level: number, prob: number) => {
    if (prob >= 95) {
      return "已掌握全部核心知识点，可稳过";
    } else if (prob >= 85) {
      return "掌握大部分知识点，通过率高";
    } else if (prob >= 70) {
      return "掌握主要知识点，建议加强练习";
    } else if (prob >= 50) {
      return "基础知识点有缺口，需针对性复习";
    } else {
      return "知识点掌握不足，建议继续学习";
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-900">GESP 考级通过率预测</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 推荐考试 */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white h-full">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5" />
              <span className="font-semibold">推荐报考</span>
            </div>
            
            {recommendedExam ? (
              <div>
                <div className="text-5xl font-bold mb-2">
                  {recommendedExam.level}级
                </div>
                <div className="text-blue-100 mb-4">
                  {gespLevels[recommendedExam.level - 1]?.description}
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-3xl font-bold">
                    {recommendedExam.probability}%
                  </div>
                  <div className="text-sm text-blue-100">预估通过率</div>
                </div>
                <div className="text-sm text-blue-100">
                  考试时长：{gespLevels[recommendedExam.level - 1]?.duration}
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-sm text-blue-100">
                    {getProbabilityExplanation(recommendedExam.level, recommendedExam.probability)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-blue-100">暂无推荐</div>
            )}
          </div>
        </div>

        {/* 各级别通过率 */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-600">8个等级通过率分析</span>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                稳过(≥90%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                推荐(70-89%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                冲刺(50-69%)
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {gespLevels.map((level) => {
              const prob = probabilities[level.level] || 0;
              const badge = getRecommendationBadge(prob);
              const explanation = getProbabilityExplanation(level.level, prob);
              
              return (
                <div key={level.level} className="group">
                  <div className="flex items-center gap-4">
                    <div className="w-16 flex-shrink-0">
                      <div className="font-semibold text-slate-900">{level.name}</div>
                      <div className="text-xs text-slate-500">{level.description}</div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getProgressColor(prob)}`}
                          style={{ width: `${Math.min(prob, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="w-20 flex-shrink-0 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                        {prob}%
                      </span>
                    </div>
                  </div>
                  
                  {/* 通过率解释 - 悬停显示 */}
                  <div className="mt-1 ml-20 flex items-center gap-1 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info className="w-3 h-3" />
                    <span>{explanation}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 说明 */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-600">
                <p className="mb-2">
                  <strong>预测说明：</strong>通过率基于课程知识点的覆盖程度计算。高年级学生对低年级考试通过率会获得加成。
                </p>
                <p>
                  • <span className="text-emerald-600 font-medium">稳过(≥90%)</span>：知识点掌握充分，建议报考
                  • <span className="text-blue-600 font-medium">推荐(70-89%)</span>：掌握良好，通过可能性较高
                  • <span className="text-amber-600 font-medium">冲刺(50-69%)</span>：需要额外复习
                  • <span className="text-slate-500">准备中(&lt;50%)</span>：建议继续学习
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
