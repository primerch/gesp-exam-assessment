// Agent 10: 结果汇总 Agent
import type { KnowledgePoint } from "./agent-4-knowledge-extractor";
import type { BeyondAnalysis } from "./agent-5-beyond-analyzer";
import type { DifficultyAssessment } from "./agent-6-difficulty-assessor";
import type { QualityValidation } from "./agent-9-quality-validator";

export interface QuestionDetail {
  number: number;
  type: string;
  content: string;
  knowledgePoints: KnowledgePoint[];
  isBeyond: boolean;
  beyondPoints: Array<{
    name: string;
    actualLevel: number;
  }>;
}

export interface AggregatedResult {
  success: boolean;
  data: {
    difficultyScore: number;
    isBeyondSyllabus: boolean;
    beyondPoints: Array<{
      name: string;
      gespLevel: number;
      reason: string;
      questionNumbers: number[];
    }>;
    parentFeedback: string;
    summary: string;
    confidence: number;
    teacherName: string;
    studentName: string;
    questions: QuestionDetail[];
    quality: QualityValidation;
  } | null;
  error?: string;
  metadata: {
    totalQuestions: number;
    analyzedQuestions: number;
    deepseekCalls: number;
    processingTime: number;
  };
}

export function agent10ResultAggregator(params: {
  teacherName: string;
  studentName: string;
  examLevel: number;
  questions: QuestionDetail[];
  difficulty: DifficultyAssessment;
  feedback: string;
  quality: QualityValidation;
  startTime: number;
  deepseekCalls: number;
}): AggregatedResult {
  const { teacherName, studentName, examLevel, questions, difficulty, feedback, quality, startTime, deepseekCalls } = params;
  
  // 汇总超纲知识点（按知识点聚合）
  const beyondPointMap = new Map<string, {
    name: string;
    gespLevel: number;
    questionNumbers: number[];
  }>();
  
  for (const q of questions) {
    for (const bp of q.beyondPoints) {
      const existing = beyondPointMap.get(bp.name);
      if (existing) {
        if (!existing.questionNumbers.includes(q.number)) {
          existing.questionNumbers.push(q.number);
        }
      } else {
        beyondPointMap.set(bp.name, {
          name: bp.name,
          gespLevel: bp.actualLevel,
          questionNumbers: [q.number],
        });
      }
    }
  }
  
  const beyondPoints = Array.from(beyondPointMap.values())
    .sort((a, b) => b.gespLevel - a.gespLevel)
    .slice(0, 15)
    .map(bp => ({
      ...bp,
      reason: `${bp.name} 属于 GESP ${bp.gespLevel} 级考点，超出当前试卷级别`,
    }));
  
  // 生成简短摘要
  const hasBeyond = beyondPoints.length > 0;
  let summary = `难度 ${difficulty.score}/10，`;
  if (hasBeyond) {
    const maxLevel = Math.max(...beyondPoints.map(p => p.gespLevel));
    summary += `${beyondPoints.length}个超纲点（最高GESP${maxLevel}级）`;
  } else {
    summary += "内容符合大纲";
  }
  
  const processingTime = Date.now() - startTime;
  
  return {
    success: true,
    data: {
      difficultyScore: difficulty.score,
      isBeyondSyllabus: hasBeyond,
      beyondPoints,
      parentFeedback: feedback,
      summary,
      confidence: quality.confidence,
      teacherName,
      studentName,
      questions: questions.slice(0, 50), // 最多返回50题
      quality,
    },
    metadata: {
      totalQuestions: questions.length,
      analyzedQuestions: questions.filter(q => q.knowledgePoints.length > 0).length,
      deepseekCalls,
      processingTime,
    },
  };
}
