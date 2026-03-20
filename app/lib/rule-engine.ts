// GESP 试卷分析规则引擎
// 结合关键词库和模式匹配，提供准确的超纲判断

import { 
  analyzeExam as patternAnalyzeExam, 
  analyzeQuestion as patternAnalyzeQuestion,
  type ExamAnalysis,
  type QuestionAnalysis 
} from "@/app/data/exam-patterns";
import { extractKeywords, getKeywordLevel } from "@/app/data/keyword-db";

// 分析请求
export interface RuleEngineRequest {
  questions: Array<{
    number: number;
    text: string;
    type?: "choice" | "fill" | "programming" | "unknown";
  }>;
  examLevel: number;
}

// 分析结果
export interface RuleEngineResult {
  questions: Array<{
    number: number;
    text: string;
    analysis: QuestionAnalysis & {
      extractedKeywords: Array<{ keyword: string; level: number; category: string }>;
    };
  }>;
  summary: {
    totalQuestions: number;
    beyondCount: number;
    certainCount: number;
    uncertainCount: number;
    certainRate: number;
    needsAIVerification: boolean;
    difficultyEstimate: number; // 预估难度 1-10
    beyondPoints: Array<{
      name: string;
      gespLevel: number;
      reason: string;
      affectedQuestions: number[];
    }>;
  };
}

// 规则引擎类
export class RuleEngine {
  private examLevel: number;
  
  constructor(examLevel: number) {
    this.examLevel = examLevel;
  }
  
  // 分析整份试卷
  analyze(request: RuleEngineRequest): RuleEngineResult {
    const { questions, examLevel } = request;
    this.examLevel = examLevel;
    
    // 使用模式匹配分析
    const patternResult = patternAnalyzeExam(
      questions.map(q => ({ number: q.number, text: q.text })),
      examLevel
    );
    
    // 增强分析结果
    const enhancedQuestions = patternResult.questions.map(q => {
      // 提取关键词用于展示
      const extractedKeywords = extractKeywords(q.questionText);
      
      return {
        number: q.questionNumber,
        text: q.questionText,
        analysis: {
          ...q.analysis,
          extractedKeywords,
        },
      };
    });
    
    // 计算预估难度
    const difficultyEstimate = this.estimateDifficulty(enhancedQuestions);
    
    // 汇总超纲知识点（带题目关联）
    const beyondPoints = this.aggregateBeyondPoints(enhancedQuestions);
    
    return {
      questions: enhancedQuestions,
      summary: {
        totalQuestions: patternResult.summary.totalQuestions,
        beyondCount: patternResult.summary.beyondCount,
        certainCount: patternResult.summary.certainCount,
        uncertainCount: patternResult.summary.uncertainCount,
        certainRate: patternResult.summary.certainCount / patternResult.summary.totalQuestions,
        needsAIVerification: patternResult.summary.uncertainCount > 0,
        difficultyEstimate,
        beyondPoints,
      },
    };
  }
  
  // 分析单个题目
  analyzeSingle(questionText: string): QuestionAnalysis & {
    extractedKeywords: Array<{ keyword: string; level: number; category: string }>;
  } {
    const analysis = patternAnalyzeQuestion(questionText, this.examLevel);
    const extractedKeywords = extractKeywords(questionText);
    
    return {
      ...analysis,
      extractedKeywords,
    };
  }
  
  // 预估试卷难度
  private estimateDifficulty(
    questions: RuleEngineResult["questions"]
  ): number {
    let totalScore = 0;
    
    for (const q of questions) {
      let questionScore = 0;
      
      // 基于匹配的关键词级别计算
      for (const kw of q.analysis.extractedKeywords) {
        if (kw.level > this.examLevel) {
          // 超纲关键词增加难度
          questionScore += (kw.level - this.examLevel) * 2;
        } else if (kw.level === this.examLevel) {
          // 同级关键词适中
          questionScore += 1;
        }
      }
      
      // 基于置信度调整
      questionScore *= (0.5 + q.analysis.confidence);
      
      totalScore += questionScore;
    }
    
    // 归一化到 1-10
    const avgScore = totalScore / questions.length;
    const difficulty = Math.min(Math.max(avgScore + 3, 1), 10);
    
    return Math.round(difficulty);
  }
  
  // 汇总超纲知识点
  private aggregateBeyondPoints(
    questions: RuleEngineResult["questions"]
  ): RuleEngineResult["summary"]["beyondPoints"] {
    const pointMap = new Map<string, {
      name: string;
      gespLevel: number;
      reason: string;
      affectedQuestions: number[];
    }>();
    
    for (const q of questions) {
      if (!q.analysis.isBeyond) continue;
      
      const key = q.analysis.matchedPattern || q.analysis.reason;
      
      if (pointMap.has(key)) {
        const existing = pointMap.get(key)!;
        if (!existing.affectedQuestions.includes(q.number)) {
          existing.affectedQuestions.push(q.number);
        }
      } else {
        pointMap.set(key, {
          name: q.analysis.matchedPattern || "未知知识点",
          gespLevel: q.analysis.matchedLevel,
          reason: q.analysis.reason,
          affectedQuestions: [q.number],
        });
      }
    }
    
    return Array.from(pointMap.values());
  }
  
  // 获取不确定的题目（需要 AI 验证）
  getUncertainQuestions(
    result: RuleEngineResult
  ): Array<{ number: number; text: string; reason: string }> {
    return result.questions
      .filter(q => q.analysis.needsAI)
      .map(q => ({
        number: q.number,
        text: q.text,
        reason: q.analysis.reason,
      }));
  }
  
  // 生成解释性说明
  generateExplanation(result: RuleEngineResult): string {
    const lines: string[] = [];
    
    lines.push("## 分析依据");
    lines.push("");
    
    // 规则引擎覆盖情况
    lines.push(`- 规则引擎确定: ${result.summary.certainCount}/${result.summary.totalQuestions} 题 (${(result.summary.certainRate * 100).toFixed(0)}%)`);
    lines.push(`- 需 AI 验证: ${result.summary.uncertainCount} 题`);
    lines.push("");
    
    // 超纲知识点详情
    if (result.summary.beyondPoints.length > 0) {
      lines.push("### 超纲知识点");
      lines.push("");
      for (const point of result.summary.beyondPoints) {
        lines.push(`**${point.name}** (GESP ${point.gespLevel}级)`);
        lines.push(`- 涉及题目: 第 ${point.affectedQuestions.join(", ")} 题`);
        lines.push(`- 超纲原因: ${point.reason}`);
        lines.push("");
      }
    }
    
    // 关键词提取示例（前3题）
    lines.push("### 关键词提取示例");
    lines.push("");
    for (const q of result.questions.slice(0, 3)) {
      if (q.analysis.extractedKeywords.length > 0) {
        lines.push(`第 ${q.number} 题: ${q.analysis.extractedKeywords.map(k => k.keyword).join(", ")}`);
      }
    }
    
    return lines.join("\n");
  }
}

// 便捷函数：快速分析试卷
export function analyzeWithRules(
  questions: RuleEngineRequest["questions"],
  examLevel: number
): RuleEngineResult {
  const engine = new RuleEngine(examLevel);
  return engine.analyze({ questions, examLevel });
}

// 便捷函数：快速分析单个题目
export function analyzeQuestionWithRules(
  questionText: string,
  examLevel: number
): ReturnType<RuleEngine["analyzeSingle"]> {
  const engine = new RuleEngine(examLevel);
  return engine.analyzeSingle(questionText);
}

// 测试用例验证
export function validateWithTestCases(): {
  total: number;
  passed: number;
  failed: number;
  details: Array<{
    question: string;
    examLevel: number;
    expectedBeyond: boolean;
    actualBeyond: boolean;
    passed: boolean;
  }>;
} {
  const testCases = [
    // 三进制转换案例（关键测试）
    {
      question: "将三进制数 102 转换为十进制",
      examLevel: 3,
      expectedBeyond: false, // 三进制属于进制转换变体，不超纲
    },
    {
      question: "将二进制数 1010 转换为十进制",
      examLevel: 3,
      expectedBeyond: false,
    },
    {
      question: "计算 5 的二进制表示",
      examLevel: 2,
      expectedBeyond: true, // 二进制在 2 级超纲
    },
    // 位运算
    {
      question: "计算 5 & 3 的结果",
      examLevel: 3,
      expectedBeyond: false,
    },
    {
      question: "使用位运算优化程序",
      examLevel: 2,
      expectedBeyond: true,
    },
    // 数组
    {
      question: "定义一个包含5个元素的数组",
      examLevel: 3,
      expectedBeyond: false,
    },
    {
      question: "使用数组存储数据",
      examLevel: 2,
      expectedBeyond: true,
    },
    // 指针
    {
      question: "使用指针交换两个变量的值",
      examLevel: 4,
      expectedBeyond: false,
    },
    {
      question: "指针的概念是什么",
      examLevel: 3,
      expectedBeyond: true,
    },
    // 链表
    {
      question: "实现链表插入操作",
      examLevel: 5,
      expectedBeyond: false,
    },
    {
      question: "链表的遍历方法",
      examLevel: 4,
      expectedBeyond: true,
    },
    // 排序
    {
      question: "使用冒泡排序对数组排序",
      examLevel: 4,
      expectedBeyond: false,
    },
    {
      question: "快速排序的时间复杂度",
      examLevel: 4,
      expectedBeyond: true, // 快速排序属于 5 级
    },
    // 动态规划
    {
      question: "使用动态规划解决背包问题",
      examLevel: 6,
      expectedBeyond: false,
    },
    {
      question: "DP的状态转移方程",
      examLevel: 5,
      expectedBeyond: true,
    },
    // 图论
    {
      question: "最短路径算法",
      examLevel: 8,
      expectedBeyond: false,
    },
    {
      question: "Dijkstra算法的实现",
      examLevel: 7,
      expectedBeyond: true,
    },
  ];
  
  const results = testCases.map(tc => {
    const analysis = analyzeQuestionWithRules(tc.question, tc.examLevel);
    const passed = analysis.isBeyond === tc.expectedBeyond;
    
    return {
      question: tc.question,
      examLevel: tc.examLevel,
      expectedBeyond: tc.expectedBeyond,
      actualBeyond: analysis.isBeyond,
      passed,
    };
  });
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  return {
    total: testCases.length,
    passed,
    failed,
    details: results,
  };
}
