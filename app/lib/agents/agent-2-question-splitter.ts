// Agent 2: 题目分割 Agent - 修复版
// 使用更 robust 的算法识别题目边界

export interface QuestionBlock {
  number: number;
  title?: string;
  rawText: string;
  codeBlocks: string[];
  hasCode: boolean;
}

export function agent2QuestionSplitter(pdfText: string): QuestionBlock[] {
  const questions: QuestionBlock[] = [];
  const lines = pdfText.split('\n').map(l => l.trim()).filter(l => l);
  
  // 清理 PDF 提取的乱码字符（如每个字之间的空格）
  const cleanedLines = lines.map(line => {
    // 修复 "编 程 题" 这样的带空格字符
    return line.replace(/(\S)\s+(\S)/g, (match, p1, p2) => {
      // 如果两个字符都是中文字符，去掉空格
      if (/[\u4e00-\u9fa5]/.test(p1) && /[\u4e00-\u9fa5]/.test(p2)) {
        return p1 + p2;
      }
      return match;
    });
  });
  
  // 第一步：识别大题结构（一、二、三）和小题结构（1. 2. 3.）
  const sections: Array<{
    type: 'big' | 'small';
    number: string;
    title?: string;
    startIndex: number;
    endIndex: number;
  }> = [];
  
  for (let i = 0; i < cleanedLines.length; i++) {
    const line = cleanedLines[i];
    
    // 匹配大题：[一、二、三...] 或 [（一）（二）]
    const bigMatch = line.match(/^([一二三四五六七八九十][、．.])\s*(.+)?$/);
    if (bigMatch) {
      sections.push({
        type: 'big',
        number: bigMatch[1],
        title: bigMatch[2] || '',
        startIndex: i,
        endIndex: -1,
      });
      continue;
    }
    
    // 匹配小题：1. 2. 3. 或 1、2、3、
    const smallMatch = line.match(/^(\d+)[\.、．\s]/);
    if (smallMatch) {
      // 更新上一个 section 的 endIndex
      if (sections.length > 0 && sections[sections.length - 1].endIndex === -1) {
        sections[sections.length - 1].endIndex = i;
      }
      
      sections.push({
        type: 'small',
        number: smallMatch[1],
        title: '',
        startIndex: i,
        endIndex: -1,
      });
    }
  }
  
  // 更新最后一个 section 的 endIndex
  if (sections.length > 0) {
    sections[sections.length - 1].endIndex = cleanedLines.length;
  }
  
  // 第二步：提取每个小题的完整内容
  const smallSections = sections.filter(s => s.type === 'small');
  
  for (let i = 0; i < smallSections.length; i++) {
    const section = smallSections[i];
    const nextStart = i < smallSections.length - 1 
      ? smallSections[i + 1].startIndex 
      : cleanedLines.length;
    
    const contentLines = cleanedLines.slice(section.startIndex, nextStart);
    if (contentLines.length === 0) continue;
    
    // 提取题号和标题
    const firstLine = contentLines[0];
    const numMatch = firstLine.match(/^(\d+)[\.、．\s]+(.+)?$/);
    const questionNum = numMatch ? parseInt(numMatch[1]) : i + 1;
    const title = numMatch?.[2] || '';
    
    // 提取代码块
    const { textLines, codeBlocks } = extractCodeBlocks(contentLines.slice(1));
    
    questions.push({
      number: questionNum,
      title: title.slice(0, 50),
      rawText: [firstLine, ...textLines].join('\n'),
      codeBlocks,
      hasCode: codeBlocks.length > 0,
    });
  }
  
  // 如果上面的方法没有识别到题目，使用备选方案
  if (questions.length < 3) {
    return fallbackSplitter(cleanedLines);
  }
  
  return questions;
}

// 提取代码块
function extractCodeBlocks(lines: string[]): { textLines: string[]; codeBlocks: string[] } {
  const textLines: string[] = [];
  const codeBlocks: string[] = [];
  
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let braceCount = 0;
  
  for (const line of lines) {
    // 检测代码块开始
    if (!inCodeBlock) {
      if (line.includes('#include') || 
          line.includes('int main') || 
          line.includes('void ') ||
          line.includes('using namespace') ||
          line.match(/^\s*(int|void|bool|char|string)\s+\w+\s*\(/)) {
        inCodeBlock = true;
        codeBuffer = [line];
        braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
        continue;
      }
    }
    
    if (inCodeBlock) {
      codeBuffer.push(line);
      braceCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      
      // 代码块结束条件：括号平衡且遇到特定模式
      if (braceCount <= 0 && (line.includes('}') || line.includes('return'))) {
        // 再读一行确认
        codeBlocks.push(codeBuffer.join('\n'));
        codeBuffer = [];
        inCodeBlock = false;
        braceCount = 0;
      }
      continue;
    }
    
    textLines.push(line);
  }
  
  // 处理未闭合的代码块
  if (codeBuffer.length > 0) {
    codeBlocks.push(codeBuffer.join('\n'));
  }
  
  return { textLines, codeBlocks };
}

// 备选分割方案
function fallbackSplitter(lines: string[]): QuestionBlock[] {
  const questions: QuestionBlock[] = [];
  
  let currentNum = 0;
  let currentContent: string[] = [];
  let codeBlocks: string[] = [];
  let inCode = false;
  let codeBuffer: string[] = [];
  
  for (const line of lines) {
    // 检测题号 - 更宽松的模式
    const numMatch = line.match(/^(\d+)[\.、．\)\]\s]+/);
    
    if (numMatch && !inCode) {
      const num = parseInt(numMatch[1]);
      
      // 保存上一题
      if (currentNum > 0 && currentContent.length > 0) {
        questions.push({
          number: currentNum,
          rawText: currentContent.join('\n'),
          codeBlocks: [...codeBlocks],
          hasCode: codeBlocks.length > 0,
        });
      }
      
      currentNum = num;
      currentContent = [line];
      codeBlocks = [];
      continue;
    }
    
    // 检测代码
    if (line.includes('#include') || line.includes('int main')) {
      inCode = true;
      codeBuffer = [line];
      continue;
    }
    
    if (inCode) {
      codeBuffer.push(line);
      if (line.includes('}') || line.includes('return 0')) {
        // 检查是否是代码块结束
        if (codeBuffer.length > 3) {
          codeBlocks.push(codeBuffer.join('\n'));
        }
        codeBuffer = [];
        inCode = false;
      }
      continue;
    }
    
    if (currentNum > 0) {
      currentContent.push(line);
    }
  }
  
  // 保存最后一题
  if (currentNum > 0 && currentContent.length > 0) {
    questions.push({
      number: currentNum,
      rawText: currentContent.join('\n'),
      codeBlocks,
      hasCode: codeBlocks.length > 0,
    });
  }
  
  return questions;
}
