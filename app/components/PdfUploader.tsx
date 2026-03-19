"use client";

import { useState, useCallback } from "react";
import { Upload, File, X, AlertCircle, CheckCircle } from "lucide-react";

interface PdfUploaderProps {
  onFileSelect: (base64: string) => void;
  onClear: () => void;
}

export default function PdfUploader({ onFileSelect, onClear }: PdfUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const processFile = useCallback(
    async (file: File) => {
      setError(null);

      // 验证文件类型
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        setError("请上传 PDF 格式的文件");
        return;
      }

      // 验证文件大小
      if (file.size > MAX_SIZE) {
        setError(`文件大小超过 10MB 限制 (当前: ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        return;
      }

      try {
        // 转换为 base64
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          // 移除 data:application/pdf;base64, 前缀
          const base64 = result.split(",")[1];
          setFileInfo({ name: file.name, size: file.size });
          onFileSelect(base64);
        };
        reader.readAsDataURL(file);
      } catch {
        setError("文件读取失败，请重试");
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const handleClear = useCallback(() => {
    setFileInfo(null);
    setError(null);
    onClear();
  }, [onClear]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  return (
    <div className="w-full">
      {!fileInfo ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center
            transition-all duration-200 cursor-pointer
            ${isDragging 
              ? "border-blue-500 bg-blue-50" 
              : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
            }
          `}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center gap-3">
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center
              ${isDragging ? "bg-blue-100" : "bg-slate-100"}
            `}>
              <Upload className={`
                w-8 h-8 
                ${isDragging ? "text-blue-600" : "text-slate-400"}
              `} />
            </div>
            
            <div>
              <p className="text-slate-700 font-medium">
                点击上传或拖拽 PDF 文件到此处
              </p>
              <p className="text-sm text-slate-500 mt-1">
                支持 GESP 考试 PDF 试卷，文件大小不超过 10MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <File className="w-6 h-6 text-red-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 truncate">
                {fileInfo.name}
              </p>
              <p className="text-sm text-slate-500">
                {formatSize(fileInfo.size)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <button
                onClick={handleClear}
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                title="删除文件"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
