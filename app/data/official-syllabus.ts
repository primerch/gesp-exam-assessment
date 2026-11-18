/** Editorial summaries of CCF's numbered knowledge requirements. Page numbers are 1-based PDF pages. */
export const syllabusSources = {
  directory: "https://gesp.ccf.org.cn/101/1008/10012.html",
  code: "https://gesp.ccf.org.cn/101/attach/1725701770182688.pdf",
  revision: "https://gesp.ccf.org.cn/101/1002/10255.html",
};
export const formatPages = [0, 7, 13, 18, 21, 24, 26, 28, 31];
export const revisionDate = "2026-01-28";
export const languageNames = { cpp: "C++" } as const;
export type Language = keyof typeof languageNames;
export const levelNames = ["", "一级", "二级", "三级", "四级", "五级", "六级", "七级", "八级"];
export const levels = [1, 2, 3, 4, 5, 6, 7, 8];

type Track = "cpp" | "code";
export interface SyllabusEntry {
  id: string;
  track: Track;
  level: number;
  page: number;
  clause: string;
  title: string;
  detail: string;
  kind: "topic" | "exclusion" | "validity";
}
type Row = [clause: string, title: string, detail: string];

function chapter(track: Track, level: number, page: number, rows: Row[]): SyllabusEntry[] {
  return rows.map(([clause, title, detail]) => ({
    id: `${track}-${level}.${clause}`,
    track,
    level,
    page,
    clause,
    title,
    detail,
    kind: "topic",
  }));
}

const topics = [
  ...chapter("cpp", 1, 5, [
    ["1", "计算机与操作系统", "识别处理器、内存和输入输出设备，了解计算机历史与常见系统操作。"],
    ["2", "开发环境", "建立源文件，编辑、编译、运行与调试程序。"],
    ["3", "输入输出与赋值", "用 cin、cout、scanf、printf 读写数据。流插入和流提取在这里属于输入输出。"],
    ["4", "程序中的名称与表达式", "识别关键字、标识符、常量、变量与表达式。"],
    ["5", "变量与常量", "命名、初始化、赋值及自增自减。"],
    ["6", "算术运算", "处理四则运算、整数除法和取余。"],
    ["7", "逻辑运算", "用 &&、||、! 组合或取反条件。"],
    ["8", "关系运算", "比较两个值的大小与相等关系。"],
    ["9", "基本类型", "选择整数、浮点数、字符或布尔类型。"],
    ["10", "顺序执行", "按语句顺序跟踪程序状态。"],
    ["11", "单层分支", "用 if、else、switch 和条件表达式选择执行路径。"],
    ["12", "单层循环", "用 for、while、do-while 重复执行，理解 break 和 continue。"],
    ["13", "注释与调试", "读懂注释，定位简单程序错误。"],
  ]),
  ...chapter("cpp", 2, 11, [
    ["1", "计算机存储", "区分 RAM、ROM 与高速缓存的作用。"],
    ["2", "网络分层与地址", "区分局域网、城域网和广域网，理解 TCP/IP、OSI、IP 地址与子网。"],
    ["3", "程序设计语言", "比较机器语言、汇编语言、高级语言的特点。"],
    ["4", "程序流程图", "用标准符号绘制顺序、分支和循环。"],
    ["5", "ASCII 编码", "识别常见字符的编码，在字符和码值间转换。"],
    ["6", "类型转换", "判断显式和隐式转换的结果。"],
    ["7", "嵌套分支", "组合 if、else 和 switch，分析多层选择。"],
    ["8", "嵌套循环", "嵌套 for、while 或 do-while，跟踪每一层执行次数。"],
    ["9", "基本数学函数", "使用绝对值、平方根、最值及随机数函数，理解基本原理。"],
  ]),
  ...chapter("code", 3, 17, [
    ["1", "有符号数编码", "读写原码、反码和补码表示。"],
    ["2", "进制换算", "在二、八、十与十六进制间转换。"],
    ["3", "按位运算", "计算整数按位与、或、异或、取反和左右移的结果。"],
    ["4", "算法描述", "用文字、流程图或伪代码表达算法。"],
    ["6", "字符串处理", "进行大小写变换、查找、切分和替换。"],
    ["7", "枚举", "构造候选范围，逐个检验候选解。"],
    ["8", "模拟", "根据题设规则逐步更新状态。"],
  ]),
  ...chapter("cpp", 3, 17, [["5", "一维数组", "定义及访问固定长度的一维数组。"]]),
  ...chapter("cpp", 4, 19, [
    ["1", "指针", "声明指针、赋值并解引用。"],
    ["2a", "结构体", "使用结构体、结构体数组、指针、嵌套和结构体参数。"],
    ["2b", "多维数组", "定义与索引固定长度的二维及更高维数组。"],
    ["5", "参数传递", "区别按值、按引用和通过指针传参。"],
  ]),
  ...chapter("code", 4, 19, [
    ["3", "具名函数", "拆分模块，定义、声明和调用函数，区分形参与实参。"],
    ["4", "变量作用域", "区别局部变量与全局变量的可见范围。"],
    ["6", "递推", "从已知项推导后续项，写出递推关系。"],
    ["7", "排序与稳定性", "比较排序的稳定性、适用条件和时空开销，认识内排序与外排序。"],
    ["8", "基础排序", "手工推演并实现冒泡、插入和选择排序。"],
    ["9", "简单复杂度", "估算简单程序的时间开销，涉及多项式和指数增长。"],
    ["10", "文件读写", "对文件进行读写，理解重定向。"],
    ["11", "异常处理", "识别异常并用语言提供的机制处理。"],
  ]),
  ...chapter("code", 5, 22, [
    ["1", "初等数论", "处理整除、同余、奇偶、质因数、最大公约数和最小公倍数。"],
    ["3", "链表", "创建、遍历、插入、删除和逆置单链表、双链表和循环链表。"],
    ["4", "数论算法", "用欧几里得算法求公约数，用埃氏筛或线性筛求素数，运用唯一分解。"],
    ["5", "复杂度估算", "估算含多项式与对数的算法开销。"],
    ["6", "二分", "在有序数据中二分查找，或在可行性单调的答案区间中二分。"],
    ["7", "递归", "设计终止条件，分析递归的时间、空间及优化方法。"],
    ["8", "贪心", "利用最优子结构选择局部策略。"],
    ["9", "分治排序", "拆分与合并子问题，实现归并排序和快速排序。"],
  ]),
  ...chapter("cpp", 5, 22, [["2", "数组高精度", "用数组逐位模拟大整数加、减、乘、除。"]]),
  ...chapter("code", 6, 25, [
    ["1", "树的构造与遍历", "建立树，按指定次序访问结点。"],
    ["2", "特殊二叉树", "认识完全二叉树、二叉排序树以及哈夫曼树。"],
    ["3", "编码方法", "构造哈夫曼编码并理解格雷编码。"],
    ["4", "搜索", "使用深度优先、广度优先或二叉树搜索解决问题。"],
    ["5", "简单动态规划", "设计一维状态转移，求解简单背包问题。"],
    ["6", "面向对象", "创建和初始化类，理解封装、继承和多态。"],
    ["7", "栈与队列", "使用栈、队列和循环队列的入、出操作。"],
  ]),
  ...chapter("code", 7, 27, [
    ["1", "高等数学库函数", "使用 sin、cos、log、exp 等三角、对数与指数函数。"],
    ["2", "进阶动态规划", "使用二维或区间状态，求 LIS、LCS，使用滚动数组优化空间。"],
    ["3", "图的表示与遍历", "表示有向或无向图，计算度，通过 DFS、BFS 或泛洪遍历图。"],
    ["4", "哈希表原理", "理解哈希表的存取机制与实际用途。"],
  ]),
  ...chapter("code", 8, 29, [
    ["1", "计数原理", "区分分类相加和分步相乘。"],
    ["2", "排列与组合", "判断顺序是否影响计数并实现基本排列组合问题。"],
    ["3", "杨辉三角", "构造杨辉三角并关联组合数。"],
    ["4", "倍增", "预处理二的幂次跨度，分析查询开销。"],
    ["5", "代数与平面几何", "用初中代数求解方程，用几何关系求常见图形的面积。"],
    ["6", "生成树与最短路", "用 Prim、Kruskal 求最小生成树，理解 Dijkstra、Floyd 等最短路算法。"],
    ["7", "时空效率分析", "分析复杂搜索、排序、图算法及动态规划的时空开销。"],
    ["8", "算法优化", "比较等价解法，利用数学关系或算法改写降低资源开销。"],
  ]),
];
export const scopeRules: SyllabusEntry[] = [
  {
    id: "cpp-vla3",
    track: "cpp",
    level: 3,
    page: 17,
    clause: "5",
    title: "三级数组排除变长数组",
    detail: "需要在运行时决定内建数组的长度时，超出本级数组条款。",
    kind: "exclusion",
  },
  {
    id: "cpp-vla4",
    track: "cpp",
    level: 4,
    page: 19,
    clause: "2",
    title: "四级数组排除变长数组",
    detail: "四级二维、多维数组的范围也排除变长数组。",
    kind: "exclusion",
  },
  {
    id: "code-lambda4",
    track: "code",
    level: 4,
    page: 19,
    clause: "3",
    title: "四级函数排除匿名函数",
    detail: "必须理解或编写匿名函数时，超出四级函数条款。",
    kind: "exclusion",
  },
  {
    id: "cpp-call4",
    track: "cpp",
    level: 4,
    page: 19,
    clause: "3",
    title: "四级函数排除调用运算符重载",
    detail: "类的 operator() 重载不在四级函数要求内。",
    kind: "exclusion",
  },
  {
    id: "cpp-version",
    track: "cpp",
    level: 0,
    page: 4,
    clause: "注",
    title: "C++ 语言版本",
    detail: "题面未指定版本时使用 C++11。需要其他版本或编译器扩展才成立的题目存在题设问题。",
    kind: "validity",
  },
  {
    id: "cpp-undefined",
    track: "cpp",
    level: 0,
    page: 4,
    clause: "注",
    title: "未定义行为",
    detail: "题目不能依赖未定义行为得出确定答案；判断前核实代码、取值范围与执行路径。",
    kind: "validity",
  },
];

export function catalogFor(targetLevel: number) {
  return [...topics, ...scopeRules].filter(
    (item) => item.kind !== "exclusion" || item.level === targetLevel,
  );
}
export function sourceLink(entry: SyllabusEntry) {
  return syllabusSources.code + "#page=" + entry.page;
}
export function clauseLabel(entry: SyllabusEntry) {
  return entry.clause === "注" ? "全卷说明" : `第 ${entry.clause.replace(/[ab]$/, "")} 条`;
}
