import { blankAnswerRow, printedQuestionNumbers } from "./scoring";
import type { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";

// PDF text can be painted in separate passes (all question headings, then all code).
// Recover reading order from coordinates in the page's rotated, top-left viewport.
export function textLines(items: (TextItem | TextMarkedContent)[], transform: number[]) {
  const [a, b, c, d, e, f] = transform;
  const words = items
    .flatMap((item) => {
      if (!("str" in item) || !item.str.trim()) return [];
      const [, , , , x, y] = item.transform;
      return [
        {
          x: a * x + c * y + e,
          y: b * x + d * y + f,
          width: item.width,
          height: item.height || 10,
          str: item.str.replace(/[\u2e80-\u2fdf\uf900-\ufaff]/gu, (ch) => ch.normalize("NFKC")),
        },
      ];
    })
    .sort((l, r) => l.y - r.y || l.x - r.x);
  const rows: (typeof words)[] = [];
  for (const word of words) {
    const last = rows.at(-1);
    if (last && Math.abs(word.y - last[0].y) <= Math.max(2, Math.min(last[0].height, word.height) * 0.4))
      last.push(word);
    else rows.push([word]);
  }
  let leftMargin = Infinity;
  for (const w of words) leftMargin = Math.min(leftMargin, w.x);
  return rows
    .map((row) => {
      row.sort((l, r) => l.x - r.x);
      let text = row[0].str;
      for (let i = 1; i < row.length; i++) {
        const prev = row[i - 1],
          word = row[i],
          gap = word.x - prev.x - prev.width;
        const spaces =
          gap > 1 ? Math.max(1, Math.min(12, Math.round(gap / Math.max(2, word.height * 0.45)))) : 0;
        text += " ".repeat(spaces) + word.str;
      }
      // Indentation matters in Python; retain the offset relative to the page margin.
      const indent = Math.min(
        48,
        Math.max(0, Math.round((row[0].x - leftMargin) / Math.max(3, row[0].height * 0.55))),
      );
      return " ".repeat(indent) + text.trimEnd();
    })
    .join("\n");
}

/** Match a vision supplement to native PDF text without relying on the model's line counter alone. */
export function resolveLine(lines: string[], index: number, anchor: string) {
  const normalize = (s: string) => s.normalize("NFKC").replace(/\s+/gu, "");
  const pin = normalize(anchor);
  if (!pin) return -1;
  if (lines[index] && normalize(lines[index]).includes(pin)) return index;
  const matches = lines.flatMap((s, i) => (normalize(s).includes(pin) ? [i] : []));
  return matches.length === 1 ? matches[0] : -1;
}

/** A corrected native line may gain image-only symbols, while keeping its complete original text in order. */
export function restoresNativeLine(original: string, restored: string) {
  const clean = (s: string) => s.normalize("NFKC").replace(/\s+/gu, "");
  const source = clean(original),
    candidate = clean(restored);
  if (!source || candidate.length <= source.length || candidate.length > source.length + 180) return false;
  let next = 0;
  for (const c of candidate) if (source[next] === c) next++;
  return next === source.length;
}

export function emptyAnswerTables(lines: string[]) {
  return lines.flatMap((header, line) => {
    if (!blankAnswerRow.test(lines[line + 1] ?? "")) return [];
    const numbers = printedQuestionNumbers(header);
    return numbers ? [{ line, header: header.trim(), numbers }] : [];
  });
}
export function restoreAnswerRow(lines: string[], row: { line: number; header: string; values: string[] }) {
  const at = resolveLine(lines, row.line, row.header);
  if (at < 0 || !blankAnswerRow.test(lines[at + 1] ?? "")) return;
  const numbers = printedQuestionNumbers(lines[at]);
  if (
    !numbers ||
    numbers.length !== row.values.length ||
    !row.values.every((v) => /^(?:[A-H]|√|×|✓|✗|✔|✘|正确|错误)$/.test(v))
  )
    return;
  lines[at + 1] += " " + row.values.join(" ");
}

export function hasEmptyFormula(line: string) {
  const t = line.trim();
  return (
    /保证|满足|测试点|测试数据|距离固定为|前\s+格|(?:大于|小于|等于|超过|至少|至多|低于)\s{2,}(?:的|且|[，。、；])/.test(
      t,
    ) && /[\p{Script=Han}≤≥=]\s{2,}(?=[\p{Script=Han}，。、；≤≥=])/u.test(t)
  );
}
