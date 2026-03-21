// Agent 5: 超纲判定 Agent (DeepSeek Reasoner)
import OpenAI from "openai";
import type { KnowledgePoint } from "./agent-4-knowledge-extractor";

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

export interface BeyondAnalysis {
  isBeyond: boolean;
  beyondPoints: Array<{
    name: string;
    actualLevel: number;
    reason: string;
  }>;
  confidence: number;
}

export async function agent5BeyondAnalyzer(
  knowledgePoints: KnowledgePoint[],
  examLevel: number
): Promise<BeyondAnalysis> {
  const client = getDeepSeekClient();
  
  const prompt = `判断以下知识点是否超出 GESP ${examLevel} 级大纲。

GESP 级别大纲：
- 1级：基础语法、变量、输入输出、分支循环
- 2级：流程图、ASCII、类型转换、嵌套结构
- 3级：进制转换、位运算、数组、字符串、枚举
- 4级：指针、函数、结构体、递推、基础排序
- 5级：数论、高精度、链表、二分、递归分治
- 6级：树、搜索、简单DP、面向对象、栈队列
- 7级：数学库、复杂DP、图论基础、哈希表
- 8级：排列组合、最短路径、最小生成树、倍增

题目知识点：
${JSON.stringify(knowledgePoints, null, 2)}

请分析每个知识点是否超纲，输出 JSON 格式：
{
  "isBeyond": true/false,
  "beyondPoints": [
    {"name": "知识点名称", "actualLevel": 5, "reason": "属于 GESP 5 级考点，超出当前试卷级别"}
  ],
  "confidence": 0.95
}`;

  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-reasoner",
      messages: [
        { role: "system", content: "你是 GESP 大纲专家，精通各级考点范围。严格判断知识点是否超纲。" },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });
    
    const text = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(text);
    
    return {
      isBeyond: parsed.isBeyond || false,
      beyondPoints: parsed.beyondPoints || [],
      confidence: parsed.confidence || 0.8,
    };
  } catch (error) {
    console.error('超纲分析失败:', error);
    // 降级：基于预估级别判断
    const beyondPoints = knowledgePoints
      .filter(kp => kp.estimatedLevel > examLevel)
      .map(kp => ({
        name: kp.name,
        actualLevel: kp.estimatedLevel,
        reason: `${kp.name} 属于 GESP ${kp.estimatedLevel} 级考点`,
      }));
    
    return {
      isBeyond: beyondPoints.length > 0,
      beyondPoints,
      confidence: 0.6,
    };
  }
}
