"use client";
import { useId, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { limits } from "../lib/review/document";
export default function PdfUploader({
  file,
  disabled,
  onChange,
  onError,
}: {
  file: File | null;
  disabled: boolean;
  onChange: (f: File | null) => void;
  onError: (error: string) => void;
}) {
  const [over, setOver] = useState(false);
  const id = useId();
  function choose(f?: File) {
    if (!f || disabled) return;
    if (!/\.pdf$/i.test(f.name) && f.type !== "application/pdf") return onError("请选择 PDF 格式的试卷。");
    if (!f.size || f.size > limits.bytes) return onError("请选择非空且不超过 10 MB 的 PDF。");
    onChange(f);
  }
  if (file)
    return (
      <div className="flex min-h-28 items-center gap-4 rounded-md border border-line bg-quiet px-5">
        <FileText className="shrink-0 text-brand" size={25} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="break-all font-medium">{file.name}</p>
          <p className="mt-1 text-xs text-muted">
            {Math.max(1, Math.round(file.size / 1024)).toLocaleString()} KB · PDF
          </p>
        </div>
        <button
          type="button"
          aria-label="移除试卷"
          className="inline-grid size-11 shrink-0 place-items-center rounded text-muted hover:bg-wash"
          disabled={disabled}
          onClick={() => onChange(null)}
        >
          <X size={17} />
        </button>
      </div>
    );
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        choose(e.dataTransfer.files[0]);
      }}
      className={`relative rounded-md border border-dashed ${over ? "border-brand bg-wash" : "border-slate-400 bg-quiet hover:border-brand"} focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand`}
    >
      <input
        id={id}
        type="file"
        accept="application/pdf,.pdf"
        disabled={disabled}
        className="peer sr-only"
        onChange={(e) => {
          choose(e.target.files?.[0]);
          e.currentTarget.value = "";
        }}
      />
      <label
        htmlFor={id}
        className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 px-4 py-7 text-center"
      >
        <Upload size={24} className="mb-1 text-brand" aria-hidden />
        <span className="font-medium">
          <span className="text-brand underline underline-offset-4">选择 PDF 试卷</span> 或拖入文件
        </span>
        <span className="text-sm text-muted">文字版、扫描件和图示 · 最多 64 页，10 MB</span>
      </label>
    </div>
  );
}
