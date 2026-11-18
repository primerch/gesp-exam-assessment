import { cppCourseLevels, cppLessons } from "../data/cpp-lessons";

export function getCourseSummary() {
  return {
    total: cppLessons.length,
    perLevel: Object.fromEntries(
      cppCourseLevels.map((level) => [
        level,
        cppLessons.filter((lesson) => lesson.level === level).length,
      ]),
    ) as Record<number, number>,
  };
}
