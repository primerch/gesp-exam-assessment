# GESP ReUI Landing Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the existing landing page with a rich set of real ReUI components while preserving natural copy, product truth and accessibility.

**Architecture:** Add only reviewed ReUI source components through the shadcn CLI, then compose focused landing components around the existing path, analysis demo and real course data. No business/API changes; the current `main` courseware model remains authoritative.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, Framer Motion, Lucide, ReUI/shadcn CLI, Bun tests

**Spec:** `docs/superpowers/specs/2026-11-18-reui-landing-upgrade-design.md`

## Global Constraints

- Work on `redesign/reui-landing`; preserve current `main`, all routes and business behavior.
- More components are welcome only when they carry real content; no fake scores, learner progress, testimonials or auto-looping visuals.
- Keep GESP 考级宝, Reacher attribution, natural Chinese and the existing design tokens.
- Review every added source file and dependency; never let CLI initialization overwrite the existing visual system.
- Support 390/768/1440px, dark mode, keyboard, reduced motion and no document-level horizontal overflow.

## Review Focus

- Demo step state could imply real learner progress — label and test the demo as visitor-controlled in Task 2.
- ReUI dependencies could overwrite tokens or add unused packages — inspect the complete install diff in Task 1.
- Course totals could drift from real `cppLessons` data — add a failing content regression test in Task 3.
- Dense components could overflow mobile or hide keyboard state — exercise every component at three widths in Task 4.
- Animating numbers/accordions could leave transient or inaccessible output — settle captures and verify reduced motion in Task 4.

---

### Task 1: Branch, CLI Compatibility and Component Audit

**Files:**
- Create: `components.json`
- Modify: `package.json`, `package-lock.json`
- Create: required `app/components/reui/` and utility files only after CLI inspection

**Interfaces:**
- Produces: reviewed ReUI Stepper/Timeline and supporting primitive imports usable by Tasks 2–3.
- Preserves: `app/globals.css`, current tokens and existing application routes.

- [ ] **Step 1: Create the task branch and record the clean baseline**
  Run `git switch -c redesign/reui-landing` from current `main`, then `bun test tests`; expect the current suite to pass.

- [ ] **Step 2: Inspect ReUI installation without changing source**
  Review the already fetched Stepper/Timeline docs and run dry-run/diff-capable shadcn commands where available. Confirm required dependencies and destination paths.

- [ ] **Step 3: Install only approved components**
  Configure `components.json` for the current Next.js/Tailwind project, then add `@reui/stepper`, `@reui/timeline` and the primitives actually used by the approved spec. Read every generated file and remove example-only data/imports.

- [ ] **Step 4: Verify the install**
  Run `bun test tests` and `npm run lint`; expect no new errors. Inspect `git diff` for token or unrelated changes.

- [ ] **Step 5: Commit**
  Commit only the reviewed setup with `chore: add reviewed ReUI landing components`.

### Task 2: Interactive Process Stepper and Course Timeline

**Files:**
- Create: `app/components/landing/ProcessStepper.tsx`
- Create: `app/components/landing/CourseTimeline.tsx`
- Modify: `app/components/landing/LandingPage.tsx`

**Interfaces:**
- Produces: `ProcessStepper()` with four visitor-controlled demo steps and real links.
- Produces: `CourseTimeline()` using `courseInfo.levels` and real course totals; no persisted learner state.

- [ ] **Step 1: Record failing behavior checks**
  Before implementation, verify the current page has no `[data-process-stepper]` or `[data-course-timeline]` and captures the static sections being replaced.

- [ ] **Step 2: Implement Stepper and Timeline**
  Compose the reviewed ReUI components with current styles, four process steps and four course stages. Mark these as demos; do not infer visitor progress.

- [ ] **Step 3: Integrate and exercise interactions**
  Replace the old static process/course blocks in `LandingPage.tsx`. Click and keyboard-operate each step and timeline item; verify content, links and reduced-motion behavior.

- [ ] **Step 4: Verify and commit**
  Run `bun test tests` and `npm run lint`; expect PASS. Commit `feat: add interactive process and course components`.

### Task 3: Rich Tool Panels, Status, Accordion and Real Course Content

**Files:**
- Create: `app/lib/course-summary.ts`
- Create: `app/components/landing/ToolPanels.tsx`
- Create: `app/components/landing/FaqAccordion.tsx`
- Create: `tests/landing-content.test.ts`
- Modify: `app/components/landing/LandingPage.tsx`
- Modify: `app/components/landing/AnalysisDemo.tsx` only where status components are integrated

**Interfaces:**
- Produces: `getCourseSummary(): { total: number; perLevel: Record<number, number> }` from `cppLessons`/`cppCourseLevels`.
- Produces: reusable landing panels and an accessible FAQ accordion without changing any link target.

- [ ] **Step 1: Write the failing course-summary regression**
  Assert the current real catalog has 96 total lessons and 24 at each level, and that the summary is derived from the real catalog rather than a hard-coded landing value.

- [ ] **Step 2: Watch the test fail**
  Run `bun test tests/landing-content.test.ts`; expect the missing module failure.

- [ ] **Step 3: Implement the summary and rich panels**
  Use the real summary in the landing tools. Compose badges, progress, alerts, button groups and accordion only for actual content; no invented scores or progress.

- [ ] **Step 4: Verify content and behavior**
  Run `bun test tests/landing-content.test.ts` and the full suite; expect PASS. Verify all three tools, all FAQs and the analysis-demo states on mobile/desktop.

- [ ] **Step 5: Commit**
  Commit `feat: enrich landing tools and status components`.

### Task 4: Full Quality Gate, Screenshots and Documentation

**Files:**
- Modify: `DESIGN.md`, `.impeccable/design.json`, `AGENTS.md`, `README.md` where current structure requires it
- Create: final captures under `.impeccable/review/`
- Modify: task-owned UI only for verified review findings

- [ ] **Step 1: Run standard verification**
  Run `bun test tests`, `npm run lint` and `npm run build`; expect all to pass on final code.

- [ ] **Step 2: Run the complete browser matrix**
  Exercise all landing controls at 390/768/1440px, light/dark and reduced motion. Capture settled final screenshots and inspect each one.

- [ ] **Step 3: Complete design review**
  Run one scoped detector pass if no effective hook exists, complete Unslop/Impeccable polish and obtain an independent finish disposition. Fix material findings with focused regression checks.

- [ ] **Step 4: Update documentation and clean up**
  Record the finished component system, remove temporary artifacts and verify `git status --short` contains only intended files.

- [ ] **Step 5: Commit the verified milestone**
  Commit `feat: complete professional ReUI landing page` and read back SHA/files.
