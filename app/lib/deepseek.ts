// GESP 试卷分析 - DeepSeek AI 层
// 新架构：DeepSeek Chat 提取 + 规则引擎判定 + (必要时) Reasoner 验证

import OpenAI from "openai";

// 使用动态导入来处理 pdf2json
async function getPDFParser() {
  const pdf2json = await import("pdf2json");
  return pdf2json.default || pdf2json;
}

// 初始化 DeepSeek 客户端
const getDeepSeekClient = () => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not set");
  }
  
  return new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.deepseek.com/v1",
  });
};

// ==================== 类型定义 ====================

export interface ExamAnalysisRequest {
  pdfBuffer: Buffer;
  examLevel: number;
  studentLevel: number;
  studentLesson: number;
  teacherName: string;
  studentName: string;
}

export interface Question {
  number: number;
  type: "choice" | "fill" | "programming" | "unknown";
  content: string;
}

export interface BeyondKnowledgePoint {
  name: string;
  gespLevel: number;
  reason: string;
  questionNumbers: number[];
  questionContext?: string;
}

export interface ExamAnalysisResult {
  difficultyScore: number;
  isBeyondSyllabus: boolean;
  beyondPoints: BeyondKnowledgePoint[];
  parentFeedback: string;
  summary: string;
  confidence: number;
  teacherName: string;
  studentName: string;
  ruleEngineStats?: {
    certainCount: number;
    uncertainCount: number;
    certainRate: number;
  };
}

// ==================== PDF 文本提取 ====================

export async function extractPdfText(pdfBuffer: Buffer): Promise<string> {
  try {
    const PDFParser = await getPDFParser();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfParser = new (PDFParser as any)(null, 1);
    
    return new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData: { parserError: Error }) => {
        reject(new Error(`PDF 解析错误: ${errData.parserError.message}`));
      });
      
      pdfParser.on("pdfParser_dataReady", (pdfData: { Pages: Array<{ Texts: Array<{ R: Array<{ T: string }> }> }> }) => {
        try {
          let text = "";
          for (let i = 0; i < pdfData.Pages.length; i++) {
            const page = pdfData.Pages[i];
            text += `\n--- Page ${i + 1} ---\n`;
            
            for (const textItem of page.Texts) {
              for (const r of textItem.R) {
                try {
                  text += decodeURIComponent(r.T) + " ";
                } catch {
                  text += r.T + " ";
                }
              }
            }
            text += "\n";
          }
          resolve(text);
        } catch {
          reject(new Error("提取 PDF 文本时出错"));
        }
      });
      
      pdfParser.parseBuffer(pdfBuffer);
    });
  } catch {
    throw new Error("PDF 解析模块加载失败");
  }
}

// ==================== Step 1: 提取题目 ====================

export async function extractQuestions(pdfText: string): Promise<Question[]> {
  const client = getDeepSeekClient();
  
  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `你是一位试卷内容提取助手。请从 PDF 文本中提取所有题目。

提取要求：
1. 识别题目编号（如：1、2、3... 或 一、二...）
2. 区分题目类型：
   - choice: 选择题（有 A/B/C/D 选项）
   - fill: 填空题（有下划线或空格）
   - programming: 编程题（有代码、主函数等）
3. 保留完整题目文本，包括代码片段

重要：必须返回有效的 JSON 格式！

输出格式：
{
  "questions": [
    {
      "number": 1,
      "type": "choice",
      "content": "题目文本..."
    }
  ]
}

如果无法提取题目，返回：{"questions": []}`,
        },
        {
          role: "user",
          content: pdfText.slice(0, 12000),
        },
      ],
      temperature: 0.1,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      console.error("DeepSeek 返回空响应");
      return [];
    }

    const result = JSON.parse(responseText);
    
    // 兼容多种可能的返回格式
    let questions: Question[] = [];
    
    if (Array.isArray(result.questions)) {
      questions = result.questions;
    } else if (Array.isArray(result)) {
      questions = result;
    } else if (result.data && Array.isArray(result.data)) {
      questions = result.data;
    }
    
    // 验证每个题目的格式
    questions = questions.filter(q => {
      return q && typeof q.number === 'number' && typeof q.content === 'string';
    });

    return questions;
  } catch (error) {
    console.error("提取题目失败:", error);
    return [];
  }
}

// 简单的题目提取（基于正则，作为备用）
export function extractQuestionsSimple(pdfText: string): Question[] {
  const questions: Question[] = [];
  const lines = pdfText.split('\n');
  
  let currentQuestion: Partial<Question> | null = null;
  let currentContent: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // 匹配题目编号：1. 或 1、或 第1题 等
    const questionMatch = line.match(/^(\d+)[\.、\s]/);
    
    if (questionMatch) {
      // 保存上一个题目
      if (currentQuestion && currentContent.length > 0) {
        questions.push({
          number: currentQuestion.number!,
          type: detectQuestionType(currentContent.join('\n')),
          content: currentContent.join('\n'),
        });
      }
      
      // 开始新题目
      currentQuestion = { number: parseInt(questionMatch[1]) };
      currentContent = [line];
    } else if (currentQuestion) {
      currentContent.push(line);
    }
  }
  
  // 保存最后一个题目
  if (currentQuestion && currentContent.length > 0) {
    questions.push({
      number: currentQuestion.number!,
      type: detectQuestionType(currentContent.join('\n')),
      content: currentContent.join('\n'),
    });
  }
  
  return questions;
}

// 检测题目类型
function detectQuestionType(content: string): Question["type"] {
  if (content.includes('main(') || content.includes('#include') || content.includes('void ')) {
    return 'programming';
  }
  if (/[A-D][\.、\s]/.test(content) || content.includes('选项')) {
    return 'choice';
  }
  if (content.includes('___') || content.includes('填空') || content.includes('（') && content.includes('）')) {
    return 'fill';
  }
  return 'choice';
}

// ==================== Step 2: 验证不确定的题目 ====================

export interface UncertainQuestion {
  number: number;
  text: string;
  reason: string;
}

export interface VerifiedResult {
  number: number;
  isBeyond: boolean;
  confidence: number;
  reason: string;
  gespLevel?: number;
}

export async function verifyUncertainQuestions(
  questions: UncertainQuestion[],
  examLevel: number
): Promise<VerifiedResult[]> {
  if (questions.length === 0) return [];
  
  const client = getDeepSeekClient();
  
  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-reasoner", // 只在不确定时使用 reasoning
      messages: [
        {
          role: "system",
          content: `你是一位专业的 GESP C++ 考试分析师。

任务：判断以下题目是否超出 GESP ${examLevel} 级大纲。

判断标准：
- GESP 1级：基础语法、变量、输入输出、分支循环
- GESP 2级：流程图、ASCII、类型转换、嵌套结构、数学函数
- GESP 3级：进制转换、位运算、数组、字符串、枚举模拟
- GESP 4级：指针、函数、结构体、递推、基础排序、文件
- GESP 5级：数论、高精度、链表、二分、递归分治、贪心
- GESP 6级：树、搜索、简单DP、面向对象、栈队列
- GESP 7级：数学库、复杂DP、图论基础、哈希表
- GESP 8级：排列组合、最短路径、最小生成树、倍增

注意：
- 三进制、四进制等属于进制转换变体，在 3 级不超纲
- 只输出 JSON，不要其他文字`,
        },
        {
          role: "user",
          content: JSON.stringify({
            examLevel,
            questions: questions.map(q => ({
              number: q.number,
              content: q.text.slice(0, 500), // 限制长度
            })),
          }),
        },
      ],
      temperature: 0.2,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("AI 返回空响应");
    }

    const result = JSON.parse(responseText);
    
    if (!Array.isArray(result.results)) {
      throw new Error("AI 返回格式不正确");
    }

    return result.results.map((r: VerifiedResult) => ({
      ...r,
      confidence: r.confidence || 0.85, // 默认置信度
    }));
  } catch (error) {
    console.error("验证题目失败:", error);
    // 降级：全部返回不超纲
    return questions.map(q => ({
      number: q.number,
      isBeyond: false,
      confidence: 0.5,
      reason: "验证失败，默认不超纲",
    }));
  }
}

// ==================== Step 3: 生成试卷评估反馈 ====================

export async function generateFeedback(
  params: {
    examLevel: number;
    studentLevel: number;
    studentLesson: number;
    difficultyScore: number;
    beyondPoints: BeyondKnowledgePoint[];
    teacherName: string;
    studentName: string; // 保留参数但不再使用
  }
): Promise<{ parentFeedback: string; summary: string }> {
  const client = getDeepSeekClient();
  
  const {
    examLevel,
    studentLevel,
    studentLesson,
    difficultyScore,
    beyondPoints,
    teacherName,
  } = params;

  const hasBeyond = beyondPoints.length > 0;
  
  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `你是一位专业的编程老师，正在帮同事评估一份GESP考试试卷的质量。

重要：评价对象是试卷本身，不是学生！用户上传的是空白试卷，不是学生做完的试卷。

语气要求：
- 像微信私聊一样自然、专业
- 口语化，简短真诚
- 适当使用 emoji
- 避免套话："综上所述"、"值得注意的是"等
- 不要罗列 1234，像聊天一样

格式要求：
- 开头：你好，我是${teacherName || "学管老师"}
- 不要称呼学生姓名（如"cc同学"），因为没有具体学生
- 评价的是试卷质量，不是学生表现
- 给出教学建议：这份试卷适合什么水平的学生、什么时候用
- 结尾：亲切的话`,
        },
        {
          role: "user",
          content: `请评估这份GESP ${examLevel}级试卷的质量：

试卷信息：
- GESP ${examLevel} 级试卷
- 参考学生进度：Level ${studentLevel} 第 ${studentLesson} 课（用于判断是否超纲）
- 试卷难度：${difficultyScore}/10
- ${hasBeyond ? `发现 ${beyondPoints.length} 个超纲知识点：${beyondPoints.map(p => `${p.name}(GESP${p.gespLevel}级)`).join("、")}` : "无超纲内容"}

请生成：
1. 试卷评估反馈（200-400字）：评价试卷本身质量，给出教学建议（适合什么学生、什么时候用）
2. 总体评价（50字以内）

注意：不要说"学生做得怎么样"，评价的是"试卷出得怎么样"

输出 JSON 格式：
{
  "parentFeedback": "...",
  "summary": "..."
}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("AI 返回空响应");
    }

    const result = JSON.parse(responseText);
    
    return {
      parentFeedback: result.parentFeedback || generateFallbackFeedback(params),
      summary: result.summary || "完成分析",
    };
  } catch (error) {
    console.error("生成反馈失败:", error);
    return {
      parentFeedback: generateFallbackFeedback(params),
      summary: `试卷难度 ${difficultyScore}/10，${hasBeyond ? "存在超纲内容" : "内容适中"}`,
    };
  }
}

// 降级反馈生成（评价试卷，不是学生）
function generateFallbackFeedback(
  params: {
    examLevel: number;
    studentLevel: number;
    studentLesson: number;
    difficultyScore: number;
    beyondPoints: BeyondKnowledgePoint[];
    teacherName: string;
    studentName: string;
  }
): string {
  const { examLevel, teacherName, difficultyScore, beyondPoints, studentLevel, studentLesson } = params;
  
  const teacher = teacherName || "学管老师";
  
  let feedback = `你好，我是${teacher}\n\n`;
  feedback += `刚分析了这份 GESP ${examLevel} 级试卷\n\n`;
  
  // 难度评价
  if (difficultyScore >= 8) {
    feedback += `整体难度较高（${difficultyScore}/10），比标准${examLevel}级难一些 `;
  } else if (difficultyScore >= 6) {
    feedback += `整体难度适中（${difficultyScore}/10），符合${examLevel}级标准 `;
  } else {
    feedback += `整体难度偏易（${difficultyScore}/10），适合基础巩固 `;
  }
  
  // 超纲分析
  if (beyondPoints.length > 0) {
    feedback += `\n\n发现 ${beyondPoints.length} 个超纲知识点：${beyondPoints.map(p => p.name).join("、")}`;
    feedback += `\n\n如果给刚学到 Level ${studentLevel} 第 ${studentLesson} 课的学生做，可能会有难度`;
    feedback += `，建议等学生学完相关知识点后再用这份试卷`;
  } else {
    feedback += `\n\n试卷内容都符合大纲要求，没有超纲题目`;
    feedback += `，适合 Level ${studentLevel} 阶段的学生练习`;
  }
  
  feedback += `\n\n有其他想分析的试卷随时发我哈~`;
  
  return feedback;
}

// ==================== 主分析函数（新架构）====================

import { RuleEngine } from "./rule-engine";
import { getCachedAnalysisWithFallback, cacheAnalysisWithFallback, generateQuestionHash } from "./cache";

export async function analyzeExamV2(
  request: ExamAnalysisRequest
): Promise<ExamAnalysisResult> {
  const startTime = Date.now();
  
  // 1. 提取 PDF 文本
  const pdfText = await extractPdfText(request.pdfBuffer);
  if (!pdfText || pdfText.trim().length === 0) {
    throw new Error("PDF 文件无法提取文本，可能是扫描件或图片 PDF");
  }

  // 2. DeepSeek Chat 提取题目（约 2 秒）
  let questions = await extractQuestions(pdfText);
  
  // 如果 AI 提取失败，使用备用方案
  if (questions.length === 0) {
    console.log("AI 提取题目失败，使用备用方案...");
    questions = extractQuestionsSimple(pdfText);
  }
  
  // 如果还是失败，使用整块文本分析
  if (questions.length === 0) {
    console.log("备用方案也失败，使用整块文本分析...");
    questions = [{
      number: 1,
      type: "unknown",
      content: pdfText.slice(0, 5000),
    }];
  }

  // 3. 规则引擎分析（约 100ms）
  const ruleEngine = new RuleEngine(request.examLevel);
  const ruleResult = ruleEngine.analyze({
    questions: questions.map(q => ({
      number: q.number,
      text: q.content,
      type: q.type,
    })),
    examLevel: request.examLevel,
  });

  // 4. 检查缓存
  const uncertainQuestions = ruleEngine.getUncertainQuestions(ruleResult);
  const aiVerificationNeeded = uncertainQuestions.length > 0;
  
  // 5. 如果有不确定的题目，调用 DeepSeek Reasoner 验证（<10% 情况）
  let verifiedResults: import("./deepseek").VerifiedResult[] = [];
  
  if (aiVerificationNeeded) {
    // 检查缓存
    const uncachedQuestions: typeof uncertainQuestions = [];
    
    for (const q of uncertainQuestions) {
      const hash = generateQuestionHash(q.text);
      const cached = await getCachedAnalysisWithFallback(hash);
      
      if (cached) {
        verifiedResults.push({
          number: q.number,
          ...cached,
        });
      } else {
        uncachedQuestions.push(q);
      }
    }
    
    // 调用 AI 验证未缓存的题目
    if (uncachedQuestions.length > 0) {
      const newResults = await verifyUncertainQuestions(
        uncachedQuestions,
        request.examLevel
      );
      
      // 缓存新结果
      for (const r of newResults) {
        const originalQuestion = questions.find(q => q.number === r.number);
        if (originalQuestion) {
          const hash = generateQuestionHash(originalQuestion.content);
          await cacheAnalysisWithFallback(hash, {
            isBeyond: r.isBeyond,
            confidence: r.confidence,
            reason: r.reason,
            matchedLevel: r.gespLevel || 0,
            matchedKeywords: [],
          });
        }
      }
      
      verifiedResults = [...verifiedResults, ...newResults];
    }
  }

  // 6. 合并结果
  const finalBeyondPoints: BeyondKnowledgePoint[] = [];
  
  // 添加规则引擎确定的超纲点
  for (const point of ruleResult.summary.beyondPoints) {
    finalBeyondPoints.push({
      name: point.name,
      gespLevel: point.gespLevel,
      reason: point.reason,
      questionNumbers: point.affectedQuestions,
    });
  }
  
  // 添加 AI 验证的超纲点
  for (const vr of verifiedResults) {
    if (vr.isBeyond && vr.gespLevel) {
      finalBeyondPoints.push({
        name: `题目${vr.number}`,
        gespLevel: vr.gespLevel,
        reason: vr.reason,
        questionNumbers: [vr.number],
      });
    }
  }

  // 7. 生成反馈
  const difficultyScore = ruleResult.summary.difficultyEstimate;
  const { parentFeedback, summary } = await generateFeedback({
    examLevel: request.examLevel,
    studentLevel: request.studentLevel,
    studentLesson: request.studentLesson,
    difficultyScore,
    beyondPoints: finalBeyondPoints,
    teacherName: request.teacherName,
    studentName: request.studentName,
  });

  // 8. 计算置信度
  const confidence = ruleResult.summary.certainRate * 0.99 + 
    (verifiedResults.length > 0 ? 0.85 * (verifiedResults.length / questions.length) : 0);

  const endTime = Date.now();
  console.log(`分析完成，耗时: ${(endTime - startTime) / 1000}s, 题目数: ${questions.length}, 不确定数: ${uncertainQuestions.length}`);

  return {
    difficultyScore,
    isBeyondSyllabus: finalBeyondPoints.length > 0,
    beyondPoints: finalBeyondPoints,
    parentFeedback,
    summary,
    confidence: Math.min(confidence, 0.99),
    teacherName: request.teacherName,
    studentName: request.studentName,
    ruleEngineStats: {
      certainCount: ruleResult.summary.certainCount,
      uncertainCount: ruleResult.summary.uncertainCount,
      certainRate: ruleResult.summary.certainRate,
    },
  };
}

// 导出旧版本兼容性别名
export { analyzeExamV2 as analyzeExam };

// ==================== 健康检查 ====================

export async function checkDeepSeekHealth(): Promise<boolean> {
  try {
    const client = getDeepSeekClient();
    await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 5,
    });
    return true;
  } catch {
    return false;
  }
}
