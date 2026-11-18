"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { courseInfo } from "../data/curriculum-data";

interface LevelSelectorProps {
  currentLevel: number;
  currentLesson: number;
  onLevelChange: (level: number) => void;
  onLessonChange: (lesson: number) => void;
}

export default function LevelSelector({ currentLevel, currentLesson, onLevelChange, onLessonChange }: LevelSelectorProps) {
  const reduceMotion = useReducedMotion();
  const currentLevelInfo = courseInfo.levels.find((level) => level.id === currentLevel);
  const maxLessons = currentLevelInfo?.totalLessons || 24;
  const progressPercent = Math.round((currentLesson / maxLessons) * 100);
  const totalProgress = Math.round((((currentLevel - 1) * 24 + currentLesson) / 95) * 100);

  return (
    <div>
      <div className="flex items-center gap-2">
        <Layers size={19} strokeWidth={1.5} className="text-brand" aria-hidden />
        <h2 className="text-lg font-medium text-ink">选择学习进度</h2>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-muted">当前课程级别</legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {courseInfo.levels.map((level) => {
            const active = currentLevel === level.id;
            return (
              <button
                type="button"
                key={level.id}
                aria-pressed={active}
                onClick={() => {
                  onLevelChange(level.id);
                  onLessonChange(1);
                }}
                className={`relative min-h-28 rounded-xl border p-4 text-left transition-[border-color,background-color] ${active ? "border-brand bg-wash" : "border-line bg-surface hover:border-brand"}`}
              >
                <span className="block text-sm font-medium text-ink">{level.name}</span>
                <span className="mt-1 block text-xs text-muted">{level.description}</span>
                <span className="mt-3 block text-xs text-brand">目标 GESP {level.targetGesp}</span>
                {active && (
                  <motion.span
                    layoutId="active-course-level"
                    className="absolute right-3 top-3 size-2 rounded-full bg-brand"
                    transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.23, 1, 0.32, 1] }}
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-7 border-t border-line pt-6">
        <div className="flex items-end justify-between gap-4">
          <label htmlFor="lesson-progress" className="text-sm font-medium text-ink">已完成课次</label>
          <p className="font-mono text-2xl text-ink tabular-nums">{currentLesson}<span className="text-sm text-muted"> / {maxLessons}</span></p>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-wash" role="progressbar" aria-label="当前课程级别进度" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercent}>
          <motion.div
            className="h-full w-full origin-left bg-brand"
            initial={{ transform: "scaleX(0)" }}
            animate={{ transform: `scaleX(${progressPercent / 100})` }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.23, 1, 0.32, 1] }}
          />
        </div>
        <input
          id="lesson-progress"
          aria-label="已完成课次"
          type="range"
          min={1}
          max={maxLessons}
          value={currentLesson}
          onChange={(event) => onLessonChange(Number(event.target.value))}
          className="mt-5 w-full"
        />
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex gap-1">
            <button type="button" onClick={() => onLessonChange(Math.max(1, currentLesson - 4))} className="grid size-10 place-items-center rounded-lg text-muted hover:bg-quiet hover:text-ink" aria-label="后退 4 课"><ChevronLeft size={17} aria-hidden /></button>
            <button type="button" onClick={() => onLessonChange(Math.min(maxLessons, currentLesson + 4))} className="grid size-10 place-items-center rounded-lg text-muted hover:bg-quiet hover:text-ink" aria-label="前进 4 课"><ChevronRight size={17} aria-hidden /></button>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => onLessonChange(Math.floor(maxLessons / 2))} className="min-h-10 rounded-lg border border-line px-3 text-xs text-muted hover:bg-quiet">一半</button>
            <button type="button" onClick={() => onLessonChange(maxLessons)} className="min-h-10 rounded-lg bg-action px-3 text-xs font-medium text-white hover:bg-brand">完成</button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between border-t border-line pt-5">
        <div>
          <p className="flex items-center gap-2 text-sm text-muted"><BookOpen size={15} aria-hidden />总学习进度</p>
          <p className="mt-2 text-xs text-muted">{currentLevelInfo?.name} · 第 {currentLesson} 课</p>
        </div>
        <motion.p key={`${currentLevel}-${currentLesson}`} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="font-mono text-3xl text-brand tabular-nums">{totalProgress}%</motion.p>
      </div>
    </div>
  );
}
