---
name: GESP 考级宝
description: 以可追溯考纲、试卷分析与课程进度组织备考路径。
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
typography:
  display:
    fontFamily: "var(--font-geist-sans), 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "76px"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "var(--font-geist-sans), 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "36px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.03em"
  workspace-heading:
    fontFamily: "var(--font-geist-sans), 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "44px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.03em"
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
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "44px"
    width: "100%"
  level-option-selected:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.ink}"
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

**Creative North Star: "备考路径图"**

GESP 考级宝 is a quiet, traceable preparation map rather than a generic education dashboard. A warm-neutral paper ground, deep ink type, path-green actions and restrained amber current-stage markers connect syllabus lookup, paper analysis and course-progress estimates into one evidence chain. Fine rules, route segments, level ticks and tabular figures make the interface feel measured and inspectable.

Landing pages explain and route; workspaces prioritize the current task. Both use the same material language. Motion is brief and purposeful: selection moves a marker or crossfades evidence, sections reveal once, and the route draws once on entry. Reduced-motion preferences remove these transitions.

**Key Characteristics:**
- Warm paper and quiet tonal surfaces instead of a glossy SaaS canvas.
- Path-green actions and links; amber reserved for current-stage or numbered progress cues.
- Medium-weight Chinese typography with compact, tabular level and progress figures.
- Fine 1px dividers and route geometry provide structure before shadows.
- Short transform/opacity transitions with explicit reduced-motion behavior.

## Colors

The palette is botanical and archival: green supplies direction, amber supplies position, and warm neutrals keep dense educational material readable.

### Primary
- **Path Green** (`brand`): evidence links, active navigation, progress, selected states and icon accents.
- **Deep Path Green** (`action`): primary buttons and decisive actions; hover returns to Path Green.
- **On-Brand White** (`on-brand`): text on dark green actions.

### Secondary
- **Current Amber** (`current`): the active level node and current-stage marker.
- **Current Umber** (`current-text`): readable amber-adjacent text where needed.
- **Current Ink** (`on-current`): dark text on the amber node.

### Tertiary
- **Error Red** (`destructive`): destructive messaging and analysis errors only.

### Neutral
- **Warm Paper** (`paper`): the page ground.
- **Paper Surface** (`surface`): cards, navigation, fields and footer.
- **Deep Ink** (`ink`): primary text and dark editorial bands.
- **Muted Graphite** (`muted`): supporting copy and inactive figures.
- **Fine Line** (`line`) and **Input Line** (`input`): dividers and control strokes.
- **Path Wash** (`wash`) and **Quiet Ground** (`quiet`): selected and secondary tonal regions.
- **Selection Mint** (`selection`): text selection only.

**The Path-Green Rule.** Path green carries actions, active navigation, evidence links and progress. Amber marks the current stage or numbered progress cue; it is not a general decorative accent.

## Typography

**Display / Body Font:** Geist Sans through the project font variable, with PingFang SC and Microsoft YaHei fallbacks.
**Label / Data Font:** Geist Mono through the project font variable, with monospace fallback; figures use tabular numerals.

**Character:** Straightforward Chinese reading with editorial headline spacing. The contrast comes from scale and alignment, not heavy weights or decorative type.

### Hierarchy
- **Display** (500, 44px mobile / 64px small / 76px large, 1.08): the left-aligned landing promise, tightly tracked and balanced.
- **Headline** (500, 30px mobile / 36px small, 1.25): section headings.
- **Workspace Heading** (500, 32px mobile / 44px large, 1.2): task workspace titles and report headings.
- **Title** (500, 18–24px): tool names, panel headings and selected-level evidence.
- **Body** (400, 14–18px, 1.75–2): explanations, sources and controls; long prose remains width-constrained.
- **Label** (500, 14px): buttons, navigation and form labels.
- **Data** (400, 11–48px by context): mono level numbers, counts and percentages with tabular figures.
- **Micro** (400, 11px): brand bylines, compact status text and secondary metadata.

**The Medium-Weight Rule.** Headings and controls use weight 500; body copy stays at 400. Use size, spacing and ink contrast—not heavier display type—to establish hierarchy.

## Layout

The shared shell reaches a maximum of 1440px, with 20px mobile, 32px small-screen and 48px large-screen horizontal padding. Landing content commonly narrows to 1344px. Header height is at least 80px; major landing sections use 80px vertical padding, increasing to 96px on small screens.

The hero becomes a 0.88fr / 1.12fr two-column composition at 1024px. Paper analysis uses a 1.65fr / 0.85fr form-and-evidence grid at the same breakpoint, with the evidence aside sticky. Main navigation appears at 768px; below that, a bordered menu opens a floating panel. Cards and tool columns stack before they split. Mobile keeps controls full-width or wrapped rather than compressing labels.

## Elevation & Depth

The system is flat by default. Tonal washes, surface changes and fine borders establish most hierarchy; shadows identify only a small set of interactive or floating objects.

### Shadow Vocabulary
- **Primary rest** (`0 1px 2px rgb(20 42 34 / 12%)`): subtle contact under primary buttons; removed when disabled.
- **Path card** (`0 20px 60px rgb(27 48 41 / 8%)`): broad, faint lift under the signature level map.
- **Mobile menu** (`0 16px 40px rgb(20 35 28 / 14%)`): separation for the floating navigation panel.
- **Range thumb** (`0 1px 4px rgb(20 42 34 / 20%)`): a small contact shadow on the lesson slider handle.

**The Flat-By-Default Rule.** Most surfaces are separated by 1px lines and tonal washes. Reserve shadows for primary-button rest, the floating mobile menu and the interactive path card.

## Shapes

Controls use gently rounded 8px corners; selectable course cards use 12px; workspace cards and the level map use 16px. Circular geometry is reserved for level nodes, current markers, step numbers and progress tracks. Borders are normally 1px Fine Line, shifting to Path Green on hover or selection.

The signature silhouette is a routed line with rounded turns connecting eight numbered nodes. Clipping is used for overflow at card and progress boundaries, not for decorative image masks. Focus is always visible as a 2px Path Green outline offset by 3px.

## Components

### Buttons
- **Shape:** gently curved (8px), at least 44px high, with 14px medium-weight labels.
- **Primary:** Deep Path Green with white text, a small contact shadow and 10px / 20px vertical / horizontal padding. Hover lightens to Path Green; active scales to 0.98; disabled becomes Quiet Ground with muted text and no shadow.
- **Secondary:** Paper Surface, Deep Ink and a Fine Line border. Hover adds Path Wash and a green border; active uses the same restrained compression.
- **Text:** Path Green evidence links underline on hover; compact steppers may be 40px.

### Inputs / Fields
- **Style:** Paper Surface, Input Line border, 8px radius, 44px minimum height and 12px horizontal padding.
- **States:** hover changes the border to Path Green; keyboard focus uses the global outline. Errors pair Error Red text with a translucent red border and wash.
- **Range:** a 4px track and 16px round green thumb control lesson progress; hover scale is limited to fine pointers.

### Cards / Containers
- **Style:** Paper Surface with Fine Line and 16px corners; forms use 20px mobile or 32px small-screen padding.
- **Depth:** static workspace cards remain flat. Only the interactive path card receives the broad path-card shadow.
- **Evidence regions:** Quiet Ground or Path Wash separates supporting detail without adding another floating layer.

### Navigation
- **Style:** an 80px Paper Surface header with a bottom rule, compact route-mark brand and 14px links.
- **States:** the active route uses Path Wash, Path Green and a 2px underline; inactive links use Muted Graphite and gain Quiet Ground on hover.
- **Mobile:** a bordered menu button opens an absolute Paper Surface panel with 12px corners, an 8px downward entrance and the mobile-menu shadow. Escape closes it and restores focus.

### Level Path
- **Structure:** eight mono-numbered nodes follow a routed line; selection fills the active node with Current Amber and moves an outer current ring.
- **Evidence:** the lower Quiet Ground panel crossfades the real level title, topic count, examples and syllabus link with an 8px vertical shift over 200ms.
- **Motion:** the route draws once over 1.2s; the current marker moves over 250ms. Reduced motion makes both immediate.

### Course Level Options
- **Style:** 12px bordered option cards with a 112px minimum height, course name, description and target GESP range.
- **Selected:** Path Wash, Path Green border and a small moving green dot. Unselected options remain Paper Surface.

### Readiness Rows
- **Structure:** level and status, a 6px rounded progress track, then a right-aligned tabular percentage.
- **Recommended:** Path Wash and a Current Amber border. Green bars begin at 50%; lower values use Fine Line. The nearby recommendation panel is Path Wash with a large mono estimate and an explicit estimation disclaimer.

### Study Path Stages
- **Structure:** four stages aligned to a fine horizontal route on large screens, with circular green-outlined numbers and concise topic checklists.
- **Responsive:** stages become two columns on small screens and stack with dividers on narrow screens; the decorative route disappears below 1024px.

### ReUI Landing System
- **Sources:** reviewed registry code lives in `components/reui/` and `app/components/ui/`; product composition stays in `app/components/landing/`.
- **Workspace:** the hero uses a deep-ink interactive preview with light foreground, muted sage supporting copy, fine green borders and amber current-level markers. `selection-ink` (`#172a24`) is reserved for text on Selection Mint.
- **Navigation and disclosure:** Tabs switch real syllabus, analysis and planning previews; Accordion presents frequently asked questions; Stepper and Timeline are visitor-controlled demonstrations, never saved learner progress.
- **Content containers:** Card, Alert, Badge, Progress and ButtonGroup organize real tool capabilities, source notes, course-coverage estimates and route actions. Small ReUI details may use the documented 2px or 4px radius; primary controls keep 8px and content cards keep 16px.
- **Responsive:** Stepper stays vertical, dense timelines scroll inside their own region, and every grid child has a bounded minimum width. Mobile must not introduce document-level horizontal overflow.

## Do's and Don'ts

### Do:
- **Do** keep actions, evidence links and active progress in Path Green, with amber reserved for current or numbered progress cues.
- **Do** use mono tabular figures for level numbers, topic counts, lesson counts and estimates.
- **Do** keep real sources, scope and estimation limits beside the conclusions they qualify.
- **Do** preserve the 2px offset focus outline and reduced-motion alternatives on every interactive pattern.
- **Do** let fine dividers and tonal regions carry structure before adding a shadow.

### Don't:
- **Don't** replace the warm paper, ink and path-green palette with generic saturated SaaS colors.
- **Don't** use heavy headline weights, decorative serif type or non-tabular progress figures.
- **Don't** add ambient animation loops; the route draws once and state transitions stay short.
- **Don't** present a course-coverage estimate as an actual exam score or guaranteed pass rate.
- **Don't** invent testimonials, performance claims, customer counts or CCF endorsement in visual content.
