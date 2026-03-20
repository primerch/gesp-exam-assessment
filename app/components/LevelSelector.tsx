"use client";

import { motion } from "framer-motion";
import { BookOpen, Layers, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { courseInfo } from "../data/curriculum-data";

interface LevelSelectorProps {
  currentLevel: number;
  currentLesson: number;
  onLevelChange: (level: number) => void;
  onLessonChange: (lesson: number) => void;
}

export default function LevelSelector({
  currentLevel,
  currentLesson,
  onLevelChange,
  onLessonChange,
}: LevelSelectorProps) {
  const currentLevelInfo = courseInfo.levels.find((l) => l.id === currentLevel);
  const maxLessons = currentLevelInfo?.totalLessons || 24;

  const progressPercent = Math.round((currentLesson / maxLessons) * 100);
  const totalProgress = Math.round(((currentLevel - 1) * 24 + currentLesson) / 95 * 100);

  return (
    <div className="h-full bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-xl">
          <Layers className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">选择学习进度</h2>
          <p className="text-sm text-slate-500">设置当前课程级别和进度</p>
        </div>
      </div>

      {/* Level Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-3">
          当前级别
        </label>
        <div className="grid grid-cols-2 gap-3">
          {courseInfo.levels.map((level) => (
            <button
              key={level.id}
              onClick={() => {
                onLevelChange(level.id);
                onLessonChange(1);
              }}
              className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                currentLevel === level.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
              }`}
            >
              <div className="font-semibold text-slate-900">{level.name}</div>
              <div className="text-sm text-slate-500 mt-1">{level.description}</div>
              <div className="text-xs text-blue-600 mt-2 font-medium">
                目标：GESP {level.targetGesp}
              </div>
              {currentLevel === level.id && (
                <motion.div 
                  layoutId="activeLevel"
                  className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lesson Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-3">
          已完成课程
        </label>
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
          {/* Progress Display */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-500">
                {currentLevelInfo?.name}
              </span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-slate-900 tabular-nums">
                {currentLesson}
              </span>
              <span className="text-slate-400 text-sm">/{maxLessons}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
            />
          </div>

          {/* Slider */}
          <div className="relative mb-4">
            <input
              type="range"
              min={1}
              max={maxLessons}
              value={currentLesson}
              onChange={(e) => onLessonChange(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Quick Controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => onLessonChange(Math.max(1, currentLesson - 4))}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onLessonChange(Math.min(maxLessons, currentLesson + 4))}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onLessonChange(Math.floor(maxLessons / 2))}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
              >
                一半
              </button>
              <button
                onClick={() => onLessonChange(maxLessons)}
                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-blue-900">总学习进度</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold text-slate-900 tabular-nums">
              {totalProgress}%
            </div>
            <div className="text-sm text-slate-600">
              Level {currentLevel} · 第{currentLesson}课
            </div>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-blue-100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <motion.path
                className="text-blue-500"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${totalProgress}, 100`}
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${totalProgress}, 100` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
