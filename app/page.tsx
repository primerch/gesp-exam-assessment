import { redirect } from "next/navigation";
import { legacySyllabusDestination } from "./lib/syllabus-links";

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const destination = legacySyllabusDestination(params);
  if (destination) redirect(destination);

  return (
    <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-5 py-16 sm:px-9 lg:px-14">
      <h1 className="text-4xl font-semibold">从考纲条款到备考路径，每一步都有依据</h1>
      <p className="mt-4 text-muted">考纲查询、试卷分析与学习规划，将在完整首页中统一呈现。</p>
    </main>
  );
}
