// Agent 7: 教学建议生成 Agent (DeepSeek)
import OpenAI from "openai";
import type { DifficultyAssessment } from "./agent-6-difficulty-assessor";

const getDeepSeekClient = () => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY is not set");
  return new OpenAI({
    apiKey,
    baseURL: "https://api.deepseek.com/v1",
    timeout: 30000,
    maxRetries: 2,
  });
};

export interface FeedbackInput {
  teacherName: string;
  examLevel: number;
  studentLevel: number;
  studentLesson: number;
  difficulty: DifficultyAssessment;
  beyondSummary: {
    totalBeyondPoints: number;
    maxBeyondLevel: number;
    byLevel: Record<number, string[]>;
  };
}

export async function agent7FeedbackGenerator(input: FeedbackInput): Promise<string> {
  const client = getDeepSeekClient();
  
  const prompt = `生成 GESP 试卷分析反馈。

分析对象：
- 学管老师：${input.teacherName || "XX"}
- 试卷级别：GESP ${input.examLevel} 级
- 学生进度：Level ${input.studentLevel} 第 ${input.studentLesson} 课
- 试卷难度：${input.difficulty.score}/10 (${input.difficulty.level})
- 难度因素：${input.difficulty.factors.join("、")}

超纲情况：
- 超纲知识点数量：${input.beyondSummary.totalBeyondPoints}
- 最高到 GESP ${input.beyondSummary.maxBeyondLevel} 级
- 各级别分布：${JSON.stringify(input.beyondSummary.byLevel, null, 2)}

要求：
1. 以"你好，我是${input.teacherName || "XX"}老师"开头
2. 语气专业亲切，像微信私聊
3. 包含具体的技术建议
4. 使用 markdown 格式（标题、列表、加粗）
5. 适当使用 emoji
6. 不要罗列123，要自然流畅
7. 结尾友好

生成完整的 markdown 格式反馈。`;

  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { 
          role: "system", 
          content: "你是资深编程教育专家，擅长用亲切的语气给学管老师提供试卷分析和教学建议。输出使用 markdown 格式。" 
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 2000,
    });
    
    return completion.choices[0]?.message?.content || generateFallbackFeedback(input);
  } catch (error) {
    console.error('反馈生成失败:', error);
    return generateFallbackFeedback(input);
  }
}

function generateFallbackFeedback(input: FeedbackInput): string {
  const { teacherName, examLevel, difficulty, beyondSummary } = input;
  
  let feedback = `你好，我是${teacherName || "学管老师"} 👋\n\n`;
  feedback += `刚分析完这份 GESP ${examLevel} 级试卷\n\n`;
  
  feedback += `## 📊 整体评估\n\n`;
  feedback += `**难度：${difficulty.score}/10**\n\n`;
  feedback += difficulty.explanation + "\n\n";
  
  if (beyondSummary.totalBeyondPoints > 0) {
    feedback += `## ⚠️ 超纲内容\n\n`;
    feedback += `发现 ${beyondSummary.totalBeyondPoints} 个超纲知识点，`;
    feedback += `最高涉及 GESP ${beyondSummary.maxBeyondLevel} 级\n\n`;
    
    for (const [level, points] of Object.entries(beyondSummary.byLevel)) {
      feedback += `- **GESP ${level}级**：${points.join("、")}\n`;
    }
    
    feedback += `\n## 💡 教学建议\n\n`;
    const gap = beyondSummary.maxBeyondLevel - examLevel;
    if (gap >= 3) {
      feedback += "这份试卷跨度较大，建议给已经完成 Level 4 学习的学生挑战使用。";
    } else if (gap >= 1) {
      feedback += "有少量超纲内容，可以作为拓展练习，提前给学生讲解相关知识点。";
    } else {
      feedback += "试卷难度适中，适合当前阶段的学生练习。";
    }
  } else {
    feedback += `## ✅ 内容分析\n\n`;
    feedback += "试卷内容符合大纲要求，无超纲题目\n\n";
    feedback += `## 💡 教学建议\n\n`;
    feedback += "这份试卷适合当前进度的学生练习，可以帮助巩固所学知识。";
  }
  
  feedback += "\n\n有其他试卷需要分析随时发我~ 😊";
  
  return feedback;
}
