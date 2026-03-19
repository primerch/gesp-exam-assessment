"use client";

import { ChevronDown, BookOpen, Layers } from "lucide-react";
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Layers className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-900">选择学习进度</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 级别选择 */}
        <div>
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
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                  currentLevel === level.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="font-semibold text-slate-900">{level.name}</div>
                <div className="text-sm text-slate-500 mt-1">{level.description}</div>
                <div className="text-xs text-blue-600 mt-2 font-medium">
                  目标：GESP {level.targetGesp}
                </div>
                {currentLevel === level.id && (
                  <div className="absolute top-3 right-3 w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 课程选择 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            已完成课程
          </label>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">
                  {currentLevelInfo?.name} - 共{maxLessons}课
                </span>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {currentLesson}
                <span className="text-sm text-slate-400 font-normal">/{maxLessons}</span>
              </span>
            </div>

            {/* 进度条 */}
            <div className="h-2 bg-slate-200 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${(currentLesson / maxLessons) * 100}%` }}
              />
            </div>

            {/* 滑块 */}
            <input
              type="range"
              min={1}
              max={maxLessons}
              value={currentLesson}
              onChange={(e) => onLessonChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />

            {/* 快捷按钮 */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => onLessonChange(Math.max(1, currentLesson - 4))}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
              >
                -4课
              </button>
              <button
                onClick={() => onLessonChange(Math.floor(maxLessons / 2))}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
              >
                一半
              </button>
              <button
                onClick={() => onLessonChange(Math.min(maxLessons, currentLesson + 4))}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
              >
                +4课
              </button>
              <button
                onClick={() => onLessonChange(maxLessons)}
                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 ml-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                完成全部
              </button>
            </div>
          </div>

          {/* 当前状态总结 */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">当前进度</div>
                <div className="text-lg font-semibold text-slate-900">
                  {currentLevelInfo?.name} · 第{currentLesson}课
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-600">总进度</div>
                <div className="text-lg font-semibold text-blue-600">
                  {Math.round(
                    ((currentLevel - 1) * 24 + currentLesson) / 95 * 100
                  )}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
