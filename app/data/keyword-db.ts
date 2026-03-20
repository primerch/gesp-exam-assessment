// GESP 关键词数据库
// 用于规则引擎匹配知识点

export interface KeywordInfo {
  keyword: string;
  gespLevel: number;
  category: string;
  synonyms?: string[];
}

// GESP 1-8 级关键词库
export const gespKeywords: KeywordInfo[] = [
  // ==================== GESP 1级 ====================
  // 基础概念
  { keyword: "变量", gespLevel: 1, category: "基础" },
  { keyword: "常量", gespLevel: 1, category: "基础" },
  { keyword: "标识符", gespLevel: 1, category: "基础" },
  { keyword: "关键字", gespLevel: 1, category: "基础" },
  { keyword: "表达式", gespLevel: 1, category: "基础" },
  { keyword: "注释", gespLevel: 1, category: "基础" },
  
  // 数据类型
  { keyword: "int", gespLevel: 1, category: "数据类型", synonyms: ["整数", "整型"] },
  { keyword: "char", gespLevel: 1, category: "数据类型", synonyms: ["字符", "字符型"] },
  { keyword: "double", gespLevel: 1, category: "数据类型" },
  { keyword: "float", gespLevel: 1, category: "数据类型", synonyms: ["浮点数"] },
  { keyword: "bool", gespLevel: 1, category: "数据类型", synonyms: ["布尔"] },
  { keyword: "long long", gespLevel: 1, category: "数据类型" },
  
  // 输入输出
  { keyword: "cin", gespLevel: 1, category: "IO" },
  { keyword: "cout", gespLevel: 1, category: "IO" },
  { keyword: "scanf", gespLevel: 1, category: "IO" },
  { keyword: "printf", gespLevel: 1, category: "IO" },
  
  // 运算
  { keyword: "算术运算", gespLevel: 1, category: "运算" },
  { keyword: "逻辑运算", gespLevel: 1, category: "运算" },
  { keyword: "关系运算", gespLevel: 1, category: "运算", synonyms: ["比较"] },
  { keyword: "自增", gespLevel: 1, category: "运算", synonyms: ["++"] },
  { keyword: "自减", gespLevel: 1, category: "运算", synonyms: ["--"] },
  { keyword: "三目运算", gespLevel: 1, category: "运算", synonyms: ["?:", "条件运算符"] },
  
  // 分支结构
  { keyword: "if", gespLevel: 1, category: "分支" },
  { keyword: "else", gespLevel: 1, category: "分支" },
  { keyword: "switch", gespLevel: 1, category: "分支" },
  { keyword: "case", gespLevel: 1, category: "分支" },
  
  // 循环结构
  { keyword: "for", gespLevel: 1, category: "循环" },
  { keyword: "while", gespLevel: 1, category: "循环" },
  { keyword: "do", gespLevel: 1, category: "循环" },
  { keyword: "break", gespLevel: 1, category: "循环控制" },
  { keyword: "continue", gespLevel: 1, category: "循环控制" },
  
  // ==================== GESP 2级 ====================
  // 计算机基础
  { keyword: "ROM", gespLevel: 2, category: "计算机基础" },
  { keyword: "RAM", gespLevel: 2, category: "计算机基础" },
  { keyword: "CACHE", gespLevel: 2, category: "计算机基础", synonyms: ["缓存"] },
  { keyword: "TCP/IP", gespLevel: 2, category: "网络" },
  { keyword: "OSI", gespLevel: 2, category: "网络" },
  { keyword: "IP地址", gespLevel: 2, category: "网络" },
  
  // 流程图
  { keyword: "流程图", gespLevel: 2, category: "流程图" },
  
  // ASCII
  { keyword: "ASCII", gespLevel: 2, category: "编码", synonyms: ["ASCII码"] },
  
  // 类型转换
  { keyword: "类型转换", gespLevel: 2, category: "类型转换" },
  { keyword: "强制转换", gespLevel: 2, category: "类型转换" },
  { keyword: "隐式转换", gespLevel: 2, category: "类型转换" },
  
  // 嵌套结构
  { keyword: "嵌套", gespLevel: 2, category: "结构" },
  { keyword: "多层分支", gespLevel: 2, category: "结构" },
  { keyword: "多层循环", gespLevel: 2, category: "结构" },
  
  // 数学函数
  { keyword: "abs", gespLevel: 2, category: "数学函数", synonyms: ["绝对值"] },
  { keyword: "sqrt", gespLevel: 2, category: "数学函数", synonyms: ["平方根", "开方"] },
  { keyword: "max", gespLevel: 2, category: "数学函数", synonyms: ["最大值"] },
  { keyword: "min", gespLevel: 2, category: "数学函数", synonyms: ["最小值"] },
  { keyword: "rand", gespLevel: 2, category: "数学函数", synonyms: ["随机数"] },
  { keyword: "srand", gespLevel: 2, category: "数学函数" },
  
  // ==================== GESP 3级 ====================
  // 数据编码
  { keyword: "原码", gespLevel: 3, category: "数据编码" },
  { keyword: "反码", gespLevel: 3, category: "数据编码" },
  { keyword: "补码", gespLevel: 3, category: "数据编码" },
  { keyword: "数据编码", gespLevel: 3, category: "数据编码" },
  
  // 进制转换（关键！包含所有进制）
  { keyword: "进制", gespLevel: 3, category: "进制转换" },
  { keyword: "进制转换", gespLevel: 3, category: "进制转换" },
  { keyword: "二进制", gespLevel: 3, category: "进制转换", synonyms: ["2进制"] },
  { keyword: "八进制", gespLevel: 3, category: "进制转换", synonyms: ["8进制"] },
  { keyword: "十进制", gespLevel: 3, category: "进制转换", synonyms: ["10进制"] },
  { keyword: "十六进制", gespLevel: 3, category: "进制转换", synonyms: ["16进制", "HEX"] },
  { keyword: "三进制", gespLevel: 3, category: "进制转换", synonyms: ["3进制"] },
  { keyword: "四进制", gespLevel: 3, category: "进制转换", synonyms: ["4进制"] },
  { keyword: "五进制", gespLevel: 3, category: "进制转换", synonyms: ["5进制"] },
  { keyword: "六进制", gespLevel: 3, category: "进制转换", synonyms: ["6进制"] },
  { keyword: "七进制", gespLevel: 3, category: "进制转换", synonyms: ["7进制"] },
  { keyword: "九进制", gespLevel: 3, category: "进制转换", synonyms: ["9进制"] },
  
  // 位运算
  { keyword: "位运算", gespLevel: 3, category: "位运算" },
  { keyword: "与", gespLevel: 3, category: "位运算", synonyms: ["&", "按位与"] },
  { keyword: "或", gespLevel: 3, category: "位运算", synonyms: ["|", "按位或"] },
  { keyword: "非", gespLevel: 3, category: "位运算", synonyms: ["~", "按位非", "取反"] },
  { keyword: "异或", gespLevel: 3, category: "位运算", synonyms: ["^", "xor", "XOR"] },
  { keyword: "左移", gespLevel: 3, category: "位运算", synonyms: ["<<"] },
  { keyword: "右移", gespLevel: 3, category: "位运算", synonyms: [">>"] },
  
  // 算法
  { keyword: "枚举", gespLevel: 3, category: "算法", synonyms: ["枚举法", "穷举"] },
  { keyword: "模拟", gespLevel: 3, category: "算法", synonyms: ["模拟法"] },
  { keyword: "自然语言", gespLevel: 3, category: "算法描述" },
  { keyword: "伪代码", gespLevel: 3, category: "算法描述" },
  
  // 数组
  { keyword: "数组", gespLevel: 3, category: "数据结构", synonyms: ["array"] },
  { keyword: "一维数组", gespLevel: 3, category: "数据结构" },
  { keyword: "列表", gespLevel: 3, category: "数据结构", synonyms: ["list", "List"] },
  { keyword: "字典", gespLevel: 3, category: "数据结构", synonyms: ["dict", "map"] },
  
  // 字符串
  { keyword: "字符串", gespLevel: 3, category: "字符串", synonyms: ["string", "String"] },
  { keyword: "string", gespLevel: 3, category: "字符串" },
  { keyword: "大小写转换", gespLevel: 3, category: "字符串" },
  { keyword: "字符串搜索", gespLevel: 3, category: "字符串" },
  { keyword: "分割", gespLevel: 3, category: "字符串" },
  { keyword: "替换", gespLevel: 3, category: "字符串" },
  
  // ==================== GESP 4级 ====================
  // 指针
  { keyword: "指针", gespLevel: 4, category: "指针", synonyms: ["pointer", "*"] },
  { keyword: "解引用", gespLevel: 4, category: "指针" },
  { keyword: "地址", gespLevel: 4, category: "指针" },
  { keyword: "取地址", gespLevel: 4, category: "指针", synonyms: ["&"] },
  
  // 多维数组
  { keyword: "二维数组", gespLevel: 4, category: "数据结构" },
  { keyword: "多维数组", gespLevel: 4, category: "数据结构" },
  
  // 结构体
  { keyword: "结构体", gespLevel: 4, category: "结构体", synonyms: ["struct", "Struct"] },
  { keyword: "struct", gespLevel: 4, category: "结构体" },
  { keyword: "成员变量", gespLevel: 4, category: "结构体" },
  
  // 函数
  { keyword: "函数", gespLevel: 4, category: "函数", synonyms: ["function", "void", "return"] },
  { keyword: "参数", gespLevel: 4, category: "函数", synonyms: ["形参", "实参", "argument"] },
  { keyword: "调用", gespLevel: 4, category: "函数" },
  { keyword: "返回值", gespLevel: 4, category: "函数" },
  { keyword: "作用域", gespLevel: 4, category: "函数" },
  { keyword: "值传递", gespLevel: 4, category: "函数" },
  { keyword: "引用传递", gespLevel: 4, category: "函数" },
  
  // 排序算法
  { keyword: "冒泡排序", gespLevel: 4, category: "排序", synonyms: ["bubble sort"] },
  { keyword: "插入排序", gespLevel: 4, category: "排序", synonyms: ["insertion sort"] },
  { keyword: "选择排序", gespLevel: 4, category: "排序", synonyms: ["selection sort"] },
  { keyword: "排序算法", gespLevel: 4, category: "排序" },
  { keyword: "时间复杂度", gespLevel: 4, category: "复杂度" },
  { keyword: "空间复杂度", gespLevel: 4, category: "复杂度" },
  { keyword: "稳定性", gespLevel: 4, category: "排序" },
  { keyword: "算法复杂度", gespLevel: 4, category: "复杂度" },
  
  // 递推
  { keyword: "递推", gespLevel: 4, category: "算法", synonyms: ["递推算法", "迭代"] },
  { keyword: "递推关系", gespLevel: 4, category: "算法" },
  
  // 文件操作
  { keyword: "文件", gespLevel: 4, category: "文件" },
  { keyword: "文件操作", gespLevel: 4, category: "文件" },
  { keyword: "文件重定向", gespLevel: 4, category: "文件" },
  { keyword: "fopen", gespLevel: 4, category: "文件" },
  { keyword: "fclose", gespLevel: 4, category: "文件" },
  { keyword: "fread", gespLevel: 4, category: "文件" },
  { keyword: "fwrite", gespLevel: 4, category: "文件" },
  
  // 异常处理
  { keyword: "异常", gespLevel: 4, category: "异常", synonyms: ["exception", "try", "catch"] },
  { keyword: "异常处理", gespLevel: 4, category: "异常" },
  
  // ==================== GESP 5级 ====================
  // 数论
  { keyword: "素数", gespLevel: 5, category: "数论", synonyms: ["质数", "prime"] },
  { keyword: "合数", gespLevel: 5, category: "数论" },
  { keyword: "最大公约数", gespLevel: 5, category: "数论", synonyms: ["GCD", "gcd"] },
  { keyword: "最小公倍数", gespLevel: 5, category: "数论", synonyms: ["LCM", "lcm"] },
  { keyword: "同余", gespLevel: 5, category: "数论" },
  { keyword: "约数", gespLevel: 5, category: "数论", synonyms: ["因子", "因数"] },
  { keyword: "倍数", gespLevel: 5, category: "数论" },
  { keyword: "质因数分解", gespLevel: 5, category: "数论" },
  { keyword: "奇偶性", gespLevel: 5, category: "数论" },
  { keyword: "欧几里得算法", gespLevel: 5, category: "数论", synonyms: ["辗转相除"] },
  { keyword: "唯一分解定理", gespLevel: 5, category: "数论" },
  { keyword: "初等数论", gespLevel: 5, category: "数论" },
  
  // 素数筛
  { keyword: "素数筛", gespLevel: 5, category: "数论" },
  { keyword: "埃氏筛", gespLevel: 5, category: "数论", synonyms: ["埃拉托斯特尼筛法"] },
  { keyword: "线性筛", gespLevel: 5, category: "数论", synonyms: ["欧拉筛"] },
  
  // 高精度
  { keyword: "高精度", gespLevel: 5, category: "高精度", synonyms: ["大整数", "大数"] },
  { keyword: "高精度运算", gespLevel: 5, category: "高精度" },
  { keyword: "高精度加减法", gespLevel: 5, category: "高精度" },
  { keyword: "高精度乘法", gespLevel: 5, category: "高精度" },
  { keyword: "高精度除法", gespLevel: 5, category: "高精度" },
  
  // 链表
  { keyword: "链表", gespLevel: 5, category: "数据结构", synonyms: ["linked list"] },
  { keyword: "单链表", gespLevel: 5, category: "数据结构" },
  { keyword: "双链表", gespLevel: 5, category: "数据结构", synonyms: ["双向链表"] },
  { keyword: "循环链表", gespLevel: 5, category: "数据结构" },
  { keyword: "插入", gespLevel: 5, category: "链表操作" },
  { keyword: "删除", gespLevel: 5, category: "链表操作" },
  { keyword: "遍历", gespLevel: 5, category: "链表操作" },
  
  // 二分
  { keyword: "二分", gespLevel: 5, category: "算法", synonyms: ["二分查找", "二分法", "binary search"] },
  { keyword: "二分查找", gespLevel: 5, category: "算法" },
  { keyword: "二分答案", gespLevel: 5, category: "算法" },
  
  // 递归
  { keyword: "递归", gespLevel: 5, category: "算法", synonyms: ["recursion", "递归算法"] },
  { keyword: "递归函数", gespLevel: 5, category: "算法" },
  
  // 分治
  { keyword: "分治", gespLevel: 5, category: "算法", synonyms: ["分治法", "divide and conquer"] },
  { keyword: "分治算法", gespLevel: 5, category: "算法" },
  { keyword: "归并排序", gespLevel: 5, category: "排序", synonyms: ["merge sort"] },
  { keyword: "快速排序", gespLevel: 5, category: "排序", synonyms: ["quick sort", "快排", "quicksort"] },
  
  // 贪心
  { keyword: "贪心", gespLevel: 5, category: "算法", synonyms: ["贪心算法", "greedy"] },
  { keyword: "最优子结构", gespLevel: 5, category: "算法" },
  
  // ==================== GESP 6级 ====================
  // 树
  { keyword: "树", gespLevel: 6, category: "数据结构", synonyms: ["tree", "Tree"] },
  { keyword: "二叉树", gespLevel: 6, category: "数据结构", synonyms: ["binary tree"] },
  { keyword: "哈夫曼树", gespLevel: 6, category: "数据结构", synonyms: ["Huffman", "最优二叉树"] },
  { keyword: "完全二叉树", gespLevel: 6, category: "数据结构" },
  { keyword: "二叉排序树", gespLevel: 6, category: "数据结构", synonyms: ["二叉搜索树", "BST"] },
  { keyword: "节点", gespLevel: 6, category: "树", synonyms: ["结点", "node"] },
  { keyword: "根节点", gespLevel: 6, category: "树" },
  { keyword: "叶子节点", gespLevel: 6, category: "树", synonyms: ["叶节点"] },
  { keyword: "父节点", gespLevel: 6, category: "树" },
  { keyword: "子节点", gespLevel: 6, category: "树" },
  
  // 编码
  { keyword: "哈夫曼编码", gespLevel: 6, category: "编码" },
  { keyword: "格雷编码", gespLevel: 6, category: "编码", synonyms: ["Gray code", "格雷码"] },
  
  // 搜索
  { keyword: "深度优先搜索", gespLevel: 6, category: "搜索", synonyms: ["DFS", "dfs", "深搜"] },
  { keyword: "广度优先搜索", gespLevel: 6, category: "搜索", synonyms: ["BFS", "bfs", "宽搜", "广搜"] },
  { keyword: "搜索算法", gespLevel: 6, category: "搜索" },
  
  // 动态规划
  { keyword: "动态规划", gespLevel: 6, category: "DP", synonyms: ["DP", "dp", "动规"] },
  { keyword: "一维DP", gespLevel: 6, category: "DP", synonyms: ["线性DP"] },
  { keyword: "简单背包", gespLevel: 6, category: "DP", synonyms: ["01背包", "背包问题"] },
  { keyword: "状态转移", gespLevel: 6, category: "DP" },
  { keyword: "状态转移方程", gespLevel: 6, category: "DP" },
  
  // 面向对象
  { keyword: "面向对象", gespLevel: 6, category: "OOP", synonyms: ["OOP", "oop", "对象 oriented"] },
  { keyword: "类", gespLevel: 6, category: "OOP", synonyms: ["class", "Class"] },
  { keyword: "对象", gespLevel: 6, category: "OOP", synonyms: ["object", "instance"] },
  { keyword: "继承", gespLevel: 6, category: "OOP" },
  { keyword: "封装", gespLevel: 6, category: "OOP" },
  { keyword: "多态", gespLevel: 6, category: "OOP" },
  { keyword: "构造函数", gespLevel: 6, category: "OOP" },
  { keyword: "析构函数", gespLevel: 6, category: "OOP" },
  { keyword: "成员函数", gespLevel: 6, category: "OOP" },
  
  // 栈和队列
  { keyword: "栈", gespLevel: 6, category: "数据结构", synonyms: ["stack", "Stack", "堆栈"] },
  { keyword: "队列", gespLevel: 6, category: "数据结构", synonyms: ["queue", "Queue"] },
  { keyword: "循环队列", gespLevel: 6, category: "数据结构" },
  { keyword: "栈顶", gespLevel: 6, category: "栈" },
  { keyword: "栈底", gespLevel: 6, category: "栈" },
  { keyword: "队首", gespLevel: 6, category: "队列", synonyms: ["队头", "front"] },
  { keyword: "队尾", gespLevel: 6, category: "队列", synonyms: ["rear", "back"] },
  { keyword: "入栈", gespLevel: 6, category: "栈", synonyms: ["push", "Push"] },
  { keyword: "出栈", gespLevel: 6, category: "栈", synonyms: ["pop", "Pop"] },
  { keyword: "入队", gespLevel: 6, category: "队列" },
  { keyword: "出队", gespLevel: 6, category: "队列" },
  
  // ==================== GESP 7级 ====================
  // 数学库
  { keyword: "数学库", gespLevel: 7, category: "数学" },
  { keyword: "cmath", gespLevel: 7, category: "数学" },
  { keyword: "三角函数", gespLevel: 7, category: "数学", synonyms: ["sin", "cos", "tan"] },
  { keyword: "对数函数", gespLevel: 7, category: "数学", synonyms: ["log", "ln", "log10"] },
  { keyword: "指数函数", gespLevel: 7, category: "数学", synonyms: ["exp", "pow"] },
  
  // 复杂动态规划
  { keyword: "二维DP", gespLevel: 7, category: "DP" },
  { keyword: "区间DP", gespLevel: 7, category: "DP" },
  { keyword: "LIS", gespLevel: 7, category: "DP", synonyms: ["最长上升子序列", "最长递增子序列"] },
  { keyword: "LCS", gespLevel: 7, category: "DP", synonyms: ["最长公共子序列"] },
  { keyword: "滚动数组", gespLevel: 7, category: "DP", synonyms: ["空间优化"] },
  
  // 图论
  { keyword: "图", gespLevel: 7, category: "图论", synonyms: ["graph", "Graph"] },
  { keyword: "图论", gespLevel: 7, category: "图论" },
  { keyword: "顶点", gespLevel: 7, category: "图论", synonyms: ["节点", "node", "vertex"] },
  { keyword: "边", gespLevel: 7, category: "图论", synonyms: ["edge"] },
  { keyword: "有向图", gespLevel: 7, category: "图论" },
  { keyword: "无向图", gespLevel: 7, category: "图论" },
  { keyword: "权值", gespLevel: 7, category: "图论", synonyms: ["权重", "weight"] },
  { keyword: "邻接矩阵", gespLevel: 7, category: "图论" },
  { keyword: "邻接表", gespLevel: 7, category: "图论" },
  { keyword: "图的遍历", gespLevel: 7, category: "图论" },
  { keyword: "泛洪算法", gespLevel: 7, category: "图论", synonyms: ["floodfill", "FloodFill", "洪水填充"] },
  
  // 哈希表
  { keyword: "哈希表", gespLevel: 7, category: "数据结构", synonyms: ["hash", "hash table", "哈希", "散列表"] },
  { keyword: "哈希函数", gespLevel: 7, category: "数据结构" },
  { keyword: "冲突", gespLevel: 7, category: "数据结构", synonyms: ["碰撞", "collision"] },
  { keyword: "开散列", gespLevel: 7, category: "数据结构" },
  { keyword: "闭散列", gespLevel: 7, category: "数据结构" },
  
  // ==================== GESP 8级 ====================
  // 计数原理
  { keyword: "计数原理", gespLevel: 8, category: "数学" },
  { keyword: "加法原理", gespLevel: 8, category: "数学" },
  { keyword: "乘法原理", gespLevel: 8, category: "数学" },
  
  // 排列组合
  { keyword: "排列", gespLevel: 8, category: "数学", synonyms: ["permutation", "P(n,m)", "A(n,m)"] },
  { keyword: "组合", gespLevel: 8, category: "数学", synonyms: ["combination", "C(n,m)", "组合数"] },
  { keyword: "排列组合", gespLevel: 8, category: "数学" },
  { keyword: "阶乘", gespLevel: 8, category: "数学", synonyms: ["factorial", "!"] },
  { keyword: "杨辉三角", gespLevel: 8, category: "数学", synonyms: ["帕斯卡三角形", "Pascal"] },
  
  // 倍增
  { keyword: "倍增", gespLevel: 8, category: "算法", synonyms: ["倍增法", "binary lifting"] },
  { keyword: "ST表", gespLevel: 8, category: "算法", synonyms: ["Sparse Table"] },
  { keyword: "RMQ", gespLevel: 8, category: "算法", synonyms: ["区间最值查询"] },
  
  // 代数与几何
  { keyword: "一元一次方程", gespLevel: 8, category: "数学" },
  { keyword: "二元一次方程", gespLevel: 8, category: "数学" },
  { keyword: "平面几何", gespLevel: 8, category: "数学" },
  { keyword: "面积计算", gespLevel: 8, category: "数学" },
  
  // 高级图论
  { keyword: "最小生成树", gespLevel: 8, category: "图论", synonyms: ["MST", "minimum spanning tree"] },
  { keyword: "Kruskal", gespLevel: 8, category: "图论", synonyms: ["克鲁斯卡尔"] },
  { keyword: "Prim", gespLevel: 8, category: "图论", synonyms: ["普里姆"] },
  { keyword: "最短路径", gespLevel: 8, category: "图论" },
  { keyword: "Dijkstra", gespLevel: 8, category: "图论", synonyms: ["迪杰斯特拉", "狄克斯特拉"] },
  { keyword: "Floyd", gespLevel: 8, category: "图论", synonyms: ["弗洛伊德", "Floyd-Warshall"] },
  { keyword: "SPFA", gespLevel: 8, category: "图论" },
  { keyword: "Bellman-Ford", gespLevel: 8, category: "图论" },
  
  // 算法优化
  { keyword: "算法优化", gespLevel: 8, category: "优化" },
  { keyword: "时间复杂度分析", gespLevel: 8, category: "优化" },
  { keyword: "空间复杂度分析", gespLevel: 8, category: "优化" },
  { keyword: "剪枝", gespLevel: 8, category: "优化" },
];

// 构建关键词查找表
export const keywordMap: Map<string, KeywordInfo> = new Map();
export const synonymMap: Map<string, string> = new Map(); // 同义词 -> 标准词

// 初始化查找表
function initKeywordMaps() {
  for (const info of gespKeywords) {
    // 添加主关键词
    keywordMap.set(info.keyword.toLowerCase(), info);
    
    // 添加同义词映射
    if (info.synonyms) {
      for (const synonym of info.synonyms) {
        synonymMap.set(synonym.toLowerCase(), info.keyword);
      }
    }
  }
}

initKeywordMaps();

// 查找关键词所属级别
export function getKeywordLevel(keyword: string): number | null {
  const lowerKeyword = keyword.toLowerCase();
  
  // 直接查找
  const info = keywordMap.get(lowerKeyword);
  if (info) return info.gespLevel;
  
  // 同义词查找
  const standardWord = synonymMap.get(lowerKeyword);
  if (standardWord) {
    const standardInfo = keywordMap.get(standardWord.toLowerCase());
    if (standardInfo) return standardInfo.gespLevel;
  }
  
  return null;
}

// 查找关键词信息
export function getKeywordInfo(keyword: string): KeywordInfo | null {
  const lowerKeyword = keyword.toLowerCase();
  
  const info = keywordMap.get(lowerKeyword);
  if (info) return info;
  
  const standardWord = synonymMap.get(lowerKeyword);
  if (standardWord) {
    return keywordMap.get(standardWord.toLowerCase()) || null;
  }
  
  return null;
}

// 获取某级别的所有关键词
export function getKeywordsByLevel(level: number): KeywordInfo[] {
  return gespKeywords.filter(k => k.gespLevel === level);
}

// 获取某类别的所有关键词
export function getKeywordsByCategory(category: string): KeywordInfo[] {
  return gespKeywords.filter(k => k.category === category);
}

// 从文本中提取所有匹配的关键词
export function extractKeywords(text: string): Array<{ keyword: string; level: number; category: string }> {
  const results: Array<{ keyword: string; level: number; category: string }> = [];
  const seen = new Set<string>();
  
  // 遍历所有关键词，查找文本中是否包含
  for (const info of gespKeywords) {
    if (seen.has(info.keyword)) continue;
    
    // 检查主关键词
    if (text.includes(info.keyword)) {
      results.push({
        keyword: info.keyword,
        level: info.gespLevel,
        category: info.category,
      });
      seen.add(info.keyword);
      continue;
    }
    
    // 检查同义词
    if (info.synonyms) {
      for (const synonym of info.synonyms) {
        if (text.includes(synonym)) {
          results.push({
            keyword: info.keyword,
            level: info.gespLevel,
            category: info.category,
          });
          seen.add(info.keyword);
          break;
        }
      }
    }
  }
  
  // 按级别排序
  return results.sort((a, b) => b.level - a.level);
}
