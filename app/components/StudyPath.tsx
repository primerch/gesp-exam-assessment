"use client";

import { Route, CheckCircle2, Circle, Lock, Target } from "lucide-react";
import { courseInfo } from "../data/curriculum-data";

export default function StudyPath() {
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Route className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-900">学习路径规划</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {levels.map((level, index) => (
          <div
            key={level.level}
            className={`relative p-5 rounded-2xl border-2 ${level.borderColor} ${level.bgColor} transition-all hover:shadow-md`}
          >
            {/* 连接箭头 */}
            {index < levels.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <div className="w-6 h-6 bg-white rounded-full border-2 border-slate-300 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-slate-400 border-b-4 border-b-transparent ml-0.5" />
                </div>
              </div>
            )}

            {/* 等级标题 */}
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${level.color} text-white text-sm font-medium mb-4`}>
              <Target className="w-4 h-4" />
              目标：GESP {level.targetGesp}
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1">{level.name}</h3>
            <p className="text-sm text-slate-600 mb-3">{level.description}</p>

            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <Circle className="w-4 h-4" />
              <span>{level.lessons} 课时</span>
            </div>

            {/* 知识点预览 */}
            <div className="space-y-2">
              {level.topics.map((topic, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{topic}</span>
                </div>
              ))}
            </div>

            {/* 底部装饰 */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${level.color} rounded-b-2xl`} />
          </div>
        ))}
      </div>

      {/* 总体说明 */}
      <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-slate-600">
            <p className="font-medium text-slate-900 mb-2">课程设计理念</p>
            <p>
              四个级别课程循序渐进，覆盖GESP 1-8级全部知识点。
              Level 1-2 侧重编程基础和算法思维培养，对应GESP 1-4级；
              Level 3-4 深入高级算法和数据结构，对应GESP 5-8级。
              完成全部课程后，学生将具备扎实的编程能力和竞赛水平。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
