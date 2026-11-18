import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Header from "./components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "GESP 考纲研判 · Reacher", template: "%s · GESP 考纲研判 · Reacher" },
  description: "对照中国计算机学会认证标准，查询各级考点，逐题分析试卷与超纲依据。Reacher 独立作品。",
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
        <footer className="mt-auto border-t border-line text-sm text-muted">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-5 py-6 sm:px-9 lg:px-14">
            <span>
              GESP 考纲研判{" "}
              <span className="mx-1.5" aria-hidden>
                ·
              </span>{" "}
              Reacher 独立作品
            </span>
            <span>大纲来源：中国计算机学会</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
