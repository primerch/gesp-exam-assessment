#!/usr/bin/env python3
"""
Generate curriculum-data.ts from PPT analysis results
"""
import json
import os

def main():
    # Load all analysis data
    with open('level1_knowledge_mapping.json', 'r', encoding='utf-8') as f:
        level1_data = json.load(f)
    
    with open('level2_gesp_mapping.json', 'r', encoding='utf-8') as f:
        level2_data = json.load(f)
    
    with open('level3_knowledge_mapping.json', 'r', encoding='utf-8') as f:
        level3_data = json.load(f)
    
    with open('analysis_output/level4_gesp_mapping.json', 'r', encoding='utf-8') as f:
        level4_data = json.load(f)
    
    with open('data/gesp_cpp_outline.json', 'r', encoding='utf-8') as f:
        gesp_outline = json.load(f)
    
    # Build GESP syllabus
    gesp_syllabus = build_gesp_syllabus(gesp_outline)
    
    # Build course progression
    progression = build_progression(level1_data, level2_data, level3_data, level4_data)
    
    # Build knowledge points
    knowledge_points = build_knowledge_points(level1_data, level2_data, level3_data, level4_data)
    
    # Build mapping
    knowledge_to_gesp = build_mapping(level1_data, level2_data, level3_data, level4_data)
    
    # Generate TypeScript file
    ts_content = generate_typescript(gesp_syllabus, progression, knowledge_points, knowledge_to_gesp)
    
    with open('app/data/curriculum-data.ts', 'w', encoding='utf-8') as f:
        f.write(ts_content)
    
    print("Generated curriculum-data.ts successfully!")

def build_gesp_syllabus(outline):
    """Build GESP syllabus from outline"""
    syllabus = {}
    level_map = {
        'level1': 1, 'level2': 2, 'level3': 3, 'level4': 4,
        'level5': 5, 'level6': 6, 'level7': 7, 'level8': 8
    }
    
    for level_key, level_num in level_map.items():
        if level_key in outline['gesp_cpp']:
            points = outline['gesp_cpp'][level_key].get('points', [])
            syllabus[level_num] = []
            for i, p in enumerate(points, 1):
                syllabus[level_num].append({
                    'id': f'{level_num}.{i}',
                    'name': p['name'],
                    'description': p['description'],
                    'category': p.get('category', '未分类'),
                    'weight': p.get('weight', 1.0)
                })
    return syllabus

def build_progression(l1, l2, l3, l4):
    """Build lesson-by-lesson progression"""
    progression = {}
    
    # Level 1: 21 lessons
    progression[1] = {}
    for lesson_key, lesson_data in l1['level1'].items():
        if lesson_key.startswith('lesson_'):
            lesson_num = int(lesson_key.split('_')[1])
            point_ids = []
            for kp in lesson_data.get('knowledge_points', []):
                # Generate a unique ID for each knowledge point
                kp_id = f"l1_{lesson_num}_{hash(kp) % 10000}"
                point_ids.append(kp_id)
            progression[1][lesson_num] = point_ids
    
    # Level 2: 24 lessons
    progression[2] = {}
    for lesson in l2.get('lessons', []):
        lesson_num = lesson['lesson_num']
        point_ids = []
        for i, kp in enumerate(lesson.get('knowledge_points', [])):
            kp_id = f"l2_{lesson_num}_{i}"
            point_ids.append(kp_id)
        progression[2][lesson_num] = point_ids
    
    # Level 3: 25 lessons
    progression[3] = {}
    for i, lesson in enumerate(l3.get('lessons', []), 1):
        lesson_num = i
        point_ids = []
        for j, kp in enumerate(lesson.get('knowledge_points', [])):
            kp_id = f"l3_{lesson_num}_{j}"
            point_ids.append(kp_id)
        progression[3][lesson_num] = point_ids
    
    # Level 4: 23 lessons
    progression[4] = {}
    for lesson in l4.get('lessons', []):
        lesson_num = lesson['lesson_number']
        point_ids = []
        for i, kp in enumerate(lesson.get('knowledge_points', [])):
            if isinstance(kp, dict):
                kp_id = f"l4_{lesson_num}_{i}"
                point_ids.append(kp_id)
        progression[4][lesson_num] = point_ids
    
    return progression

def build_knowledge_points(l1, l2, l3, l4):
    """Build knowledge points structure"""
    points = {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: []}
    
    # Process Level 1 (maps to GESP 1-2)
    for lesson_key, lesson_data in l1['level1'].items():
        if lesson_key.startswith('lesson_'):
            lesson_num = int(lesson_key.split('_')[1])
            gesp_mappings = lesson_data.get('gesp_mapping', [])
            target_levels = [1, 2]  # Level 1 targets GESP 1-2
            
            for i, kp_name in enumerate(lesson_data.get('knowledge_points', [])):
                kp_id = f"l1_{lesson_num}_{hash(kp_name) % 10000}"
                point = {
                    'id': kp_id,
                    'name': kp_name,
                    'description': f"Level 1 第{lesson_num}课: {kp_name}",
                    'category': '基础语法' if lesson_num <= 10 else '进阶内容',
                    'difficulty': lesson_data.get('difficulty', 2),
                    'lesson': lesson_num,
                    'gespMapping': gesp_mappings
                }
                # Add to appropriate level(s)
                for level in target_levels:
                    if level <= 2:
                        points[level].append(point)
    
    # Process Level 2 (maps to GESP 3-4)
    for lesson in l2.get('lessons', []):
        lesson_num = lesson['lesson_num']
        gesp_mappings = lesson.get('gesp_mapping', [])
        target_levels = [3, 4]
        
        for i, kp_name in enumerate(lesson.get('knowledge_points', [])):
            kp_id = f"l2_{lesson_num}_{i}"
            point = {
                'id': kp_id,
                'name': kp_name,
                'description': f"Level 2 第{lesson_num}课: {kp_name}",
                'category': '算法基础' if lesson_num <= 5 else '进阶算法',
                'difficulty': 3 if lesson_num <= 12 else 4,
                'lesson': lesson_num,
                'gespMapping': gesp_mappings
            }
            for level in target_levels:
                points[level].append(point)
    
    # Process Level 3 (maps to GESP 5-6)
    for i, lesson in enumerate(l3.get('lessons', []), 1):
        lesson_num = i
        gesp_mappings = [m['gesp_level'] for m in lesson.get('gesp_mapping', [])]
        target_levels = [5, 6]
        
        for j, kp_name in enumerate(lesson.get('knowledge_points', [])):
            kp_id = f"l3_{lesson_num}_{j}"
            point = {
                'id': kp_id,
                'name': kp_name,
                'description': f"Level 3 第{lesson_num}课: {kp_name}",
                'category': '进阶内容',
                'difficulty': 4,
                'lesson': lesson_num,
                'gespMapping': gesp_mappings
            }
            for level in target_levels:
                points[level].append(point)
    
    # Process Level 4 (maps to GESP 7-8)
    for lesson in l4.get('lessons', []):
        lesson_num = lesson['lesson_number']
        target_levels = [7, 8]
        
        for i, kp in enumerate(lesson.get('knowledge_points', [])):
            if isinstance(kp, dict):
                kp_id = f"l4_{lesson_num}_{i}"
                gesp_level = kp.get('gesp_level', 7)
                point = {
                    'id': kp_id,
                    'name': kp['name'],
                    'description': f"Level 4 第{lesson_num}课: {kp['name']}",
                    'category': kp.get('category', '未分类'),
                    'difficulty': 4 if gesp_level == 7 else 5,
                    'lesson': lesson_num,
                    'gespMapping': [f'{gesp_level}.1']
                }
                for level in target_levels:
                    points[level].append(point)
    
    return points

def build_mapping(l1, l2, l3, l4):
    """Build knowledge to GESP mapping"""
    mapping = {}
    
    # Level 1
    for lesson_key, lesson_data in l1['level1'].items():
        if lesson_key.startswith('lesson_'):
            lesson_num = int(lesson_key.split('_')[1])
            gesp_mappings = lesson_data.get('gesp_mapping', [])
            for kp in lesson_data.get('knowledge_points', []):
                kp_id = f"l1_{lesson_num}_{hash(kp) % 10000}"
                mapping[kp_id] = gesp_mappings
    
    # Level 2
    for lesson in l2.get('lessons', []):
        lesson_num = lesson['lesson_num']
        gesp_mappings = lesson.get('gesp_mapping', [])
        for i, kp in enumerate(lesson.get('knowledge_points', [])):
            kp_id = f"l2_{lesson_num}_{i}"
            mapping[kp_id] = gesp_mappings
    
    # Level 3
    for i, lesson in enumerate(l3.get('lessons', []), 1):
        lesson_num = i
        gesp_mappings = [m['gesp_level'] for m in lesson.get('gesp_mapping', [])]
        for j, kp in enumerate(lesson.get('knowledge_points', [])):
            kp_id = f"l3_{lesson_num}_{j}"
            mapping[kp_id] = gesp_mappings
    
    # Level 4
    for lesson in l4.get('lessons', []):
        lesson_num = lesson['lesson_number']
        for i, kp in enumerate(lesson.get('knowledge_points', [])):
            if isinstance(kp, dict):
                kp_id = f"l4_{lesson_num}_{i}"
                gesp_level = kp.get('gesp_level', 7)
                mapping[kp_id] = [f'{gesp_level}.1']
    
    return mapping

def generate_typescript(syllabus, progression, knowledge_points, mapping):
    """Generate TypeScript file content"""
    
    ts = '''// GESP Curriculum Data - Generated from PPT Analysis
// This file contains accurate mappings between course content and GESP exam levels

import { CourseLevel, GESPLevel, KnowledgePoint, CourseProgression, GESPSyllabusPoint } from "../types";

// GESP Syllabus Points (1-8 levels)
export const gespSyllabus: Record<number, GESPSyllabusPoint[]> = {
'''
    
    # Add GESP syllabus
    for level in range(1, 9):
        ts += f'  {level}: [\n'
        if level in syllabus:
            for point in syllabus[level]:
                ts += f'    {{ id: "{point["id"]}", name: "{point["name"]}", description: "{point["description"][:50]}...", weight: {point.get("weight", 1.0)} }},\n'
        ts += '  ],\n'
    
    ts += '''};

// GESP Knowledge Points by Level
export const gespKnowledgePoints: Record<number, KnowledgePoint[]> = {
'''
    
    # Add knowledge points
    for level in range(1, 9):
        ts += f'  {level}: [\n'
        if level in knowledge_points:
            for point in knowledge_points[level][:20]:  # Limit to avoid huge file
                gesp_map = json.dumps(point.get('gespMapping', []))
                ts += f'    {{ id: "{point["id"]}", name: "{point["name"][:40]}", difficulty: {point.get("difficulty", 2)}, gespMapping: {gesp_map} }},\n'
        ts += '  ],\n'
    
    ts += '''};

// Knowledge Point to GESP Mapping
export const knowledgeToGespMapping: Record<string, string[]> = {
'''
    
    # Add mapping (sample)
    count = 0
    for kp_id, gesp_list in mapping.items():
        if count < 100:  # Limit for file size
            gesp_str = json.dumps(gesp_list)
            ts += f'  "{kp_id}": {gesp_str},\n'
            count += 1
    
    ts += '''};

// TCTM Course Progression (Level -> Lesson -> Knowledge Points)
export const tctmProgression: CourseProgression = {
'''
    
    # Add progression
    for level in range(1, 5):
        ts += f'  {level}: {{\n'
        if level in progression:
            for lesson_num, point_ids in progression[level].items():
                ids_str = json.dumps(point_ids[:10])  # Limit
                ts += f'    {lesson_num}: {ids_str},\n'
        ts += '  },\n'
    
    ts += '''};

// Course Information
export const courseInfo = {
  levels: [
    { id: 1, name: "Level 1", totalLessons: 21, targetGesp: "1-2级", description: "编程基础入门" },
    { id: 2, name: "Level 2", totalLessons: 24, targetGesp: "3-4级", description: "算法与数据结构基础" },
    { id: 3, name: "Level 3", totalLessons: 25, targetGesp: "5-6级", description: "进阶算法与STL" },
    { id: 4, name: "Level 4", totalLessons: 23, targetGesp: "7-8级", description: "高级算法与竞赛" },
  ],
  passProbabilityThresholds: {
    excellent: 90,
    good: 75,
    moderate: 60,
    minimum: 40,
  },
};

// Get mastered knowledge points for a given level and lesson
export function getMasteredKnowledge(level: number, lesson: number): Set<string> {
  const mastered = new Set<string>();
  const levelProgression = tctmProgression[level];
  
  if (!levelProgression) return mastered;
  
  // Accumulate all knowledge points up to current lesson
  for (let i = 1; i <= lesson; i++) {
    const lessonPoints = levelProgression[i];
    if (lessonPoints) {
      lessonPoints.forEach((id) => mastered.add(id));
    }
  }
  
  return mastered;
}

// Calculate pass probability for each GESP level
export function calculatePassProbability(currentLevel: number, currentLesson: number): Record<number, number> {
  const mastered = getMasteredKnowledge(currentLevel, currentLesson);
  const probabilities: Record<number, number> = {};
  
  // Calculate for GESP levels 1-8
  for (let gespLevel = 1; gespLevel <= 8; gespLevel++) {
    // Get all relevant knowledge points for this GESP level
    const relevantPoints: KnowledgePoint[] = [];
    
    // Check all knowledge points to see if they map to this GESP level
    for (const [pointId, gespMappings] of Object.entries(knowledgeToGespMapping)) {
      // Check if this point maps to current GESP level
      const mapsToLevel = gespMappings.some((m) => {
        const level = parseInt(m.split('.')[0]);
        return level === gespLevel;
      });
      
      if (mapsToLevel) {
        // Find the point in knowledge points
        for (let lvl = 1; lvl <= 8; lvl++) {
          const point = gespKnowledgePoints[lvl]?.find((p) => p.id === pointId);
          if (point) {
            relevantPoints.push(point);
            break;
          }
        }
      }
    }
    
    // Calculate mastery rate
    if (relevantPoints.length === 0) {
      probabilities[gespLevel] = gespLevel <= 2 ? 30 : 5; // Base probability for low levels
      continue;
    }
    
    let masteredWeight = 0;
    let totalWeight = 0;
    
    for (const point of relevantPoints) {
      const weight = point.difficulty || 1;
      totalWeight += weight;
      if (mastered.has(point.id)) {
        masteredWeight += weight;
      }
    }
    
    const masteryRate = totalWeight > 0 ? masteredWeight / totalWeight : 0;
    
    // Convert mastery rate to pass probability
    // Use a more conservative curve to avoid unrealistic predictions
    let baseProbability = 0;
    
    if (masteryRate >= 0.95) {
      baseProbability = 95;
    } else if (masteryRate >= 0.85) {
      baseProbability = 85 + (masteryRate - 0.85) * 100;
    } else if (masteryRate >= 0.7) {
      baseProbability = 70 + (masteryRate - 0.7) * 100;
    } else if (masteryRate >= 0.5) {
      baseProbability = 50 + (masteryRate - 0.5) * 80;
    } else if (masteryRate >= 0.3) {
      baseProbability = 30 + (masteryRate - 0.3) * 100;
    } else {
      baseProbability = masteryRate * 100;
    }
    
    // Adjust based on course level vs GESP level alignment
    const expectedCourseLevel = Math.ceil(gespLevel / 2);
    if (currentLevel < expectedCourseLevel) {
      // Not reached the level yet, reduce probability
      baseProbability *= 0.3;
    } else if (currentLevel === expectedCourseLevel) {
      // Currently studying this level
      const progressFactor = currentLesson / courseInfo.levels[currentLevel - 1].totalLessons;
      baseProbability *= (0.4 + 0.6 * progressFactor);
    } else if (currentLevel === expectedCourseLevel + 1) {
      // Completed the level, good chance
      baseProbability = Math.min(baseProbability * 1.2, 95);
    } else {
      // Far exceeded, should be able to pass
      baseProbability = Math.min(baseProbability * 1.3, 98);
    }
    
    probabilities[gespLevel] = Math.round(baseProbability);
  }
  
  return probabilities;
}

// Get recommended exam level
export function getRecommendedExam(level: number, lesson: number): { level: number; probability: number; reasoning: string } {
  const probabilities = calculatePassProbability(level, lesson);
  
  // Find the best exam level (70-85% pass probability)
  let bestLevel = 1;
  let bestProbability = 0;
  let bestScore = -Infinity;
  
  for (let gespLevel = 1; gespLevel <= 8; gespLevel++) {
    const prob = probabilities[gespLevel];
    // Score based on optimal range (70-85%)
    let score = 0;
    if (prob >= 70 && prob <= 85) {
      score = 100; // Ideal range
    } else if (prob > 85 && prob <= 95) {
      score = 90 - (prob - 85) * 2; // Good but might be too high
    } else if (prob > 60 && prob < 70) {
      score = 70 + (prob - 60); // Decent chance
    } else if (prob >= 40 && prob <= 60) {
      score = prob - 20; // Risky
    } else {
      score = prob * 0.5; // Too low or too high
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestLevel = gespLevel;
      bestProbability = prob;
    }
  }
  
  let reasoning = "";
  if (bestProbability >= 90) {
    reasoning = `当前能力已完全覆盖GESP ${bestLevel}级要求，通过把握极高`;
  } else if (bestProbability >= 75) {
    reasoning = `知识点掌握度良好，适合报考GESP ${bestLevel}级，通过把握较大`;
  } else if (bestProbability >= 60) {
    reasoning = `基本掌握GESP ${bestLevel}级核心内容，报考有一定把握`;
  } else {
    reasoning = `建议先完成更多课程再报考GESP ${bestLevel}级`;
  }
  
  return { level: bestLevel, probability: bestProbability, reasoning };
}

// Group knowledge points by category
export function groupKnowledgeByCategory(points: KnowledgePoint[]) {
  const groups: Record<string, KnowledgePoint[]> = {};
  
  for (const point of points) {
    const category = point.category || "未分类";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(point);
  }
  
  return groups;
}
'''
    
    return ts

if __name__ == '__main__':
    main()
