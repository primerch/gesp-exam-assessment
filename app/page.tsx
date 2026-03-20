"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "./components/Header";
import LevelSelector from "./components/LevelSelector";
import ExamPrediction from "./components/ExamPrediction";
import KnowledgeAnalysis from "./components/KnowledgeAnalysis";
import StudyPath from "./components/StudyPath";
import { calculatePassProbability, getRecommendedExam } from "./data/curriculum-data";
import { FileText, BarChart3, Sparkles, ArrowRight } from "lucide-react";

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

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8"
        >
          <a 
            href="/analyze"
            className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">试卷分析</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  上传 PDF 试卷，自动分析难度和超纲情况，生成给家长的反馈建议
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                  立即使用
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </a>

          <div className="rounded-2xl bg-white border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">通过率评估</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  根据学生当前课程进度，科学预测各 GESP 级别的通过概率
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-emerald-600">
                  实时计算中...
                  <span className="ml-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Knowledge Analysis */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
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
          transition={{ duration: 0.8, delay: 0.5 }}
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
