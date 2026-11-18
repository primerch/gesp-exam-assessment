import assert from "node:assert/strict";
import test from "node:test";
import { gradeReading, reconcile } from "../app/lib/review/judgment";
import { assessBatch, indexPaper } from "../app/lib/review/model";
import { linesOf, locateBoundaries, buildIndex } from "../app/lib/review/document";
import { assessmentBatches } from "../app/lib/review/pdf-client";

const paper = {
  id: 1,
  label: "第 1 题",
  parts: [{ page: 2, text: "给定 int n = 3，求 n << 1；再用 cout << n 输出结果。也可用二分。" }],
};
const target = { language: "cpp" as const, level: 1 };

test("programming and long questions start independently of short questions", () => {
  const questions = [
    paper,
    { ...paper, id: 2, parts: [{ page: 2, text: "题".repeat(1101) }] },
    { ...paper, id: 3 },
    { ...paper, id: 4, label: "编程题 · 第 1 题" },
    { ...paper, id: 5, parts: [...paper.parts, { page: 3, text: "续页" }] },
    ...[6, 7, 8].map((id) => ({ ...paper, id })),
  ];
  assert.deepEqual(
    assessmentBatches(questions).map((batch) => batch.map((question) => question.id)),
    [[2], [4], [5], [1, 3, 6, 7], [8]],
  );
});

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

test("a mismatch with the printed key is automatically checked without disclosing it to the solvers", async () => {
  const q = { ...paper, answerKey: { page: 1, quote: "答案 A", answer: "A" } };
  const attempts: string[] = [];
  const choices = ["B", "B", "A"];
  const [row] = await assessBatch([q], target, new AbortController().signal, async (_m, _p, input) => {
    attempts.push(String(input));
    return { questions: [{ ...answer(f("cpp-1.3", "cout << n")), answer: choices.shift() }] };
  });
  assert.equal(attempts.length, 3);
  assert(attempts.every((s) => !s.includes("答案 A")));
  assert.equal(row.answer, "A");
  assert.equal(row.verdict, "within");
});

test("temporary batch failures preserve independent answers; configuration and abort errors propagate", async () => {
  const { recoverBatch, ReviewRequestError } = await import("../app/lib/review/pdf-client");
  const questions = [1, 2, 3, 4].map((id) => ({ ...paper, id }));
  const failed = new Set<number>();
  const result = await recoverBatch(
    questions,
    async (qs) => {
      if (qs.some((q) => q.id === 3)) throw new ReviewRequestError("timeout", true);
      return qs.map((q) => gradeReading(q, target, { ...answer(f("cpp-1.3", "cout << n")), id: q.id }));
    },
    new AbortController().signal,
    failed,
  );
  assert.deepEqual(
    result.map((r) => r.verdict),
    ["within", "within", "insufficient", "within"],
  );
  assert.deepEqual([...failed], [3]);
  await assert.rejects(
    recoverBatch(
      questions,
      async () => {
        throw new ReviewRequestError("配置", false);
      },
      new AbortController().signal,
      new Set(),
    ),
    /配置/,
  );
  await assert.rejects(
    recoverBatch(questions, async () => [], AbortSignal.abort(), new Set()),
    { name: "AbortError" },
  );
});

test("a local image gap needs a literal whole-question source to establish that it does not affect the solution", () => {
  const q = {
    ...paper,
    parts: [
      { ...paper.parts[0], gaps: [{ anchor: "给定", note: "本页样例未完" }] },
      { page: 3, text: "输出样例 2：17" },
    ],
  };
  const base = answer(f("cpp-1.3", "cout << n"));
  assert.equal(gradeReading(q, target, base).verdict, "insufficient");
  const resolved = { gapPage: 2, page: 3, quote: "输出样例 2：17", why: "下一页给出了本页未结束的样例。" };
  assert.equal(gradeReading(q, target, { ...base, resolvedGaps: [resolved] }).verdict, "within");
  assert.equal(
    gradeReading(q, target, { ...base, resolvedGaps: [{ ...resolved, quote: "不存在的样例" }] }).verdict,
    "insufficient",
  );
});

test("numbered routes, tax rules and twelve sample months stay inside their programming problems", async () => {
  const pages = [
    {
      page: 1,
      text: "1 单选题（每题 2 分）\n第 1 题 输出什么？\n3 编程题（每题 25 分）\n3.1 编程题 1\n3.1.1 题目描述\n1. 乘飞机。\n2. 乘高铁。\n3. 转车。\n3.2 编程题 2\n3.2.1 题目描述\n1. 低于起征点。\n2. 高于起征点。",
    },
    {
      page: 2,
      text:
        "3.2.7 样例解释\n" +
        Array.from({ length: 12 }, (_, i) => `${i + 1}. 月份计算。`).join("\n") +
        "\n3.2.8 数据范围\n3.2.9 参考程序",
    },
  ];
  const lines = linesOf(pages);
  const hints = lines.flatMap((l, line) =>
    /^(?:第|3\.[12] |\d+\.|【图示】)/.test(l.text) ? [{ line, label: "编程题 · 第 1 题" }] : [],
  );
  const idx = await indexPaper(pages, "cpp", new AbortController().signal, async () => ({
    language: "cpp",
    starts: hints,
    notes: [],
  }));
  assert.deepEqual(
    idx.questions.map((q) => [q.label, q.marks?.points]),
    [
      ["单选题 · 第 1 题", 2],
      ["编程题 · 第 1 题", 25],
      ["编程题 · 第 2 题", 25],
    ],
  );
  assert(idx.questions[1].parts[0].text.includes("3. 转车。"));
  assert(idx.questions[2].parts[1].text.includes("12. 月份计算。"));
  const plain = [{ page: 1, text: "编程题\n1. 输出两个数的和。\n2. 输出三个数的积。" }],
    choice = [
      { line: 1, label: "第一题" },
      { line: 2, label: "第二题" },
    ];
  assert.equal(locateBoundaries(linesOf(plain), choice).length, 2);
});
