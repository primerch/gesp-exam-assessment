# Orbit Evidence Theater UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the verbose landing and task screens with an Orbit Flora–based motion landing, a course-to-exam workspace, and a clearer paper-analysis UI without changing business logic.

**Architecture:** Keep the existing Next.js routes and review/course functions. Add reviewed shadcn registry primitives as local source, compose product-specific client components around them, and verify semantic HTML through the existing Bun/React static-render tests plus real browser flows.

**Tech Stack:** Next.js 16.4.6, React 19.3, TypeScript, Tailwind CSS 4, Framer Motion, shadcn registry sources (Magic UI, motion-primitives, ReUI), Bun test.

**Spec:** `docs/superpowers/specs/2026-11-21-evidence-theater-ui-redesign-design.md`

## Global Constraints

- UI and presentation only: do not edit `app/lib/review/`, `app/api/`, `app/data/cpp-lessons.ts`, `app/data/cpp-lessons.json`, `app/data/curriculum-data.ts`, model prompts, schemas, algorithms, or scoring.
- Paper identity is limited to existing filename, pages, language, selected level, question count, revision, and notes; do not claim year/session detection.
- Use the confirmed-free Orbit Flora direction as the landing base; do not use the Paid Luminous Topo direction.
- Keep CCF source links, printing, upload validation, cancellation, errors, and all existing report calculations intact.
- New motion must have `prefers-reduced-motion` and mobile/touch fallbacks.
- Install only registry components actually composed into the UI; review generated source and dependency changes before use.
- Follow the installed Next.js 16 documentation; `usePathname` stays inside Client Components.

## Review Focus

- Reduced-motion and touch input: the paper sculpture, evidence, selectors, filters, and dialogs remain fully usable without hover or animation (Tasks 2–4 browser checks).
- Long filenames and empty/error states: upload and report layouts must not overflow or invent progress (Task 4 tests and browser checks).
- No course recommendation: Level 1 lesson 1 must show an honest empty state rather than a fabricated level (Task 3 test).
- Evidence focus: dialog/panel content must retain question reasoning, marks, paper pages, and CCF links with keyboard dismissal (Task 4 test and browser check).
- Registry/runtime compatibility: generated `motion/react` imports and new dependencies must work in the existing Next.js and Cloudflare builds (Tasks 1 and 5).

---

### Task 1: Reviewed Motion Registry Primitives

**Files:**
- Modify: `components.json`
- Modify: `package.json` and lockfile only when registry metadata requires it
- Create: generated Magic UI sources under `app/components/ui/`
- Create: generated motion-primitives sources under the CLI’s configured component directory, then re-export from `app/components/motion/`
- Create: `app/hooks/use-file-upload.ts` and reviewed ReUI file-type source only if composed in Task 4
- Test: `tests/landing-components.test.ts`

**Interfaces:**
- Produces: local `AnimatedBeam`, `NumberTicker`, `BorderBeam`, `Particles`, `Tilt`, `Spotlight`, `TextMorph`, `TransitionPanel`, and `MorphingDialog` components for later tasks; existing component props remain those documented by their registries.

- [ ] **Step 1: Add a failing registry composition smoke test**

Add a static-render test importing the planned local primitives and asserting that `AnimatedBeam` renders an SVG and `NumberTicker` renders its configured `startValue` (the registry renders the target only after the client enters view). It should fail because the components do not yet exist.

- [ ] **Step 2: Run the focused test and confirm the missing-module failure**

Run: `bun test tests/landing-components.test.ts`
Expected: FAIL with module-not-found for the new local primitives.

- [ ] **Step 3: Install and review only the required registry sources**

Configure the Magic UI registry URL `https://magicui.design/r/{name}.json` alongside the existing ReUI entry. Install `@magicui/animated-beam`, `@magicui/number-ticker`, `@magicui/border-beam`, and `@magicui/particles` with `npx shadcn@latest add`. Install `text-morph`, `transition-panel`, `morphing-dialog`, `tilt`, and `spotlight` with `npx motion-primitives@latest add`; align generated imports with `@/app/lib/utils` and add thin re-exports under `app/components/motion/` rather than maintaining duplicate implementations. Install `@reui/use-file-upload` and the ReUI file-type source only if Task 4 uses their actual APIs.

Review generated source for `motion/react` versus `framer-motion`, React 19 compatibility, unnecessary dependencies, and repeated infinite animation. Preserve registry copyright/credit where present. The initial CLI help request failed with `ECONNRESET`; retry the normal CLI first, and if the registry remains unreachable, use the exact public registry JSON/docs source for the same named components rather than silently substituting another library.

- [ ] **Step 4: Run the smoke test and production compiler**

Run: `bun test tests/landing-components.test.ts && npm run build`
Expected: smoke test PASS and Next.js production build PASS.

- [ ] **Step 5: Commit the reviewed primitive milestone**

```bash
git add components.json package.json package-lock.json app/components app/hooks tests/landing-components.test.ts
git commit -m "feat: add reviewed motion registry primitives"
git show --stat --oneline HEAD
```

### Task 2: Orbit Flora Landing and Home Navigation

**Files:**
- Create: `app/components/landing/OrbitHero.tsx`
- Create: `app/components/landing/OrbitPaperScene.tsx`
- Create: `app/components/landing/LearningExamScene.tsx`
- Modify: `app/components/landing/LandingPage.tsx`
- Modify: `app/components/Header.tsx`
- Modify: `app/globals.css` only for the display font and home-specific global needs
- Test: `tests/landing-components.test.ts`
- Test: `tests/landing-content.test.ts`

**Interfaces:**
- Consumes: Task 1 motion primitives; existing `calculatePassProbability(1, 12)` and `getRecommendedExam(1, 12)`; existing CCF source links.
- Produces: default `<OrbitHero />`, `<OrbitPaperScene />`, and `<LearningExamScene />`; home links remain `/plan`, `/analyze`, and `/syllabus`.

- [ ] **Step 1: Replace the old landing assertions with failing Orbit behavior assertions**

Assert that server-rendered `OrbitHero` contains `GESP`, links to `/plan` and `/analyze`, identifies its content as a product demonstration, and exposes a non-animated text equivalent for the paper-to-evidence relationship. Assert `LearningExamScene` contains the sourced `96` lessons and real example `93%`. Assert the new `LandingPage` no longer contains `常见问题` or `你想先做什么？`.

- [ ] **Step 2: Run the focused tests and confirm failure**

Run: `bun test tests/landing-components.test.ts tests/landing-content.test.ts`
Expected: FAIL because the Orbit components and new content do not exist.

- [ ] **Step 3: Implement the full-viewport Orbit composition**

Build `OrbitPaperScene` as a CSS/SVG perspective stack of CCF pages, code question layers, annotations, verdict stamp, and evidence beams. Use `Tilt`, restrained `Spotlight`, low-density `Particles`, and pointer/click-driven local reveal; no external flower or generic AI artwork. Use independent fixed demo content for each verdict if more than one verdict is shown.

Build `OrbitHero` with near-black green, oversized serif `GESP`, one short Chinese positioning line, two primary actions, one-time entrance choreography, and `TextMorph` for the three analysis stages. Keep all textual evidence available outside animated layers.

Build `LearningExamScene` as one continuous Level 1–4 to GESP path plus one compact report slice, using only existing example calculations and the explicit estimation disclaimer. Reduce `LandingPage` to the two scenes and one evidence note. Give `/` a dark integrated Header variant without affecting other routes.

- [ ] **Step 4: Verify focused tests and browser fallbacks**

Run: `bun test tests/landing-components.test.ts tests/landing-content.test.ts`
Expected: PASS.

Browser-check `/` at desktop and mobile widths: both links work, pointer and touch reveal work, no horizontal overflow, reduced-motion shows the complete static scene, and keyboard focus never enters decorative layers.

- [ ] **Step 5: Commit the landing milestone**

```bash
git add app/components/landing app/components/Header.tsx app/globals.css tests/landing-components.test.ts tests/landing-content.test.ts
git commit -m "feat: rebuild landing as Orbit evidence theater"
git show --stat --oneline HEAD
```

### Task 3: Course-to-Exam Workspace

**Files:**
- Create: `app/components/plan/CourseProgressWorkspace.tsx`
- Create: `app/components/plan/CourseLevelRail.tsx`
- Modify: `app/plan/page.tsx`
- Test: `tests/cpp-lessons.test.ts` or a UI-focused addition to `tests/landing-components.test.ts`

**Interfaces:**
- Consumes: unchanged `courseLessons`, `cppCourseLevels`, `lessonPointKinds`, `lessonClauses`, `syllabusCoverageThrough`, `calculatePassProbability`, `getRecommendedExam`, `levelNames`, `sourceLink`, and Task 1 number/panel primitives.
- Produces: `<CourseProgressWorkspace />` owning only UI selection state; level type remains `CppCourseLevel`, lesson numbers remain one-based.

- [ ] **Step 1: Write failing workspace hierarchy and empty-recommendation tests**

Assert initial Level 1 lesson 1 renders `暂未形成报考建议`, the current lesson title, searchable lesson selection controls, previous/next controls, and expandable source detail. Assert the result precedes detailed teaching points in the static markup. Do not change expectations for existing course-mapping tests.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `bun test tests/landing-components.test.ts tests/cpp-lessons.test.ts`
Expected: new UI test FAIL; existing course logic tests PASS.

- [ ] **Step 3: Implement selection-first course UI**

Extract the current page’s lesson detail behavior into `CourseProgressWorkspace`. Add a four-stage `CourseLevelRail`, searchable native-accessible lesson selector, previous/next buttons, and a primary result region using the existing recommendation/probability values. Render the empty recommendation honestly. Use animated numbers and panel transitions only as enhancements; put teaching points, sources, and cumulative clauses in expandable secondary sections.

- [ ] **Step 4: Verify all course tests and real selection flows**

Run: `bun test tests/landing-components.test.ts tests/cpp-lessons.test.ts`
Expected: PASS.

Browser-check `/plan`: Level 1 lesson 1 empty state; Level 1 lesson 12 shows GESP 一级 and `93%`; changing levels resets to lesson 1; previous/next boundaries are correct; all CCF links still open their original targets.

- [ ] **Step 5: Commit the course workspace milestone**

```bash
git add app/components/plan app/plan/page.tsx tests/landing-components.test.ts tests/cpp-lessons.test.ts
git commit -m "feat: prioritize course exam recommendations"
git show --stat --oneline HEAD
```

### Task 4: Paper Upload and Evidence Report UI

**Files:**
- Modify: `app/components/PdfUploader.tsx`
- Modify: `app/components/PaperWorkspace.tsx`
- Modify: `app/components/ExamAnalysisResult.tsx`
- Create: `app/components/analyze/PaperIdentity.tsx`
- Create: `app/components/analyze/QuestionEvidence.tsx`
- Test: `tests/judgment.test.ts` only for UI fixtures if needed; otherwise `tests/landing-components.test.ts`
- Test: `tests/scoring.test.ts` unchanged

**Interfaces:**
- Consumes: unchanged `PdfUploader` props `{ file, disabled, onChange, onError }`, unchanged `PaperReport`, `QuestionJudgment`, `ReportContext`, and existing review functions.
- Produces: `<PaperIdentity report={report} />` and `<QuestionEvidence row={row} fileUrl={fileUrl} initiallyOpen={boolean} />`; no change to report data signatures.

- [ ] **Step 1: Add failing upload/report presentation tests**

Assert the uploader exposes its PDF input and `移除试卷` file-card action, and assert report identity contains filename, page count, language, level, question count, and revision. Assert long filenames wrap, analysis status has `role="status"`, verdict counts retain filter buttons, and evidence exposes reasoning, marks, paper page, and CCF links. Verify the exact Chinese validation for non-PDF, empty, and over-10MB files through browser events in Step 4 rather than static markup. Do not add year/session fields or fake progress.

- [ ] **Step 2: Run UI and unchanged judgment/scoring tests**

Run: `bun test tests/landing-components.test.ts tests/judgment.test.ts tests/scoring.test.ts`
Expected: new UI assertions FAIL; judgment and scoring logic remains PASS.

- [ ] **Step 3: Implement the scanning upload and evidence-first report**

Restyle `PdfUploader` with corner scan guides, drag-active `BorderBeam`, file-type card, and morphing file state while preserving its public props and validation messages. Keep actual progress limited to existing status text. Reorganize `PaperWorkspace` into upload, standard summary, and report regions without changing `reviewFile` calls or cancellation.

Extract `PaperIdentity` and `QuestionEvidence`. Use `NumberTicker` for existing verdict counts and `TransitionPanel` for result summaries. Compose `MorphingDialog` only if its keyboard/focus behavior passes; otherwise use the accessible expandable evidence panel. Preserve all report computations, filters, print markup, source links, teaching feedback, and copy behavior.

- [ ] **Step 4: Verify report tests and real browser states**

Run: `bun test tests/landing-components.test.ts tests/judgment.test.ts tests/scoring.test.ts`
Expected: PASS.

Browser-check `/analyze`: valid/invalid PDF selection, long filename, target-level change, disabled submit, cancellation and error rendering. With an available real or existing test fixture report, verify filters, evidence focus/dismissal, paper and CCF links, long content, print, and reduced-motion. Do not claim an end-to-end model analysis was run if credentials or a suitable PDF are unavailable.

- [ ] **Step 5: Commit the paper workspace milestone**

```bash
git add app/components/PdfUploader.tsx app/components/PaperWorkspace.tsx app/components/ExamAnalysisResult.tsx app/components/analyze tests/landing-components.test.ts tests/judgment.test.ts
git commit -m "feat: clarify paper analysis and evidence UI"
git show --stat --oneline HEAD
```

### Task 5: Whole-Surface Quality Gate and Delivery

**Files:**
- Modify only defects found in Tasks 2–4 and their tests
- Remove: obsolete landing imports/files only after confirming no remaining references
- Evidence: real post-change screenshots under `.impeccable/`

**Interfaces:**
- Consumes: all previous task outputs and unchanged business logic.

- [ ] **Step 1: Run the complete repository verification**

Run: `bun test tests && npm run lint && npm run build`
Expected: all commands PASS. Also inspect `git diff -- app/api app/lib/review app/data` and confirm no business-logic edits.

- [ ] **Step 2: Run the required UI design and motion reviews**

Read and apply the original Impeccable context/craft-floor, Unslop checklist, Emil design/motion review, accessibility checks, and anti-slop review to the changed surfaces. Verify the design still visibly follows Orbit Flora rather than falling back to generic cards. Fix only authorized UI defects and rerun affected checks.

- [ ] **Step 3: Exercise final browser flows and capture evidence**

Run the Next.js preview and inspect `/`, `/plan`, and `/analyze` at desktop and mobile sizes. Capture real post-change screenshots, test reduced-motion and keyboard paths, and confirm the preview process/URL. Remove obsolete temporary research screenshots and `.playwright-mcp` output; retain only relevant before/after evidence if desired.

- [ ] **Step 4: Commit verified review fixes and read the final state**

```bash
git add app components tests
git commit -m "fix: polish Orbit UI across viewports" # only if review produced changes
git status --short
git log -5 --oneline
```

Report exact verification, any unrun live-model scenario, preview URL/process, branch and source SHA, and remaining limitations.
