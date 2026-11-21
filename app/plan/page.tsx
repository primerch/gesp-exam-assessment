import type { Metadata } from "next";
import CourseProgressWorkspace from "../components/plan/CourseProgressWorkspace";

export const metadata: Metadata = {
  title: "学习规划",
  description: "选择 C++ 课程级别和已完成课次，查看 GESP 参考报考等级、准备程度估算与 CCF 原文出处。",
};

export default function PlanPage() {
  return <CourseProgressWorkspace />;
}
