/**
 * GESP C++ 考试大纲 - 统一数据源版本
 * 来源：从 curriculum-data.ts 导入的 100% 验证数据
 * 验证日期：2026-03-20
 * 包含：8个级别，62个考点
 */

import { gespSyllabus, gespLevels as curriculumGespLevels } from './curriculum-data';

export interface GespOutlineItem {
  id: string;
  level: number;
  category: string;
  name: string;
  description: string;
  keywords: string[];
}

// 从 curriculum-data.ts 的 gespSyllabus 转换为大纲格式
// curriculum-data.ts 中的 gespSyllabus: Record<number, Array<{id, name, description}>>
function convertSyllabusToOutline(): GespOutlineItem[] {
  const outline: GespOutlineItem[] = [];
  
  // 类别映射表
  const categoryMap: Record<number, string> = {
    1: "基础概念",
    2: "程序结构",
    3: "数据结构",
    4: "算法",
    5: "数学",
    6: "图论",
    7: "编码",
    8: "函数",
    9: "指针",
    10: "文件",
    11: "面向对象",
    12: "搜索",
    13: "动态规划",
  };
  
  // 根据考点ID前缀判断类别
  const getCategory = (gespId: string): string => {
    const [level, pointId] = gespId.split('.');
    const pointNum = parseInt(pointId);
    
    const categoryByPoint: Record<string, Record<number, string>> = {
      "1": { 1: "基础概念", 2: "基础概念", 3: "程序结构", 4: "基础概念", 5: "基础概念", 6: "基础概念", 7: "基础概念", 8: "程序结构", 9: "程序结构", 10: "程序结构", 11: "基础概念" },
      "2": { 1: "基础概念", 2: "基础概念", 3: "数据结构", 4: "编码", 5: "基础概念", 6: "程序结构", 7: "程序结构", 8: "函数" },
      "3": { 1: "编码", 2: "算法", 3: "基础概念", 4: "算法", 5: "数据结构", 6: "数据结构" },
      "4": { 1: "指针", 2: "数据结构", 3: "数据结构", 4: "函数", 5: "算法", 6: "算法", 7: "算法", 8: "文件", 9: "文件" },
      "5": { 1: "数学", 2: "数学", 3: "算法", 4: "算法", 5: "数据结构", 6: "算法", 7: "算法", 8: "算法", 9: "算法" },
      "6": { 1: "数据结构", 2: "编码", 3: "搜索", 4: "动态规划", 5: "面向对象", 6: "数据结构" },
      "7": { 1: "数学", 2: "动态规划", 3: "图论", 4: "图论", 5: "数据结构" },
      "8": { 1: "数学", 2: "数学", 3: "数学", 4: "算法", 5: "数学", 6: "图论", 7: "算法", 8: "算法" },
    };
    
    return categoryByPoint[level]?.[pointNum] || "其他";
  };
  
  // 根据描述生成关键词
  const generateKeywords = (name: string, description: string): string[] => {
    const keywords: string[] = [];
    const text = (name + " " + description).toLowerCase();
    
    // 提取关键技术术语
    const terms = [
      // 基础
      "计算机", "cpu", "内存", "操作系统", "ide", "dev c++", "编译", "调试",
      // 语法
      "cin", "cout", "scanf", "printf", "变量", "常量", "标识符", "关键字",
      // 数据类型
      "int", "long long", "float", "double", "char", "bool", "数组", "字符串",
      // 运算
      "算术", "逻辑", "关系", "位运算", "与", "或", "非", "异或",
      // 结构
      "顺序", "分支", "循环", "if", "switch", "for", "while", "break", "continue",
      // 算法
      "枚举", "模拟", "递推", "递归", "贪心", "分治", "排序", "二分", "复杂度",
      // 数据结构
      "指针", "结构体", "链表", "栈", "队列", "树", "二叉树", "哈夫曼", "哈希表",
      // 搜索与图论
      "dfs", "bfs", "搜索", "图", "遍历", "最短路", "生成树", "dijkstra", "floyd",
      // 动态规划
      "dp", "动态规划", "背包", "lis", "lcs",
      // 数学
      "素数", "gcd", "lcm", "质因数", "高精度", "排列", "组合", "杨辉三角",
      // 其他
      "文件", "面向对象", "类", "继承", "多态", "编码", "ascii", "进制",
    ];
    
    terms.forEach(term => {
      if (text.includes(term)) {
        keywords.push(term);
      }
    });
    
    return keywords.length > 0 ? keywords : ["gesp"];
  };
  
  // 遍历所有级别
  Object.entries(gespSyllabus).forEach(([levelStr, points]) => {
    const level = parseInt(levelStr);
    points.forEach((point, index) => {
      outline.push({
        id: `l${level}_${index + 1}`,
        level,
        category: getCategory(point.id),
        name: point.name,
        description: point.description,
        keywords: generateKeywords(point.name, point.description),
      });
    });
  });
  
  return outline;
}

// GESP 各级别详细大纲（从 curriculum-data.ts 动态生成）
export const gespCppOutline: GespOutlineItem[] = convertSyllabusToOutline();

// 获取指定级别的所有知识点
export function getOutlineByLevel(level: number): GespOutlineItem[] {
  return gespCppOutline.filter(item => item.level === level);
}

// 根据关键词查找知识点
export function findKnowledgeByKeyword(keyword: string): GespOutlineItem[] {
  const lowerKeyword = keyword.toLowerCase();
  return gespCppOutline.filter(item => 
    item.keywords.some(k => k.toLowerCase().includes(lowerKeyword)) ||
    item.name.toLowerCase().includes(lowerKeyword) ||
    item.description.toLowerCase().includes(lowerKeyword)
  );
}

// 获取级别名称（从 curriculum-data.ts 同步）
export function getLevelName(level: number): string {
  const levelInfo = curriculumGespLevels.find(l => l.level === level);
  if (levelInfo) {
    return `${level}级 - ${levelInfo.description}`;
  }
  
  // 后备映射
  const names: Record<number, string> = {
    1: "一级 - 编程基础",
    2: "二级 - 程序设计",
    3: "三级 - 算法基础",
    4: "四级 - 数据结构",
    5: "五级 - 高级算法",
    6: "六级 - 搜索与DP",
    7: "七级 - 图论与DP",
    8: "八级 - 综合应用",
  };
  return names[level] || `Level ${level}`;
}

// 获取级别考试时长
export function getLevelDuration(level: number): string {
  const levelInfo = curriculumGespLevels.find(l => l.level === level);
  return levelInfo?.duration || (level <= 4 ? "120分钟" : "180分钟");
}

// 获取级别题型分布
export function getLevelQuestionTypes(level: number): { type: string; count: string; score: string }[] {
  if (level <= 4) {
    return [
      { type: "单选题", count: "15道", score: "30分" },
      { type: "判断题", count: "10道", score: "20分" },
      { type: "编程题", count: "2道", score: "50分" },
    ];
  } else {
    return [
      { type: "单选题", count: "15道", score: "30分" },
      { type: "判断题", count: "10道", score: "20分" },
      { type: "填空题", count: "2道", score: "20分" },
      { type: "编程题", count: "2道", score: "30分" },
    ];
  }
}

// 获取完整的62考点大纲（用于AI Prompt等场景）
export function getCompleteSyllabus(): typeof gespSyllabus {
  return gespSyllabus;
}

// 获取级别统计信息
export function getLevelStats(): Array<{level: number; name: string; pointCount: number; duration: string}> {
  return curriculumGespLevels.map(l => ({
    level: l.level,
    name: l.name,
    pointCount: l.totalPoints || 0,
    duration: l.duration,
  }));
}
