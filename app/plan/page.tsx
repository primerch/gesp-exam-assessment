"use client";
import { useState } from "react";
import LevelSelector from "../components/LevelSelector";
import ExamPrediction from "../components/ExamPrediction";
import KnowledgeAnalysis from "../components/KnowledgeAnalysis";
import StudyPath from "../components/StudyPath";
import { calculatePassProbability, getRecommendedExam } from "../data/curriculum-data";
import { shell, heading, lead } from "../components/review-styles";
export default function PlanPage() {
  const [level, setLevel] = useState(1),
    [lesson, setLesson] = useState(12);
  const probabilities = calculatePassProbability(level, lesson);
  return (
    <main id="main-content" className={shell}>
      <h1 className={heading}>学习规划</h1>
      <p className={lead}>按现有 C++ 课程进度估算学习准备程度。实际报考能力还需结合独立作答表现。</p>
      <div className="mt-8 space-y-6 rounded-lg bg-slate-50 p-3 text-slate-900 sm:p-5">
        <div className="grid items-start gap-5 xl:grid-cols-[2fr_3fr]">
          <LevelSelector
            currentLevel={level}
            currentLesson={lesson}
            onLevelChange={setLevel}
            onLessonChange={setLesson}
          />
          <ExamPrediction
            probabilities={probabilities}
            recommendedExam={getRecommendedExam(level, lesson)}
            currentLevel={level}
          />
        </div>
        <KnowledgeAnalysis currentLevel={level} currentLesson={lesson} probabilities={probabilities} />
        <StudyPath />
      </div>
    </main>
  );
}
