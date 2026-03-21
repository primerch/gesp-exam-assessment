import { NextRequest, NextResponse } from "next/server";
import { analyzeExamFast, FastAnalysisResult } from "@/app/lib/exam-analyzer-fast";

// 配置 API 路由
export const runtime = "nodejs";
export const maxDuration = 30; // 30秒足够，纯本地分析很快

// 请求类型
interface AnalyzeRequestBody {
  pdfBase64: string;
  examLevel: number;
  studentLevel: number;
  studentLesson: number;
  teacherName?: string;
  studentName?: string;
}

// 响应类型
interface AnalyzeResponse {
  success: boolean;
  data?: FastAnalysisResult;
  error?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<AnalyzeResponse>> {
  try {
    // 1. 解析请求体
    let body: AnalyzeRequestBody;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("请求体 JSON 解析失败:", parseError);
      return NextResponse.json(
        { success: false, error: "请求格式错误，请刷新页面后重试" },
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

    // 2. 验证必填字段
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

    // 3. 验证 base64 数据并转换为 Buffer
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = Buffer.from(pdfBase64, "base64");
    } catch {
      return NextResponse.json(
        { success: false, error: "PDF 文件格式错误" },
        { status: 400 }
      );
    }

    // 4. 检查文件大小（限制 10MB）
    if (pdfBuffer.length > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "PDF 文件大小超过 10MB 限制" },
        { status: 400 }
      );
    }

    // 5. 调用高性能本地分析引擎（无需 AI，<3秒）
    console.log(`[API] 开始分析试卷: Level ${examLevel}, 学生进度: Level ${studentLevel} - 第 ${studentLesson}课, 老师: ${teacherName || "未填写"}`);
    
    const result = await analyzeExamFast({
      pdfBuffer,
      examLevel,
      studentLevel,
      studentLesson,
      teacherName,
      studentName,
    });

    // 6. 返回结果
    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("API 错误:", error);
    
    let errorMessage = "分析过程中发生错误";
    let statusCode = 500;
    
    if (error instanceof Error) {
      const msg = error.message;
      
      // 分类错误类型
      if (msg.includes("timeout") || msg.includes("超时")) {
        errorMessage = "⏱️ 分析超时，PDF 文件可能太大或格式有问题\n请尝试压缩后上传，或联系管理员";
        statusCode = 504;
      } else if (msg.includes("PDF") || msg.includes("pdf")) {
        errorMessage = "📄 " + msg;
        statusCode = 400;
      } else {
        // 其他错误，使用原始消息
        errorMessage = msg;
      }
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

// GET 请求用于健康检查
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "ok",
    message: "高性能本地分析服务正常",
    version: "2.0-fast",
  });
}
