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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高优先级';
      case 'medium': return '中优先级';
      case 'low': return '低优先级';
      default: return '';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 bg-blue-100 rounded-lg">
          <Brain className="w-4 h-4 text-blue-600" />
        </div>
        <h2 className="text-base font-semibold text-slate-900">知识点掌握分析</h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {[
          { id: "mastered", label: "已掌握", count: mastered.length, icon: CheckCircle2, color: "blue" },
          { id: "remaining", label: "待学习", count: remaining.length, icon: XCircle, color: "amber" },
          { id: "byLevel", label: "按等级", icon: BookOpen, color: "emerald" },
          { id: "coverage", label: "覆盖情况", icon: AlertTriangle, color: "purple" },
          { id: "teaching", label: "教学建议", icon: GraduationCap, color: "indigo" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? `bg-${tab.color}-100 text-${tab.color}-700`
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/60" : "bg-slate-200"}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-3">
        {/* Mastered Tab */}
        {activeTab === "mastered" && (
          <>
            {Object.entries(masteredByCategory).length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <Brain className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">还没有掌握的知识点，继续学习吧！</p>
              </div>
            ) : (
              Object.entries(masteredByCategory).map(([category, points]) => (
                <div key={category} className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 text-sm">{category}</span>
                      <span className="text-xs text-slate-500">({points.length})</span>
                    </div>
                    {expandedCategories.has(category) ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {expandedCategories.has(category) && (
                    <div className="p-3 space-y-2 border-t border-slate-200">
                      {points.map((point) => (
                        <div key={point.id} className="p-3 bg-emerald-50/60 rounded-lg">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-slate-900 text-sm">{point.name}</div>
                              <div className="text-xs text-slate-600 mt-0.5">{point.description}</div>
                              <div className="mt-1.5 flex items-center gap-1">
                                <Lightbulb className="w-3 h-3 text-amber-500" />
                                <span className="text-xs text-slate-600">{point.parentExplanation}</span>
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
          </>
        )}

        {/* Remaining Tab */}
        {activeTab === "remaining" && (
          <>
            {Object.entries(remainingByCategory).length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">太棒了！已经掌握了所有知识点！</p>
              </div>
            ) : (
              Object.entries(remainingByCategory).map(([category, points]) => (
                <div key={category} className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 text-sm">{category}</span>
                      <span className="text-xs text-slate-500">({points.length})</span>
                    </div>
                    {expandedCategories.has(category) ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {expandedCategories.has(category) && (
                    <div className="p-3 space-y-2 border-t border-slate-200">
                      {points.map((point) => (
                        <div key={point.id} className="p-3 bg-amber-50/60 rounded-lg">
                          <div className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-slate-900 text-sm">{point.name}</div>
                              <div className="text-xs text-slate-600 mt-0.5">{point.description}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </>
        )}

        {/* By Level Tab */}
        {activeTab === "byLevel" && (
          <div className="space-y-4">
            <div className="flex gap-1.5 overflow-x-auto pb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => {
                const mastery = getLevelMastery(level);
                return (
                  <button
                    key={level}
                    onClick={() => setSelectedGespLevel(level)}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg border-2 text-center transition-colors ${
                      selectedGespLevel === level
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-bold text-slate-900">{level}</div>
                    <div className="text-xs text-slate-500">{mastery.percentage}%</div>
                  </button>
                );
              })}
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-slate-900">GESP {selectedGespLevel}级知识点</h3>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-600">{probabilities[selectedGespLevel]}%</div>
                </div>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {gespKnowledgePoints[selectedGespLevel]?.map((point) => {
                  const isMastered = mastered.some((m) => m.id === point.id);
                  return (
                    <div
                      key={point.id}
                      className={`p-2.5 rounded-lg border text-sm ${
                        isMastered
                          ? "bg-emerald-50/50 border-emerald-200"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isMastered ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="font-medium text-slate-900">{point.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Coverage Tab */}
        {activeTab === "coverage" && (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => {
              const cov = coverage[level];
              const percentage = parseFloat(cov.percentage);
              
              return (
                <div key={level} className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleMissing(level)}
                    className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-slate-900 text-sm">GESP {level}级</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${percentage >= 80 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600">{cov.percentage}</span>
                      </div>
                    </div>
                    {expandedMissing.has(level) ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Teaching Tab */}
        {activeTab === "teaching" && (
          <>
            {teachingRecommendations.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">该学生各 GESP 等级覆盖率良好，暂无特别建议</p>
              </div>
            ) : (
              teachingRecommendations.map((rec) => (
                <div key={rec.gespLevel} className={`border rounded-lg overflow-hidden mb-3 ${getPriorityColor(rec.priority).replace(/bg-[^\s]+/, '').replace(/text-[^\s]+/, '').trim()}`}>
                  <div className={`p-3 ${getPriorityColor(rec.priority)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">GESP {rec.gespLevel}级</span>
                        <span className="text-xs px-1.5 py-0.5 bg-white/50 rounded">{getPriorityText(rec.priority)}</span>
                      </div>
                      <span className="text-sm font-bold">{probabilities[rec.gespLevel]}%</span>
                    </div>
                    <p className="text-xs opacity-90">{rec.suggestion}</p>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
