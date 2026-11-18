<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# GESP 考级宝 - Project Guide

## Project Overview

Reacher's independent C++ GESP syllabus and paper assessment tool covers levels 1–8. The public authorship is Reacher. The home page is a detailed landing page, `/syllabus` browses CCF clauses, `/analyze` reviews exams, and `/plan` maps original course lessons to CCF clauses.

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.4.x | React framework with App Router |
| React | 19.3.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| ReUI / shadcn | registry sources | Landing Tabs, Stepper, Timeline, Card, Accordion and status primitives |
| Lucide React | 0.577.0 | Icon library |
| Geist | - | Vercel's font family |

**Important:** This project uses **Next.js 16** which has significant breaking changes from earlier versions. Always refer to the in-package documentation at `node_modules/next/dist/docs/` when implementing new features.

## Project Structure

```
app/
├── components/              # React components (all Client Components)
│   ├── ExamPrediction.tsx   # GESP readiness visualization
│   ├── Header.tsx           # Product navigation
│   ├── KnowledgeAnalysis.tsx # Knowledge point mastery analysis
│   ├── LevelSelector.tsx    # Course level/lesson selection UI
│   ├── StudyPath.tsx        # 4-level study path visualization
│   ├── landing/             # ReUI landing sections, level path and analysis demo
│   └── ui/                  # Reviewed shadcn primitives used by the landing page
├── data/
│   ├── cpp-lessons.ts       # Original courseware lessons, sources and CCF mappings
│   └── curriculum-data.ts   # Legacy course/knowledge data
├── types/
│   └── index.ts             # TypeScript interface definitions
├── syllabus/
│   └── page.tsx             # Official C++ syllabus browser
├── favicon.ico
├── globals.css              # Tailwind v4 imports + theme variables
├── layout.tsx               # Root layout with Geist font
└── page.tsx                 # Landing page and legacy syllabus redirect

components/
└── reui/                    # Reviewed ReUI Stepper, Timeline, Alert and Badge sources

public/                      # Static assets
└── *.svg                    # Next.js/Vercel default icons
```

## Build and Development Commands

```bash
# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint with ESLint
npm run lint
```

## Code Style Guidelines

### Component Patterns

**All components are Client Components** - the entire app uses client-side interactivity:

```typescript
"use client";

import { useState } from "react";

export default function ComponentName() {
  // Component logic
}
```

### Styling Conventions

- Use **Tailwind CSS** utility classes exclusively
- Color scheme: `slate` for neutrals, `blue` for primary actions, `emerald/amber` for status
- Spacing scale: consistent use of `p-4`, `gap-4`, `rounded-xl`, etc.
- Responsive: `md:` and `lg:` prefixes for breakpoints

### File Organization

1. Imports: React hooks first, then components, then data/utils
2. Types: Define props interfaces above component
3. Component logic before JSX
4. Use semantic HTML with Tailwind classes

### Naming Conventions

- Components: PascalCase (e.g., `LevelSelector.tsx`)
- Functions: camelCase (e.g., `calculatePassProbability`)
- Types/Interfaces: PascalCase with descriptive names
- CSS classes: Tailwind utilities (no custom CSS)

## Data Architecture

The core data lives in `app/data/curriculum-data.ts`:

### Key Data Structures

```typescript
// 4 course levels, 96 lessons total
const courseInfo = {
  levels: [
    { id: 1, name: "Level 1", totalLessons: 24, targetGesp: "1-2级" },
    { id: 2, name: "Level 2", totalLessons: 24, targetGesp: "3-4级" },
    { id: 3, name: "Level 3", totalLessons: 24, targetGesp: "5-6级" },
    { id: 4, name: "Level 4", totalLessons: 24, targetGesp: "7-8级" },
  ]
};

// 100+ knowledge points across 8 GESP levels
const gespKnowledgePoints: Record<number, KnowledgePoint[]> = {
  1: [/* GESP Level 1 points */],
  2: [/* GESP Level 2 points */],
  // ... up to level 8
};
```

### Core Functions

- `getMasteredKnowledge(level, lesson)` - Returns Set of mastered knowledge point IDs
- `calculatePassProbability(level, lesson)` - Returns pass probability % for each GESP level (1-8)
- `getRecommendedExam(level, lesson)` - Returns optimal exam level with 70-95% pass probability
- `groupKnowledgeByCategory(points)` - Groups knowledge points by category

## Testing Strategy

Run `bun test tests` for the C++ catalog, paper layout, scoring and verdict regressions. Additional testing ideas:

1. Install testing dependencies (Jest, React Testing Library, or Playwright)
2. Test key functions in `curriculum-data.ts`:
   - `calculatePassProbability` edge cases
   - `getRecommendedExam` boundary conditions
3. Component testing for interactive UI elements

## Deployment

Cloudflare Workers hosts production. The `gesp` Worker uses `cloudflare.config.ts` and the vinext adapter. Build with `npm run build:vinext`, preview the output with `npm run start:vinext`, and deploy with `npm run deploy:vinext`. Store `DEEPSEEK_API_KEY` as a Worker secret. The build scripts prepare versioned PDF assets for static delivery.

## Security Considerations

- No sensitive data in client-side code (all curriculum data is public)
- Only the server calls the model provider using DEEPSEEK_API_KEY
- No authentication required (public tool)
- Run the Next.js server for PDF assets and paper analysis.

## Development Notes

### Tailwind CSS v4 Configuration

Uses new v4 syntax in `globals.css`:
```css
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --font-sans: var(--font-geist-sans);
}
```

### TypeScript Path Aliases

Configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### ESLint Configuration

Uses new flat config format (`eslint.config.mjs`) with Next.js presets:
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`

## Adding New Features

When implementing new features:

1. Check Next.js 16 docs in `node_modules/next/dist/docs/` for API changes
2. Maintain the existing component structure under `app/components/`
3. Add new data types to `app/types/index.ts`
4. Extend curriculum data in `app/data/curriculum-data.ts` if needed
5. Follow existing styling patterns with Tailwind CSS
6. Keep components as Client Components (`"use client"`) for interactivity

## Language and Localization

The application is in **Simplified Chinese (zh-CN)**:
- UI labels, buttons, and descriptions are in Chinese
- Comments in code can be in English or Chinese
- The target audience is Chinese educational managers and parents
