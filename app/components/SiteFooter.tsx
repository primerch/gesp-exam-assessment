import Link from "next/link";
import { ArrowUpRight, Waypoints } from "lucide-react";
import { syllabusSources } from "../data/official-syllabus";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-surface text-sm print:hidden">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] lg:px-12">
        <div className="max-w-md">
          <div className="flex items-center gap-2 font-medium text-ink">
            <Waypoints size={18} strokeWidth={1.5} aria-hidden />
            GESP 考级宝
          </div>
          <p className="mt-3 leading-6 text-muted">
            查 GESP 考纲、分析 PDF 试卷，也可以按课程进度安排下一步学习。
          </p>
          <p className="mt-3 text-xs text-muted">Reacher 独立作品，不代表 CCF 官方立场</p>
        </div>
        <div>
          <h2 className="font-medium text-ink">工具</h2>
          <div className="mt-3 flex flex-col items-start gap-2 text-muted">
            <Link className="hover:text-brand" href="/syllabus">等级考纲</Link>
            <Link className="hover:text-brand" href="/analyze">试卷分析</Link>
            <Link className="hover:text-brand" href="/plan">学习规划</Link>
          </div>
        </div>
        <div>
          <h2 className="font-medium text-ink">依据</h2>
          <p className="mt-3 leading-6 text-muted">考纲来源：中国计算机学会</p>
          <a
            className="mt-2 inline-flex items-center gap-1 text-brand hover:underline"
            href={syllabusSources.directory}
            target="_blank"
            rel="noreferrer"
          >
            访问 CCF 官网 <ArrowUpRight size={14} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
