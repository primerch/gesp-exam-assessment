import { redirect } from "next/navigation";
import LandingPage from "./components/landing/LandingPage";
import { legacySyllabusDestination } from "./lib/syllabus-links";

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const destination = legacySyllabusDestination(params);
  if (destination) redirect(destination);
  return <LandingPage />;
}
