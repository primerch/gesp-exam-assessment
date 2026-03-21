// Agent 9: 质量验证 Agent
export interface QualityValidation {
  score: number; // 0-100
  issues: Array<{
    type: "error" | "warning" | "info";
    message: string;
    suggestion: string;
  }>;
  isReliable: boolean;
  confidence: number;
}

export interface ValidationInput {
  examLevel: number;
  questionCount: number;
  beyondPointsCount: number;
  analysisCoverage: number; // 分析了多少道题
  deepseekErrors: number;
}

export function agent9QualityValidator(input: ValidationInput): QualityValidation {
  const issues: QualityValidation["issues"] = [];
  let score = 100;
  
  // 检查 1: 题目覆盖率
  if (input.analysisCoverage < input.questionCount * 0.8) {
    const missing = input.questionCount - input.analysisCoverage;
    issues.push({
      type: "warning",
      message: `只分析了 ${input.analysisCoverage}/${input.questionCount} 道题目`,
      suggestion: "检查 PDF 解析是否正确，题目编号是否被识别",
    });
    score -= 15;
  }
  
  // 检查 2: DeepSeek 错误率
  if (input.deepseekErrors > 0) {
    issues.push({
      type: "warning",
      message: `${input.deepseekErrors} 道题目使用降级分析`,
      suggestion: "可能是 API 超时或返回格式错误",
    });
    score -= input.deepseekErrors * 5;
  }
  
  // 检查 3: 超纲点数量合理性
  if (input.beyondPointsCount > 20) {
    issues.push({
      type: "info",
      message: `发现 ${input.beyondPointsCount} 个超纲知识点，数量较多`,
      suggestion: "建议人工复核，可能存在误报",
    });
    score -= 5;
  }
  
  // 检查 4: 试卷级别合理性
  if (input.questionCount < 5) {
    issues.push({
      type: "error",
      message: `只识别到 ${input.questionCount} 道题目，数量过少`,
      suggestion: "PDF 可能是扫描件或图片格式，无法提取文本",
    });
    score -= 30;
  }
  
  // 计算置信度
  const confidence = Math.max(0.5, score / 100);
  const isReliable = score >= 70;
  
  return {
    score: Math.max(0, score),
    issues,
    isReliable,
    confidence,
  };
}
