<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# GESP 考试规划助手 - Project Guide

## Project Overview

This is a Next.js web application for **五个奶爸少儿编程** (Five Dads Kids Programming), a programming education platform. The app serves as a **GESP Exam Planning Assistant** that helps educational managers evaluate which GESP (Grade Examination of Software Programming) level students are ready for based on their course progress.

**Application Purpose:**
- Input: Student's current course level (Level 1-4) and lesson progress
- Output: Pass probability predictions for all 8 GESP exam levels
- Features: Knowledge point analysis, study path visualization, exam recommendations

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.0 | React framework with App Router |
| React | 19.2.4 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| Lucide React | 0.577.0 | Icon library |
| Geist | - | Vercel's font family |

**Important:** This project uses **Next.js 16** which has significant breaking changes from earlier versions. Always refer to the in-package documentation at `node_modules/next/dist/docs/` when implementing new features.

## Project Structure

```
app/
├── components/              # React components (all Client Components)
│   ├── ExamPrediction.tsx   # GESP pass probability visualization
│   ├── Header.tsx           # Navigation header with logo
│   ├── KnowledgeAnalysis.tsx # Knowledge point mastery analysis
│   ├── LevelSelector.tsx    # Course level/lesson selection UI
│   └── StudyPath.tsx        # 4-level study path visualization
├── data/
│   └── curriculum-data.ts   # Core data: 95 lessons, 100+ knowledge points
├── types/
│   └── index.ts             # TypeScript interface definitions
├── favicon.ico
├── globals.css              # Tailwind v4 imports + theme variables
├── layout.tsx               # Root layout with Geist font
└── page.tsx                 # Main page (Client Component)

public/                      # Static assets
├── logo.png                 # Five Dads brand logo
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
// 4 course levels, 95 lessons total
const courseInfo = {
  levels: [
    { id: 1, name: "Level 1", totalLessons: 24, targetGesp: "1-2级" },
    { id: 2, name: "Level 2", totalLessons: 24, targetGesp: "3-4级" },
    { id: 3, name: "Level 3", totalLessons: 24, targetGesp: "5-6级" },
    { id: 4, name: "Level 4", totalLessons: 23, targetGesp: "7-8级" },
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

Currently, this project has no automated tests configured. To add testing:

1. Install testing dependencies (Jest, React Testing Library, or Playwright)
2. Test key functions in `curriculum-data.ts`:
   - `calculatePassProbability` edge cases
   - `getRecommendedExam` boundary conditions
3. Component testing for interactive UI elements

## Deployment

The project is designed for deployment on **Vercel** (creators of Next.js):

1. Connect GitHub repo to Vercel
2. Build command: `next build`
3. Output directory: `.next`
4. Environment: Node.js 18+

## Security Considerations

- No sensitive data in client-side code (all curriculum data is public)
- No API routes or server-side data handling
- No authentication required (public tool)
- Static export compatible (`output: 'export'` can be added to `next.config.ts`)

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
