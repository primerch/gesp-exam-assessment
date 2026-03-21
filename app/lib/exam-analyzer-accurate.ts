// GESP 试卷高精度分析引擎
// 结合题目提取 + 规则引擎 + 智能上下文分析

import { extractPdfText } from "./deepseek";
import { extractKeywords, getKeywordLevel } from "@/app/data/keyword-db";
import { examPatterns, analyzeQuestion } from "@/app/data/exam-patterns";

// ==================== 类型定义 ====================

export interface AccurateAnalysisRequest {
  pdfBuffer: Buffer;
  examLevel: number;
  studentLevel: number;
  studentLesson: number;
  teacherName: string;
  studentName: string;
}

export interface BeyondKnowledgePoint {
  name: string;
  gespLevel: number;
  reason: string;
  questionNumbers: number[];
}

export interface AccurateAnalysisResult {
  difficultyScore: number;
  isBeyondSyllabus: boolean;
  beyondPoints: BeyondKnowledgePoint[];
  parentFeedback: string;
  summary: string;
  confidence: number;
  teacherName: string;
  studentName: string;
  questions: Array<{
    number: number;
    type: string;
    content: string;
    isBeyond: boolean;
    matchedKeywords: string[];
  }>;
}

// ==================== 智能题目提取 ====================

interface ExtractedQuestion {
  number: number;
  type: "choice" | "fill" | "programming" | "unknown";
  content: string;
  codeBlocks: string[];
}

function extractQuestionsIntelligently(pdfText: string): ExtractedQuestion[] {
  const questions: ExtractedQuestion[] = [];
  const lines = pdfText.split('\n');
  
  let currentQuestion: Partial<ExtractedQuestion> | null = null;
  let currentContent: string[] = [];
  let codeBuffer: string[] = [];
  let inCodeBlock = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // 检测代码块开始/结束
    if (line.includes('#include') || line.includes('int main') || line.includes('void ')) {
      inCodeBlock = true;
    }
    if (inCodeBlock && (line === '}' || line === '')) {
      if (codeBuffer.length > 0) {
        codeBuffer.push(line);
        continue;
      }
    }
    
    if (inCodeBlock) {
      codeBuffer.push(line);
      // 检测代码块结束
      if (line.includes('}') && !line.includes('{')) {
        inCodeBlock = false;
      }
      continue;
    }
    
    // 匹配题目编号：1. 1、 第1题 等
    const questionMatch = line.match(/^(\d+)[\.、\s]/);
    const isNewQuestion = questionMatch && parseInt(questionMatch[1]) <= 30;
    
    if (isNewQuestion && currentContent.length > 0) {
      // 保存上一个题目
      if (currentQuestion && currentQuestion.number) {
        questions.push({
          number: currentQuestion.number,
          type: detectQuestionType(currentContent.join('\n'), codeBuffer),
          content: currentContent.join('\n'),
          codeBlocks: [...codeBuffer],
        });
      }
      
      // 开始新题目
      currentQuestion = { number: parseInt(questionMatch[1]) };
      currentContent = [line.replace(/^\d+[\.、\s]+/, '')];
      codeBuffer = [];
    } else if (currentQuestion) {
      currentContent.push(line);
    }
  }
  
  // 保存最后一个题目
  if (currentQuestion && currentQuestion.number && currentContent.length > 0) {
    questions.push({
      number: currentQuestion.number,
      type: detectQuestionType(currentContent.join('\n'), codeBuffer),
      content: currentContent.join('\n'),
      codeBlocks: [...codeBuffer],
    });
  }
  
  return questions;
}

function detectQuestionType(content: string, codeBlocks: string[]): ExtractedQuestion["type"] {
  const fullText = content + ' ' + codeBlocks.join(' ');
  
  // 编程题特征
  if (codeBlocks.length > 0 || 
      fullText.includes('main(') || 
      fullText.includes('#include') ||
      fullText.includes('程序')) {
    return 'programming';
  }
  
  // 选择题特征
  if (/[A-D][\.、\s]/.test(fullText) || 
      fullText.includes('选项') ||
      (fullText.includes('A') && fullText.includes('B') && fullText.includes('C'))) {
    return 'choice';
  }
  
  // 填空题特征
  if (fullText.includes('___') || 
      fullText.includes('填空') ||
      /\(\s*\)/.test(fullText)) {
    return 'fill';
  }
  
  return 'unknown';
}

// ==================== 精确关键词匹配 ====================

// 上下文排除词 - 这些词出现时，关键词可能是误报
const contextExclusions: Record<string, string[]> = {
  "图": ["图片", "图形", "图示", "图表", "如图", "见图", "左图", "右图", "下图", "上图", "流程图"],
  "阶乘": ["举例", "例如", "比如", "假设", "如果"],
  "指针": ["鼠标指针", "光标", "箭头"],
  "树": ["二叉树"], // 如果只有"树"而没有其他图论词汇，可能是误报
};

// 严格模式关键词 - 必须出现在特定上下文中
const strictKeywords: Record<string, RegExp[]> = {
  "图": [
    /图[论形]/,
    /[有无]向图/,
    /邻接[矩阵表]/,
    /顶[点角]/,
    /边[权值]/,
    /graph/i,
    /最短路径/,
    /DFS|BFS/,
  ],
  "阶乘": [
    /\d+[!！]/,
    /factorial/i,
    /阶乘[运算计算]/,
    /排列组合/,
    /组合[数数学]/,
  ],
  "树": [
    /二叉树/,
    /[完满]二叉树/,
    /哈夫曼树/,
    /tree/i,
    /节点/,
    /父子节点/,
  ],
  "链表": [
    /链[表头尾]/,
    /linked list/i,
    /next\s*[=指针]/,
  ],
};

function analyzeQuestionWithContext(
  question: ExtractedQuestion,
  examLevel: number
): {
  isBeyond: boolean;
  matchedKeywords: Array<{ keyword: string; level: number; isCertain: boolean }>;
  beyondLevel: number;
} {
  const text = question.content + ' ' + question.codeBlocks.join(' ');
  const matchedKeywords: Array<{ keyword: string; level: number; isCertain: boolean }> = [];
  
  // 提取所有关键词
  const extracted = extractKeywords(text);
  
  for (const kw of extracted) {
    // 如果关键词级别不高于试卷级别，不是超纲
    if (kw.level <= examLevel) continue;
    
    // 检查是否需要严格匹配
    const strictPatterns = strictKeywords[kw.keyword];
    if (strictPatterns) {
      // 需要匹配严格模式
      let matchedStrict = false;
      for (const pattern of strictPatterns) {
        if (pattern.test(text)) {
          matchedStrict = true;
          break;
        }
      }
      if (!matchedStrict) {
        continue; // 严格模式未匹配，跳过
      }
    }
    
    // 检查上下文排除
    const exclusions = contextExclusions[kw.keyword];
    if (exclusions) {
      // 如果只匹配到排除词上下文，可能是误报
      let onlyExclusion = true;
      for (const exclusion of exclusions) {
        if (text.includes(exclusion)) {
          // 发现排除词，需要进一步确认是否有真正的技术含义
          const techContext = checkTechnicalContext(text, kw.keyword);
          if (techContext) {
            onlyExclusion = false;
            break;
          }
        }
      }
      if (onlyExclusion && !strictPatterns) {
        continue; // 只有排除词上下文，没有严格模式，跳过
      }
    }
    
    matchedKeywords.push({
      keyword: kw.keyword,
      level: kw.level,
      isCertain: kw.level > examLevel + 1, // 高两级更确定
    });
  }
  
  // 判断是否超纲
  const beyondKeywords = matchedKeywords.filter(k => k.level > examLevel);
  const isBeyond = beyondKeywords.length > 0;
  const maxBeyondLevel = beyondKeywords.length > 0 
    ? Math.max(...beyondKeywords.map(k => k.level)) 
    : examLevel;
  
  return { isBeyond, matchedKeywords, beyondLevel: maxBeyondLevel };
}

// 检查技术上下文
function checkTechnicalContext(text: string, keyword: string): boolean {
  const techIndicators: Record<string, string[]> = {
    "图": ["节点", "边", "顶点", "路径", "遍历", "邻接", "连通", "度"],
    "阶乘": ["排列", "组合", "计算", "结果", "值"],
  };
  
  const indicators = techIndicators[keyword];
  if (!indicators) return false;
  
  return indicators.some(ind => text.includes(ind));
}

// ==================== 主要分析函数 ====================

export async function analyzeExamAccurate(
  request: AccurateAnalysisRequest
): Promise<AccurateAnalysisResult> {
  const startTime = Date.now();
  
  // 1. 提取 PDF 文本
  const pdfText = await Promise.race([
    extractPdfText(request.pdfBuffer),
    new Promise<string>((_, reject) => 
      setTimeout(() => reject(new Error("PDF 文本提取超时（15秒）")), 15000)
    )
  ]);
  
  if (!pdfText || pdfText.trim().length === 0) {
    throw new Error("PDF 文件无法提取文本，可能是扫描件或图片 PDF");
  }
  
  console.log(`[分析] PDF 提取完成，文本长度: ${pdfText.length}`);
  
  // 2. 智能提取题目
  const questions = extractQuestionsIntelligently(pdfText);
  console.log(`[分析] 提取到 ${questions.length} 道题目`);
  
  // 3. 逐题分析（带上下文）
  const analyzedQuestions = questions.map(q => {
    const analysis = analyzeQuestionWithContext(q, request.examLevel);
    return {
      number: q.number,
      type: q.type,
      content: q.content.slice(0, 200), // 截断用于展示
      isBeyond: analysis.isBeyond,
      matchedKeywords: analysis.matchedKeywords.map(k => k.keyword),
      beyondLevel: analysis.beyondLevel,
    };
  });
  
  // 4. 汇总超纲知识点
  const beyondPointMap = new Map<string, BeyondKnowledgePoint>();
  
  for (const q of analyzedQuestions) {
    if (!q.isBeyond) continue;
    
    for (const kw of q.matchedKeywords) {
      const level = getKeywordLevel(kw);
      if (!level || level <= request.examLevel) continue;
      
      const existing = beyondPointMap.get(kw);
      if (existing) {
        if (!existing.questionNumbers.includes(q.number)) {
          existing.questionNumbers.push(q.number);
        }
      } else {
        beyondPointMap.set(kw, {
          name: kw,
          gespLevel: level,
          reason: `${kw} 属于 GESP ${level} 级考点`,
          questionNumbers: [q.number],
        });
      }
    }
  }
  
  const beyondPoints = Array.from(beyondPointMap.values())
    .sort((a, b) => b.gespLevel - a.gespLevel);
  
  console.log(`[分析] 发现 ${beyondPoints.length} 个超纲知识点`);
  
  // 5. 计算难度
  const beyondCount = analyzedQuestions.filter(q => q.isBeyond).length;
  const difficultyScore = calculateAccurateDifficulty(
    request.examLevel,
    analyzedQuestions.length,
    beyondCount,
    beyondPoints
  );
  
  // 6. 生成本地反馈
  const { parentFeedback, summary } = generateAccurateFeedback({
    examLevel: request.examLevel,
    studentLevel: request.studentLevel,
    studentLesson: request.studentLesson,
    difficultyScore,
    beyondPoints,
    teacherName: request.teacherName,
    totalQuestions: analyzedQuestions.length,
    beyondQuestionCount: beyondCount,
  });
  
  console.log(`[分析] 总耗时: ${Date.now() - startTime}ms`);
  
  return {
    difficultyScore,
    isBeyondSyllabus: beyondPoints.length > 0,
    beyondPoints: beyondPoints.slice(0, 8),
    parentFeedback,
    summary,
    confidence: Math.min(0.8 + (analyzedQuestions.length > 0 ? 0.15 : 0), 0.95),
    teacherName: request.teacherName,
    studentName: request.studentName,
    questions: analyzedQuestions.map(q => ({
      number: q.number,
      type: q.type,
      content: q.content,
      isBeyond: q.isBeyond,
      matchedKeywords: q.matchedKeywords,
    })),
  };
}

// ==================== 辅助函数 ====================

function calculateAccurateDifficulty(
  examLevel: number,
  totalQuestions: number,
  beyondCount: number,
  beyondPoints: BeyondKnowledgePoint[]
): number {
  let score = 5;
  
  // 超纲题目比例
  if (totalQuestions > 0) {
    const beyondRatio = beyondCount / totalQuestions;
    score += beyondRatio * 4;
  }
  
  // 超纲级别跨度
  if (beyondPoints.length > 0) {
    const maxLevel = Math.max(...beyondPoints.map(p => p.gespLevel));
    const gap = maxLevel - examLevel;
    score += Math.min(gap * 0.8, 2);
  }
  
  // 超纲点数量
  score += Math.min(beyondPoints.length * 0.2, 1);
  
  return Math.min(Math.max(Math.round(score), 1), 10);
}

interface AccurateFeedbackParams {
  examLevel: number;
  studentLevel: number;
  studentLesson: number;
  difficultyScore: number;
  beyondPoints: BeyondKnowledgePoint[];
  teacherName: string;
  totalQuestions: number;
  beyondQuestionCount: number;
}

function generateAccurateFeedback(params: AccurateFeedbackParams): { parentFeedback: string; summary: string } {
  const {
    examLevel,
    studentLevel,
    studentLesson,
    difficultyScore,
    beyondPoints,
    teacherName,
    totalQuestions,
    beyondQuestionCount,
  } = params;
  
  const teacher = teacherName || "学管老师";
  const hasBeyond = beyondPoints.length > 0;
  const beyondRatio = totalQuestions > 0 ? (beyondQuestionCount / totalQuestions * 100).toFixed(0) : 0;
  
  let feedback = `你好，我是${teacher}老师 👋\n\n`;
  feedback += `刚分析完这份 GESP ${examLevel} 级试卷\n\n`;
  
  // 基本信息
  if (totalQuestions > 0) {
    feedback += `📋 共分析 ${totalQuestions} 道题目`;
    if (beyondQuestionCount > 0) {
      feedback += `，其中 ${beyondQuestionCount} 道涉及超纲内容（${beyondRatio}%）\n`;
    } else {
      feedback += "\n";
    }
  }
  
  feedback += "\n";
  
  // 难度评价
  if (difficultyScore >= 8) {
    feedback += `📊 **难度偏高**（${difficultyScore}/10）\n`;
    feedback += `比标准${examLevel}级难度大`;
  } else if (difficultyScore >= 6) {
    feedback += `📊 **难度适中**（${difficultyScore}/10）\n`;
    feedback += `符合 GESP ${examLevel} 级标准`;
  } else {
    feedback += `📊 **难度偏易**（${difficultyScore}/10）\n`;
    feedback += `适合基础巩固`;
  }
  
  // 超纲分析
  if (hasBeyond) {
    feedback += `\n\n⚠️ **超纲内容分析**\n`;
    feedback += `识别出 ${beyondPoints.length} 个超纲知识点：\n`;
    
    // 按级别分组
    const byLevel: Record<number, string[]> = {};
    for (const point of beyondPoints.slice(0, 6)) {
      if (!byLevel[point.gespLevel]) byLevel[point.gespLevel] = [];
      byLevel[point.gespLevel].push(point.name);
    }
    
    for (const level of Object.keys(byLevel).sort((a, b) => Number(b) - Number(a))) {
      const items = byLevel[Number(level)];
      feedback += `• GESP ${level}级：${items.join("、")}\n`;
    }
    
    if (beyondPoints.length > 6) {
      feedback += `• 还有 ${beyondPoints.length - 6} 个其他知识点...\n`;
    }
    
    // 建议
    feedback += `\n💡 **使用建议**\n`;
    const maxBeyondLevel = Math.max(...beyondPoints.map(p => p.gespLevel));
    const gap = maxBeyondLevel - examLevel;
    
    if (gap >= 3) {
      feedback += `⚠️ 试卷跨度很大（到 GESP ${maxBeyondLevel} 级），建议仅给已完成 Level 4 的优等生挑战`;
    } else if (gap >= 2) {
      feedback += `适合已完成 Level ${Math.min(studentLevel + 1, 4)} 的学生，需提前讲解超纲知识点`;
    } else {
      feedback += `轻微超纲，可作为拓展练习，适当引导即可`;
    }
  } else {
    feedback += `\n\n✅ **内容分析**\n`;
    feedback += `试卷内容符合 GESP ${examLevel} 级大纲要求，无超纲题目\n`;
    feedback += `\n💡 **使用建议**\n`;
    
    if (examLevel <= studentLevel * 2) {
      feedback += `适合当前进度的学生练习`;
    } else {
      feedback += `建议学生完成 Level ${Math.ceil(examLevel / 2)} 后再使用`;
    }
  }
  
  feedback += `\n\n有其他试卷需要分析随时发我~ 😊`;
  
  // 摘要
  let summary = `难度 ${difficultyScore}/10，`;
  if (hasBeyond) {
    const maxLevel = Math.max(...beyondPoints.map(p => p.gespLevel));
    summary += `${beyondQuestionCount}/${totalQuestions}题超纲（最高到GESP${maxLevel}级）`;
  } else {
    summary += "内容符合大纲";
  }
  
  return { parentFeedback: feedback, summary };
}
