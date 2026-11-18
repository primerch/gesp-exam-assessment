import { levels, type Language } from "../data/official-syllabus";

export function syllabusHref(level: number, language: Language = "cpp") {
  return `/syllabus?language=${language}&level=${level}`;
}

export function legacySyllabusDestination(params: {
  level?: string | string[];
}) {
  if (typeof params.level !== "string" || !/^[1-8]$/.test(params.level)) return null;
  const level = Number(params.level);
  return levels.includes(level) ? syllabusHref(level) : null;
}
