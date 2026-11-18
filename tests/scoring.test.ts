import test from "node:test";
import assert from "node:assert/strict";
import { buildIndex, linesOf, locateBoundaries } from "../app/lib/review/document";
import { gradeReading } from "../app/lib/review/judgment";
import { printedPartial } from "../app/lib/review/scoring";
import { textLines, resolveLine } from "../app/lib/review/page-layout";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

test("official section scoring, question overrides, reset at a new unscored section", () => {
  const pages = [
    {
      page: 1,
      text: "1 单选题（每题 2 分，共 30 分）\n第 1 题 谁？\n第 2 题（4分）输出什么？\n2 判断题\n第 1 题 对吗？",
    },
    { page: 2, text: "3 编程题（每题 25 分，共 50 分）\n3.1 编程题 1\n题目描述\n输出最大值。" },
  ];
  const lines = linesOf(pages);
  const q = buildIndex(pages, lines, locateBoundaries(lines)).questions;
  assert.deepEqual(
    q.map((q) => q.marks?.points),
    [2, 4, undefined, 25],
  );
  assert.equal(q[3].marks?.page, 2);
  assert(!q[1].parts[0].text.includes("判断题"));
});
test("points are grounded in a printed rubric; limits and percentages cannot invent partial credit", () => {
  assert.equal(printedPartial("边界处理正确得 3 分", 3), 3);
  for (const quote of ["本题共 3 分", "对 30% 的数据 n < 3", "输出 3 行", "每小题 3 分"])
    assert.equal(printedPartial(quote, 3), null);
  const q = { id: 1, label: "求和", parts: [{ page: 1, text: "输出 a+b。边界处理正确得 3 分。" }] };
  const row = gradeReading(
    q,
    { language: "cpp", level: 1 },
    {
      id: 1,
      complete: true,
      reason: "求和",
      difficulty: "基础",
      findings: [{ role: "required", topic: "cpp-1.6", quote: "a+b", page: 1, why: "相加" }],
      scoring: [
        { text: "处理边界", quote: "边界处理正确得 3 分", page: 1, points: 3 },
        { text: "杜撰部分分", quote: "不存在", page: 1, points: 10 },
      ],
    },
  );
  assert.deepEqual(
    row.scoring.map((s) => s.points),
    [3],
  );
});
test("visual order survives interleaved PDF drawing operations and compatibility ideographs", () => {
  const word = (str: string, x: number, y: number) =>
    ({ str, width: str.length * 8, height: 10, transform: [10, 0, 0, 10, x, y] }) as TextItem;
  const text = textLines(
    [word("第2题", 30, 60), word("输⼊", 70, 80), word("第1题", 30, 90), word("x", 100, 80)],
    [1, 0, 0, -1, 0, 100],
  );
  assert.deepEqual(
    text.split("\n").map((l) => l.trim().split(/\s+/)[0]),
    ["第1题", "输入", "第2题"],
  );
});

test("visual supplements resolve against native page text and affect only their question", () => {
  assert.equal(resolveLine(["页眉", "第 9 题 执行如下代码", "其余内容"], 0, "第9题 执行如下代码"), 1);
  assert.equal(resolveLine(["同一行", "同一行"], 4, "同一行"), -1);
  const pages = [
    {
      page: 1,
      text: "第 1 题 观察图中的矩形。\n第 2 题 计算 1+1。",
      gaps: [{ anchor: "观察图中", note: "图形模糊" }],
    },
  ];
  const lines = linesOf(pages),
    idx = buildIndex(pages, lines, locateBoundaries(lines));
  assert.equal(idx.questions[0].parts[0].gaps?.[0].note, "图形模糊");
  assert.equal(idx.questions[1].parts[0].gaps, undefined);
});

test("printed answer tables match question numbers within the correct section and reject incomplete rows", () => {
  const pages = [
    {
      page: 1,
      text: "1 单选题（每题 2 分）\n题号 1 2\n答案 B D\n第 1 题 谁？\n第 2 题 哪个？\n2 判断题\n题号 1 2\n答案 √ ×\n第 1 题 对吗？\n第 2 题 是吗？\n3 编程题\n3.1 编程题 1\n求和。",
    },
  ];
  const lines = linesOf(pages);
  const { questions } = buildIndex(pages, lines, locateBoundaries(lines));
  assert.deepEqual(
    questions.map((q) => q.answerKey?.answer),
    ["B", "D", "正确", "错误", undefined],
  );
  const broken = [{ page: 1, text: pages[0].text.replace("答案 B D", "答案 B") }];
  const bl = linesOf(broken);
  assert.equal(buildIndex(broken, bl, locateBoundaries(bl)).questions[0].answerKey, undefined);
  const q = questions[0];
  const row = gradeReading(
    q,
    { language: "cpp", level: 1 },
    {
      id: q.id,
      complete: true,
      reason: "应选 B。",
      answer: "B",
      difficulty: "基础",
      findings: [{ role: "required", topic: "cpp-1.1", page: 1, quote: "谁？", why: "考查计算机。" }],
    },
  );
  assert.equal(row.answer, "B");
  assert.equal(row.answerKey?.answer, "B");
  assert.deepEqual(
    row.scoring.map((s) => [s.text, s.points]),
    [["应选 B。", null]],
  );
});

test("image-only inline math can be restored without replacing original numbers and operators", async () => {
  const { restoresNativeLine } = await import("../app/lib/review/page-layout");
  assert(restoresNativeLine("输入为一个整数，满足  ≤ n ≤  。", "输入为一个整数，满足 1 ≤ n ≤ 30 。"));
  assert(!restoresNativeLine("if (n < 25)", "if (n > 25)"));
  assert(!restoresNativeLine("x << 1", "x < 1"));
});

test("graphic answer rows fill only blank native tables with a complete numbered header", async () => {
  const { restoreAnswerRow } = await import("../app/lib/review/page-layout");
  const lines = ["判断题", "题号  1  2", "答案"];
  restoreAnswerRow(lines, { line: 1, header: "题号1 2", values: ["√"] });
  assert.equal(lines[2], "答案");
  restoreAnswerRow(lines, { line: 0, header: "题号1 2", values: ["√", "×"] });
  assert.equal(lines[2], "答案 √ ×");
  restoreAnswerRow(lines, { line: 1, header: "题号1 2", values: ["×", "√"] });
  assert.equal(lines[2], "答案 √ ×");
});
