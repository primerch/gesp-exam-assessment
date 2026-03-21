// 试卷分析结果类型定义

export interface QuestionDetail {
  number: number;
  type: string;
  content: string;
  knowledgePoints: Array<{
    name: string;
    category: string;
    estimatedLevel: number;
    confidence: number;
  }>;
  isBeyond: boolean;
  beyondPoints: Array<{
    name: string;
    actualLevel: number;
  }>;
}

export interface BeyondPoint {
  name: string;
  gespLevel: number;
  reason: string;
  questionNumbers: number[];
}

export interface QualityInfo {
  score: number;
  isReliable: boolean;
  issues: Array<{
    type: string;
    message: string;
  }>;
}

export interface AnalysisResult {
  difficultyScore: number;
  isBeyondSyllabus: boolean;
  beyondPoints: BeyondPoint[];
  parentFeedback: string;
  summary: string;
  confidence: number;
  teacherName: string;
  studentName: string;
  questions: QuestionDetail[];
  quality: QualityInfo;
}
