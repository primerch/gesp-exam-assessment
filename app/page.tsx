import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LandingPage from "./components/landing/LandingPage";
import { legacySyllabusDestination } from "./lib/syllabus-links";

export const metadata: Metadata = {
  description: "查 GESP C++ 一级至八级考纲，上传 PDF 试卷逐题查考点和超纲情况，也可以按已学课次查报考建议。",
};

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const destination = legacySyllabusDestination(params);
  if (destination) redirect(destination);
  return <LandingPage />;
}
