import { FileText } from "lucide-react";
import { languageNames, levelNames, revisionDate } from "../../data/official-syllabus";
import type { PaperReport } from "../../lib/review/pdf-client";

export default function PaperIdentity({ report }: { report: PaperReport }) {
  const { language, level } = report.selection;

  return (
    <div className="rounded-xl border border-white/10 bg-[#17231d] p-5 text-[#edf3ef] sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-[#d4ad66]">
          <FileText size={19} strokeWidth={1.5} aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[11px] tracking-[0.16em] text-[#d4ad66]">这份试卷</p>
          <h2 id="report-title" className="mt-2 break-all font-display text-2xl leading-7 sm:text-3xl">{report.fileName}</h2>
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-white/10 pt-5 sm:grid-cols-5">
        <div>
          <dt className="text-xs text-[#82968b]">语言与等级</dt>
          <dd className="mt-1 text-sm text-[#edf3ef]">{languageNames[language]} · {levelNames[level]}</dd>
        </div>
        <div>
          <dt className="text-xs text-[#82968b]">试卷页数</dt>
          <dd className="mt-1 font-mono text-sm text-[#edf3ef] tabular-nums">{report.pages} 页</dd>
        </div>
        <div>
          <dt className="text-xs text-[#82968b]">识别题目</dt>
          <dd className="mt-1 font-mono text-sm text-[#edf3ef] tabular-nums">{report.rows.length} 题</dd>
        </div>
        <div className="col-span-2 sm:col-span-2">
          <dt className="text-xs text-[#82968b]">考纲修订</dt>
          <dd className="mt-1 font-mono text-sm text-[#edf3ef] tabular-nums">{revisionDate}</dd>
        </div>
      </dl>
    </div>
  );
}
