"use client";

import { useState } from "react";
import { Brain, CheckCircle2, XCircle, BookOpen, ChevronDown, ChevronUp, Lightbulb, AlertTriangle, GraduationCap } from "lucide-react";
import { 
  getMasteredKnowledgeDetails, 
  getRemainingKnowledge, 
  groupKnowledgeByCategory,
  gespKnowledgePoints,
  gespSyllabus,
  calculateGespCoverage,
  getTeachingRecommendations,
  getUncoveredKnowledgeByGespLevel,
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
  const [activeTab, setActiveTab] = useState<"mastered" | "remaining" | "byLevel" | "coverage" | "teaching">("mastered");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedGespLevel, setSelectedGespLevel] = useState<number>(1);
  const [expandedMissing, setExpandedMissing] = useState<Set<number>>(new Set());

  const mastered = getMasteredKnowledgeDetails(currentLevel, currentLesson);
  const remaining = getRemainingKnowledge(currentLevel, currentLesson);
  const masteredByCategory = groupKnowledgeByCategory(mastered);
  const remainingByCategory = groupKnowledgeByCategory(remaining);
  const coverage = calculateGespCoverage(currentLevel, currentLesson);
  const teachingRecommendations = getTeachingRecommendations(currentLevel, currentLesson);

  const toggleCategory = (category: string) => {
    const newSet = new Set(expandedCategories);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    setExpandedCategories(newSet);
  };

  const toggleMissing = (level: number) => {
    const newSet = new Set(expandedMissing);
    if (newSet.has(level)) {
      newSet.delete(level);
    } else {
      newSet.add(level);
    }
    setExpandedMissing(newSet);
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

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // 获取优先级文本
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高优先级';
      case 'medium': return '中优先级';
      case 'low': return '低优先级';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-900">知识点掌握分析</h2>
      </div>

      {/* 标签页 */}
      <div className="flex flex-wrap gap-2 mb-6">
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
        <button
          onClick={() => setActiveTab("coverage")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "coverage"
              ? "bg-purple-100 text-purple-700"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          覆盖情况
        </button>
        <button
          onClick={() => setActiveTab("teaching")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "teaching"
              ? "bg-indigo-100 text-indigo-700"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          教学建议
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

      {/* GESP 大纲覆盖情况 */}
      {activeTab === "coverage" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-blue-900 mb-2">GESP 大纲考点覆盖情况</h3>
            <p className="text-sm text-blue-700">
              基于 GESP 官方大纲，展示每个等级考点的覆盖情况。红色表示未覆盖的考点。
            </p>
          </div>
          
          {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => {
            const cov = coverage[level];
            const percentage = parseFloat(cov.percentage);
            const uncoveredPoints = getUncoveredKnowledgeByGespLevel(currentLevel, currentLesson, level);
            
            return (
              <div key={level} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleMissing(level)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="font-semibold text-slate-900">GESP {level}级</div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${percentage >= 80 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600">{cov.percentage}</span>
                    </div>
                    <span className="text-sm text-slate-500">
                      ({cov.covered}/{cov.total} 考点)
                    </span>
                  </div>
                  {expandedMissing.has(level) ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                
                {expandedMissing.has(level) && (
                  <div className="p-4 bg-slate-50">
                    {cov.missing.length === 0 ? (
                      <div className="text-center py-4 text-emerald-600">
                        <CheckCircle2 className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm">该等级所有考点已全覆盖！</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-slate-700 mb-2">
                          未覆盖的考点（{cov.missing.length}个）：
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {gespSyllabus[level]
                            ?.filter(p => cov.missing.includes(p.id))
                            .map(point => (
                              <div key={point.id} className="p-3 bg-white rounded-lg border border-red-200">
                                <div className="flex items-start gap-2">
                                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <div className="font-medium text-slate-900 text-sm">{point.name}</div>
                                    <div className="text-xs text-slate-500 mt-1">{point.description}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                        
                        {uncoveredPoints.length > 0 && (
                          <div className="mt-4">
                            <div className="text-sm font-medium text-slate-700 mb-2">
                              相关未掌握知识点（{uncoveredPoints.length}个）：
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {uncoveredPoints.slice(0, 8).map(point => (
                                <span key={point.id} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">
                                  {point.name}
                                </span>
                              ))}
                              {uncoveredPoints.length > 8 && (
                                <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                                  +{uncoveredPoints.length - 8} 更多
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 教学建议 */}
      {activeTab === "teaching" && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-indigo-900">学管老师教学建议</h3>
            </div>
            <p className="text-sm text-indigo-700">
              根据学生当前进度，系统生成的针对性教学建议。优先处理高优先级的缺失知识点。
            </p>
          </div>

          {teachingRecommendations.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>该学生各 GESP 等级覆盖率良好，暂无特别建议</p>
            </div>
          ) : (
            teachingRecommendations.map((rec, index) => (
              <div key={rec.gespLevel} className={`border rounded-xl overflow-hidden ${getPriorityColor(rec.priority).replace('text-', 'border-').replace('bg-', '').split(' ')[0]}`}>
                <div className={`p-4 ${getPriorityColor(rec.priority)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">GESP {rec.gespLevel}级</span>
                      <span className="text-xs px-2 py-0.5 bg-white/50 rounded">
                        {getPriorityText(rec.priority)}
                      </span>
                    </div>
                    <div className="text-sm">
                      通过率: <span className="font-bold">{probabilities[rec.gespLevel]}%</span>
                    </div>
                  </div>
                  <p className="text-sm mt-2 opacity-90">{rec.suggestion}</p>
                </div>
                <div className="p-4 bg-slate-50">
                  <div className="text-sm font-medium text-slate-700 mb-2">建议重点补充：</div>
                  <div className="flex flex-wrap gap-2">
                    {rec.missingPoints.map((point, idx) => (
                      <span key={idx} className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700">
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
