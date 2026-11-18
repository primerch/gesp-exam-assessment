import assert from "node:assert/strict";
import test from "node:test";
import { getCourseSummary } from "../app/lib/course-summary";

test("landing course summary uses the complete sourced catalog", () => {
  const summary = getCourseSummary();
  assert.equal(summary.total, 96);
  assert.deepEqual(summary.perLevel, { 1: 24, 2: 24, 3: 24, 4: 24 });
});
