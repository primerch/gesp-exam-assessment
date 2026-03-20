"use client";

import { useMemo } from "react";
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle,
  GraduationCap,
  Target
} from "lucide-react";
import { 
  getMasteredKnowledge,
  gespSyllabus,
  gespKnowledgePoints
} from "@/app/data/curriculum-data";

interface KnowledgeCoveragePanelProps {
  studentLevel: number;
  studentLesson: number;
  examLevel: number;
}

export default function KnowledgeCoveragePanel({ 
  studentLevel, 
  studentLesson,
  examLevel 
}: KnowledgeCoveragePanelProps) {
  
  // 计算已掌握的知识点
  const coverage = useMemo(() => {
    const masteredIds = getMasteredKnowledge(studentLevel, studentLesson);
    
    // 获取所有已掌握知识点的详情
    const masteredPoints: Array<{name: string; category: string; gespMapping: string[]}> = [];
    for (let lvl = 1; lvl <= 4; lvl++) {
      const points = gespKnowledgePoints[lvl] || [];
      for (const point of points) {
        if (masteredIds.has(point.id)) {
          masteredPoints.push({
            name: point.name,
            category: point.category || "其他",
            gespMapping: point.gespMapping || []
          });
        }
      }
    }
    
    // 获取已掌握的 GESP 大纲点
    const masteredSyllabusIds = new Set<string>();
    masteredPoints.forEach(point => {
      point.gespMapping.forEach(id => masteredSyllabusIds.add(id));
    });
    
    // 目标级别的大纲点
    const targetSyllabus = gespSyllabus[examLevel] || [];
    const masteredInTarget: Array<{id: string; name: string; category?: string}> = [];
    const unmasteredInTarget: Array<{id: string; name: string; category?: string}> = [];
    
    targetSyllabus.forEach(point => {
      if (masteredSyllabusIds.has(point.id)) {
        masteredInTarget.push(point);
      } else {
        unmasteredInTarget.push(point);
      }
    });
    
    // 计算掌握率
    const coverageRate = targetSyllabus.length > 0 
      ? Math.round((masteredInTarget.length / targetSyllabus.length) * 100)
      : 0;
    
    // 按类别分组已掌握知识点
    const masteredByCategory: Record<string, string[]> = {};
    masteredPoints.forEach(point => {
      if (!masteredByCategory[point.category]) {
        masteredByCategory[point.category] = [];
      }
      if (!masteredByCategory[point.category].includes(point.name)) {
        masteredByCategory[point.category].push(point.name);
      }
    });
    
    return {
      totalMastered: masteredPoints.length,
      targetTotal: targetSyllabus.length,
      masteredInTarget: masteredInTarget.length,
      unmasteredInTarget: unmasteredInTarget.length,
      coverageRate,
      masteredByCategory,
      unmasteredList: unmasteredInTarget.slice(0, 10), // 最多显示10个未掌握
      masteredList: masteredInTarget.slice(0, 10) // 最多显示10个已掌握
    };
  }, [studentLevel, studentLesson, examLevel]);
  
  // 根据掌握率确定颜色
  const getCoverageColor = (rate: number) => {
    if (rate >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (rate >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };
  
  // 根据掌握率确定建议
  const getRecommendation = (rate: number) => {
    if (rate >= 80) return "掌握情况很好，可以尝试该级别考试！";
    if (rate >= 50) return "掌握了一半以上内容，需要继续学习未掌握知识点。";
    return "掌握内容较少，建议先完成更多课程再考虑该级别考试。";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-blue-600" />
        知识点掌握情况分析
        <span className="text-sm font-normal text-slate-500">
          (Level {studentLevel} 第{studentLesson}课 → GESP {examLevel}级)
        </span>
      </h3>

      {/* 总体掌握率 */}
      <div className={`rounded-xl p-4 border mb-6 ${getCoverageColor(coverage.coverageRate)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80 mb-1">GESP {examLevel}级大纲覆盖度</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{coverage.coverageRate}%</span>
              <span className="text-sm">
                ({coverage.masteredInTarget}/{coverage.targetTotal})
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">累计掌握知识点</p>
            <p className="text-2xl font-bold">{coverage.totalMastered}</p>
          </div>
        </div>
        <p className="text-sm mt-2 font-medium">
          {getRecommendation(coverage.coverageRate)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 已掌握知识点 */}
        <div>
          <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            已掌握 ({coverage.masteredInTarget}个)
          </h4>
          {coverage.masteredList.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {coverage.masteredList.map((point) => (
                <div 
                  key={point.id}
                  className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg text-sm"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  <span className="text-slate-700">{point.name}</span>
                  {point.category && (
                    <span className="text-xs text-emerald-600 ml-auto flex-shrink-0">
                      {point.category}
                    </span>
                  )}
                </div>
              ))}
              {coverage.masteredInTarget > 10 && (
                <p className="text-xs text-slate-500 text-center py-2">
                  还有 {coverage.masteredInTarget - 10} 个已掌握知识点...
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500 py-4 text-center bg-slate-50 rounded-lg">
              暂无已掌握的知识点
            </p>
          )}
        </div>

        {/* 未掌握知识点 */}
        <div>
          <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            未掌握 ({coverage.unmasteredInTarget}个)
          </h4>
          {coverage.unmasteredList.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {coverage.unmasteredList.map((point) => (
                <div 
                  key={point.id}
                  className="flex items-center gap-2 p-2 bg-red-50 rounded-lg text-sm"
                >
                  <XCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
                  <span className="text-slate-700">{point.name}</span>
                  {point.category && (
                    <span className="text-xs text-red-500 ml-auto flex-shrink-0">
                      {point.category}
                    </span>
                  )}
                </div>
              ))}
              {coverage.unmasteredInTarget > 10 && (
                <p className="text-xs text-slate-500 text-center py-2">
                  还有 {coverage.unmasteredInTarget - 10} 个未掌握知识点...
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500 py-4 text-center bg-slate-50 rounded-lg">
              全部知识点已掌握！
            </p>
          )}
        </div>
      </div>

      {/* 按类别显示的已掌握知识点 */}
      {Object.keys(coverage.masteredByCategory).length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            已掌握知识点分类
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(coverage.masteredByCategory)
              .sort((a, b) => b[1].length - a[1].length)
              .slice(0, 8)
              .map(([category, names]) => (
                <div key={category} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">{category}</p>
                  <p className="text-lg font-semibold text-slate-900">{names.length}</p>
                  <p className="text-xs text-slate-400">
                    {names.slice(0, 3).join("、")}
                    {names.length > 3 && "..."}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
