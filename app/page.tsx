"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "./components/Header";
import LevelSelector from "./components/LevelSelector";
import ExamPrediction from "./components/ExamPrediction";
import KnowledgeAnalysis from "./components/KnowledgeAnalysis";
import StudyPath from "./components/StudyPath";
import { calculatePassProbability, getRecommendedExam } from "./data/curriculum-data";
import { FileText, BarChart3, Sparkles } from "lucide-react";

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentLesson, setCurrentLesson] = useState(12);

  const probabilities = calculatePassProbability(currentLevel, currentLesson);
  const recommendedExam = getRecommendedExam(currentLevel, currentLesson);

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700">智能考试规划系统</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
            GESP 考试规划评估
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            基于五个奶爸少儿编程课程体系，科学评估学生GESP考级通过率
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-3xl mx-auto"
        >
          <a 
            href="/analyze"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5" />
                  <h3 className="font-bold">试卷分析</h3>
                </div>
                <p className="text-blue-100 text-sm">
                  上传 PDF 试卷，自动分析难度和超纲情况
                </p>
              </div>
              <div className="bg-white/20 rounded-xl p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </a>

          <div className="rounded-2xl bg-white border border-slate-200 p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900">通过率评估</h3>
                </div>
                <p className="text-slate-600 text-sm">
                  根据课程进度，实时预测各等级通过概率
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Dashboard - Side by Side */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 xl:grid-cols-12 gap-6"
        >
          {/* Left: Level Selector (5 cols) */}
          <div className="xl:col-span-5">
            <LevelSelector
              currentLevel={currentLevel}
              currentLesson={currentLesson}
              onLevelChange={setCurrentLevel}
              onLessonChange={setCurrentLesson}
            />
          </div>

          {/* Right: Exam Prediction (7 cols) */}
          <div className="xl:col-span-7">
            <ExamPrediction
              probabilities={probabilities}
              recommendedExam={recommendedExam}
              currentLevel={currentLevel}
            />
          </div>
        </motion.div>

        {/* Knowledge Analysis */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8"
        >
          <KnowledgeAnalysis
            currentLevel={currentLevel}
            currentLesson={currentLesson}
            probabilities={probabilities}
          />
        </motion.div>

        {/* Study Path */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8"
        >
          <StudyPath />
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-500 text-sm">
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
