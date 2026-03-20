#!/usr/bin/env python3
"""
详细分析 Level 1 所有 PPT 内容，提取知识点并映射到 GESP 大纲
"""

import json
import re
from collections import defaultdict

# GESP 知识点映射定义
GESP_MAPPING = {
    # Level 1 考点
    "l1_1": "计算机基础：计算机软硬件组成、操作系统基本概念",
    "l1_2": "集成开发环境：创建文件、编辑文件、保存文件、编译、解释、调试",
    "l1_3": "程序框架：#include、using namespace、main函数、return 0",
    "l1_4": "输入输出：cin/cout、scanf/printf",
    "l1_5": "变量定义：标识符、关键字、常量、变量、命名规则、定义、初始化、赋值",
    "l1_6": "基本数据类型：int、long long、float、double、char、bool",
    "l1_7": "算术运算：+、-、*、/、%、整除",
    "l1_8": "逻辑运算：&&、||、!",
    "l1_9": "关系运算：>、>=、<、<=、==、!=",
    "l1_10": "三目运算：条件?值1:值2",
    "l1_11": "顺序结构",
    "l1_12": "分支结构：if、if-else、switch",
    "l1_13": "循环结构：for、while、do-while、break、continue",
    "l1_14": "数组基础：一维数组定义、初始化、访问、遍历",
    
    # Level 2 考点
    "l2_1": "计算机存储：ROM、RAM、Cache",
    "l2_2": "计算机网络：网络分类、TCP/IP模型、IP地址",
    "l2_3": "流程图：符号、绘制方法",
    "l2_4": "ASCII编码：字符与ASCII码转换（空格32, 0=48, A=65, a=97）",
    "l2_5": "数据类型转换：强制转换、隐式转换",
    "l2_6": "多层分支：if嵌套、switch嵌套",
    "l2_7": "多层循环：循环嵌套",
    "l2_8": "数学函数：abs、sqrt、max、min、rand/srand",
    "l2_9": "数组进阶：求最值、查找、统计",
    "l2_10": "字符数组与字符串",
    "l2_11": "string类型"
}

# 课程标题映射
LESSON_TITLES = {
    1: "变量和数据的输入输出",
    2: "算数运算符和字符型",
    3: "比较运算符和 if 语句",
    4: "逻辑运算符和多分支语句",
    5: "阶段复习与练习一",
    6: "for 循环",
    7: "for 循环进阶",
    8: "数组",
    9: "数组进阶",
    10: "阶段复习与练习二",
    11: "while 循环",
    12: "格式化输入输出和浮点数",
    13: "浮点数和数据类型转换",
    14: "字符串和字符数组",
    15: "string 类型的字符串",
    16: "阶段复习与练习三",
    17: "函数基础",
    18: "函数进阶",
    19: "结构体",
    20: "循环的嵌套",
    21: "双层for循环",
    22: "桶排序与选择排序",
    23: "冒泡排序与插入排序",
    24: "二维数组"
}

def find_slides_with_keywords(content_list, keywords):
    """查找包含关键字的幻灯片编号"""
    matching_slides = []
    for item in content_list:
        slide_num = item['slide_number']
        texts = ' '.join(item['content']).lower()
        for kw in keywords:
            if kw.lower() in texts:
                matching_slides.append(slide_num)
                break
    return sorted(list(set(matching_slides)))

def analyze_lesson_1(content_list, all_text):
    """分析第1课：变量和数据的输入输出"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 1. C++程序基本框架
    slides = find_slides_with_keywords(content_list, ['#include', 'main函数', 'main', 'return 0', 'using namespace'])
    if slides:
        knowledge_points.append({
            "name": "C++程序基本框架",
            "description": "包含头文件#include、使用命名空间using namespace std、main函数定义、return 0返回值",
            "gesp_mapping": ["l1_3"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_3")
    
    # 2. 集成开发环境
    slides = find_slides_with_keywords(content_list, ['Dev-C++', '编译运行', '保存', '调试', '.cpp'])
    if slides:
        knowledge_points.append({
            "name": "集成开发环境使用",
            "description": "Dev-C++工具的基本操作：创建文件、编辑代码、保存为.cpp文件、编译运行程序",
            "gesp_mapping": ["l1_2"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_2")
    
    # 3. 输出语句cout
    slides = find_slides_with_keywords(content_list, ['cout', '输出', '<<', 'Hello world'])
    if slides:
        knowledge_points.append({
            "name": "输出语句cout",
            "description": "使用cout和<<运算符进行标准输出，输出字符串和变量值",
            "gesp_mapping": ["l1_4"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_4")
    
    # 4. 变量定义与数据类型
    slides = find_slides_with_keywords(content_list, ['变量', 'int', '定义', '数据类型', '标识符'])
    if slides:
        knowledge_points.append({
            "name": "变量定义与命名规则",
            "description": "变量的定义、初始化、赋值操作，标识符命名规则，关键字与常量的概念",
            "gesp_mapping": ["l1_5", "l1_6"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_5")
        gesp_l1.add("l1_6")
    
    # 5. 输入语句cin
    slides = find_slides_with_keywords(content_list, ['cin', '输入', '>>'])
    if slides:
        knowledge_points.append({
            "name": "输入语句cin",
            "description": "使用cin和>>运算符进行标准输入，从键盘读取数据到变量",
            "gesp_mapping": ["l1_4"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_4")
    
    # 6. 顺序结构
    knowledge_points.append({
        "name": "顺序结构",
        "description": "程序按代码书写顺序依次执行的基本结构",
        "gesp_mapping": ["l1_11"],
        "slides_covered": list(range(1, min(11, len(content_list)+1)))
    })
    gesp_l1.add("l1_11")
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_2(content_list, all_text):
    """分析第2课：算数运算符和字符型"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 1. 算术运算符
    slides = find_slides_with_keywords(content_list, ['+', '-', '*', '/', '%', '算术', '整除', '取模'])
    if slides:
        knowledge_points.append({
            "name": "算术运算符",
            "description": "加法(+)、减法(-)、乘法(*)、除法(/)、取模(%)运算符的使用，整除概念",
            "gesp_mapping": ["l1_7"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_7")
    
    # 2. 字符型char
    slides = find_slides_with_keywords(content_list, ['char', '字符', 'ASCII'])
    if slides:
        knowledge_points.append({
            "name": "字符型数据类型",
            "description": "char类型的定义和使用，字符常量，字符与ASCII码的关系",
            "gesp_mapping": ["l1_6", "l2_4"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_6")
        gesp_l2.add("l2_4")
    
    # 3. ASCII编码
    slides = find_slides_with_keywords(content_list, ['ASCII', '32', '48', '65', '97'])
    if slides:
        knowledge_points.append({
            "name": "ASCII编码",
            "description": "ASCII编码表，空格(32)、'0'(48)、'A'(65)、'a'(97)等常见字符的ASCII值",
            "gesp_mapping": ["l2_4"],
            "slides_covered": slides[:10]
        })
        gesp_l2.add("l2_4")
    
    # 4. 变量类型扩展
    slides = find_slides_with_keywords(content_list, ['int', 'long long', 'bool'])
    if slides:
        knowledge_points.append({
            "name": "基本数据类型",
            "description": "int、long long、bool等数据类型的使用",
            "gesp_mapping": ["l1_6"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_6")
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_3(content_list, all_text):
    """分析第3课：比较运算符和 if 语句"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 1. 关系运算符
    slides = find_slides_with_keywords(content_list, ['>', '<', '==', '!=', '>=', '<=', '关系', '比较'])
    if slides:
        knowledge_points.append({
            "name": "关系运算符",
            "description": "大于(>)、大于等于(>=)、小于(<)、小于等于(<=)、等于(==)、不等于(!=)运算符",
            "gesp_mapping": ["l1_9"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_9")
    
    # 2. if语句
    slides = find_slides_with_keywords(content_list, ['if', '如果', '条件'])
    if slides:
        knowledge_points.append({
            "name": "if分支语句",
            "description": "单分支if语句和双分支if-else语句的语法和用法",
            "gesp_mapping": ["l1_12"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_12")
    
    # 3. 分支结构
    knowledge_points.append({
        "name": "分支结构",
        "description": "根据条件判断执行不同代码块的程序结构",
        "gesp_mapping": ["l1_12"],
        "slides_covered": list(range(1, min(11, len(content_list)+1)))
    })
    gesp_l1.add("l1_12")
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_4(content_list, all_text):
    """分析第4课：逻辑运算符和多分支语句"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 1. 逻辑运算符
    slides = find_slides_with_keywords(content_list, ['&&', '||', '!', '逻辑', '并且', '或者', '非'])
    if slides:
        knowledge_points.append({
            "name": "逻辑运算符",
            "description": "逻辑与(&&)、逻辑或(||)、逻辑非(!)运算符的使用",
            "gesp_mapping": ["l1_8"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_8")
    
    # 2. 多分支if-else if
    slides = find_slides_with_keywords(content_list, ['else if', '多分支', '嵌套'])
    if slides:
        knowledge_points.append({
            "name": "多分支if-else if语句",
            "description": "使用if-else if-else实现多条件分支判断",
            "gesp_mapping": ["l1_12", "l2_6"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_12")
        gesp_l2.add("l2_6")
    
    # 3. switch语句
    slides = find_slides_with_keywords(content_list, ['switch', 'case', 'break', 'default'])
    if slides:
        knowledge_points.append({
            "name": "switch多分支语句",
            "description": "switch-case-break-default结构的语法和应用",
            "gesp_mapping": ["l1_12"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_12")
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_5(content_list, all_text):
    """分析第5课：阶段复习与练习一"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 复习课包含前面所有知识点
    knowledge_points.append({
        "name": "阶段复习：变量与输入输出",
        "description": "复习变量定义、cin/cout输入输出、程序基本框架",
        "gesp_mapping": ["l1_2", "l1_3", "l1_4", "l1_5", "l1_6"],
        "slides_covered": list(range(1, min(11, len(content_list)+1)))
    })
    gesp_l1.update(["l1_2", "l1_3", "l1_4", "l1_5", "l1_6"])
    
    knowledge_points.append({
        "name": "阶段复习：运算符与分支",
        "description": "复习算术运算符、关系运算符、逻辑运算符、if语句",
        "gesp_mapping": ["l1_7", "l1_8", "l1_9", "l1_12"],
        "slides_covered": list(range(11, min(21, len(content_list)+1)))
    })
    gesp_l1.update(["l1_7", "l1_8", "l1_9", "l1_12"])
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_6(content_list, all_text):
    """分析第6课：for 循环"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 1. for循环基础
    slides = find_slides_with_keywords(content_list, ['for', '循环', '初始化', '条件', '增量'])
    if slides:
        knowledge_points.append({
            "name": "for循环基础语法",
            "description": "for循环的结构：初始化语句、循环条件、变量更新，循环体执行流程",
            "gesp_mapping": ["l1_13"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_13")
    
    # 2. 循环控制
    slides = find_slides_with_keywords(content_list, ['break', 'continue'])
    if slides:
        knowledge_points.append({
            "name": "循环控制语句",
            "description": "break语句跳出循环，continue语句跳过当前迭代",
            "gesp_mapping": ["l1_13"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_13")
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_7(content_list, all_text):
    """分析第7课：for 循环进阶"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 1. for循环嵌套（初步）
    slides = find_slides_with_keywords(content_list, ['嵌套', '双重', '多重'])
    if slides:
        knowledge_points.append({
            "name": "for循环进阶应用",
            "description": "for循环的复杂应用，包括循环嵌套初探",
            "gesp_mapping": ["l1_13", "l2_7"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_13")
        gesp_l2.add("l2_7")
    
    # 2. 数学函数
    slides = find_slides_with_keywords(content_list, ['sum', '累加', '累乘'])
    if slides:
        knowledge_points.append({
            "name": "累加累乘算法",
            "description": "使用循环实现累加和累乘操作",
            "gesp_mapping": ["l1_13"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_13")
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_8(content_list, all_text):
    """分析第8课：数组"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 1. 数组定义和初始化
    slides = find_slides_with_keywords(content_list, ['数组', 'array', '定义', '初始化'])
    if slides:
        knowledge_points.append({
            "name": "一维数组定义与初始化",
            "description": "一维数组的定义语法、初始化方法（全部初始化、部分初始化）",
            "gesp_mapping": ["l1_14"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_14")
    
    # 2. 数组访问
    slides = find_slides_with_keywords(content_list, ['下标', '索引', '访问', 'a['])
    if slides:
        knowledge_points.append({
            "name": "数组元素访问",
            "description": "通过下标访问数组元素，数组下标从0开始",
            "gesp_mapping": ["l1_14"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_14")
    
    # 3. 数组遍历
    slides = find_slides_with_keywords(content_list, ['遍历', 'for', '循环', '数组'])
    if slides:
        knowledge_points.append({
            "name": "数组遍历",
            "description": "使用for循环遍历数组元素",
            "gesp_mapping": ["l1_14"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_14")
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_9(content_list, all_text):
    """分析第9课：数组进阶"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 1. 数组求最值
    slides = find_slides_with_keywords(content_list, ['最大', '最小', '最值', 'max', 'min'])
    if slides:
        knowledge_points.append({
            "name": "数组求最值",
            "description": "在数组中查找最大值和最小值",
            "gesp_mapping": ["l2_9"],
            "slides_covered": slides[:10]
        })
        gesp_l2.add("l2_9")
    
    # 2. 数组查找
    slides = find_slides_with_keywords(content_list, ['查找', '搜索', '定位'])
    if slides:
        knowledge_points.append({
            "name": "数组元素查找",
            "description": "在数组中查找特定元素",
            "gesp_mapping": ["l2_9"],
            "slides_covered": slides[:10]
        })
        gesp_l2.add("l2_9")
    
    # 3. 数组统计
    slides = find_slides_with_keywords(content_list, ['统计', '计数', '求和', '平均'])
    if slides:
        knowledge_points.append({
            "name": "数组统计运算",
            "description": "对数组元素进行统计、计数、求和、求平均等操作",
            "gesp_mapping": ["l2_9"],
            "slides_covered": slides[:10]
        })
        gesp_l2.add("l2_9")
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_10(content_list, all_text):
    """分析第10课：阶段复习与练习二"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    knowledge_points.append({
        "name": "阶段复习：循环结构",
        "description": "复习for循环语法、break和continue语句",
        "gesp_mapping": ["l1_13"],
        "slides_covered": list(range(1, min(11, len(content_list)+1)))
    })
    gesp_l1.add("l1_13")
    
    knowledge_points.append({
        "name": "阶段复习：数组基础",
        "description": "复习数组定义、初始化、访问、遍历",
        "gesp_mapping": ["l1_14", "l2_9"],
        "slides_covered": list(range(11, min(21, len(content_list)+1)))
    })
    gesp_l1.add("l1_14")
    gesp_l2.add("l2_9")
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_11(content_list, all_text):
    """分析第11课：while 循环"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 1. while循环
    slides = find_slides_with_keywords(content_list, ['while', '当'])
    if slides:
        knowledge_points.append({
            "name": "while循环",
            "description": "while循环的语法结构和执行流程，当型循环",
            "gesp_mapping": ["l1_13"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_13")
    
    # 2. do-while循环
    slides = find_slides_with_keywords(content_list, ['do-while', 'do while'])
    if slides:
        knowledge_points.append({
            "name": "do-while循环",
            "description": "do-while循环的语法结构和执行流程，直到型循环",
            "gesp_mapping": ["l1_13"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_13")
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_12(content_list, all_text):
    """分析第12课：格式化输入输出和浮点数"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 1. 浮点数类型
    slides = find_slides_with_keywords(content_list, ['float', 'double', '浮点'])
    if slides:
        knowledge_points.append({
            "name": "浮点数数据类型",
            "description": "float和double类型的定义、精度区别",
            "gesp_mapping": ["l1_6"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_6")
    
    # 2. printf格式化输出
    slides = find_slides_with_keywords(content_list, ['printf', '%d', '%f', '%c', '格式化'])
    if slides:
        knowledge_points.append({
            "name": "printf格式化输出",
            "description": "printf函数的使用，格式控制符%d、%f、%c、%s等",
            "gesp_mapping": ["l1_4"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_4")
    
    # 3. scanf格式化输入
    slides = find_slides_with_keywords(content_list, ['scanf', '输入'])
    if slides:
        knowledge_points.append({
            "name": "scanf格式化输入",
            "description": "scanf函数的使用，格式化输入数据",
            "gesp_mapping": ["l1_4"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_4")
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_13(content_list, all_text):
    """分析第13课：浮点数和数据类型转换"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 1. 数据类型转换
    slides = find_slides_with_keywords(content_list, ['转换', '强制', '隐式', '类型'])
    if slides:
        knowledge_points.append({
            "name": "数据类型转换",
            "description": "隐式类型转换和显式(强制)类型转换",
            "gesp_mapping": ["l2_5"],
            "slides_covered": slides[:10]
        })
        gesp_l2.add("l2_5")
    
    # 2. 浮点数精度
    slides = find_slides_with_keywords(content_list, ['精度', '小数', 'float', 'double'])
    if slides:
        knowledge_points.append({
            "name": "浮点数精度控制",
            "description": "控制浮点数输出精度，理解浮点数存储原理",
            "gesp_mapping": ["l1_6"],
            "slides_covered": slides[:10]
        })
        gesp_l1.add("l1_6")
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_14(content_list, all_text):
    """分析第14课：字符串和字符数组"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 1. 字符数组
    slides = find_slides_with_keywords(content_list, ['字符数组', 'char[]', '字符串'])
    if slides:
        knowledge_points.append({
            "name": "字符数组",
            "description": "字符数组的定义、初始化，用字符数组存储字符串",
            "gesp_mapping": ["l2_10"],
            "slides_covered": slides[:10]
        })
        gesp_l2.add("l2_10")
    
    # 2. 字符串操作
    slides = find_slides_with_keywords(content_list, ['strlen', 'strcpy', '字符串操作'])
    if slides:
        knowledge_points.append({
            "name": "字符串基本操作",
            "description": "字符串长度计算、复制等基本操作",
            "gesp_mapping": ["l2_10"],
            "slides_covered": slides[:10]
        })
        gesp_l2.add("l2_10")
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_15(content_list, all_text):
    """分析第15课：string 类型的字符串"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 1. string类型
    slides = find_slides_with_keywords(content_list, ['string', '字符串', '头文件'])
    if slides:
        knowledge_points.append({
            "name": "string类型",
            "description": "C++ string类型的定义、初始化、基本操作",
            "gesp_mapping": ["l2_11"],
            "slides_covered": slides[:10]
        })
        gesp_l2.add("l2_11")
    
    # 2. string操作
    slides = find_slides_with_keywords(content_list, ['length', 'size', 'substr', 'find'])
    if slides:
        knowledge_points.append({
            "name": "string类型操作",
            "description": "string类型的成员函数：length/size、substr、find等",
            "gesp_mapping": ["l2_11"],
            "slides_covered": slides[:10]
        })
        gesp_l2.add("l2_11")
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_16(content_list, all_text):
    """分析第16课：阶段复习与练习三"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    knowledge_points.append({
        "name": "阶段复习：while/do-while循环",
        "description": "复习while和do-while循环语法",
        "gesp_mapping": ["l1_13"],
        "slides_covered": list(range(1, min(11, len(content_list)+1)))
    })
    gesp_l1.add("l1_13")
    
    knowledge_points.append({
        "name": "阶段复习：字符串处理",
        "description": "复习字符数组和string类型的使用",
        "gesp_mapping": ["l2_10", "l2_11"],
        "slides_covered": list(range(11, min(21, len(content_list)+1)))
    })
    gesp_l2.update(["l2_10", "l2_11"])
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_17(content_list, all_text):
    """分析第17课：函数基础"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 函数是扩展内容，不是GESP 1-2级考点，但为后续学习打基础
    slides = find_slides_with_keywords(content_list, ['函数', 'function', '调用'])
    if slides:
        knowledge_points.append({
            "name": "函数基础（扩展内容）",
            "description": "函数的定义、声明、调用，函数参数和返回值概念",
            "gesp_mapping": [],
            "slides_covered": slides[:10],
            "note": "函数为Level 3-4内容，本课为扩展预习"
        })
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_18(content_list, all_text):
    """分析第18课：函数进阶"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 数学函数
    slides = find_slides_with_keywords(content_list, ['abs', 'sqrt', 'max', 'min', 'rand', 'srand', 'cmath'])
    if slides:
        knowledge_points.append({
            "name": "数学库函数",
            "description": "abs、sqrt、max、min函数的使用，rand/srand随机数生成",
            "gesp_mapping": ["l2_8"],
            "slides_covered": slides[:10]
        })
        gesp_l2.add("l2_8")
    
    slides = find_slides_with_keywords(content_list, ['函数', '参数', '返回值'])
    if slides:
        knowledge_points.append({
            "name": "函数进阶（扩展内容）",
            "description": "函数参数传递、返回值、函数重载基础",
            "gesp_mapping": [],
            "slides_covered": slides[:10],
            "note": "函数进阶为Level 3-4内容"
        })
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_19(content_list, all_text):
    """分析第19课：结构体"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 结构体是扩展内容
    slides = find_slides_with_keywords(content_list, ['struct', '结构体'])
    if slides:
        knowledge_points.append({
            "name": "结构体（扩展内容）",
            "description": "结构体的定义、成员访问、结构体数组",
            "gesp_mapping": [],
            "slides_covered": slides[:10],
            "note": "结构体为Level 3-4内容，本课为扩展预习"
        })
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_20(content_list, all_text):
    """分析第20课：循环的嵌套"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 1. 循环嵌套
    slides = find_slides_with_keywords(content_list, ['嵌套', '双重', '多重循环'])
    if slides:
        knowledge_points.append({
            "name": "循环嵌套",
            "description": "多层循环嵌套的执行流程和应用",
            "gesp_mapping": ["l2_7"],
            "slides_covered": slides[:10]
        })
        gesp_l2.add("l2_7")
    
    # 2. 流程图
    slides = find_slides_with_keywords(content_list, ['流程图', '菱形', '矩形'])
    if slides:
        knowledge_points.append({
            "name": "程序流程图",
            "description": "流程图符号和绘制方法",
            "gesp_mapping": ["l2_3"],
            "slides_covered": slides[:10]
        })
        gesp_l2.add("l2_3")
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_21(content_list, all_text):
    """分析第21课：双层for循环"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 1. 双层for循环
    slides = find_slides_with_keywords(content_list, ['双层', 'for', '嵌套', '行列'])
    if slides:
        knowledge_points.append({
            "name": "双层for循环",
            "description": "外层循环控制行，内层循环控制列，双重循环的执行流程",
            "gesp_mapping": ["l2_7"],
            "slides_covered": slides[:10]
        })
        gesp_l2.add("l2_7")
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_22(content_list, all_text):
    """分析第22课：桶排序与选择排序"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 1. 桶排序
    slides = find_slides_with_keywords(content_list, ['桶排序', '计数'])
    if slides:
        knowledge_points.append({
            "name": "桶排序",
            "description": "桶排序思想：根据数据范围准备桶，计数排序",
            "gesp_mapping": [],
            "slides_covered": slides[:10],
            "note": "排序算法为拓展算法内容"
        })
    
    # 2. 选择排序
    slides = find_slides_with_keywords(content_list, ['选择排序'])
    if slides:
        knowledge_points.append({
            "name": "选择排序",
            "description": "选择排序思想：每次选择最大/最小元素放到正确位置",
            "gesp_mapping": [],
            "slides_covered": slides[:10],
            "note": "排序算法为拓展算法内容"
        })
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_23(content_list, all_text):
    """分析第23课：冒泡排序与插入排序"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 1. 冒泡排序
    slides = find_slides_with_keywords(content_list, ['冒泡排序', '冒泡'])
    if slides:
        knowledge_points.append({
            "name": "冒泡排序",
            "description": "冒泡排序思想：相邻元素比较交换，每轮冒出最大/最小值",
            "gesp_mapping": [],
            "slides_covered": slides[:10],
            "note": "排序算法为拓展算法内容"
        })
    
    # 2. 插入排序
    slides = find_slides_with_keywords(content_list, ['插入排序', '插入'])
    if slides:
        knowledge_points.append({
            "name": "插入排序",
            "description": "插入排序思想：将元素依次插入到已有序数列的正确位置",
            "gesp_mapping": [],
            "slides_covered": slides[:10],
            "note": "排序算法为拓展算法内容"
        })
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

def analyze_lesson_24(content_list, all_text):
    """分析第24课：二维数组"""
    knowledge_points = []
    gesp_l1 = set()
    gesp_l2 = set()
    
    # 1. 二维数组定义
    slides = find_slides_with_keywords(content_list, ['二维数组', 'a[][]'])
    if slides:
        knowledge_points.append({
            "name": "二维数组",
            "description": "二维数组的定义、初始化、元素访问，二维数组与矩阵的关系",
            "gesp_mapping": [],
            "slides_covered": slides[:10],
            "note": "二维数组为拓展内容，GESP 1-2级主要考察一维数组"
        })
    
    return knowledge_points, sorted(list(gesp_l1)), sorted(list(gesp_l2))

# 分析函数映射
ANALYZERS = {
    1: analyze_lesson_1,
    2: analyze_lesson_2,
    3: analyze_lesson_3,
    4: analyze_lesson_4,
    5: analyze_lesson_5,
    6: analyze_lesson_6,
    7: analyze_lesson_7,
    8: analyze_lesson_8,
    9: analyze_lesson_9,
    10: analyze_lesson_10,
    11: analyze_lesson_11,
    12: analyze_lesson_12,
    13: analyze_lesson_13,
    14: analyze_lesson_14,
    15: analyze_lesson_15,
    16: analyze_lesson_16,
    17: analyze_lesson_17,
    18: analyze_lesson_18,
    19: analyze_lesson_19,
    20: analyze_lesson_20,
    21: analyze_lesson_21,
    22: analyze_lesson_22,
    23: analyze_lesson_23,
    24: analyze_lesson_24,
}

def generate_summary(knowledge_points, gesp_l1, gesp_l2, lesson_num):
    """生成课程总结"""
    parts = []
    
    if gesp_l1:
        parts.append(f"涵盖GESP 1级的{len(gesp_l1)}个考点")
    if gesp_l2:
        parts.append(f"涵盖GESP 2级的{len(gesp_l2)}个考点")
    
    main_topics = [kp["name"] for kp in knowledge_points[:3]]
    if main_topics:
        parts.append(f"主要内容包括：{', '.join(main_topics)}")
    
    return "；".join(parts) + "。"

def main():
    """主函数"""
    print("开始详细分析 Level 1 的所有 PPT 内容...")
    
    for lesson_num in range(1, 25):
        print(f"\n分析第 {lesson_num} 课: {LESSON_TITLES[lesson_num]}")
        
        # 读取原始分析结果
        raw_path = f"/Users/reacher/Developer/gesp/analysis_results/level1_lesson{lesson_num}_raw.json"
        with open(raw_path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
        
        content_list = raw_data["slides_content"]
        all_text = "\n".join(raw_data["all_text"])
        
        # 调用对应的分析函数
        analyzer = ANALYZERS[lesson_num]
        knowledge_points, gesp_l1, gesp_l2 = analyzer(content_list, all_text)
        
        # 生成最终结果
        result = {
            "level": 1,
            "lesson_number": lesson_num,
            "title": LESSON_TITLES[lesson_num],
            "file_name": raw_data["file_name"],
            "total_slides": raw_data["total_slides"],
            "knowledge_points": knowledge_points,
            "gesp_level_1_points": gesp_l1,
            "gesp_level_2_points": gesp_l2,
            "summary": generate_summary(knowledge_points, gesp_l1, gesp_l2, lesson_num)
        }
        
        # 保存结果
        output_path = f"/Users/reacher/Developer/gesp/analysis_results/level1_lesson{lesson_num}.json"
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        print(f"  ✓ 已保存: {output_path}")
        print(f"    知识点数量: {len(knowledge_points)}")
        print(f"    GESP 1级考点: {len(gesp_l1)}个")
        print(f"    GESP 2级考点: {len(gesp_l2)}个")
    
    print("\n✅ 所有课程分析完成！")

if __name__ == "__main__":
    main()
