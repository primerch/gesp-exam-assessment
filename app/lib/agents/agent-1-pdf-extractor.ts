// Agent 1: PDF 文本提取 Agent
import { extractPdfText } from "../deepseek";

export interface PdfExtractResult {
  text: string;
  pageCount: number;
  charCount: number;
}

export async function agent1PdfExtractor(pdfBuffer: Buffer): Promise<PdfExtractResult> {
  const text = await Promise.race([
    extractPdfText(pdfBuffer),
    new Promise<string>((_, reject) => 
      setTimeout(() => reject(new Error("PDF 提取超时")), 15000)
    )
  ]);
  
  const pageCount = (text.match(/--- Page \d+ ---/g) || []).length;
  
  return {
    text,
    pageCount: pageCount || 1,
    charCount: text.length,
  };
}
