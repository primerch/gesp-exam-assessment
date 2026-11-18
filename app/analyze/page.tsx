import type { Metadata } from "next";
import { getSelection } from "../components/SyllabusBrowser";
import PaperWorkspace from "../components/PaperWorkspace";
export const metadata: Metadata = {
  title: "试卷分析",
  description: "上传 PDF 试卷，逐题查看 GESP C++ 考点、得分要点、超纲依据与 CCF 原文出处。",
};
export default async function AnalyzePage({ searchParams }: PageProps<"/analyze">) {
  const p = await searchParams;
  return <PaperWorkspace initial={getSelection(p.level, 3)} />;
}
