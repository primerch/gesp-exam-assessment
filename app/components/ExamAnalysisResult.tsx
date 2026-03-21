"use client";

import { useState, useMemo } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  Copy, 
  Check,
  BookOpen,
  BarChart3,
  MessageSquare,
  Baby,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  AlertCircle,
} from "lucide-react";
import type { AnalysisResult } from "@/app/types/analysis";

interface ExamAnalysisResultProps {
  result: AnalysisResult;
  examLevel: number;
}

// 英文术语到中文的映射
const KNOWLEDGE_POINT_NAMES: Record<string, string> = {
  pointer: "指针",
  array: "数组",
  "2d_array": "二维数组",
  linked_list: "链表",
  binary_search: "二分查找",
  dp: "动态规划",
  advanced_dp: "复杂动态规划",
  recurrence: "递推",
  recursion: "递归",
  divide_conquer: "分治算法",
  tree: "树与二叉树",
  graph: "图论",
  sorting: "基础排序",
  advanced_sorting: "高级排序",
  base_conversion: "进制转换",
  bit_operation: "位运算",
  data_encoding: "数据编码",
  function: "函数",
  struct: "结构体",
  file_operation: "文件操作",
  high_precision: "高精度运算",
  prime_sieve: "素数筛",
  search: "搜索算法",
  stack_queue: "栈和队列",
  oop: "面向对象",
  hash_table: "哈希表",
  greedy: "贪心算法",
  combinatorics: "排列组合",
  shortest_path: "最短路径",
  mst: "最小生成树",
  binary_lifting: "倍增法",
  math_lib: "数学库函数",
  enumeration_simulation: "枚举模拟",
  string: "字符串操作",
  basic_concepts: "基础概念",
  图: "图论",
  阶乘: "阶乘",
  排列: "排列",
  组合: "组合",
};

function getKnowledgePointName(name: string): string {
  return KNOWLEDGE_POINT_NAMES[name] || name;
}

function getQuestionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    choice: "选择题",
    fill: "填空题",
    programming: "编程题",
    reading: "阅读题",
    unknown: "未知",
  };
  return labels[type] || type;
}

function getQuestionTypeColor(type: string): string {
  const colors: Record<string, string> = {
    choice: "bg-blue-100 text-blue-700",
    fill: "bg-amber-100 text-amber-700",
    programming: "bg-emerald-100 text-emerald-700",
    reading: "bg-purple-100 text-purple-700",
    unknown: "bg-slate-100 text-slate-700",
  };
  return colors[type] || colors.unknown;
}

export default function ExamAnalysisResult({ result, examLevel }: ExamAnalysisResultProps) {
  const [copied, setCopied] = useState(false);
  const [realStudentName, setRealStudentName] = useState<string>("");
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  const displayFeedback = useMemo(() => {
    if (!realStudentName.trim()) {
      return result.parentFeedback;
    }
    const placeholder = result.studentName || "cc";
    if (!placeholder) return result.parentFeedback;
    const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    return result.parentFeedback.replace(regex, realStudentName.trim());
  }, [result.parentFeedback, result.studentName, realStudentName]);

  const handleCopyFeedback = async () => {
    try {
      await navigator.clipboard.writeText(displayFeedback);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const toggleQuestion = (num: number) => {
    const newSet = new Set(expandedQuestions);
    if (newSet.has(num)) {
      newSet.delete(num);
    } else {
      newSet.add(num);
    }
    setExpandedQuestions(newSet);
  };

  const getDifficultyColor = (score: number) => {
    if (score <= 3) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score <= 6) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getDifficultyLabel = (score: number) => {
    if (score <= 3) return "适中";
    if (score <= 6) return "偏难";
    return "很难";
  };

  const displayQuestions = showAllQuestions 
    ? result.questions 
    : result.questions.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* 总体评估卡片 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          试卷分析结果
          {result.quality && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              result.quality.isReliable 
                ? "bg-emerald-100 text-emerald-700" 
                : "bg-amber-100 text-amber-700"
            }`}>
              质量评分: {result.quality.score}/100
            </span>
          )}
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
            <p className="text-sm text-slate-500 mb-1">分析置信度</p>
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

      {/* 质量警告 */}
      {result.quality?.issues && result.quality.issues.length > 0 && (
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
          <div className="flex items-center gap-2 text-amber-800 font-medium mb-2">
            <AlertCircle className="w-5 h-5" />
            质量提醒
          </div>
          <ul className="space-y-1 text-sm text-amber-700">
            {result.quality.issues.map((issue, i) => (
              <li key={i}>• {issue.message}</li>
            ))}
          </ul>
        </div>
      )}

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
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">实际级别</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">涉及题号</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">说明</th>
                </tr>
              </thead>
              <tbody>
                {result.beyondPoints.map((point, index) => (
                  <tr key={index} className="border-b border-slate-100 last:border-b-0">
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-900">{getKnowledgePointName(point.name)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        GESP {point.gespLevel} 级
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-600">
                        第 {point.questionNumbers.slice(0, 5).join(", ")}
                        {point.questionNumbers.length > 5 && "..."} 题
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

      {/* 逐题分析 */}
      {result.questions && result.questions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-blue-600" />
              逐题分析
            </h3>
            <span className="text-sm text-slate-500">
              共 {result.questions.length} 题
            </span>
          </div>

          <div className="space-y-2">
            {displayQuestions.map((q) => (
              <div 
                key={q.number} 
                className={`border rounded-xl overflow-hidden ${
                  q.isBeyond ? "border-amber-200 bg-amber-50/30" : "border-slate-200"
                }`}
              >
                <button
                  onClick={() => toggleQuestion(q.number)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-medium flex items-center justify-center text-sm">
                      {q.number}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getQuestionTypeColor(q.type)}`}>
                      {getQuestionTypeLabel(q.type)}
                    </span>
                    {q.isBeyond && (
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        超纲
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {q.knowledgePoints.length > 0 && (
                      <span className="text-xs text-slate-500">
                        {q.knowledgePoints.length} 个知识点
                      </span>
                    )}
                    {expandedQuestions.has(q.number) ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {expandedQuestions.has(q.number) && (
                  <div className="px-4 pb-4 border-t border-slate-100">
                    {/* 题目内容 */}
                    <div className="py-3 text-sm text-slate-600 line-clamp-3">
                      {q.content}
                    </div>

                    {/* 知识点 */}
                    {q.knowledgePoints.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-slate-500 mb-2">涉及知识点：</p>
                        <div className="flex flex-wrap gap-2">
                          {q.knowledgePoints.map((kp, i) => (
                            <span 
                              key={i}
                              className={`text-xs px-2 py-1 rounded-full ${
                                kp.estimatedLevel > examLevel
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {kp.name} (L{kp.estimatedLevel})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 超纲详情 */}
                    {q.isBeyond && q.beyondPoints.length > 0 && (
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="text-xs text-amber-700 font-medium mb-1">超纲内容：</p>
                        <ul className="text-xs text-amber-600 space-y-1">
                          {q.beyondPoints.map((bp, i) => (
                            <li key={i}>
                              • {bp.name} (实际 GESP {bp.actualLevel} 级)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 显示更多 */}
          {result.questions.length > 10 && (
            <button
              onClick={() => setShowAllQuestions(!showAllQuestions)}
              className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {showAllQuestions 
                ? "收起部分题目" 
                : `显示全部 ${result.questions.length} 道题目`
              }
            </button>
          )}
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
            学生姓名（可选）
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={realStudentName}
              onChange={(e) => setRealStudentName(e.target.value)}
              placeholder="输入学生姓名，反馈中会自动显示"
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
              : "输入学生姓名后，分析报告中会自动添加个性化称呼"}
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div 
            className="prose prose-slate max-w-none prose-sm"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(displayFeedback) }}
          />
        </div>

        <p className="mt-3 text-sm text-slate-500">
          💡 提示：点击"一键复制"可复制上述内容，建议根据实际情况微调后再发给家长
        </p>
      </div>
    </div>
  );
}

// 简单的 markdown 格式化
function formatMarkdown(text: string): string {
  return text
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-3">$1</h2>')
    .replace(/^\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/\n/gim, '<br/>');
}
