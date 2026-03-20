#!/usr/bin/env python3
"""
检查并去除Level 1和Level 2之间的重复知识点
"""
import json
from collections import defaultdict

# 读取所有JSON文件
def load_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

# 加载数据
level1_parta = load_json('/Users/reacher/Developer/gesp/analysis_output/level1_lessons_1_11_knowledge.json')
level1_partb = load_json('/Users/reacher/Developer/gesp/analysis_output/level1_partb_knowledge.json')
level2 = load_json('/Users/reacher/Developer/gesp/analysis_output/level2_knowledge_points.json')

# 收集所有知识点
all_knowledge = defaultdict(list)

def collect_knowledge(data, level_name):
    """收集知识点并记录来源"""
    for lesson in data['lessons']:
        lesson_num = lesson['lesson_num']
        lesson_title = lesson['title']
        for kp in lesson['knowledge_points']:
            name = kp['name']
            category = kp.get('category', '未分类')
            is_new = kp.get('is_new', True)
            
            # 标准化名称用于比较（去除空格，转为小写）
            normalized_name = name.lower().replace(' ', '').replace('(', '').replace(')', '').replace('（', '').replace('）', '')
            
            all_knowledge[normalized_name].append({
                'original_name': name,
                'level': level_name,
                'lesson_num': lesson_num,
                'lesson_title': lesson_title,
                'category': category,
                'is_new': is_new
            })

# 收集各级别知识点
collect_knowledge(level1_parta, 'Level 1')
collect_knowledge(level1_partb, 'Level 1')
collect_knowledge(level2, 'Level 2')

# 找出重复的知识点（出现在不同级别中的）
duplicates = []
unique_by_level = {
    'level1': [],
    'level2': []
}

for normalized_name, occurrences in all_knowledge.items():
    if len(occurrences) > 1:
        # 检查是否跨级别重复
        levels = set([occ['level'] for occ in occurrences])
        if len(levels) > 1:
            # 这是跨级别重复
            first_occ = occurrences[0]
            other_occs = occurrences[1:]
            
            duplicates.append({
                'name': first_occ['original_name'],
                'normalized': normalized_name,
                'first_in': f"{first_occ['level']} Lesson {first_occ['lesson_num']}",
                'duplicated_in': [f"{occ['level']} Lesson {occ['lesson_num']}" for occ in other_occs],
                'all_occurrences': occurrences
            })

# 收集唯一的知识点（按级别）
def collect_unique_knowledge(data, level_name, level_key):
    """收集唯一的知识点列表"""
    unique_list = []
    for lesson in data['lessons']:
        lesson_num = lesson['lesson_num']
        for kp in lesson['knowledge_points']:
            name = kp['name']
            normalized = name.lower().replace(' ', '').replace('(', '').replace(')', '').replace('（', '').replace('）', '')
            
            # 检查是否在其他级别也有
            occurrences = all_knowledge[normalized]
            other_levels = [occ for occ in occurrences if occ['level'] != level_name]
            
            is_duplicate = len(other_levels) > 0
            
            unique_list.append({
                'name': name,
                'lesson': lesson_num,
                'category': kp.get('category', '未分类'),
                'is_new': kp.get('is_new', True),
                'is_duplicate_with_other_level': is_duplicate,
                'duplicate_with': [occ['level'] for occ in other_levels] if is_duplicate else []
            })
    return unique_list

unique_by_level['level1'] = collect_unique_knowledge(level1_parta, 'Level 1', 'level1') + \
                            collect_unique_knowledge(level1_partb, 'Level 1', 'level1')
unique_by_level['level2'] = collect_unique_knowledge(level2, 'Level 2', 'level2')

# 特别关注某些知识点
special_keywords = ['结构体排序', '数组排序', '桶排序', '循环嵌套', 'for循环', 'if语句', '排序', '结构体', '数组']
special_findings = {}
for keyword in special_keywords:
    matches = []
    for norm_name, occs in all_knowledge.items():
        if keyword in norm_name or keyword.replace('排序', '') in norm_name:
            matches.append({
                'keyword': keyword,
                'name': occs[0]['original_name'],
                'occurrences': [{'level': o['level'], 'lesson': o['lesson_num'], 'title': o['lesson_title']} for o in occs]
            })
    if matches:
        special_findings[keyword] = matches

# 输出结果
result = {
    'duplicates_found': duplicates,
    'unique_knowledge_points': unique_by_level,
    'special_findings': special_findings,
    'statistics': {
        'total_unique_concepts': len(all_knowledge),
        'cross_level_duplicates': len(duplicates),
        'level1_total': len(unique_by_level['level1']),
        'level2_total': len(unique_by_level['level2'])
    }
}

# 保存结果
output_path = '/Users/reacher/Developer/gesp/analysis_output/knowledge_deduplication_result.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"分析完成！结果已保存到: {output_path}")
print(f"\n=== 统计信息 ===")
print(f"总唯一概念数: {len(all_knowledge)}")
print(f"跨级别重复数: {len(duplicates)}")
print(f"Level 1 知识点数: {len(unique_by_level['level1'])}")
print(f"Level 2 知识点数: {len(unique_by_level['level2'])}")

print(f"\n=== 跨级别重复知识点 ===")
for dup in duplicates:
    print(f"\n【{dup['name']}】")
    print(f"  首次出现: {dup['first_in']}")
    print(f"  重复于: {', '.join(dup['duplicated_in'])}")

print(f"\n=== 特别关注项 ===")
for keyword, matches in special_findings.items():
    print(f"\n关键词: {keyword}")
    for m in matches:
        print(f"  - {m['name']}: ", end='')
        for occ in m['occurrences']:
            print(f"[{occ['level']} L{occ['lesson']}] ", end='')
        print()
