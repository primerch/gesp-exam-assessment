// GESP 试卷高性能分析引擎
// 纯本地规则引擎，无需 AI 调用，<3秒完成分析

import { extractPdfText } from "./deepseek";
import { extractKeywords, getKeywordLevel } from "@/app/data/keyword-db";
import { examPatterns, analyzeQuestion } from "@/app/data/exam-patterns";

// ==================== 类型定义 ====================

export interface FastAnalysisRequest {
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

export interface FastAnalysisResult {
  difficultyScore: number;
  isBeyondSyllabus: boolean;
  beyondPoints: BeyondKnowledgePoint[];
  parentFeedback: string;
  summary: string;
  confidence: number;
  teacherName: string;
  studentName: string;
  analysisDetails: {
    totalKeywords: number;
    matchedPatterns: string[];
    beyondKeywords: Array<{ keyword: string; level: number }>;
  };
}

// ==================== 高性能分析引擎 ====================

export async function analyzeExamFast(
  request: FastAnalysisRequest
): Promise<FastAnalysisResult> {
  const startTime = Date.now();
  
  // 1. 提取 PDF 文本（带超时控制）
  const pdfText = await Promise.race([
    extractPdfText(request.pdfBuffer),
    new Promise<string>((_, reject) => 
      setTimeout(() => reject(new Error("PDF 文本提取超时（15秒）")), 15000)
    )
  ]);
  
  if (!pdfText || pdfText.trim().length === 0) {
    throw new Error("PDF 文件无法提取文本，可能是扫描件或图片 PDF");
  }
  
  const textLength = pdfText.length;
  console.log(`[分析] PDF 提取完成，文本长度: ${textLength}，耗时: ${Date.now() - startTime}ms`);
  
  // 2. 直接扫描整个文本的关键词（高性能）
  const keywordsStart = Date.now();
  const extractedKeywords = extractKeywords(pdfText);
  const beyondKeywords = extractedKeywords.filter(k => k.level > request.examLevel);
  console.log(`[分析] 关键词扫描完成，找到 ${extractedKeywords.length} 个关键词，超纲 ${beyondKeywords.length} 个，耗时: ${Date.now() - keywordsStart}ms`);
  
  // 3. 分析题目模式（模拟分题目分析，但不真的拆分）
  const patternStart = Date.now();
  const matchedPatterns: Array<{ name: string; level: number; isBeyond: boolean }> = [];
  
  for (const pattern of examPatterns) {
    // 检查文本中是否包含该模式的关键词
    let matchCount = 0;
    for (const keyword of pattern.keywords) {
      if (pdfText.includes(keyword)) {
        matchCount++;
      }
    }
    
    // 如果有匹配，记录该模式
    if (matchCount > 0) {
      const isBeyond = pattern.isBeyond(request.examLevel, []);
      matchedPatterns.push({
        name: pattern.name,
        level: pattern.gespLevel,
        isBeyond: isBeyond && request.examLevel < pattern.gespLevel,
      });
    }
  }
  
  // 去重并按优先级排序
  const uniquePatterns = matchedPatterns
    .filter((p, i, arr) => arr.findIndex(t => t.name === p.name) === i)
    .sort((a, b) => b.level - a.level);
  
  console.log(`[分析] 模式匹配完成，匹配 ${uniquePatterns.length} 个模式，耗时: ${Date.now() - patternStart}ms`);
  
  // 4. 汇总超纲知识点
  const beyondPoints: BeyondKnowledgePoint[] = [];
  
  // 从关键词提取超纲点
  const keywordPointMap = new Map<string, BeyondKnowledgePoint>();
  for (const kw of beyondKeywords) {
    if (!keywordPointMap.has(kw.keyword)) {
      keywordPointMap.set(kw.keyword, {
        name: kw.keyword,
        gespLevel: kw.level,
        reason: `${kw.keyword} 属于 GESP ${kw.level} 级${kw.category ? `（${kw.category}）` : ""}考点`,
        questionNumbers: [],
      });
    }
  }
  
  // 从模式提取超纲点
  for (const pattern of uniquePatterns) {
    if (pattern.isBeyond) {
      const patternInfo = examPatterns.find(p => p.name === pattern.name);
      if (patternInfo && !keywordPointMap.has(patternInfo.name)) {
        keywordPointMap.set(patternInfo.name, {
          name: patternInfo.name,
          gespLevel: patternInfo.gespLevel,
          reason: typeof patternInfo.reason === "function" 
            ? patternInfo.reason([]) 
            : patternInfo.reason,
          questionNumbers: [],
        });
      }
    }
  }
  
  beyondPoints.push(...keywordPointMap.values());
  
  // 5. 计算难度分数
  const difficultyScore = calculateDifficulty(
    request.examLevel,
    extractedKeywords,
    beyondPoints.length
  );
  
  // 6. 生成本地反馈（无需 AI）
  const feedbackStart = Date.now();
  const { parentFeedback, summary } = generateLocalFeedback({
    examLevel: request.examLevel,
    studentLevel: request.studentLevel,
    studentLesson: request.studentLesson,
    difficultyScore,
    beyondPoints,
    teacherName: request.teacherName,
    matchedPatterns: uniquePatterns.map(p => p.name),
  });
  console.log(`[分析] 反馈生成完成，耗时: ${Date.now() - feedbackStart}ms`);
  
  const totalTime = Date.now() - startTime;
  console.log(`[分析] 总耗时: ${totalTime}ms`);
  
  return {
    difficultyScore,
    isBeyondSyllabus: beyondPoints.length > 0,
    beyondPoints: beyondPoints.slice(0, 10), // 最多返回 10 个
    parentFeedback,
    summary,
    confidence: Math.min(0.85 + (extractedKeywords.length > 0 ? 0.1 : 0), 0.95),
    teacherName: request.teacherName,
    studentName: request.studentName,
    analysisDetails: {
      totalKeywords: extractedKeywords.length,
      matchedPatterns: uniquePatterns.map(p => p.name),
      beyondKeywords: beyondKeywords.map(k => ({ keyword: k.keyword, level: k.level })),
    },
  };
}

// ==================== 辅助函数 ====================

function calculateDifficulty(
  examLevel: number,
  keywords: Array<{ keyword: string; level: number }>,
  beyondCount: number
): number {
  let score = 5; // 基础分
  
  // 根据超纲数量增加难度
  if (beyondCount > 0) {
    score += Math.min(beyondCount * 0.8, 3);
  }
  
  // 根据关键词最高级别调整
  const maxKeywordLevel = Math.max(...keywords.map(k => k.level), examLevel);
  if (maxKeywordLevel > examLevel) {
    score += (maxKeywordLevel - examLevel) * 0.5;
  }
  
  // 根据关键词数量调整
  if (keywords.length > 20) {
    score += 0.5;
  }
  
  return Math.min(Math.max(Math.round(score), 1), 10);
}

interface FeedbackParams {
  examLevel: number;
  studentLevel: number;
  studentLesson: number;
  difficultyScore: number;
  beyondPoints: BeyondKnowledgePoint[];
  teacherName: string;
  matchedPatterns: string[];
}

function generateLocalFeedback(params: FeedbackParams): { parentFeedback: string; summary: string } {
  const {
    examLevel,
    studentLevel,
    studentLesson,
    difficultyScore,
    beyondPoints,
    teacherName,
    matchedPatterns,
  } = params;
  
  const teacher = teacherName || "学管老师";
  const hasBeyond = beyondPoints.length > 0;
  
  // 生成反馈内容
  let feedback = `你好，我是${teacher}老师 👋\n\n`;
  
  // 试卷整体评价
  feedback += `刚分析完这份 GESP ${examLevel} 级试卷\n\n`;
  
  // 难度评价
  if (difficultyScore >= 8) {
    feedback += `📊 **整体难度偏高**（${difficultyScore}/10）\n`;
    feedback += `这份试卷比标准${examLevel}级难度要大一些，适合水平较好的学生\n`;
  } else if (difficultyScore >= 6) {
    feedback += `📊 **整体难度适中**（${difficultyScore}/10）\n`;
    feedback += `难度符合 GESP ${examLevel} 级标准\n`;
  } else {
    feedback += `📊 **整体难度偏易**（${difficultyScore}/10）\n`;
    feedback += `适合基础阶段的学生巩固知识\n`;
  }
  
  // 超纲分析
  if (hasBeyond) {
    feedback += `\n⚠️ **发现超纲内容**\n`;
    feedback += `共识别出 ${beyondPoints.length} 个超纲知识点：\n`;
    
    // 按级别分组
    const byLevel: Record<number, string[]> = {};
    for (const point of beyondPoints.slice(0, 5)) {
      if (!byLevel[point.gespLevel]) byLevel[point.gespLevel] = [];
      byLevel[point.gespLevel].push(point.name);
    }
    
    for (const level of Object.keys(byLevel).sort((a, b) => Number(b) - Number(a))) {
      feedback += `• GESP ${level}级：${byLevel[Number(level)].join("、")}\n`;
    }
    
    if (beyondPoints.length > 5) {
      feedback += `• 还有 ${beyondPoints.length - 5} 个其他知识点...\n`;
    }
    
    feedback += `\n💡 **教学建议**\n`;
    const maxBeyondLevel = Math.max(...beyondPoints.map(p => p.gespLevel));
    const gap = maxBeyondLevel - examLevel;
    
    if (gap >= 3) {
      feedback += `这份试卷跨度较大，涉及 GESP ${maxBeyondLevel} 级内容，建议给已经完成 Level ${Math.min(studentLevel + 2, 4)} 学习的学生使用\n`;
    } else if (gap >= 1) {
      feedback += `有少量超纲内容，适合学有余力的学生挑战，普通学生可能需要适当引导\n`;
    } else {
      feedback += `轻微超纲，大部分学生应该能够应对\n`;
    }
  } else {
    feedback += `\n✅ **内容符合大纲**\n`;
    feedback += `试卷所有内容都在 GESP ${examLevel} 级范围内，没有超纲\n`;
    feedback += `\n💡 **教学建议**\n`;
    
    if (examLevel <= studentLevel * 2) {
      feedback += `这份试卷适合当前进度的学生练习\n`;
    } else {
      feedback += `建议学生完成 Level ${Math.ceil(examLevel / 2)} 后再尝试这份试卷\n`;
    }
  }
  
  // 检测到的技术点
  if (matchedPatterns.length > 0) {
    feedback += `\n🔍 **试卷涉及的技术点**\n`;
    const displayPatterns = matchedPatterns.slice(0, 6);
    feedback += displayPatterns.join("、");
    if (matchedPatterns.length > 6) {
      feedback += ` 等${matchedPatterns.length}个技术点`;
    }
    feedback += "\n";
  }
  
  // 结尾
  feedback += `\n有其他想分析的试卷随时发我哈~ 😊`;
  
  // 生成摘要
  let summary = `难度 ${difficultyScore}/10，`;
  if (hasBeyond) {
    const maxLevel = Math.max(...beyondPoints.map(p => p.gespLevel));
    summary += `涉及 GESP ${maxLevel} 级内容，有${beyondPoints.length}个超纲点`;
  } else {
    summary += "内容符合大纲要求";
  }
  
  return { parentFeedback: feedback, summary };
}
