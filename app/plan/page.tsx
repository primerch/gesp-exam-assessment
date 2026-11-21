import type { Metadata } from "next";
import CourseProgressWorkspace from "../components/plan/CourseProgressWorkspace";
import { cppCourseLevels, cppLessonsPerLevel, type CppCourseLevel } from "../data/cpp-lessons";

export const metadata: Metadata = {
  title: "学习规划",
  description: "选择 C++ 课程级别和已完成课次，查看 GESP 参考报考等级、准备程度估算与 CCF 原文出处。",
};

export default async function PlanPage({ searchParams }: PageProps<"/plan">) {
  const params = await searchParams;
  const requestedLevel = Number(params.level);
  const requestedLesson = Number(params.lesson);
  const initialLevel = cppCourseLevels.includes(requestedLevel as CppCourseLevel) ? requestedLevel as CppCourseLevel : 1;
  const initialLesson = Number.isInteger(requestedLesson) && requestedLesson >= 1 && requestedLesson <= cppLessonsPerLevel ? requestedLesson : 1;

  return <CourseProgressWorkspace initialLevel={initialLevel} initialLesson={initialLesson} />;
}
