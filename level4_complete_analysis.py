#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Level 4 完整知识点分析
基于课程标题和教学大纲创建详细分析
"""

import os
import json

OUTPUT_DIR = "/Users/reacher/Developer/gesp/analysis_results"

# Level 4 完整知识点定义
LEVEL4_CURRICULUM = {
    1: {
        "title": "排列组合1",
        "file": "1-排列组合1.pptx",
        "slides": 113,
        "type": "编程/理论",
        "knowledge_points": [
            {"id": "L4_1_1", "name": "加法原理（分类计数）", "content": "完成一件事有n类办法，每类有若干种方法，则总方法数为各类方法数之和", "gesp_map": "8.1"},
            {"id": "L4_1_2", "name": "乘法原理（分步计数）", "content": "完成一件事需要n个步骤，每步有若干种方法，则总方法数为各步方法数之积", "gesp_map": "8.2"},
            {"id": "L4_1_3", "name": "排列的概念", "content": "从n个不同元素中取出m个元素按一定顺序排成一列，考虑顺序", "gesp_map": "8.3"},
            {"id": "L4_1_4", "name": "排列数公式 P(n,m)", "content": "P(n,m) = n!/(n-m)! = n×(n-1)×...×(n-m+1)", "gesp_map": "8.3"},
            {"id": "L4_1_5", "name": "全排列", "content": "n个元素的全排列数 P(n,n) = n!", "gesp_map": "8.3"},
            {"id": "L4_1_6", "name": "特殊排列问题", "content": "相邻问题、不相邻问题、定序问题等常见模型", "gesp_map": "8.3"},
        ],
        "gesp_level_8": ["8.1", "8.2", "8.3"],
        "gesp_level_7": [],
        "summary": "排列组合基础，重点讲解加法原理、乘法原理和排列的概念与计算"
    },
    2: {
        "title": "排列组合2",
        "file": "2-排列组合2.pptx",
        "slides": 69,
        "type": "编程/理论",
        "knowledge_points": [
            {"id": "L4_2_1", "name": "组合的概念", "content": "从n个不同元素中取出m个元素组成一组，不考虑顺序", "gesp_map": "8.4"},
            {"id": "L4_2_2", "name": "组合数公式 C(n,m)", "content": "C(n,m) = n!/(m!(n-m)!)", "gesp_map": "8.4"},
            {"id": "L4_2_3", "name": "组合数性质", "content": "C(n,m)=C(n,n-m), C(n,m)=C(n-1,m-1)+C(n-1,m)", "gesp_map": "8.4"},
            {"id": "L4_2_4", "name": "杨辉三角", "content": "组合数的几何表示，第n行第m个数为C(n,m)", "gesp_map": "8.5"},
            {"id": "L4_2_5", "name": "二项式定理", "content": "(a+b)^n = ΣC(n,k)a^(n-k)b^k", "gesp_map": "8.5"},
            {"id": "L4_2_6", "name": "排列组合综合应用", "content": "复杂计数问题的分析与解法", "gesp_map": "8.3,8.4"},
        ],
        "gesp_level_8": ["8.3", "8.4", "8.5"],
        "gesp_level_7": [],
        "summary": "组合概念与计算，杨辉三角与组合恒等式，排列组合综合应用"
    },
    3: {
        "title": "质数筛法",
        "file": "3-质数筛法.pptx",
        "slides": 108,
        "type": "编程",
        "knowledge_points": [
            {"id": "L4_3_1", "name": "质数判定基础", "content": "试除法判断质数，时间复杂度O(√n)", "gesp_map": None},
            {"id": "L4_3_2", "name": "埃拉托斯特尼筛法", "content": "筛除质数的倍数，时间复杂度O(nloglogn)", "gesp_map": None},
            {"id": "L4_3_3", "name": "欧拉筛法（线性筛）", "content": "每个合数只被最小质因子筛除，时间复杂度O(n)", "gesp_map": None},
            {"id": "L4_3_4", "name": "质数筛法的应用", "content": "区间质数、质数计数、质因数分解等", "gesp_map": None},
        ],
        "gesp_level_8": [],
        "gesp_level_7": [],
        "summary": "质数筛选算法，包括埃氏筛和欧拉筛（线性筛）的原理与实现"
    },
    4: {
        "title": "区间动态规划1",
        "file": "4-区间动态规划1.pptx",
        "slides": 107,
        "type": "编程",
        "knowledge_points": [
            {"id": "L4_4_1", "name": "区间DP的概念", "content": "以区间长度为阶段，以区间左右端点为状态的DP", "gesp_map": "7.6"},
            {"id": "L4_4_2", "name": "区间DP状态设计", "content": "dp[i][j]表示区间[i,j]的最优值", "gesp_map": "7.6"},
            {"id": "L4_4_3", "name": "石子合并问题", "content": "将相邻石子合并，求最小/最大得分", "gesp_map": "7.6"},
            {"id": "L4_4_4", "name": "区间DP的状态转移", "content": "枚举分割点k，dp[i][j] = min(dp[i][k] + dp[k+1][j] + cost)", "gesp_map": "7.6"},
        ],
        "gesp_level_8": [],
        "gesp_level_7": ["7.6"],
        "summary": "区间动态规划基础，以石子合并问题为经典案例讲解区间DP思想"
    },
    5: {
        "title": "区间动态规划2",
        "file": "5-区间动态规划2.pptx",
        "slides": 91,
        "type": "编程",
        "knowledge_points": [
            {"id": "L4_5_1", "name": "矩阵链乘问题", "content": "最优括号化方案，使得矩阵乘法计算量最小", "gesp_map": "7.6"},
            {"id": "L4_5_2", "name": "区间DP进阶技巧", "content": "四边形不等式优化、决策单调性等", "gesp_map": "7.6"},
            {"id": "L4_5_3", "name": "回文串相关DP", "content": "最长回文子序列、回文划分等问题", "gesp_map": "7.6"},
            {"id": "L4_5_4", "name": "区间DP综合应用", "content": "多阶段决策、状态压缩等进阶应用", "gesp_map": "7.6"},
        ],
        "gesp_level_8": [],
        "gesp_level_7": ["7.6"],
        "summary": "区间动态规划进阶，矩阵链乘、回文串等经典问题"
    },
    6: {
        "title": "阶段测试",
        "file": "6-阶段测试.pptx",
        "slides": 48,
        "type": "测试",
        "knowledge_points": [
            {"id": "L4_6_1", "name": "阶段测试", "content": "对前5节课内容的综合测试", "gesp_map": None},
        ],
        "gesp_level_8": [],
        "gesp_level_7": [],
        "summary": "阶段性测试，无新知识点"
    },
    7: {
        "title": "参赛相关",
        "file": "7-参赛相关.pptx",
        "slides": 101,
        "type": "理论",
        "knowledge_points": [
            {"id": "L4_7_1", "name": "GESP考试介绍", "content": "GESP等级考试流程、规则、评分标准", "gesp_map": None},
            {"id": "L4_7_2", "name": "CSP-J/S介绍", "content": "CSP初赛和复赛的考试形式和备考策略", "gesp_map": None},
            {"id": "L4_7_3", "name": "竞赛报名与准备", "content": "报名流程、考试环境、注意事项", "gesp_map": None},
            {"id": "L4_7_4", "name": "备考策略", "content": "复习计划、重点难点、应试技巧", "gesp_map": None},
        ],
        "gesp_level_8": [],
        "gesp_level_7": [],
        "summary": "竞赛相关信息，GESP和CSP考试介绍与备考指导"
    },
    8: {
        "title": "枚举算法应用",
        "file": "8-枚举算法应用.pptx",
        "slides": 95,
        "type": "编程",
        "knowledge_points": [
            {"id": "L4_8_1", "name": "枚举算法思想", "content": "遍历所有可能的解，逐一验证是否满足条件", "gesp_map": None},
            {"id": "L4_8_2", "name": "优化枚举策略", "content": "减少枚举范围、剪枝、选择合适的枚举对象", "gesp_map": None},
            {"id": "L4_8_3", "name": "枚举的应用场景", "content": "子集枚举、排列枚举、因数枚举等", "gesp_map": None},
        ],
        "gesp_level_8": [],
        "gesp_level_7": [],
        "summary": "枚举算法的应用与优化策略"
    },
    9: {
        "title": "贪心算法应用（复赛）",
        "file": "9-贪心算法应用（复赛）.pptx",
        "slides": 94,
        "type": "编程/复赛",
        "knowledge_points": [
            {"id": "L4_9_1", "name": "贪心算法思想", "content": "每一步都选择当前最优解，希望最终得到全局最优", "gesp_map": None},
            {"id": "L4_9_2", "name": "活动选择问题", "content": "选择最多的互不重叠的活动", "gesp_map": None},
            {"id": "L4_9_3", "name": "区间调度问题", "content": "贪心策略选择结束时间最早的区间", "gesp_map": None},
            {"id": "L4_9_4", "name": "哈夫曼编码", "content": "带权路径长度最小的二叉树构造", "gesp_map": None},
            {"id": "L4_9_5", "name": "贪心算法的证明", "content": "贪心选择性质和最优子结构", "gesp_map": None},
        ],
        "gesp_level_8": [],
        "gesp_level_7": [],
        "summary": "贪心算法在复赛中的应用，包括活动选择、区间调度等经典问题"
    },
    10: {
        "title": "模拟算法应用（复赛）",
        "file": "10-模拟算法应用（复赛）.pptx",
        "slides": 124,
        "type": "编程/复赛",
        "knowledge_points": [
            {"id": "L4_10_1", "name": "模拟算法思想", "content": "按照题目描述的过程一步步执行", "gesp_map": None},
            {"id": "L4_10_2", "name": "过程模拟", "content": "直接模拟题目描述的操作流程", "gesp_map": None},
            {"id": "L4_10_3", "name": "游戏模拟", "content": "模拟游戏规则和状态变化", "gesp_map": None},
            {"id": "L4_10_4", "name": "模拟的优化", "content": "找规律、加速模拟、减少不必要的计算", "gesp_map": None},
        ],
        "gesp_level_8": [],
        "gesp_level_7": [],
        "summary": "模拟算法的应用，适合规则明确的题目"
    },
    11: {
        "title": "搜索算法应用（复赛）",
        "file": "11-搜索算法应用（复赛）.pptx",
        "slides": 86,
        "type": "编程/复赛",
        "knowledge_points": [
            {"id": "L4_11_1", "name": "DFS深度优先搜索", "content": "递归或栈实现，深入搜索到尽头再回溯", "gesp_map": "7.11"},
            {"id": "L4_11_2", "name": "BFS广度优先搜索", "content": "队列实现，层次遍历求最短路径", "gesp_map": "7.12"},
            {"id": "L4_11_3", "name": "回溯算法", "content": "在DFS基础上剪枝，避免无效搜索", "gesp_map": "7.11"},
            {"id": "L4_11_4", "name": "剪枝技巧", "content": "可行性剪枝、最优性剪枝、重复状态剪枝", "gesp_map": "7.11"},
            {"id": "L4_11_5", "name": "Flood Fill泛洪算法", "content": "基于DFS或BFS的连通区域标记", "gesp_map": "7.13"},
        ],
        "gesp_level_8": [],
        "gesp_level_7": ["7.11", "7.12", "7.13"],
        "summary": "搜索算法在复赛中的应用，包括DFS、BFS、回溯和剪枝"
    },
    12: {
        "title": "复赛模拟比赛",
        "file": "12-复赛模拟比赛.pptx",
        "slides": 44,
        "type": "测试/复赛",
        "knowledge_points": [
            {"id": "L4_12_1", "name": "复赛模拟", "content": "模拟真实复赛环境和题目", "gesp_map": None},
        ],
        "gesp_level_8": [],
        "gesp_level_7": [],
        "summary": "复赛模拟考试，综合应用前面学到的算法"
    },
    13: {
        "title": "计算机基础知识",
        "file": "13-计算机基础知识.pptx",
        "slides": 105,
        "type": "理论/初赛",
        "knowledge_points": [
            {"id": "L4_13_1", "name": "计算机组成原理", "content": "CPU、内存、存储、输入输出设备", "gesp_map": None},
            {"id": "L4_13_2", "name": "进制转换", "content": "二进制、八进制、十六进制及其转换", "gesp_map": None},
            {"id": "L4_13_3", "name": "存储单位", "content": "bit、byte、KB、MB、GB等及其换算", "gesp_map": None},
            {"id": "L4_13_4", "name": "网络基础", "content": "IP地址、域名、协议等基础概念", "gesp_map": None},
            {"id": "L4_13_5", "name": "操作系统基础", "content": "进程、文件系统、内存管理等", "gesp_map": None},
        ],
        "gesp_level_8": [],
        "gesp_level_7": [],
        "summary": "计算机基础知识，初赛理论部分"
    },
    14: {
        "title": "数据结构1（初赛）",
        "file": "14-数据结构1（初赛）.pptx",
        "slides": 127,
        "type": "理论/初赛",
        "knowledge_points": [
            {"id": "L4_14_1", "name": "数组", "content": "一维数组、二维数组、数组的操作和应用", "gesp_map": "7.14"},
            {"id": "L4_14_2", "name": "链表", "content": "单链表、双向链表、循环链表的概念", "gesp_map": "7.14"},
            {"id": "L4_14_3", "name": "栈", "content": "后进先出，入栈出栈操作，栈的应用", "gesp_map": "7.14"},
            {"id": "L4_14_4", "name": "队列", "content": "先进先出，入队出队操作，队列的应用", "gesp_map": "7.14"},
        ],
        "gesp_level_8": [],
        "gesp_level_7": ["7.14"],
        "summary": "基础数据结构：数组、链表、栈、队列"
    },
    15: {
        "title": "数据结构2（初赛）",
        "file": "15-数据结构2（初赛）.pptx",
        "slides": 78,
        "type": "理论/初赛",
        "knowledge_points": [
            {"id": "L4_15_1", "name": "树的基本概念", "content": "根节点、叶子节点、度、深度、高度", "gesp_map": "7.10"},
            {"id": "L4_15_2", "name": "二叉树", "content": "满二叉树、完全二叉树、二叉树的遍历", "gesp_map": "7.10"},
            {"id": "L4_15_3", "name": "图的定义", "content": "顶点、边、有向图、无向图、加权图", "gesp_map": "7.10"},
            {"id": "L4_15_4", "name": "图的存储", "content": "邻接矩阵、邻接表的表示方法", "gesp_map": "7.10"},
            {"id": "L4_15_5", "name": "图的遍历", "content": "DFS和BFS遍历图的原理", "gesp_map": "7.11,7.12"},
        ],
        "gesp_level_8": [],
        "gesp_level_7": ["7.10", "7.11", "7.12"],
        "summary": "树和图的数据结构，包括基本概念和遍历方法"
    },
    16: {
        "title": "数学专题1（初赛）",
        "file": "16-数学专题1（初赛）.pptx",
        "slides": 79,
        "type": "理论/初赛",
        "knowledge_points": [
            {"id": "L4_16_1", "name": "质数与合数", "content": "质数的定义、性质、质数判定", "gesp_map": None},
            {"id": "L4_16_2", "name": "最大公约数GCD", "content": "辗转相除法（欧几里得算法）", "gesp_map": None},
            {"id": "L4_16_3", "name": "最小公倍数LCM", "content": "LCM(a,b) = a*b/GCD(a,b)", "gesp_map": None},
            {"id": "L4_16_4", "name": "模运算", "content": "取模运算性质、快速幂", "gesp_map": None},
            {"id": "L4_16_5", "name": "三角函数", "content": "sin、cos、tan函数的使用", "gesp_map": "7.1"},
        ],
        "gesp_level_8": [],
        "gesp_level_7": ["7.1"],
        "summary": "数学基础专题，包括数论和三角函数"
    },
    17: {
        "title": "数学专题2（初赛）",
        "file": "17-数学专题2（初赛）.pptx",
        "slides": 75,
        "type": "理论/初赛",
        "knowledge_points": [
            {"id": "L4_17_1", "name": "排列组合计算", "content": "排列数、组合数的计算和应用", "gesp_map": "8.3,8.4"},
            {"id": "L4_17_2", "name": "概率基础", "content": "概率的定义、计算方法", "gesp_map": None},
            {"id": "L4_17_3", "name": "平面几何", "content": "基本图形面积计算", "gesp_map": "8.9"},
            {"id": "L4_17_4", "name": "对数函数", "content": "log10、log2函数的使用", "gesp_map": "7.2"},
            {"id": "L4_17_5", "name": "指数函数", "content": "exp函数的使用", "gesp_map": "7.3"},
        ],
        "gesp_level_8": ["8.3", "8.4", "8.9"],
        "gesp_level_7": ["7.2", "7.3"],
        "summary": "数学进阶专题，包括几何、概率和对数指数函数"
    },
    18: {
        "title": "字符串专题（初赛）",
        "file": "18-字符串专题（初赛）.pptx",
        "slides": 91,
        "type": "理论/初赛",
        "knowledge_points": [
            {"id": "L4_18_1", "name": "字符串操作", "content": "字符串的遍历、查找、替换", "gesp_map": None},
            {"id": "L4_18_2", "name": "字符串匹配", "content": "朴素匹配、KMP算法原理", "gesp_map": None},
            {"id": "L4_18_3", "name": "字符串哈希", "content": "滚动哈希、字符串比较", "gesp_map": "7.14"},
        ],
        "gesp_level_8": [],
        "gesp_level_7": ["7.14"],
        "summary": "字符串处理算法，包括匹配和哈希"
    },
    19: {
        "title": "二分算法专题（初赛）",
        "file": "19-二分算法专题（初赛）.pptx",
        "slides": 131,
        "type": "理论/初赛",
        "knowledge_points": [
            {"id": "L4_19_1", "name": "二分查找", "content": "在有序数组中查找元素，O(logn)", "gesp_map": None},
            {"id": "L4_19_2", "name": "二分答案", "content": "在答案区间上二分，验证可行性", "gesp_map": None},
            {"id": "L4_19_3", "name": "边界处理", "content": "左边界、右边界、中间值的选择", "gesp_map": None},
            {"id": "L4_19_4", "name": "倍增法", "content": "二进制倍增思想，ST表的构建", "gesp_map": "8.6"},
        ],
        "gesp_level_8": ["8.6"],
        "gesp_level_7": [],
        "summary": "二分算法及其应用，包括倍增法"
    },
    20: {
        "title": "排序专题（初赛）",
        "file": "20-排序专题（初赛）.pptx",
        "slides": 156,
        "type": "理论/初赛",
        "knowledge_points": [
            {"id": "L4_20_1", "name": "冒泡排序", "content": "相邻元素比较交换，O(n²)", "gesp_map": None},
            {"id": "L4_20_2", "name": "选择排序", "content": "选择最小元素放到前面，O(n²)", "gesp_map": None},
            {"id": "L4_20_3", "name": "插入排序", "content": "将元素插入到已排序序列，O(n²)", "gesp_map": None},
            {"id": "L4_20_4", "name": "快速排序", "content": "分治法，选择基准分区，O(nlogn)", "gesp_map": None},
            {"id": "L4_20_5", "name": "归并排序", "content": "分治法，合并有序序列，O(nlogn)", "gesp_map": None},
            {"id": "L4_20_6", "name": "桶排序与计数排序", "content": "非比较排序，O(n)", "gesp_map": None},
        ],
        "gesp_level_8": [],
        "gesp_level_7": [],
        "summary": "各类排序算法的原理、实现和复杂度分析"
    },
    21: {
        "title": "递归专题（初赛）",
        "file": "21-递归专题（初赛）.pptx",
        "slides": 82,
        "type": "理论/初赛",
        "knowledge_points": [
            {"id": "L4_21_1", "name": "递归思想", "content": "函数调用自身，分解问题", "gesp_map": None},
            {"id": "L4_21_2", "name": "递归三要素", "content": "递归出口、递归关系、规模减小", "gesp_map": None},
            {"id": "L4_21_3", "name": "递归与分治", "content": "归并排序、快速幂等分治算法", "gesp_map": "8.6"},
            {"id": "L4_21_4", "name": "递归树分析", "content": "递归调用过程的可视化分析", "gesp_map": None},
        ],
        "gesp_level_8": ["8.6"],
        "gesp_level_7": [],
        "summary": "递归算法思想及应用，包括分治策略"
    },
    22: {
        "title": "动态规划（初赛）",
        "file": "22-动态规划（初赛）.pptx",
        "slides": 98,
        "type": "理论/初赛",
        "knowledge_points": [
            {"id": "L4_22_1", "name": "DP基础概念", "content": "最优子结构、重叠子问题、无后效性", "gesp_map": "7.4"},
            {"id": "L4_22_2", "name": "DP状态设计", "content": "确定状态含义和维度", "gesp_map": "7.4"},
            {"id": "L4_22_3", "name": "状态转移方程", "content": "从前面的状态推导当前状态", "gesp_map": "7.4"},
            {"id": "L4_22_4", "name": "背包问题", "content": "01背包、完全背包、多重背包", "gesp_map": "7.4"},
            {"id": "L4_22_5", "name": "最长递增子序列LIS", "content": "O(n²)和O(nlogn)算法", "gesp_map": "7.7"},
            {"id": "L4_22_6", "name": "最长公共子序列LCS", "content": "二维DP解法，路径还原", "gesp_map": "7.8"},
            {"id": "L4_22_7", "name": "滚动数组优化", "content": "空间复杂度优化，只保留必要状态", "gesp_map": "7.9"},
        ],
        "gesp_level_8": [],
        "gesp_level_7": ["7.4", "7.7", "7.8", "7.9"],
        "summary": "动态规划综合，包括LIS、LCS和滚动数组优化"
    },
    23: {
        "title": "初赛模拟比赛",
        "file": "23-初赛模拟比赛.pptx",
        "slides": 66,
        "type": "测试/初赛",
        "knowledge_points": [
            {"id": "L4_23_1", "name": "初赛模拟", "content": "模拟真实初赛环境和题目", "gesp_map": None},
        ],
        "gesp_level_8": [],
        "gesp_level_7": [],
        "summary": "初赛模拟考试，综合测试理论知识"
    },
}

def generate_complete_analysis():
    """生成完整的分析报告"""
    
    all_lessons = []
    gesp_7_coverage = set()
    gesp_8_coverage = set()
    
    for lesson_num, data in LEVEL4_CURRICULUM.items():
        # 构建每节课的详细分析
        lesson_analysis = {
            "level": 4,
            "lesson_number": lesson_num,
            "title": data["title"],
            "file_name": data["file"],
            "total_slides": data["slides"],
            "lesson_type": data["type"],
            "knowledge_points": data["knowledge_points"],
            "gesp_level_8_points": [{"code": c, "name": get_gesp_name(8, c)} for c in data["gesp_level_8"]],
            "gesp_level_7_points": [{"code": c, "name": get_gesp_name(7, c)} for c in data["gesp_level_7"]],
            "summary": data["summary"]
        }
        
        all_lessons.append(lesson_analysis)
        
        # 统计覆盖
        gesp_7_coverage.update(data["gesp_level_7"])
        gesp_8_coverage.update(data["gesp_level_8"])
        
        # 保存单课分析
        output_file = os.path.join(OUTPUT_DIR, f"level4_lesson{lesson_num}.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(lesson_analysis, f, ensure_ascii=False, indent=2)
        print(f"已保存: level4_lesson{lesson_num}.json")
    
    # 生成汇总
    summary = {
        "project": "五个奶爸少儿编程 - Level 4",
        "total_lessons": 23,
        "target_gesp_levels": "7-8级",
        "gesp_8_analysis": {
            "total_points": 15,
            "covered_points": len(gesp_8_coverage),
            "coverage_rate": f"{len(gesp_8_coverage)/15*100:.1f}%",
            "covered_codes": sorted(list(gesp_8_coverage)),
            "missing_codes": sorted([f"8.{i}" for i in range(1, 16) if f"8.{i}" not in gesp_8_coverage])
        },
        "gesp_7_analysis": {
            "total_points": 14,
            "covered_points": len(gesp_7_coverage),
            "coverage_rate": f"{len(gesp_7_coverage)/14*100:.1f}%",
            "covered_codes": sorted(list(gesp_7_coverage)),
            "missing_codes": sorted([f"7.{i}" for i in range(1, 15) if f"7.{i}" not in gesp_7_coverage])
        },
        "lessons_summary": [
            {
                "lesson": l["lesson_number"],
                "title": l["title"],
                "type": l["lesson_type"],
                "gesp_8_count": len(l["gesp_level_8_points"]),
                "gesp_7_count": len(l["gesp_level_7_points"]),
                "knowledge_count": len(l["knowledge_points"])
            }
            for l in all_lessons
        ]
    }
    
    # 保存汇总
    summary_file = os.path.join(OUTPUT_DIR, "level4_complete_summary.json")
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    
    print(f"\n汇总文件已保存: {summary_file}")
    print(f"\nGESP 8级覆盖: {len(gesp_8_coverage)}/15 ({len(gesp_8_coverage)/15*100:.1f}%)")
    print(f"GESP 7级覆盖: {len(gesp_7_coverage)}/14 ({len(gesp_7_coverage)/14*100:.1f}%)")

def get_gesp_name(level, code):
    """获取GESP知识点名称"""
    names = {
        "7.1": "三角函数", "7.2": "对数函数", "7.3": "指数函数",
        "7.4": "二维动态规划", "7.5": "DP最值优化", "7.6": "区间动态规划",
        "7.7": "最长递增子序列(LIS)", "7.8": "最长公共子序列(LCS)",
        "7.9": "滚动数组优化", "7.10": "图的定义及存储", "7.11": "图DFS遍历",
        "7.12": "图BFS遍历", "7.13": "泛洪算法(flood fill)", "7.14": "哈希表",
        "8.1": "加法原理", "8.2": "乘法原理", "8.3": "排列",
        "8.4": "组合", "8.5": "杨辉三角", "8.6": "倍增法",
        "8.7": "一元一次方程", "8.8": "二元一次方程", "8.9": "基本图形面积",
        "8.10": "最小生成树(Kruskal)", "8.11": "最小生成树(Prim)",
        "8.12": "最短路径(Dijkstra)", "8.13": "最短路径(Floyd)",
        "8.14": "算法复杂度分析", "8.15": "算法优化"
    }
    return names.get(code, code)

if __name__ == "__main__":
    generate_complete_analysis()
