#!/usr/bin/env python3
"""清理和优化知识点"""

import json
import re

INPUT_FILE = "/Users/reacher/Developer/gesp/data/level3_knowledge.json"
OUTPUT_FILE = "/Users/reacher/Developer/gesp/data/level3_knowledge.json"

def is_valid_knowledge_point(kp):
    """判断是否是有效的知识点"""
    kp = kp.strip()
    
    # 过滤过短的
    if len(kp) < 8:
        return False
    
    # 过滤纯数字或数学表达式
    if re.match(r'^[\d\s\.\+\-\*\/=×]+$', kp):
        return False
    
    # 过滤包含大量数字的（可能是示例）
    digit_ratio = sum(c.isdigit() for c in kp) / len(kp) if kp else 0
    if digit_ratio > 0.4:  # 数字占比超过40%
        return False
    
    # 过滤特定格式的代码示例
    if '->' in kp and '=' in kp and len(kp) < 20:
        return False
    
    # 过滤页码
    if re.match(r'^\d+、?$', kp):
        return False
    
    return True

def clean_kp(kp):
    """清理知识点文本"""
    # 去掉末尾的省略号
    kp = re.sub(r'\.\.\.$', '', kp).strip()
    # 去掉开头的编号
    kp = re.sub(r'^\d+[、.]\s*', '', kp)
    return kp

def main():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 课程标题映射（确保标题准确）
    title_map = {
        1: "数制转换与位运算",
        2: "枚举进阶",
        3: "递推进阶",
        4: "二分进阶",
        5: "贪心进阶",
        6: "阶段复习与测试",
        7: "递归进阶",
        8: "快速排序",
        9: "归并排序",
        10: "栈进阶",
        11: "队列进阶",
        12: "阶段复习与测试",
        13: "链表进阶",
        14: "二叉树应用",
        15: "二叉树进阶",
        16: "深搜进阶",
        17: "广搜进阶",
        18: "阶段复习与测试",
        19: "动态规划基础",
        20: "动态规划-子序列问题",
        21: "动态规划-背包问题",
        22: "动态规划-背包进阶",
        23: "图的基本应用",
        24: "阶段复习与测试",
    }
    
    # 每节课的预设知识点（用于补充）
    preset_knowledge = {
        1: ["二进制与十进制转换", "八进制与十六进制转换", "位运算基础(与、或、非、异或)", "进制转换方法", "原码、反码、补码"],
        2: ["枚举算法思想", "枚举范围确定方法", "枚举优化策略", "判定条件设计", "多重枚举技巧"],
        3: ["递推算法思想", "递推公式推导", "边界条件处理", "递推与枚举结合", "递推优化方法"],
        4: ["二分查找原理", "二分查找边界处理", "二分答案思想", "单调性判断", "二分算法模板"],
        5: ["贪心算法思想", "贪心策略选择", "最优子结构", "活动安排问题", "贪心证明方法"],
        6: ["阶段知识综合复习", "算法模板总结", "编程规范要点", "调试技巧", "测试用例设计"],
        7: ["递归算法思想", "递归终止条件", "递归调用过程", "递归与栈的关系", "递归优化方法"],
        8: ["快速排序原理", "基准值选择策略", "分区(partition)过程", "时间复杂度分析", "快排优化(三数取中)"],
        9: ["归并排序原理", "分治算法思想", "合并有序序列", "时间复杂度分析", "归并排序稳定性"],
        10: ["栈的基本概念", "栈的顺序实现", "栈的链式实现", "栈的应用(表达式求值)", "括号匹配问题"],
        11: ["队列基本概念", "队列的顺序实现", "循环队列", "队列的应用", "BFS基础"],
        12: ["阶段知识综合复习", "排序算法对比", "数据结构应用", "综合测试要点", "代码实现技巧"],
        13: ["链表基本概念", "单链表的创建", "链表插入操作", "链表删除操作", "链表遍历与查找"],
        14: ["二叉树基本概念", "二叉树性质", "二叉树存储结构", "二叉树遍历(前中后序)", "遍历算法实现"],
        15: ["由遍历序列构造二叉树", "先序+中序重建", "后序+中序重建", "层序遍历", "二叉树高度计算"],
        16: ["深度优先搜索(DFS)", "DFS实现框架", "回溯算法", "全排列问题", "DFS剪枝优化"],
        17: ["广度优先搜索(BFS)", "BFS实现框架", "BFS求最短路径", "连通性问题", "FloodFill算法"],
        18: ["阶段知识综合复习", "树与搜索综合", "算法模板总结", "综合测试要点", "常见错误分析"],
        19: ["动态规划思想", "DP三大性质(最优子结构、无后效性、重叠子问题)", "状态定义方法", "状态转移方程", "DP初始化技巧"],
        20: ["最长上升子序列(LIS)", "最长公共子序列(LCS)", "子序列问题解法", "DP状态设计", "DP优化方法"],
        21: ["01背包问题", "完全背包问题", "背包状态设计", "背包状态转移", "背包问题应用"],
        22: ["背包问题分类", "多重背包", "分组背包", "背包空间优化(滚动数组)", "背包问题变体"],
        23: ["图的基本概念", "图的邻接矩阵存储", "图的邻接表存储", "图的DFS遍历", "图的BFS遍历"],
        24: ["阶段总复习", "算法体系梳理", "常考题型总结", "应试技巧", "模拟测试"],
    }
    
    for lesson in data["lessons"]:
        lesson_num = lesson["lesson_num"]
        
        # 更新标题
        if lesson_num in title_map:
            lesson["title"] = title_map[lesson_num]
        
        # 过滤和清理知识点
        filtered_kps = []
        for kp in lesson["knowledge_points"]:
            cleaned = clean_kp(kp)
            if is_valid_knowledge_point(cleaned):
                filtered_kps.append(cleaned)
        
        # 如果过滤后知识点太少，使用预设值补充
        if len(filtered_kps) < 4 and lesson_num in preset_knowledge:
            filtered_kps = preset_knowledge[lesson_num]
        
        lesson["knowledge_points"] = filtered_kps[:8]  # 最多8个
    
    # 更新总数
    data["total_lessons"] = len(data["lessons"])
    
    # 保存
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"知识点已清理并保存到: {OUTPUT_FILE}")
    print(f"共处理 {len(data['lessons'])} 节课")

if __name__ == "__main__":
    main()
