"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  FileUp, 
  GraduationCap, 
  Loader2,
  AlertCircle,
  ChevronDown,
  User,
  Baby
} from "lucide-react";
import Header from "@/app/components/Header";
import PdfUploader from "@/app/components/PdfUploader";
import ExamAnalysisResult from "@/app/components/ExamAnalysisResult";
import { courseInfo } from "@/app/data/curriculum-data";
import { getLevelName } from "@/app/data/gesp-outline";
import type { ExamAnalysisResult as AnalysisResult } from "@/app/lib/deepseek";

// GESP 级别选项
const gespLevels = [
  { level: 1, name: "GESP 一级", description: "编程基础" },
  { level: 2, name: "GESP 二级", description: "程序设计" },
  { level: 3, name: "GESP 三级", description: "算法基础" },
  { level: 4, name: "GESP 四级", description: "数据结构" },
  { level: 5, name: "GESP 五级", description: "高级算法" },
  { level: 6, name: "GESP 六级", description: "搜索与DP" },
  { level: 7, name: "GESP 七级", description: "图论与DP" },
  { level: 8, name: "GESP 八级", description: "综合应用" },
];

export default function AnalyzePage() {
  const router = useRouter();
  
  // 表单状态
  const [pdfBase64, setPdfBase64] = useState<string>("");
  const [examLevel, setExamLevel] = useState<number>(3); // 默认三级
  const [studentLevel, setStudentLevel] = useState<number>(1);
  const [studentLesson, setStudentLesson] = useState<number>(12);
  const [teacherName, setTeacherName] = useState<string>(""); // 学管老师名称
  
  // 分析状态
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 获取当前级别信息
  const currentLevelInfo = courseInfo.levels.find(l => l.id === studentLevel);
  const maxLessons = currentLevelInfo?.totalLessons || 24;

  // 处理 PDF 上传
  const handlePdfSelect = (base64: string) => {
    setPdfBase64(base64);
    setError(null);
  };

  // 清除 PDF
  const handlePdfClear = () => {
    setPdfBase64("");
    setAnalysisResult(null);
  };

  // 提交分析
  const handleAnalyze = async () => {
    if (!pdfBase64) {
      setError("请先上传 PDF 试卷");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/analyze-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfBase64,
          examLevel,
          studentLevel,
          studentLesson,
          teacherName,
          studentName: "",
        }),
      });

      // 检查响应内容类型
      const contentType = response.headers.get("content-type");
      
      // 如果不是 JSON 响应，可能是服务器错误页面
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("非 JSON 响应:", text.slice(0, 500));
        throw new Error("服务器返回格式错误，请稍后重试");
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("JSON 解析错误:", jsonError);
        throw new Error("服务器返回数据解析失败，请稍后重试");
      }

      if (!response.ok || !data.success) {
        // 根据状态码提供更具体的错误信息
        let errorMsg = data.error || "分析失败";
        if (response.status === 504 || response.status === 408) {
          errorMsg = "⏱️ 分析超时\n\n可能原因：\n• PDF 文件较大，请尝试压缩后上传\n• 网络连接较慢，请稍后重试\n• AI 服务繁忙，请等待几分钟后再次尝试";
        } else if (response.status === 502 || response.status === 503) {
          errorMsg = "🔧 AI 服务暂时不可用\n\n请稍后重试，或联系管理员";
        }
        throw new Error(errorMsg);
      }

      setAnalysisResult(data.data);
    } catch (err) {
      console.error("分析错误:", err);
      const errorMsg = err instanceof Error ? err.message : "分析过程中发生错误";
      setError(errorMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回首页</span>
        </button>

        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            GESP 试卷质量评估
          </h1>
          <p className="text-slate-600">
            上传空白 PDF 试卷，奶爸帮你评估试卷难度、超纲情况，给出教学建议
          </p>
        </div>

        {/* 上传和分析表单 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          {/* PDF 上传 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              <span className="flex items-center gap-2">
                <FileUp className="w-4 h-4" />
                上传试卷 PDF
              </span>
            </label>
            <PdfUploader 
              onFileSelect={handlePdfSelect} 
              onClear={handlePdfClear} 
            />
          </div>

          {/* 试卷级别选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              试卷级别
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {gespLevels.map((level) => (
                <button
                  key={level.level}
                  onClick={() => setExamLevel(level.level)}
                  className={`p-3 rounded-xl border-2 text-left transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    examLevel === level.level
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="font-semibold text-slate-900">{level.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{level.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 学生进度 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                学生当前进度
              </span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 课程级别 */}
              <div>
                <label className="block text-xs text-slate-500 mb-2">课程级别</label>
                <div className="relative">
                  <select
                    value={studentLevel}
                    onChange={(e) => {
                      setStudentLevel(Number(e.target.value));
                      setStudentLesson(1);
                    }}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {courseInfo.levels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name} - {level.description}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 课次 */}
              <div>
                <label className="block text-xs text-slate-500 mb-2">
                  已完成课次 (1-{maxLessons})
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={maxLessons}
                    value={studentLesson}
                    onChange={(e) => setStudentLesson(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-slate-500 whitespace-nowrap">/ {maxLessons} 课</span>
                </div>
              </div>
            </div>
          </div>

          {/* 老师信息 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                分析反馈署名
              </span>
            </label>
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                您的名字（用于分析报告开头）
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="例如：多多"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                分析报告开头将显示：你好，我是{teacherName || "XX"}老师
              </p>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-red-900">分析失败</p>
                <p className="text-red-700 text-sm mt-1 whitespace-pre-line">{error}</p>
              </div>
            </div>
          )}

          {/* 分析按钮 */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !pdfBase64}
            className={`
              w-full py-4 rounded-xl font-semibold text-lg transition-all
              flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${isAnalyzing || !pdfBase64
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
              }
            `}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                分析中，请稍候...
              </>
            ) : (
              <>
                <FileUp className="w-5 h-5" />
                开始分析试卷
              </>
            )}
          </button>

          {isAnalyzing && (
            <p className="mt-3 text-center text-sm text-slate-500">
              正在提取 PDF 文本并分析，大约需要 15-60 秒...
            </p>
          )}
        </div>

        {/* 分析结果 */}
        {analysisResult && (
          <ExamAnalysisResult 
            result={analysisResult} 
            examLevel={examLevel}
          />
        )}

        {/* 使用说明 */}
        {!analysisResult && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-semibold text-blue-900 mb-3">使用说明</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>• 上传 GESP 1-8 级 C++ 考试的<strong>空白 PDF 试卷</strong>（不是学生做完的）</li>
              <li>• 系统会分析试卷本身的质量：难度、超纲情况、适合的学生群体</li>
              <li>• 请确保 PDF 是文字版而非扫描件/图片</li>
              <li>• 文件大小限制 10MB</li>
              <li>• 填写您的名字，分析报告开头将显示"你好，我是XX老师"</li>
            </ul>
          </div>
        )}
      </div>

      {/* 页脚 */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-slate-500">
            © 2026 五个奶爸少儿编程 · GESP 试卷分析系统
          </div>
        </div>
      </footer>
    </main>
  );
}
