// GESP 试卷题目模式数据库
// 用于规则引擎匹配题目类型和判断超纲

import { extractKeywords, getKeywordLevel } from "./keyword-db";

// 题目类型
export type QuestionType = "choice" | "fill" | "programming" | "unknown";

// 模式匹配结果
export interface PatternMatch {
  patternName: string;
  confidence: number;
  gespLevel: number;
  isBeyond: (examLevel: number) => boolean;
  reason: string;
  matchedKeywords: string[];
  priority: number; // 优先级，数字越大越优先
}

// 题目模式定义
export interface ExamPattern {
  name: string;
  gespLevel: number;
  keywords: string[];
  regex?: RegExp[];
  isBeyond: (examLevel: number, matchedKeywords: string[]) => boolean;
  reason: string | ((matchedKeywords: string[]) => string);
  priority: number;
}

// ==================== 模式定义 ====================

export const examPatterns: ExamPattern[] = [
  // ==================== 进制转换类 (GESP 3级) ====================
  {
    name: "base_conversion",
    gespLevel: 3,
    keywords: ["进制", "转换", "二进制", "八进制", "十进制", "十六进制", "三进制", "四进制", "五进制", "六进制", "七进制", "九进制"],
    regex: [
      /([二三四五六七八九]|\d+)进制.*转.*([二三四五六七八九]|\d+)进制/,
      /binary|octal|decimal|hexadecimal|base\s*\d+/i,
    ],
    isBeyond: (examLevel) => examLevel < 3,
    reason: () => "进制转换（含二进制、八进制、十进制、十六进制及变体）属于 GESP 3 级考点",
    priority: 100,
  },
  
  // ==================== 位运算类 (GESP 3级) ====================
  {
    name: "bit_operation",
    gespLevel: 3,
    keywords: ["位运算", "与", "或", "非", "异或", "左移", "右移", "&", "|", "^", "~", "<<", ">>"],
    regex: [
      /位运算|位操作/,
      /[&|^~<]{1,2}/,
    ],
    isBeyond: (examLevel) => examLevel < 3,
    reason: () => "位运算（与、或、非、异或、左移、右移）属于 GESP 3 级考点",
    priority: 95,
  },
  
  // ==================== 数据编码类 (GESP 3级) ====================
  {
    name: "data_encoding",
    gespLevel: 3,
    keywords: ["原码", "反码", "补码", "数据编码"],
    isBeyond: (examLevel) => examLevel < 3,
    reason: () => "数据编码（原码、反码、补码）属于 GESP 3 级考点",
    priority: 95,
  },
  
  // ==================== 数组类 (GESP 3级) ====================
  {
    name: "array",
    gespLevel: 3,
    keywords: ["数组", "array", "一维数组"],
    regex: [
      /数组|array/,
      /\[\s*\d+\s*\]/,
    ],
    isBeyond: (examLevel) => examLevel < 3,
    reason: () => "数组（一维数组）属于 GESP 3 级考点",
    priority: 90,
  },
  
  // ==================== 字符串类 (GESP 3级) ====================
  {
    name: "string",
    gespLevel: 3,
    keywords: ["字符串", "string", "String", "大小写转换", "字符串搜索", "分割", "替换"],
    isBeyond: (examLevel) => examLevel < 3,
    reason: () => "字符串及其操作属于 GESP 3 级考点",
    priority: 85,
  },
  
  // ==================== 枚举模拟类 (GESP 3级) ====================
  {
    name: "enumeration_simulation",
    gespLevel: 3,
    keywords: ["枚举", "模拟", "穷举", "枚举法", "模拟法"],
    isBeyond: (examLevel) => examLevel < 3,
    reason: () => "枚举法和模拟法属于 GESP 3 级考点",
    priority: 80,
  },
  
  // ==================== 二维数组类 (GESP 4级) ====================
  {
    name: "2d_array",
    gespLevel: 4,
    keywords: ["二维数组", "多维数组", "matrix", "矩阵"],
    regex: [
      /二维数组|多维数组/,
      /\[\s*\d+\s*\]\s*\[\s*\d+\s*\]/,
    ],
    isBeyond: (examLevel) => examLevel < 4,
    reason: () => "二维及多维数组属于 GESP 4 级考点",
    priority: 95,
  },
  
  // ==================== 函数类 (GESP 4级) ====================
  {
    name: "function",
    gespLevel: 4,
    keywords: ["函数", "function", "void", "return", "参数", "调用", "递归"],
    regex: [
      /函数|void\s+\w+\s*\(/,
    ],
    isBeyond: (examLevel) => examLevel < 4,
    reason: () => "函数定义和调用属于 GESP 4 级考点",
    priority: 90,
  },
  
  // ==================== 指针类 (GESP 4级) ====================
  {
    name: "pointer",
    gespLevel: 4,
    keywords: ["指针", "pointer", "地址", "解引用", "取地址"],
    regex: [
      /指针|\*\s*\w+\s*=/,
    ],
    isBeyond: (examLevel) => examLevel < 4,
    reason: () => "指针属于 GESP 4 级考点",
    priority: 95,
  },
  
  // ==================== 结构体类 (GESP 4级) ====================
  {
    name: "struct",
    gespLevel: 4,
    keywords: ["结构体", "struct", "Struct", "成员变量"],
    isBeyond: (examLevel) => examLevel < 4,
    reason: () => "结构体属于 GESP 4 级考点",
    priority: 90,
  },
  
  // ==================== 排序算法类 (GESP 4级/5级) ====================
  {
    name: "sorting",
    gespLevel: 4,
    keywords: ["冒泡排序", "插入排序", "选择排序", "排序算法", "时间复杂度", "空间复杂度"],
    isBeyond: (examLevel) => examLevel < 4,
    reason: () => "基础排序算法（冒泡、插入、选择）属于 GESP 4 级考点",
    priority: 85,
  },
  {
    name: "advanced_sorting",
    gespLevel: 5,
    keywords: ["快速排序", "归并排序", "快排", "quicksort", "merge sort"],
    isBeyond: (examLevel) => examLevel < 5,
    reason: () => "快速排序、归并排序等高级排序属于 GESP 5 级考点",
    priority: 90,
  },
  
  // ==================== 递推类 (GESP 4级) ====================
  {
    name: "recurrence",
    gespLevel: 4,
    keywords: ["递推", "递推关系", "迭代"],
    isBeyond: (examLevel) => examLevel < 4,
    reason: () => "递推算法属于 GESP 4 级考点",
    priority: 80,
  },
  
  // ==================== 文件操作类 (GESP 4级) ====================
  {
    name: "file_operation",
    gespLevel: 4,
    keywords: ["文件", "文件操作", "fopen", "fclose", "fread", "fwrite", "重定向"],
    isBeyond: (examLevel) => examLevel < 4,
    reason: () => "文件操作属于 GESP 4 级考点",
    priority: 85,
  },
  
  // ==================== 高精度类 (GESP 5级) ====================
  {
    name: "high_precision",
    gespLevel: 5,
    keywords: ["高精度", "大整数", "大数", "高精度运算"],
    isBeyond: (examLevel) => examLevel < 5,
    reason: () => "高精度运算属于 GESP 5 级考点",
    priority: 95,
  },
  
  // ==================== 素数筛类 (GESP 5级) ====================
  {
    name: "prime_sieve",
    gespLevel: 5,
    keywords: ["素数筛", "埃氏筛", "线性筛", "欧拉筛"],
    isBeyond: (examLevel) => examLevel < 5,
    reason: () => "素数筛法属于 GESP 5 级考点",
    priority: 90,
  },
  
  // ==================== 链表类 (GESP 5级) ====================
  {
    name: "linked_list",
    gespLevel: 5,
    keywords: ["链表", "linked list", "单链表", "双链表", "循环链表"],
    isBeyond: (examLevel) => examLevel < 5,
    reason: () => "链表属于 GESP 5 级考点",
    priority: 95,
  },
  
  // ==================== 二分算法类 (GESP 5级) ====================
  {
    name: "binary_search",
    gespLevel: 5,
    keywords: ["二分", "二分查找", "二分答案", "binary search"],
    isBeyond: (examLevel) => examLevel < 5,
    reason: () => "二分算法属于 GESP 5 级考点",
    priority: 85,
  },
  
  // ==================== 分治类 (GESP 5级) ====================
  {
    name: "divide_conquer",
    gespLevel: 5,
    keywords: ["分治", "分治法", "归并排序", "快速排序", "快排", "quicksort"],
    isBeyond: (examLevel) => examLevel < 5,
    reason: () => "分治算法及归并/快速排序属于 GESP 5 级考点",
    priority: 85,
  },
  
  // ==================== 贪心类 (GESP 5级) ====================
  {
    name: "greedy",
    gespLevel: 5,
    keywords: ["贪心", "贪心算法", "最优子结构"],
    isBeyond: (examLevel) => examLevel < 5,
    reason: () => "贪心算法属于 GESP 5 级考点",
    priority: 80,
  },
  
  // ==================== 树类 (GESP 6级) ====================
  {
    name: "tree",
    gespLevel: 6,
    keywords: ["树", "二叉树", "tree", "哈夫曼树", "完全二叉树", "二叉排序树", "BST"],
    isBeyond: (examLevel) => examLevel < 6,
    reason: () => "树及二叉树相关属于 GESP 6 级考点",
    priority: 95,
  },
  
  // ==================== 搜索类 (GESP 6级) ====================
  {
    name: "search",
    gespLevel: 6,
    keywords: ["深度优先搜索", "DFS", "广度优先搜索", "BFS", "深搜", "广搜"],
    isBeyond: (examLevel) => examLevel < 6,
    reason: () => "DFS/BFS 搜索算法属于 GESP 6 级考点",
    priority: 90,
  },
  
  // ==================== 动态规划类 (GESP 6级) ====================
  {
    name: "dp",
    gespLevel: 6,
    keywords: ["动态规划", "DP", "dp", "动规", "一维DP", "背包"],
    isBeyond: (examLevel) => examLevel < 6,
    reason: () => "动态规划基础属于 GESP 6 级考点",
    priority: 90,
  },
  
  // ==================== 栈队列类 (GESP 6级) ====================
  {
    name: "stack_queue",
    gespLevel: 6,
    keywords: ["栈", "stack", "队列", "queue", "循环队列", "堆栈"],
    isBeyond: (examLevel) => examLevel < 6,
    reason: () => "栈和队列属于 GESP 6 级考点",
    priority: 85,
  },
  
  // ==================== 面向对象类 (GESP 6级) ====================
  {
    name: "oop",
    gespLevel: 6,
    keywords: ["面向对象", "OOP", "类", "class", "对象", "继承", "封装", "多态"],
    isBeyond: (examLevel) => examLevel < 6,
    reason: () => "面向对象编程属于 GESP 6 级考点",
    priority: 85,
  },
  
  // ==================== 哈希表类 (GESP 7级) ====================
  {
    name: "hash_table",
    gespLevel: 7,
    keywords: ["哈希表", "hash", "哈希", "散列表", "哈希函数", "冲突"],
    isBeyond: (examLevel) => examLevel < 7,
    reason: () => "哈希表属于 GESP 7 级考点",
    priority: 95,
  },
  
  // ==================== 图论类 (GESP 7级) ====================
  {
    name: "graph",
    gespLevel: 7,
    keywords: ["图", "graph", "图论", "顶点", "边", "邻接矩阵", "邻接表", "泛洪算法", "floodfill"],
    isBeyond: (examLevel) => examLevel < 7,
    reason: () => "图论基础属于 GESP 7 级考点",
    priority: 90,
  },
  
  // ==================== 复杂DP类 (GESP 7级) ====================
  {
    name: "advanced_dp",
    gespLevel: 7,
    keywords: ["二维DP", "区间DP", "LIS", "LCS", "滚动数组", "最长上升子序列", "最长公共子序列"],
    isBeyond: (examLevel) => examLevel < 7,
    reason: () => "复杂动态规划（二维DP、区间DP等）属于 GESP 7 级考点",
    priority: 90,
  },
  
  // ==================== 数学库类 (GESP 7级) ====================
  {
    name: "math_lib",
    gespLevel: 7,
    keywords: ["数学库", "cmath", "三角函数", "对数函数", "指数函数", "sin", "cos", "tan", "log", "exp"],
    isBeyond: (examLevel) => examLevel < 7,
    reason: () => "数学库函数属于 GESP 7 级考点",
    priority: 85,
  },
  
  // ==================== 排列组合类 (GESP 8级) ====================
  {
    name: "combinatorics",
    gespLevel: 8,
    keywords: ["排列", "组合", "排列组合", "阶乘", "杨辉三角", "帕斯卡三角形", "计数原理"],
    isBeyond: (examLevel) => examLevel < 8,
    reason: () => "排列组合属于 GESP 8 级考点",
    priority: 95,
  },
  
  // ==================== 最短路径类 (GESP 7级/8级) ====================
  {
    name: "shortest_path",
    gespLevel: 8,
    keywords: ["最短路径", "Dijkstra", "Floyd", "SPFA", "Bellman-Ford", "迪杰斯特拉", "弗洛伊德", "Dijkstra算法"],
    isBeyond: (examLevel) => examLevel < 8,
    reason: () => "最短路径算法（Dijkstra、Floyd等）属于 GESP 8 级考点",
    priority: 95,
  },
  
  // ==================== 最小生成树类 (GESP 8级) ====================
  {
    name: "mst",
    gespLevel: 8,
    keywords: ["最小生成树", "MST", "Kruskal", "Prim", "克鲁斯卡尔", "普里姆"],
    isBeyond: (examLevel) => examLevel < 8,
    reason: () => "最小生成树算法属于 GESP 8 级考点",
    priority: 95,
  },
  
  // ==================== 倍增类 (GESP 8级) ====================
  {
    name: "binary_lifting",
    gespLevel: 8,
    keywords: ["倍增", "倍增法", "ST表", "Sparse Table", "RMQ", "区间最值查询"],
    isBeyond: (examLevel) => examLevel < 8,
    reason: () => "倍增法属于 GESP 8 级考点",
    priority: 90,
  },
  
  // ==================== GESP 1-2级基础概念 ====================
  // 这些是基础，几乎所有题目都会涉及，优先级较低
  {
    name: "basic_concepts",
    gespLevel: 1,
    keywords: ["变量", "常量", "int", "char", "double", "if", "else", "for", "while", "cin", "cout"],
    isBeyond: () => false, // 基础概念不超纲
    reason: () => "基础概念属于 GESP 1 级，不超纲",
    priority: 10,
  },
];

// ==================== 模式匹配引擎 ====================

// 匹配题目与模式
export function matchPatterns(questionText: string): PatternMatch[] {
  const matches: PatternMatch[] = [];
  
  // 提取关键词
  const extractedKeywords = extractKeywords(questionText);
  const keywordSet = new Set(extractedKeywords.map(k => k.keyword));
  
  for (const pattern of examPatterns) {
    const matchedKeywords: string[] = [];
    let matchScore = 0;
    
    // 检查关键词匹配
    for (const keyword of pattern.keywords) {
      if (questionText.includes(keyword)) {
        matchedKeywords.push(keyword);
        matchScore += 1;
      }
    }
    
    // 检查正则匹配
    if (pattern.regex) {
      for (const regex of pattern.regex) {
        if (regex.test(questionText)) {
          matchScore += 2; // 正则匹配权重更高
        }
      }
    }
    
    // 如果有匹配，添加到结果
    if (matchScore > 0) {
      const reasonText = typeof pattern.reason === "function" 
        ? pattern.reason(matchedKeywords)
        : pattern.reason;
      
      matches.push({
        patternName: pattern.name,
        confidence: Math.min(matchScore / Math.max(pattern.keywords.length * 0.5, 1), 1),
        gespLevel: pattern.gespLevel,
        isBeyond: (examLevel) => pattern.isBeyond(examLevel, matchedKeywords),
        reason: reasonText,
        matchedKeywords,
        priority: pattern.priority,
      });
    }
  }
  
  // 按优先级和置信度排序
  return matches.sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    return b.confidence - a.confidence;
  });
}

// 分析单个题目
export interface QuestionAnalysis {
  isBeyond: boolean;
  confidence: number;
  reason: string;
  matchedPattern?: string;
  matchedLevel: number;
  matchedKeywords: string[];
  needsAI: boolean;
}

export function analyzeQuestion(
  questionText: string,
  examLevel: number
): QuestionAnalysis {
  const matches = matchPatterns(questionText);
  
  // 如果没有匹配到任何模式
  if (matches.length === 0) {
    return {
      isBeyond: false,
      confidence: 0,
      reason: "未匹配到明确的超纲模式",
      matchedLevel: 0,
      matchedKeywords: [],
      needsAI: true, // 需要 AI 进一步判断
    };
  }
  
  // 取最高优先级的匹配
  const bestMatch = matches[0];
  
  // 如果置信度太低，标记为需要 AI 验证
  if (bestMatch.confidence < 0.3) {
    return {
      isBeyond: false,
      confidence: bestMatch.confidence,
      reason: `匹配度较低: ${bestMatch.reason}`,
      matchedPattern: bestMatch.patternName,
      matchedLevel: bestMatch.gespLevel,
      matchedKeywords: bestMatch.matchedKeywords,
      needsAI: true,
    };
  }
  
  // 判断是否超纲
  const isBeyond = bestMatch.isBeyond(examLevel);
  
  return {
    isBeyond,
    confidence: bestMatch.confidence,
    reason: bestMatch.reason,
    matchedPattern: bestMatch.patternName,
    matchedLevel: bestMatch.gespLevel,
    matchedKeywords: bestMatch.matchedKeywords,
    needsAI: false,
  };
}

// 分析整份试卷
export interface ExamAnalysis {
  questions: Array<{
    questionNumber: number;
    questionText: string;
    analysis: QuestionAnalysis;
  }>;
  summary: {
    totalQuestions: number;
    beyondCount: number;
    certainCount: number; // 规则引擎确定的题目数
    uncertainCount: number; // 需要 AI 验证的题目数
    beyondPoints: Array<{
      name: string;
      gespLevel: number;
      reason: string;
    }>;
  };
}

export function analyzeExam(
  questions: Array<{ number: number; text: string }>,
  examLevel: number
): ExamAnalysis {
  const results = questions.map(q => ({
    questionNumber: q.number,
    questionText: q.text,
    analysis: analyzeQuestion(q.text, examLevel),
  }));
  
  const certainCount = results.filter(r => !r.analysis.needsAI).length;
  const uncertainCount = results.filter(r => r.analysis.needsAI).length;
  const beyondQuestions = results.filter(r => r.analysis.isBeyond);
  
  // 提取超纲知识点（去重）
  const beyondMap = new Map<string, { name: string; gespLevel: number; reason: string }>();
  for (const r of beyondQuestions) {
    const key = r.analysis.matchedPattern || r.analysis.reason;
    if (!beyondMap.has(key)) {
      beyondMap.set(key, {
        name: r.analysis.matchedPattern || "未知知识点",
        gespLevel: r.analysis.matchedLevel,
        reason: r.analysis.reason,
      });
    }
  }
  
  return {
    questions: results,
    summary: {
      totalQuestions: questions.length,
      beyondCount: beyondQuestions.length,
      certainCount,
      uncertainCount,
      beyondPoints: Array.from(beyondMap.values()),
    },
  };
}
