"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "./components/Header";
import LevelSelector from "./components/LevelSelector";
import ExamPrediction from "./components/ExamPrediction";
import KnowledgeAnalysis from "./components/KnowledgeAnalysis";
import StudyPath from "./components/StudyPath";
import { calculatePassProbability, getRecommendedExam } from "./data/curriculum-data";
import { FileText, BarChart3, ArrowRight } from "lucide-react";

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentLesson, setCurrentLesson] = useState(12);

  const probabilities = calculatePassProbability(currentLevel, currentLesson);
  const recommendedExam = getRecommendedExam(currentLevel, currentLesson);

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section - Left aligned */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            GESP 考试规划评估
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            基于五个奶爸少儿编程课程体系，科学评估学生GESP考级通过率
          </p>
        </motion.div>

        {/* Main Dashboard - Side by Side */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
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

        {/* Feature Cards - Varied layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8"
        >
          {/* Primary CTA - Takes 2 columns */}
          <a 
            href="/analyze"
            className="group md:col-span-2 relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <div className="relative flex items-start gap-4">
              <div className="p-2.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg mb-2">试卷分析</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  上传 PDF 试卷，自动分析难度和超纲情况，生成给家长的反馈建议
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-white">
                  立即使用
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </a>

          {/* Secondary card - Takes 1 column */}
          <div className="rounded-xl bg-white border border-slate-200 p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-1">通过率评估</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  根据学生当前课程进度，科学预测各 GESP 级别的通过概率
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Knowledge Analysis */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
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
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <StudyPath />
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 五个奶爸少儿编程 · GESP考试规划系统
            </p>
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
