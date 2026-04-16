# Interaction Card System — Design Spec
**Date:** 2026-04-16  
**Scope:** About page card refactor + Article page "More Writing" cards + unified interaction card library  
**Status:** Approved — ready for implementation plan

---

## Problem

Card interaction logic is currently duplicated across three files with no shared source of truth:

| File | Inline card components |
|---|---|
| `app/about/AboutClient.js` | `WritingCard`, `ThinkingFlipCard`, `WhatIBringCard`, `NumberedCard` |
| `app/beyond-demo/page.js` | `FlipCard`, `MagneticCard`, `SpotlightCard`, `CurtainCard`, `ElasticGrid`, `SubtleCard`, `SweepCard`, `OutlineCard` |
| `app/writing/[slug]/_parts.js` | `MiniArticleCard` |

`beyond-demo` was built as a prototype sandbox but never promoted to a reusable library. `AboutClient.js` has diverged implementations of patterns that exist in `beyond-demo`. The two WritingCard implementations (`WritingCard` in AboutClient and `MiniArticleCard` in _parts.js) are functionally identical with minor style drift.

---

## What Is NOT Changing

The existing content/callout card system is untouched:

- `components/ui/Card.js` — Notion-driven content card (size × cardStyle matrix)
- `components/ui/card-utils.js` — CARD_SIZES, CARD_STYLES, CALLOUT_BG, styleForNotion — server-importable, no client boundary
- `components/sections/ProjectCard.js` — thin Notion data resolver over Card
- `components/sections/NotionBlocks.js` — callout renderer consuming card-utils

These serve a different purpose (Notion-data-driven rendering with image, tags, CTA) and must not be merged with the interaction card system. Merging would force client-side imports into the server-importable `card-utils.js`.

---

## Solution: `components/ui/interaction-cards/`

A new directory becomes the single source of truth for all hover-interaction card variants. Every consumer imports from here.

### Directory structure

```
components/ui/interaction-cards/
  index.js          re-exports all components
  FlipCard.js       
  WritingCard.js    
  SkillGroupCard.js 
  GlassGlareCard.js 
  OutlineCard.js    
  MagneticCard.js   
  SpotlightCard.js  
  CurtainCard.js    
  ElasticGrid.js    
  SweepCard.js      
```

All files are `'use client'` (they use Framer Motion / React state).

### index.js

Re-exports everything so consumers can do:
```js
import { FlipCard, WritingCard, SkillGroupCard } from '@/app/components/ui/interaction-cards';
```

---

## Component Specs

### FlipCard

**Consumers:** What I'm Thinking (About), Beyond the Work (About), 5 Things I Bring (About), beyond-demo showcase

**Replaces:**
- `ThinkingFlipCard` in `AboutClient.js`
- `NumberedCard` in `AboutClient.js`
- `WhatIBringCard` in `AboutClient.js` (entire ~80-line Glass Glare implementation deleted)
- `FlipCard` in `beyond-demo/page.js`

**Props:**
```js
FlipCard({
  num,            // string  — "01", "02" — coral number label
  title,          // string  — front face dominant text
  body,           // string  — back face body copy
  titleSize,      // "default" | "lg"  — default: t-h5; lg: t-h4 (used by 5 Things I Bring)
  minHeight,      // number  — default 280
  index,          // number  — used for stagger delay in whileInView (optional)
})
```

**Front face:**
- Background: `var(--surface)`, border: `1px solid var(--border)`
- Layout: `flexDirection: column`, `justifyContent: space-between`
- Top: coral number (`t-caption tabular-nums font-bold`, `letter-spacing: 0.08em`, `color: var(--color-coral)`)
- Middle: title — `t-h5` (default) or `t-h4` (lg), `color: var(--fg)`, `flex: 1`
- Bottom: subtle hint — "hover to read", `t-caption`, `color: var(--fg-muted)`, `opacity: 0.5`

**Back face:**
- Background: `var(--bg-solid)` (neutral dark — dark in both themes, no color tint)
- Border: `1px solid color-mix(in srgb, var(--fg) 10%, transparent)`
- Layout: `flexDirection: column`, `gap: 16`
- Top: coral number (same as front)
- Body: `t-body2`, `color: var(--fg)`, `lineHeight: 1.75`

**Interaction:**
- CSS `transform: rotateY` with `transition: 0.55s cubic-bezier(0.22,1,0.36,1)` — no Framer for the flip
- `onMouseEnter` / `onMouseLeave` (+ `onClick` for mobile toggle) set `flipped` state
- `perspective: 1000px` on wrapper, `transformStyle: preserve-3d` on inner, `backfaceVisibility: hidden` on both faces
- Entry animation: `m.div` with `initial={{ opacity:0, y:24, filter:'blur(12px)' }}` `whileInView={{ opacity:1, y:0, filter:'blur(0px)' }}` `viewport={{ once:true, margin:'-40px' }}` — matches current ThinkingFlipCard behavior

**Usage on About page:**
- What I'm Thinking: `titleSize="default"`, `minHeight={280}`, 2×4 grid
- Beyond the Work: `titleSize="default"`, `minHeight={220}`, 2×2 grid
- 5 Things I Bring: `titleSize="lg"`, `minHeight={280}`, 3+2 grid layout

---

### WritingCard

**Consumers:** About writing section (4-col grid), Article page "More Writing" (auto-fill grid)

**Replaces:**
- `WritingCard` in `AboutClient.js`
- `MiniArticleCard` in `app/writing/[slug]/_parts.js`

**Props:**
```js
WritingCard({
  article,        // { emoji, title, desc, href }
  showDesc,       // boolean — default true; false on article page compact variant
  equalHeight,    // boolean — default false; true adds height:100% for same-height grid rows
})
```

**Visual:**
- Padding: `20px 22px`, `borderRadius: 16`
- Background: `var(--surface)`
- Emoji: 24px, `transformOrigin: left center`, scales to 1.15 on hover
- Title: `t-h5`, `color: var(--fg)`
- Desc (when `showDesc`): `t-body2`, `color: var(--fg-muted)`
- CTA row: "Read" + ArrowIcon; color transitions to `var(--color-coral)` on hover

**Interaction:**
- Stroke ring: `useSpring` opacity 0.2 → 0.7 (`stiffness:160, damping:24`)
- Lift: `translateY(-4px)` + `boxShadow: var(--shadow-md)` on hover
- `transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease`

**About page changes:**
- "All writing on Notion" Button removed from section header
- Grid uses `items-stretch` so all cards in a row reach equal height (with `equalHeight` prop)

**Article page changes:**
- `_parts.js` `MiniArticleCard` replaced with `<WritingCard article={a} showDesc={false} equalHeight />`

---

### SkillGroupCard

**Consumers:** About Skills & Expertise section

**Replaces:** inline skill group `m.div` in `AboutClient.js`

**Props:**
```js
SkillGroupCard({
  icon,           // string — emoji
  label,          // string — group name
  skills,         // string[] — individual skill tags
})
```

**Visual:** Identical to current — `rounded-2xl p-5`, `var(--surface)` bg, `var(--border)` border, skill chips with `ui-tag` class.

**Interaction added:** Adaptive Outline (H) — `useSpring` stroke ring opacity 0.2 → 0.7 on hover. Consistent with card language used across the rest of the page.

---

### All beyond-demo variants (GlassGlareCard, OutlineCard, MagneticCard, SpotlightCard, CurtainCard, ElasticGrid, SweepCard)

Extracted verbatim from `beyond-demo/page.js` into individual files. Props stay identical:
```js
({ item: { num, heading, body } })
```

No API changes — extraction only. `GlassGlareCard` preserves the full perimeter math (it's still valuable for beyond-demo showcase, just no longer used on the About page).

---

## Page-level Changes

### `app/about/AboutClient.js`

| Section | Before | After |
|---|---|---|
| Writing | inline `WritingCard` | `<WritingCard … />` from interaction-cards |
| 5 Things I Bring | inline `WhatIBringCard` (Glass Glare, ~80 lines) | `<FlipCard titleSize="lg" … />` |
| How I Work | `gap-8`, `1fr 2fr` | `gap-4`, `1fr 2.5fr` |
| Beyond the Work | inline `NumberedCard` | `<FlipCard … />` |
| What I'm Thinking | inline `ThinkingFlipCard` | `<FlipCard … />` |
| Skills & Expertise | inline `m.div` blocks | `<SkillGroupCard … />` |

All inline card component definitions deleted from `AboutClient.js`. Estimated reduction: ~200 lines.

The `WIB_*` constants and all perimeter math functions (`wibPerimToXY`, `wibCursorToPerimT`, `wibOffsetPerimPoint`) are deleted — they only existed for `WhatIBringCard`.

`STROKE_RING` constant is deleted — the stroke ring is now internal to each card component.

### `app/writing/[slug]/_parts.js`

`MiniArticleCard` replaced with `WritingCard` import + re-export. `ExternalArrow` stays (used in other parts of the article page). `BackArrow` stays.

### `app/beyond-demo/page.js`

All inline component definitions removed. File becomes:
```js
import { FlipCard, GlassGlareCard, MagneticCard, … } from '@/app/components/ui/interaction-cards';
// DemoSection shell stays inline (page-specific layout, not reusable)
// ElasticGrid stays with its own grid wrapper since it manages sibling state
// Page renders DemoSection blocks with imported card components
```

---

## Constraints

- All interaction-cards files are `'use client'` — no server component can import them directly (same constraint as current AboutClient)
- `card-utils.js` remains server-importable — interaction-cards must not import from it
- No TypeScript — JS only, consistent with codebase
- No new CSS variables — use existing tokens only (`var(--bg-solid)` for flip back face)
- `--flip-back-bg` CSS variable in `globals.css` (currently used by ThinkingFlipCard) — either reuse it for the neutral dark back or replace usages with `var(--bg-solid)` directly. Prefer direct token; remove the variable if unused after refactor.
- beyond-demo page remains at `/beyond-demo` — no URL changes

---

## What This Does Not Cover

- Style guide (`app/style-guide/page.js`) update — should be updated after implementation to show interaction card variants
- New card variants not currently in beyond-demo
- Theming / light mode testing — each card must be verified in both themes after implementation
