// Agent 3: 题目类型识别 Agent
export type QuestionType = "choice" | "fill" | "programming" | "reading" | "unknown";

export interface TypeClassification {
  type: QuestionType;
  confidence: number;
  indicators: string[];
}

export function agent3TypeClassifier(questionText: string, hasCode: boolean): TypeClassification {
  const text = questionText.toLowerCase();
  const indicators: string[] = [];
  
  // 编程题特征
  if (hasCode || text.includes('main(') || text.includes('#include') || 
      text.includes('程序') || text.includes('补全代码')) {
    indicators.push('包含代码');
    return { type: 'programming', confidence: 0.95, indicators };
  }
  
  // 选择题特征
  const hasOptions = /[\(\s][a-d][\.、．\s]/i.test(text) || 
                     (text.includes('a.') && text.includes('b.') && text.includes('c.'));
  if (hasOptions || text.includes('选择') || text.includes('选项')) {
    indicators.push('有ABCD选项');
    return { type: 'choice', confidence: 0.9, indicators };
  }
  
  // 填空题特征
  if (text.includes('___') || text.includes('填空') || text.includes('填写') ||
      /\(\s*\)/.test(questionText)) {
    indicators.push('有填空标记');
    return { type: 'fill', confidence: 0.85, indicators };
  }
  
  // 阅读题特征
  if (text.includes('阅读程序') || text.includes('程序阅读') || text.includes('写出输出')) {
    indicators.push('程序阅读');
    return { type: 'reading', confidence: 0.8, indicators };
  }
  
  return { type: 'unknown', confidence: 0.5, indicators: ['无法确定'] };
}
