import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Header from "./components/Header";
import SiteFooter from "./components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "GESP 考纲研判 · Reacher", template: "%s · GESP 考纲研判 · Reacher" },
  description: "对照中国计算机学会认证标准，查询各级考点，逐题分析试卷与超纲依据，并规划学习路径。Reacher 独立作品。",
  authors: [{ name: "Reacher" }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col bg-paper font-sans text-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-4 focus:z-50 focus:bg-surface focus:p-3"
        >
          跳至正文
        </a>
        <Header />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
