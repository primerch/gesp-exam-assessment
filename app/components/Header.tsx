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
              width={120}
              height={120}
              className="object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-slate-900">五个奶爸</h1>
              <p className="text-xs text-slate-500">少儿编程教育</p>
            </div>
          </div>

          {/* 导航 */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              课程介绍
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              GESP考试
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              学习路径
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              关于我们
            </a>
          </nav>

          {/* 联系按钮 */}
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline">咨询课程</span>
          </button>
        </div>
      </div>
    </header>
  );
}
