"use client";

import { GraduationCap } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="五个奶爸"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-xl font-bold text-slate-900">五个奶爸</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <a 
              href="/" 
              className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
            >
              首页
            </a>
            <a 
              href="/analyze" 
              className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all"
            >
              试卷分析
            </a>
            <a 
              href="#" 
              className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
            >
              课程介绍
            </a>
            <a 
              href="#" 
              className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
            >
              关于我们
            </a>
          </nav>

          {/* CTA Button */}
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/25">
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">咨询课程</span>
          </button>
        </div>
      </div>
    </header>
  );
}
