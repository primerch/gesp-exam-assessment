#!/usr/bin/env python3
"""
Level 4知识点去重分析脚本
对比Level 1/2/3和Level 4的知识点，找出重复和不应该出现在Level 4的基础知识点
"""

import json
from collections import defaultdict

# Level 1 知识点 (从两个文件中提取)
level1_knowledge = {
    # 基础语法
    "变量", "变量定义", "int类型", "char类型", "bool类型", "float类型", "double类型", "long long类型",
    "cin输入", "cout输出", "printf输出", "scanf输入", "格式化输出", "setw", "setprecision",
    "算术运算符", "比较运算符", "逻辑运算符", "自增运算符", "自减运算符", "复合赋值运算符",
    "if语句", "if-else", "switch-case", "for循环", "while循环", "do-while循环", "break", "continue",
    "数组", "数组定义", "数组遍历", "字符数组", "字符串", "string类型",
    "函数", "函数定义", "函数调用", "参数", "返回值", "作用域", "局部变量", "全局变量",
    "结构体", "struct",
    # 基础算法
    "排序", "冒泡排序", "选择排序", "桶排序", "交换排序",
    "查找", "顺序查找", "二分查找",
    "递归", "递推", "枚举", "贪心",
}

# Level 2 知识点
level2_knowledge = {
    # 算法
    "枚举算法", "枚举优化", "递推算法", "顺推", "逆推", "斐波那契数列",
    "前缀和", "差分", "差分数组", "前缀和数组",
    "二分算法", "二分查找", "二分答案",
    "贪心算法", "局部最优", "全局最优", "活动选择", "区间调度", "背包问题",
    # 数据结构
    "栈", "队列", "入栈", "出栈", "入队", "出队",
    # 数学
    "大整数", "高精度加法", "高精度减法", "高精度乘法",
}

# Level 3 知识点（从原始内容提取）
level3_knowledge = {
    # 数制与位运算
    "数制转换", "二进制", "八进制", "十六进制", "十进制", "进制转换",
    "位运算", "按位与", "按位或", "按位异或", "按位左移", "按位右移",
    "原码", "反码", "补码", "ASCII码",
    # 进阶算法
    "枚举进阶", "递推进阶", "二维递推", "数字金字塔", "路径计数",
    "二分进阶", "二分答案", "切割木材",
    # 图论基础
    "图", "图论", "图的存储", "邻接矩阵", "邻接表",
    "DFS", "深度优先搜索", "BFS", "广度优先搜索",
    # 动态规划基础
    "动态规划", "DP", "背包问题", "01背包", "完全背包", "最长上升子序列", "LIS",
    # 字符串
    "字符串哈希", "字符串匹配", "KMP", "前缀函数",
    # 数据结构进阶
    "树", "二叉树", "树遍历", "堆", "优先队列", "并查集",
    # 数学进阶
    "GCD", "最大公约数", "LCM", "最小公倍数", "辗转相除法", "欧几里得算法",
    "快速幂", "逆元", "同余", "模运算", "素数", "质数", "筛法",
}

# 不应该出现在Level 4的基础知识点（初级内容）
basic_concepts = {
    # 变量和数据类型基础
    "变量定义", "int类型", "char类型", "bool类型", "float类型", "double类型", "long long类型",
    "变量命名", "变量作用域", "局部变量", "全局变量", "常量", "const",
    # 输入输出基础
    "cin", "cout", "printf", "scanf", "格式化输入输出", "换行符", "转义字符",
    # 运算符基础
    "算术运算符", "比较运算符", "逻辑运算符", "赋值运算符", "自增", "自减",
    # 流程控制基础
    "if语句", "if-else", "switch-case", "for循环", "while循环", "do-while", 
    "break", "continue", "循环嵌套", "嵌套循环",
    # 数组基础
    "数组", "数组定义", "数组初始化", "数组遍历", "一维数组", "二维数组基础",
    "数组越界", "数组元素访问", "数组下标",
    # 字符串基础
    "字符数组", "字符串", "string", "strlen", "strcpy", "strcmp", "strcat",
    # 函数基础
    "函数", "函数定义", "函数调用", "参数", "返回值", "void", "main函数",
    # 基础排序
    "冒泡排序", "选择排序", "插入排序", "桶排序", "计数排序",
}

# Level 4应该出现的高级知识点
advanced_concepts = {
    # 高级算法
    "排列组合", "组合数", "排列数", "阶乘", "加法原理", "乘法原理",
    "捆绑法", "插空法", "隔板法", "容斥原理",
    "埃氏筛", "线性筛", "欧拉筛", "素数表",
    "区间DP", "动态规划优化", "状态压缩", "记忆化搜索",
    "剪枝", "双向搜索", "迭代加深", "IDA*", "A*算法",
    "分治", "归并排序", "快速排序", "堆排序",
    # 高级数据结构
    "单调栈", "单调队列", "并查集", "堆", "优先队列", "ST表", "线段树", "树状数组",
    "链表", "双向链表", "循环链表",
    "树", "二叉树", "树的遍历", "最近公共祖先", "LCA",
    "图", "图遍历", "最短路径", "Dijkstra", "Floyd", "Bellman-Ford", "SPFA",
    "最小生成树", "Prim", "Kruskal", "拓扑排序", "强连通分量",
    # 字符串高级
    "KMP算法", "字符串哈希", "前缀函数", "Trie树", "AC自动机",
    "最长公共子序列", "LCS", "最长回文子串", "Manacher算法",
    # 数学高级
    "快速幂", "快速幂取模", "逆元", "扩展欧几里得", "欧拉函数", "费马小定理",
    "组合数学", "卢卡斯定理", "卡特兰数", "斯特林数",
    "博弈论", "Nim游戏", "SG函数",
    # 计算几何
    "计算几何", "向量", "点积", "叉积", "凸包",
}

# 读取Level 4知识点
with open('/Users/reacher/Developer/gesp/analysis_output/level4_knowledge_extracted.json', 'r', encoding='utf-8') as f:
    level4_data = json.load(f)

# 收集所有Level 4知识点
level4_points = []
for lesson in level4_data['lessons']:
    for kp in lesson['knowledge_points']:
        level4_points.append({
            'name': kp['name'],
            'category': kp['category'],
            'is_new': kp.get('is_new', True),
            'gesp_level': kp.get('gesp_level', 7),
            'lesson': lesson['lesson_num'],
            'lesson_title': lesson['title']
        })

print("=" * 80)
print("Level 4知识点去重分析报告")
print("=" * 80)
print(f"\n总知识点数量: {len(level4_points)}")

# 合并所有低级别知识点
all_lower_knowledge = level1_knowledge | level2_knowledge | level3_knowledge

# 分析每个知识点
truly_new = []
review_points = []
suspicious_duplicates = []

for kp in level4_points:
    name = kp['name']
    
    # 检查是否是基础概念（不应该出现在Level 4）
    is_basic = any(basic in name for basic in basic_concepts)
    
    # 检查是否在低级别知识点中
    is_duplicate = any(lower in name or name in lower for lower in all_lower_knowledge)
    
    # 检查是否是真正的高级内容
    is_advanced = any(adv in name for adv in advanced_concepts)
    
    if is_basic and not is_advanced:
        suspicious_duplicates.append({
            'name': name,
            'category': kp['category'],
            'lesson': kp['lesson'],
            'note': f"基础概念，不应在Level 4出现（{kp['lesson_title']}）"
        })
    elif is_duplicate and not is_advanced:
        review_points.append({
            'name': name,
            'category': kp['category'],
            'lesson': kp['lesson'],
            'current_is_new': kp['is_new']
        })
    else:
        truly_new.append(kp)

print(f"\n真正的新知识点: {len(truly_new)}")
print(f"复习/重复知识点: {len(review_points)}")
print(f"可疑重复（基础概念）: {len(suspicious_duplicates)}")

# 输出可疑重复详情
print("\n" + "=" * 80)
print("可疑重复详情（不应该出现在Level 4的基础知识点）")
print("=" * 80)

for item in suspicious_duplicates:
    print(f"\n• {item['name']}")
    print(f"  分类: {item['category']}")
    print(f"  课次: 第{item['lesson']}课")
    print(f"  说明: {item['note']}")

# 输出复习知识点
print("\n" + "=" * 80)
print("复习知识点（在低级别已学过，但在Level 4需要复习/进阶）")
print("=" * 80)

for item in review_points[:20]:  # 只显示前20个
    status = "✓ 已标记为复习" if not item['current_is_new'] else "✗ 需要标记为复习"
    print(f"• {item['name']} - {status}")

if len(review_points) > 20:
    print(f"\n... 还有 {len(review_points) - 20} 个复习知识点")

# 生成修正后的Level 4数据
print("\n" + "=" * 80)
print("生成修正建议")
print("=" * 80)

# 统计各分类情况
category_stats = defaultdict(lambda: {'total': 0, 'new': 0, 'review': 0, 'suspicious': 0})

for kp in level4_points:
    cat = kp['category']
    category_stats[cat]['total'] += 1
    if any(s['name'] == kp['name'] for s in suspicious_duplicates):
        category_stats[cat]['suspicious'] += 1
    elif any(r['name'] == kp['name'] for r in review_points):
        category_stats[cat]['review'] += 1
    else:
        category_stats[cat]['new'] += 1

print("\n各分类统计:")
print("-" * 60)
print(f"{'分类':<12} {'总计':<8} {'新知识点':<10} {'复习':<8} {'可疑':<8}")
print("-" * 60)
for cat, stats in sorted(category_stats.items()):
    print(f"{cat:<12} {stats['total']:<8} {stats['new']:<10} {stats['review']:<8} {stats['suspicious']:<8}")

# 生成最终的JSON报告
report = {
    "level4_analysis": {
        "total_points": len(level4_points),
        "truly_new": len(truly_new),
        "review_points": len(review_points),
        "suspicious_count": len(suspicious_duplicates),
        "suspicious_duplicates": [
            {
                "name": item['name'],
                "category": item['category'],
                "lesson": item['lesson'],
                "note": item['note']
            } for item in suspicious_duplicates
        ],
        "category_distribution": dict(category_stats),
        "recommendations": [
            "移除或合并基础概念知识点到复习章节",
            "确保'is_new'标记准确反映知识点的新旧程度",
            "对于可疑重复项，需要人工确认其难度是否适合Level 4",
            "考虑将部分基础知识点改为'进阶应用'形式呈现"
        ]
    }
}

# 保存报告
output_path = '/Users/reacher/Developer/gesp/analysis_output/level4_dedup_report.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)

print(f"\n\n详细报告已保存至: {output_path}")
print("\n" + "=" * 80)
