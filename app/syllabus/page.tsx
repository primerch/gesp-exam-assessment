import type { Metadata } from "next";
import SyllabusBrowser, { getSelection } from "../components/SyllabusBrowser";

export const metadata: Metadata = { title: "等级考纲" };

export default async function SyllabusPage({ searchParams }: PageProps<"/syllabus">) {
  const params = await searchParams;
  return <SyllabusBrowser {...getSelection(params.level)} />;
}
