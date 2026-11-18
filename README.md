# GESP 考纲研判

Reacher 的 C++ 试卷分析工具。首页可查一级至八级考点，`/analyze` 对照 CCF 条款给出逐题范围、卷面分值和作答要点。

考试标准以 [CCF 认证大纲](https://gesp.ccf.org.cn/101/1008/10012.html)及其 [2026 年 1 月修订说明](https://gesp.ccf.org.cn/101/1002/10255.html) 为准。题目证据与条款分别定位到 PDF 页码。题目未注明分值时只统计题数。

## Getting Started

Use Node.js 22.13+ and run `npm ci`. Set the server-side `DEEPSEEK_API_KEY` in `.env.local` to enable analysis. The syllabus browser works without a key. Run `bun test tests` for the assessment regressions.

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
