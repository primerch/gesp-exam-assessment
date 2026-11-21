"use client";

import { motion } from "framer-motion";
import useHydratedReducedMotion from "@/app/components/motion/useHydratedReducedMotion";
import { courseInfo } from "../../data/curriculum-data";
import type { CppCourseLevel } from "../../data/cpp-lessons";

export default function CourseLevelRail({
  current,
  onChange,
}: {
  current: CppCourseLevel;
  onChange: (level: CppCourseLevel) => void;
}) {
  const reduceMotion = useHydratedReducedMotion();

  return (
    <div className="relative" role="group" aria-label="课程级别">
      <div className="absolute bottom-[23px] left-[12%] right-[12%] hidden h-px bg-line sm:block" aria-hidden>
        <motion.div
          className="h-full origin-left bg-brand"
          animate={{ scaleX: (current - 1) / 3 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <ol className="relative grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {courseInfo.levels.map((course) => {
          const active = course.id === current;
          return (
            <li key={course.id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onChange(course.id as CppCourseLevel)}
                className={`group flex min-h-32 w-full flex-col items-start rounded-xl border p-4 text-left transition-[background-color,border-color,color] sm:min-h-36 sm:p-5 ${active ? "border-brand bg-[#17231d] text-[#edf3ef]" : "border-line bg-surface text-ink hover:border-brand/50 hover:bg-wash"}`}
              >
                <span className={`font-mono text-[10px] tracking-[0.14em] ${active ? "text-[#d4ad66]" : "text-muted"}`}>LEVEL 0{course.id}</span>
                <span className="mt-3 font-display text-2xl">{course.description}</span>
                <span className={`mt-auto pt-4 text-xs ${active ? "text-[#a8b5ad]" : "text-muted"}`}>GESP {course.targetGesp}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
