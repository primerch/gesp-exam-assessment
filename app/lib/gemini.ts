import { GoogleGenerativeAI } from "@google/generative-ai";
import { gespSyllabus } from "@/app/data/curriculum-data";

// 初始化 Gemini 客户端
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return new GoogleGenerativeAI(apiKey);
};

// 分析试卷的请求类型
export interface ExamAnalysisRequest {
  pdfBase64: string; // PDF 文件的 base64 编码
  examLevel: number; // 试卷声称的 GESP 级别 (1-8)
  studentLevel: number; // 学生当前课程级别 (1-4)
  studentLesson: number; // 学生当前课程进度
}

// 超纲知识点类型
export interface BeyondKnowledgePoint {
  name: string;
  gespLevel: number; // 该知识点实际属于的 GESP 级别
  reason: string; // 为什么认为超纲
  questionContext?: string; // 在试卷中的上下文
}

// 分析结果类型
export interface ExamAnalysisResult {
  difficultyScore: number; // 难度系数 1-10
  isBeyondSyllabus: boolean; // 是否超纲
  beyondPoints: BeyondKnowledgePoint[]; // 超纲知识点列表
  parentFeedback: string; // 给家长的反馈文案
  summary: string; // 总体评价
  confidence: number; // AI 分析的置信度 0-1
}

// 将 GESP 大纲格式化为描述文本
function formatSyllabusDescription(level: number): string {
  const points = gespSyllabus[level];
  if (!points || points.length === 0) {
    return "未知级别";
  }
  
  const lines: string[] = [`GESP ${level}级大纲（${points.length}个考点）：`];
  points.forEach(point => {
    lines.push(`- ${point.name}：${point.description}`);
  });
  
  return lines.join("\n");
}

// 构建分析 Prompt
function buildAnalysisPrompt(
  examLevel: number,
  studentLevel: number,
  studentLesson: number
): string {
  // 生成目标级别的大纲
  const targetOutline = formatSyllabusDescription(examLevel);
  
  // 生成其他级别大纲（用于判断超纲）
  const otherOutlines: string[] = [];
  for (let i = 1; i <= 8; i++) {
    if (i !== examLevel) {
      const points = gespSyllabus[i];
      otherOutlines.push(`GESP ${i}级：${points.map(p => p.name).join("、")}`);
    }
  }
  
  return `你是一位专业的 GESP (CCF 编程能力等级认证) C++ 考试分析师。请仔细分析上传的 PDF 试卷，并与 GESP ${examLevel} 级官方大纲进行对比。

## 学生背景信息
- 学生当前课程级别: Level ${studentLevel}
- 已完成课程进度: 第 ${studentLesson} 课

## 目标级别大纲要求
${targetOutline}

## 其他级别大纲（用于超纲判断参考）
${otherOutlines.join("\n")}

## 分析任务
请仔细分析试卷的每一道题目，判断：
1. 难度系数 (1-10)：相对于 GESP ${examLevel} 级的标准难度
2. 是否有超纲内容：超出 GESP ${examLevel} 级大纲的知识点
3. 具体超纲知识点：列出每个超纲知识点的名称、实际所属级别、超纲原因

## 输出格式要求
请以 JSON 格式返回分析结果：
{
  "difficultyScore": number, // 1-10 的难度评分
  "isBeyondSyllabus": boolean, // true/false
  "beyondPoints": [
    {
      "name": string, // 超纲知识点名称
      "gespLevel": number, // 该知识点实际属于的 GESP 级别
      "reason": string, // 超纲原因说明
      "questionContext": string // 在试卷中的上下文描述
    }
  ],
  "parentFeedback": string, // 给家长的正式反馈文案（中文，专业友好的语气）
  "summary": string, // 总体评价（中文）
  "confidence": number // AI 分析的置信度 0-1
}

## 给学管老师的反馈文案要求
- 语气委婉、温和，避免过于强硬或批评性语言
- 从鼓励学生的角度出发，肯定学生的努力和现有水平
- 说明试卷整体难度评估时，用客观描述而非主观评判
- 如果有超纲内容，用"涉及了一些进阶知识点"、"可以提前了解"等委婉表达，避免"超纲"、"未掌握"等负面词汇
- 建议学习方向时，用"建议逐步学习"、"可以循序渐进地接触"等积极表达
- 文案格式为纯文本，不要使用 markdown 格式（不要加 ** 等符号）
- 整体风格：温和、鼓励、建设性，让家长感受到机构的专业和对学生的关心

## 注意事项
- 只分析 C++ 相关内容，忽略 Python 或其他语言内容
- 以 GESP ${examLevel} 级大纲为标准进行判断
- 如果题目涉及多个知识点，请分别判断每个知识点是否超纲
- 严格按照 C++11 标准判断语法要求`;
}

// 分析试卷主函数
export async function analyzeExam(
  request: ExamAnalysisRequest
): Promise<ExamAnalysisResult> {
  const client = getGeminiClient();
  
  // 使用 Gemini 1.5 Flash 模型（支持 PDF，速度快）
  const model = client.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.2, // 低温度以获得更确定的结果
      maxOutputTokens: 4096,
    }
  });

  const prompt = buildAnalysisPrompt(
    request.examLevel,
    request.studentLevel,
    request.studentLesson
  );

  try {
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: request.pdfBase64,
        },
      },
      prompt,
    ]);

    const response = result.response;
    const text = response.text();

    // 提取 JSON 部分
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("无法解析 AI 返回的结果");
    }

    const analysisResult: ExamAnalysisResult = JSON.parse(jsonMatch[0]);
    
    // 验证结果格式
    if (typeof analysisResult.difficultyScore !== 'number' ||
        typeof analysisResult.isBeyondSyllabus !== 'boolean' ||
        !Array.isArray(analysisResult.beyondPoints)) {
      throw new Error("AI 返回的结果格式不正确");
    }

    return analysisResult;
  } catch (error) {
    console.error("Gemini API 调用失败:", error);
    throw new Error(
      error instanceof Error ? error.message : "试卷分析失败"
    );
  }
}

// 简单的健康检查
export async function checkGeminiHealth(): Promise<boolean> {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    await model.generateContent("Hello");
    return true;
  } catch {
    return false;
  }
}
