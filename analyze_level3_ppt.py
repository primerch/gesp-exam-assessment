#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
分析 Level 3 PPT 内容，提取每节课的知识点并映射到 GESP 5-6级大纲
"""

import json
import re

# 读取PPT分析文件
with open('/Users/reacher/Developer/gesp/ppt_analysis.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Level 3 课程内容
level3_data = data.get("Level_3", {})
lessons = level3_data.get("lessons", [])

# GESP 5-6级大纲知识点映射
# 基于GESP C++ 5-6级官方大纲
gesp_56_knowledge = {
    # GESP 5级知识点
    "5.1": "分支结构进阶（嵌套if、多分支）",
    "5.2": "循环结构进阶（循环嵌套）",
    "5.3": "数组进阶（二维数组、数组遍历）",
    "5.4": "字符串进阶（字符串操作、字符数组）",
    "5.5": "函数进阶（带参数函数、函数返回值）",
    "5.6": "基础算法思想（枚举、模拟）",
    
    # GESP 6级知识点
    "6.1": "数据结构进阶（结构体、结构体数组）",
    "6.2": "排序算法（桶排序、选择排序、冒泡排序）",
    "6.3": "字符串处理进阶（string类型、字符串函数）",
    "6.4": "函数递归思想",
    "6.5": "文件操作基础",
    "6.6": "综合算法应用",
}

# 知识点关键词映射表
knowledge_keywords = {
    # 数组相关
    "数组": ["一维数组", "数组定义", "数组初始化", "数组遍历", "数组下标"],
    "二维数组": ["二维数组", "数组嵌套"],
    "字符数组": ["字符数组", "char数组", "字符串数组"],
    
    # 字符串相关
    "字符串": ["字符串", "string", "字符数组", "字符串输入", "字符串输出"],
    "字符串操作": ["strlen", "strcpy", "strcmp", "strcat", "字符串长度", "字符串复制", "字符串比较", "字符串拼接"],
    "string类型": ["string类型", "string字符串", "getline", "s.length", "s.size", "s.find"],
    
    # 循环相关
    "for循环": ["for循环", "for语句"],
    "while循环": ["while循环", "while语句"],
    "do_while": ["do while", "dowhile"],
    "循环嵌套": ["循环嵌套", "双重循环", "双重for", "外层循环", "内层循环"],
    
    # 函数相关
    "函数": ["函数定义", "函数调用", "void", "return"],
    "函数参数": ["形参", "实参", "参数传递", "带参数函数"],
    "函数返回值": ["返回值", "return", "int函数"],
    "变量作用域": ["作用域", "局部变量", "全局变量", "局部优先"],
    
    # 数据类型
    "数据类型": ["int", "char", "float", "double", "long long", "数据类型转换", "强制转换"],
    "浮点数": ["float", "double", "浮点数", "精度", "有效数字", "setprecision"],
    
    # 输入输出
    "格式化输入输出": ["setw", "setfill", "printf", "scanf", "格式化", "%d", "%f", "%lf"],
    "万能头文件": ["bits/stdc++.h", "万能头文件"],
    
    # 结构体
    "结构体": ["struct", "结构体", "成员变量", "结构体数组", "结构体排序"],
    
    # 排序算法
    "排序算法": ["sort", "排序", "桶排序", "升序", "降序", "cmp"],
    "桶排序": ["桶排序", "桶"],
    "sort函数": ["sort", "algorithm"],
    
    # 系统函数
    "系统函数": ["max", "min", "swap", "algorithm"],
    
    # 算法思想
    "数位分离": ["数位分离", "%10", "/10", "个位", "十位", "百位"],
    "标记法": ["bool数组", "标记", "flag", "true", "false"],
    "枚举": ["枚举", "遍历", "穷举"],
    "模拟": ["模拟"],
    "计数": ["计数", "统计"],
    "查找": ["查找", "搜索", "find"],
    
    # 运算符
    "算术运算符": ["+", "-", "*", "/", "%", "取余", "除法"],
    "复合赋值": ["+=", "-=", "*=", "/=", "%="],
    
    # 字符处理
    "字符": ["char", "字符", "ASCII", "'", "字符编码"],
    "字符运算": ["字符运算", "字符加减", "大小写转换"],
}

# 每节课的知识点提取
def extract_knowledge_points(lesson_content):
    """从课程内容中提取知识点"""
    points = set()
    content_str = json.dumps(lesson_content, ensure_ascii=False).lower()
    
    for category, keywords in knowledge_keywords.items():
        for keyword in keywords:
            if keyword.lower() in content_str:
                points.add(category)
                break
    
    return sorted(list(points))

# 映射到GESP 5-6级
def map_to_gesp_56(knowledge_points):
    """将知识点映射到GESP 5-6级大纲"""
    mapping = []
    
    # 定义知识点到GESP等级的映射
    gesp_mapping = {
        # 5级映射
        "for循环": "5.1",
        "while循环": "5.1", 
        "do_while": "5.1",
        "循环嵌套": "5.2",
        "数组": "5.3",
        "字符数组": "5.4",
        "字符串": "5.4",
        "字符串操作": "5.4",
        "函数": "5.5",
        "函数参数": "5.5",
        "函数返回值": "5.5",
        "枚举": "5.6",
        "模拟": "5.6",
        "标记法": "5.6",
        "数位分离": "5.6",
        "计数": "5.6",
        "查找": "5.6",
        
        # 6级映射
        "string类型": "6.3",
        "结构体": "6.1",
        "排序算法": "6.2",
        "桶排序": "6.2",
        "sort函数": "6.2",
        "变量作用域": "5.5",
        "系统函数": "6.2",
        "格式化输入输出": "5.5",
        "数据类型": "5.5",
        "浮点数": "5.5",
    }
    
    for point in knowledge_points:
        if point in gesp_mapping:
            gesp_code = gesp_mapping[point]
            mapping.append({
                "gesp_level": gesp_code,
                "gesp_desc": gesp_56_knowledge.get(gesp_code, "")
            })
    
    # 去重
    unique_mapping = []
    seen = set()
    for item in mapping:
        if item["gesp_level"] not in seen:
            seen.add(item["gesp_level"])
            unique_mapping.append(item)
    
    return sorted(unique_mapping, key=lambda x: x["gesp_level"])

# 生成分析结果
results = []

print("=" * 80)
print("Level 3 PPT 知识点分析与 GESP 5-6级大纲映射")
print("=" * 80)
print()

for lesson in lessons:
    filename = lesson.get("filename", "")
    total_pages = lesson.get("total_pages", 0)
    pages = lesson.get("pages", [])
    
    # 提取标题（从文件名中提取）
    title = filename.replace(".pptx", "").strip()
    
    # 提取知识点
    knowledge_points = extract_knowledge_points(lesson)
    
    # 映射到GESP
    gesp_mapping = map_to_gesp_56(knowledge_points)
    
    result = {
        "filename": filename,
        "title": title,
        "total_pages": total_pages,
        "knowledge_points": knowledge_points,
        "gesp_mapping": gesp_mapping
    }
    results.append(result)
    
    print(f"【课件】{title}")
    print(f"  页数: {total_pages}页")
    print(f"  知识点: {', '.join(knowledge_points) if knowledge_points else '基础复习'}")
    if gesp_mapping:
        print(f"  GESP 5-6级映射:")
        for mapping in gesp_mapping:
            print(f"    - {mapping['gesp_level']}: {mapping['gesp_desc']}")
    print()

# 统计各GESP等级覆盖情况
print("=" * 80)
print("GESP 5-6级知识点覆盖统计")
print("=" * 80)
print()

coverage = {}
for result in results:
    for mapping in result.get("gesp_mapping", []):
        level = mapping["gesp_level"]
        desc = mapping["gesp_desc"]
        if level not in coverage:
            coverage[level] = {"desc": desc, "lessons": []}
        coverage[level]["lessons"].append(result["title"])

for level in sorted(coverage.keys()):
    info = coverage[level]
    print(f"【{level}】{info['desc']}")
    print(f"  覆盖课件: {', '.join(info['lessons'][:3])}{'...' if len(info['lessons']) > 3 else ''}")
    print(f"  课件数量: {len(info['lessons'])}")
    print()

# 保存结果到文件
output_file = '/Users/reacher/Developer/gesp/level3_knowledge_mapping.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump({
        "analysis_summary": {
            "total_lessons": len(lessons),
            "gesp_5_covered": len([k for k in coverage.keys() if k.startswith("5.")]),
            "gesp_6_covered": len([k for k in coverage.keys() if k.startswith("6.")]),
        },
        "gesp_56_outline": gesp_56_knowledge,
        "coverage": coverage,
        "lessons": results
    }, f, ensure_ascii=False, indent=2)

print(f"分析结果已保存到: {output_file}")
