"use client";

import { useState } from "react";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/reui/timeline";
import { courseInfo } from "../../data/curriculum-data";
import { getCourseSummary } from "../../lib/course-summary";

export default function CourseTimeline() {
  const [activeStep, setActiveStep] = useState(1);
  const summary = getCourseSummary();

  return (
    <div data-course-timeline className="min-w-0 w-full">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">课程阶段演示 · 点击查看对应 GESP 目标</p>
        <span className="font-mono text-xs text-muted tabular-nums">LEVEL {activeStep}</span>
      </div>
      <div className="overflow-x-auto pb-3">
        <Timeline
          value={activeStep}
          onValueChange={setActiveStep}
          orientation="horizontal"
          className="min-w-[760px] border-y border-line py-6"
        >
          {courseInfo.levels.map((course, index) => (
            <TimelineItem key={course.id} step={index + 1}>
              <TimelineHeader>
                <TimelineSeparator />
                <TimelineDate className="font-mono text-brand">LEVEL {course.id}</TimelineDate>
                <TimelineTitle className="text-base text-ink">{course.description}</TimelineTitle>
                <TimelineIndicator className={activeStep === index + 1 ? "border-current bg-current" : "border-line bg-surface"} />
              </TimelineHeader>
              <TimelineContent>
                <button
                  type="button"
                  aria-pressed={activeStep === index + 1}
                  onClick={() => setActiveStep(index + 1)}
                  className={`mt-3 flex min-h-20 w-full flex-col items-start rounded-lg p-3 text-left transition-[background-color,border-color] ${activeStep === index + 1 ? "bg-wash text-ink" : "text-muted hover:bg-quiet"}`}
                >
                  <span className="text-sm text-brand">GESP {course.targetGesp}</span>
                  <span className="mt-2 text-xs text-muted tabular-nums">{summary.perLevel[course.id]} 课次</span>
                </button>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </div>
  );
}
