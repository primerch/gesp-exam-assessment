// GESP 试卷分析测试用例
// 用于验证规则引擎准确性

export interface TestCase {
  id: string;
  question: string;
  examLevel: number;
  expectedBeyond: boolean;
  expectedReason?: string;
  category: string;
  description: string;
}

// 核心测试用例集
export const testCases: TestCase[] = [
  // ==================== 关键测试：三进制转换 ====================
  {
    id: "base-1",
    question: "将三进制数 102 转换为十进制",
    examLevel: 3,
    expectedBeyond: false,
    expectedReason: "三进制是进制转换变体",
    category: "进制转换",
    description: "关键修复案例：三进制转换应被判为不超纲",
  },
  {
    id: "base-2",
    question: "三进制数 201 转换为十进制等于多少",
    examLevel: 3,
    expectedBeyond: false,
    category: "进制转换",
    description: "三进制转换变体",
  },
  {
    id: "base-3",
    question: "把四进制数 123 转成十进制",
    examLevel: 3,
    expectedBeyond: false,
    category: "进制转换",
    description: "四进制转换",
  },
  {
    id: "base-4",
    question: "二进制数 101101 转换为十进制",
    examLevel: 3,
    expectedBeyond: false,
    category: "进制转换",
    description: "标准二进制转换",
  },
  {
    id: "base-5",
    question: "计算 5 的二进制表示",
    examLevel: 2,
    expectedBeyond: true,
    category: "进制转换",
    description: "2级试卷出现进制转换应超纲",
  },
  
  // ==================== 位运算 ====================
  {
    id: "bit-1",
    question: "计算 5 & 3 的结果",
    examLevel: 3,
    expectedBeyond: false,
    category: "位运算",
    description: "标准位运算",
  },
  {
    id: "bit-2",
    question: "使用位运算优化程序性能",
    examLevel: 2,
    expectedBeyond: true,
    category: "位运算",
    description: "2级出现位运算应超纲",
  },
  {
    id: "bit-3",
    question: "异或运算的特点是什么",
    examLevel: 3,
    expectedBeyond: false,
    category: "位运算",
    description: "异或运算概念",
  },
  
  // ==================== 数组 ====================
  {
    id: "array-1",
    question: "定义一个包含5个整数的数组并初始化",
    examLevel: 3,
    expectedBeyond: false,
    category: "数组",
    description: "标准数组定义",
  },
  {
    id: "array-2",
    question: "使用数组存储学生成绩",
    examLevel: 2,
    expectedBeyond: true,
    category: "数组",
    description: "2级出现数组应超纲",
  },
  {
    id: "array-3",
    question: "二维数组的遍历方法",
    examLevel: 4,
    expectedBeyond: false,
    category: "数组",
    description: "二维数组",
  },
  {
    id: "array-4",
    question: "定义一个 3x3 的二维数组",
    examLevel: 3,
    expectedBeyond: true,
    category: "数组",
    description: "3级出现二维数组应超纲",
  },
  
  // ==================== 指针 ====================
  {
    id: "pointer-1",
    question: "使用指针交换两个变量的值",
    examLevel: 4,
    expectedBeyond: false,
    category: "指针",
    description: "标准指针操作",
  },
  {
    id: "pointer-2",
    question: "指针的概念和用途",
    examLevel: 3,
    expectedBeyond: true,
    category: "指针",
    description: "3级出现指针应超纲",
  },
  {
    id: "pointer-3",
    question: "int *p = &a 的含义",
    examLevel: 4,
    expectedBeyond: false,
    category: "指针",
    description: "指针定义",
  },
  
  // ==================== 函数 ====================
  {
    id: "function-1",
    question: "编写一个函数计算两个数的和",
    examLevel: 4,
    expectedBeyond: false,
    category: "函数",
    description: "标准函数定义",
  },
  {
    id: "function-2",
    question: "函数调用的过程",
    examLevel: 3,
    expectedBeyond: true,
    category: "函数",
    description: "3级深入函数概念应超纲",
  },
  {
    id: "function-3",
    question: "递归函数的实现",
    examLevel: 5,
    expectedBeyond: false,
    category: "函数",
    description: "递归",
  },
  
  // ==================== 排序 ====================
  {
    id: "sort-1",
    question: "使用冒泡排序对数组排序",
    examLevel: 4,
    expectedBeyond: false,
    category: "排序",
    description: "冒泡排序",
  },
  {
    id: "sort-2",
    question: "快速排序的时间复杂度分析",
    examLevel: 4,
    expectedBeyond: true,
    category: "排序",
    description: "4级出现快排应超纲（快排属于5级）",
  },
  {
    id: "sort-3",
    question: "归并排序的实现",
    examLevel: 5,
    expectedBeyond: false,
    category: "排序",
    description: "归并排序",
  },
  
  // ==================== 链表 ====================
  {
    id: "list-1",
    question: "链表的插入操作",
    examLevel: 5,
    expectedBeyond: false,
    category: "链表",
    description: "链表操作",
  },
  {
    id: "list-2",
    question: "单链表和双链表的区别",
    examLevel: 4,
    expectedBeyond: true,
    category: "链表",
    description: "4级出现链表应超纲",
  },
  
  // ==================== 动态规划 ====================
  {
    id: "dp-1",
    question: "使用动态规划解决背包问题",
    examLevel: 6,
    expectedBeyond: false,
    category: "动态规划",
    description: "标准DP",
  },
  {
    id: "dp-2",
    question: "最长上升子序列（LIS）算法",
    examLevel: 7,
    expectedBeyond: false,
    category: "动态规划",
    description: "LIS",
  },
  {
    id: "dp-3",
    question: "状态转移方程的推导",
    examLevel: 5,
    expectedBeyond: true,
    category: "动态规划",
    description: "5级出现DP应超纲",
  },
  
  // ==================== 图论 ====================
  {
    id: "graph-1",
    question: "图的深度优先遍历",
    examLevel: 7,
    expectedBeyond: false,
    category: "图论",
    description: "图遍历",
  },
  {
    id: "graph-2",
    question: "Dijkstra最短路径算法",
    examLevel: 8,
    expectedBeyond: false,
    category: "图论",
    description: "Dijkstra",
  },
  {
    id: "graph-3",
    question: "最小生成树算法",
    examLevel: 7,
    expectedBeyond: true,
    category: "图论",
    description: "7级出现MST应超纲",
  },
  
  // ==================== 字符串 ====================
  {
    id: "string-1",
    question: "字符串的大小写转换",
    examLevel: 3,
    expectedBeyond: false,
    category: "字符串",
    description: "字符串操作",
  },
  {
    id: "string-2",
    question: "字符串搜索算法",
    examLevel: 3,
    expectedBeyond: false,
    category: "字符串",
    description: "字符串搜索",
  },
  
  // ==================== 基础概念（不超纲） ====================
  {
    id: "basic-1",
    question: "变量的定义和使用",
    examLevel: 1,
    expectedBeyond: false,
    category: "基础",
    description: "基础概念不超纲",
  },
  {
    id: "basic-2",
    question: "for循环的语法",
    examLevel: 1,
    expectedBeyond: false,
    category: "基础",
    description: "基础循环",
  },
  {
    id: "basic-3",
    question: "if-else条件判断",
    examLevel: 1,
    expectedBeyond: false,
    category: "基础",
    description: "基础分支",
  },
];

// 获取测试用例统计
export function getTestCaseStats(): {
  total: number;
  byCategory: Record<string, number>;
} {
  const byCategory: Record<string, number> = {};
  
  for (const tc of testCases) {
    byCategory[tc.category] = (byCategory[tc.category] || 0) + 1;
  }
  
  return {
    total: testCases.length,
    byCategory,
  };
}

// 按类别获取测试用例
export function getTestCasesByCategory(category: string): TestCase[] {
  return testCases.filter(tc => tc.category === category);
}

// 按级别获取测试用例
export function getTestCasesByLevel(level: number): TestCase[] {
  return testCases.filter(tc => tc.examLevel === level);
}

// 关键测试用例（必须通过的）
export const criticalTestCases = [
  "base-1", // 三进制转换
  "base-2", // 三进制变体
  "bit-1",  // 位运算
  "array-1", // 数组
  "pointer-1", // 指针
];

// 验证测试结果
export interface TestResult {
  id: string;
  question: string;
  examLevel: number;
  expectedBeyond: boolean;
  actualBeyond: boolean;
  passed: boolean;
  confidence: number;
}

export function formatTestResults(results: TestResult[]): string {
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  let output = `\n测试完成: ${passed}/${results.length} 通过 (${(passed/results.length*100).toFixed(1)}%)\n`;
  output += "=".repeat(50) + "\n\n";
  
  if (failed > 0) {
    output += "失败的测试用例:\n";
    for (const r of results.filter(r => !r.passed)) {
      output += `  ❌ ${r.id}: ${r.question.slice(0, 30)}...\n`;
      output += `     期望: ${r.expectedBeyond ? "超纲" : "不超纲"}, 实际: ${r.actualBeyond ? "超纲" : "不超纲"}\n`;
    }
  }
  
  return output;
}
