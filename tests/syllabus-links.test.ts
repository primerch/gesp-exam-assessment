import assert from "node:assert/strict";
import test from "node:test";
import { legacySyllabusDestination, syllabusHref } from "../app/lib/syllabus-links";

test("syllabus links preserve the selected C++ level", () => {
  assert.equal(syllabusHref(8), "/syllabus?language=cpp&level=8");
  assert.equal(syllabusHref(3), "/syllabus?language=cpp&level=3");
});

test("legacy home links redirect only for one valid level", () => {
  assert.equal(
    legacySyllabusDestination({ level: "8" }),
    "/syllabus?language=cpp&level=8",
  );
  assert.equal(legacySyllabusDestination({ level: "0" }), null);
  assert.equal(legacySyllabusDestination({ level: "9" }), null);
  assert.equal(legacySyllabusDestination({ level: "advanced" }), null);
  for (const level of ["1.0", "1e0", "+1", "0x1", " 1 ", "01"]) {
    assert.equal(legacySyllabusDestination({ level }), null);
  }
  assert.equal(legacySyllabusDestination({ level: ["3"] }), null);
  assert.equal(legacySyllabusDestination({ level: ["3", "4"] }), null);
  assert.equal(legacySyllabusDestination({}), null);
});
