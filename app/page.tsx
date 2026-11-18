import SyllabusBrowser, { getSelection } from "./components/SyllabusBrowser";

export default async function Home({ searchParams }: PageProps<"/">) {
  const p = await searchParams;
  return <SyllabusBrowser {...getSelection(p.level)} />;
}
