// Agent 6: 难度评估 Agent
import type { KnowledgePoint } from "./agent-4-knowledge-extractor";
import type { BeyondAnalysis } from "./agent-5-beyond-analyzer";

export interface DifficultyAssessment {
  score: number; // 1-10
  level: "easy" | "medium" | "hard" | "extreme";
  factors: string[];
  explanation: string;
}

export interface QuestionAnalysis {
  number: number;
  type: string;
  knowledgePoints: KnowledgePoint[];
  isBeyond: boolean;
  beyondPoints: Array<{
    name: string;
    actualLevel: number;
  }>;
}

export function agent6DifficultyAssessor(
  examLevel: number,
  questions: QuestionAnalysis[]
): DifficultyAssessment {
  const factors: string[] = [];
  let score = 5; // 基础分
  
  // 1. 超纲题目比例
  const beyondCount = questions.filter(q => q.isBeyond).length;
  const beyondRatio = questions.length > 0 ? beyondCount / questions.length : 0;
  
  if (beyondRatio > 0.3) {
    score += 2;
    factors.push(`超纲题目比例高 (${(beyondRatio * 100).toFixed(0)}%)`);
  } else if (beyondRatio > 0.1) {
    score += 1;
    factors.push(`部分超纲 (${(beyondRatio * 100).toFixed(0)}%)`);
  }
  
  // 2. 超纲级别跨度
  const allBeyondPoints = questions.flatMap(q => q.beyondPoints);
  if (allBeyondPoints.length > 0) {
    const maxLevel = Math.max(...allBeyondPoints.map(p => p.actualLevel));
    const gap = maxLevel - examLevel;
    
    if (gap >= 4) {
      score += 2.5;
      factors.push(`跨度极大 (到 GESP ${maxLevel} 级)`);
    } else if (gap >= 2) {
      score += 1.5;
      factors.push(`跨度较大 (到 GESP ${maxLevel} 级)`);
    } else if (gap >= 1) {
      score += 0.5;
      factors.push(`轻微超纲`);
    }
  }
  
  // 3. 知识点复杂度
  const avgKnowledgePerQuestion = questions.reduce((sum, q) => 
    sum + q.knowledgePoints.length, 0) / Math.max(questions.length, 1);
  
  if (avgKnowledgePerQuestion > 5) {
    score += 1;
    factors.push(`知识点密集 (平均 ${avgKnowledgePerQuestion.toFixed(1)} 个/题)`);
  }
  
  // 4. 代码复杂度（基于知识点数量估算）
  const hasCodeQuestions = questions.filter(q => q.type === 'programming').length;
  if (hasCodeQuestions > questions.length * 0.5) {
    score += 0.5;
    factors.push(`编程题比例较高`);
  }
  
  // 5. 题目数量（越多越难）
  if (questions.length > 25) {
    score += 0.5;
    factors.push(`题量大 (${questions.length} 题)`);
  }
  
  // 确定等级
  score = Math.min(Math.max(Math.round(score), 1), 10);
  let level: DifficultyAssessment["level"];
  if (score >= 9) level = "extreme";
  else if (score >= 7) level = "hard";
  else if (score >= 4) level = "medium";
  else level = "easy";
  
  // 生成解释
  let explanation = `难度评分 ${score}/10，`;
  if (level === "extreme") explanation += "远超该级别标准，需要高级知识";
  else if (level === "hard") explanation += "难度偏高，适合水平较好的学生";
  else if (level === "medium") explanation += "难度适中，符合该级别要求";
  else explanation += "难度偏易，适合基础巩固";
  
  return { score, level, factors, explanation };
}
