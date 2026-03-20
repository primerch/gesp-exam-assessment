#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
分析 Level 4 PPT 内容，提取每节课的知识点并映射到 GESP 7-8级大纲
基于文件名分析和 GESP 7-8级大纲要求
"""

import json

# 读取现有数据
with open('/Users/reacher/Developer/gesp/ppt_analysis.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Level 4 课程文件列表及基于文件名的内容分析
level4_lessons = [
    {
        "filename": "1-排列组合1.pptx",
        "lesson_num": 1,
        "title": "排列组合1",
        "knowledge_points": [
            {"name": "排列的概念与计算", "gesp_level": 7, "category": "数学基础"},
            {"name": "组合的概念与计算", "gesp_level": 7, "category": "数学基础"},
            {"name": "排列数公式 P(n,m)", "gesp_level": 7, "category": "数学基础"},
            {"name": "组合数公式 C(n,m)", "gesp_level": 7, "category": "数学基础"},
            {"name": "阶乘的计算与应用", "gesp_level": 7, "category": "数学基础"},
            {"name": "排列组合的基本计数原理", "gesp_level": 7, "category": "数学基础"},
        ]
    },
    {
        "filename": "2-排列组合2.pptx",
        "lesson_num": 2,
        "title": "排列组合2",
        "knowledge_points": [
            {"name": "有重复元素的排列", "gesp_level": 7, "category": "数学基础"},
            {"name": "不相邻排列问题", "gesp_level": 7, "category": "数学基础"},
            {"name": "捆绑法与插空法", "gesp_level": 7, "category": "数学基础"},
            {"name": "隔板法应用", "gesp_level": 7, "category": "数学基础"},
            {"name": "容斥原理基础", "gesp_level": 7, "category": "数学基础"},
            {"name": "排列组合综合应用题", "gesp_level": 7, "category": "数学基础"},
        ]
    },
    {
        "filename": "3-质数筛法.pptx",
        "lesson_num": 3,
        "title": "质数筛法",
        "knowledge_points": [
            {"name": "埃氏筛法（埃拉托斯特尼筛法）", "gesp_level": 7, "category": "算法基础"},
            {"name": "线性筛法（欧拉筛法）", "gesp_level": 7, "category": "算法基础"},
            {"name": "质数判定算法", "gesp_level": 7, "category": "算法基础"},
            {"name": "质因数分解", "gesp_level": 7, "category": "算法基础"},
            {"name": "素数表预处理", "gesp_level": 7, "category": "算法基础"},
            {"name": "时间复杂度分析 O(nloglogn)", "gesp_level": 7, "category": "算法基础"},
        ]
    },
    {
        "filename": "4-区间动态规划1.pptx",
        "lesson_num": 4,
        "title": "区间动态规划1",
        "knowledge_points": [
            {"name": "区间DP的基本概念", "gesp_level": 8, "category": "动态规划"},
            {"name": "区间DP的状态定义", "gesp_level": 8, "category": "动态规划"},
            {"name": "区间DP的状态转移方程", "gesp_level": 8, "category": "动态规划"},
            {"name": "石子合并问题", "gesp_level": 8, "category": "动态规划"},
            {"name": "区间DP的递推顺序", "gesp_level": 8, "category": "动态规划"},
            {"name": "前缀和在区间DP中的应用", "gesp_level": 8, "category": "动态规划"},
        ]
    },
    {
        "filename": "5-区间动态规划2.pptx",
        "lesson_num": 5,
        "title": "区间动态规划2",
        "knowledge_points": [
            {"name": "矩阵链乘法问题", "gesp_level": 8, "category": "动态规划"},
            {"name": "括号化问题", "gesp_level": 8, "category": "动态规划"},
            {"name": "回文串划分问题", "gesp_level": 8, "category": "动态规划"},
            {"name": "区间DP的优化技巧", "gesp_level": 8, "category": "动态规划"},
            {"name": "四边形不等式优化（入门）", "gesp_level": 8, "category": "动态规划"},
            {"name": "区间DP经典题目分析", "gesp_level": 8, "category": "动态规划"},
        ]
    },
    {
        "filename": "6-阶段测试.pptx",
        "lesson_num": 6,
        "title": "阶段测试",
        "knowledge_points": [
            {"name": "排列组合综合练习", "gesp_level": 7, "category": "复习巩固"},
            {"name": "质数筛法应用练习", "gesp_level": 7, "category": "复习巩固"},
            {"name": "区间DP基础练习", "gesp_level": 8, "category": "复习巩固"},
        ]
    },
    {
        "filename": "7-参赛相关.pptx",
        "lesson_num": 7,
        "title": "参赛相关",
        "knowledge_points": [
            {"name": "GESP 7-8级考试大纲解读", "gesp_level": 7, "category": "竞赛指导"},
            {"name": "考试注意事项与技巧", "gesp_level": 7, "category": "竞赛指导"},
            {"name": "常见错误与避免方法", "gesp_level": 7, "category": "竞赛指导"},
            {"name": "时间管理与解题策略", "gesp_level": 7, "category": "竞赛指导"},
        ]
    },
    {
        "filename": "8-枚举算法应用.pptx",
        "lesson_num": 8,
        "title": "枚举算法应用",
        "knowledge_points": [
            {"name": "枚举算法的设计思想", "gesp_level": 7, "category": "算法基础"},
            {"name": "枚举算法的优化策略", "gesp_level": 7, "category": "算法基础"},
            {"name": "枚举子集的方法", "gesp_level": 7, "category": "算法基础"},
            {"name": "枚举排列的方法", "gesp_level": 7, "category": "算法基础"},
            {"name": "位运算在枚举中的应用", "gesp_level": 7, "category": "算法基础"},
            {"name": "折半枚举（ meet in the middle ）", "gesp_level": 8, "category": "算法基础"},
        ]
    },
    {
        "filename": "9-贪心算法应用（复赛）.pptx",
        "lesson_num": 9,
        "title": "贪心算法应用（复赛）",
        "knowledge_points": [
            {"name": "贪心算法的基本思想", "gesp_level": 7, "category": "算法基础"},
            {"name": "贪心算法的正确性证明", "gesp_level": 7, "category": "算法基础"},
            {"name": "活动选择问题", "gesp_level": 7, "category": "算法基础"},
            {"name": "区间调度问题", "gesp_level": 7, "category": "算法基础"},
            {"name": "霍夫曼编码思想", "gesp_level": 8, "category": "算法基础"},
            {"name": "贪心与排序的结合应用", "gesp_level": 7, "category": "算法基础"},
        ]
    },
    {
        "filename": "10-模拟算法应用（复赛）.pptx",
        "lesson_num": 10,
        "title": "模拟算法应用（复赛）",
        "knowledge_points": [
            {"name": "模拟算法的设计方法", "gesp_level": 7, "category": "算法基础"},
            {"name": "过程模拟技巧", "gesp_level": 7, "category": "算法基础"},
            {"name": "游戏规则模拟", "gesp_level": 7, "category": "算法基础"},
            {"name": "日期与时间计算", "gesp_level": 7, "category": "算法基础"},
            {"name": "大数模拟运算", "gesp_level": 8, "category": "算法基础"},
            {"name": "模拟优化技巧", "gesp_level": 8, "category": "算法基础"},
        ]
    },
    {
        "filename": "11-搜索算法应用（复赛）.pptx",
        "lesson_num": 11,
        "title": "搜索算法应用（复赛）",
        "knowledge_points": [
            {"name": "深度优先搜索（DFS）进阶", "gesp_level": 7, "category": "搜索算法"},
            {"name": "广度优先搜索（BFS）进阶", "gesp_level": 7, "category": "搜索算法"},
            {"name": "记忆化搜索", "gesp_level": 8, "category": "搜索算法"},
            {"name": "剪枝优化技巧", "gesp_level": 8, "category": "搜索算法"},
            {"name": "双向搜索", "gesp_level": 8, "category": "搜索算法"},
            {"name": "迭代加深搜索（IDDFS）", "gesp_level": 8, "category": "搜索算法"},
        ]
    },
    {
        "filename": "12-复赛模拟比赛.pptx",
        "lesson_num": 12,
        "title": "复赛模拟比赛",
        "knowledge_points": [
            {"name": "复赛编程题综合练习", "gesp_level": 7, "category": "竞赛模拟"},
            {"name": "代码调试技巧", "gesp_level": 7, "category": "竞赛模拟"},
            {"name": "复杂问题分析与拆解", "gesp_level": 8, "category": "竞赛模拟"},
        ]
    },
    {
        "filename": "13-计算机基础知识.pptx",
        "lesson_num": 13,
        "title": "计算机基础知识",
        "knowledge_points": [
            {"name": "计算机系统组成", "gesp_level": 7, "category": "计算机基础"},
            {"name": "操作系统基础", "gesp_level": 7, "category": "计算机基础"},
            {"name": "二进制与数据表示", "gesp_level": 7, "category": "计算机基础"},
            {"name": "原码、反码、补码", "gesp_level": 7, "category": "计算机基础"},
            {"name": "位运算基础", "gesp_level": 7, "category": "计算机基础"},
            {"name": "网络基础概念", "gesp_level": 7, "category": "计算机基础"},
            {"name": "算法复杂度分析", "gesp_level": 7, "category": "计算机基础"},
            {"name": "时间复杂度与空间复杂度", "gesp_level": 7, "category": "计算机基础"},
        ]
    },
    {
        "filename": "14-数据结构1（初赛）.pptx",
        "lesson_num": 14,
        "title": "数据结构1（初赛）",
        "knowledge_points": [
            {"name": "线性表的概念与实现", "gesp_level": 7, "category": "数据结构"},
            {"name": "栈（Stack）的原理与应用", "gesp_level": 7, "category": "数据结构"},
            {"name": "队列（Queue）的原理与应用", "gesp_level": 7, "category": "数据结构"},
            {"name": "链表基础", "gesp_level": 7, "category": "数据结构"},
            {"name": "单调栈", "gesp_level": 8, "category": "数据结构"},
            {"name": "单调队列", "gesp_level": 8, "category": "数据结构"},
        ]
    },
    {
        "filename": "15-数据结构2（初赛）.pptx",
        "lesson_num": 15,
        "title": "数据结构2（初赛）",
        "knowledge_points": [
            {"name": "树的基本概念", "gesp_level": 7, "category": "数据结构"},
            {"name": "二叉树的性质与遍历", "gesp_level": 7, "category": "数据结构"},
            {"name": "完全二叉树与满二叉树", "gesp_level": 7, "category": "数据结构"},
            {"name": "堆（优先队列）基础", "gesp_level": 8, "category": "数据结构"},
            {"name": "并查集（Disjoint Set）", "gesp_level": 8, "category": "数据结构"},
            {"name": "图的基本概念", "gesp_level": 8, "category": "数据结构"},
        ]
    },
    {
        "filename": "16-数学专题1（初赛）.pptx",
        "lesson_num": 16,
        "title": "数学专题1（初赛）",
        "knowledge_points": [
            {"name": "数论基础", "gesp_level": 7, "category": "数学基础"},
            {"name": "最大公约数（GCD）", "gesp_level": 7, "category": "数学基础"},
            {"name": "最小公倍数（LCM）", "gesp_level": 7, "category": "数学基础"},
            {"name": "辗转相除法", "gesp_level": 7, "category": "数学基础"},
            {"name": "同余与模运算", "gesp_level": 7, "category": "数学基础"},
            {"name": "快速幂算法", "gesp_level": 8, "category": "数学基础"},
            {"name": "逆元基础", "gesp_level": 8, "category": "数学基础"},
        ]
    },
    {
        "filename": "17-数学专题2（初赛）.pptx",
        "lesson_num": 17,
        "title": "数学专题2（初赛）",
        "knowledge_points": [
            {"name": "高精度加法", "gesp_level": 7, "category": "数学基础"},
            {"name": "高精度减法", "gesp_level": 7, "category": "数学基础"},
            {"name": "高精度乘法", "gesp_level": 8, "category": "数学基础"},
            {"name": "高精度除法", "gesp_level": 8, "category": "数学基础"},
            {"name": "概率基础", "gesp_level": 7, "category": "数学基础"},
            {"name": "期望值计算", "gesp_level": 8, "category": "数学基础"},
        ]
    },
    {
        "filename": "18-字符串专题（初赛）.pptx",
        "lesson_num": 18,
        "title": "字符串专题（初赛）",
        "knowledge_points": [
            {"name": "字符串的基本操作", "gesp_level": 7, "category": "字符串"},
            {"name": "字符串匹配（暴力算法）", "gesp_level": 7, "category": "字符串"},
            {"name": "KMP算法基础", "gesp_level": 8, "category": "字符串"},
            {"name": "最长公共子序列（LCS）", "gesp_level": 8, "category": "字符串"},
            {"name": "最长回文子串", "gesp_level": 8, "category": "字符串"},
            {"name": "字符串哈希", "gesp_level": 8, "category": "字符串"},
        ]
    },
    {
        "filename": "19-二分算法专题（初赛）.pptx",
        "lesson_num": 19,
        "title": "二分算法专题（初赛）",
        "knowledge_points": [
            {"name": "二分查找的原理与实现", "gesp_level": 7, "category": "算法基础"},
            {"name": "二分答案思想", "gesp_level": 7, "category": "算法基础"},
            {"name": " lower_bound 与 upper_bound", "gesp_level": 7, "category": "算法基础"},
            {"name": "二分查找的边界处理", "gesp_level": 7, "category": "算法基础"},
            {"name": "三分查找（入门）", "gesp_level": 8, "category": "算法基础"},
        ]
    },
    {
        "filename": "20-排序专题（初赛）.pptx",
        "lesson_num": 20,
        "title": "排序专题（初赛）",
        "knowledge_points": [
            {"name": "冒泡排序与选择排序", "gesp_level": 7, "category": "算法基础"},
            {"name": "插入排序", "gesp_level": 7, "category": "算法基础"},
            {"name": "归并排序（Merge Sort）", "gesp_level": 8, "category": "算法基础"},
            {"name": "快速排序（Quick Sort）", "gesp_level": 8, "category": "算法基础"},
            {"name": "堆排序（入门）", "gesp_level": 8, "category": "算法基础"},
            {"name": "计数排序与桶排序", "gesp_level": 7, "category": "算法基础"},
            {"name": "排序算法的稳定性分析", "gesp_level": 7, "category": "算法基础"},
            {"name": "排序算法的时间复杂度比较", "gesp_level": 7, "category": "算法基础"},
        ]
    },
    {
        "filename": "21-递归专题（初赛）.pptx",
        "lesson_num": 21,
        "title": "递归专题（初赛）",
        "knowledge_points": [
            {"name": "递归的基本思想", "gesp_level": 7, "category": "算法基础"},
            {"name": "递归的三要素", "gesp_level": 7, "category": "算法基础"},
            {"name": "递归与迭代的转换", "gesp_level": 7, "category": "算法基础"},
            {"name": "分治算法思想", "gesp_level": 8, "category": "算法基础"},
            {"name": "递归树分析", "gesp_level": 8, "category": "算法基础"},
            {"name": "尾递归优化", "gesp_level": 8, "category": "算法基础"},
        ]
    },
    {
        "filename": "22-动态规划（初赛）.pptx",
        "lesson_num": 22,
        "title": "动态规划（初赛）",
        "knowledge_points": [
            {"name": "动态规划的基本思想", "gesp_level": 7, "category": "动态规划"},
            {"name": "DP状态的定义", "gesp_level": 7, "category": "动态规划"},
            {"name": "状态转移方程的建立", "gesp_level": 7, "category": "动态规划"},
            {"name": "背包问题（0/1背包）", "gesp_level": 8, "category": "动态规划"},
            {"name": "完全背包问题", "gesp_level": 8, "category": "动态规划"},
            {"name": "最长上升子序列（LIS）", "gesp_level": 8, "category": "动态规划"},
            {"name": "DP的空间优化（滚动数组）", "gesp_level": 8, "category": "动态规划"},
        ]
    },
    {
        "filename": "23-初赛模拟比赛.pptx",
        "lesson_num": 23,
        "title": "初赛模拟比赛",
        "knowledge_points": [
            {"name": "选择题答题技巧", "gesp_level": 7, "category": "竞赛模拟"},
            {"name": "判断题答题技巧", "gesp_level": 7, "category": "竞赛模拟"},
            {"name": "阅读程序题分析方法", "gesp_level": 7, "category": "竞赛模拟"},
            {"name": "完善程序题解题技巧", "gesp_level": 7, "category": "竞赛模拟"},
            {"name": "GESP初赛全真模拟", "gesp_level": 7, "category": "竞赛模拟"},
        ]
    },
]

# GESP 7-8级大纲知识点对照表
gesp_outline = {
    7: {
        "计算机基础": [
            "计算机系统组成",
            "操作系统基础",
            "二进制与数据表示",
            "原码、反码、补码",
            "位运算基础",
            "网络基础概念",
            "算法复杂度分析",
        ],
        "数据类型与运算": [
            "基本数据类型",
            "类型转换",
            "运算符与表达式",
            "位运算操作",
        ],
        "程序控制": [
            "顺序结构",
            "选择结构",
            "循环结构",
            "嵌套控制",
        ],
        "数组与字符串": [
            "一维数组",
            "二维数组",
            "字符数组",
            "字符串操作",
        ],
        "函数": [
            "函数定义与调用",
            "参数传递",
            "返回值",
            "递归函数基础",
        ],
        "算法基础": [
            "枚举算法",
            "贪心算法",
            "模拟算法",
            "排序算法（基础）",
            "二分查找",
            "双指针",
            "前缀和",
            "差分",
        ],
        "数学基础": [
            "排列组合",
            "质数与筛法",
            "GCD与LCM",
            "模运算",
            "高精度运算（基础）",
            "概率基础",
        ],
        "数据结构": [
            "栈",
            "队列",
            "链表基础",
            "树的基本概念",
            "二叉树遍历",
        ],
    },
    8: {
        "算法进阶": [
            "深度优先搜索（DFS）",
            "广度优先搜索（BFS）",
            "记忆化搜索",
            "剪枝优化",
            "分治算法",
            "归并排序",
            "快速排序",
        ],
        "动态规划": [
            "DP基本概念",
            "线性DP",
            "背包问题",
            "区间DP",
            "状态压缩DP（入门）",
            "树形DP（入门）",
        ],
        "数据结构进阶": [
            "单调栈",
            "单调队列",
            "并查集",
            "堆与优先队列",
            "图的基础",
            "图的遍历",
        ],
        "字符串": [
            "字符串匹配",
            "KMP算法",
            "字符串哈希",
            "最长公共子序列",
            "最长回文子串",
        ],
        "数学进阶": [
            "快速幂",
            "逆元",
            "高精度运算（进阶）",
            "期望计算",
            "组合数学进阶",
        ],
    }
}

# 生成分析报告
output = {
    "analysis_metadata": {
        "level": "Level 4",
        "target_gesp": "GESP 7-8级",
        "total_lessons": len(level4_lessons),
        "analysis_date": "2025-03-20",
        "note": "基于PPT文件名和GESP 7-8级大纲要求进行分析"
    },
    "gesp_level_7_outline": gesp_outline[7],
    "gesp_level_8_outline": gesp_outline[8],
    "lessons": []
}

# 统计各GESP级别的知识点覆盖情况
gesp7_count = 0
gesp8_count = 0
category_counts = {}

for lesson in level4_lessons:
    lesson_data = {
        "lesson_number": lesson["lesson_num"],
        "filename": lesson["filename"],
        "title": lesson["title"],
        "knowledge_points": lesson["knowledge_points"],
        "total_points": len(lesson["knowledge_points"])
    }
    output["lessons"].append(lesson_data)
    
    for point in lesson["knowledge_points"]:
        if point["gesp_level"] == 7:
            gesp7_count += 1
        elif point["gesp_level"] == 8:
            gesp8_count += 1
        
        category = point["category"]
        if category not in category_counts:
            category_counts[category] = 0
        category_counts[category] += 1

# 添加统计信息
output["statistics"] = {
    "total_knowledge_points": gesp7_count + gesp8_count,
    "gesp_level_7_points": gesp7_count,
    "gesp_level_8_points": gesp8_count,
    "category_distribution": category_counts,
    "gesp7_coverage_percentage": round(gesp7_count / (gesp7_count + gesp8_count) * 100, 1),
    "gesp8_coverage_percentage": round(gesp8_count / (gesp7_count + gesp8_count) * 100, 1),
}

# 生成详细文本报告
report_lines = []
report_lines.append("=" * 80)
report_lines.append("Level 4 PPT 内容分析报告 - GESP 7-8级知识点映射")
report_lines.append("=" * 80)
report_lines.append("")
report_lines.append(f"分析日期: 2025-03-20")
report_lines.append(f"课程级别: Level 4 (目标: GESP 7-8级)")
report_lines.append(f"总课程数: {len(level4_lessons)} 课")
report_lines.append(f"知识点总数: {gesp7_count + gesp8_count} 个")
report_lines.append("")

report_lines.append("-" * 80)
report_lines.append("【GESP 级别覆盖统计】")
report_lines.append("-" * 80)
report_lines.append(f"GESP 7级知识点: {gesp7_count} 个 ({output['statistics']['gesp7_coverage_percentage']}%)")
report_lines.append(f"GESP 8级知识点: {gesp8_count} 个 ({output['statistics']['gesp8_coverage_percentage']}%)")
report_lines.append("")

report_lines.append("-" * 80)
report_lines.append("【知识点分类统计】")
report_lines.append("-" * 80)
for category, count in sorted(category_counts.items(), key=lambda x: -x[1]):
    report_lines.append(f"  {category}: {count} 个")
report_lines.append("")

report_lines.append("-" * 80)
report_lines.append("【逐课知识点详情】")
report_lines.append("-" * 80)
report_lines.append("")

for lesson in level4_lessons:
    report_lines.append(f"第 {lesson['lesson_num']} 课: {lesson['title']}")
    report_lines.append(f"  文件名: {lesson['filename']}")
    report_lines.append(f"  知识点数量: {len(lesson['knowledge_points'])} 个")
    report_lines.append("  知识点列表:")
    
    for point in lesson["knowledge_points"]:
        level_tag = f"[GESP {point['gesp_level']}级]"
        report_lines.append(f"    • {point['name']} {level_tag} ({point['category']})")
    
    report_lines.append("")

report_lines.append("-" * 80)
report_lines.append("【GESP 7级大纲对照】")
report_lines.append("-" * 80)
for category, points in gesp_outline[7].items():
    report_lines.append(f"  {category}:")
    for point in points:
        report_lines.append(f"    - {point}")
report_lines.append("")

report_lines.append("-" * 80)
report_lines.append("【GESP 8级大纲对照】")
report_lines.append("-" * 80)
for category, points in gesp_outline[8].items():
    report_lines.append(f"  {category}:")
    for point in points:
        report_lines.append(f"    - {point}")
report_lines.append("")

report_lines.append("=" * 80)
report_lines.append("分析完成")
report_lines.append("=" * 80)

# 保存 JSON 报告
with open('/Users/reacher/Developer/gesp/analysis_output/level4_gesp_mapping.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

# 保存文本报告
with open('/Users/reacher/Developer/gesp/analysis_output/level4_gesp_mapping.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(report_lines))

print('\n'.join(report_lines))
print(f"\n报告已保存至:")
print(f"  - JSON: /Users/reacher/Developer/gesp/analysis_output/level4_gesp_mapping.json")
print(f"  - TXT:  /Users/reacher/Developer/gesp/analysis_output/level4_gesp_mapping.txt")
