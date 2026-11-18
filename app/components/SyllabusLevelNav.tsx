"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { levelNames, levels, type Language } from "../data/official-syllabus";
import { syllabusHref } from "../lib/syllabus-links";

export default function SyllabusLevelNav({ language, level }: { language: Language; level: number }) {
  const activeLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeLink.current?.scrollIntoView({
      block: "nearest",
      inline: "center",
      container: "nearest",
    } as ScrollIntoViewOptions);
  }, [level]);

  return (
    <nav aria-label="考试等级" className="mt-10 overflow-x-auto border-y border-line py-5">
      <div className="relative">
        <span className="absolute left-6 right-6 top-5 h-px bg-line" aria-hidden />
        <ol className="flex min-w-[760px] justify-between gap-2 px-1">
          {levels.map((n) => {
            const active = level === n;
            return (
              <li key={n} className="relative flex-1 text-center">
                <Link
                  ref={active ? activeLink : undefined}
                  scroll={false}
                  href={syllabusHref(n, language)}
                  aria-current={active ? "page" : undefined}
                  className="group flex min-h-16 flex-col items-center gap-2 rounded-lg"
                >
                  <span className={`relative z-10 grid size-10 place-items-center rounded-full border font-mono text-xs transition-[background-color,border-color,color] ${active ? "border-brand bg-brand text-on-brand" : "border-line bg-paper text-muted group-hover:border-brand group-hover:text-brand"}`}>
                    {String(n).padStart(2, "0")}
                  </span>
                  <span className={`flex items-center gap-1 text-xs ${active ? "font-medium text-brand" : "text-muted"}`}>
                    {levelNames[n]}
                    {active && <Check size={12} aria-label="当前等级" />}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
