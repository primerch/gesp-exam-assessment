"use client";

import { GraduationCap } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="五个奶爸"
              width={48}
              height={48}
              className="object-contain"
            />
            <span className="text-xl font-bold text-slate-900">五个奶爸</span>
          </div>

          {/* 导航 */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              首页
            </a>
            <a href="/analyze" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              试卷分析
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              课程介绍
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              关于我们
            </a>
          </nav>

          {/* 联系按钮 */}
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline">咨询课程</span>
          </button>
        </div>
      </div>
    </header>
  );
}
