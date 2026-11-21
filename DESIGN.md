---
name: GESP 考级宝
description: 以 Orbit 证据剧场连接课程进度、试卷原文与 CCF 判断依据。
colors:
  paper: "#f4f5f1"
  surface: "#fcfdfb"
  ink: "#1d302b"
  muted: "#55665f"
  line: "#d5ddd7"
  input: "#c3cec7"
  wash: "#e7eee9"
  quiet: "#edf0eb"
  selection: "#c9ddd2"
  selection-ink: "#172a24"
  brand: "#2e6e5e"
  action: "#285f51"
  on-brand: "#ffffff"
  current: "#a9762a"
  current-text: "#7b531d"
  on-current: "#101713"
  destructive: "#a34235"
  theater: "#0b120f"
  theater-panel: "#17231d"
  theater-action-ink: "#132019"
  theater-text: "#edf3ef"
  theater-heading: "#f2f0e8"
  theater-muted: "#a8b5ad"
  theater-dim: "#82968b"
  theater-line: "#52685b"
  evidence-amber: "#d4ad66"
  evidence-green: "#77b69c"
  scene-ground: "#eeeae0"
  scene-surface: "#f7f4ec"
  scene-line: "#c9c7bc"
  question-paper: "#f7f3e9"
  question-backing: "#e8e3d7"
typography:
  display:
    fontFamily: "var(--font-geist-sans), 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans CJK SC', sans-serif"
    fontSize: "64px"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "var(--font-geist-sans), 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans CJK SC', sans-serif"
    fontSize: "36px"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  workspace-heading:
    fontFamily: "var(--font-geist-sans), 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans CJK SC', sans-serif"
    fontSize: "48px"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.035em"
  title:
    fontFamily: "var(--font-geist-sans), 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.02em"
  body:
    fontFamily: "var(--font-geist-sans), 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "0em"
  label:
    fontFamily: "var(--font-geist-sans), 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0em"
  mono:
    fontFamily: "var(--font-geist-mono), monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
    fontFeature: "'tnum' 1"
  micro:
    fontFamily: "var(--font-geist-sans), 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
rounded:
  radius-2: "2px"
  radius-4: "4px"
  radius-5: "5px"
  radius-6: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-brand}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.ink}"
  orbit-button-primary:
    backgroundColor: "{colors.theater-text}"
    textColor: "{colors.theater-action-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.radius-6}"
    padding: "0 20px"
    height: "48px"
  orbit-button-primary-hover:
    backgroundColor: "{colors.on-brand}"
    textColor: "{colors.theater-action-ink}"
  orbit-button-secondary:
    backgroundColor: "rgb(16 26 21 / 70%)"
    textColor: "{colors.theater-text}"
    typography: "{typography.label}"
    rounded: "{rounded.radius-6}"
    padding: "0 20px"
    height: "48px"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "44px"
    width: "100%"
  level-option-selected:
    backgroundColor: "{colors.theater-panel}"
    textColor: "{colors.theater-text}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "16px"
  workspace-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "32px"
---

# Design System: GESP 考级宝

## Overview

**Creative North Star: "Orbit 证据剧场"**

GESP 考级宝 opens as an evidence theater: a near-black stage, an oversized low-contrast GESP backdrop and a dimensional stack of question, CCF clause and verdict papers show how a judgment is formed. The home page is expressive because its job is to explain and persuade. Its visual signature is the relationship between documents, not decoration detached from the product.

The learning, syllabus, analysis and report surfaces return to warm paper, deep ink, fine rules and Path Green actions. Dark panels remain meaningful summaries or evidence regions rather than a universal card style. Motion explains sequence, position and change: documents enter, evidence beams connect, a course route draws and panels crossfade. Reduced-motion preferences remove nonessential entrance and ambient effects while direct controls and readable evidence remain available.

**Key Characteristics:**
- A dark Orbit evidence theater followed by warm, archival learning and task surfaces.
- Geist/PingFang display sans, medium-weight controls and mono tabular evidence figures.
- Dimensional paper layers, scan guides, evidence beams and a circular verdict stamp.
- A geometric G plus amber evidence-dot brand mark; no legacy Waypoints symbol.
- Purposeful motion with static reduced-motion fallbacks and manually selectable stages.
- Traceable sources, estimation limits and a complete print report alongside every conclusion.

## Colors

The palette splits by job: luminous evidence colors on the dark theater, botanical green and archival neutrals in workspaces, and amber reserved for current position or highlighted evidence.

### Primary
- **Path Green** (`brand`): workspace evidence links, active navigation, progress, selected states and icon accents.
- **Deep Path Green** (`action`): primary buttons and decisive actions on warm surfaces; hover returns to Path Green.
- **On-Brand White** (`on-brand`): text on dark green actions.

### Secondary
- **Current Amber** (`current`): active level nodes, recommended readiness and current-stage markers.
- **Current Umber** (`current-text`): readable amber-adjacent text on light surfaces.
- **Current Ink** (`on-current`): dark text on amber markers.
- **Evidence Amber** (`evidence-amber`): stage metadata, highlighted estimates, beams and the verdict stamp on dark panels.
- **Evidence Green** (`evidence-green`): completed evidence stages and the green end of an evidence connection on the dark theater.

### Tertiary
- **Error Red** (`destructive`): destructive messaging, invalid judgments and analysis errors only.

### Neutral
- **Warm Paper** (`paper`) and **Paper Surface** (`surface`): the global ground, cards, navigation, fields and footer.
- **Deep Ink** (`ink`), **Muted Graphite** (`muted`), **Fine Line** (`line`) and **Input Line** (`input`): text and structural strokes on warm surfaces.
- **Path Wash** (`wash`) and **Quiet Ground** (`quiet`): selected and secondary tonal regions.
- **Selection Mint** (`selection`) with **Selection Ink** (`selection-ink`): text selection only.
- **Theater Black** (`theater`) and **Theater Panel** (`theater-panel`): the landing stage, evidence panels, report identity and selected course level.
- **Theater Text** (`theater-text`), **Theater Heading** (`theater-heading`), **Theater Muted** (`theater-muted`) and **Theater Dim** (`theater-dim`): foreground hierarchy on dark regions; **Theater Action Ink** (`theater-action-ink`) sits on the light hero action.
- **Theater Line** (`theater-line`): borders, secondary actions and evidence paths on dark regions.
- **Scene Ground** (`scene-ground`), **Scene Surface** (`scene-surface`) and **Scene Line** (`scene-line`): the warmer course-to-exam section and its paper report card.
- **Question Paper** (`question-paper`) and **Question Backing** (`question-backing`): the dimensional document stack.

**The Path-Green Rule.** In warm workspaces, Path Green carries primary actions, active navigation, evidence links and progress. The dark hero may invert its primary action to paper white; green and amber there explain evidence rather than becoming general decoration.

**The Amber-Role Rule.** Current Amber marks position on light surfaces; Evidence Amber highlights proof and key estimates on dark surfaces. Neither becomes an unrestricted accent wash.

## Typography

**Display Font:** Geist Sans through the project font variable, with PingFang SC, Hiragino Sans GB, Microsoft YaHei and Noto Sans CJK SC fallbacks.
**Body Font:** Geist Sans through the project font variable, with PingFang SC and Microsoft YaHei fallbacks.
**Label / Data Font:** Geist Mono through the project font variable, with monospace fallback; figures use tabular numerals.

**Character:** Chinese editorial scale without decorative serif lettering. Large headlines use regular-weight display sans and tight tracking; controls use medium weight, while monospace metadata and tabular figures make levels, pages and estimates inspectable.

### Hierarchy
- **Display** (400, 36px mobile / 48px small / 42–64px split layout, 1.12) sets the two-line homepage title. The GESP backdrop uses separate bold, viewport-sized type.
- **Headline** (400, 36px mobile / 48px small, 1.12): the course-to-exam scene heading.
- **Workspace Heading** (400, 36px mobile / 48px small, 1.15): task titles and report context.
- **Title** (400–500, 20–36px by context): tool panels, evidence cards, dialog titles and selected-level summaries.
- **Body** (400, 14–18px, 1.75–2): explanations, sources and controls; long prose remains width-constrained.
- **Label** (500, 14px): buttons, navigation and form labels.
- **Data** (400, 11–60px by context): mono level numbers, page references, counts and percentages with tabular figures.
- **Micro** (400, 11px): optional source labels, stage metadata, bylines and compact status text; tracked uppercase is reserved for short Latin metadata, never required for every section.

**The Display-Sans Rule.** Keep display and reading text in the actual Geist/PingFang sans stack. Establish hierarchy with scale, spacing and ink contrast; do not reintroduce a decorative serif or routinely bold Chinese headlines.

**The Evidence-Mono Rule.** Use mono tabular figures for levels, pages, topic counts, lesson counts and estimates. Mono stage labels support orientation but are not mandatory eyebrow decoration.

## Layout

The shared shell reaches 1440px with 20px mobile, 32px small-screen and 48px large-screen horizontal padding. Header height is at least 80px. The Orbit hero uses a 1600px maximum and a minimum height of the current small viewport minus that header; its content splits 0.72fr / 1.28fr at 1024px. The oversized background word, grid and glow remain clipped inside the hero rather than causing document overflow.

The course-to-exam scene uses a 1440px container, 80–96px vertical rhythm, a four-stage route and two evidence cards. Below 1024px, hero and evidence compositions stack; the four course stages remain two columns before becoming four at 640px. Navigation appears at 768px, with a floating panel below that breakpoint.

Task workspaces use the same 1440px shell with 40–48px top padding and 64px bottom padding. Paper analysis becomes a 1.65fr / 0.85fr form-and-evidence grid at 1024px with a sticky dark standard aside. Controls and report metadata wrap instead of compressing labels; question rows simplify their grid on narrow screens. Print removes interactive layout rather than shrinking the on-screen workspace onto paper.

## Elevation & Depth

Warm task surfaces remain predominantly flat, using 1px lines and tonal washes. The evidence theater is deliberately dimensional: rotated paper, deep contact shadows and foreground panels make the question-to-clause-to-verdict relationship spatial. Floating menus and evidence dialogs may lift; ordinary forms and disclosure rows do not.

### Shadow Vocabulary
- **Primary rest** (`0 1px 2px rgb(20 42 34 / 12%)`): subtle contact under enabled workspace primary buttons.
- **Question paper** (`0 32px 90px rgb(0 0 0 / 50%)`): the principal document in the Orbit stack.
- **Backing papers** (`0 36px 90px rgb(0 0 0 / 48%)` and `0 28px 70px rgb(0 0 0 / 42%)`): separated CCF and warm-paper layers.
- **Evidence panel** (`0 20px 50px rgb(0 0 0 / 38%)`): the foreground CCF clause card.
- **Verdict stamp** (`0 16px 50px rgb(0 0 0 / 40%)`): the circular conclusion above the stack.
- **Mobile menu** (`0 16px 40px rgb(20 35 28 / 14%)`): separation for the floating navigation panel.
- **Evidence dialog** (`0 28px 90px rgb(0 0 0 / 28%)`): the focused question-evidence modal.
- **Range thumb** (`0 1px 4px rgb(20 42 34 / 20%)`): a small contact shadow on the lesson slider handle.

**The Dimensional-Paper Rule.** Reserve deep layered shadows for the Orbit document sculpture and true floating surfaces. Keep forms, disclosures and routine workspace cards flat so the evidence scene remains distinctive.

## Shapes

Workspace controls use gentle 8px corners; selectable options and report subcards use 12px; primary workspace and dialog containers use 16px. Orbit actions use 6px corners and paper layers use 4–5px, preserving the feel of physical sheets rather than generic rounded cards. Circles identify route nodes, completed evidence steps and the verdict stamp.

The brand is a custom geometric G drawn with square line caps and a separate amber evidence dot at its lower-right endpoint. It inherits the surrounding foreground in light or dark navigation. Paper layers use small opposing rotations and clipped overflow; the giant GESP backdrop is clipped by the hero. Keyboard focus remains a 2px Path Green outline offset by 3px.

**The G-Plus-Evidence Rule.** Use the implemented G plus amber evidence-dot mark as the product symbol. Do not substitute the discarded Waypoints route icon or an unrelated academic emblem.

## Components

### Buttons
- **Workspace primary:** Deep Path Green with white text, 8px radius, at least 44px height and a small contact shadow. Hover lightens to Path Green; active scales to 0.98; disabled becomes Quiet Ground with muted text and no shadow.
- **Workspace secondary:** Paper Surface, Deep Ink and Fine Line, with the same target height. Hover adds Path Wash and a green border.
- **Orbit primary:** Theater Text with Theater Action Ink, 6px radius and 48px height; hover becomes white. This inverted action belongs to the dark hero.
- **Orbit secondary:** a translucent dark ground, Theater Text and Theater Line border, 6px radius and 48px height; hover strengthens the border with Evidence Amber.
- **Text:** Path Green evidence links underline on warm surfaces; Evidence Amber or pale green links perform that role on dark panels.

### Inputs / Fields
- **Style:** Paper Surface or Warm Paper, Input Line border, 8px radius, 44–48px minimum height and 12px horizontal padding.
- **States:** hover changes the border to Path Green; keyboard focus uses the global outline. Disabled controls reduce opacity and show an unavailable cursor where implemented.
- **Errors:** Error Red text with a translucent red border and wash, paired with an explicit status or alert message.
- **Search and stepping:** the course workspace combines a searchable lesson field with 48px previous/next buttons; do not replace this with a decorative slider-only picker.

### Cards / Containers
- **Warm workspace:** Paper Surface with Fine Line and 12–16px corners; forms use 20px mobile or 32px small-screen padding and stay flat.
- **Dark summary:** Theater Panel with pale foreground, Evidence Amber metadata and a plain-language estimation or source caveat.
- **Evidence detail:** Quiet Ground groups quoted source text, reasoning and original-page links without adding another floating layer.
- **Learning scene:** Scene Ground and Scene Surface create a warmer archival interlude between the dark hero and task pages.

### Navigation
- **Style:** an 80px header with bottom rule, the G + evidence-dot brand, product name and 14px links. The home header joins the Theater Black stage; other routes use Paper Surface.
- **States:** active routes use Path Wash, Path Green and a 2px underline; inactive home links use Theater Muted and a subtle dark hover wash.
- **Mobile:** a bordered menu button opens an absolute panel with 12px corners, an 8px downward entrance and the mobile-menu shadow. Focus moves to the first link; Escape closes the panel and restores focus.
- **Footer:** Paper Surface with tool links, CCF provenance and the Reacher independent-work disclaimer. Header and footer are hidden for print.

### Orbit Evidence Theater
- **Composition:** three offset paper layers present a real program-reading example, the matching CCF single-loop clause and a circular “纲内” verdict. The oversized GESP backdrop and grid stay subordinate.
- **Controls:** three explicit stage buttons select question, clause and verdict. On non-touch pointers with motion enabled, horizontal position across the scene selects the same stages; touch and reduced-motion users retain direct buttons. Screen-reader text exposes the active evidence through a polite live region.
- **Motion:** entrance offsets, slight tilt, a scan guide, particles, spotlight and animated evidence beams explain the sequence. Ambient effects belong to this hero, not to ordinary task pages.
- **Reduced motion:** remove particles, spotlight, pointer tracking, tilt, scan travel and nonessential entrance movement; stop beam repetition. The course route and viewport reveals elsewhere become immediate. The current stage remains manually selectable; do not claim that the final verdict is automatically opened.
- **Stage feedback:** Evidence Green marks completed steps and Evidence Amber identifies the active proof. The verdict scales and rotates into place only when its stage is selected.

### Course Progress and Learning Evidence
- **Course rail:** four real course stages connect to a green progress line. The selected level becomes a Theater Panel card with pale text and Evidence Amber metadata; unselected options remain warm and bordered.
- **Readiness summary:** a dark panel pairs the recommended GESP level with a large mono course-coverage estimate and the explicit warning that it is not an exam score. The same language appears in the landing example and actual workspace.
- **Learning route:** four numbered course stages reveal once on entry to the viewport. The landing example uses the real Level 1 lesson-12 calculation and sourced course totals, not invented learner data.
- **Evidence panels:** lesson changes and report filters use short TransitionPanel crossfades; reduced-motion hooks remove their travel where supported.

### Analysis Report and Print
- **Identity:** a dark report header records filename, language, target level, page count, question count and syllabus revision; print converts it to white with ink text and ordinary borders.
- **Question evidence:** filter counts, expandable reasoning, score notes, source quotations and original PDF/CCF page links stay together. A morphing dialog can focus one question without losing its evidence.
- **Print action:** the report offers an explicit print button. Interactive form/navigation/filter content is removed, and a print-only list renders every question open so the current on-screen filter cannot hide evidence.
- **Print palette:** white paper, black ink, readable muted text and restrained green/amber roles replace dark panels. Keep model-review and estimation limitations visible in the printable report.

## Do's and Don'ts

### Do:
- **Do** preserve warm paper, ink and Path Green in workspaces, with the dark Orbit theater reserved for evidence storytelling and meaningful summaries.
- **Do** use the Geist/PingFang display sans stack and mono tabular figures for levels, pages, counts and estimates.
- **Do** build dimensional depth from actual question, clause and verdict documents, with reduced-motion and direct-control alternatives.
- **Do** keep the G + evidence-dot brand, real CCF sources and estimation limits beside the conclusions they qualify.
- **Do** print the complete report with every question expanded and the interactive workflow removed.
- **Do** use small mono metadata only when it identifies a real stage, source or status; it is optional rather than a required kicker on every section.

### Don't:
- **Don't** reintroduce decorative serif headlines, the old Waypoints symbol or a generic education-dashboard hero.
- **Don't** flatten the Orbit document stack into an unrelated card grid or carry its ambient effects into routine forms and reports.
- **Don't** make animation, pointer tracking or a kicker/eyebrow mandatory for understanding or operating the interface.
- **Don't** use heavy glass styling as a system requirement; the shipped translucency is limited to specific dark-scene controls and panels.
- **Don't** present a course-coverage estimate as an actual exam score or guaranteed pass rate.
- **Don't** invent testimonials, performance claims, customer counts or CCF endorsement in visual content.
