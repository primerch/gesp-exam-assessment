"use client";

import { useState } from "react";
import LevelSelector from "../components/LevelSelector";
import ExamPrediction from "../components/ExamPrediction";
import KnowledgeAnalysis from "../components/KnowledgeAnalysis";
import StudyPath from "../components/StudyPath";
import { calculatePassProbability, getRecommendedExam } from "../data/curriculum-data";
import { heading, lead, shell } from "../components/review-styles";

export default function PlanPage() {
  const [level, setLevel] = useState(1);
  const [lesson, setLesson] = useState(12);
  const probabilities = calculatePassProbability(level, lesson);

  return (
    <main id="main-content" className={shell}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className={heading}>学习规划</h1>
          <p className={lead}>把现有 C++ 课程进度放到 GESP 路径上，查看知识覆盖与建议报考等级。估算结果仍需结合独立作答表现。</p>
        </div>
        <p className="text-sm text-muted">4 个课程阶段 · 95 个课次 · GESP 一至八级</p>
      </div>

      <div className="mt-10 grid items-start gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6" aria-label="课程进度选择">
          <LevelSelector currentLevel={level} currentLesson={lesson} onLevelChange={setLevel} onLessonChange={setLesson} />
        </section>
        <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6" aria-label="GESP 准备程度估算">
          <ExamPrediction probabilities={probabilities} recommendedExam={getRecommendedExam(level, lesson)} currentLevel={level} />
        </section>
      </div>
      <section className="mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-6" aria-label="知识点掌握分析">
        <KnowledgeAnalysis currentLevel={level} currentLesson={lesson} probabilities={probabilities} />
      </section>
      <section className="mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-6" aria-label="课程学习路径">
        <StudyPath />
      </section>
    </main>
  );
}
