"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { syllabusSources } from "../data/official-syllabus";
import BrandMark from "./BrandMark";

const navigation = [
  ["/syllabus", "等级考纲"],
  ["/analyze", "试卷分析"],
  ["/plan", "学习规划"],
] as const;

export default function Header() {
  const path = usePathname();
  const home = path === "/";
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstMobileLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    firstMobileLink.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className={`relative z-40 border-b print:hidden ${home ? "border-white/10 bg-[#0b120f]" : "border-line bg-surface"}`}>
      <div className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="GESP 考级宝首页，Reacher 作品"
          className={`flex min-h-12 items-center gap-3 whitespace-nowrap ${home ? "text-[#edf3ef]" : "text-ink"}`}
        >
          <span className={`grid size-9 place-items-center ${home ? "text-[#edf3ef]" : "text-brand"}`}>
            <BrandMark className="size-7" />
          </span>
          <span>
            <span className="block text-base font-medium tracking-[-0.02em]">GESP 考级宝</span>
            <span className={`block text-[11px] ${home ? "text-[#82968b]" : "text-muted"}`}>C++ 考级分析工具</span>
          </span>
        </Link>

        <nav aria-label="主导航" className="hidden items-center gap-1 md:flex">
          {navigation.map(([href, name]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
              className={`relative flex min-h-11 items-center rounded-lg px-4 text-sm transition-colors ${
                path === href
                  ? "bg-wash font-medium text-brand"
                  : home
                    ? "text-[#a8b5ad] hover:bg-white/[0.05] hover:text-[#edf3ef]"
                    : "text-muted hover:bg-quiet hover:text-ink"
              }`}
            >
              {name}
              {path === href && (
                <span className="absolute inset-x-4 -bottom-5 h-0.5 bg-brand" aria-hidden />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={syllabusSources.directory}
            target="_blank"
            rel="noreferrer"
            className={`hidden min-h-11 items-center gap-1 px-2 text-sm transition-colors sm:inline-flex ${home ? "text-[#a8b5ad] hover:text-[#d4ad66]" : "text-muted hover:text-brand"}`}
          >
            CCF 官网 <ArrowUpRight size={14} aria-hidden />
          </a>
          <button
            ref={menuButton}
            type="button"
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 text-sm md:hidden ${home ? "border-white/15 text-[#edf3ef]" : "border-line text-ink"}`}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={17} aria-hidden /> : <Menu size={17} aria-hidden />}
            {open ? "关闭" : "菜单"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-navigation"
            aria-label="移动端导航"
            className={`absolute inset-x-4 top-[76px] rounded-xl border p-2 shadow-[0_16px_40px_rgb(20_35_28/14%)] md:hidden ${home ? "border-white/12 bg-[#17231d]" : "border-line bg-surface"}`}
            initial={{ opacity: 0, transform: "translateY(-8px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            exit={{ opacity: 0, transform: "translateY(-8px)" }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.23, 1, 0.32, 1] }}
          >
            {navigation.map(([href, name], index) => (
              <Link
                ref={index === 0 ? firstMobileLink : undefined}
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={path === href ? "page" : undefined}
                className={`flex min-h-12 items-center rounded-lg px-4 text-sm ${
                  path === href ? "bg-wash font-medium text-brand" : home ? "text-[#edf3ef]" : "text-ink"
                }`}
              >
                {name}
              </Link>
            ))}
            <a
              href={syllabusSources.directory}
              target="_blank"
              rel="noreferrer"
              className={`flex min-h-12 items-center justify-between rounded-lg px-4 text-sm ${home ? "text-[#a8b5ad]" : "text-muted"}`}
            >
              CCF 官网 <ArrowUpRight size={15} aria-hidden />
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
