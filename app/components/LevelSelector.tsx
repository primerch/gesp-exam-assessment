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
    <div className="h-full bg-white border border-slate-200 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 bg-blue-100 rounded-lg">
          <Layers className="w-4 h-4 text-blue-600" />
        </div>
        <h2 className="text-base font-semibold text-slate-900">选择学习进度</h2>
      </div>

      {/* Level Selection */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-slate-700 mb-2.5">
          当前级别
        </label>
        <div className="grid grid-cols-2 gap-2">
          {courseInfo.levels.map((level) => (
            <button
              key={level.id}
              onClick={() => {
                onLevelChange(level.id);
                onLessonChange(1);
              }}
              className={`relative p-3 rounded-lg border-2 text-left transition-all ${
                currentLevel === level.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div className="text-sm font-semibold text-slate-900">{level.name}</div>
              <div className="text-xs text-slate-500 mt-0.5">{level.description}</div>
              <div className="text-xs text-blue-600 mt-1 font-medium">
                目标：GESP {level.targetGesp}
              </div>
              {currentLevel === level.id && (
                <motion.div 
                  layoutId="activeLevel"
                  className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lesson Selection */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-slate-700 mb-2.5">
          已完成课程
        </label>
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          {/* Progress Display */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-500">
                {currentLevelInfo?.name}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-slate-900 tabular-nums">
                {currentLesson}
              </span>
              <span className="text-slate-400 text-xs">/{maxLessons}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
              className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
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
              className="w-full"
            />
          </div>

          {/* Quick Controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <button
                onClick={() => onLessonChange(Math.max(1, currentLesson - 4))}
                className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
                aria-label="后退4课"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onLessonChange(Math.min(maxLessons, currentLesson + 4))}
                className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
                aria-label="前进4课"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => onLessonChange(Math.floor(maxLessons / 2))}
                className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
              >
                一半
              </button>
              <button
                onClick={() => onLessonChange(maxLessons)}
                className="px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1 bg-blue-100 rounded-md">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <span className="text-xs font-medium text-blue-900">总学习进度</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {totalProgress}%
            </div>
            <div className="text-xs text-slate-600">
              Level {currentLevel} · 第{currentLesson}课
            </div>
          </div>
          <div className="w-12 h-12 relative">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-blue-200"
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
                transition={{ duration: 0.8 }}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
