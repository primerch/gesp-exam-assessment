# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

主要面向中文教育管理者、教师与家长。他们需要理解 GESP C++ 各级要求、判断试卷与课程的覆盖关系，并据此安排学习与报考。访客在首页先了解三项能力，再自行进入考纲、试卷分析或学习规划。

## Product Purpose

GESP 考级宝把 CCF 官方考纲、试卷逐题分析与课程进度估算放在同一工作流中，帮助用户获得可追溯的教研判断。成功意味着用户能理解工具的作用与边界，并顺利进入适合当前任务的功能。

## Positioning

产品以 CCF 官方条款为对照依据，将试卷题目关联到具体考点、得分要点和超纲依据，并结合既有 C++ 课程进度估算准备程度；所有判断都应能回到标准原文或明确的估算口径。

## Operating Context

公开 Web 工具，无需登录。用户浏览 C++ 一级至八级考纲，上传 PDF 试卷进行逐题分析，或选择课程级别与已完成课次查看学习准备程度。分析报告支持教师、学生与课程进度署名，并保留打印场景。

## Capabilities and Constraints

- 查询 C++ 一级至八级考点、适用边界、官方题型与配分，以及 CCF 原文链接
- 上传并读取 PDF 试卷，按目标等级逐题分析考点、得分要点和超纲依据
- 根据现有课程进度估算 GESP 各级通过概率与建议报考等级；估算不替代独立作答表现
- 保留现有数据结构、分析流程、报告导出/打印行为及 Cloudflare Workers 部署约束
- 仅服务端调用模型提供方，不在客户端暴露 DEEPSEEK_API_KEY
- 首页改为完整 landing page，考纲工具需要独立、可链接的页面，同时兼容既有等级链接

## Brand Commitments

产品名为“GESP 考级宝”，公开署名为“Reacher 独立作品”。界面使用简体中文，内容应专业、明确、克制，不虚构客户、成绩、通过率或官方合作关系。

## Evidence on Hand

- `app/data/official-syllabus.ts`：CCF 考纲条款、来源、修订日期与原文定位
- `app/data/curriculum-data.ts`：课程级别、课次、知识点与准备程度估算
- `app/components/PaperWorkspace.tsx` 与 `app/lib/review/`：真实试卷分析流程
- `app/components/ExamAnalysisResult.tsx`：分析报告与打印输出
- CCF 官方网站与标准原文链接
- 没有已确认的客户名单、用户评价、商业数据或官方背书，不得在 landing page 中虚构

## Product Principles

- 先解释价值与判断依据，再引导用户选择工具
- 产品预览和示例来自真实能力与真实界面，不用装饰性概念图替代
- 所有专业结论都说明来源、适用范围与估算边界
- 首页承担理解与分流，工具页承担高效完成任务
- 保留现有功能和公开链接兼容性
