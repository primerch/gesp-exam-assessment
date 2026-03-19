import { GoogleGenerativeAI } from "@google/generative-ai";

// 初始化 Gemini 客户端
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return new GoogleGenerativeAI(apiKey);
};

// 分析试卷的请求类型
export interface ExamAnalysisRequest {
  pdfBase64: string; // PDF 文件的 base64 编码
  examLevel: number; // 试卷声称的 GESP 级别 (1-8)
  studentLevel: number; // 学生当前课程级别 (1-4)
  studentLesson: number; // 学生当前课程进度
}

// 超纲知识点类型
export interface BeyondKnowledgePoint {
  name: string;
  gespLevel: number; // 该知识点实际属于的 GESP 级别
  reason: string; // 为什么认为超纲
  questionContext?: string; // 在试卷中的上下文
}

// 分析结果类型
export interface ExamAnalysisResult {
  difficultyScore: number; // 难度系数 1-10
  isBeyondSyllabus: boolean; // 是否超纲
  beyondPoints: BeyondKnowledgePoint[]; // 超纲知识点列表
  parentFeedback: string; // 给家长的反馈文案
  summary: string; // 总体评价
  confidence: number; // AI 分析的置信度 0-1
}

// 构建分析 Prompt
function buildAnalysisPrompt(
  examLevel: number,
  studentLevel: number,
  studentLesson: number
): string {
  return `你是一位专业的 GESP (CCF 编程能力等级认证) C++ 考试分析师。请仔细分析上传的 PDF 试卷，并与 GESP ${examLevel} 级官方大纲进行对比。

## 学生背景信息
- 学生当前课程级别: Level ${studentLevel}
- 已完成课程进度: 第 ${studentLesson} 课

## GESP ${examLevel} 级大纲要求
${getOutlineDescription(examLevel)}

## 分析任务
请仔细分析试卷的每一道题目，判断：
1. 难度系数 (1-10)：相对于 GESP ${examLevel} 级的标准难度
2. 是否有超纲内容：超出 GESP ${examLevel} 级大纲的知识点
3. 具体超纲知识点：列出每个超纲知识点的名称、实际所属级别、超纲原因

## 输出格式要求
请以 JSON 格式返回分析结果：
{
  "difficultyScore": number, // 1-10 的难度评分
  "isBeyondSyllabus": boolean, // true/false
  "beyondPoints": [
    {
      "name": string, // 超纲知识点名称
      "gespLevel": number, // 该知识点实际属于的 GESP 级别
      "reason": string, // 超纲原因说明
      "questionContext": string // 在试卷中的上下文描述
    }
  ],
  "parentFeedback": string, // 给家长的正式反馈文案（中文）
  "summary": string, // 总体评价（中文）
  "confidence": number // AI 分析的置信度 0-1
}

## 给家长反馈文案的要求
- 语气专业、客观、友好
- 说明试卷的整体难度评估
- 明确指出超纲的知识点（如果有）
- 建议学生是否需要补充学习某些内容
- 适合直接复制发送给家长

## 注意事项
- 只分析 C++ 相关内容，忽略 Python 或其他语言内容
- 以 GESP ${examLevel} 级大纲为标准进行判断
- 如果题目涉及多个知识点，请分别判断每个知识点是否超纲
- 严格按照 C++11 标准判断语法要求`;
}

// 获取大纲描述
function getOutlineDescription(level: number): string {
  const outlines: Record<number, string> = {
    1: `一级大纲：
- 计算机基础：计算机组成、操作系统基本概念
- 开发环境：IDE 使用、文件操作
- 基础语法：cin/cout、scanf/printf、变量定义
- 数据类型：int、long long、float、double、char、bool
- 运算：算术运算(+,-,*,/,%)、关系运算(>,<,==,!=)、逻辑运算(&&,||,!)
- 程序结构：顺序、分支(if/switch)、循环(for/while/do-while)
- 注释和调试`,

    2: `二级大纲：
- 计算机存储与网络：ROM、RAM、网络协议
- 流程图绘制
- ASCII 编码
- 数据类型转换
- 多层分支/循环嵌套
- 常用数学函数：abs、sqrt、max、min、rand`,

    3: `三级大纲：
- 数据编码：原码、反码、补码
- 进制转换：二进制、八进制、十进制、十六进制
- 位运算：&、|、~、^、<<、>>
- 算法描述：自然语言、流程图、伪代码
- 一维数组
- 字符串及函数
- 枚举算法
- 模拟算法`,

    4: `四级大纲：
- 函数定义与调用、形参实参、作用域
- 指针基础：概念、定义、赋值、解引用
- 函数参数传递：值传递、引用传递、指针传递
- 结构体
- 二维数组
- 递推算法
- 排序算法：冒泡、插入、选择
- 算法复杂度估算
- 文件操作`,

    5: `五级大纲：
- 初等数论：辗转相除法、唯一分解定理
- 高精度运算：数组模拟高精度加减乘除
- 素数筛法：埃氏筛、线性筛
- 链表：单链表、双链表、循环链表
- 二分查找/二分答案
- 贪心算法
- 分治算法：归并排序、快速排序
- 递归
- 算法复杂度估算（多项式、指数、对数）`,

    6: `六级大纲：
- 树：定义、构造、遍历
- 哈夫曼树
- 完全二叉树
- 二叉排序树(BST)
- 哈夫曼编码
- 格雷编码
- 深度优先搜索(DFS)
- 广度优先搜索(BFS)
- 二叉树搜索算法
- 动态规划基础：一维DP、简单背包
- 栈和队列
- 面向对象：类、封装、继承、多态`,

    7: `七级大纲：
- 数学库函数：sin、cos、log、exp等
- 复杂动态规划：二维DP、DP最值优化
- 图论：图的定义、遍历
- 图论基本算法：图DFS、图BFS、泛洪算法(flood fill)
- 哈希表
- 计数原理：加法原理、乘法原理
- 排列与组合
- 杨辉三角`,

    8: `八级大纲：
- 倍增法
- 最小生成树：Kruskal、Prim算法
- 最短路径：Dijkstra、Floyd算法
- 图论综合应用
- 代数与平面几何（初中数学）
- 算法复杂度分析
- 算法优化`,
  };

  return outlines[level] || "未知级别";
}

// 分析试卷主函数
export async function analyzeExam(
  request: ExamAnalysisRequest
): Promise<ExamAnalysisResult> {
  const client = getGeminiClient();
  
  // 使用 Gemini 1.5 Flash 模型（支持 PDF，速度快）
  const model = client.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.2, // 低温度以获得更确定的结果
      maxOutputTokens: 4096,
    }
  });

  const prompt = buildAnalysisPrompt(
    request.examLevel,
    request.studentLevel,
    request.studentLesson
  );

  try {
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: request.pdfBase64,
        },
      },
      prompt,
    ]);

    const response = result.response;
    const text = response.text();

    // 提取 JSON 部分
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("无法解析 AI 返回的结果");
    }

    const analysisResult: ExamAnalysisResult = JSON.parse(jsonMatch[0]);
    
    // 验证结果格式
    if (typeof analysisResult.difficultyScore !== 'number' ||
        typeof analysisResult.isBeyondSyllabus !== 'boolean' ||
        !Array.isArray(analysisResult.beyondPoints)) {
      throw new Error("AI 返回的结果格式不正确");
    }

    return analysisResult;
  } catch (error) {
    console.error("Gemini API 调用失败:", error);
    throw new Error(
      error instanceof Error ? error.message : "试卷分析失败"
    );
  }
}

// 简单的健康检查
export async function checkGeminiHealth(): Promise<boolean> {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    await model.generateContent("Hello");
    return true;
  } catch {
    return false;
  }
}
