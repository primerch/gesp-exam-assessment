import lessonData from "./cpp-lessons.json";
import { catalogFor, scopeRules } from "./official-syllabus";

export const cppCourseLevels = [1, 2, 3, 4] as const;
export type CppCourseLevel = (typeof cppCourseLevels)[number];
export const cppLessonsPerLevel = 24;

export const lessonPointKinds = {
  teach: "讲解",
  review: "复习",
  practice: "练习与讲评",
  optional: "选讲",
} as const;

export interface CppLessonPoint {
  title: string;
  kind: keyof typeof lessonPointKinds;
  sources: readonly string[];
  clauses: readonly string[];
}

export interface CppLesson {
  level: CppCourseLevel;
  number: number;
  title: string;
  catalogTitle?: string;
  status: "verified" | "partial" | "unverified";
  points: readonly CppLessonPoint[];
}

export const cppLessons = lessonData as readonly CppLesson[];

const syllabusTopics = catalogFor(8).filter((entry) => entry.kind === "topic");
const clauseById = new Map([...syllabusTopics, ...scopeRules].map((entry) => [entry.id, entry]));

export function courseLessons(level: CppCourseLevel) {
  return cppLessons.filter((lesson) => lesson.level === level);
}

export function lessonClauses(point: CppLessonPoint) {
  return point.clauses.flatMap((id) => {
    const entry = clauseById.get(id);
    return entry ? [entry] : [];
  });
}

export function syllabusCoverageThrough(current: CppLesson) {
  const covered = new Set<string>();
  for (const lesson of cppLessons) {
    if (lesson.level > current.level || (lesson.level === current.level && lesson.number > current.number))
      break;
    if (lesson.status === "unverified") continue;
    for (const point of lesson.points) {
      if ((point.kind !== "teach" && point.kind !== "review") || !point.sources.length) continue;
      for (const clause of point.clauses) covered.add(clause);
    }
  }
  return syllabusTopics.filter((entry) => covered.has(entry.id));
}
