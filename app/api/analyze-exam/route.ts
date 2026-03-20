import { NextRequest, NextResponse } from "next/server";
import { analyzeExamV2, ExamAnalysisResult } from "@/app/lib/deepseek";

// 配置 API 路由
export const runtime = "nodejs";
export const maxDuration = 120; // 最多 120 秒（PDF 提取 + 分析需要时间）

// 请求类型
interface AnalyzeRequestBody {
  pdfBase64: string;
  examLevel: number;
  studentLevel: number;
  studentLesson: number;
  teacherName?: string;  // 学管老师名称（可选）
  studentName?: string;  // 学生姓名占位符（可选，默认cc）
}

// 响应类型
interface AnalyzeResponse {
  success: boolean;
  data?: ExamAnalysisResult;
  error?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<AnalyzeResponse>> {
  try {
    // 1. 验证 API Key 配置
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: "DEEPSEEK_API_KEY 未配置，请在 .env.local 文件中设置" 
        },
        { status: 500 }
      );
    }

    // 2. 解析请求体
    let body: AnalyzeRequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "请求格式错误" },
        { status: 400 }
      );
    }

    const { 
      pdfBase64, 
      examLevel, 
      studentLevel, 
      studentLesson, 
      teacherName = "", 
      studentName = "cc" 
    } = body;

    // 3. 验证必填字段
    if (!pdfBase64) {
      return NextResponse.json(
        { success: false, error: "请上传 PDF 试卷" },
        { status: 400 }
      );
    }

    if (!examLevel || examLevel < 1 || examLevel > 8) {
      return NextResponse.json(
        { success: false, error: "请选择有效的试卷级别 (1-8)" },
        { status: 400 }
      );
    }

    if (!studentLevel || studentLevel < 1 || studentLevel > 4) {
      return NextResponse.json(
        { success: false, error: "请选择有效的学生级别 (1-4)" },
        { status: 400 }
      );
    }

    if (!studentLesson || studentLesson < 1) {
      return NextResponse.json(
        { success: false, error: "请输入有效的课程进度" },
        { status: 400 }
      );
    }

    // 4. 验证 base64 数据并转换为 Buffer
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = Buffer.from(pdfBase64, "base64");
    } catch {
      return NextResponse.json(
        { success: false, error: "PDF 文件格式错误" },
        { status: 400 }
      );
    }

    // 5. 检查文件大小（限制 10MB）
    if (pdfBuffer.length > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "PDF 文件大小超过 10MB 限制" },
        { status: 400 }
      );
    }

    // 6. 调用 DeepSeek API 分析
    console.log(`开始分析试卷: Level ${examLevel}, 学生进度: Level ${studentLevel} - 第 ${studentLesson}课, 老师: ${teacherName || "未填写"}, 学生: ${studentName}`);
    
    const result = await analyzeExamV2({
      pdfBuffer,
      examLevel,
      studentLevel,
      studentLesson,
      teacherName,
      studentName,
    });

    // 7. 返回结果
    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("API 错误:", error);
    
    const errorMessage = error instanceof Error ? error.message : "分析过程中发生错误";
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// GET 请求用于健康检查
export async function GET(): Promise<NextResponse> {
  const apiKeyConfigured = !!process.env.DEEPSEEK_API_KEY;
  
  return NextResponse.json({
    status: "ok",
    apiConfigured: apiKeyConfigured,
    message: apiKeyConfigured ? "服务正常" : "DEEPSEEK_API_KEY 未配置",
    usage: apiKeyConfigured ? "请在 .env.local 中配置 DEEPSEEK_API_KEY" : undefined,
  });
}
