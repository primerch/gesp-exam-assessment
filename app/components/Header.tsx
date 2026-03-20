"use client";

import { GraduationCap } from "lucide-react";
import Image from "next/image";

const navItems = [
  { href: "/", label: "首页", active: true },
  { href: "/analyze", label: "试卷分析", highlight: true },
  { href: "#", label: "课程介绍" },
  { href: "#", label: "关于我们" },
];

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <a 
            href="/" 
            className="flex items-center gap-2.5 rounded-lg -ml-2 px-2 py-1 hover:bg-slate-50 transition-colors"
          >
            <Image
              src="/logo.png"
              alt=""
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-lg font-bold text-slate-900">五个奶爸</span>
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  item.highlight
                    ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    : item.active
                    ? "text-slate-900 bg-slate-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all hover:shadow-md">
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline">咨询课程</span>
          </button>
        </div>
      </div>
    </header>
  );
}
