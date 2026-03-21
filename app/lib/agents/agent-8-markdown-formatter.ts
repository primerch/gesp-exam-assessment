// Agent 8: Markdown 格式化 Agent
export interface MarkdownFormatOptions {
  includeTable: boolean;
  includeEmoji: boolean;
  includeDifficultyBar: boolean;
}

export function agent8MarkdownFormatter(
  rawFeedback: string,
  details: {
    examLevel: number;
    questionCount: number;
    beyondQuestionCount: number;
    beyondPoints: Array<{
      name: string;
      gespLevel: number;
      questionNumbers: number[];
    }>;
  },
  options: MarkdownFormatOptions = { includeTable: true, includeEmoji: true, includeDifficultyBar: true }
): string {
  let formatted = rawFeedback;
  
  // 确保标题格式正确
  formatted = formatted.replace(/^(#{1,6})\s*/gm, '$1 ');
  
  // 添加超纲知识点表格（如果启用）
  if (options.includeTable && details.beyondPoints.length > 0) {
    const tableHeader = "\n\n### 📋 超纲知识点详情\n\n";
    const table = "| 题号 | 知识点 | 实际级别 |\n|-----|-------|---------|\n";
    
    const rows = details.beyondPoints
      .slice(0, 10)
      .map(point => {
        const qNumbers = point.questionNumbers.slice(0, 5).join(", ");
        const ellipsis = point.questionNumbers.length > 5 ? "..." : "";
        return `| ${qNumbers}${ellipsis} | ${point.name} | GESP ${point.gespLevel}级 |`;
      })
      .join("\n");
    
    // 在"教学建议"前插入表格
    const insertPos = formatted.indexOf("## 💡") !== -1 
      ? formatted.indexOf("## 💡") 
      : formatted.length - 20;
    
    formatted = formatted.slice(0, insertPos) + tableHeader + table + rows + "\n" + formatted.slice(insertPos);
  }
  
  // 添加难度可视化条
  if (options.includeDifficultyBar && formatted.includes("难度")) {
    const difficultyMatch = formatted.match(/(\d+)\/10/);
    if (difficultyMatch) {
      const score = parseInt(difficultyMatch[1]);
      const filled = "▓".repeat(score);
      const empty = "░".repeat(10 - score);
      const bar = `\n\n难度条：${filled}${empty} ${score}/10\n`;
      
      // 在难度分数后插入
      formatted = formatted.replace(/(\d+\/10)/, `$1${bar}`);
    }
  }
  
  // 确保 emoji 存在
  if (options.includeEmoji) {
    // 为标题添加 emoji（如果没有）
    formatted = formatted.replace(/^## (\d+\.)\s+([^\n]*)$/gm, (match, num, title) => {
      const emojiMap: Record<string, string> = {
        "整体": "📊",
        "难度": "📈",
        "超纲": "⚠️",
        "内容": "📝",
        "建议": "💡",
        "总结": "✅",
        "分析": "🔍",
      };
      const emoji = Object.entries(emojiMap).find(([k]) => title.includes(k))?.[1] || "•";
      return `## ${num} ${emoji} ${title}`;
    });
  }
  
  return formatted;
}
