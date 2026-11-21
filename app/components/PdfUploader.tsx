"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileCheck2, FileText, ScanLine, Upload, X } from "lucide-react";
import { BorderBeam } from "@/app/components/ui/border-beam";
import { limits } from "../lib/review/document";

export default function PdfUploader({
  file,
  disabled,
  onChange,
  onError,
}: {
  file: File | null;
  disabled: boolean;
  onChange: (file: File | null) => void;
  onError: (error: string) => void;
}) {
  const [over, setOver] = useState(false);
  const id = useId();

  function choose(candidate?: File) {
    if (!candidate || disabled) return;
    if (!/\.pdf$/i.test(candidate.name) && candidate.type !== "application/pdf") return onError("请选择 PDF 格式的试卷。");
    if (!candidate.size || candidate.size > limits.bytes) return onError("请选择非空且不超过 10 MB 的 PDF。");
    onChange(candidate);
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {file ? (
        <motion.div
          key={file.name}
          initial={{ opacity: 0, y: 8, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.99 }}
          className="relative flex min-h-32 items-center gap-4 overflow-hidden rounded-xl border border-brand/35 bg-[#17231d] px-5 text-[#edf3ef]"
        >
          <BorderBeam size={80} duration={5} colorFrom="#d4ad66" colorTo="#77b69c" />
          <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-white/[0.07] text-[#d4ad66]">
            <FileCheck2 size={23} strokeWidth={1.5} aria-hidden />
          </span>
          <div className="min-w-0 flex-1 py-5">
            <p className="break-all font-medium leading-6">{file.name}</p>
            <p className="mt-2 font-mono text-xs text-[#a8b5ad]">{Math.max(1, Math.round(file.size / 1024)).toLocaleString()} KB · PDF</p>
          </div>
          <button
            type="button"
            aria-label="移除试卷"
            className="inline-grid size-11 shrink-0 place-items-center rounded-lg text-[#a8b5ad] transition-colors hover:bg-white/[0.07] hover:text-white"
            disabled={disabled}
            onClick={() => onChange(null)}
          >
            <X size={17} aria-hidden />
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!disabled) setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setOver(false);
            choose(event.dataTransfer.files[0]);
          }}
          className={`relative rounded-2xl border border-dashed transition-[border-color,background-color] ${over ? "border-brand bg-wash" : "border-input bg-quiet hover:border-brand"} focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-brand`}
        >
          {over && <BorderBeam size={100} duration={3} colorFrom="#d4ad66" colorTo="#2e6e5e" />}
          <span className="pointer-events-none absolute left-3 top-3 size-5 border-l-2 border-t-2 border-brand/45" aria-hidden />
          <span className="pointer-events-none absolute right-3 top-3 size-5 border-r-2 border-t-2 border-brand/45" aria-hidden />
          <span className="pointer-events-none absolute bottom-3 left-3 size-5 border-b-2 border-l-2 border-brand/45" aria-hidden />
          <span className="pointer-events-none absolute bottom-3 right-3 size-5 border-b-2 border-r-2 border-brand/45" aria-hidden />
          <input
            id={id}
            type="file"
            accept="application/pdf,.pdf"
            disabled={disabled}
            className="peer sr-only"
            onChange={(event) => {
              choose(event.target.files?.[0]);
              event.currentTarget.value = "";
            }}
          />
          <label htmlFor={id} className="flex min-h-56 cursor-pointer flex-col items-center justify-center gap-3 px-5 py-10 text-center">
            <span className={`relative grid size-14 place-items-center rounded-full border bg-surface text-brand transition-[border-color,transform] ${over ? "border-brand" : "border-line"}`}>
              {over ? <ScanLine size={24} strokeWidth={1.5} aria-hidden /> : <Upload size={24} strokeWidth={1.5} aria-hidden />}
            </span>
            <span className="font-display text-2xl text-ink">{over ? "松手，放入试卷" : "把 PDF 试卷放进来"}</span>
            <span className="text-sm text-muted"><span className="text-brand underline underline-offset-4">选择 PDF 试卷</span> 或拖入文件</span>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] text-muted"><FileText size={13} aria-hidden /> 文字版、扫描件和图示 · 最多 64 页，10 MB</span>
          </label>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
