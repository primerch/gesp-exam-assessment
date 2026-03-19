export interface KnowledgePoint {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface Lesson {
  lesson_num: number;
  filename: string;
  title: string;
  knowledge_points: string[];
}

export interface LevelData {
  level: number;
  total_lessons: number;
  lessons: Lesson[];
}

export interface GespLevel {
  id: number;
  name: string;
  description: string;
  color: string;
}

export interface ProbabilityResult {
  [key: string]: number;
}

export interface MissingKnowledge {
  [key: string]: string[];
}
