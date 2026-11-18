# GESP 考级宝

Reacher 的 C++ GESP 备考工具。首页介绍考纲、试卷分析与学习规划；`/syllabus` 查询一级至八级考点，`/analyze` 对照 CCF 条款给出逐题范围、卷面分值和作答要点，`/plan` 按课程进度估算准备程度。

考试标准以 [CCF 认证大纲](https://gesp.ccf.org.cn/101/1008/10012.html)及其 [2026 年 1 月修订说明](https://gesp.ccf.org.cn/101/1002/10255.html) 为准。题目证据与条款分别定位到 PDF 页码。题目未注明分值时只统计题数。

## Local development

Use Node.js 22.13 or later and run `npm ci`. Start the Next.js app with `npm run dev`. Put `DEEPSEEK_API_KEY` in `.env.local` to enable local analysis. The syllabus browser works without a key.

Run `bun test tests` for assessment regressions and `npm run lint` for source checks.

## Landing UI

The home page composes reviewed ReUI/shadcn sources from `components/reui/` and `app/components/ui/` with the focused sections in `app/components/landing/`. Tabs, Stepper, Timeline, Cards, Accordion, Alert, Badge, Progress and ButtonGroup present real product previews and course data; no learner scores or testimonials are invented. Course totals come from `app/lib/course-summary.ts`.

## Cloudflare Workers

The production Worker is named `gesp` and uses the vinext adapter. Set `DEEPSEEK_API_KEY` as a Worker secret. The build copies the PDF reader and its supporting files from the locked package to a versioned static path.

Build with `npm run build:vinext` and check the Worker locally with `npm run start:vinext`. Deploy with `npm run deploy:vinext`. The Worker serves the C++ syllabus and analysis on `www.gesp.pro`.
