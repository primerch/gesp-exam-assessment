# GESP 课程知识点覆盖率分析报告

## 分析概况

| 项目 | 数值 |
|------|------|
| GESP大纲考点总数 | 69个 |
| Level 1课程 | 24课 (GESP 1-2级) |
| Level 2课程 | 24课 (GESP 3-4级) |
| Level 3课程 | 24课 (GESP 5-6级) |
| Level 4课程 | 23课 (GESP 7-8级) |
| **课程总数** | **95课** |

## GESP各级别覆盖率

| GESP级别 | 大纲考点数 | 课程覆盖 | 覆盖率 | 状态 |
|----------|------------|----------|--------|------|
| Level 1 | 13 | 14 | 107.7% | ✅ 全覆盖 |
| Level 2 | 9 | 9 | 100.0% | ✅ 全覆盖 |
| Level 3 | 8 | 2 | 25.0% | ⚠️ 需检查 |
| Level 4 | 11 | 9 | 81.8% | ⚠️ 需补充 |
| Level 5 | 9 | 10 | 111.1% | ✅ 覆盖+扩展 |
| Level 6 | 7 | 9 | 128.6% | ✅ 覆盖+扩展 |
| Level 7 | 4 | 8 | 200.0% | ✅ 覆盖+扩展 |
| Level 8 | 8 | 7 | 87.5% | ✅ 基本覆盖 |

## 详细映射关系

### Level 1 → GESP 1-2级
前11课覆盖GESP 1级核心知识点，后13课覆盖GESP 2级。

### Level 2 → GESP 3-4级  
第1-11课覆盖GESP 3级（算法基础），第12-24课覆盖GESP 4级（数据结构）。

### Level 3 → GESP 5-6级
第1-12课覆盖GESP 5级（高级算法），第13-24课覆盖GESP 6级（搜索与DP）。

### Level 4 → GESP 7-8级
第1-12课覆盖GESP 7级（图论与DP），第13-23课覆盖GESP 8级（综合应用）。

## 分析文件位置

- GESP大纲: `data/analysis/gesp-outline-detailed.json`
- Level 1分析: `data/analysis/level1-analysis.json` (750KB)
- Level 2分析: `data/analysis/level2-analysis.json` (674KB)
- Level 3分析: `data/analysis/level3-analysis.json` (1.1MB)
- Level 4分析: `data/analysis/level4-analysis.json` (93KB)

## 建议

1. **Level 3-4** 的GESP大纲考点可能需要重新核对
2. 某些课程可能包含跨级别的知识点（如Level 2的位运算属于GESP 3级）
3. 建议人工审核关键课程的映射准确性

---
*报告生成时间: 2026-03-19*
