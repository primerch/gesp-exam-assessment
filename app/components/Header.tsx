"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { syllabusSources } from "../data/official-syllabus";

export default function Header() {
  const path = usePathname();
  return (
    <header className="border-b border-line bg-surface print:hidden">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 px-5 sm:px-9 lg:px-14">
        <Link
          href="/"
          aria-label="GESP 考纲研判首页，Reacher 作品"
          className="flex min-h-16 items-center gap-2.5 whitespace-nowrap text-ink"
        >
          <span className="font-sans text-2xl font-semibold tracking-tight text-brand">GESP</span>
          <span className="border-l border-line pl-2.5 text-base font-semibold">考纲研判</span>
          <span className="self-center text-xs text-muted">Reacher</span>
        </Link>
        <nav aria-label="主导航" className="order-last flex w-full gap-6 sm:order-none sm:w-auto sm:gap-7">
          {(
            [
              ["/", "等级考纲"],
              ["/analyze", "试卷分析"],
              ["/plan", "学习规划"],
            ] as const
          ).map(([href, name]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
              className={`flex min-h-11 items-center border-b-2 text-sm font-medium sm:min-h-16 ${path === href ? "border-brand text-brand" : "border-transparent text-muted hover:text-ink"}`}
            >
              {name}
            </Link>
          ))}
        </nav>
        <a
          href={syllabusSources.directory}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-1 text-xs text-muted hover:text-brand sm:text-sm"
        >
          CCF 官网 <ArrowUpRight size={14} aria-hidden />
        </a>
      </div>
    </header>
  );
}
