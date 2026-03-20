#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Level 4 知识点深度分析与GESP映射
"""

import os
import json
import re

OUTPUT_DIR = "/Users/reacher/Developer/gesp/analysis_results"

# GESP 7-8级大纲详细定义
GESP_KNOWLEDGE_BASE = {
    7: {
        "7.1": {"name": "数学库函数-三角函数", "keywords": ["sin", "cos", "tan", "三角函数", "正弦", "余弦", "反正弦", "反余弦"], "points": ["sin函数", "cos函数", "三角函数应用"]},
        "7.2": {"name": "数学库函数-对数函数", "keywords": ["log", "log10", "log2", "对数", "ln", "lg"], "points": ["log10函数", "log2函数", "对数运算"]},
        "7.3": {"name": "数学库函数-指数函数", "keywords": ["exp", "指数函数", "幂函数", "pow"], "points": ["exp函数", "指数运算"]},
        "7.4": {"name": "二维动态规划", "keywords": ["二维DP", "二维dp", "dp[i][j]", "二维动规", "状态转移", "状态设计"], "points": ["二维DP状态设计", "状态转移方程", "二维DP实现"]},
        "7.5": {"name": "DP最值优化", "keywords": ["最值优化", "DP优化", "单调队列", "前缀最值"], "points": ["单调队列优化", "前缀最值优化"]},
        "7.6": {"name": "区间动态规划", "keywords": ["区间DP", "区间dp", "区间合并", "石子合并"], "points": ["区间DP模型", "区间合并策略", "最优子结构"]},
        "7.7": {"name": "最长递增子序列(LIS)", "keywords": ["LIS", "最长递增子序列", "最长上升子序列", "lower_bound", "patience sorting"], "points": ["LIS问题", "O(nlogn)算法", "耐心排序"]},
        "7.8": {"name": "最长公共子序列(LCS)", "keywords": ["LCS", "最长公共子序列", "公共子序列", "子序列匹配"], "points": ["LCS问题", "DP解法", "路径还原"]},
        "7.9": {"name": "滚动数组优化", "keywords": ["滚动数组", "滚动优化", "空间优化", "降维", "只保留前两行"], "points": ["滚动数组思想", "空间复杂度优化", "状态压缩"]},
        "7.10": {"name": "图的定义", "keywords": ["图的定义", "顶点", "边", "邻接矩阵", "邻接表", "有向图", "无向图"], "points": ["图的存储", "邻接矩阵", "邻接表"]},
        "7.11": {"name": "图DFS遍历", "keywords": ["图DFS", "图的深度优先", "图遍历", "连通分量"], "points": ["图DFS算法", "递归遍历", " visited数组"]},
        "7.12": {"name": "图BFS遍历", "keywords": ["图BFS", "图的广度优先", "层次遍历", "最短路径(无权)"], "points": ["图BFS算法", "队列实现", "层次遍历"]},
        "7.13": {"name": "泛洪算法(flood fill)", "keywords": ["flood fill", "泛洪", "洪水填充", "连通块", "连通区域", "染色"], "points": ["Flood Fill算法", "连通块计数", "区域标记"]},
        "7.14": {"name": "哈希表", "keywords": ["哈希", "hash", "哈希表", "散列表", "unordered_map", "map", "键值对"], "points": ["哈希表原理", "unordered_map使用", "哈希冲突处理"]},
    },
    8: {
        "8.1": {"name": "加法原理", "keywords": ["加法原理", "分类计数", "分类相加", "互斥事件"], "points": ["加法原理概念", "分类计数方法", "应用题解法"]},
        "8.2": {"name": "乘法原理", "keywords": ["乘法原理", "分步计数", "分步相乘", "独立事件"], "points": ["乘法原理概念", "分步计数方法", "应用题解法"]},
        "8.3": {"name": "排列", "keywords": ["排列", "排列数", "P(n,m)", "A(n,m)", "全排列", "阶乘"], "points": ["排列公式", "全排列", "部分排列", "有重复排列"]},
        "8.4": {"name": "组合", "keywords": ["组合", "组合数", "C(n,m)", "二项式系数", "组合恒等式"], "points": ["组合公式", "组合性质", "组合计算"]},
        "8.5": {"name": "杨辉三角", "keywords": ["杨辉三角", "帕斯卡三角", "组合恒等式", "二项式定理"], "points": ["杨辉三角构造", "组合数关系", "二项式展开"]},
        "8.6": {"name": "倍增法", "keywords": ["倍增", "倍增法", "ST表", "稀疏表", "快速幂", "二进制拆分"], "points": ["倍增思想", "ST表", "快速幂算法"]},
        "8.7": {"name": "一元一次方程", "keywords": ["一元一次方程", "线性方程", "方程求解"], "points": ["方程建模", "求解方法"]},
        "8.8": {"name": "二元一次方程", "keywords": ["二元一次方程", "二元方程组", "消元法", "代入法"], "points": ["方程组建模", "消元求解", "矩阵方法"]},
        "8.9": {"name": "基本图形面积", "keywords": ["面积", "三角形面积", "矩形面积", "圆面积", "多边形面积", "海伦公式"], "points": ["几何图形面积公式", "面积计算", "坐标几何"]},
        "8.10": {"name": "最小生成树-Kruskal", "keywords": ["Kruskal", "克鲁斯卡尔", "最小生成树", "MST", "并查集", "贪心"], "points": ["Kruskal算法", "并查集", "边排序"]},
        "8.11": {"name": "最小生成树-Prim", "keywords": ["Prim", "普里姆", "最小生成树", "MST", "点贪心"], "points": ["Prim算法", "优先队列", "割边性质"]},
        "8.12": {"name": "最短路径-Dijkstra", "keywords": ["Dijkstra", "迪杰斯特拉", "最短路", "单源最短路", "非负权"], "points": ["Dijkstra算法", "优先队列优化", "松弛操作"]},
        "8.13": {"name": "最短路径-Floyd", "keywords": ["Floyd", "弗洛伊德", "多源最短路", "全源最短路", "动态规划"], "points": ["Floyd算法", "三重循环", "中间点转移"]},
        "8.14": {"name": "算法复杂度分析", "keywords": ["时间复杂度", "空间复杂度", "复杂度", "O(n)", "渐进分析", "大O表示法"], "points": ["时间复杂度分析", "空间复杂度分析", "最优/最坏/平均情况"]},
        "8.15": {"name": "算法优化", "keywords": ["算法优化", "剪枝", "预处理", "优化策略", "常数优化"], "points": ["剪枝技巧", "预处理", "常数优化"]},
    }
}

# 课程与GESP知识点的映射关系（基于课程标题和内容的预分析）
LESSON_KNOWLEDGE_MAPPING = {
    1: {
        "title": "排列组合1",
        "primary_topics": ["排列", "组合", "加法原理", "乘法原理"],
        "gesp_8": ["8.1", "8.2", "8.3", "8.4"],
        "gesp_7": [],
        "description": "排列组合基础，包括加法原理、乘法原理、排列数和组合数的计算"
    },
    2: {
        "title": "排列组合2",
        "primary_topics": ["排列组合综合", "杨辉三角", "组合恒等式"],
        "gesp_8": ["8.3", "8.4", "8.5"],
        "gesp_7": [],
        "description": "排列组合进阶，杨辉三角与组合数性质"
    },
    3: {
        "title": "质数筛法",
        "primary_topics": ["埃氏筛", "欧拉筛", "线性筛", "质数判定"],
        "gesp_8": [],
        "gesp_7": [],
        "description": "质数筛选算法，埃拉托斯特尼筛法和欧拉筛法"
    },
    4: {
        "title": "区间动态规划1",
        "primary_topics": ["区间DP", "石子合并", "区间最值"],
        "gesp_8": [],
        "gesp_7": ["7.6"],
        "description": "区间动态规划基础，经典区间DP问题"
    },
    5: {
        "title": "区间动态规划2",
        "primary_topics": ["区间DP进阶", "矩阵链乘", "区间DP优化"],
        "gesp_8": [],
        "gesp_7": ["7.6"],
        "description": "区间动态规划进阶问题"
    },
    6: {
        "title": "阶段测试",
        "primary_topics": ["测试", "复习"],
        "gesp_8": [],
        "gesp_7": [],
        "description": "阶段性测试，无新知识点"
    },
    7: {
        "title": "参赛相关",
        "primary_topics": ["GESP考试", "CSP-J/S", "竞赛规则", "备考策略"],
        "gesp_8": [],
        "gesp_7": [],
        "description": "竞赛相关信息，考试规则和参赛指导"
    },
    8: {
        "title": "枚举算法应用",
        "primary_topics": ["枚举", "穷举", "暴力搜索", "优化枚举"],
        "gesp_8": [],
        "gesp_7": [],
        "description": "枚举算法的应用与优化"
    },
    9: {
        "title": "贪心算法应用（复赛）",
        "primary_topics": ["贪心算法", "局部最优", "活动选择", "区间调度"],
        "gesp_8": [],
        "gesp_7": [],
        "description": "贪心算法在复赛中的应用"
    },
    10: {
        "title": "模拟算法应用（复赛）",
        "primary_topics": ["模拟", "直接模拟", "过程模拟"],
        "gesp_8": [],
        "gesp_7": [],
        "description": "模拟算法的应用"
    },
    11: {
        "title": "搜索算法应用（复赛）",
        "primary_topics": ["DFS", "BFS", "回溯", "剪枝"],
        "gesp_8": [],
        "gesp_7": ["7.11", "7.12", "7.13"],
        "description": "搜索算法在图和树中的应用"
    },
    12: {
        "title": "复赛模拟比赛",
        "primary_topics": ["模拟比赛", "真题演练"],
        "gesp_8": [],
        "gesp_7": [],
        "description": "复赛模拟，综合应用"
    },
    13: {
        "title": "计算机基础知识",
        "primary_topics": ["计算机组成", "存储单位", "进制转换", "网络基础"],
        "gesp_8": [],
        "gesp_7": [],
        "description": "计算机基础知识，初赛理论部分"
    },
    14: {
        "title": "数据结构1（初赛）",
        "primary_topics": ["数组", "链表", "栈", "队列"],
        "gesp_8": [],
        "gesp_7": ["7.14"],
        "description": "基础数据结构"
    },
    15: {
        "title": "数据结构2（初赛）",
        "primary_topics": ["树", "二叉树", "图", "遍历"],
        "gesp_8": [],
        "gesp_7": ["7.10", "7.11", "7.12"],
        "description": "树和图的数据结构"
    },
    16: {
        "title": "数学专题1（初赛）",
        "primary_topics": ["质数", "约数", "最大公约数", "模运算"],
        "gesp_8": [],
        "gesp_7": ["7.1", "7.2", "7.3"],
        "description": "数学基础，数论相关"
    },
    17: {
        "title": "数学专题2（初赛）",
        "primary_topics": ["排列组合计算", "概率", "几何"],
        "gesp_8": ["8.3", "8.4", "8.9"],
        "gesp_7": [],
        "description": "数学进阶"
    },
    18: {
        "title": "字符串专题（初赛）",
        "primary_topics": ["字符串操作", "字符串匹配", "哈希"],
        "gesp_8": [],
        "gesp_7": ["7.14"],
        "description": "字符串处理算法"
    },
    19: {
        "title": "二分算法专题（初赛）",
        "primary_topics": ["二分查找", "二分答案", "边界处理"],
        "gesp_8": ["8.6"],
        "gesp_7": [],
        "description": "二分算法及应用"
    },
    20: {
        "title": "排序专题（初赛）",
        "primary_topics": ["排序算法", "快排", "归并排序", "桶排"],
        "gesp_8": [],
        "gesp_7": [],
        "description": "排序算法详解"
    },
    21: {
        "title": "递归专题（初赛）",
        "primary_topics": ["递归", "递归出口", "递归树", "分治"],
        "gesp_8": [],
        "gesp_7": [],
        "description": "递归算法思想"
    },
    22: {
        "title": "动态规划（初赛）",
        "primary_topics": ["DP基础", "DP状态设计", "状态转移", "经典DP问题"],
        "gesp_8": [],
        "gesp_7": ["7.4", "7.6", "7.7", "7.8", "7.9"],
        "description": "动态规划综合"
    },
    23: {
        "title": "初赛模拟比赛",
        "primary_topics": ["模拟考试", "真题"],
        "gesp_8": [],
        "gesp_7": [],
        "description": "初赛模拟"
    }
}

def analyze_lesson(lesson_num):
    """分析单节课的详细知识点"""
    # 读取原始数据
    input_file = os.path.join(OUTPUT_DIR, f"level4_lesson{lesson_num}.json")
    with open(input_file, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    
    # 获取预定义映射
    mapping = LESSON_KNOWLEDGE_MAPPING.get(lesson_num, {})
    
    # 提取所有文本内容进行关键词分析
    all_text = ""
    for slide in raw_data.get("slides", []):
        all_text += slide.get("text", "") + "\n"
    all_text_lower = all_text.lower()
    
    # 详细知识点列表
    detailed_points = []
    
    # 分析GESP 8级知识点
    gesp_8_points = []
    for code in mapping.get("gesp_8", []):
        if code in GESP_KNOWLEDGE_BASE[8]:
            info = GESP_KNOWLEDGE_BASE[8][code]
            # 检查是否包含关键词
            matched = any(kw.lower() in all_text_lower for kw in info["keywords"])
            gesp_8_points.append({
                "code": code,
                "name": info["name"],
                "likely_covered": matched,
                "sub_points": info["points"]
            })
    
    # 分析GESP 7级知识点
    gesp_7_points = []
    for code in mapping.get("gesp_7", []):
        if code in GESP_KNOWLEDGE_BASE[7]:
            info = GESP_KNOWLEDGE_BASE[7][code]
            matched = any(kw.lower() in all_text_lower for kw in info["keywords"])
            gesp_7_points.append({
                "code": code,
                "name": info["name"],
                "likely_covered": matched,
                "sub_points": info["points"]
            })
    
    # 构建结果
    result = {
        "level": 4,
        "lesson_number": lesson_num,
        "title": mapping.get("title", raw_data["filename"]),
        "file_name": raw_data["filename"],
        "total_slides": raw_data["total_slides"],
        "description": mapping.get("description", ""),
        "primary_topics": mapping.get("primary_topics", []),
        "gesp_mapping": {
            "level_8": {
                "count": len(gesp_8_points),
                "points": gesp_8_points
            },
            "level_7": {
                "count": len(gesp_7_points),
                "points": gesp_7_points
            }
        },
        "total_gesp_points": len(gesp_8_points) + len(gesp_7_points),
        "exam_type": "复赛" if "复赛" in mapping.get("title", "") else ("初赛" if "初赛" in mapping.get("title", "") else "混合")
    }
    
    return result

def main():
    print("=" * 70)
    print("Level 4 知识点 GESP 映射分析")
    print("=" * 70)
    
    all_results = []
    
    for lesson_num in range(1, 24):
        print(f"\n分析课程 {lesson_num}...")
        result = analyze_lesson(lesson_num)
        all_results.append(result)
        
        # 保存单课分析
        output_file = os.path.join(OUTPUT_DIR, f"level4_lesson{lesson_num}_mapped.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        print(f"  GESP 8级: {result['gesp_mapping']['level_8']['count']} 个知识点")
        print(f"  GESP 7级: {result['gesp_mapping']['level_7']['count']} 个知识点")
    
    # 保存汇总
    summary = {
        "total_lessons": 23,
        "level": 4,
        "target_gesp": "7-8级",
        "lessons": all_results,
        "gesp_8_coverage": {},
        "gesp_7_coverage": {}
    }
    
    # 统计覆盖率
    gesp_8_covered = set()
    gesp_7_covered = set()
    for r in all_results:
        for p in r["gesp_mapping"]["level_8"]["points"]:
            if p["likely_covered"]:
                gesp_8_covered.add(p["code"])
        for p in r["gesp_mapping"]["level_7"]["points"]:
            if p["likely_covered"]:
                gesp_7_covered.add(p["code"])
    
    summary["gesp_8_coverage"] = {
        "total": len(GESP_KNOWLEDGE_BASE[8]),
        "covered": len(gesp_8_covered),
        "codes": sorted(list(gesp_8_covered))
    }
    summary["gesp_7_coverage"] = {
        "total": len(GESP_KNOWLEDGE_BASE[7]),
        "covered": len(gesp_7_covered),
        "codes": sorted(list(gesp_7_covered))
    }
    
    summary_file = os.path.join(OUTPUT_DIR, "level4_summary.json")
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    
    print("\n" + "=" * 70)
    print("分析完成!")
    print(f"GESP 8级覆盖: {len(gesp_8_covered)}/{len(GESP_KNOWLEDGE_BASE[8])} 个知识点")
    print(f"GESP 7级覆盖: {len(gesp_7_covered)}/{len(GESP_KNOWLEDGE_BASE[7])} 个知识点")
    print(f"汇总文件: {summary_file}")
    print("=" * 70)

if __name__ == "__main__":
    main()
