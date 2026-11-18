import type { Metadata } from "next";
import { getSelection } from "../components/SyllabusBrowser";
import PaperWorkspace from "../components/PaperWorkspace";
export const metadata: Metadata = { title: "试卷分析" };
export default async function AnalyzePage({ searchParams }: PageProps<"/analyze">) {
  const p = await searchParams;
  return <PaperWorkspace initial={getSelection(p.level, 3)} />;
}
