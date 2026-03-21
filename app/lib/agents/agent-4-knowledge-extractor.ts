// Agent 4: 知识点提取 Agent (DeepSeek)
import OpenAI from "openai";

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

export interface KnowledgePoint {
  name: string;
  category: string;
  estimatedLevel: number;
  confidence: number;
}

export async function agent4KnowledgeExtractor(
  questionText: string,
  codeBlocks: string[]
): Promise<KnowledgePoint[]> {
  const client = getDeepSeekClient();
  const fullText = questionText + '\n\n' + codeBlocks.join('\n\n');
  
  const prompt = `分析以下 GESP 编程考试题目，提取涉及的所有知识点。

题目内容：
${fullText.slice(0, 2000)}

请提取该题目涉及的所有 C++ 编程知识点，格式要求：
1. 知识点名称（简短准确）
2. 所属类别（如：语法、算法、数据结构）
3. 预估 GESP 级别（1-8级，根据难度判断）
4. 置信度（0-1）

只输出 JSON 数组，不要其他文字：
[{"name": "数组", "category": "数据结构", "estimatedLevel": 3, "confidence": 0.95}]`;

  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "你是 GESP 考试专家，擅长分析 C++ 题目涉及的知识点。只输出 JSON 格式。" },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });
    
    const text = completion.choices[0]?.message?.content || '[]';
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : parsed.knowledge || [];
  } catch (error) {
    console.error('知识点提取失败:', error);
    return [];
  }
}
