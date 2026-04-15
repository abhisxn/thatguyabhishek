# Blur Entry Animation — Design Spec
**Date:** 2026-04-10
**Status:** Approved

---

## Goal

Add a blur-in effect to scroll-triggered entry animations across the site, and validate it on a dedicated demo page before rolling it into production sections.

---

## Approach

Extend the existing `FadeSection` primitive (`app/components/ui/FadeSection.js`) to include `filter: blur()` in its animation variants. No new component. No new prop. All existing usages of `FadeSection` automatically get the blur.

---

## Changes

### 1. `app/components/ui/FadeSection.js`

Add `filter` to `initial` and `whileInView`:

```js
initial:     { opacity: 0, y: 24, filter: 'blur(8px)' }
whileInView: { opacity: 1, y: 0,  filter: 'blur(0px)' }
```

- Duration: 0.6s (unchanged)
- Easing: `[0.22, 1, 0.36, 1]` (unchanged)
- `viewport`: `{ once: true, margin: '-80px' }` (unchanged)

### 2. `app/blur-demo/page.js` (new)

A long scrollable demo page. Static JSX only — no data fetching, no routing dependencies. All content blocks wrapped in `<FadeSection>`.

Content blocks (in order):
1. Large display heading
2. Body text paragraph
3. 2-column card row (two plain surface cards with title + body)
4. Second heading + paragraph
5. Wide image-placeholder block (aspect-video, bg-background-secondary)

Modelled after the `beyond-demo` page structure: dark/light-aware via CSS variables, full-width sections, generous vertical padding.

---

## Non-goals

- No progressive/scroll-depth blur (depth-of-field effect) — out of scope
- No new prop on `FadeSection` to toggle blur on/off — all usages get it
- No stagger between elements within a single `FadeSection` — each block animates independently

---

## Acceptance criteria

- `/blur-demo` renders all 5 content blocks
- Each block blurs in from `blur(8px)` to `blur(0px)` as it enters the viewport
- Animation works in both light and dark theme
- No layout shift during animation
- `FadeSection` change does not break any existing usage
