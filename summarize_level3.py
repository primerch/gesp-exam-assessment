#!/usr/bin/env python3
"""
汇总 Level 3 分析结果，生成综合报告
"""

import os
import json
from collections import defaultdict
from pathlib import Path

# GESP 知识点定义
GESP_LEVEL_5_POINTS = {
    "5.1": "初等数论 - 素数",
    "5.2": "初等数论 - 最大公约数(GCD)",
    "5.3": "初等数论 - 最小公倍数(LCM)",
    "5.4": "初等数论 - 同余",
    "5.5": "初等数论 - 质因数分解",
    "5.6": "初等数论 - 奇偶性",
    "5.7": "C++高精度运算 - 数组模拟高精度加减乘除",
    "5.8": "链表 - 单链表",
    "5.9": "链表 - 双链表",
    "5.10": "链表 - 循环链表",
    "5.11": "链表 - 创建、插入、删除、遍历",
    "5.12": "素数筛法 - 埃氏筛",
    "5.13": "素数筛法 - 线性筛",
    "5.14": "唯一分解定理",
    "5.15": "算法复杂度 - 多项式复杂度",
    "5.16": "算法复杂度 - 对数复杂度",
    "5.17": "二分查找",
    "5.18": "二分答案",
    "5.19": "递归算法",
    "5.20": "分治算法 - 归并排序",
    "5.21": "分治算法 - 快速排序",
    "5.22": "贪心算法",
    "5.23": "树的基本概念",
    "5.24": "树的构造与遍历",
    "5.25": "哈夫曼树",
    "5.26": "完全二叉树",
    "5.27": "二叉排序树",
    "5.28": "图的定义及存储",
}

GESP_LEVEL_6_POINTS = {
    "6.1": "哈夫曼编码",
    "6.2": "格雷编码",
    "6.3": "深度优先搜索(DFS)",
    "6.4": "宽度优先搜索(BFS)",
    "6.5": "二叉树的搜索算法",
    "6.6": "简单动态规划 - 一维DP",
    "6.7": "简单动态规划 - 简单背包",
    "6.8": "面向对象 - 类与封装",
    "6.9": "面向对象 - 继承",
    "6.10": "面向对象 - 多态",
    "6.11": "栈",
    "6.12": "队列",
    "6.13": "循环队列",
}


def load_all_results(output_dir):
    """加载所有课程分析结果"""
    results = []
    for i in range(1, 25):
        file_path = os.path.join(output_dir, f"level3_lesson{i:02d}.json")
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                results.append(json.load(f))
    return results


def generate_summary(results):
    """生成汇总报告"""
    
    # 统计总体信息
    total_slides = sum(r["total_slides"] for r in results)
    
    # 统计每个 GESP 知识点覆盖的课程
    gesp5_coverage = defaultdict(list)
    gesp6_coverage = defaultdict(list)
    
    for r in results:
        lesson_num = r["lesson_number"]
        for pid in r.get("gesp_level_5_points", []):
            gesp5_coverage[pid].append(lesson_num)
        for pid in r.get("gesp_level_6_points", []):
            gesp6_coverage[pid].append(lesson_num)
    
    # 生成课程摘要列表
    lesson_summaries = []
    for r in results:
        lesson_summaries.append({
            "lesson_number": r["lesson_number"],
            "title": r.get("title", f"第{r['lesson_number']}课"),
            "file_name": r.get("file_name", ""),
            "total_slides": r["total_slides"],
            "gesp_level_5_count": len(r.get("gesp_level_5_points", [])),
            "gesp_level_6_count": len(r.get("gesp_level_6_points", [])),
            "gesp_level_5_points": r.get("gesp_level_5_points", []),
            "gesp_level_6_points": r.get("gesp_level_6_points", []),
        })
    
    # 生成 GESP 5级覆盖统计
    gesp5_stats = []
    for pid in sorted(GESP_LEVEL_5_POINTS.keys()):
        lessons = gesp5_coverage.get(pid, [])
        gesp5_stats.append({
            "id": pid,
            "name": GESP_LEVEL_5_POINTS[pid],
            "covered_lessons": lessons,
            "coverage_count": len(lessons),
            "coverage_rate": f"{len(lessons)/24*100:.1f}%"
        })
    
    # 生成 GESP 6级覆盖统计
    gesp6_stats = []
    for pid in sorted(GESP_LEVEL_6_POINTS.keys()):
        lessons = gesp6_coverage.get(pid, [])
        gesp6_stats.append({
            "id": pid,
            "name": GESP_LEVEL_6_POINTS[pid],
            "covered_lessons": lessons,
            "coverage_count": len(lessons),
            "coverage_rate": f"{len(lessons)/24*100:.1f}%"
        })
    
    summary = {
        "level": 3,
        "total_lessons": len(results),
        "total_slides": total_slides,
        "gesp_level_5_coverage": {
            "total_points": len(GESP_LEVEL_5_POINTS),
            "covered_points": len(gesp5_coverage),
            "coverage_rate": f"{len(gesp5_coverage)/len(GESP_LEVEL_5_POINTS)*100:.1f}%",
            "points_detail": gesp5_stats
        },
        "gesp_level_6_coverage": {
            "total_points": len(GESP_LEVEL_6_POINTS),
            "covered_points": len(gesp6_coverage),
            "coverage_rate": f"{len(gesp6_coverage)/len(GESP_LEVEL_6_POINTS)*100:.1f}%",
            "points_detail": gesp6_stats
        },
        "lessons_summary": lesson_summaries
    }
    
    return summary


def generate_text_report(summary):
    """生成文本格式的报告"""
    lines = []
    
    lines.append("=" * 80)
    lines.append("Level 3 (24节课) PPT 深度分析报告")
    lines.append("=" * 80)
    lines.append("")
    lines.append(f"总课程数: {summary['total_lessons']} 课")
    lines.append(f"总页数: {summary['total_slides']} 页")
    lines.append("")
    
    # GESP 5级覆盖情况
    lines.append("-" * 80)
    lines.append("GESP 5级知识点覆盖情况")
    lines.append("-" * 80)
    lines.append(f"总知识点: {summary['gesp_level_5_coverage']['total_points']}")
    lines.append(f"已覆盖: {summary['gesp_level_5_coverage']['covered_points']}")
    lines.append(f"覆盖率: {summary['gesp_level_5_coverage']['coverage_rate']}")
    lines.append("")
    
    for point in summary['gesp_level_5_coverage']['points_detail']:
        if point['coverage_count'] > 0:
            lines.append(f"  {point['id']}: {point['name']}")
            lines.append(f"    覆盖课程: {', '.join(f'第{L}课' for L in point['covered_lessons'])}")
            lines.append(f"    覆盖次数: {point['coverage_count']}")
    
    lines.append("")
    
    # GESP 6级覆盖情况
    lines.append("-" * 80)
    lines.append("GESP 6级知识点覆盖情况")
    lines.append("-" * 80)
    lines.append(f"总知识点: {summary['gesp_level_6_coverage']['total_points']}")
    lines.append(f"已覆盖: {summary['gesp_level_6_coverage']['covered_points']}")
    lines.append(f"覆盖率: {summary['gesp_level_6_coverage']['coverage_rate']}")
    lines.append("")
    
    for point in summary['gesp_level_6_coverage']['points_detail']:
        if point['coverage_count'] > 0:
            lines.append(f"  {point['id']}: {point['name']}")
            lines.append(f"    覆盖课程: {', '.join(f'第{L}课' for L in point['covered_lessons'])}")
            lines.append(f"    覆盖次数: {point['coverage_count']}")
    
    lines.append("")
    
    # 课程摘要
    lines.append("-" * 80)
    lines.append("每课知识点分布")
    lines.append("-" * 80)
    
    for lesson in summary['lessons_summary']:
        lines.append(f"\n第 {lesson['lesson_number']:02d} 课: {lesson['title']}")
        lines.append(f"  文件: {lesson['file_name']}")
        lines.append(f"  页数: {lesson['total_slides']}")
        lines.append(f"  GESP 5级知识点: {lesson['gesp_level_5_count']} 个")
        if lesson['gesp_level_5_points']:
            point_names = [f"{p}({GESP_LEVEL_5_POINTS.get(p, '?')})" for p in lesson['gesp_level_5_points']]
            lines.append(f"    {', '.join(point_names)}")
        lines.append(f"  GESP 6级知识点: {lesson['gesp_level_6_count']} 个")
        if lesson['gesp_level_6_points']:
            point_names = [f"{p}({GESP_LEVEL_6_POINTS.get(p, '?')})" for p in lesson['gesp_level_6_points']]
            lines.append(f"    {', '.join(point_names)}")
    
    lines.append("")
    lines.append("=" * 80)
    lines.append("报告结束")
    lines.append("=" * 80)
    
    return "\n".join(lines)


def main():
    output_dir = "/Users/reacher/Developer/gesp/analysis_results"
    
    print("加载分析结果...")
    results = load_all_results(output_dir)
    print(f"已加载 {len(results)} 课的分析结果")
    
    print("生成汇总报告...")
    summary = generate_summary(results)
    
    # 保存 JSON 汇总
    summary_file = os.path.join(output_dir, "level3_summary.json")
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    print(f"JSON 汇总已保存: {summary_file}")
    
    # 生成并保存文本报告
    text_report = generate_text_report(summary)
    report_file = os.path.join(output_dir, "level3_report.txt")
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(text_report)
    print(f"文本报告已保存: {report_file}")
    
    # 打印摘要
    print("\n" + "=" * 60)
    print("Level 3 分析汇总")
    print("=" * 60)
    print(f"总课程数: {summary['total_lessons']}")
    print(f"总页数: {summary['total_slides']}")
    print(f"GESP 5级覆盖率: {summary['gesp_level_5_coverage']['coverage_rate']}")
    print(f"GESP 6级覆盖率: {summary['gesp_level_6_coverage']['coverage_rate']}")


if __name__ == "__main__":
    main()
