// Master Agent: 10 子代理协调器
// 世界领先的 GESP 试卷分析系统核心

import { agent1PdfExtractor } from "./agent-1-pdf-extractor";
import { agent2QuestionSplitter } from "./agent-2-question-splitter";
import { agent3TypeClassifier } from "./agent-3-type-classifier";
import { agent4KnowledgeExtractor } from "./agent-4-knowledge-extractor";
import { agent5BeyondAnalyzer } from "./agent-5-beyond-analyzer";
import { agent6DifficultyAssessor } from "./agent-6-difficulty-assessor";
import { agent7FeedbackGenerator } from "./agent-7-feedback-generator";
import { agent8MarkdownFormatter } from "./agent-8-markdown-formatter";
import { agent9QualityValidator } from "./agent-9-quality-validator";
import { agent10ResultAggregator } from "./agent-10-result-aggregator";
import type { AggregatedResult, QuestionDetail } from "./agent-10-result-aggregator";

export interface MasterAgentRequest {
  pdfBuffer: Buffer;
  examLevel: number;
  studentLevel: number;
  studentLesson: number;
  teacherName: string;
  studentName: string;
}

export type MasterAgentResult = AggregatedResult;

/**
 * Master Agent: 协调 10 个子代理完成试卷分析
 * 
 * 执行流程：
 * 1. PDF 提取 (Agent 1)
 * 2. 题目分割 (Agent 2)
 * 3. 并行处理每道题目：类型识别 + 知识点提取 + 超纲判定
 * 4. 难度评估 (Agent 6)
 * 5. 教学建议生成 (Agent 7)
 * 6. Markdown 格式化 (Agent 8)
 * 7. 质量验证 (Agent 9)
 * 8. 结果汇总 (Agent 10)
 */
export async function masterAgent(request: MasterAgentRequest): Promise<MasterAgentResult> {
  const startTime = Date.now();
  let deepseekCalls = 0;
  
  try {
    console.log(`[Master] 开始分析试卷: GESP ${request.examLevel}级`);
    
    // === Phase 1: PDF 提取 (Agent 1) ===
    console.log("[Master] Phase 1: PDF 提取...");
    const pdfResult = await agent1PdfExtractor(request.pdfBuffer);
    console.log(`[Master] PDF 提取完成: ${pdfResult.charCount} 字符, ${pdfResult.pageCount} 页`);
    
    // === Phase 2: 题目分割 (Agent 2) ===
    console.log("[Master] Phase 2: 题目分割...");
    const questions = agent2QuestionSplitter(pdfResult.text);
    console.log(`[Master] 题目分割完成: ${questions.length} 道题目`);
    
    if (questions.length === 0) {
      return {
        success: false,
        data: null,
        error: "未能识别到任何题目，PDF 可能是扫描件或图片格式",
        metadata: {
          totalQuestions: 0,
          analyzedQuestions: 0,
          deepseekCalls: 0,
          processingTime: Date.now() - startTime,
        },
      };
    }
    
    // === Phase 3: 并行分析每道题目 (Agents 3-5) ===
    console.log("[Master] Phase 3: 并行分析每道题目...");
    
    // 限制并发数，避免触发 API 限流
    const CONCURRENCY_LIMIT = 3;
    const questionDetails: QuestionDetail[] = [];
    
    for (let i = 0; i < questions.length; i += CONCURRENCY_LIMIT) {
      const batch = questions.slice(i, i + CONCURRENCY_LIMIT);
      
      const batchResults = await Promise.all(
        batch.map(async (q) => {
          try {
            // Agent 3: 类型识别
            const typeResult = agent3TypeClassifier(q.rawText, q.hasCode, q.title);
            
            // Agent 4: 知识点提取 (DeepSeek)
            const knowledgePoints = await agent4KnowledgeExtractor(q.rawText, q.codeBlocks);
            deepseekCalls++;
            
            // Agent 5: 超纲判定 (DeepSeek)
            const beyondAnalysis = await agent5BeyondAnalyzer(knowledgePoints, request.examLevel);
            deepseekCalls++;
            
            return {
              number: q.number,
              type: typeResult.type,
              content: q.rawText.slice(0, 300),
              knowledgePoints,
              isBeyond: beyondAnalysis.isBeyond,
              beyondPoints: beyondAnalysis.beyondPoints.map(bp => ({
                name: bp.name,
                actualLevel: bp.actualLevel,
              })),
            } as QuestionDetail;
          } catch (error) {
            console.error(`[Master] 题目 ${q.number} 分析失败:`, error);
            // 降级：返回基础信息
            return {
              number: q.number,
              type: "unknown",
              content: q.rawText.slice(0, 300),
              knowledgePoints: [],
              isBeyond: false,
              beyondPoints: [],
            } as QuestionDetail;
          }
        })
      );
      
      questionDetails.push(...batchResults);
      console.log(`[Master] 已分析 ${Math.min(i + CONCURRENCY_LIMIT, questions.length)}/${questions.length} 题`);
    }
    
    console.log(`[Master] 题目分析完成，DeepSeek 调用 ${deepseekCalls} 次`);
    
    // === Phase 4: 难度评估 (Agent 6) ===
    console.log("[Master] Phase 4: 难度评估...");
    const difficulty = agent6DifficultyAssessor(request.examLevel, questionDetails);
    console.log(`[Master] 难度评估: ${difficulty.score}/10 (${difficulty.level})`);
    
    // === Phase 5: 教学建议生成 (Agent 7) ===
    console.log("[Master] Phase 5: 教学建议生成...");
    
    // 汇总超纲信息
    const allBeyondPoints = questionDetails.flatMap(q => q.beyondPoints);
    const maxBeyondLevel = allBeyondPoints.length > 0 
      ? Math.max(...allBeyondPoints.map(p => p.actualLevel))
      : request.examLevel;
    
    const byLevel: Record<number, string[]> = {};
    for (const point of allBeyondPoints) {
      if (!byLevel[point.actualLevel]) byLevel[point.actualLevel] = [];
      if (!byLevel[point.actualLevel].includes(point.name)) {
        byLevel[point.actualLevel].push(point.name);
      }
    }
    
    const feedback = await agent7FeedbackGenerator({
      teacherName: request.teacherName,
      examLevel: request.examLevel,
      studentLevel: request.studentLevel,
      studentLesson: request.studentLesson,
      difficulty,
      beyondSummary: {
        totalBeyondPoints: allBeyondPoints.length,
        maxBeyondLevel,
        byLevel,
      },
    });
    deepseekCalls++;
    console.log("[Master] 教学建议生成完成");
    
    // === Phase 6: Markdown 格式化 (Agent 8) ===
    console.log("[Master] Phase 6: Markdown 格式化...");
    const formattedFeedback = agent8MarkdownFormatter(
      feedback,
      {
        examLevel: request.examLevel,
        questionCount: questions.length,
        beyondQuestionCount: questionDetails.filter(q => q.isBeyond).length,
        beyondPoints: questionDetails.flatMap(q => 
          q.beyondPoints.map(bp => ({
            name: bp.name,
            gespLevel: bp.actualLevel,
            questionNumbers: [q.number],
          }))
        ),
      },
      { includeTable: true, includeEmoji: true, includeDifficultyBar: true }
    );
    
    // === Phase 7: 质量验证 (Agent 9) ===
    console.log("[Master] Phase 7: 质量验证...");
    const quality = agent9QualityValidator({
      examLevel: request.examLevel,
      questionCount: questions.length,
      beyondPointsCount: allBeyondPoints.length,
      analysisCoverage: questionDetails.filter(q => q.knowledgePoints.length > 0).length,
      deepseekErrors: questionDetails.filter(q => q.knowledgePoints.length === 0).length,
    });
    console.log(`[Master] 质量评分: ${quality.score}/100, 置信度: ${quality.confidence.toFixed(2)}`);
    
    // === Phase 8: 结果汇总 (Agent 10) ===
    console.log("[Master] Phase 8: 结果汇总...");
    const result = agent10ResultAggregator({
      teacherName: request.teacherName,
      studentName: request.studentName,
      examLevel: request.examLevel,
      questions: questionDetails,
      difficulty,
      feedback: formattedFeedback,
      quality,
      startTime,
      deepseekCalls,
    });
    
    const totalTime = Date.now() - startTime;
    console.log(`[Master] 分析完成！总耗时: ${totalTime}ms`);
    
    return result;
    
  } catch (error) {
    console.error("[Master] 分析失败:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "未知错误",
      metadata: {
        totalQuestions: 0,
        analyzedQuestions: 0,
        deepseekCalls,
        processingTime: Date.now() - startTime,
      },
    };
  }
}

// 导出所有 Agent 供外部使用
export {
  agent1PdfExtractor,
  agent2QuestionSplitter,
  agent3TypeClassifier,
  agent4KnowledgeExtractor,
  agent5BeyondAnalyzer,
  agent6DifficultyAssessor,
  agent7FeedbackGenerator,
  agent8MarkdownFormatter,
  agent9QualityValidator,
  agent10ResultAggregator,
};

// 导出类型
export type { QuestionDetail };
