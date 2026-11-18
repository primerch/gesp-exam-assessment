import assert from "node:assert/strict";
import test from "node:test";
import { catalogFor, levelsFor, sourceLink, type Language } from "../app/data/official-syllabus";

test("every language and grade has distinct official topics with page and clause anchors", () => {
  for (const track of ["cpp", "python", "blocks"] as Language[]) {
    for (const grade of levelsFor(track)) {
      const entries = catalogFor(track, grade);
      assert.equal(new Set(entries.map((e) => e.id)).size, entries.length);
      assert(entries.some((e) => e.level === grade && e.kind === "topic"));
      assert(entries.every((e) => sourceLink(e).endsWith("#page=" + e.page) && e.clause));
    }
  }
  assert.equal(levelsFor("blocks").length, 4);
});
test("2026 revisions and language-specific boundaries", () => {
  const find = (lang: Language, grade: number, id: string) => catalogFor(lang, grade).find((e) => e.id === id);
  assert.equal(find("cpp", 1, "code-3.3")?.level, 3);
  assert.equal(find("cpp", 1, "cpp-1.3")?.level, 1);
  assert(find("cpp", 3, "cpp-vla3")); assert(!find("python", 3, "cpp-vla3"));
  assert(find("python", 4, "code-lambda4")); assert(!find("python", 5, "code-lambda4"));
  assert(find("cpp", 8, "cpp-undefined")); assert(!find("python", 8, "cpp-undefined"));
  assert(find("python", 1, "python-1.12")); assert(!find("cpp", 1, "python-1.12"));
  assert(!find("python", 5, "cpp-5.2")); assert(!find("blocks", 4, "code-4.8"));
});
