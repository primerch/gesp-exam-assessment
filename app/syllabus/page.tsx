import type { Metadata } from "next";
import SyllabusBrowser, { getSelection } from "../components/SyllabusBrowser";

export const metadata: Metadata = {
  title: "等级考纲",
  description: "查询 GESP C++ 一级至八级考点、适用边界、题型配分与 CCF 原文条款。",
};

export default async function SyllabusPage({ searchParams }: PageProps<"/syllabus">) {
  const params = await searchParams;
  return <SyllabusBrowser {...getSelection(params.level)} />;
}
