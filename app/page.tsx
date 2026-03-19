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

        {/* 功能入口卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <a 
            href="/analyze"
            className="group bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">📝 试卷分析</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  上传 GESP 考试 PDF 试卷，AI 自动分析难度系数和超纲情况，
                  生成给家长的反馈建议
                </p>
              </div>
              <div className="bg-white/20 rounded-xl p-3 group-hover:bg-white/30 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium text-blue-100">
              立即使用
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">📊 通过率评估</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  根据学生当前课程进度，科学预测各 GESP 级别的通过概率，
                  推荐最佳考试级别
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-500">
              在下方选择学习进度开始评估 ↓
            </div>
          </div>
        </div>

        {/* 学习进度选择 */}
        <section className="mb-8">
          <LevelSelector
            currentLevel={currentLevel}
            currentLesson={currentLesson}
            onLevelChange={setCurrentLevel}
            onLessonChange={setCurrentLesson}
          />
        </section>

        {/* 考试预测卡片 */}
        <section className="mb-8">
          <ExamPrediction
            probabilities={probabilities}
            recommendedExam={recommendedExam}
          />
        </section>

        {/* 知识点分析 */}
        <section className="mb-8">
          <KnowledgeAnalysis
            currentLevel={currentLevel}
            currentLesson={currentLesson}
            probabilities={probabilities}
          />
        </section>

        {/* 学习路径 */}
        <section className="mb-8">
          <StudyPath />
        </section>
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
