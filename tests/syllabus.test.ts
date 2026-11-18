import assert from "node:assert/strict";
import test from "node:test";
import { catalogFor, levels, sourceLink } from "../app/data/official-syllabus";
import { selectionSchema } from "../app/lib/review/document";

test("all eight C++ levels have distinct requirements and official page anchors", () => {
  for (const grade of levels) {
    const entries = catalogFor(grade);
    assert.equal(new Set(entries.map((e) => e.id)).size, entries.length);
    assert(entries.some((e) => e.level === grade && e.kind === "topic"));
    assert(entries.every((e) => sourceLink(e).endsWith("#page=" + e.page) && e.clause));
  }
  assert.equal(selectionSchema.safeParse({ language: "python", level: 1 }).success, false);
});
test("2026 revisions distinguish bit shifts and I/O, variable-length arrays, anonymous functions and undefined behavior", () => {
  const find = (grade: number, id: string) => catalogFor(grade).find((e) => e.id === id);
  assert.equal(find(1, "code-3.3")?.level, 3);
  assert.equal(find(1, "cpp-1.3")?.level, 1);
  assert(find(3, "cpp-vla3"));
  assert(find(4, "cpp-vla4"));
  assert(find(4, "code-lambda4"));
  assert(!find(5, "code-lambda4"));
  assert(find(8, "cpp-undefined"));
});
