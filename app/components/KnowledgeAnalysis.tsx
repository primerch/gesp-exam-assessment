"use client";

import { useState } from "react";
import { Brain, CheckCircle2, XCircle, BookOpen, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { 
  getMasteredKnowledgeDetails, 
  getRemainingKnowledge, 
  groupKnowledgeByCategory,
  gespKnowledgePoints,
} from "../data/curriculum-data";

interface KnowledgeAnalysisProps {
  currentLevel: number;
  currentLesson: number;
  probabilities: Record<number, number>;
}

export default function KnowledgeAnalysis({
  currentLevel,
  currentLesson,
  probabilities,
}: KnowledgeAnalysisProps) {
  const [activeTab, setActiveTab] = useState<"mastered" | "remaining" | "byLevel">("mastered");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedGespLevel, setSelectedGespLevel] = useState<number>(1);

  const mastered = getMasteredKnowledgeDetails(currentLevel, currentLesson);
  const remaining = getRemainingKnowledge(currentLevel, currentLesson);
  const masteredByCategory = groupKnowledgeByCategory(mastered);
  const remainingByCategory = groupKnowledgeByCategory(remaining);

  const toggleCategory = (category: string) => {
    const newSet = new Set(expandedCategories);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    setExpandedCategories(newSet);
  };

  // 计算每个GESP等级的掌握情况
  const getLevelMastery = (level: number) => {
    const points = gespKnowledgePoints[level] || [];
    const masteredIds = new Set(mastered.map((p) => p.id));
    const masteredInLevel = points.filter((p) => masteredIds.has(p.id));
    const totalWeight = points.reduce((sum, p) => sum + p.weight, 0);
    const masteredWeight = masteredInLevel.reduce((sum, p) => sum + p.weight, 0);
    return {
      total: points.length,
      mastered: masteredInLevel.length,
      percentage: totalWeight > 0 ? Math.round((masteredWeight / totalWeight) * 100) : 0,
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-900">知识点掌握分析</h2>
      </div>

      {/* 标签页 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("mastered")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "mastered"
              ? "bg-blue-100 text-blue-700"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          已掌握 ({mastered.length})
        </button>
        <button
          onClick={() => setActiveTab("remaining")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "remaining"
              ? "bg-amber-100 text-amber-700"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <XCircle className="w-4 h-4" />
          待学习 ({remaining.length})
        </button>
        <button
          onClick={() => setActiveTab("byLevel")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "byLevel"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          按等级查看
        </button>
      </div>

      {/* 已掌握知识点 */}
      {activeTab === "mastered" && (
        <div className="space-y-4">
          {Object.entries(masteredByCategory).length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>还没有掌握的知识点，继续学习吧！</p>
            </div>
          ) : (
            Object.entries(masteredByCategory).map(([category, points]) => (
              <div key={category} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900">{category}</span>
                    <span className="text-sm text-slate-500">({points.length}个知识点)</span>
                  </div>
                  {expandedCategories.has(category) ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {expandedCategories.has(category) && (
                  <div className="p-4 space-y-3">
                    {points.map((point) => (
                      <div key={point.id} className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-slate-900">{point.name}</div>
                            <div className="text-sm text-slate-600 mt-1">{point.description}</div>
                            <div className="mt-2 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-amber-500" />
                              <span className="text-sm text-slate-600">{point.parentExplanation}</span>
                            </div>
                            <div className="mt-2 text-xs text-slate-500">
                              <span className="inline-block px-2 py-1 bg-white rounded border border-slate-200 mr-2">
                                GESP {point.gespLevel}级
                              </span>
                              <span>考试重点：{point.examFocus}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 待学习知识点 */}
      {activeTab === "remaining" && (
        <div className="space-y-4">
          {Object.entries(remainingByCategory).length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>太棒了！已经掌握了所有知识点！</p>
            </div>
          ) : (
            Object.entries(remainingByCategory).map(([category, points]) => (
              <div key={category} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900">{category}</span>
                    <span className="text-sm text-slate-500">({points.length}个知识点)</span>
                  </div>
                  {expandedCategories.has(category) ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {expandedCategories.has(category) && (
                  <div className="p-4 space-y-3">
                    {points.map((point) => (
                      <div key={point.id} className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-slate-900">{point.name}</div>
                            <div className="text-sm text-slate-600 mt-1">{point.description}</div>
                            <div className="mt-2 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-amber-500" />
                              <span className="text-sm text-slate-600">{point.parentExplanation}</span>
                            </div>
                            <div className="mt-2 text-xs text-slate-500">
                              <span className="inline-block px-2 py-1 bg-white rounded border border-slate-200 mr-2">
                                GESP {point.gespLevel}级
                              </span>
                              <span>考试重点：{point.examFocus}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 按等级查看 */}
      {activeTab === "byLevel" && (
        <div>
          {/* 等级选择 */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => {
              const mastery = getLevelMastery(level);
              return (
                <button
                  key={level}
                  onClick={() => setSelectedGespLevel(level)}
                  className={`flex-shrink-0 p-3 rounded-xl border-2 text-center transition-all ${
                    selectedGespLevel === level
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="font-bold text-slate-900">{level}级</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {mastery.mastered}/{mastery.total}
                  </div>
                  <div className="text-xs font-medium text-blue-600 mt-1">
                    {mastery.percentage}%
                  </div>
                </button>
              );
            })}
          </div>

          {/* 选中等级的详情 */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900">
                  GESP {selectedGespLevel}级知识点
                </h3>
                <p className="text-sm text-slate-500">
                  {gespKnowledgePoints[selectedGespLevel]?.[0]?.description || "暂无描述"}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {probabilities[selectedGespLevel]}%
                </div>
                <div className="text-xs text-slate-500">预估通过率</div>
              </div>
            </div>

            <div className="space-y-3">
              {gespKnowledgePoints[selectedGespLevel]?.map((point) => {
                const isMastered = mastered.some((m) => m.id === point.id);
                return (
                  <div
                    key={point.id}
                    className={`p-3 rounded-lg border ${
                      isMastered
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isMastered ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{point.name}</div>
                        <div className="text-sm text-slate-600">{point.description}</div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          isMastered
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {isMastered ? "已掌握" : "待学习"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
