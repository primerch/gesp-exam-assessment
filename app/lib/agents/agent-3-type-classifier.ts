// Agent 3: 题目类型识别 Agent - 修复版

export type QuestionType = "choice" | "fill" | "programming" | "reading" | "theory" | "unknown";

export interface TypeClassification {
  type: QuestionType;
  confidence: number;
  indicators: string[];
}

export function agent3TypeClassifier(
  questionText: string, 
  hasCode: boolean,
  title?: string
): TypeClassification {
  const text = (title + ' ' + questionText).toLowerCase();
  const indicators: string[] = [];
  
  // 1. 编程题特征（最高优先级）
  if (hasCode) {
    indicators.push('包含代码块');
    return { type: 'programming', confidence: 0.95, indicators };
  }
  
  // 检查编程题关键词
  const programmingKeywords = [
    '编程题', '程序设计', '写程序', '完成程序', '补全程序',
    '编写代码', '程序填空', '完善程序',
  ];
  for (const kw of programmingKeywords) {
    if (text.includes(kw)) {
      indicators.push(`关键词：${kw}`);
      return { type: 'programming', confidence: 0.9, indicators };
    }
  }
  
  // 2. 阅读程序题
  const readingKeywords = [
    '阅读程序', '程序阅读', '程序运行', '写出输出', '输出结果',
    '程序功能', '程序作用',
  ];
  for (const kw of readingKeywords) {
    if (text.includes(kw)) {
      indicators.push(`关键词：${kw}`);
      return { type: 'reading', confidence: 0.9, indicators };
    }
  }
  
  // 3. 选择题特征
  // 检查是否有 A/B/C/D 选项
  const hasOptionA = /[\(\s]a[\.、．\s\)]/.test(text) || text.includes('a.');
  const hasOptionB = /[\(\s]b[\.、．\s\)]/.test(text) || text.includes('b.');
  const hasOptionC = /[\(\s]c[\.、．\s\)]/.test(text) || text.includes('c.');
  const hasOptionD = /[\(\s]d[\.、．\s\)]/.test(text) || text.includes('d.');
  
  const optionCount = [hasOptionA, hasOptionB, hasOptionC, hasOptionD].filter(Boolean).length;
  
  if (optionCount >= 2 || text.includes('选择') || text.includes('选项')) {
    indicators.push(`发现 ${optionCount} 个选项标记`);
    return { type: 'choice', confidence: 0.85, indicators };
  }
  
  // 4. 填空题特征
  const fillIndicators = ['___', '＿＿＿', '填空', '填写', '补全', '请填入'];
  for (const indicator of fillIndicators) {
    if (text.includes(indicator)) {
      indicators.push(`填空标记：${indicator}`);
      return { type: 'fill', confidence: 0.8, indicators };
    }
  }
  
  // 检查括号填空
  if (/\(\s*\)/.test(questionText) || /（\s*）/.test(questionText)) {
    indicators.push('有括号填空');
    return { type: 'fill', confidence: 0.7, indicators };
  }
  
  // 5. 理论/判断题
  if (text.includes('判断') || text.includes('正确') || text.includes('错误')) {
    indicators.push('判断题关键词');
    return { type: 'theory', confidence: 0.6, indicators };
  }
  
  // 默认根据内容长度判断
  if (questionText.length > 200) {
    indicators.push('内容较长，可能是编程题');
    return { type: 'programming', confidence: 0.5, indicators };
  }
  
  return { type: 'unknown', confidence: 0.3, indicators: ['无法确定类型'] };
}

// 获取类型的中文标签
export function getQuestionTypeLabel(type: QuestionType): string {
  const labels: Record<QuestionType, string> = {
    choice: '选择题',
    fill: '填空题',
    programming: '编程题',
    reading: '阅读题',
    theory: '判断题',
    unknown: '未知',
  };
  return labels[type] || '未知';
}

// 获取类型的颜色样式
export function getQuestionTypeColor(type: QuestionType): string {
  const colors: Record<QuestionType, string> = {
    choice: 'bg-blue-100 text-blue-700',
    fill: 'bg-amber-100 text-amber-700',
    programming: 'bg-emerald-100 text-emerald-700',
    reading: 'bg-purple-100 text-purple-700',
    theory: 'bg-slate-100 text-slate-700',
    unknown: 'bg-gray-100 text-gray-700',
  };
  return colors[type] || colors.unknown;
}
