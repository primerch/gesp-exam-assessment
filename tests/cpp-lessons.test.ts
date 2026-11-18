import assert from "node:assert/strict";
import test from "node:test";
import {
  courseLessons,
  cppCourseLevels,
  cppLessons,
  cppLessonsPerLevel,
  lessonClauses,
  syllabusCoverageThrough,
} from "../app/data/cpp-lessons";
import { courseInfo } from "../app/data/curriculum-data";

test("the new C++ course catalog has 24 sourced lessons for every level", () => {
  assert.equal(cppLessons.length, cppCourseLevels.length * cppLessonsPerLevel);
  for (const level of cppCourseLevels) {
    assert.deepEqual(
      courseLessons(level).map((lesson) => lesson.number),
      Array.from({ length: cppLessonsPerLevel }, (_, i) => i + 1),
    );
  }
  assert(courseInfo.levels.every((level) => level.totalLessons === cppLessonsPerLevel));
  for (const lesson of cppLessons) {
    assert.equal(lesson.status, "verified", lesson.title);
    assert(lesson.points.length, lesson.title);
    for (const point of lesson.points) {
      assert(point.title && point.sources.length, lesson.title);
      assert(point.sources.every((source) => /· 第 .+ 页$|教案\.(?:docx|pdf) · 教学目标与课堂环节$/.test(source)));
      assert.deepEqual(lessonClauses(point).map((entry) => entry.id), point.clauses);
    }
  }
});

test("courseware content distinguishes Level 1 sorting, matrix instruction and review", () => {
  const [selection, bubble, matrix, square] = courseLessons(1).slice(20);
  assert.equal(selection.title, "简单排序（一）");
  assert.equal(bubble.title, "简单排序（二）");
  assert.equal(matrix.title, "二维数组");
  assert.equal(matrix.catalogTitle, "冒泡排序思想与插入排序思想");
  assert(matrix.points.some((point) => point.kind === "teach" && point.clauses.includes("cpp-4.2b")));
  assert(matrix.points.some((point) => point.kind === "review" && point.clauses.includes("code-4.8")));
  assert(square.points.some((point) => point.title.includes("方阵对称")));
});

test("binary search and greedy instruction map to their fifth-grade CCF clauses", () => {
  const [binary, greedy] = courseLessons(2).slice(3, 5);
  assert(binary.points.filter(({ kind }) => kind === "teach").every(({ clauses }) => clauses.includes("code-5.6")));
  assert(greedy.points.some(({ kind, clauses }) => kind === "teach" && clauses.includes("code-5.8")));
  assert([binary, greedy].every(({ points }) => points.every(({ clauses }) => !clauses.includes("code-5.3"))));
});

test("mock examinations and optional material do not add taught coverage", () => {
  const [before, first, last] = courseLessons(4).slice(21);
  assert.equal(last.number, 24);
  assert.equal(last.title, "初赛模拟比赛");
  assert(last.points.every(({ kind }) => kind === "practice"));
  const variableLength = last.points.find(({ title }) => title.includes("变长内建数组"));
  assert(variableLength);
  assert.deepEqual(lessonClauses(variableLength).map(({ id }) => id), ["cpp-vla3", "cpp-vla4"]);
  assert.deepEqual(syllabusCoverageThrough(first), syllabusCoverageThrough(before));
  assert.deepEqual(syllabusCoverageThrough(last), syllabusCoverageThrough(before));
  const fileLesson = courseLessons(4)[6];
  assert(fileLesson.points.some(({ kind, clauses }) => kind === "optional" && clauses.includes("cpp-1.2")));
  assert(syllabusCoverageThrough(fileLesson).some(({ id }) => id === "code-4.10"));
});
