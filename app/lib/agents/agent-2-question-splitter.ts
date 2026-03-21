// Agent 2: 题目分割 Agent
export interface QuestionBlock {
  number: number;
  rawText: string;
  codeBlocks: string[];
  hasCode: boolean;
}

export function agent2QuestionSplitter(pdfText: string): QuestionBlock[] {
  const questions: QuestionBlock[] = [];
  const lines = pdfText.split('\n');
  
  let currentNumber: number | null = null;
  let currentContent: string[] = [];
  let codeBlocks: string[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // 检测代码块
    if (trimmed.includes('#include') || trimmed.includes('int main') || 
        trimmed.includes('void ') || trimmed.includes('using namespace')) {
      if (currentContent.length > 0 && !inCodeBlock) {
        inCodeBlock = true;
        codeBuffer = [];
      }
    }
    
    if (inCodeBlock) {
      codeBuffer.push(trimmed);
      if (trimmed === '}' || trimmed.includes('return 0;')) {
        codeBlocks.push(codeBuffer.join('\n'));
        codeBuffer = [];
        inCodeBlock = false;
      }
      continue;
    }
    
    // 检测新题目
    const match = trimmed.match(/^(\d+)[\.、．\s]/);
    if (match) {
      const num = parseInt(match[1]);
      if (num <= 50 && currentNumber !== null && currentContent.length > 0) {
        questions.push({
          number: currentNumber,
          rawText: currentContent.join('\n'),
          codeBlocks: [...codeBlocks],
          hasCode: codeBlocks.length > 0,
        });
      }
      currentNumber = num;
      currentContent = [trimmed.replace(/^\d+[\.、．\s]+/, '')];
      codeBlocks = [];
    } else if (currentNumber !== null) {
      currentContent.push(trimmed);
    }
  }
  
  // 保存最后一题
  if (currentNumber !== null && currentContent.length > 0) {
    questions.push({
      number: currentNumber,
      rawText: currentContent.join('\n'),
      codeBlocks: [...codeBlocks],
      hasCode: codeBlocks.length > 0,
    });
  }
  
  return questions;
}
