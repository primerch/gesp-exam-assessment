#!/usr/bin/env python3
"""
验证Level 3-4知识点到GESP 5-8级的映射准确性
"""

import json
from collections import defaultdict

# 加载GESP大纲
def load_gesp_outline():
    with open('/Users/reacher/Developer/gesp/data/gesp_cpp_outline.json', 'r', encoding='utf-8') as f:
        return json.load(f)

# GESP 5-8级知识点定义（基于大纲）
def get_gesp5_points():
    """GESP 5级考点 - 高级算法"""
    return {
        "5.1": "初等数论基础",
        "5.2": "辗转相除法(欧几里得算法)",
        "5.3": "素数筛法",
        "5.4": "唯一分解定理",
        "5.5": "算法复杂度估算(高级)",
        "5.6": "高精度运算",
        "5.7": "链表",
        "5.8": "二分查找",
        "5.9": "二分答案",
        "5.10": "递归算法",
        "5.11": "分治算法",
        "5.12": "贪心算法",
    }

def get_gesp6_points():
    """GESP 6级考点 - 搜索与DP"""
    return {
        "6.1": "树的基本概念",
        "6.2": "哈夫曼树",
        "6.3": "完全二叉树",
        "6.4": "二叉排序树",
        "6.5": "哈夫曼编码",
        "6.6": "格雷编码",
        "6.7": "深度优先搜索(DFS)",
        "6.8": "广度优先搜索(BFS)",
        "6.9": "二叉树搜索算法",
        "6.10": "一维动态规划",
        "6.11": "简单背包问题",
        "6.12": "面向对象",
        "6.13": "栈",
        "6.14": "队列",
    }

def get_gesp7_points():
    """GESP 7级考点 - 图论与DP"""
    return {
        "7.1": "三角函数",
        "7.2": "对数函数",
        "7.3": "指数函数",
        "7.4": "二维动态规划",
        "7.5": "动态规划最值优化",
        "7.6": "图的定义",
        "7.7": "图的深度优先遍历",
        "7.8": "图的广度优先遍历",
        "7.9": "泛洪算法(flood fill)",
        "7.10": "哈希表",
    }

def get_gesp8_points():
    """GESP 8级考点 - 综合应用"""
    return {
        "8.1": "计数原理",
        "8.2": "排列",
        "8.3": "组合",
        "8.4": "杨辉三角",
        "8.5": "倍增法",
        "8.6": "代数基础",
        "8.7": "平面几何",
        "8.8": "最小生成树(kruskal/prim)",
        "8.9": "最短路径(dijkstra/Floyd)",
        "8.10": "图论算法综合应用",
        "8.11": "算法复杂度分析",
        "8.12": "算法优化",
    }

# Level 3知识点映射（从curriculum-data.ts提取）
def get_level3_knowledge_mapping():
    """Level 3知识点及其GES映射"""
    return {
        # 基础内容（可能不应该映射到GESP 5-6）
        "l3_1_0": {"name": "string进阶", "gesp": ["5.4", "5.5", "5.6"]},
        "l3_1_1": {"name": "字符串函数", "gesp": ["5.4", "5.5", "5.6"]},
        "l3_3_6": {"name": "函数进阶", "gesp": ["5.1", "5.5", "5.6"]},
        "l3_3_7": {"name": "二维数组", "gesp": ["5.1", "5.5", "5.6"]},
        "l3_3_8": {"name": "分支结构", "gesp": ["5.1", "5.5", "5.6"]},
        "l3_4_9": {"name": "for循环进阶", "gesp": ["5.2", "5.5", "5.6"]},
        "l3_4_10": {"name": "while循环", "gesp": ["5.2", "5.5", "5.6"]},
        "l3_4_11": {"name": "sort函数", "gesp": ["5.2", "5.5", "5.6"]},
        "l3_5_12": {"name": "循环控制", "gesp": ["5.5", "5.6", "6.1"]},
        "l3_6_14": {"name": "循环嵌套", "gesp": ["5.2", "5.6", "6.1"]},
        "l3_6_15": {"name": "图形输出", "gesp": ["5.2", "5.6", "6.1"]},
        "l3_7_17": {"name": "字符串遍历", "gesp": ["5.1", "5.4", "5.5"]},
        "l3_7_18": {"name": "for循环应用", "gesp": ["5.1", "5.4", "5.5"]},
        "l3_7_19": {"name": "函数返回值", "gesp": ["5.1", "5.4", "5.5"]},
        "l3_8_20": {"name": "string类型", "gesp": ["5.3", "5.4", "5.5", "6.2"]},
        "l3_8_21": {"name": "字符数组", "gesp": ["5.3", "5.4", "5.5", "6.2"]},
        "l3_8_22": {"name": "标记法", "gesp": ["5.3", "5.4", "5.5", "6.2"]},
        "l3_8_23": {"name": "桶排序", "gesp": ["5.3", "5.4", "5.5", "6.2"]},
        "l3_9_24": {"name": "字符串操作", "gesp": ["5.4", "5.5", "5.6", "6.2"]},
        "l3_9_25": {"name": "排序算法", "gesp": ["5.4", "5.5", "5.6", "6.2"]},
        "l3_10_26": {"name": "数位分离", "gesp": ["5.4", "5.5", "5.6", "6.2", "6.3"]},
        "l3_10_27": {"name": "格式化输入输出", "gesp": ["5.4", "5.5", "5.6", "6.2", "6.3"]},
        "l3_10_28": {"name": "模拟算法", "gesp": ["5.4", "5.5", "5.6", "6.2", "6.3"]},
        "l3_11_29": {"name": "浮点数运算", "gesp": ["5.4", "5.5", "5.6", "6.1", "6.3"]},
        "l3_11_30": {"name": "字符串查找", "gesp": ["5.4", "5.5", "5.6", "6.1", "6.3"]},
        "l3_11_31": {"name": "结构体排序", "gesp": ["5.4", "5.5", "5.6", "6.1", "6.3"]},
        "l3_12_32": {"name": "数据类型转换", "gesp": ["5.5", "5.6", "6.1"]},
        "l3_15_38": {"name": "string操作进阶", "gesp": ["5.3", "5.4", "5.5", "5.6", "6.1", "6.2"]},
        "l3_15_39": {"name": "数组应用", "gesp": ["5.3", "5.4", "5.5", "5.6", "6.1", "6.2"]},
        "l3_15_40": {"name": "结构体", "gesp": ["5.3", "5.4", "5.5", "5.6", "6.1", "6.2"]},
        "l3_16_41": {"name": "查找算法", "gesp": ["5.3", "5.4", "5.5", "5.6", "6.1", "6.2"]},
        "l3_16_42": {"name": "标记法", "gesp": ["5.3", "5.4", "5.5", "5.6", "6.1", "6.2"]},
        "l3_16_43": {"name": "字符串综合", "gesp": ["5.3", "5.4", "5.5", "5.6", "6.1", "6.2"]},
        "l3_17_44": {"name": "字符串处理", "gesp": ["5.4", "5.5", "5.6", "6.1"]},
        "l3_17_45": {"name": "函数调用", "gesp": ["5.4", "5.5", "5.6", "6.1"]},
        "l3_17_46": {"name": "结构体数组", "gesp": ["5.4", "5.5", "5.6", "6.1"]},
        "l3_18_47": {"name": "数组排序", "gesp": ["5.3", "5.4", "5.5", "5.6", "6.1", "6.2"]},
        "l3_18_48": {"name": "字符串操作", "gesp": ["5.3", "5.4", "5.5", "5.6", "6.1", "6.2"]},
        "l3_18_49": {"name": "结构体", "gesp": ["5.3", "5.4", "5.5", "5.6", "6.1", "6.2"]},
        "l3_19_50": {"name": "数组查找", "gesp": ["5.3", "5.5", "5.6", "6.1", "6.2"]},
        "l3_19_51": {"name": "排序应用", "gesp": ["5.3", "5.5", "5.6", "6.1", "6.2"]},
        "l3_20_52": {"name": "循环嵌套进阶", "gesp": ["5.2", "5.3", "5.4", "5.5", "6.1", "6.2"]},
        "l3_20_53": {"name": "结构体排序", "gesp": ["5.2", "5.3", "5.4", "5.5", "6.1", "6.2"]},
        "l3_20_54": {"name": "数组", "gesp": ["5.2", "5.3", "5.4", "5.5", "6.1", "6.2"]},
        "l3_21_55": {"name": "桶排序进阶", "gesp": ["5.3", "5.4", "5.5", "5.6", "6.2"]},
        "l3_21_56": {"name": "算法优化", "gesp": ["5.3", "5.4", "5.5", "5.6", "6.2"]},
        "l3_22_57": {"name": "二维数组应用", "gesp": ["5.3", "5.5", "5.6", "6.1", "6.2"]},
        "l3_22_58": {"name": "矩阵操作", "gesp": ["5.3", "5.5", "5.6", "6.1", "6.2"]},
        "l3_23_59": {"name": "综合应用一", "gesp": ["5.3", "5.5", "5.6", "6.1", "6.2"]},
        "l3_23_60": {"name": "算法综合", "gesp": ["5.3", "5.5", "5.6", "6.1", "6.2"]},
        "l3_24_61": {"name": "综合应用二", "gesp": ["5.5", "5.6", "6.1", "6.2"]},
        "l3_24_62": {"name": "编程技巧", "gesp": ["5.5", "5.6", "6.1", "6.2"]},
        "l3_25_63": {"name": "阶段测试", "gesp": ["5.4", "5.5", "5.6", "6.2"]},
        "l3_25_64": {"name": "复习巩固", "gesp": ["5.4", "5.5", "5.6", "6.2"]},
        # 进阶内容（合理映射到GESP 5-6）
        "l3_2_3": {"name": "结构体应用", "gesp": ["5.5", "5.6", "6.1"]},
        "l3_2_4": {"name": "复合赋值", "gesp": ["5.5", "5.6", "6.1"]},
        "l3_2_5": {"name": "枚举", "gesp": ["5.5", "5.6", "6.1"]},
        "l3_5_13": {"name": "数据结构", "gesp": ["5.5", "5.6", "6.1"]},
        "l3_6_16": {"name": "结构体数组", "gesp": ["5.2", "5.6", "6.1"]},
        "l3_12_33": {"name": "结构体应用", "gesp": ["5.5", "5.6", "6.1"]},
        "l3_13_34": {"name": "链表基础", "gesp": ["5.5", "5.6", "6.1"]},
        "l3_13_35": {"name": "指针操作", "gesp": ["5.5", "5.6", "6.1"]},
        "l3_14_36": {"name": "二叉树基础", "gesp": ["5.5", "5.6", "6.1", "6.2"]},
        "l3_14_37": {"name": "树遍历", "gesp": ["5.5", "5.6", "6.1", "6.2"]},
    }

# Level 4知识点映射
def get_level4_knowledge_mapping():
    """Level 4知识点及其GES映射"""
    return {
        # 排列组合相关
        "l4_1_0": {"name": "排列组合", "gesp": ["7.1", "7.2", "7.3"]},  # 错误！应该是8.1-8.4
        "l4_1_1": {"name": "组合数学", "gesp": ["7.1", "7.2", "7.3"]},  # 错误！
        "l4_2_2": {"name": "排列组合进阶", "gesp": ["7.1", "7.2", "7.3", "7.4"]},  # 错误！
        "l4_2_3": {"name": "计数原理", "gesp": ["7.1", "7.2", "7.3", "7.4"]},  # 错误！应该是8.1
        # DP相关
        "l4_4_7": {"name": "区间DP", "gesp": ["7.7", "7.8"]},  # 错误！应该是7.4, 7.5
        "l4_4_8": {"name": "石子合并", "gesp": ["7.7", "7.8"]},  # 错误！
        "l4_5_9": {"name": "区间DP进阶", "gesp": ["7.7", "7.8"]},  # 错误！
        "l4_5_10": {"name": "矩阵链乘", "gesp": ["7.7", "7.8"]},  # 错误！
        # 其他
        "l4_3_4": {"name": "质数筛法", "gesp": ["7.5", "7.6"]},  # 错误！应该是5.3
        "l4_3_5": {"name": "埃氏筛", "gesp": ["7.5", "7.6"]},  # 错误！
        "l4_3_6": {"name": "线性筛", "gesp": ["7.5", "7.6"]},  # 错误！
        "l4_6_11": {"name": "阶段测试", "gesp": ["7.1", "7.2", "7.7"]},
        "l4_7_12": {"name": "参赛指导", "gesp": ["7.1", "7.5"]},
        "l4_7_13": {"name": "考试技巧", "gesp": ["7.1", "7.5"]},
        "l4_8_14": {"name": "枚举优化", "gesp": ["7.5", "7.6"]},
        "l4_8_15": {"name": "折半枚举", "gesp": ["7.5", "7.6"]},
        "l4_9_16": {"name": "贪心应用", "gesp": ["7.5", "7.6"]},  # 应该是5.12
        "l4_9_17": {"name": "区间调度", "gesp": ["7.5", "7.6"]},
        "l4_10_18": {"name": "模拟优化", "gesp": ["7.5", "7.6"]},
        "l4_10_19": {"name": "复杂模拟", "gesp": ["7.5", "7.6"]},
        "l4_11_20": {"name": "搜索进阶", "gesp": ["7.9", "7.10"]},  # 部分正确
        "l4_11_21": {"name": "记忆化搜索", "gesp": ["7.9", "7.10"]},
        "l4_11_22": {"name": "剪枝", "gesp": ["7.9", "7.10"]},
        "l4_12_23": {"name": "复赛模拟", "gesp": ["7.5", "7.6", "7.9"]},
        "l4_13_24": {"name": "计算机基础", "gesp": ["7.1", "7.5", "7.6"]},
        "l4_13_25": {"name": "复杂度分析", "gesp": ["7.1", "7.5", "7.6"]},
        "l4_13_26": {"name": "位运算", "gesp": ["7.1", "7.5", "7.6"]},  # 应该是3.x
        "l4_14_27": {"name": "数据结构", "gesp": ["7.11", "7.12", "7.13"]},  # 不存在
        "l4_14_28": {"name": "栈队列", "gesp": ["7.11", "7.12", "7.13"]},  # 应该是6.13, 6.14
        "l4_14_29": {"name": "单调栈", "gesp": ["7.11", "7.12", "7.13"]},
        "l4_15_30": {"name": "树与图", "gesp": ["7.11", "7.12", "7.13"]},  # 不存在
        "l4_15_31": {"name": "二叉树", "gesp": ["7.11", "7.12", "7.13"]},  # 应该是6.x
        "l4_15_32": {"name": "并查集", "gesp": ["7.11", "7.12", "7.13"]},
        "l4_16_33": {"name": "数论", "gesp": ["7.5", "7.6"]},  # 应该是5.x
        "l4_16_34": {"name": "GCD/LCM", "gesp": ["7.5", "7.6"]},  # 应该是5.1, 5.2
        "l4_16_35": {"name": "快速幂", "gesp": ["7.5", "7.6"]},
        "l4_17_36": {"name": "高精度进阶", "gesp": ["7.5", "7.6"]},  # 应该是5.6
        "l4_18_37": {"name": "字符串算法", "gesp": ["7.9", "7.10"]},
        "l4_18_38": {"name": "KMP", "gesp": ["7.9", "7.10"]},
        "l4_18_39": {"name": "LCS", "gesp": ["7.9", "7.10"]},  # 应该是7.5
        "l4_18_40": {"name": "回文", "gesp": ["7.9", "7.10"]},
        "l4_19_41": {"name": "二分进阶", "gesp": ["7.5", "7.6"]},  # 应该是5.8, 5.9
        "l4_19_42": {"name": "三分查找", "gesp": ["7.5", "7.6"]},
        "l4_20_43": {"name": "排序进阶", "gesp": ["7.5", "7.6"]},  # 应该是5.11
        "l4_20_44": {"name": "归并", "gesp": ["7.5", "7.6"]},  # 应该是5.11
        "l4_20_45": {"name": "快排", "gesp": ["7.5", "7.6"]},  # 应该是5.11
        "l4_20_46": {"name": "堆排", "gesp": ["7.5", "7.6"]},
        "l4_21_47": {"name": "递归分治", "gesp": ["7.7", "7.8"]},  # 应该是5.10, 5.11
        "l4_21_48": {"name": "分治思想", "gesp": ["7.7", "7.8"]},  # 应该是5.11
        "l4_22_49": {"name": "DP进阶", "gesp": ["7.7", "7.8"]},  # 应该是7.4, 7.5
        "l4_22_50": {"name": "背包", "gesp": ["7.7", "7.8"]},  # 应该是6.11
        "l4_22_51": {"name": "LIS", "gesp": ["7.7", "7.8"]},  # 应该是7.5
        "l4_22_52": {"name": "滚动数组", "gesp": ["7.7", "7.8"]},  # 应该是7.5
        "l4_23_53": {"name": "初赛模拟", "gesp": ["7.1", "7.5", "7.11"]},
    }

def analyze_level3_to_gesp56():
    """分析Level 3到GESP 5-6的映射"""
    level3 = get_level3_knowledge_mapping()
    gesp5 = get_gesp5_points()
    gesp6 = get_gesp6_points()
    
    # 统计覆盖情况
    covered_gesp5 = set()
    covered_gesp6 = set()
    
    # 统计Level 3中不应该映射到GESP 5-6的内容（基础语法）
    excess_basic = []
    
    # 基础语法关键词
    basic_keywords = ["循环", "for", "while", "分支", "if", "数组", "字符串", "string", "结构体", "函数"]
    
    for kid, kinfo in level3.items():
        name = kinfo["name"]
        gesp_list = kinfo["gesp"]
        
        for gesp_id in gesp_list:
            if gesp_id.startswith("5."):
                covered_gesp5.add(gesp_id)
            elif gesp_id.startswith("6."):
                covered_gesp6.add(gesp_id)
        
        # 检查是否为基础语法内容被映射到高级别
        is_basic = any(kw in name for kw in basic_keywords)
        has_high_mapping = any(g.startswith("5.") or g.startswith("6.") for g in gesp_list)
        
        if is_basic and has_high_mapping:
            # 检查是否真正是GESP 5-6的进阶内容
            if not any(kw in name for kw in ["链表", "二叉树", "树", "高精度", "DP", "动态规划", "搜索", "贪心", "分治"]):
                excess_basic.append({
                    "id": kid,
                    "name": name,
                    "gesp": gesp_list
                })
    
    # 计算覆盖率
    gesp5_coverage = len(covered_gesp5) / len(gesp5) * 100
    gesp6_coverage = len(covered_gesp6) / len(gesp6) * 100
    
    # 找出缺失的考点
    missing_gesp5 = [f"{k}-{v}" for k, v in gesp5.items() if k not in covered_gesp5]
    missing_gesp6 = [f"{k}-{v}" for k, v in gesp6.items() if k not in covered_gesp6]
    
    return {
        "gesp5": {
            "coverage": f"{gesp5_coverage:.0f}%",
            "covered_count": len(covered_gesp5),
            "total": len(gesp5),
            "missing": missing_gesp5,
        },
        "gesp6": {
            "coverage": f"{gesp6_coverage:.0f}%",
            "covered_count": len(covered_gesp6),
            "total": len(gesp6),
            "missing": missing_gesp6,
        },
        "excess_basic": excess_basic[:10],  # 只显示前10个
    }

def analyze_level4_to_gesp78():
    """分析Level 4到GESP 7-8的映射"""
    level4 = get_level4_knowledge_mapping()
    gesp7 = get_gesp7_points()
    gesp8 = get_gesp8_points()
    
    # 统计覆盖情况
    covered_gesp7 = set()
    covered_gesp8 = set()
    
    # 统计错误的映射
    wrong_mappings = []
    
    for kid, kinfo in level4.items():
        name = kinfo["name"]
        gesp_list = kinfo["gesp"]
        
        for gesp_id in gesp_list:
            if gesp_id.startswith("7."):
                covered_gesp7.add(gesp_id)
            elif gesp_id.startswith("8."):
                covered_gesp8.add(gesp_id)
        
        # 检查常见错误映射
        # 1. 排列组合应该在GESP 8，不是7
        if any(kw in name for kw in ["排列", "组合", "计数原理"]):
            if not any(g.startswith("8.") for g in gesp_list):
                wrong_mappings.append({
                    "id": kid,
                    "name": name,
                    "current_gesp": gesp_list,
                    "should_be": "8.1-8.4"
                })
        
        # 2. 质数筛法应该在GESP 5，不是7
        if any(kw in name for kw in ["筛法", "质数", "素数"]):
            if not any(g.startswith("5.") for g in gesp_list):
                wrong_mappings.append({
                    "id": kid,
                    "name": name,
                    "current_gesp": gesp_list,
                    "should_be": "5.3"
                })
        
        # 3. 区间DP应该在7.4-7.5，不是7.7-7.8
        if "区间DP" in name:
            if "7.7" in gesp_list or "7.8" in gesp_list:
                wrong_mappings.append({
                    "id": kid,
                    "name": name,
                    "current_gesp": gesp_list,
                    "should_be": "7.4, 7.5"
                })
        
        # 4. LCS应该在7.5，不是7.9-7.10
        if "LCS" in name or "最长公共子序列" in name:
            if "7.9" in gesp_list or "7.10" in gesp_list:
                wrong_mappings.append({
                    "id": kid,
                    "name": name,
                    "current_gesp": gesp_list,
                    "should_be": "7.5"
                })
    
    # 计算覆盖率
    gesp7_coverage = len(covered_gesp7) / len(gesp7) * 100
    gesp8_coverage = len(covered_gesp8) / len(gesp8) * 100
    
    # 找出缺失的考点
    missing_gesp7 = [f"{k}-{v}" for k, v in gesp7.items() if k not in covered_gesp7]
    missing_gesp8 = [f"{k}-{v}" for k, v in gesp8.items() if k not in covered_gesp8]
    
    return {
        "gesp7": {
            "coverage": f"{gesp7_coverage:.0f}%",
            "covered_count": len(covered_gesp7),
            "total": len(gesp7),
            "missing": missing_gesp7,
        },
        "gesp8": {
            "coverage": f"{gesp8_coverage:.0f}%",
            "covered_count": len(covered_gesp8),
            "total": len(gesp8),
            "missing": missing_gesp8,
        },
        "wrong_mappings": wrong_mappings,
    }

def main():
    print("=" * 80)
    print("Level 3-4 知识点到 GESP 5-8级 映射验证报告")
    print("=" * 80)
    
    # 分析Level 3 -> GESP 5-6
    print("\n【Level 3 -> GESP 5-6 映射分析】")
    print("-" * 80)
    result3 = analyze_level3_to_gesp56()
    
    print(f"\nGESP 5级 覆盖率: {result3['gesp5']['coverage']} ({result3['gesp5']['covered_count']}/{result3['gesp5']['total']})")
    print(f"缺失考点: {result3['gesp5']['missing']}")
    
    print(f"\nGESP 6级 覆盖率: {result3['gesp6']['coverage']} ({result3['gesp6']['covered_count']}/{result3['gesp6']['total']})")
    print(f"缺失考点: {result3['gesp6']['missing']}")
    
    print(f"\n映射到高级别的基础内容(前10个): ")
    for item in result3['excess_basic']:
        print(f"  - {item['name']} ({item['id']}) -> {item['gesp']}")
    
    # 分析Level 4 -> GESP 7-8
    print("\n" + "=" * 80)
    print("【Level 4 -> GESP 7-8 映射分析】")
    print("-" * 80)
    result4 = analyze_level4_to_gesp78()
    
    print(f"\nGESP 7级 覆盖率: {result4['gesp7']['coverage']} ({result4['gesp7']['covered_count']}/{result4['gesp7']['total']})")
    print(f"缺失考点: {result4['gesp7']['missing']}")
    
    print(f"\nGESP 8级 覆盖率: {result4['gesp8']['coverage']} ({result4['gesp8']['covered_count']}/{result4['gesp8']['total']})")
    print(f"缺失考点: {result4['gesp8']['missing']}")
    
    print(f"\n错误的映射: ")
    for item in result4['wrong_mappings']:
        print(f"  - {item['name']} ({item['id']})")
        print(f"    当前映射: {item['current_gesp']}")
        print(f"    应该映射到: {item['should_be']}")
    
    # 输出JSON格式结果
    print("\n" + "=" * 80)
    print("【JSON格式输出】")
    print("-" * 80)
    
    json_output = {
        "gesp_mapping_validation": {
            "level3_to_gesp5": {
                "coverage": result3['gesp5']['coverage'],
                "missing": [m.split('-')[1] for m in result3['gesp5']['missing']],
                "excess": [f"{item['name']}-当前映射到GES P5-6但为基础语法" for item in result3['excess_basic'][:5]]
            },
            "level3_to_gesp6": {
                "coverage": result3['gesp6']['coverage'],
                "missing": [m.split('-')[1] for m in result3['gesp6']['missing']],
                "excess": []
            },
            "level4_to_gesp7": {
                "coverage": result4['gesp7']['coverage'],
                "covered_points": f"{result4['gesp7']['covered_count']}/{result4['gesp7']['total']}",
                "missing": [m.split('-')[1] for m in result4['gesp7']['missing']],
                "excess": []
            },
            "level4_to_gesp8": {
                "coverage": result4['gesp8']['coverage'],
                "covered_points": f"{result4['gesp8']['covered_count']}/{result4['gesp8']['total']}",
                "missing": [m.split('-')[1] for m in result4['gesp8']['missing']],
                "excess": []
            }
        }
    }
    
    print(json.dumps(json_output, ensure_ascii=False, indent=2))
    
    # 保存到文件
    output_path = '/Users/reacher/Developer/gesp/analysis_output/gesp_mapping_validation.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(json_output, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ 结果已保存到: {output_path}")

if __name__ == "__main__":
    main()
