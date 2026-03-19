"use client";

import { useState, useMemo } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  Copy, 
  Check,
  FileText,
  BookOpen,
  BarChart3,
  MessageSquare,
  Baby,
  Edit3
} from "lucide-react";
import type { ExamAnalysisResult as AnalysisResult } from "@/app/lib/deepseek";
import { getLevelName } from "@/app/data/gesp-outline";

interface ExamAnalysisResultProps {
  result: AnalysisResult;
  examLevel: number;
}

export default function ExamAnalysisResult({ result, examLevel }: ExamAnalysisResultProps) {
  const [copied, setCopied] = useState(false);
  const [realStudentName, setRealStudentName] = useState<string>(""); // 学生真实姓名

  // 替换学生姓名为真实姓名
  const displayFeedback = useMemo(() => {
    if (!realStudentName.trim()) {
      return result.parentFeedback;
    }
    // 使用正则替换所有占位符（支持多个匹配）
    const placeholder = result.studentName || "cc";
    const regex = new RegExp(placeholder, 'g');
    return result.parentFeedback.replace(regex, realStudentName.trim());
  }, [result.parentFeedback, result.studentName, realStudentName]);

  const handleCopyFeedback = async () => {
    try {
      await navigator.clipboard.writeText(displayFeedback);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 复制失败静默处理
    }
  };

  // 难度评分颜色
  const getDifficultyColor = (score: number) => {
    if (score <= 3) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score <= 6) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  // 难度标签
  const getDifficultyLabel = (score: number) => {
    if (score <= 3) return "适中";
    if (score <= 6) return "偏难";
    return "很难";
  };

  return (
    <div className="space-y-6">
      {/* 总体评估卡片 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          试卷分析结果
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 难度评分 */}
          <div className={`rounded-xl p-4 border ${getDifficultyColor(result.difficultyScore)}`}>
            <p className="text-sm opacity-80 mb-1">难度系数</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{result.difficultyScore}</span>
              <span className="text-sm">/ 10</span>
            </div>
            <p className="text-sm mt-1 font-medium">{getDifficultyLabel(result.difficultyScore)}</p>
          </div>

          {/* 超纲判断 */}
          <div className={`rounded-xl p-4 border ${
            result.isBeyondSyllabus 
              ? "bg-amber-50 border-amber-200 text-amber-700" 
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}>
            <p className="text-sm opacity-80 mb-1">超纲判断</p>
            <div className="flex items-center gap-2">
              {result.isBeyondSyllabus ? (
                <>
                  <AlertTriangle className="w-6 h-6" />
                  <span className="text-xl font-bold">存在超纲</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-xl font-bold">未超纲</span>
                </>
              )}
            </div>
            <p className="text-sm mt-1">
              {result.isBeyondSyllabus 
                ? `发现 ${result.beyondPoints.length} 个超纲知识点` 
                : "符合 GESP " + examLevel + " 级大纲要求"}
            </p>
          </div>

          {/* 置信度 */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-500 mb-1">AI 分析置信度</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-700">
                {Math.round(result.confidence * 100)}%
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {result.confidence > 0.8 ? "高置信度" : result.confidence > 0.6 ? "中等置信度" : "建议人工复核"}
            </p>
          </div>
        </div>

        {/* 总体评价 */}
        {result.summary && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl">
            <p className="text-slate-700 leading-relaxed">{result.summary}</p>
          </div>
        )}
      </div>

      {/* 超纲知识点详情 */}
      {result.isBeyondSyllabus && result.beyondPoints.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            超纲知识点详情
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">知识点</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">实际所属级别</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">超纲原因</th>
                </tr>
              </thead>
              <tbody>
                {result.beyondPoints.map((point, index) => (
                  <tr key={index} className="border-b border-slate-100 last:border-b-0">
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-900">{point.name}</span>
                      {point.questionContext && (
                        <p className="text-sm text-slate-500 mt-1">{point.questionContext}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        GESP {point.gespLevel} 级
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{point.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 学管反馈建议 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            学管反馈建议
          </h3>
          <button
            onClick={handleCopyFeedback}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                已复制
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                一键复制
              </>
            )}
          </button>
        </div>

        {/* 学生真实姓名输入 */}
        <div className="mb-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <label className="block text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
            <Baby className="w-4 h-4" />
            学生真实姓名（将替换反馈中的"{result.studentName || "cc"}"）
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={realStudentName}
              onChange={(e) => setRealStudentName(e.target.value)}
              placeholder={`输入真实姓名替换${result.studentName || "cc"}`}
              className="flex-1 p-3 bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {realStudentName && (
              <button
                onClick={() => setRealStudentName("")}
                className="px-4 py-2 text-amber-600 bg-white border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors text-sm"
              >
                重置
              </button>
            )}
          </div>
          <p className="text-xs text-amber-600 mt-2">
            {realStudentName.trim() 
              ? `反馈中将显示"${realStudentName.trim()}"，复制时会自动替换` 
              : `当前使用占位符"${result.studentName || "cc"}"，输入真实姓名后可一键替换`}
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-sm">
            {displayFeedback}
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          💡 提示：点击"一键复制"可复制上述内容，建议根据实际情况微调后再发给家长
        </p>
      </div>
    </div>
  );
}
