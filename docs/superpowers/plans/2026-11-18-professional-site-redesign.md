# GESP Professional Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a detailed animated landing page and a unified professional redesign of the syllabus, paper-analysis and study-planning tools without changing business behavior.

**Architecture:** `/` becomes a marketing and tool-selection surface, while `/syllabus` owns the existing syllabus browser and legacy level URLs redirect there. Shared tokens, navigation and motion primitives connect the pages; real syllabus/course data drives all previews, and existing analysis/report components retain their workflow contracts.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Lucide React, Bun tests

**Spec:** `docs/superpowers/specs/2026-11-18-professional-site-redesign-design.md`

## Global Constraints

- Preserve existing functionality, data, analysis behavior, report printing, authorship and CCF sources; do not invent claims or commercial proof.
- Use the installed Next.js documentation before editing routes, metadata or server/client boundaries.
- Use the chosen “备考路径图” world: neutral ground, deep ink, path green, restrained amber current-stage markers and a meaningful route line.
- Landing motion is rich but explanatory; tool motion is brief and functional; all movement respects `prefers-reduced-motion`.
- Do not add a dependency unless its registry component is demonstrably useful and compatible; prefer existing Tailwind, Framer Motion and Lucide.
- Keep Chinese copy, keyboard access, visible focus, responsive layouts and print behavior intact.
- Commit only verified task-owned changes and preserve unrelated files.

## Review Focus

- Malformed, repeated or absent legacy query parameters: only a valid legacy `level` redirects; ordinary `/` remains the landing page — Task 1 unit tests.
- Long Chinese knowledge names, eight levels and narrow screens: no clipping or horizontal page overflow — Tasks 4–6 viewport checks.
- Reduced-motion users and interrupted interactions: content stays visible and controls never wait for animation — Tasks 2–6 motion checks.
- Invalid PDF, busy/cancel and report-focus behavior: redesign must not bypass existing state handling — Task 5 browser checks.
- Printed reports and dark color scheme: navigation/marketing motion disappear and content keeps readable contrast — Tasks 5 and 7 checks.

---

### Task 1: Landing Route and Legacy Syllabus Compatibility

**Files:**
- Create: `app/lib/syllabus-links.ts`
- Create: `app/syllabus/page.tsx`
- Create: `tests/syllabus-links.test.ts`
- Modify: `app/page.tsx`
- Modify: `app/components/SyllabusBrowser.tsx`
- Modify: `app/components/PaperWorkspace.tsx`

**Interfaces:**
- Produces: `syllabusHref(level: number, language?: Language): string`, returning `/syllabus?language=cpp&level=n`.
- Produces: `legacySyllabusDestination(params: { level?: string | string[] }): string | null`, returning the new URL only when `level` is a single valid GESP level string.
- Consumes: existing `getSelection`, `levels`, `Language` and `SyllabusBrowser` props.

- [ ] **Step 1: Write failing URL tests**
  Cover level 8, invalid levels (`0`, `9`, non-numeric), arrays, and missing level; assert exact destinations and `null` cases.

- [ ] **Step 2: Run the tests and confirm the missing module failure**
  Run `bun test tests/syllabus-links.test.ts`; expect FAIL because `app/lib/syllabus-links.ts` does not exist.

- [ ] **Step 3: Implement the route helpers and wire the pages**
  Add `/syllabus`, make `/` redirect only for a legacy level query, and replace internal `/?level=…` links with `syllabusHref`. Keep a placeholder landing render only until Task 3 replaces it.

- [ ] **Step 4: Verify routes and tests**
  Run `bun test tests/syllabus-links.test.ts tests/syllabus.test.ts`; expect PASS. In the browser, `/` shows the landing placeholder, `/syllabus?level=8` selects level 8, and `/?level=3` lands on `/syllabus?language=cpp&level=3`.

- [ ] **Step 5: Commit**
  `git add` only Task 1 files and commit `feat: add dedicated syllabus route with legacy links`.

### Task 2: Shared Visual System, Navigation and Motion Primitives

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `app/components/review-styles.ts`
- Modify: `app/components/Header.tsx`
- Create: `app/components/SiteFooter.tsx`
- Create: `app/components/motion/Reveal.tsx`
- Create: `.impeccable/surfaces/` brief content through the Impeccable surface-brief command

**Interfaces:**
- Produces: shared `shell`, `heading`, `lead`, `primary`, `secondary`, `field`, `sourceStyle` classes using the new tokens.
- Produces: `Reveal({ children, className?, delay? }: { children: React.ReactNode; className?: string; delay?: number })`, a once-only reduced-motion-aware reveal.
- Produces: the recorded direction contract for `app/page.tsx` with seed `seed:5e3a67352d4ceee6`, chosen pick “备考路径图”, and code-led finish requirements.

- [ ] **Step 1: Record the selected direction and inspect registry options**
  Write and read back the surface brief; verify THESIS, OWN-WORLD, STORY, FIRST VIEWPORT, FORM and FINISH. Search shadcn registry for accordion/tabs/progress; record the adopt/reject reason before using anything.

- [ ] **Step 2: Read the UI quality floor and current Next.js layout guidance**
  Read Impeccable `reference/craft-floor.md` immediately before UI edits and the bundled App Router layout/metadata docs.

- [ ] **Step 3: Implement tokens, shared styles, responsive navigation and footer**
  Replace legacy/slate split tokens with one typed neutral ramp and semantic roles. Add a keyboard-accessible mobile menu, active route states and the detailed source/authorship footer. Implement `Reveal` with transform/opacity only and reduced-motion fallback.

- [ ] **Step 4: Verify shared behavior**
  Run `npm run lint` and `bun test tests`; expect PASS. At 390px and 1440px, open/close the menu by pointer and keyboard, verify focus and active routes, and confirm reduced-motion leaves content visible.

- [ ] **Step 5: Commit**
  Stage Task 2 files and commit `feat: establish unified site design system`.

### Task 3: Detailed Animated Landing Page

**Files:**
- Create: `app/components/landing/LandingPage.tsx`
- Create: `app/components/landing/LevelPath.tsx`
- Create: `app/components/landing/AnalysisDemo.tsx`
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `Reveal`, `syllabusHref`, official `levels`, `unitTitles`, `catalogFor`, `revisionDate`, `syllabusSources` and existing course data.
- Produces: `LevelPath({ initialLevel?: number }: { initialLevel?: number })`, with keyboard-operable level buttons and real level details.
- Produces: the default `/` landing render without changing the Task 1 legacy redirect.

- [ ] **Step 1: Write the landing behavior checks**
  In the running app, capture the current `/` and list the missing required anchors/actions: `#tools`, `#method`, eight level controls, three tool links, FAQ controls and CCF source links. This is the initial failing behavioral check.

- [ ] **Step 2: Build the content-complete landing page**
  Implement the ten spec sections with verified copy and real data. Keep the primary action at `#tools`, provide balanced entries to `/syllabus`, `/analyze` and `/plan`, and label interface demonstrations accurately.

- [ ] **Step 3: Add path, analysis and scroll motion**
  Draw the initial path once, animate selected-node details, connect question/knowledge/clause evidence, reveal sections once and animate real numeric figures. Do not auto-loop demos or animate layout properties.

- [ ] **Step 4: Verify content and interaction**
  Run `bun test tests` and `npm run lint`; expect PASS. Exercise every link, level, FAQ and keyboard interaction at 390/768/1440px; verify reduced-motion and no horizontal overflow.

- [ ] **Step 5: Commit**
  Stage Task 3 files and commit `feat: build detailed animated landing page`.

### Task 4: Syllabus Reading and Level-Navigation Redesign

**Files:**
- Modify: `app/components/SyllabusBrowser.tsx`
- Modify: `app/syllabus/page.tsx`

**Interfaces:**
- Consumes: Task 1 links and Task 2 shared styles/tokens.
- Preserves: `getSelection(n?: string | string[], defaultLevel?: number)`, `unitTitles`, all official entries, source anchors and level metadata.

- [ ] **Step 1: Add the syllabus presentation regression checks**
  Extend `tests/syllabus.test.ts` only for any new pure presentation helper; otherwise record the browser baseline for eight levels, topic counts, original page links and format/boundary sections.

- [ ] **Step 2: Implement the syllabus layout**
  Add the page metadata/title, current-level summary, continuous level-path navigation, scannable clause rows and quiet source/boundary regions. Keep all existing entries and actions.

- [ ] **Step 3: Verify every level and viewport**
  Run `bun test tests/syllabus.test.ts tests/syllabus-links.test.ts`; expect PASS. Cycle all eight levels and long entries at mobile/desktop widths; verify current state is not color-only and source links retain page anchors.

- [ ] **Step 4: Commit**
  Stage Task 4 files and commit `feat: redesign syllabus reading experience`.

### Task 5: Paper Analysis Workflow and Report Styling

**Files:**
- Modify: `app/components/PaperWorkspace.tsx`
- Modify: `app/components/PdfUploader.tsx`
- Modify: `app/components/ExamAnalysisResult.tsx`
- Modify: `app/analyze/page.tsx`

**Interfaces:**
- Preserves: `PaperWorkspace({ initial }: { initial: Selection })`, `ReportContext`, `reviewFile`, abort behavior, report focus movement, uploader file/error callbacks and print containers.

- [ ] **Step 1: Exercise the existing failure and empty states**
  Before editing, submit without a file, upload an invalid PDF, expand optional fields and switch levels; record the current behavior that must remain.

- [ ] **Step 2: Redesign the analysis workflow**
  Apply the shared system to file upload, standard selection, optional metadata, busy/cancel/error states and the current-standard rail. Keep status text tied to real processing states and add no fabricated percentage.

- [ ] **Step 3: Restyle the report without changing its data**
  Apply consistent sections, tables, badges, source links and print rules to `ExamAnalysisResult`; preserve every report field and action.

- [ ] **Step 4: Verify workflow and print boundaries**
  Run `bun test tests` and `npm run lint`; expect PASS. Repeat Step 1, verify cancel/focus behavior where the local provider permits, and inspect print emulation with a report or existing fixture. State explicitly if real model analysis cannot be run.

- [ ] **Step 5: Commit**
  Stage Task 5 files and commit `feat: redesign paper analysis workflow`.

### Task 6: Study Planning Dashboard Redesign

**Files:**
- Modify: `app/plan/page.tsx`
- Modify: `app/components/LevelSelector.tsx`
- Modify: `app/components/ExamPrediction.tsx`
- Modify: `app/components/KnowledgeAnalysis.tsx`
- Modify: `app/components/StudyPath.tsx`
- Modify: `app/components/animations/AnimatedNumber.tsx` only if reduced-motion support is missing

**Interfaces:**
- Preserves: all component props, course/GESP calculations, tabs, categories, sliders, quick controls, recommended-exam output and `AnimatedNumber` value/suffix/className behavior.

- [ ] **Step 1: Run calculation regressions before visual edits**
  Run `bun test tests/scoring.test.ts tests/syllabus.test.ts`; expect PASS and retain it as the behavior baseline.

- [ ] **Step 2: Rebuild the planning hierarchy**
  Make current progress and recommendation primary, replace saturated cards and rainbow paths with shared surfaces, preserve knowledge tabs and use a continuous four-stage path.

- [ ] **Step 3: Add bounded functional motion**
  Animate selected level, lesson progress, changed numbers, accordions and tab content with short reduced-motion-aware transitions; remove `transition-all`, decorative glow and repetitive entrance delays.

- [ ] **Step 4: Verify calculations and interaction extremes**
  Run `bun test tests/scoring.test.ts tests/syllabus.test.ts`; expect PASS. Test first/last lessons, all four course levels, all five knowledge tabs, long content, keyboard controls and reduced motion at 390/768/1440px.

- [ ] **Step 5: Commit**
  Stage Task 6 files and commit `feat: redesign study planning dashboard`.

### Task 7: Whole-Site Quality Gate and Design Documentation

**Files:**
- Modify: any task-owned UI file needed for confirmed review findings
- Create: `DESIGN.md`
- Create: `.impeccable/design.json`
- Modify: `AGENTS.md` only if documented routes or structure changed
- Remove: temporary before-capture files created at the repository root after review evidence is preserved in the intended review directory

**Interfaces:**
- Consumes: all previous routes/components and the approved spec.
- Produces: final token-bearing design documentation, review evidence and a clean verified branch.

- [ ] **Step 1: Run standard project verification**
  Run `bun test tests`, `npm run lint` and `npm run build`; all must PASS on the final code.

- [ ] **Step 2: Run the complete browser matrix**
  Verify `/`, `/syllabus`, legacy redirects, `/analyze`, `/plan`, navigation, all landing interactions, all eight levels, analysis empty/error states, planning extremes, 390/768/1440px, dark scheme, reduced motion and print. Capture final desktop/mobile screenshots in `.impeccable/review/` and inspect each file.

- [ ] **Step 3: Complete Unslop and Impeccable review**
  Run one scoped manual detector pass if no effective hook covers the edits; complete polish, critique and audit on the changed surfaces, fix material findings, and obtain the required fresh finish-review disposition.

- [ ] **Step 4: Document the finished system**
  Generate `DESIGN.md` and `.impeccable/design.json` from the built world, update route documentation if needed, remove only task-created temporary artifacts, and confirm `git status --short` contains no generated logs or test output.

- [ ] **Step 5: Commit the verified milestone**
  Stage only final review/documentation/fix files and commit `docs: record finished site design system`; read back the commit SHA and included files.
