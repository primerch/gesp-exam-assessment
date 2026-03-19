// GESP 考试规划数据 - 基于详细PPT分析
// 数据来源：
// - Level 1: 24课，127个知识点 (对应GESP 1-2级)
// - Level 2: 24课，算法进阶 (对应GESP 3-4级)
// - Level 3: 24课，DP与高级算法 (对应GESP 5-6级)
// - Level 4: 23课，竞赛准备 (对应GESP 7-8级)

export interface KnowledgePoint {
  id: string;
  name: string;
  category: string;
  gespLevel: number; // 1-8
  weight: number; // 重要性权重
  description: string;
  parentExplanation: string;
  examFocus: string;
}

export interface Lesson {
  lessonNum: number;
  title: string;
  knowledgePoints: string[]; // 知识点ID列表
  gespLevels: number[]; // 本课涉及的GESP等级
}

export interface TCTMLevel {
  id: number;
  name: string;
  description: string;
  totalLessons: number;
  targetGespLevels: number[];
  lessons: Lesson[];
}

// GESP 8个等级的信息
export const gespLevels = [
  { level: 1, name: "GESP 1级", description: "编程基础", duration: "120分钟", focus: "变量、输入输出、基本运算、分支循环" },
  { level: 2, name: "GESP 2级", description: "程序设计", duration: "120分钟", focus: "流程图、ASCII、类型转换、嵌套结构、数学函数" },
  { level: 3, name: "GESP 3级", description: "算法基础", duration: "120分钟", focus: "进制转换、位运算、数组、字符串、枚举模拟" },
  { level: 4, name: "GESP 4级", description: "数据结构", duration: "120分钟", focus: "函数、指针、结构体、二维数组、排序、文件" },
  { level: 5, name: "GESP 5级", description: "高级算法", duration: "180分钟", focus: "数论、高精度、链表、二分、递归、分治、贪心" },
  { level: 6, name: "GESP 6级", description: "搜索与DP", duration: "180分钟", focus: "树、DFS/BFS、简单DP、面向对象、栈队列" },
  { level: 7, name: "GESP 7级", description: "图论与DP", duration: "180分钟", focus: "数学库、复杂DP、图论、哈希表" },
  { level: 8, name: "GESP 8级", description: "综合应用", duration: "180分钟", focus: "排列组合、图论算法、算法优化" },
];

// 课程信息
export const courseInfo = {
  name: "五个奶爸少儿编程",
  levels: [
    { id: 1, name: "Level 1", description: "编程基础", totalLessons: 24, targetGesp: "1-2级" },
    { id: 2, name: "Level 2", description: "算法入门", totalLessons: 24, targetGesp: "3-4级" },
    { id: 3, name: "Level 3", description: "算法进阶", totalLessons: 24, targetGesp: "5-6级" },
    { id: 4, name: "Level 4", description: "竞赛准备", totalLessons: 23, targetGesp: "7-8级" },
  ]
};

// 从详细分析中提取的知识点数据库
// Level 1: L1基础 (GESP 1级) + L1进阶 (GESP 2级)
// Level 2: L2前半 (GESP 3级) + L2后半 (GESP 4级)
// Level 3: L3前半 (GESP 5级) + L3后半 (GESP 6级)
// Level 4: L4前半 (GESP 7级) + L4后半 (GESP 8级)

export const gespKnowledgePoints: Record<number, KnowledgePoint[]> = {
  1: [
    { id: "l1_1", name: "计算机基础知识", category: "基础", gespLevel: 1, weight: 0.8, description: "计算机软硬件组成、操作系统基本概念", parentExplanation: "了解计算机的基本组成，就像认识房子的结构", examFocus: "选择题为主" },
    { id: "l1_2", name: "C++程序框架", category: "语法", gespLevel: 1, weight: 1.0, description: "#include、using namespace、main函数、return 0", parentExplanation: "学习C++程序的固定格式，像写信的信封格式", examFocus: "填空题、判断题" },
    { id: "l1_3", name: "输入输出语句", category: "语法", gespLevel: 1, weight: 1.0, description: "cin/cout、scanf/printf的使用", parentExplanation: "学会让程序接收输入和显示输出", examFocus: "编程题必考" },
    { id: "l1_4", name: "变量定义与使用", category: "语法", gespLevel: 1, weight: 1.0, description: "变量命名规则、定义、初始化、赋值", parentExplanation: "变量就像贴标签的盒子，用来存数据", examFocus: "选择题、编程题" },
    { id: "l1_5", name: "基本数据类型", category: "语法", gespLevel: 1, weight: 1.0, description: "int、long long、float、double、char、bool", parentExplanation: "不同类型的数据需要不同类型的盒子来存", examFocus: "选择题、填空题" },
    { id: "l1_6", name: "算术运算", category: "运算", gespLevel: 1, weight: 1.0, description: "加减乘除、整除、取余运算", parentExplanation: "数学运算在编程中的实现", examFocus: "计算题、编程题" },
    { id: "l1_7", name: "逻辑运算", category: "运算", gespLevel: 1, weight: 1.0, description: "逻辑与&&、逻辑或||、逻辑非!", parentExplanation: "组合多个条件的判断方法", examFocus: "选择题、阅读程序" },
    { id: "l1_8", name: "关系运算", category: "运算", gespLevel: 1, weight: 0.8, description: "大于、小于、等于、不等于等比较", parentExplanation: "比较两个值的大小关系", examFocus: "选择题" },
    { id: "l1_9", name: "三目运算", category: "运算", gespLevel: 1, weight: 0.8, description: "条件?值1:值2的简洁写法", parentExplanation: "简化的条件判断写法", examFocus: "选择题、阅读程序" },
    { id: "l1_10", name: "顺序结构", category: "结构", gespLevel: 1, weight: 0.8, description: "程序按语句顺序执行", parentExplanation: "程序默认从上到下依次执行", examFocus: "编程题" },
    { id: "l1_11", name: "分支结构", category: "结构", gespLevel: 1, weight: 1.2, description: "if、if-else、switch语句", parentExplanation: "让程序根据不同条件走不同路径", examFocus: "编程题必考" },
    { id: "l1_12", name: "循环结构", category: "结构", gespLevel: 1, weight: 1.2, description: "for、while、do-while循环", parentExplanation: "重复执行代码的结构", examFocus: "编程题必考" },
    { id: "l1_13", name: "数组基础", category: "数据结构", gespLevel: 1, weight: 1.2, description: "一维数组定义、初始化、访问、遍历", parentExplanation: "存储多个相同类型数据的集合", examFocus: "编程题必考" },
    { id: "l1_14", name: "break和continue", category: "结构", gespLevel: 1, weight: 0.8, description: "跳出循环和跳过当前迭代", parentExplanation: "控制循环流程的特殊语句", examFocus: "选择题、阅读程序" },
  ],
  2: [
    { id: "l2_1", name: "计算机存储", category: "基础", gespLevel: 2, weight: 0.8, description: "ROM、RAM、Cache的功能及区别", parentExplanation: "了解计算机如何存储数据", examFocus: "选择题、判断题" },
    { id: "l2_2", name: "计算机网络基础", category: "基础", gespLevel: 2, weight: 0.8, description: "网络分类、TCP/IP模型、IP地址", parentExplanation: "了解计算机网络的基本概念", examFocus: "选择题、判断题" },
    { id: "l2_3", name: "流程图", category: "算法", gespLevel: 2, weight: 1.0, description: "流程图符号、绘制方法", parentExplanation: "用图形表示算法流程", examFocus: "选择题、填空题" },
    { id: "l2_4", name: "ASCII编码", category: "编码", gespLevel: 2, weight: 1.0, description: "字符与ASCII码的转换", parentExplanation: "计算机用数字表示字符的方法", examFocus: "选择题、填空题、编程题" },
    { id: "l2_5", name: "数据类型转换", category: "语法", gespLevel: 2, weight: 1.0, description: "强制类型转换和隐式类型转换", parentExplanation: "不同类型数据之间的转换", examFocus: "选择题、填空题、编程题" },
    { id: "l2_6", name: "多层分支结构", category: "结构", gespLevel: 2, weight: 1.2, description: "if嵌套、switch嵌套", parentExplanation: "复杂的条件判断结构", examFocus: "选择题、编程题" },
    { id: "l2_7", name: "多层循环结构", category: "结构", gespLevel: 2, weight: 1.5, description: "循环嵌套、循环与分支嵌套", parentExplanation: "循环里面再套循环", examFocus: "编程题必考" },
    { id: "l2_8", name: "数学函数", category: "函数", gespLevel: 2, weight: 0.8, description: "abs、sqrt、max、min、rand、srand", parentExplanation: "C++提供的数学计算函数", examFocus: "选择题、填空题、编程题" },
    { id: "l2_9", name: "while和do-while", category: "结构", gespLevel: 2, weight: 1.0, description: "条件循环的使用", parentExplanation: "不确定次数的循环", examFocus: "选择题、编程题" },
    { id: "l2_10", name: "数组进阶", category: "数据结构", gespLevel: 2, weight: 1.2, description: "数组求最值、查找、统计、累加", parentExplanation: "数组的常见操作算法", examFocus: "编程题必考" },
    { id: "l2_11", name: "字符数组与字符串", category: "数据结构", gespLevel: 2, weight: 1.2, description: "char数组存储字符串、字符串操作", parentExplanation: "处理文本数据的方法", examFocus: "选择题、编程题" },
    { id: "l2_12", name: "string类型", category: "数据结构", gespLevel: 2, weight: 1.2, description: "string类的使用、getline函数", parentExplanation: "C++提供的字符串类型，比字符数组更方便", examFocus: "选择题、编程题" },
  ],
  3: [
    { id: "l3_1", name: "数据编码", category: "编码", gespLevel: 3, weight: 1.0, description: "原码、反码、补码的概念", parentExplanation: "计算机存储负数的原理", examFocus: "选择题、填空题" },
    { id: "l3_2", name: "进制转换", category: "算法", gespLevel: 3, weight: 1.2, description: "二进制、八进制、十进制、十六进制互转", parentExplanation: "不同进制数字系统间的转换", examFocus: "选择题、填空题、编程题" },
    { id: "l3_3", name: "位运算", category: "运算", gespLevel: 3, weight: 1.0, description: "与&、或|、非~、异或^、移位<<>>", parentExplanation: "直接操作二进制位的运算", examFocus: "选择题、填空题、编程题" },
    { id: "l3_4", name: "算法描述", category: "算法", gespLevel: 3, weight: 0.8, description: "自然语言、流程图、伪代码", parentExplanation: "用不同方式描述解题思路", examFocus: "选择题、填空题" },
    { id: "l3_5", name: "枚举算法", category: "算法", gespLevel: 3, weight: 1.5, description: "穷举所有可能解逐一验证", parentExplanation: "用'笨办法'解决复杂问题", examFocus: "编程题必考" },
    { id: "l3_6", name: "模拟算法", category: "算法", gespLevel: 3, weight: 1.5, description: "按题目描述的过程一步步模拟", parentExplanation: "按照题目要求一步步执行", examFocus: "编程题必考" },
    { id: "l3_7", name: "递推算法", category: "算法", gespLevel: 3, weight: 1.5, description: "从已知条件出发推导结果", parentExplanation: "像多米诺骨牌一样推导", examFocus: "编程题" },
    { id: "l3_8", name: "函数基础", category: "函数", gespLevel: 3, weight: 1.2, description: "函数定义、调用、参数、返回值", parentExplanation: "把代码打包成可重复使用的工具", examFocus: "编程题" },
  ],
  4: [
    { id: "l4_1", name: "指针基础", category: "指针", gespLevel: 4, weight: 1.5, description: "指针概念、定义、赋值、解引用", parentExplanation: "存储内存地址的变量", examFocus: "选择题、填空题、编程题" },
    { id: "l4_2", name: "二维数组", category: "数据结构", gespLevel: 4, weight: 1.5, description: "二维及多维数组的定义和使用", parentExplanation: "表格形式的数据存储", examFocus: "选择题、填空题、编程题" },
    { id: "l4_3", name: "结构体", category: "数据结构", gespLevel: 4, weight: 1.5, description: "struct定义、结构体数组、结构体指针", parentExplanation: "把不同类型的数据打包在一起", examFocus: "选择题、填空题、编程题" },
    { id: "l4_4", name: "函数进阶", category: "函数", gespLevel: 4, weight: 1.5, description: "函数声明、形参实参、值传递、引用传递", parentExplanation: "函数的深入理解和应用", examFocus: "选择题、填空题、编程题" },
    { id: "l4_5", name: "变量作用域", category: "函数", gespLevel: 4, weight: 1.0, description: "全局变量与局部变量", parentExplanation: "变量可以使用的范围", examFocus: "选择题、阅读程序" },
    { id: "l4_6", name: "排序算法", category: "算法", gespLevel: 4, weight: 1.2, description: "冒泡、选择、插入排序", parentExplanation: "将数据按顺序排列的算法", examFocus: "选择题、填空题、编程题" },
    { id: "l4_7", name: "算法复杂度", category: "算法", gespLevel: 4, weight: 1.0, description: "时间复杂度、空间复杂度估算", parentExplanation: "衡量算法效率的标准", examFocus: "选择题、填空题" },
    { id: "l4_8", name: "文件操作", category: "文件", gespLevel: 4, weight: 1.2, description: "文件读写、重定向", parentExplanation: "程序与文件的交互", examFocus: "选择题、填空题、编程题" },
    { id: "l4_9", name: "高精度运算", category: "算法", gespLevel: 4, weight: 2.0, description: "大整数的加减乘除", parentExplanation: "处理超出普通类型范围的大数字", examFocus: "编程题" },
    { id: "l4_10", name: "栈和队列", category: "数据结构", gespLevel: 4, weight: 1.5, description: "LIFO和FIFO的线性结构", parentExplanation: "两种特殊的线性数据结构", examFocus: "选择题、编程题" },
    { id: "l4_11", name: "链表", category: "数据结构", gespLevel: 4, weight: 2.0, description: "单链表、双链表的基本操作", parentExplanation: "用指针连接的动态数据结构", examFocus: "选择题、填空题、编程题" },
    { id: "l4_12", name: "递归算法", category: "算法", gespLevel: 4, weight: 2.0, description: "函数自己调用自己的思想", parentExplanation: "把大问题分解成小问题", examFocus: "编程题" },
    { id: "l4_13", name: "二分查找", category: "算法", gespLevel: 4, weight: 1.8, description: "在有序序列中快速查找", parentExplanation: "每次排除一半的查找方法", examFocus: "编程题" },
    { id: "l4_14", name: "贪心算法", category: "算法", gespLevel: 4, weight: 1.8, description: "局部最优推导全局最优", parentExplanation: "每次选最好的，期望整体最好", examFocus: "编程题" },
  ],
  5: [
    { id: "l5_1", name: "初等数论", category: "数学", gespLevel: 5, weight: 1.5, description: "素数、GCD、LCM、同余、质因数分解", parentExplanation: "编程中常用的数学知识", examFocus: "选择题、填空题、编程题" },
    { id: "l5_2", name: "素数筛法", category: "数学", gespLevel: 5, weight: 1.8, description: "埃氏筛、线性筛", parentExplanation: "高效找出范围内的所有素数", examFocus: "编程题" },
    { id: "l5_3", name: "分治算法", category: "算法", gespLevel: 5, weight: 2.0, description: "归并排序、快速排序", parentExplanation: "分而治之的算法思想", examFocus: "编程题" },
    { id: "l5_4", name: "深度优先搜索", category: "搜索", gespLevel: 5, weight: 2.0, description: "DFS递归实现、标记数组", parentExplanation: "一条路走到底，不通就回头", examFocus: "编程题必考" },
    { id: "l5_5", name: "广度优先搜索", category: "搜索", gespLevel: 5, weight: 2.0, description: "BFS队列实现、最短路径", parentExplanation: "一圈一圈向外搜索", examFocus: "编程题必考" },
    { id: "l5_6", name: "动态规划基础", category: "DP", gespLevel: 5, weight: 2.0, description: "DP思想、记忆化搜索、递推实现", parentExplanation: "记住已算过的答案，避免重复", examFocus: "编程题必考" },
    { id: "l5_7", name: "简单背包问题", category: "DP", gespLevel: 5, weight: 2.2, description: "01背包、完全背包", parentExplanation: "经典的动态规划问题", examFocus: "编程题" },
    { id: "l5_8", name: "树的基本概念", category: "数据结构", gespLevel: 5, weight: 1.5, description: "树的定义、术语、遍历", parentExplanation: "层次结构的数据组织", examFocus: "选择题、填空题、编程题" },
    { id: "l5_9", name: "二叉树", category: "数据结构", gespLevel: 5, weight: 1.5, description: "二叉树的性质和遍历", parentExplanation: "每个节点最多两个子节点的树", examFocus: "选择题、编程题" },
    { id: "l5_10", name: "完全二叉树", category: "数据结构", gespLevel: 5, weight: 1.5, description: "完全二叉树的性质", parentExplanation: "特殊的二叉树结构", examFocus: "选择题" },
    { id: "l5_11", name: "二叉排序树", category: "数据结构", gespLevel: 5, weight: 1.8, description: "BST的定义和操作", parentExplanation: "有序的二叉树", examFocus: "选择题、编程题" },
    { id: "l5_12", name: "图的定义与存储", category: "图论", gespLevel: 5, weight: 1.5, description: "图的种类、邻接矩阵、邻接表", parentExplanation: "网络结构的数学抽象", examFocus: "选择题、编程题" },
  ],
  6: [
    { id: "l6_1", name: "哈夫曼树", category: "数据结构", gespLevel: 6, weight: 1.8, description: "带权路径长度最小的二叉树", parentExplanation: "最优编码树", examFocus: "选择题、编程题" },
    { id: "l6_2", name: "哈夫曼编码", category: "编码", gespLevel: 6, weight: 1.5, description: "数据压缩的编码方法", parentExplanation: "用最短的编码表示常用字符", examFocus: "选择题、填空题" },
    { id: "l6_3", name: "格雷编码", category: "编码", gespLevel: 6, weight: 1.5, description: "相邻编码只有一位不同", parentExplanation: "特殊的二进制编码", examFocus: "选择题" },
    { id: "l6_4", name: "搜索综合应用", category: "搜索", gespLevel: 6, weight: 2.0, description: "DFS/BFS综合题", parentExplanation: "搜索算法的综合应用", examFocus: "编程题" },
    { id: "l6_5", name: "二维动态规划", category: "DP", gespLevel: 6, weight: 2.2, description: "二维状态的DP问题", parentExplanation: "状态用表格表示的动态规划", examFocus: "编程题" },
    { id: "l6_6", name: "DP最值优化", category: "DP", gespLevel: 6, weight: 2.5, description: "LIS、LCS、区间DP", parentExplanation: "求最长子序列等优化问题", examFocus: "编程题" },
    { id: "l6_7", name: "滚动数组优化", category: "DP", gespLevel: 6, weight: 2.0, description: "空间复杂度优化技巧", parentExplanation: "用更少内存实现DP", examFocus: "编程题" },
    { id: "l6_8", name: "图的遍历", category: "图论", gespLevel: 6, weight: 2.0, description: "DFS/BFS遍历图", parentExplanation: "访问图中所有节点的方法", examFocus: "编程题" },
    { id: "l6_9", name: "二叉树搜索", category: "搜索", gespLevel: 6, weight: 1.8, description: "二叉树的各种搜索算法", parentExplanation: "在二叉树上进行搜索", examFocus: "编程题" },
    { id: "l6_10", name: "面向对象", category: "OOP", gespLevel: 6, weight: 1.5, description: "类、封装、继承、多态", parentExplanation: "用对象组织代码的思想", examFocus: "选择题、编程题" },
  ],
  7: [
    { id: "l7_1", name: "数学库函数", category: "数学", gespLevel: 7, weight: 1.0, description: "sin、cos、log、exp等函数", parentExplanation: "高级数学计算函数", examFocus: "选择题、编程题" },
    { id: "l7_2", name: "图的DFS遍历", category: "图论", gespLevel: 7, weight: 2.0, description: "深度优先遍历图", parentExplanation: "用DFS访问图的所有节点", examFocus: "编程题" },
    { id: "l7_3", name: "图的BFS遍历", category: "图论", gespLevel: 7, weight: 2.0, description: "广度优先遍历图", parentExplanation: "用BFS访问图的所有节点", examFocus: "编程题" },
    { id: "l7_4", name: "泛洪算法", category: "图论", gespLevel: 7, weight: 1.8, description: "flood fill算法的应用", parentExplanation: "填充连通区域的算法", examFocus: "编程题" },
    { id: "l7_5", name: "哈希表", category: "数据结构", gespLevel: 7, weight: 1.8, description: "哈希表的概念和应用", parentExplanation: "快速查找的数据结构", examFocus: "选择题、编程题" },
    { id: "l7_6", name: "计数原理", category: "数学", gespLevel: 7, weight: 1.5, description: "加法原理、乘法原理", parentExplanation: "组合数学基础", examFocus: "选择题、填空题" },
    { id: "l7_7", name: "排列数计算", category: "数学", gespLevel: 7, weight: 1.8, description: "排列数的计算和编程实现", parentExplanation: "有序选择的方法数", examFocus: "编程题" },
    { id: "l7_8", name: "组合数计算", category: "数学", gespLevel: 7, weight: 1.8, description: "组合数的计算和编程实现", parentExplanation: "无序选择的方法数", examFocus: "编程题" },
    { id: "l7_9", name: "杨辉三角", category: "数学", gespLevel: 7, weight: 1.5, description: "杨辉三角与组合数的关系", parentExplanation: "组合数的表格表示", examFocus: "编程题" },
  ],
  8: [
    { id: "l8_1", name: "倍增法", category: "算法", gespLevel: 8, weight: 2.0, description: "倍增法的原理和应用", parentExplanation: "以2的幂次跳跃的算法", examFocus: "编程题" },
    { id: "l8_2", name: "最小生成树", category: "图论", gespLevel: 8, weight: 2.5, description: "Kruskal、Prim算法", parentExplanation: "连接所有节点的最小代价", examFocus: "编程题" },
    { id: "l8_3", name: "最短路径", category: "图论", gespLevel: 8, weight: 2.5, description: "Dijkstra、Floyd算法", parentExplanation: "图中两点间的最短路径", examFocus: "编程题" },
    { id: "l8_4", name: "图论综合应用", category: "图论", gespLevel: 8, weight: 2.2, description: "图论算法的综合应用", parentExplanation: "多种图论算法的组合使用", examFocus: "编程题" },
    { id: "l8_5", name: "算法复杂度分析", category: "算法", gespLevel: 8, weight: 1.8, description: "复杂算法的时间和空间分析", parentExplanation: "深入分析算法效率", examFocus: "选择题、填空题" },
    { id: "l8_6", name: "算法优化", category: "算法", gespLevel: 8, weight: 2.0, description: "常用算法优化技巧", parentExplanation: "提高算法效率的方法", examFocus: "编程题" },
    { id: "l8_7", name: "区间动态规划", category: "DP", gespLevel: 8, weight: 2.0, description: "以区间为状态的DP", parentExplanation: "处理区间合并等问题", examFocus: "编程题" },
    { id: "l8_8", name: "搜索剪枝", category: "搜索", gespLevel: 8, weight: 2.0, description: "优化搜索的剪枝技巧", parentExplanation: "剪掉不必要的搜索分支", examFocus: "编程题" },
  ],
};

// 课程进度到知识点的映射
// 基于详细PPT分析，每个lesson覆盖的知识点
// Level 1: GESP 1-2级全覆盖 (24课)
// 前11课覆盖GESP 1级核心知识点，后13课覆盖GESP 2级
const level1Progression: Record<number, string[]> = {
  1: ["l1_2", "l1_3", "l1_4", "l1_5"], // 变量和输入输出
  2: ["l1_5", "l1_6", "l1_8"], // 算数运算符和字符型
  3: ["l1_8", "l1_11"], // 比较运算符和if语句
  4: ["l1_7", "l1_11"], // 逻辑运算符和多分支
  5: ["l1_1", "l1_2", "l1_3", "l1_4", "l1_5", "l1_6", "l1_7", "l1_8", "l1_11"], // 阶段复习1
  6: ["l1_12"], // for循环
  7: ["l1_12", "l1_14"], // for循环进阶
  8: ["l1_13"], // 数组
  9: ["l1_13"], // 数组进阶
  10: ["l1_12", "l1_13", "l1_14"], // 阶段复习2
  11: ["l2_9"], // while循环
  12: ["l1_5", "l2_8"], // 浮点数和格式化
  13: ["l1_5", "l2_5"], // 数据类型转换
  14: ["l2_11"], // 字符串和字符数组
  15: ["l2_12"], // string类型
  16: ["l2_9", "l2_11", "l2_12"], // 阶段复习3 (GESP 2级)
  17: ["l3_8", "l2_8"], // 函数基础+数学函数
  18: ["l3_8", "l2_8"], // 函数进阶
  19: ["l4_3"], // 结构体
  20: ["l2_7"], // 循环嵌套
  21: ["l3_5"], // 桶排序
  22: ["l3_6"], // 模拟算法
  23: ["l2_1", "l2_2", "l2_3", "l2_4"], // 计算机基础+流程图+ASCII (GESP 2级理论)
  // 第24课：Level 1期末复习，包含GESP 1-2级所有知识点
  24: ["l1_1", "l1_2", "l1_3", "l1_4", "l1_5", "l1_6", "l1_7", "l1_8", "l1_9", "l1_10", "l1_11", "l1_12", "l1_13", "l1_14", "l2_1", "l2_2", "l2_3", "l2_4", "l2_5", "l2_6", "l2_7", "l2_8", "l2_9", "l2_10", "l2_11", "l2_12", "l3_5", "l3_6", "l3_8", "l4_3"],
};

// Level 2: GESP 3-4级全覆盖 (24课)
const level2Progression: Record<number, string[]> = {
  1: ["l3_5"], // 枚举算法
  2: ["l3_7"], // 递推算法
  3: ["l4_7"], // 前缀和与差分
  4: ["l4_11"], // 二分算法
  5: ["l4_11"], // 贪心算法
  6: ["l3_5", "l3_7", "l4_7", "l4_11"], // 阶段复习1
  7: ["l4_9"], // 高精度加法
  8: ["l4_9"], // 高精度减法
  9: ["l4_9"], // 高精度乘法
  10: ["l4_10"], // 栈
  11: ["l4_10"], // 队列
  12: ["l4_8"], // STL入门
  13: ["l4_1"], // 指针
  14: ["l4_1", "l4_10"], // 链表
  15: ["l4_12"], // 递归
  16: ["l5_4"], // DFS1
  17: ["l5_4"], // DFS2
  18: ["l5_5"], // BFS1
  19: ["l5_8", "l5_9"], // 树与二叉树
  20: ["l5_12"], // 图的基本概念
  21: ["l5_12"], // 图的存储
  22: ["l5_5"], // BFS应用
  23: ["l3_2", "l3_3"], // 位运算与进制转换 (GESP 3级)
  // 第24课：Level 2期末复习，包含GESP 3-4级所有知识点
  24: ["l3_1", "l3_2", "l3_3", "l3_4", "l3_5", "l3_6", "l3_7", "l3_8", "l4_1", "l4_2", "l4_3", "l4_4", "l4_5", "l4_6", "l4_7", "l4_8", "l4_9", "l4_10", "l4_11", "l4_12", "l4_13", "l4_14", "l5_4", "l5_5", "l5_8", "l5_9", "l5_12"],
};

// Level 3: GESP 5-6级全覆盖 (24课)
const level3Progression: Record<number, string[]> = {
  1: ["l3_2", "l3_3"], // 数制转换与位运算
  2: ["l3_5"], // 枚举进阶
  3: ["l3_7"], // 递推进阶
  4: ["l4_11"], // 二分进阶
  5: ["l4_11"], // 贪心进阶
  6: ["l3_2", "l3_3", "l3_5", "l3_7", "l4_11"], // 阶段复习
  7: ["l4_12"], // 递归进阶
  8: ["l5_3"], // 快速排序
  9: ["l5_3"], // 归并排序
  10: ["l4_10"], // 栈进阶
  11: ["l4_10"], // 队列进阶
  12: ["l5_3", "l4_10"], // 阶段复习
  13: ["l4_10"], // 链表进阶
  14: ["l5_9"], // 二叉树应用
  15: ["l5_1", "l5_9"], // 二叉树进阶+数论
  16: ["l5_4"], // 深搜进阶
  17: ["l5_5"], // 广搜进阶
  18: ["l5_4", "l5_5"], // 阶段复习
  19: ["l5_6"], // 动态规划基础
  20: ["l6_6"], // 子序列问题
  21: ["l5_6", "l5_7"], // 背包问题
  22: ["l5_7", "l6_7"], // 背包进阶
  23: ["l5_12", "l6_8"], // 图的基本应用
  // 第24课：Level 3期末复习，包含GESP 5-6级所有知识点
  24: ["l5_1", "l5_2", "l5_3", "l5_4", "l5_5", "l5_6", "l5_7", "l5_8", "l5_9", "l5_10", "l5_11", "l5_12", "l6_1", "l6_2", "l6_3", "l6_4", "l6_5", "l6_6", "l6_7", "l6_8", "l6_9", "l6_10"],
};

// Level 4: GESP 7-8级全覆盖 (23课)
const level4Progression: Record<number, string[]> = {
  1: ["l7_6", "l7_7", "l7_8", "l7_9"], // 排列组合1
  2: ["l7_6", "l7_7", "l7_8", "l7_9"], // 排列组合2
  3: ["l5_2", "l5_1"], // 质数筛法+数论
  4: ["l8_7"], // 区间DP1
  5: ["l8_7"], // 区间DP2
  6: ["l7_6", "l7_7", "l7_8", "l5_2", "l8_7"], // 阶段测试
  7: ["l4_8"], // 参赛相关
  8: ["l3_5"], // 枚举算法应用
  9: ["l4_11"], // 贪心算法应用
  10: ["l4_9", "l3_6"], // 模拟算法应用
  11: ["l5_4", "l5_5", "l8_8"], // 搜索算法应用
  12: ["l5_4", "l5_5", "l7_2", "l7_3", "l7_4", "l8_2", "l8_3"], // 复赛模拟
  13: ["l2_1", "l2_2", "l3_2"], // 计算机基础知识
  14: ["l1_13", "l4_2", "l4_10", "l5_8"], // 数据结构1
  15: ["l5_9", "l6_1", "l5_12"], // 数据结构2
  16: ["l5_1", "l3_2"], // 数学专题1
  17: ["l3_3", "l7_1"], // 数学专题2
  18: ["l2_11", "l2_12"], // 字符串专题
  19: ["l4_11"], // 二分算法专题
  20: ["l4_6", "l5_3"], // 排序专题
  21: ["l4_12"], // 递归专题
  22: ["l5_6", "l6_6"], // 动态规划
  23: ["l7_2", "l7_3", "l7_4", "l7_5", "l7_6", "l7_7", "l7_8", "l7_9", "l8_1", "l8_2", "l8_3", "l8_4", "l8_5", "l8_6", "l8_7", "l8_8"], // 初赛模拟
};

// 合并所有级别的进度
export const tctmProgression: Record<number, Record<number, string[]>> = {
  1: level1Progression,
  2: level2Progression,
  3: level3Progression,
  4: level4Progression,
};

// 获取到指定课程为止的所有已学知识点
export function getMasteredKnowledge(currentLevel: number, currentLesson: number): Set<string> {
  const mastered = new Set<string>();
  
  // 添加前面完整级别的所有知识点
  for (let level = 1; level < currentLevel; level++) {
    const levelData = tctmProgression[level];
    const totalLessons = courseInfo.levels.find(l => l.id === level)?.totalLessons || 0;
    for (let lesson = 1; lesson <= totalLessons; lesson++) {
      const points = levelData[lesson] || [];
      points.forEach(p => mastered.add(p));
    }
  }
  
  // 添加当前级别到当前课程的所有知识点
  const currentLevelData = tctmProgression[currentLevel];
  for (let lesson = 1; lesson <= currentLesson; lesson++) {
    const points = currentLevelData[lesson] || [];
    points.forEach(p => mastered.add(p));
  }
  
  return mastered;
}

// 计算每个GESP等级的通过率
export function calculatePassProbability(currentLevel: number, currentLesson: number): Record<number, number> {
  const mastered = getMasteredKnowledge(currentLevel, currentLesson);
  const probabilities: Record<number, number> = {};
  
  for (let gespLevel = 1; gespLevel <= 8; gespLevel++) {
    const points = gespKnowledgePoints[gespLevel];
    if (!points || points.length === 0) {
      probabilities[gespLevel] = 0;
      continue;
    }
    
    let totalWeight = 0;
    let masteredWeight = 0;
    
    for (const point of points) {
      totalWeight += point.weight;
      if (mastered.has(point.id)) {
        masteredWeight += point.weight;
      }
    }
    
    // 基础概率 = 已掌握权重 / 总权重
    const baseProbability = totalWeight > 0 ? masteredWeight / totalWeight : 0;
    
    // 根据掌握程度调整概率
    // 如果掌握超过90%，通过概率很高
    // 如果掌握50-90%，通过概率中等
    // 如果掌握低于50%，通过概率较低
    let adjustedProbability: number;
    if (baseProbability >= 0.9) {
      adjustedProbability = 0.95 + (baseProbability - 0.9) * 0.5; // 95%-100%
    } else if (baseProbability >= 0.7) {
      adjustedProbability = 0.75 + (baseProbability - 0.7) * 1.0; // 75%-95%
    } else if (baseProbability >= 0.5) {
      adjustedProbability = 0.50 + (baseProbability - 0.5) * 1.25; // 50%-75%
    } else if (baseProbability >= 0.3) {
      adjustedProbability = 0.25 + (baseProbability - 0.3) * 1.25; // 25%-50%
    } else {
      adjustedProbability = baseProbability * 0.8; // 0%-25%
    }
    
    probabilities[gespLevel] = Math.round(adjustedProbability * 100);
  }
  
  return probabilities;
}

// 获取已掌握的知识点详情
export function getMasteredKnowledgeDetails(currentLevel: number, currentLesson: number): KnowledgePoint[] {
  const mastered = getMasteredKnowledge(currentLevel, currentLesson);
  const details: KnowledgePoint[] = [];
  
  for (let gespLevel = 1; gespLevel <= 8; gespLevel++) {
    const points = gespKnowledgePoints[gespLevel] || [];
    for (const point of points) {
      if (mastered.has(point.id)) {
        details.push(point);
      }
    }
  }
  
  return details;
}

// 获取未掌握的知识点详情
export function getRemainingKnowledge(currentLevel: number, currentLesson: number): KnowledgePoint[] {
  const mastered = getMasteredKnowledge(currentLevel, currentLesson);
  const details: KnowledgePoint[] = [];
  
  for (let gespLevel = 1; gespLevel <= 8; gespLevel++) {
    const points = gespKnowledgePoints[gespLevel] || [];
    for (const point of points) {
      if (!mastered.has(point.id)) {
        details.push(point);
      }
    }
  }
  
  return details;
}

// 按类别分组知识点
export function groupKnowledgeByCategory(points: KnowledgePoint[]): Record<string, KnowledgePoint[]> {
  const grouped: Record<string, KnowledgePoint[]> = {};
  
  for (const point of points) {
    if (!grouped[point.category]) {
      grouped[point.category] = [];
    }
    grouped[point.category].push(point);
  }
  
  return grouped;
}

// 获取推荐考试等级
export function getRecommendedExam(currentLevel: number, currentLesson: number): { level: number; probability: number } | null {
  const probabilities = calculatePassProbability(currentLevel, currentLesson);
  
  // 找到通过概率在70%-95%之间的最高等级
  let recommended: { level: number; probability: number } | null = null;
  
  for (let gespLevel = 8; gespLevel >= 1; gespLevel--) {
    const prob = probabilities[gespLevel];
    if (prob >= 70 && prob <= 95) {
      recommended = { level: gespLevel, probability: prob };
      break;
    }
  }
  
  // 如果没有找到合适的，找通过概率最高的
  if (!recommended) {
    let maxProb = 0;
    let maxLevel = 1;
    for (let gespLevel = 1; gespLevel <= 8; gespLevel++) {
      if (probabilities[gespLevel] > maxProb) {
        maxProb = probabilities[gespLevel];
        maxLevel = gespLevel;
      }
    }
    recommended = { level: maxLevel, probability: maxProb };
  }
  
  return recommended;
}
