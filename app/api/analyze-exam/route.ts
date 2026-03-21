import { NextRequest, NextResponse } from "next/server";
import { masterAgent } from "@/app/lib/agents/master-agent";
import type { MasterAgentResult } from "@/app/lib/agents/master-agent";

// 配置 API 路由
export const runtime = "nodejs";
export const maxDuration = 300; // 最多 300 秒（10个子代理需要时间）

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
  data?: MasterAgentResult["data"];
  error?: string;
  metadata?: MasterAgentResult["metadata"];
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<AnalyzeResponse>> {
  const startTime = Date.now();
  
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
      studentName = "" 
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

    // 5. 检查文件大小（限制 15MB）
    if (pdfBuffer.length > 15 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "PDF 文件大小超过 15MB 限制" },
        { status: 400 }
      );
    }

    // 6. 调用 Master Agent (10个子代理)
    console.log(`[API] 开始分析试卷: Level ${examLevel}, 学生: Level ${studentLevel}-${studentLesson}, 老师: ${teacherName || "未填写"}`);
    
    const result = await masterAgent({
      pdfBuffer,
      examLevel,
      studentLevel,
      studentLesson,
      teacherName,
      studentName,
    });

    // 7. 返回结果
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || "分析失败",
          metadata: result.metadata,
        },
        { status: 500 }
      );
    }

    const totalTime = Date.now() - startTime;
    console.log(`[API] 分析完成，总耗时: ${totalTime}ms`);

    return NextResponse.json({
      success: true,
      data: result.data,
      metadata: {
        ...result.metadata,
        apiTime: totalTime,
      },
    });

  } catch (error) {
    console.error("[API] 错误:", error);
    
    let errorMessage = "分析过程中发生错误";
    let statusCode = 500;
    
    if (error instanceof Error) {
      const msg = error.message;
      
      if (msg.includes("timeout") || msg.includes("超时")) {
        errorMessage = "⏱️ 分析超时，可能是试卷页数较多或网络较慢\n请稍后重试，或联系管理员";
        statusCode = 504;
      } else if (msg.includes("PDF") || msg.includes("pdf")) {
        errorMessage = "📄 " + msg;
        statusCode = 400;
      } else {
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
    version: "3.0-10-agents",
    message: "世界领先的 10-Agent 试卷分析系统",
    features: [
      "DeepSeek 驱动的知识点提取",
      "逐题精确超纲判定",
      "Markdown 格式教学建议",
      "质量验证与置信度评估",
    ],
  });
}
