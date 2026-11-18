"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  Brain,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  GraduationCap,
  Lightbulb,
} from "lucide-react";
import {
  calculateGespCoverage,
  gespKnowledgePoints,
  getMasteredKnowledgeDetails,
  getRemainingKnowledge,
  getTeachingRecommendations,
  groupKnowledgeByCategory,
} from "../data/curriculum-data";

interface KnowledgeAnalysisProps {
  currentLevel: number;
  currentLesson: number;
  probabilities: Record<number, number>;
}

const tabs = [
  { id: "mastered", label: "已掌握", icon: CheckCircle2 },
  { id: "remaining", label: "待学习", icon: Circle },
  { id: "byLevel", label: "按等级", icon: BookOpen },
  { id: "coverage", label: "覆盖情况", icon: AlertTriangle },
  { id: "teaching", label: "教学建议", icon: GraduationCap },
] as const;
type TabId = (typeof tabs)[number]["id"];

export default function KnowledgeAnalysis({ currentLevel, currentLesson, probabilities }: KnowledgeAnalysisProps) {
  const [activeTab, setActiveTab] = useState<TabId>("mastered");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedGespLevel, setSelectedGespLevel] = useState(1);
  const [expandedMissing, setExpandedMissing] = useState<Set<number>>(new Set());
  const reduceMotion = useReducedMotion();

  const mastered = getMasteredKnowledgeDetails(currentLevel, currentLesson);
  const remaining = getRemainingKnowledge(currentLevel, currentLesson);
  const masteredByCategory = groupKnowledgeByCategory(mastered);
  const remainingByCategory = groupKnowledgeByCategory(remaining);
  const coverage = calculateGespCoverage(currentLevel, currentLesson);
  const teachingRecommendations = getTeachingRecommendations(currentLevel, currentLesson);

  function toggleCategory(category: string) {
    const next = new Set(expandedCategories);
    if (next.has(category)) next.delete(category);
    else next.add(category);
    setExpandedCategories(next);
  }

  function toggleMissing(level: number) {
    const next = new Set(expandedMissing);
    if (next.has(level)) next.delete(level);
    else next.add(level);
    setExpandedMissing(next);
  }

  function selectTab(id: TabId, element?: HTMLButtonElement) {
    setActiveTab(id);
    element?.scrollIntoView({ block: "nearest", inline: "nearest", container: "nearest" });
  }

  function onTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    const id = tabs[next].id;
    setActiveTab(id);
    const element = document.getElementById(`knowledge-tab-${id}`);
    element?.focus();
    element?.scrollIntoView({ block: "nearest", inline: "nearest", container: "nearest" });
  }

  function getLevelMastery(level: number) {
    const points = gespKnowledgePoints[level] || [];
    const masteredIds = new Set(mastered.map((point) => point.id));
    const masteredInLevel = points.filter((point) => masteredIds.has(point.id));
    const totalWeight = points.reduce((sum, point) => sum + point.weight, 0);
    const masteredWeight = masteredInLevel.reduce((sum, point) => sum + point.weight, 0);
    return {
      total: points.length,
      mastered: masteredInLevel.length,
      percentage: totalWeight > 0 ? Math.round((masteredWeight / totalWeight) * 100) : 0,
    };
  }

  function categoryList(groups: ReturnType<typeof groupKnowledgeByCategory>, kind: "mastered" | "remaining") {
    if (!Object.entries(groups).length) {
      return (
        <div className="py-10 text-center text-muted">
          <Brain size={28} className="mx-auto mb-3 opacity-50" aria-hidden />
          <p className="text-sm">{kind === "mastered" ? "当前课次还没有已覆盖知识点" : "当前课次已覆盖全部知识点"}</p>
        </div>
      );
    }
    return Object.entries(groups).map(([category, points]) => {
      const expanded = expandedCategories.has(category);
      const contentId = `${kind}-${category}`;
      return (
        <div key={category} className="border-b border-line last:border-b-0">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={contentId}
            onClick={() => toggleCategory(category)}
            className="flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left hover:bg-quiet"
          >
            <span className="font-medium text-ink">{category}<span className="ml-2 font-mono text-xs text-muted">{points.length}</span></span>
            {expanded ? <ChevronUp size={16} className="text-muted" aria-hidden /> : <ChevronDown size={16} className="text-muted" aria-hidden />}
          </button>
          {expanded && (
            <motion.div
              id={contentId}
              initial={{ opacity: 0, transform: "translateY(-4px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col gap-2 pb-4"
            >
              {points.map((point) => (
                <div key={point.id} className="rounded-lg bg-quiet p-4">
                  <div className="flex items-start gap-3">
                    {kind === "mastered" ? <Check size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden /> : <Circle size={16} className="mt-0.5 shrink-0 text-current" aria-hidden />}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-ink">{point.name}</h4>
                      <p className="mt-1 text-xs leading-5 text-muted">{point.description}</p>
                      {kind === "mastered" && <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-muted"><Lightbulb size={13} className="mt-0.5 shrink-0 text-current" aria-hidden />{point.parentExplanation}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      );
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Brain size={19} strokeWidth={1.5} className="text-brand" aria-hidden />
          <h2 className="text-lg font-medium text-ink">知识点掌握分析</h2>
        </div>
        <p className="text-xs text-muted">已覆盖 {mastered.length} 项 · 待学习 {remaining.length} 项</p>
      </div>

      <div role="tablist" aria-label="知识点分析视图" className="mt-6 flex overflow-x-auto border-b border-line">
        {tabs.map((tab, index) => {
          const active = activeTab === tab.id;
          const count = tab.id === "mastered" ? mastered.length : tab.id === "remaining" ? remaining.length : null;
          return (
            <button
              type="button"
              role="tab"
              id={`knowledge-tab-${tab.id}`}
              key={tab.id}
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onClick={(event) => selectTab(tab.id, event.currentTarget)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={`relative flex min-h-12 shrink-0 items-center gap-2 px-4 text-sm transition-colors ${active ? "text-brand after:absolute after:inset-x-4 after:bottom-0 after:border-b-2 after:border-brand" : "text-muted hover:text-ink"}`}
            >
              <tab.icon size={15} strokeWidth={1.5} aria-hidden />
              {tab.label}
              {count !== null && <span className="font-mono text-xs tabular-nums">{count}</span>}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id="knowledge-panel" aria-labelledby={`knowledge-tab-${activeTab}`} className="mt-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, transform: "translateY(6px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            exit={{ opacity: 0, transform: "translateY(-6px)" }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.23, 1, 0.32, 1] }}
          >
            {activeTab === "mastered" && <div className="border-t border-line">{categoryList(masteredByCategory, "mastered")}</div>}
            {activeTab === "remaining" && <div className="border-t border-line">{categoryList(remainingByCategory, "remaining")}</div>}

            {activeTab === "byLevel" && (
              <div>
                <div className="flex gap-2 overflow-x-auto pb-3" role="group" aria-label="选择 GESP 等级">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => {
                    const mastery = getLevelMastery(level);
                    const active = selectedGespLevel === level;
                    return (
                      <button
                        type="button"
                        key={level}
                        aria-pressed={active}
                        onClick={() => setSelectedGespLevel(level)}
                        className={`min-w-20 shrink-0 rounded-lg border px-3 py-2 text-center transition-colors ${active ? "border-brand bg-wash text-brand" : "border-line text-muted hover:border-brand"}`}
                      >
                        <span className="block font-medium">GESP {level}</span>
                        <span className="mt-1 block font-mono text-xs tabular-nums">{mastery.percentage}%</span>
                      </button>
                    );
                  })}
                </div>
                <section className="mt-3 rounded-xl border border-line p-4">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-medium text-ink">GESP {selectedGespLevel} 级知识点</h3>
                    <span className="font-mono text-xl text-brand tabular-nums">{probabilities[selectedGespLevel]}%</span>
                  </div>
                  <ul className="mt-4 flex max-h-80 flex-col gap-1 overflow-y-auto">
                    {gespKnowledgePoints[selectedGespLevel]?.map((point) => {
                      const isMastered = mastered.some((item) => item.id === point.id);
                      return (
                        <li key={point.id} className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm ${isMastered ? "bg-wash text-ink" : "text-muted"}`}>
                          {isMastered ? <CheckCircle2 size={15} className="shrink-0 text-brand" aria-hidden /> : <Circle size={15} className="shrink-0" aria-hidden />}
                          {point.name}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              </div>
            )}

            {activeTab === "coverage" && (
              <div className="border-t border-line">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => {
                  const item = coverage[level];
                  const percentage = parseFloat(item.percentage);
                  const expanded = expandedMissing.has(level);
                  return (
                    <div key={level} className="border-b border-line">
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() => toggleMissing(level)}
                        className="flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left"
                      >
                        <span className="text-sm font-medium text-ink">GESP {level} 级</span>
                        <span className="flex items-center gap-3">
                          <span className="h-1.5 w-20 overflow-hidden rounded-full bg-quiet" role="progressbar" aria-label={`GESP ${level} 覆盖率`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}>
                            <motion.span
                              className="block h-full w-full origin-left bg-brand"
                              initial={{ transform: "scaleX(0)" }}
                              animate={{ transform: `scaleX(${percentage / 100})` }}
                              transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.23, 1, 0.32, 1] }}
                            />
                          </span>
                          <span className="w-14 text-right font-mono text-xs text-muted tabular-nums">{item.percentage}</span>
                          {expanded ? <ChevronUp size={15} className="text-muted" aria-hidden /> : <ChevronDown size={15} className="text-muted" aria-hidden />}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "teaching" && (
              <div className="flex flex-col gap-3">
                {teachingRecommendations.length === 0 ? (
                  <div className="py-10 text-center text-muted"><CheckCircle2 size={28} className="mx-auto mb-3 text-brand" aria-hidden /><p className="text-sm">各 GESP 等级覆盖情况良好，暂无额外建议</p></div>
                ) : (
                  teachingRecommendations.map((recommendation) => (
                    <article key={recommendation.gespLevel} className="rounded-xl border border-line bg-quiet p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-sm font-medium text-ink">GESP {recommendation.gespLevel} 级</h3>
                        <span className="font-mono text-sm text-brand tabular-nums">{probabilities[recommendation.gespLevel]}%</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted">{recommendation.suggestion}</p>
                    </article>
                  ))
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
