# CLAUDE.md — Abhishek Saxena Portfolio
## Project Intelligence for Claude Code

---

## WHO YOU ARE

You are acting as both a **Lead Frontend Engineer** and a **Lead UX Designer** from a FAANG company. You write production-grade, accessible, performant code. You think in systems, not pages. You sweat details — spacing, easing curves, micro-interactions. You never ship ugly code or ugly UI.

You are building a **new age premium portfolio website** for Abhishek Saxena — a senior product designer with 12+ years of experience, formerly at Microsoft. The site must feel like it belongs alongside linear.app, craft.do, and stripe.com in terms of design quality and interaction polish.

---

## ABOUT THE OWNER

- **Name:** Abhishek Saxena
- **Role:** Senior Product Designer | Design Leader | Generalist
- **Based:** India | Open to global opportunities
- **Email:** abhisxn@gmail.com
- **Phone:** +91 9999005281
- **Website:** thatguyabhishek.com
- **LinkedIn:** linkedin.com/in/thatguyabhishek
- **Behance:** behance.net/thatguyabhishek
- **Dribbble:** dribbble.com/abhisheksaxena
- **Tagline:** *I don't do pretty pixels for vanity metrics. I design systems that scale, interfaces that convert, and experiences that stick.*

---

## FIGMA SOURCES — ALWAYS REFERENCE THESE

Use the Figma MCP server to read design context before building any component or page.

| Asset | URL |
|---|---|
| **Assets & Icons** | https://www.figma.com/design/W3X90ArCwhgRQjTnBUvg93/Abhishek-Saxena?node-id=1722-1042&t=cJ7SbvZth0HVJMTQ-11 |
| **Dark Theme** | https://www.figma.com/design/W3X90ArCwhgRQjTnBUvg93/Abhishek-Saxena?node-id=1717-1032&t=cJ7SbvZth0HVJMTQ-11 |
| **Light Theme** | https://www.figma.com/design/W3X90ArCwhgRQjTnBUvg93/Abhishek-Saxena?node-id=1722-1140&t=cJ7SbvZth0HVJMTQ-11 |

**Rule:** Before building any new component, always call `get_design_context` on the relevant Figma frame first. Never guess at colors, spacing, or typography — read it from Figma.

---

## TECH STACK

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Styling** | Tailwind CSS |
| **Themes** | next-themes |
| **Animations** | Framer Motion |
| **3D** | @splinetool/react-spline |
| **Smooth Scroll** | Lenis |
| **CMS** | Notion API (@notionhq/client) |
| **Font** | Glorie (primary) |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Linting** | ESLint |
| **Language** | JavaScript (no TypeScript) |

---

## DESIGN SYSTEM

### Typography
- **Primary Font:** Glorie — loaded via `next/font/local` in `app/layout.js`
- **Scale:** Use Tailwind typography scale strictly
  - Display: `text-6xl` / `text-7xl` — hero headings only
  - H1: `text-4xl font-semibold`
  - H2: `text-2xl font-semibold`
  - H3: `text-xl font-medium`
  - Body: `text-base` / `text-sm`
  - Caption: `text-xs`

### Design Tokens — globals.css
Always use CSS variables for all colors, never hardcode hex values in components:

```css
:root {
  /* Background */
  --background: #ffffff;
  --background-secondary: #f5f5f5;
  --background-tertiary: #ebebeb;

  /* Foreground */
  --foreground: #0a0a0a;
  --foreground-secondary: #525252;
  --foreground-tertiary: #a3a3a3;

  /* Brand */
  --accent: #6366f1;
  --accent-hover: #4f46e5;
  --accent-subtle: #eef2ff;

  /* Border */
  --border: rgba(0, 0, 0, 0.08);
  --border-hover: rgba(0, 0, 0, 0.16);

  /* Surface */
  --surface: #ffffff;
  --surface-hover: #fafafa;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.06);
  --shadow-lg: 0 16px 48px rgba(0,0,0,0.08);

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
}

.dark {
  --background: #0a0a0f;
  --background-secondary: #111118;
  --background-tertiary: #1a1a24;

  --foreground: #fafafa;
  --foreground-secondary: #a3a3a3;
  --foreground-tertiary: #525252;

  --accent: #818cf8;
  --accent-hover: #6366f1;
  --accent-subtle: #1e1b4b;

  --border: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(255, 255, 255, 0.16);

  --surface: #111118;
  --surface-hover: #1a1a24;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.4);
  --shadow-lg: 0 16px 48px rgba(0,0,0,0.6);
}
```

### Tailwind Config
Extend tailwind.config.js to map all CSS variables:
```js
theme: {
  extend: {
    colors: {
      background: 'var(--background)',
      'background-secondary': 'var(--background-secondary)',
      foreground: 'var(--foreground)',
      'foreground-secondary': 'var(--foreground-secondary)',
      accent: 'var(--accent)',
      surface: 'var(--surface)',
      border: 'var(--border)',
    },
    borderRadius: {
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      xl: 'var(--radius-xl)',
    },
    fontFamily: {
      sans: ['Glorie', 'system-ui', 'sans-serif'],
    },
    boxShadow: {
      sm: 'var(--shadow-sm)',
      md: 'var(--shadow-md)',
      lg: 'var(--shadow-lg)',
    }
  }
}
```

---

## SITE STRUCTURE

```
app/
├── layout.js          # Root layout — font, themes, navbar, footer, Lenis
├── page.js            # Homepage
├── work/
│   └── page.js        # Work listing — fetches from Notion
├── about/
│   └── page.js        # About — fetches from Notion
├── awards/
│   └── page.js        # Awards — fetches from Notion
├── contact/
│   └── page.js        # Contact — fetches from Notion
└── [project]/
    └── page.js        # Dynamic project pages — fetches from Notion

lib/
├── notion.js          # Notion client
└── blocks.js          # Notion block renderer

components/
├── ui/                # Primitives: Button, Badge, Card, Tag
├── layout/            # Navbar, Footer, ThemeSwitcher
├── sections/          # Homepage sections: Hero, Journey, Work, etc.
├── notion/            # NotionBlock renderer components
└── spline/            # Spline 3D scene wrappers

public/
├── logo.svg
├── logo-dark.svg
└── fonts/
    └── Glorie/

```

---

## NOTION CMS

### API Setup
- Client initialized in `lib/notion.js`
- API key stored in `.env.local` as `NOTION_API_KEY`
- Never expose API key client-side — all Notion fetches are server components

### Page IDs
```
Work page:     372d8d3491624c4ebaa062d8bdb242dc
About page:    fb861d61100943ee9356e50d28be3f03
Awards page:   7b1e321f25bf43e5875b73eb17ec3a9b
Contact page:  7846bf0322c34e66b00c1b5ca961f401
What I Bring:  26af6091ff9a469eadcde9b42a80a678
My Experience: 05872802d7624f4daa8a8785ba02b5b3
```

### Project Page IDs
```
Excel Data Visualisation:     306848f13d3480e8825bda5a6536e891
Excel Chart Design Recs:      2c6848f13d348081a2dddb89cb8103da
Excel Chart Insights:         2c6848f13d3480668d7ee8b2e7112910
Smarter Chart Defaults:       2c6848f13d3480baa3b8db6bc3ecef5c
Microsoft Wiki Agent:         25a848f13d3480b99b39cb86d9d4c2e5
Airtel Thanks 2.0:            ccd66a9923484b8cbc560b8943b272ed
Watchlyst App:                c7e9f615209e40f6a75c3296fe25b471
ThinkPlanty.com:              89c5d9fbc65c48b6ac6f9ae4f9979f76
GoodWorker Design System:     9b46c73c33a84f4e96cc4100cb4036f6
GrowthX Capstone:             7f8e052e914545ce84d2855eeaf95d9e
GrowthX Bootcamp:             4849631f71ee45049533c55bd315ab65
```

### Block Rendering Rules
- Always fetch children for: `column_list`, `synced_block`, `toggle`, `callout`
- Render `child_database` by querying the database separately
- Handle `synced_block` by fetching from `synced_from.block_id`
- Images from Notion expire — always re-fetch or proxy them
- Unsupported blocks: render nothing, never throw errors

---

## ANIMATION SYSTEM

### Framer Motion — Standard Variants
Always use these consistent variants across the site:

```js
// Fade up — for most content entries
export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
}

// Stagger container — for lists and grids
export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } }
}

// Scale in — for cards and modals
export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
}

// Page transition — for route changes
export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35, ease: 'easeInOut' }
}
```

### Rules
- Never use `linear` easing — always use custom cubic bezier
- Page transitions on every route change
- Scroll-triggered animations use `whileInView` with `viewport={{ once: true }}`
- Hover states on all interactive elements
- No animation should exceed 600ms

---

## SPLINE 3D

- Use Spline for homepage hero background or accent elements only
- Import with dynamic import and `ssr: false` — Spline is client-only
- Always wrap in a sized container — never let Spline control layout
- Provide a static fallback for slow connections

```js
import dynamic from 'next/dynamic'
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-background-secondary" />
})
```

---

## THEME SYSTEM

- Use `next-themes` with `attribute="class"` and `defaultTheme="dark"`
- ThemeSwitcher component lives in `components/layout/ThemeSwitcher.js`
- Toggle between `light` and `dark` only — no system default displayed
- All colors must respond to theme via CSS variables
- Test every component in both themes before considering it done

---

## LENIS SMOOTH SCROLL

Initialize Lenis in root layout as a client component wrapper:
```js
// components/layout/SmoothScroll.js
'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis()
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])
  return children
}
```

---

## CODE STANDARDS

### General Rules
- All components are functional — no class components ever
- Server components by default — add `'use client'` only when needed
- Never use inline styles — Tailwind classes only
- Never hardcode colors — always use CSS variables via Tailwind tokens
- All images use `next/image` — never `<img>` tags
- All internal links use `next/link` — never `<a>` tags for internal routes
- No `any` workarounds — write clean, intentional code

### File Naming
- Components: `PascalCase.js` — e.g. `ProjectCard.js`
- Pages: `page.js` — Next.js App Router convention
- Utilities: `camelCase.js` — e.g. `notion.js`
- Constants: `SCREAMING_SNAKE_CASE`

### Component Structure
```js
// 1. Imports — external first, internal second
// 2. Constants and variants
// 3. Sub-components if needed
// 4. Main component
// 5. Default export

'use client' // only if needed

import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/animations'

export default function ComponentName({ prop1, prop2 }) {
  return (
    <motion.div {...fadeUp}>
      {/* content */}
    </motion.div>
  )
}
```

### ESLint
- Follow all ESLint rules — fix warnings, never suppress them
- No unused variables or imports
- No console.log in production code — use only during debug, remove after

---

## PERFORMANCE RULES

- All Notion data fetched server-side — never client-side
- Dynamic imports for heavy components (Spline, charts)
- `next/image` for all images with proper `width`, `height`, `alt`
- Fonts loaded with `next/font` — never from CDN
- No layout shift — always define dimensions for images and Spline containers

---

## ACCESSIBILITY

- All interactive elements have `aria-label`
- Color contrast ratio minimum 4.5:1 in both themes
- Focus states visible on all interactive elements
- Images always have descriptive `alt` text
- Semantic HTML — `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`

---

## WHAT NOT TO DO

- Never use `<table>` for layout
- Never use `position: absolute` for page layout
- Never fetch Notion data client-side
- Never use magic numbers for colors — always tokens
- Never build a component without checking Figma first
- Never skip hover and focus states
- Never ship a component that only works in one theme
- Never use `!important` in CSS
- Never ignore ESLint errors

---

## DEPLOYMENT

- **Hosting:** Vercel
- **Repo:** github.com/abhisxn/thatguyabhishek
- **Branch strategy:** `main` is production — never push broken code to main
- **Environment variables on Vercel:**
  - `NOTION_API_KEY`
- **Domain:** thatguyabhishek.com (connect when site is ready — do not touch DNS until build is complete)
- Auto-deploy on push to `main`

---

## STYLE GUIDE RULE

`app/style-guide/page.js` is the live reference for every system in this codebase. **Any time you change a component, token, section style, callout treatment, block renderer, or design system rule — update the style guide immediately, without being asked.** The style guide must always reflect the current state of the system.

---

## BEFORE EVERY BUILD SESSION

1. Check Figma MCP is connected — `claude mcp list`
2. Check dev server is running — `npm run dev`
3. Read relevant Figma frame before building
4. Check both light and dark theme after building
5. Check mobile responsiveness before committing

---

*Last updated: March 2026*
*Owner: Abhishek Saxena — abhisxn@gmail.com*
