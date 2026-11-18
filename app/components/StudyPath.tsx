"use client";

import { Check, Route } from "lucide-react";
import { courseInfo } from "../data/curriculum-data";

const topics = [
  ["变量与输入输出", "运算符与条件", "循环结构", "数组基础", "函数入门"],
  ["枚举算法", "递推算法", "前缀和与差分", "二分与贪心", "高精度运算"],
  ["位运算与进制", "递归与分治", "排序算法", "搜索算法", "动态规划"],
  ["排列组合", "数论算法", "图论算法", "高级 DP", "竞赛技巧"],
];

export default function StudyPath() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Route size={19} strokeWidth={1.5} className="text-brand" aria-hidden />
        <h2 className="text-lg font-medium text-ink">四阶段学习路径</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted">课程循序渐进，从编程基础进入算法与综合应用。</p>

      <ol className="relative mt-8 grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
        <span className="absolute left-0 right-0 top-4 hidden h-px bg-line lg:block" aria-hidden />
        {courseInfo.levels.map((level, index) => (
          <li key={level.id} className={`relative py-6 sm:px-5 ${index > 0 ? "border-t border-line sm:border-t-0 sm:border-l" : ""}`}>
            <span className="relative z-10 grid size-8 place-items-center rounded-full border border-brand bg-surface font-mono text-[11px] text-brand">0{level.id}</span>
            <h3 className="mt-5 text-lg font-medium text-ink">{level.name} · {level.description}</h3>
            <p className="mt-2 text-sm text-brand">目标 GESP {level.targetGesp}</p>
            <p className="mt-2 text-xs text-muted tabular-nums">{level.totalLessons} 课次</p>
            <ul className="mt-5 flex flex-col gap-2">
              {topics[index].map((topic) => <li key={topic} className="flex items-center gap-2 text-xs text-muted"><Check size={13} className="shrink-0 text-brand" aria-hidden />{topic}</li>)}
            </ul>
          </li>
        ))}
      </ol>
      <p className="mt-4 border-t border-line pt-5 text-xs leading-6 text-muted">Level 1–2 侧重编程基础和算法思维，对应 GESP 1–4 级；Level 3–4 深入高级算法与数据结构，对应 GESP 5–8 级。</p>
    </div>
  );
}
