"use client";

import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/reui/alert";
import { Badge } from "@/components/reui/badge";
import { Progress } from "@/app/components/ui/progress";
import LevelPath from "./LevelPath";
import AnalysisDemo from "./AnalysisDemo";
import CourseTimeline from "./CourseTimeline";
import { calculatePassProbability } from "../../data/curriculum-data";
import { syllabusSources } from "../../data/official-syllabus";

export default function HeroWorkspace() {
  const sampleProbability = calculatePassProbability(1, 12)[1];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1b2c25] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:p-4">
      <Tabs defaultValue="syllabus">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-3">
          <TabsList className="bg-white/5">
            <TabsTrigger value="syllabus" className="text-[#c4d2c8] data-[state=active]:bg-[#f4f5f1] data-[state=active]:text-[#1d302b]">考纲查询</TabsTrigger>
            <TabsTrigger value="analyze" className="text-[#c4d2c8] data-[state=active]:bg-[#f4f5f1] data-[state=active]:text-[#1d302b]">试卷分析</TabsTrigger>
            <TabsTrigger value="plan" className="text-[#c4d2c8] data-[state=active]:bg-[#f4f5f1] data-[state=active]:text-[#1d302b]">学习规划</TabsTrigger>
          </TabsList>
          <Badge variant="outline" className="border-white/15 bg-transparent text-[#c4d2c8]">真实功能预览</Badge>
        </div>

        <div className="overflow-hidden rounded-xl bg-paper text-ink">
          <TabsContent value="syllabus" className="p-3 sm:p-5">
            <LevelPath showHeader={false} />
            <Alert variant="default" className="mt-4 border-line bg-quiet shadow-none">
              <ShieldCheck aria-hidden />
              <AlertTitle>每个考点都能回到 CCF 原文</AlertTitle>
              <AlertDescription>
                <a className="text-brand underline underline-offset-4" href={syllabusSources.code} target="_blank" rel="noreferrer">
                  打开标准原文，核对条款和页码 <ArrowUpRight size={13} className="inline" aria-hidden />
                </a>
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="analyze">
            <AnalysisDemo />
          </TabsContent>

          <TabsContent value="plan" className="p-3 sm:p-5">
            <CourseTimeline />
            <div className="mt-5 rounded-xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted">Level 1 第 12 课 · 准备程度估算</p>
                <Badge variant="primary-light">示例</Badge>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-mono text-4xl text-brand tabular-nums">{sampleProbability}%</span>
                <span className="text-sm text-muted">GESP 一级</span>
              </div>
              <Progress value={sampleProbability} className="mt-4 h-2" aria-label="GESP 一级准备程度估算" />
              <p className="mt-3 text-xs leading-5 text-muted">只按课程覆盖估算，不代表实际考试成绩</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
