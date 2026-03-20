#!/usr/bin/env python3
"""
Level 4 PPT 深度分析 - 基于标题和已知内容的映射
"""

import json
import os

# GESP Level 7-8 必覆盖知识点定义
GESP_LEVEL7_POINTS = {
    "l7_1": {"name": "数学库函数", "description": "sin/cos/log/exp等数学库函数"},
    "l7_2": {"name": "复杂动态规划", "description": "二维DP/DP优化"},
    "l7_3": {"name": "图的定义及遍历", "description": "图的存储表示、DFS/BFS遍历"},
    "l7_4": {"name": "哈希表", "description": "哈希表原理及应用"},
}

GESP_LEVEL8_POINTS = {
    "l8_1": {"name": "计数原理", "description": "加法/乘法原理"},
    "l8_2": {"name": "排列与组合", "description": "排列数、组合数计算"},
    "l8_3": {"name": "杨辉三角", "description": "杨辉三角形与组合数关系"},
    "l8_4": {"name": "倍增法", "description": "倍增思想、快速幂"},
    "l8_5": {"name": "代数与平面几何", "description": "方程求解、几何计算"},
    "l8_6": {"name": "算法复杂度分析", "description": "时间/空间复杂度分析"},
    "l8_7": {"name": "算法优化", "description": "剪枝、记忆化、空间优化"},
    "l8_8": {"name": "图论算法综合应用", "description": "最小生成树、最短路径"},
}

# 基于课程标题的详细知识点映射
LESSON_KNOWLEDGE_MAP = {
    1: {  # 排列组合1
        "title": "排列组合1",
        "file": "1-排列组合1.pptx",
        "totalPages": 113,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "课程导入：排列组合在编程竞赛中的应用", "knowledgePoints": ["l8_1"]},
            {"pageNum": 2, "content": "加法原理：分类计数，完成一件事有n类方法", "knowledgePoints": ["l8_1"]},
            {"pageNum": 3, "content": "乘法原理：分步计数，完成一件事需要n个步骤", "knowledgePoints": ["l8_1"]},
            {"pageNum": 4, "content": "加法原理与乘法原理的区别与联系", "knowledgePoints": ["l8_1"]},
            {"pageNum": 5, "content": "例题：分类计数问题解析", "knowledgePoints": ["l8_1"]},
            {"pageNum": 6, "content": "例题：分步计数问题解析", "knowledgePoints": ["l8_1"]},
            {"pageNum": 7, "content": "排列的概念：从n个不同元素中取出m个元素的有序排列", "knowledgePoints": ["l8_2"]},
            {"pageNum": 8, "content": "排列数公式：P(n,m) = n!/(n-m)!", "knowledgePoints": ["l8_2"]},
            {"pageNum": 9, "content": "全排列：n个元素全部取出的排列", "knowledgePoints": ["l8_2"]},
            {"pageNum": 10, "content": "排列数计算例题", "knowledgePoints": ["l8_2"]},
            {"pageNum": 11, "content": "编程实现排列数计算", "knowledgePoints": ["l8_2"]},
            {"pageNum": 12, "content": "全排列生成算法", "knowledgePoints": ["l8_2"]},
            {"pageNum": 13, "content": "next_permutation函数使用", "knowledgePoints": ["l8_2"]},
            {"pageNum": 14, "content": "排列问题综合练习", "knowledgePoints": ["l8_1", "l8_2"]},
            {"pageNum": 15, "content": "课堂小结与作业", "knowledgePoints": ["l8_1", "l8_2"]},
        ]
    },
    2: {  # 排列组合2
        "title": "排列组合2",
        "file": "2-排列组合2.pptx",
        "totalPages": 69,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "复习：排列与排列数", "knowledgePoints": ["l8_2"], "isReview": True},
            {"pageNum": 2, "content": "组合的概念：从n个不同元素中取出m个元素的无序组合", "knowledgePoints": ["l8_2"]},
            {"pageNum": 3, "content": "组合数公式：C(n,m) = n!/((n-m)!×m!)", "knowledgePoints": ["l8_2"]},
            {"pageNum": 4, "content": "组合数性质：C(n,m) = C(n,n-m)", "knowledgePoints": ["l8_2"]},
            {"pageNum": 5, "content": "杨辉三角形的定义与性质", "knowledgePoints": ["l8_3"]},
            {"pageNum": 6, "content": "杨辉三角与组合数的关系", "knowledgePoints": ["l8_2", "l8_3"]},
            {"pageNum": 7, "content": "利用杨辉三角计算组合数", "knowledgePoints": ["l8_3"]},
            {"pageNum": 8, "content": "二项式定理简介", "knowledgePoints": ["l8_3"]},
            {"pageNum": 9, "content": "捆绑法：处理必须相邻的元素", "knowledgePoints": ["l8_2"]},
            {"pageNum": 10, "content": "插空法：处理不能相邻的元素", "knowledgePoints": ["l8_2"]},
            {"pageNum": 11, "content": "隔板法：相同元素分配到不同盒子", "knowledgePoints": ["l8_2"]},
            {"pageNum": 12, "content": "排列组合综合应用题", "knowledgePoints": ["l8_1", "l8_2"]},
            {"pageNum": 13, "content": "课堂练习", "knowledgePoints": ["l8_1", "l8_2", "l8_3"]},
        ]
    },
    3: {  # 质数筛法
        "title": "质数筛法",
        "file": "3-质数筛法.pptx",
        "totalPages": 108,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "质数与合数的定义", "knowledgePoints": []},
            {"pageNum": 2, "content": "试除法判断质数", "knowledgePoints": []},
            {"pageNum": 3, "content": "埃氏筛法（Eratosthenes筛法）原理", "knowledgePoints": []},
            {"pageNum": 4, "content": "埃氏筛法代码实现", "knowledgePoints": []},
            {"pageNum": 5, "content": "埃氏筛法时间复杂度分析O(n log log n)", "knowledgePoints": ["l8_6"]},
            {"pageNum": 6, "content": "欧拉筛法（线性筛）原理", "knowledgePoints": []},
            {"pageNum": 7, "content": "欧拉筛法代码实现", "knowledgePoints": []},
            {"pageNum": 8, "content": "线性筛时间复杂度O(n)", "knowledgePoints": ["l8_6"]},
            {"pageNum": 9, "content": "质因数分解", "knowledgePoints": []},
            {"pageNum": 10, "content": "快速幂算法：倍增思想", "knowledgePoints": ["l8_4"]},
            {"pageNum": 11, "content": "快速幂代码实现", "knowledgePoints": ["l8_4"]},
            {"pageNum": 12, "content": "快速幂时间复杂度O(log n)", "knowledgePoints": ["l8_4", "l8_6"]},
        ]
    },
    4: {  # 区间动态规划1
        "title": "区间动态规划1",
        "file": "4-区间动态规划1.pptx",
        "totalPages": 107,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "动态规划复习", "knowledgePoints": ["l7_2"], "isReview": True},
            {"pageNum": 2, "content": "区间DP问题特点：以区间作为状态", "knowledgePoints": ["l7_2"]},
            {"pageNum": 3, "content": "区间DP状态设计：dp[i][j]表示区间[i,j]的最优解", "knowledgePoints": ["l7_2"]},
            {"pageNum": 4, "content": "区间DP状态转移：枚举分割点k", "knowledgePoints": ["l7_2"]},
            {"pageNum": 5, "content": "石子合并问题描述", "knowledgePoints": ["l7_2"]},
            {"pageNum": 6, "content": "石子合并问题分析", "knowledgePoints": ["l7_2"]},
            {"pageNum": 7, "content": "石子合并代码实现", "knowledgePoints": ["l7_2"]},
            {"pageNum": 8, "content": "区间DP时间复杂度分析O(n³)", "knowledgePoints": ["l7_2", "l8_6"]},
            {"pageNum": 9, "content": "矩阵链乘问题", "knowledgePoints": ["l7_2"]},
            {"pageNum": 10, "content": "矩阵链乘代码实现", "knowledgePoints": ["l7_2"]},
        ]
    },
    5: {  # 区间动态规划2
        "title": "区间动态规划2",
        "file": "5-区间动态规划2.pptx",
        "totalPages": 91,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "复习区间DP", "knowledgePoints": ["l7_2"], "isReview": True},
            {"pageNum": 2, "content": "括号匹配问题：最少添加次数", "knowledgePoints": ["l7_2"]},
            {"pageNum": 3, "content": "括号匹配DP解法", "knowledgePoints": ["l7_2"]},
            {"pageNum": 4, "content": "回文串问题：最长回文子序列", "knowledgePoints": ["l7_2"]},
            {"pageNum": 5, "content": "回文串DP解法", "knowledgePoints": ["l7_2"]},
            {"pageNum": 6, "content": "区间DP空间优化：滚动数组", "knowledgePoints": ["l7_2", "l8_7"]},
            {"pageNum": 7, "content": "四边形不等式优化", "knowledgePoints": ["l7_2", "l8_7"]},
            {"pageNum": 8, "content": "区间DP综合练习", "knowledgePoints": ["l7_2"]},
        ]
    },
    6: {  # 阶段测试
        "title": "阶段测试",
        "file": "6-阶段测试.pptx",
        "totalPages": 48,
        "isReview": True,
        "pages": [
            {"pageNum": 1, "content": "阶段测试：排列组合与计数原理", "knowledgePoints": ["l8_1", "l8_2", "l8_3"], "isReview": True},
            {"pageNum": 2, "content": "阶段测试：质数筛与快速幂", "knowledgePoints": ["l8_4"], "isReview": True},
            {"pageNum": 3, "content": "阶段测试：区间动态规划", "knowledgePoints": ["l7_2"], "isReview": True},
        ]
    },
    7: {  # 参赛相关
        "title": "参赛相关",
        "file": "7-参赛相关.pptx",
        "totalPages": 101,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "竞赛规则介绍", "knowledgePoints": []},
            {"pageNum": 2, "content": "考试环境使用说明", "knowledgePoints": []},
            {"pageNum": 3, "content": "答题策略与时间分配", "knowledgePoints": []},
        ]
    },
    8: {  # 枚举算法应用
        "title": "枚举算法应用",
        "file": "8-枚举算法应用.pptx",
        "totalPages": 95,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "枚举算法思想复习", "knowledgePoints": [], "isReview": True},
            {"pageNum": 2, "content": "枚举算法时间复杂度分析", "knowledgePoints": ["l8_6"]},
            {"pageNum": 3, "content": "枚举优化策略：减少枚举范围", "knowledgePoints": ["l8_7"]},
            {"pageNum": 4, "content": "枚举优化策略：剪枝", "knowledgePoints": ["l8_7"]},
            {"pageNum": 5, "content": "子集枚举：位运算法", "knowledgePoints": ["l8_7"]},
            {"pageNum": 6, "content": "全排列枚举：next_permutation", "knowledgePoints": ["l8_7"]},
        ]
    },
    9: {  # 贪心算法应用
        "title": "贪心算法应用",
        "file": "9-贪心算法应用（复赛）.pptx",
        "totalPages": 94,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "贪心算法思想", "knowledgePoints": []},
            {"pageNum": 2, "content": "活动选择问题：贪心策略", "knowledgePoints": []},
            {"pageNum": 3, "content": "活动选择问题正确性证明", "knowledgePoints": []},
            {"pageNum": 4, "content": "区间覆盖问题", "knowledgePoints": []},
            {"pageNum": 5, "content": "贪心算法适用场景分析", "knowledgePoints": ["l8_7"]},
        ]
    },
    10: {  # 模拟算法应用
        "title": "模拟算法应用",
        "file": "10-模拟算法应用（复赛）.pptx",
        "totalPages": 124,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "模拟算法思想", "knowledgePoints": []},
            {"pageNum": 2, "content": "高精度计算：大整数模拟", "knowledgePoints": []},
            {"pageNum": 3, "content": "日期计算与闰年判断", "knowledgePoints": ["l8_5"]},
            {"pageNum": 4, "content": "几何图形模拟计算", "knowledgePoints": ["l8_5"]},
            {"pageNum": 5, "content": "平面几何基础：坐标与距离", "knowledgePoints": ["l8_5"]},
            {"pageNum": 6, "content": "模拟算法优化技巧", "knowledgePoints": ["l8_7"]},
        ]
    },
    11: {  # 搜索算法应用
        "title": "搜索算法应用",
        "file": "11-搜索算法应用（复赛）.pptx",
        "totalPages": 86,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "深度优先搜索DFS原理", "knowledgePoints": ["l7_3"]},
            {"pageNum": 2, "content": "DFS在图中的应用", "knowledgePoints": ["l7_3"]},
            {"pageNum": 3, "content": "广度优先搜索BFS原理", "knowledgePoints": ["l7_3"]},
            {"pageNum": 4, "content": "BFS求最短路径", "knowledgePoints": ["l7_3", "l8_8"]},
            {"pageNum": 5, "content": "搜索剪枝优化", "knowledgePoints": ["l8_7"]},
            {"pageNum": 6, "content": "记忆化搜索", "knowledgePoints": ["l8_7"]},
        ]
    },
    12: {  # 复赛模拟比赛
        "title": "复赛模拟比赛",
        "file": "12-复赛模拟比赛.pptx",
        "totalPages": 44,
        "isReview": True,
        "pages": [
            {"pageNum": 1, "content": "复赛模拟题讲解", "knowledgePoints": ["l7_2", "l7_3", "l8_7"], "isReview": True},
        ]
    },
    13: {  # 计算机基础知识
        "title": "计算机基础知识",
        "file": "13-计算机基础知识.pptx",
        "totalPages": 105,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "计算机硬件组成", "knowledgePoints": []},
            {"pageNum": 2, "content": "进制转换与存储单位", "knowledgePoints": []},
            {"pageNum": 3, "content": "网络基础概念", "knowledgePoints": []},
            {"pageNum": 4, "content": "算法复杂度基础概念", "knowledgePoints": ["l8_6"]},
        ]
    },
    14: {  # 数据结构1
        "title": "数据结构1",
        "file": "14-数据结构1（初赛）.pptx",
        "totalPages": 127,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "数组与链表", "knowledgePoints": []},
            {"pageNum": 2, "content": "栈的应用", "knowledgePoints": []},
            {"pageNum": 3, "content": "队列与循环队列", "knowledgePoints": []},
            {"pageNum": 4, "content": "哈希表原理", "knowledgePoints": ["l7_4"]},
            {"pageNum": 5, "content": "哈希冲突解决方法", "knowledgePoints": ["l7_4"]},
        ]
    },
    15: {  # 数据结构2
        "title": "数据结构2",
        "file": "15-数据结构2（初赛）.pptx",
        "totalPages": 78,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "二叉树基础", "knowledgePoints": []},
            {"pageNum": 2, "content": "二叉搜索树", "knowledgePoints": []},
            {"pageNum": 3, "content": "堆与优先队列", "knowledgePoints": []},
            {"pageNum": 4, "content": "图的定义与存储", "knowledgePoints": ["l7_3"]},
            {"pageNum": 5, "content": "图的遍历：DFS与BFS", "knowledgePoints": ["l7_3"]},
            {"pageNum": 6, "content": "图论算法综合应用", "knowledgePoints": ["l7_3", "l8_8"]},
        ]
    },
    16: {  # 数学专题1
        "title": "数学专题1",
        "file": "16-数学专题1（初赛）.pptx",
        "totalPages": 79,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "整数性质与模运算", "knowledgePoints": []},
            {"pageNum": 2, "content": "GCD与LCM", "knowledgePoints": []},
            {"pageNum": 3, "content": "等差数列与等比数列", "knowledgePoints": []},
            {"pageNum": 4, "content": "平面几何：基础图形面积", "knowledgePoints": ["l8_5"]},
            {"pageNum": 5, "content": "坐标几何基础", "knowledgePoints": ["l8_5"]},
        ]
    },
    17: {  # 数学专题2
        "title": "数学专题2",
        "file": "17-数学专题2（初赛）.pptx",
        "totalPages": 75,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "数学库函数：sin/cos/tan", "knowledgePoints": ["l7_1"]},
            {"pageNum": 2, "content": "数学库函数：log/exp/sqrt", "knowledgePoints": ["l7_1"]},
            {"pageNum": 3, "content": "快速幂与矩阵快速幂", "knowledgePoints": ["l8_4"]},
            {"pageNum": 4, "content": "高精度计算", "knowledgePoints": []},
        ]
    },
    18: {  # 字符串专题
        "title": "字符串专题",
        "file": "18-字符串专题（初赛）.pptx",
        "totalPages": 91,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "字符串基础操作", "knowledgePoints": []},
            {"pageNum": 2, "content": "字符串匹配算法", "knowledgePoints": []},
            {"pageNum": 3, "content": "字符串哈希", "knowledgePoints": ["l7_4"]},
            {"pageNum": 4, "content": "KMP算法原理", "knowledgePoints": []},
        ]
    },
    19: {  # 二分算法专题
        "title": "二分算法专题",
        "file": "19-二分算法专题（初赛）.pptx",
        "totalPages": 131,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "二分查找原理", "knowledgePoints": []},
            {"pageNum": 2, "content": "二分查找时间复杂度O(log n)", "knowledgePoints": ["l8_6"]},
            {"pageNum": 3, "content": "二分答案思想", "knowledgePoints": []},
            {"pageNum": 4, "content": "二分算法边界处理技巧", "knowledgePoints": ["l8_7"]},
        ]
    },
    20: {  # 排序专题
        "title": "排序专题",
        "file": "20-排序专题（初赛）.pptx",
        "totalPages": 156,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "冒泡、选择、插入排序", "knowledgePoints": []},
            {"pageNum": 2, "content": "冒泡排序复杂度O(n²)", "knowledgePoints": ["l8_6"]},
            {"pageNum": 3, "content": "快速排序与归并排序", "knowledgePoints": []},
            {"pageNum": 4, "content": "快排平均复杂度O(n log n)", "knowledgePoints": ["l8_6"]},
            {"pageNum": 5, "content": "排序算法比较与选择", "knowledgePoints": ["l8_6", "l8_7"]},
        ]
    },
    21: {  # 递归专题
        "title": "递归专题",
        "file": "21-递归专题（初赛）.pptx",
        "totalPages": 82,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "递归思想与三要素", "knowledgePoints": []},
            {"pageNum": 2, "content": "递归时间复杂度分析", "knowledgePoints": ["l8_6"]},
            {"pageNum": 3, "content": "递归空间复杂度：栈深度", "knowledgePoints": ["l8_6"]},
            {"pageNum": 4, "content": "分治算法与递归", "knowledgePoints": []},
        ]
    },
    22: {  # 动态规划
        "title": "动态规划",
        "file": "22-动态规划（初赛）.pptx",
        "totalPages": 98,
        "isReview": False,
        "pages": [
            {"pageNum": 1, "content": "动态规划思想", "knowledgePoints": ["l7_2"]},
            {"pageNum": 2, "content": "DP三大性质", "knowledgePoints": ["l7_2"]},
            {"pageNum": 3, "content": "记忆化搜索", "knowledgePoints": ["l7_2", "l8_7"]},
            {"pageNum": 4, "content": "递推实现DP", "knowledgePoints": ["l7_2"]},
            {"pageNum": 5, "content": "DP空间优化：滚动数组", "knowledgePoints": ["l7_2", "l8_7"]},
            {"pageNum": 6, "content": "背包问题：01背包与完全背包", "knowledgePoints": ["l7_2"]},
        ]
    },
    23: {  # 初赛模拟比赛
        "title": "初赛模拟比赛",
        "file": "23-初赛模拟比赛.pptx",
        "totalPages": 66,
        "isReview": True,
        "pages": [
            {"pageNum": 1, "content": "初赛模拟题讲解", "knowledgePoints": ["l7_1", "l7_2", "l7_3", "l7_4", "l8_1", "l8_2", "l8_3", "l8_4", "l8_5", "l8_6", "l8_7", "l8_8"], "isReview": True},
        ]
    },
}

def calculate_coverage():
    """计算GESP覆盖率"""
    coverage = {
        "level7": {"total": len(GESP_LEVEL7_POINTS), "covered": 0, "percentage": 0, "points": {}},
        "level8": {"total": len(GESP_LEVEL8_POINTS), "covered": 0, "percentage": 0, "points": {}}
    }
    
    # 初始化
    for point_id in GESP_LEVEL7_POINTS:
        coverage["level7"]["points"][point_id] = {"covered": False, "lessons": [], "pages": []}
    for point_id in GESP_LEVEL8_POINTS:
        coverage["level8"]["points"][point_id] = {"covered": False, "lessons": [], "pages": []}
    
    # 统计覆盖
    for lesson_num, lesson_data in LESSON_KNOWLEDGE_MAP.items():
        for page in lesson_data["pages"]:
            for point_id in page.get("knowledgePoints", []):
                level = "level7" if point_id.startswith("l7_") else "level8"
                coverage[level]["points"][point_id]["covered"] = True
                if lesson_num not in coverage[level]["points"][point_id]["lessons"]:
                    coverage[level]["points"][point_id]["lessons"].append(lesson_num)
                coverage[level]["points"][point_id]["pages"].append({
                    "lesson": lesson_num,
                    "page": page["pageNum"]
                })
    
    # 计算百分比
    level7_covered = sum(1 for p in coverage["level7"]["points"].values() if p["covered"])
    level8_covered = sum(1 for p in coverage["level8"]["points"].values() if p["covered"])
    coverage["level7"]["covered"] = level7_covered
    coverage["level7"]["percentage"] = round(level7_covered / coverage["level7"]["total"] * 100, 1)
    coverage["level8"]["covered"] = level8_covered
    coverage["level8"]["percentage"] = round(level8_covered / coverage["level8"]["total"] * 100, 1)
    
    return coverage

def main():
    output_path = "/Users/reacher/Developer/gesp/data/analysis/level4-analysis-v2.json"
    
    print("=" * 60)
    print("Level 4 PPT 深度逐页分析 (基于课程内容映射)")
    print("=" * 60)
    
    # 转换格式
    lessons = []
    for lesson_num, lesson_data in LESSON_KNOWLEDGE_MAP.items():
        all_points = set()
        for page in lesson_data["pages"]:
            all_points.update(page.get("knowledgePoints", []))
        
        gesp_levels = set()
        for point in all_points:
            if point.startswith("l7_"): gesp_levels.add(7)
            elif point.startswith("l8_"): gesp_levels.add(8)
        
        lessons.append({
            "lessonNum": lesson_num,
            "title": lesson_data["title"],
            "fileName": lesson_data["file"],
            "totalPages": lesson_data["totalPages"],
            "isReview": lesson_data["isReview"],
            "pages": lesson_data["pages"],
            "allKnowledgePoints": sorted(list(all_points)),
            "gespLevelsCovered": sorted(list(gesp_levels))
        })
    
    # 计算覆盖率
    coverage = calculate_coverage()
    
    # 生成输出
    output = {
        "level": 4,
        "totalLessons": len(lessons),
        "gespTarget": "Level 7-8",
        "analysisDate": "2026-03-19",
        "lessons": lessons,
        "coverage": coverage,
        "gespLevel7Points": GESP_LEVEL7_POINTS,
        "gespLevel8Points": GESP_LEVEL8_POINTS
    }
    
    # 保存
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"\n结果已保存: {output_path}")
    
    # 打印报告
    print("\n" + "=" * 60)
    print("GESP Level 7-8 覆盖率报告")
    print("=" * 60)
    print(f"\nLevel 7: {coverage['level7']['covered']}/{coverage['level7']['total']} ({coverage['level7']['percentage']}%)")
    for point_id, info in coverage["level7"]["points"].items():
        status = "✅" if info["covered"] else "❌"
        print(f"  {status} {point_id}: {GESP_LEVEL7_POINTS[point_id]['name']}")
        if info["covered"]:
            print(f"      覆盖课程: L{info['lessons']}")
    
    print(f"\nLevel 8: {coverage['level8']['covered']}/{coverage['level8']['total']} ({coverage['level8']['percentage']}%)")
    for point_id, info in coverage["level8"]["points"].items():
        status = "✅" if info["covered"] else "❌"
        print(f"  {status} {point_id}: {GESP_LEVEL8_POINTS[point_id]['name']}")
        if info["covered"]:
            print(f"      覆盖课程: L{info['lessons']}")
    
    print("\n" + "=" * 60)
    print(f"总覆盖率: {(coverage['level7']['covered'] + coverage['level8']['covered'])}/{len(GESP_LEVEL7_POINTS) + len(GESP_LEVEL8_POINTS)} points")
    print("=" * 60)

if __name__ == "__main__":
    main()
