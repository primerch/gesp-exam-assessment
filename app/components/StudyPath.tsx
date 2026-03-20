"use client";

import { Route, CheckCircle2, Circle, Target } from "lucide-react";

const levels = [
  {
    level: 1,
    name: "Level 1",
    description: "编程基础",
    targetGesp: "1-2级",
    lessons: 24,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    topics: ["变量与输入输出", "运算符与条件", "循环结构", "数组基础", "函数入门"],
  },
  {
    level: 2,
    name: "Level 2",
    description: "算法入门",
    targetGesp: "3-4级",
    lessons: 24,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    topics: ["枚举算法", "递推算法", "前缀和与差分", "二分与贪心", "高精度运算"],
  },
  {
    level: 3,
    name: "Level 3",
    description: "算法进阶",
    targetGesp: "5-6级",
    lessons: 24,
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    topics: ["位运算与进制", "递归与分治", "排序算法", "搜索算法", "动态规划"],
  },
  {
    level: 4,
    name: "Level 4",
    description: "竞赛准备",
    targetGesp: "7-8级",
    lessons: 23,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    topics: ["排列组合", "数论算法", "图论算法", "高级DP", "竞赛技巧"],
  },
];

export default function StudyPath() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 bg-blue-100 rounded-lg">
          <Route className="w-4 h-4 text-blue-600" />
        </div>
        <h2 className="text-base font-semibold text-slate-900">学习路径规划</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {levels.map((level, index) => (
          <div
            key={level.level}
            className={`relative p-4 rounded-lg border-2 ${level.borderColor} ${level.bgColor} transition-all hover:shadow-sm`}
          >
            {/* Target badge */}
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r ${level.color} text-white text-xs font-medium mb-3`}>
              <Target className="w-3 h-3" />
              GESP {level.targetGesp}
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-0.5">{level.name}</h3>
            <p className="text-xs text-slate-600 mb-2">{level.description}</p>

            <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
              <Circle className="w-3 h-3" />
              <span>{level.lessons} 课时</span>
            </div>

            {/* Topics */}
            <ul className="space-y-1">
              {level.topics.map((topic, i) => (
                <li key={i} className="flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-600">{topic}</span>
                </li>
              ))}
            </ul>

            {/* Progress indicator */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${level.color} rounded-b-lg`} />
          </div>
        ))}
      </div>

      {/* Course description */}
      <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-xs text-slate-600 leading-relaxed">
          <span className="font-medium text-slate-900">课程设计理念：</span>
          四个级别课程循序渐进，覆盖GESP 1-8级全部知识点。
          Level 1-2 侧重编程基础和算法思维培养，对应GESP 1-4级；
          Level 3-4 深入高级算法和数据结构，对应GESP 5-8级。
        </p>
      </div>
    </div>
  );
}
