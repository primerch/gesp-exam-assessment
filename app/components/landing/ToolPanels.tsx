import Link from "next/link";
import { BookOpen, FileSearch, Gauge, ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/reui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { getCourseSummary } from "../../lib/course-summary";

const tools = [
  {
    href: "/syllabus",
    icon: BookOpen,
    title: "等级考纲",
    description: "准备某一级考试前，先看看它到底考什么。每个考点都附 CCF 原文页码。",
    details: ["C++ 一至八级", "逐项查看", "原文页码"],
    action: "查看考纲",
  },
  {
    href: "/analyze",
    icon: FileSearch,
    title: "试卷分析",
    description: "上传 PDF，逐题看考了什么、有没有超纲、得分点在哪里。分析结果可以打印。",
    details: ["支持扫描件", "逐题分析", "报告可打印"],
    action: "上传试卷",
  },
  {
    href: "/plan",
    icon: Gauge,
    title: "学习规划",
    description: "选择课程和已完成的课次，看看哪些内容学过、哪些还没学，以及目前更适合报哪一级。",
    details: ["courseCount", "已学与未学", "参考报考等级"],
    action: "查看学习进度",
  },
] as const;

export default function ToolPanels() {
  const summary = getCourseSummary();

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {tools.map((tool) => (
        <Card key={tool.href} className="border-line bg-surface shadow-none">
          <CardHeader className="flex flex-col">
            <div className="flex size-11 items-center justify-center rounded-lg bg-wash text-brand">
              <tool.icon size={21} strokeWidth={1.5} aria-hidden />
            </div>
            <CardTitle as="h3" className="text-2xl font-medium tracking-[-0.02em]">{tool.title}</CardTitle>
            <CardDescription className="leading-7">{tool.description}</CardDescription>
            <CardAction className="flex flex-wrap gap-2">
              {tool.details.map((detail) => (
                <Badge key={detail} variant="secondary" size="lg">
                  <Check size={12} aria-hidden />{detail === "courseCount" ? `${summary.total} 个课次` : detail}
                </Badge>
              ))}
            </CardAction>
          </CardHeader>
          <CardContent className="flex-1 text-sm leading-7 text-muted">
            {tool.href === "/plan" ? `${summary.total} 节真实课件，按课程与课次查看。` : "直接进入功能，保留当前等级与相关依据。"}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full min-h-11">
              <Link data-tool-link href={tool.href}>{tool.action} <ArrowRight size={16} aria-hidden /></Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
