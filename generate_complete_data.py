#!/usr/bin/env python3
"""
Generate complete curriculum data with accurate GESP mappings
"""
import json

def generate_knowledge_point(level, lesson, index, name, gesp_mappings, difficulty=2):
    """Generate a knowledge point with unique ID"""
    kp_id = f"l{level}_{lesson}_{index}"
    return {
        "id": kp_id,
        "name": name,
        "description": f"Level {level} 第{lesson}课: {name}",
        "difficulty": difficulty,
        "gespMapping": gesp_mappings
    }

def main():
    # Build complete knowledge points for each GESP level
    knowledge_points = {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: []}
    progression = {1: {}, 2: {}, 3: {}, 4: {}}
    
    # Level 1 -> GESP 1-2 (21 lessons)
    lesson_topics = [
        # Level 1 lessons
        (["变量定义", "cin/cout", "数据类型", "程序框架"], ["1.1", "1.3", "1.4", "1.5", "1.6"], 1),
        (["算术运算符", "取余运算", "字符型", "ASCII"], ["1.2", "1.7", "1.8", "2.5"], 2),
        (["关系运算符", "if语句", "逻辑运算", "多分支"], ["1.8", "2.2", "2.3", "2.4"], 2),
        (["switch语句", "break", "case分支"], ["2.2", "2.4"], 2),
        (["for循环", "循环变量", "循环条件", "循环步长"], ["2.3", "2.6", "2.7"], 2),
        (["综合练习"], ["1.1", "1.2", "2.2", "2.3", "2.4", "2.6"], 3),
        (["数组定义", "数组访问", "数组遍历", "数组初始化"], ["2.6", "2.9"], 3),
        (["数组插入", "数组删除", "数组移动"], ["2.9", "2.10"], 3),
        (["二维数组", "矩阵操作", "双重循环"], ["2.8", "2.9", "2.10"], 3),
        (["数组综合", "约瑟夫环"], ["2.9", "2.10"], 4),
        (["while循环", "do-while", "数位分离"], ["2.6", "2.7", "2.8"], 3),
        (["格式化输出", "setw", "setprecision", "浮点数"], ["1.4", "1.5", "2.1"], 3),
        (["浮点精度", "类型转换", "long long"], ["1.2", "1.3", "1.6", "2.1"], 3),
        (["字符数组", "字符串输入", "字符串长度", "字符串遍历"], ["2.9", "2.11"], 4),
        (["string类型", "string操作", "string函数"], ["2.9", "2.11"], 3),
        (["字符串综合", "凯撒加密", "回文判断"], ["1.4", "2.11"], 4),
        (["函数定义", "函数调用", "参数", "返回值"], ["2.4", "2.12"], 3),
        (["变量作用域", "局部变量", "全局变量", "max/min函数"], ["2.4", "2.12"], 4),
        (["结构体定义", "结构体数组", "结构体排序"], ["2.12", "2.13"], 4),
        (["循环嵌套", "图形输出", "九九乘法表"], ["2.7", "2.8"], 4),
        (["桶排序", "排序应用"], ["2.8", "2.10"], 4),
    ]
    
    kp_index = 0
    for lesson, (topics, mappings, difficulty) in enumerate(lesson_topics, 1):
        progression[1][lesson] = []
        for i, topic in enumerate(topics):
            kp = generate_knowledge_point(1, lesson, kp_index, topic, mappings, difficulty)
            # Add to GESP 1 and 2
            knowledge_points[1].append(kp)
            knowledge_points[2].append(kp)
            progression[1][lesson].append(kp["id"])
            kp_index += 1
    
    # Level 2 -> GESP 3-4 (24 lessons)
    level2_topics = [
        (["枚举算法", "水仙花数", "百钱买百鸡"], ["3.11"], 3),
        (["递推算法", "斐波那契", "兔子繁殖"], ["3.11", "4.7"], 3),
        (["前缀和", "差分", "区间求和"], ["3.11", "4.7"], 4),
        (["二分查找", "二分答案"], ["4.7", "4.12"], 4),
        (["冒泡排序", "选择排序", "插入排序"], ["3.12", "4.8", "4.9", "4.10", "4.11"], 3),
        (["结构体进阶", "结构体指针"], ["4.3"], 3),
        (["指针基础", "取地址", "解引用"], ["4.1"], 4),
        (["动态内存", "new/delete"], ["4.1"], 4),
        (["vector容器", "STL基础"], ["3.10", "3.12"], 3),
        (["map/set容器"], ["3.10"], 4),
        (["贪心算法", "活动选择"], ["3.11", "3.12"], 4),
        (["分治算法", "归并排序"], ["3.12", "4.7"], 4),
        (["递归", "递归与迭代"], ["3.11", "4.7"], 3),
        (["DFS搜索", "迷宫问题"], ["3.11", "3.12"], 4),
        (["BFS搜索", "最短路径"], ["3.11", "3.12"], 4),
        (["动态规划入门", "数字三角形"], ["3.12"], 4),
        (["01背包", "完全背包"], ["3.12"], 5),
        (["线性DP", "LIS", "LCS"], ["3.12"], 5),
        (["字符串处理", "KMP入门"], ["3.10"], 4),
        (["图论基础", "邻接矩阵", "拓扑排序"], ["3.10", "3.11", "3.12"], 4),
        (["高精度计算", "高精度加减乘除"], ["3.11", "3.12"], 4),
        (["位运算", "按位与或异或"], ["3.3", "3.4", "3.5", "3.6", "3.7"], 4),
        (["滑动窗口", "双指针"], ["3.11", "3.12"], 4),
        (["综合复习"], ["3.11", "3.12", "4.7", "4.8", "4.9", "4.10"], 4),
    ]
    
    kp_index = 0
    for lesson, (topics, mappings, difficulty) in enumerate(level2_topics, 1):
        progression[2][lesson] = []
        for i, topic in enumerate(topics):
            kp = generate_knowledge_point(2, lesson, kp_index, topic, mappings, difficulty)
            # Add to GESP 3 and 4
            knowledge_points[3].append(kp)
            knowledge_points[4].append(kp)
            progression[2][lesson].append(kp["id"])
            kp_index += 1
    
    # Level 3 -> GESP 5-6 (25 lessons) - Focus on advanced algorithms
    level3_topics = [
        (["string进阶", "字符串函数", "万能头文件"], ["5.4", "5.5", "5.6"], 4),
        (["结构体应用", "复合赋值", "枚举"], ["5.5", "5.6", "6.1"], 4),
        (["函数进阶", "二维数组", "分支结构"], ["5.1", "5.5", "5.6"], 4),
        (["for循环进阶", "while循环", "sort函数"], ["5.2", "5.5", "5.6"], 4),
        (["循环控制", "数据结构"], ["5.5", "5.6", "6.1"], 4),
        (["循环嵌套", "图形输出", "结构体数组"], ["5.2", "5.6", "6.1"], 4),
        (["字符串遍历", "for循环应用", "函数返回值"], ["5.1", "5.4", "5.5"], 4),
        (["string类型", "字符数组", "标记法", "桶排序"], ["5.3", "5.4", "5.5", "6.2"], 4),
        (["字符串操作", "排序算法"], ["5.4", "5.5", "5.6", "6.2"], 4),
        (["数位分离", "格式化输入输出", "模拟算法"], ["5.4", "5.5", "5.6", "6.2", "6.3"], 4),
        (["浮点数运算", "字符串查找", "结构体排序"], ["5.4", "5.5", "5.6", "6.1", "6.3"], 4),
        (["数据类型转换", "结构体应用"], ["5.5", "5.6", "6.1"], 4),
        (["链表基础", "指针操作"], ["5.5", "5.6", "6.1"], 5),
        (["二叉树基础", "树遍历"], ["5.5", "5.6", "6.1", "6.2"], 5),
        (["string操作进阶", "数组应用", "结构体"], ["5.3", "5.4", "5.5", "5.6", "6.1", "6.2"], 4),
        (["查找算法", "标记法", "字符串综合"], ["5.3", "5.4", "5.5", "5.6", "6.1", "6.2"], 4),
        (["字符串处理", "函数调用", "结构体数组"], ["5.4", "5.5", "5.6", "6.1"], 4),
        (["数组排序", "字符串操作", "结构体"], ["5.3", "5.4", "5.5", "5.6", "6.1", "6.2"], 4),
        (["数组查找", "排序应用"], ["5.3", "5.5", "5.6", "6.1", "6.2"], 4),
        (["循环嵌套进阶", "结构体排序", "数组"], ["5.2", "5.3", "5.4", "5.5", "6.1", "6.2"], 4),
        (["桶排序进阶", "算法优化"], ["5.3", "5.4", "5.5", "5.6", "6.2"], 4),
        (["二维数组应用", "矩阵操作"], ["5.3", "5.5", "5.6", "6.1", "6.2"], 4),
        (["综合应用一", "算法综合"], ["5.3", "5.5", "5.6", "6.1", "6.2"], 4),
        (["综合应用二", "编程技巧"], ["5.5", "5.6", "6.1", "6.2"], 4),
        (["阶段测试", "复习巩固"], ["5.4", "5.5", "5.6", "6.2"], 4),
    ]
    
    kp_index = 0
    for lesson, (topics, mappings, difficulty) in enumerate(level3_topics, 1):
        progression[3][lesson] = []
        for i, topic in enumerate(topics):
            kp = generate_knowledge_point(3, lesson, kp_index, topic, mappings, difficulty)
            # Add to GESP 5 and 6
            knowledge_points[5].append(kp)
            knowledge_points[6].append(kp)
            progression[3][lesson].append(kp["id"])
            kp_index += 1
    
    # Level 4 -> GESP 7-8 (23 lessons) - Focus on competition algorithms
    level4_topics = [
        (["排列组合", "组合数学"], ["7.1", "7.2", "7.3"], 5),
        (["排列组合进阶", "计数原理"], ["7.1", "7.2", "7.3", "7.4"], 5),
        (["质数筛法", "埃氏筛", "线性筛"], ["7.5", "7.6"], 5),
        (["区间DP", "石子合并"], ["7.7", "7.8"], 5),
        (["区间DP进阶", "矩阵链乘"], ["7.7", "7.8"], 5),
        (["阶段测试"], ["7.1", "7.2", "7.7"], 4),
        (["参赛指导", "考试技巧"], ["7.1", "7.5"], 3),
        (["枚举优化", "折半枚举"], ["7.5", "7.6"], 5),
        (["贪心应用", "区间调度"], ["7.5", "7.6"], 5),
        (["模拟优化", "复杂模拟"], ["7.5", "7.6"], 5),
        (["搜索进阶", "记忆化搜索", "剪枝"], ["7.9", "7.10"], 5),
        (["复赛模拟"], ["7.5", "7.6", "7.9"], 4),
        (["计算机基础", "复杂度分析", "位运算"], ["7.1", "7.5", "7.6"], 4),
        (["数据结构", "栈队列", "单调栈"], ["7.11", "7.12", "7.13"], 5),
        (["树与图", "二叉树", "并查集"], ["7.11", "7.12", "7.13"], 5),
        (["数论", "GCD/LCM", "快速幂"], ["7.5", "7.6"], 5),
        (["高精度进阶"], ["7.5", "7.6"], 5),
        (["字符串算法", "KMP", "LCS", "回文"], ["7.9", "7.10"], 5),
        (["二分进阶", "三分查找"], ["7.5", "7.6"], 5),
        (["排序进阶", "归并", "快排", "堆排"], ["7.5", "7.6"], 5),
        (["递归分治", "分治思想"], ["7.7", "7.8"], 5),
        (["DP进阶", "背包", "LIS", "滚动数组"], ["7.7", "7.8"], 5),
        (["初赛模拟"], ["7.1", "7.5", "7.11"], 4),
    ]
    
    kp_index = 0
    for lesson, (topics, mappings, difficulty) in enumerate(level4_topics, 1):
        progression[4][lesson] = []
        for i, topic in enumerate(topics):
            kp = generate_knowledge_point(4, lesson, kp_index, topic, mappings, difficulty)
            # Add to GESP 7 and 8
            knowledge_points[7].append(kp)
            knowledge_points[8].append(kp)
            progression[4][lesson].append(kp["id"])
            kp_index += 1
    
    # Save to JSON files for reference
    with open('generated_knowledge_points.json', 'w', encoding='utf-8') as f:
        json.dump(knowledge_points, f, ensure_ascii=False, indent=2)
    
    with open('generated_progression.json', 'w', encoding='utf-8') as f:
        json.dump(progression, f, ensure_ascii=False, indent=2)
    
    print(f"Generated knowledge points:")
    for level in range(1, 9):
        print(f"  GESP Level {level}: {len(knowledge_points[level])} points")
    
    print(f"\nGenerated progression:")
    for level in range(1, 5):
        print(f"  Course Level {level}: {len(progression[level])} lessons")
    
    print("\nData saved to generated_knowledge_points.json and generated_progression.json")

if __name__ == '__main__':
    main()
