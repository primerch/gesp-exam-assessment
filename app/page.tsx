"use client";

import { useState } from "react";
import Header from "./components/Header";
import LevelSelector from "./components/LevelSelector";
import ExamPrediction from "./components/ExamPrediction";
import KnowledgeAnalysis from "./components/KnowledgeAnalysis";
import StudyPath from "./components/StudyPath";
import { calculatePassProbability, getRecommendedExam, gespLevels, courseInfo } from "./data/curriculum-data";

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentLesson, setCurrentLesson] = useState(12);

  const probabilities = calculatePassProbability(currentLevel, currentLesson);
  const recommendedExam = getRecommendedExam(currentLevel, currentLesson);

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 标题区 */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            GESP 考试规划评估
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            基于五个奶爸少儿编程课程体系，科学评估学生GESP考级通过率
          </p>
        </div>

        {/* 学习进度选择 */}
        <LevelSelector
          currentLevel={currentLevel}
          currentLesson={currentLesson}
          onLevelChange={setCurrentLevel}
          onLessonChange={setCurrentLesson}
        />

        {/* 考试预测卡片 */}
        <ExamPrediction
          probabilities={probabilities}
          recommendedExam={recommendedExam}
        />

        {/* 知识点分析 */}
        <KnowledgeAnalysis
          currentLevel={currentLevel}
          currentLesson={currentLesson}
          probabilities={probabilities}
        />

        {/* 学习路径 */}
        <StudyPath />
      </div>

      {/* 页脚 */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-500 text-sm mb-4 md:mb-0">
              © 2026 五个奶爸少儿编程 · GESP考试规划系统
            </div>
            <div className="flex gap-6 text-sm text-slate-500">
              <span>课程体系：Level 1-4</span>
              <span>覆盖等级：GESP 1-8级</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
