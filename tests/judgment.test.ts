import assert from "node:assert/strict";
import test from "node:test";
import { gradeReading, reconcile } from "../app/lib/review/judgment";
import { assessBatch, indexPaper } from "../app/lib/review/model";
import { linesOf, locateBoundaries, buildIndex } from "../app/lib/review/document";

const paper = {
  id: 1,
  label: "第 1 题",
  parts: [{ page: 2, text: "给定 int n = 3，求 n << 1；再用 cout << n 输出结果。也可用二分。" }],
};
const target = { language: "cpp" as const, level: 1 };
const f = (topic: string, quote: string, role = "required", page = 2) => ({
  topic,
  role,
  quote,
  page,
  why: "运算对象决定语义",
});
const answer = (...findings: ReturnType<typeof f>[]) => ({
  id: 1,
  complete: true,
  reason: "依据运算对象比较条款",
  difficulty: "基础",
  findings,
});
test("joins literal question and syllabus evidence; optional algorithms do not set scope", () => {
  assert.equal(
    gradeReading(paper, target, answer(f("cpp-1.3", "cout << n"), f("code-5.6", "二分", "optional")))
      .verdict,
    "within",
  );
  assert.equal(gradeReading(paper, target, answer(f("code-3.3", "n << 1"))).verdict, "beyond");
  for (const row of [
    f("fake", "cout << n"),
    f("code-3.3", "不在题中"),
    f("code-3.3", "n << 1", "required", 1),
    f("python-1.2", "n << 1"),
  ]) {
    assert.equal(gradeReading(paper, target, answer(row)).verdict, "insufficient");
  }
  assert.equal(
    gradeReading(paper, target, answer(f("code-3.3", "n << 1", "mention"))).verdict,
    "insufficient",
  );
  assert.equal(
    gradeReading(
      { ...paper, parts: [{ ...paper.parts[0], issue: "代码缺行" }] },
      target,
      answer(f("code-3.3", "n << 1")),
    ).verdict,
    "insufficient",
  );
});
test("official hard exclusions and question defects have distinct outcomes", () => {
  const q = {
    ...paper,
    parts: [{ page: 2, text: "请输入 n 并定义 int a[n]。计算 i++ + i++ 的唯一数值。" }],
  };
  assert.equal(
    gradeReading(q, { ...target, level: 4 }, answer(f("cpp-vla4", "int a[n]"))).verdict,
    "beyond",
  );
  assert.equal(gradeReading(q, target, answer(f("cpp-undefined", "i++ + i++"))).verdict, "invalid");
});
test("disagreements trigger automatic adjudication; missing or duplicate answers cannot pass", async () => {
  const within = answer(f("cpp-1.3", "cout << n")),
    beyond = answer(f("code-3.3", "n << 1"));
  const replies = [[within], [beyond], [beyond]];
  const [result] = await assessBatch([paper], target, new AbortController().signal, async () => ({
    questions: replies.shift(),
  }));
  assert.equal(result.verdict, "beyond");
  assert.equal(replies.length, 0);
  const [bad] = await assessBatch([paper], target, new AbortController().signal, async () => ({
    questions: [within, within],
  }));
  assert.equal(bad.verdict, "insufficient");
  const a = gradeReading(paper, target, within),
    b = gradeReading(paper, target, beyond);
  assert.equal(reconcile(paper, target, a, b).verdict, "insufficient");
});
test("section numbering, code lines, cross-page continuations and unnumbered questions", async () => {
  const pages = [
    { page: 1, text: "1 单选题\n第 1 题 输出什么？\n1 int a=0;\ncout << a;" },
    { page: 2, text: "A. 0\n2 判断题\n第 1 题 判断输出。\n3 编程题\n3.1 编程题 1\n3.1.2 输入格式\n输入 n" },
  ];
  const lines = linesOf(pages),
    bs = locateBoundaries(lines);
  const idx = buildIndex(pages, lines, bs);
  assert.deepEqual(
    idx.questions.map((q) => q.label),
    ["单选题 · 第 1 题", "判断题 · 第 1 题", "编程题 · 第 1 题"],
  );
  assert.equal(idx.questions[0].parts[1].text.startsWith("A. 0"), true);
  const other = [{ page: 1, text: "计算两个数的和\n分别输入 a 和 b" }];
  const s = new AbortController().signal;
  const actual = await indexPaper(other, "cpp", s, async () => ({
    language: "unknown",
    starts: [{ line: 0, label: "求和" }],
    notes: [],
  }));
  assert.equal(actual.questions.length, 1);
  await assert.rejects(
    indexPaper(other, "cpp", s, async () => ({ language: "python", starts: [], notes: [] })),
    /C\+\+/,
  );
});
test("explicitly compulsory unlisted methods require agreement on their name and grounded comparison", () => {
  const q = { id: 1, label: "编程题", parts: [{ page: 1, text: "必须构造后缀自动机并输出所有状态。" }] };
  const raw = {
    ...answer(),
    findings: [
      {
        ...f("unlisted", "必须构造后缀自动机", "required", 1),
        outsideTitle: "后缀自动机",
        nearest: "code-7.3",
      },
    ],
  };
  const result = gradeReading(q, { language: "cpp", level: 8 }, raw);
  assert.equal(result.verdict, "beyond");
  assert.equal(result.evidence[0].outsideTitle, "后缀自动机");
  assert.equal(gradeReading(q, { language: "cpp", level: 1 }, raw).verdict, "insufficient");
});
