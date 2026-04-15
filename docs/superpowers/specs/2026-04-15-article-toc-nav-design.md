# Article Scroll-Aware Navigation — Design Spec

**Date:** 2026-04-15
**Updated:** 2026-04-16
**Status:** Approved — refactor pass in progress

---

## Overview

Scroll-aware navigation on the article page (`/writing/[slug]`). On desktop a fixed vertical sidebar lists all top-level sections and highlights the active one as the user reads. On mobile/tablet a fixed top bar shows reading progress and the current section label.

This spec reflects the refactor pass: folder extraction, sidebar self-management, typography token fixes, and dead code removal.

---

## Decisions

| Question | Decision |
|---|---|
| Heading depth | H2s only (`heading_1` Notion blocks) — no L2 nesting |
| Desktop sidebar trigger | `scrollY > 200` — self-managed inside `ArticleSidebar` |
| Desktop interaction | Clickable — smooth scroll to section |
| Mobile behavior | Sticky top bar, ambient only, no tap interaction |
| Mobile shows | Progress bar (2px, brand color) + section label + percentage |
| Architecture | Server extracts headings, client handles UI |
| Sidebar visibility | `AnimatePresence` fade (`opacity 0→1, x -6→0`, 300ms) |
| Footer hide | IntersectionObserver on `#more-writing` in both nav components |

---

## File Structure

```
app/writing/[slug]/
├── page.js                  ← server: extractHeadings, passes headings prop
├── ArticleClient.js         ← layout + state wiring only (~160 lines)
├── ArticleSidebar.js        ← desktop sidebar, self-managing visibility
├── ArticleProgressBar.js    ← mobile/tablet top bar, self-managing visibility
├── _hooks.js                ← useArticleToc, estimateReadTime
└── _parts.js                ← BackArrow, ExternalArrow, MiniArticleCard
```

`ArticleReactions` stays in `app/components/sections/ArticleReactions.js`. The dead `StickyBar` component inside it is removed.

---

## Data Flow

### 1. Server — `app/writing/[slug]/page.js`

Extract a `headings` array from `blocks` and pass to `ArticleClient`:

```js
function extractHeadings(blocks) {
  const seen = {};
  return blocks
    .filter((b) => b.type === 'heading_1')
    .map((b) => {
      const text = b.heading_1.rich_text.map((t) => t.plain_text).join('');
      let slug = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim();
      if (seen[slug] !== undefined) { seen[slug] += 1; slug = `${slug}-${seen[slug]}`; }
      else { seen[slug] = 0; }
      return { id: b.id, text, slug };
    });
}
```

### 2. `_hooks.js` — `useArticleToc(headings)`

Returns `{ activeSlug, progress }`. Used by `ArticleClient`, which passes both down to `ArticleSidebar` and `ArticleProgressBar`.

```js
export function useArticleToc(headings) {
  const [activeSlug, setActiveSlug] = useState(headings[0]?.slug ?? null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveSlug(visible.target.id);
      },
      { rootMargin: '0px 0px -65% 0px' }
    );
    headings.forEach(({ slug }) => {
      const el = document.getElementById(slug);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  return { activeSlug, progress };
}
```

### 3. `_parts.js`

`'use client'` — exports `BackArrow`, `ExternalArrow`, `MiniArticleCard`. `MiniArticleCard` uses mouse event handlers so needs the directive.

---

## Components

### `ArticleSidebar` — desktop only

**File:** `app/writing/[slug]/ArticleSidebar.js`

**Visibility (self-managed):**
- Show when `scrollY > 200` — scroll listener inside the component
- Hide when `#more-writing` enters view — IntersectionObserver inside the component
- Entry/exit: `AnimatePresence` → `opacity 0→1`, `x -6→0`, 300ms ease-out

**Positioning:** `position: fixed`, `left: calc(50vw - 602px)`, `top: 88`, `width: 220`, `hidden xl:block`

**Typography:**
- `"In this piece"` label → `t-caption`, `var(--fg-disabled)`
- Item text (L1 only) → `t-body2`

**Item states:**
- Active: coral hairline bar (`var(--color-coral)`), label `var(--color-coral)`, coral-muted background
- Inactive: transparent background, label `var(--fg)`
- Hover: coral-5% background, label `color-mix(in srgb, var(--color-coral) 60%, var(--fg))`

**No L2 nesting.** Single flat list of H2 headings only.

---

### `ArticleProgressBar` — mobile/tablet only

**File:** `app/writing/[slug]/ArticleProgressBar.js`

**Visibility (self-managed, unchanged):**
- Show when `scrollY > 80`
- Hide when `#more-writing` enters view

**Anatomy:**
- Label row: current section name (left `t-caption fg-muted`), `{progress}%` (right `t-caption fg-disabled`)
- 2px progress bar flush at bottom — `var(--brand)` fill, `width: {progress}%`, `transition: width 0.15s linear`
- Background: `color-mix(in srgb, var(--bg-solid) 85%, transparent)` + `backdrop-filter: blur(12px)`
- `className="xl:hidden"` — hidden on desktop

---

## `ArticleClient` changes

**Extractions out of `ArticleClient`:**
- `useArticleToc` + `estimateReadTime` → `_hooks.js`
- `BackArrow`, `ExternalArrow`, `MiniArticleCard` → `_parts.js`

**Sidebar wiring:** The `<aside>` wrapper becomes a plain positioning shell. `ArticleSidebar` manages its own show/hide internally — `ArticleClient` passes only `headings` and `activeSlug`.

**Sticky pill bar stays inline** in `ArticleClient` JSX (not moved to `_parts.js` — it depends on `hasScrolled` and `cardsInView` state that lives in `ArticleClient`).

---

## `ArticleReactions` cleanup

Remove dead `StickyBar` component (lines 87–120 of current file). It is never called — the sticky pill lives inline in `ArticleClient`. All named exports (`useReactions`, `TotalCount`, `ArticleReactionPills`, `ArticleReactionCards`) and the default export remain unchanged.

---

## Files touched

| File | Change |
|---|---|
| `app/writing/[slug]/_hooks.js` | **New** — `useArticleToc`, `estimateReadTime` |
| `app/writing/[slug]/_parts.js` | **New** — `BackArrow`, `ExternalArrow`, `MiniArticleCard` |
| `app/writing/[slug]/ArticleClient.js` | Extract helpers, slim to layout + state wiring |
| `app/writing/[slug]/ArticleSidebar.js` | Add self-managing scroll visibility; fix typography tokens; remove L2 |
| `app/writing/[slug]/ArticleProgressBar.js` | No change |
| `app/components/sections/ArticleReactions.js` | Remove dead `StickyBar` component |

---

## Edge Cases

- **No headings:** Both nav components render nothing (`headings.length === 0` guard).
- **Short articles:** If `scrollHeight < innerHeight * 1.5`, `scrollY > 200` is never reached — sidebar stays hidden naturally.
- **Slug collisions:** Append `-2`, `-3` suffix via `seen` map in `extractHeadings`.
- **Light theme:** All colors via CSS variables — no hardcoded hex in components.
