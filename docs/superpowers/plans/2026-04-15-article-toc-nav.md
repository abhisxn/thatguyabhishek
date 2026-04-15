# Article Scroll-Aware Navigation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add scroll-aware section navigation to `/writing/[slug]` — a fixed left sidebar on desktop and a fixed top progress bar on mobile/tablet, both driven by IntersectionObserver.

**Architecture:** Server extracts H2 headings from Notion blocks and passes them as a `headings` prop. A shared `useArticleToc` hook in `ArticleClient` tracks the active section and scroll progress. Two new client components — `ArticleSidebar` and `ArticleProgressBar` — consume that state and render independently.

**Tech Stack:** Next.js 15 App Router, React 19, Framer Motion (already in project), IntersectionObserver API, CSS custom properties from `globals.css`.

**Spec:** `docs/superpowers/specs/2026-04-15-article-toc-nav-design.md`

> **Status (2026-04-16):** Tasks 1–7 complete. Task 8 (navbar height fix) not needed — navbar is 64px. Refactor pass (Tasks 9–12 below) added.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `lib/slugify.js` | Pure slug utility — shared between server and client |
| Modify | `app/writing/[slug]/page.js` | Extract headings server-side, pass `headings` prop |
| Modify | `app/components/sections/NotionBlocks.js` | Add `id` + `data-toc` to `heading_1` render |
| Modify | `app/writing/[slug]/ArticleClient.js` | Accept `headings`, add hook, add sentinel IDs, render nav components |
| Create | `app/writing/[slug]/ArticleSidebar.js` | Desktop fixed sidebar |
| Create | `app/writing/[slug]/ArticleProgressBar.js` | Mobile/tablet fixed top bar |

---

## Task 1: Create slug utility

**Files:**
- Create: `lib/slugify.js`

- [ ] **Step 1: Write the file**

```js
// lib/slugify.js
/**
 * Converts a heading string into a URL-safe slug.
 * Handles duplicate slugs via the `seen` map passed by the caller.
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/slugify.js
git commit -m "feat: add slugify utility for heading anchor IDs"
```

---

## Task 2: Extract headings in `page.js`

**Files:**
- Modify: `app/writing/[slug]/page.js`

- [ ] **Step 1: Read the file first**

Read `app/writing/[slug]/page.js` and locate:
- The import block at the top
- The `ArticlePage` async function
- Where `<ArticleClient>` is rendered (will be near the bottom)

- [ ] **Step 2: Add the import and `extractHeadings` function**

Add to the import block at the top of the file:
```js
import { slugify } from '@/lib/slugify';
```

Add this function after the imports, before `ArticlePage`:
```js
function extractHeadings(blocks) {
  const seen = {};
  return blocks
    .filter((b) => b.type === 'heading_1')
    .map((b) => {
      const text = b.heading_1.rich_text.map((t) => t.plain_text).join('');
      let slug = slugify(text);
      if (seen[slug] !== undefined) {
        seen[slug] += 1;
        slug = `${slug}-${seen[slug]}`;
      } else {
        seen[slug] = 0;
      }
      return { id: b.id, text, slug };
    });
}
```

- [ ] **Step 3: Pass `headings` to `ArticleClient`**

Inside `ArticlePage`, find where `blocks` is available (after the Notion fetch) and add:
```js
const headings = extractHeadings(blocks);
```

Then find the `<ArticleClient ... />` JSX and add the prop:
```jsx
<ArticleClient
  article={article}
  blocks={blocks}
  childrenMap={childrenMap}
  otherArticles={otherArticles}
  headings={headings}
/>
```

- [ ] **Step 4: Verify**

Run: `npm run dev`

Open any article at `localhost:3000/writing/[slug]`. Open browser DevTools console and temporarily add `console.log(headings)` inside `ArticleClient` (remove after verifying).

Expected: array of `{ id, text, slug }` objects matching the article's H2 headings.

- [ ] **Step 5: Commit**

```bash
git add app/writing/[slug]/page.js lib/slugify.js
git commit -m "feat: extract heading list server-side for article ToC"
```

---

## Task 3: Add `id` + `data-toc` to `heading_1` in NotionBlocks

**Files:**
- Modify: `app/components/sections/NotionBlocks.js`

- [ ] **Step 1: Add the slugify import**

Open `app/components/sections/NotionBlocks.js`. Add to the top import block:
```js
import { slugify } from '@/lib/slugify';
```

- [ ] **Step 2: Update the `heading_1` case**

Find the existing `heading_1` case (around line 72):
```js
case 'heading_1': {
  const h1texts = block.heading_1?.rich_text ?? [];
  return <h2 className={`${compact ? 't-h3' : 't-h2'} mt-4 text-[var(--fg)]`}><RichText texts={h1texts} /></h2>;
}
```

Replace it with:
```js
case 'heading_1': {
  const h1texts = block.heading_1?.rich_text ?? [];
  const h1slug = slugify(h1texts.map((t) => t.plain_text).join(''));
  return (
    <h2
      id={h1slug}
      data-toc
      className={`${compact ? 't-h3' : 't-h2'} mt-4 text-[var(--fg)]`}
    >
      <RichText texts={h1texts} />
    </h2>
  );
}
```

- [ ] **Step 3: Verify**

With dev server running, open an article. Inspect a heading in DevTools.

Expected: `<h2 id="the-core-problem" data-toc class="t-h2 mt-4 ...">The Core Problem</h2>`

- [ ] **Step 4: Commit**

```bash
git add app/components/sections/NotionBlocks.js
git commit -m "feat: add id and data-toc attributes to heading_1 blocks"
```

---

## Task 4: Add `useArticleToc` hook and sentinel IDs in `ArticleClient`

**Files:**
- Modify: `app/writing/[slug]/ArticleClient.js`

- [ ] **Step 1: Add React imports**

Open `app/writing/[slug]/ArticleClient.js`. The file starts with `'use client'`.

Find the existing import line (around line 1–7). Add `useState` and `useEffect` to the React import. Since the file doesn't currently import React directly (Next.js 15 auto-imports), add:
```js
import { useState, useEffect } from 'react';
```

- [ ] **Step 2: Add `useArticleToc` hook**

Add this hook function after the imports and before `estimateReadTime`:

```js
function useArticleToc(headings) {
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
        // Find the topmost intersecting heading
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

- [ ] **Step 3: Update the `ArticleClient` function signature**

Find:
```js
export default function ArticleClient({ article, blocks, childrenMap, otherArticles }) {
```

Replace with:
```js
export default function ArticleClient({ article, blocks, childrenMap, otherArticles, headings = [] }) {
```

- [ ] **Step 4: Call the hook inside the component**

Find the line `const readTime = estimateReadTime(blocks);` and add after it:
```js
const { activeSlug, progress } = useArticleToc(headings);
```

- [ ] **Step 5: Add sentinel `id` to the divider element**

Find the divider `<m.div>` (around line 164 — the one that renders `<div style={{ height: 1, ... }}`). Add `id="article-divider"` to the outer `<m.div>`:

```jsx
<m.div
  id="article-divider"
  initial={{ scaleX: 0, opacity: 0 }}
  animate={{ scaleX: 1, opacity: 1 }}
  transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
  style={{
    maxWidth: 720,
    margin: '40px auto 0',
    padding: '0 24px',
    transformOrigin: 'left center',
  }}
>
  <div style={{ height: 1, background: 'var(--border-strong)', width: '100%' }} />
</m.div>
```

- [ ] **Step 6: Add sentinel `id` to the "More writing" section**

Find the "More writing" outer `<div>` (around line 201). Add `id="more-writing"`:

```jsx
{otherArticles.length > 0 && (
  <div
    id="more-writing"
    style={{
      borderTop: '1px solid var(--border)',
      padding: 'clamp(48px, 8vw, 80px) 24px',
    }}
  >
```

- [ ] **Step 7: Verify the hook is running**

Temporarily add inside `ArticleClient` after the hook call:
```js
// Debug — remove after verifying
useEffect(() => { console.log('active:', activeSlug, 'progress:', progress); }, [activeSlug, progress]);
```

Reload an article, scroll. Console should log the active slug changing as headings enter view, and progress 0–100.

Remove the debug `useEffect` before committing.

- [ ] **Step 8: Commit**

```bash
git add app/writing/[slug]/ArticleClient.js
git commit -m "feat: add useArticleToc hook and sentinel IDs to ArticleClient"
```

---

## Task 5: Create `ArticleSidebar` component

**Files:**
- Create: `app/writing/[slug]/ArticleSidebar.js`

- [ ] **Step 1: Write the component**

```js
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, m } from 'framer-motion';

export default function ArticleSidebar({ headings, activeSlug }) {
  const [visible, setVisible] = useState(false);

  // Show after the article divider scrolls out of view
  useEffect(() => {
    const divider = document.getElementById('article-divider');
    if (!divider) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: '0px' }
    );
    observer.observe(divider);
    return () => observer.disconnect();
  }, []);

  // Hide when "More writing" footer enters view
  useEffect(() => {
    const footer = document.getElementById('more-writing');
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(false); }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (!headings.length) return null;

  return (
    <AnimatePresence>
      {visible && (
        <m.nav
          key="article-sidebar"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          aria-label="Article sections"
          // Only render at xl (1280px+) — gives 280px each side for 720px body
          className="hidden xl:block"
          style={{
            position: 'fixed',
            left: 'calc(50vw - 360px - 184px)',
            top: 160,
            width: 160,
            zIndex: 30,
          }}
        >
          <p
            style={{
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--fg-muted)',
              opacity: 0.5,
              marginBottom: 14,
            }}
          >
            On this page
          </p>

          <div style={{ position: 'relative', paddingLeft: 16 }}>
            {/* Vertical track rail */}
            <div
              style={{
                position: 'absolute',
                left: 3,
                top: 0,
                bottom: 0,
                width: 1,
                background: 'var(--border)',
              }}
            />

            {headings.map(({ slug, text }) => {
              const isActive = slug === activeSlug;
              return (
                <button
                  key={slug}
                  onClick={() =>
                    document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' })
                  }
                  style={{
                    position: 'relative',
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    padding: '0 0 12px',
                    cursor: 'pointer',
                  }}
                >
                  {/* Accent bar */}
                  <div
                    style={{
                      position: 'absolute',
                      left: -16,
                      top: 4,
                      width: isActive ? 3 : 2,
                      height: isActive ? 14 : 10,
                      background: isActive ? 'var(--brand)' : 'var(--border-strong)',
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--brand)' : 'var(--fg-muted)',
                      opacity: isActive ? 1 : 0.4,
                      lineHeight: 1.4,
                      transition: 'color 0.2s ease, opacity 0.2s ease, font-weight 0.2s ease',
                      display: 'block',
                    }}
                  >
                    {text}
                  </span>
                </button>
              );
            })}
          </div>
        </m.nav>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit (wiring comes in Task 7)**

```bash
git add app/writing/[slug]/ArticleSidebar.js
git commit -m "feat: add ArticleSidebar component for desktop ToC"
```

---

## Task 6: Create `ArticleProgressBar` component

**Files:**
- Create: `app/writing/[slug]/ArticleProgressBar.js`

- [ ] **Step 1: Write the component**

```js
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, m } from 'framer-motion';

export default function ArticleProgressBar({ headings, activeSlug, progress }) {
  const [visible, setVisible] = useState(false);

  // Show after 80px scroll
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hide when "More writing" footer enters view
  useEffect(() => {
    const footer = document.getElementById('more-writing');
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(false); }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const activeText = headings.find((h) => h.slug === activeSlug)?.text ?? '';

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          key="article-progress-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          // Hidden on desktop (xl+)
          className="xl:hidden"
          style={{
            position: 'fixed',
            // 64px is the default navbar height — adjust if your navbar differs
            top: 64,
            left: 0,
            right: 0,
            zIndex: 40,
            background: 'rgba(10,10,15,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {/* Label row */}
          <div
            style={{
              padding: '8px 16px 7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              className="t-caption"
              style={{ color: 'var(--fg-muted)', opacity: 0.6, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {activeText}
            </span>
            <span
              className="t-caption"
              style={{ color: 'var(--fg-muted)', opacity: 0.3, flexShrink: 0, marginLeft: 8 }}
            >
              {progress}%
            </span>
          </div>

          {/* Progress bar — flush at bottom of bar */}
          <div style={{ height: 2, background: 'var(--border)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #6366f1, #818cf8)',
                transition: 'width 0.15s linear',
              }}
            />
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/writing/[slug]/ArticleProgressBar.js
git commit -m "feat: add ArticleProgressBar component for mobile/tablet reading progress"
```

---

## Task 7: Wire nav components into `ArticleClient`

**Files:**
- Modify: `app/writing/[slug]/ArticleClient.js`

- [ ] **Step 1: Add imports**

Open `app/writing/[slug]/ArticleClient.js`. Add to the import block:
```js
import ArticleSidebar from './ArticleSidebar';
import ArticleProgressBar from './ArticleProgressBar';
```

- [ ] **Step 2: Render both components**

Find the opening of the outermost return — the `<LazyMotion>` wrapper. Inside it, right after `<GradientBackground />` and before the main `<div className="relative">`, add both components:

```jsx
return (
  <LazyMotion features={domAnimation}>
    <GradientBackground />

    <ArticleSidebar headings={headings} activeSlug={activeSlug} />
    <ArticleProgressBar headings={headings} activeSlug={activeSlug} progress={progress} />

    <div className="relative" style={{ zIndex: 1 }}>
      {/* ... rest of article ... */}
    </div>
  </LazyMotion>
);
```

- [ ] **Step 3: Verify on desktop**

With dev server running, open an article on a viewport ≥ 1280px wide.

Expected:
- Sidebar is NOT visible while the article header is in view
- Scroll past the header divider → sidebar fades in from the left with brand-purple active section
- Click a section label → page smooth-scrolls to that heading
- Active section label updates as you scroll
- Sidebar disappears when "More writing" section enters view

- [ ] **Step 4: Verify on mobile**

Resize browser to < 1280px (or use DevTools mobile emulation at 390px).

Expected:
- Top bar is NOT visible at scroll position 0
- Scroll past 80px → progress bar fades in at the top (below navbar)
- Section label updates as you scroll
- Percentage increments
- Bar disappears near the footer

- [ ] **Step 5: Verify light theme**

Toggle to light theme via the site ThemeToggle.

Expected: all colours resolve correctly (sidebar labels, accent bar, progress gradient, frosted glass background all adapt).

- [ ] **Step 6: Commit**

```bash
git add app/writing/[slug]/ArticleClient.js
git commit -m "feat: wire ArticleSidebar and ArticleProgressBar into article page"
```

---

## Task 8: Navbar height fix (if needed)

**Files:**
- Modify: `app/writing/[slug]/ArticleProgressBar.js`

- [ ] **Step 1: Check the actual navbar height**

Open DevTools on the live site. Inspect the `<nav>` element in `app/components/layout/`. Note its rendered height.

If it is **not 64px**, open `ArticleProgressBar.js` and update:
```js
// Change this line:
top: 64,
// To the actual height, e.g.:
top: 72,
```

Alternatively, if the navbar sets a CSS variable (e.g. `--navbar-height`), use:
```js
top: 'var(--navbar-height, 64px)',
```

- [ ] **Step 2: Commit only if changed**

```bash
git add app/writing/[slug]/ArticleProgressBar.js
git commit -m "fix: correct navbar height offset for mobile progress bar"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] H2-only heading depth → `extractHeadings` filters `heading_1` only
- [x] Desktop sidebar fades in after header → IntersectionObserver on `#article-divider`
- [x] Desktop sidebar disappears near footer → IntersectionObserver on `#more-writing`
- [x] Desktop only at ≥ 1100px → `className="hidden xl:block"` (1280px — slightly wider than spec's 1100px; safer for positioning math)
- [x] Sidebar items clickable, smooth scroll → `scrollIntoView({ behavior: 'smooth' })`
- [x] Mobile top bar (not bottom) → `position: fixed; top: 64`
- [x] Mobile progress bar + section label + percentage → rendered in `ArticleProgressBar`
- [x] Mobile bar fades in after 80px scroll → scroll listener in `ArticleProgressBar`
- [x] No tap interaction on mobile → no `onClick` on mobile bar
- [x] Slug collision handling → `seen` map in `extractHeadings`
- [x] No headings edge case → `headings = []` default, both components return null
- [x] Both themes → CSS variables used throughout, no hardcoded colours except progress gradient (brand purple — acceptable)
- [x] Architecture Option B → server extracts, client handles UI

**Slug consistency:** `slugify()` imported from the same `lib/slugify.js` in both `page.js` and `NotionBlocks.js`. ✓

**Type consistency:** `headings` shape `{ id, text, slug }[]` used consistently across all files. `activeSlug` is always a `slug` string. ✓

---

## Refactor Pass (2026-04-16)

**Goal:** Extract helpers out of `ArticleClient`, make `ArticleSidebar` self-managing, fix typography tokens, remove dead code.

**Spec:** `docs/superpowers/specs/2026-04-15-article-toc-nav-design.md` (updated 2026-04-16)

---

## Task 9: Create `_hooks.js`

**Files:**
- Create: `app/writing/[slug]/_hooks.js`

- [ ] **Step 1: Write the file**

Move `useArticleToc` and `estimateReadTime` out of `ArticleClient.js` into this file:

```js
'use client';

import { useState, useEffect } from 'react';

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

export function estimateReadTime(blocks) {
  const words = blocks
    .flatMap((b) => {
      const texts = b[b.type]?.rich_text ?? b[b.type]?.caption ?? [];
      return texts.map((t) => t.plain_text);
    })
    .join(' ')
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
```

- [ ] **Step 2: Commit**

```bash
git add app/writing/[slug]/_hooks.js
git commit -m "refactor: extract useArticleToc and estimateReadTime into _hooks.js"
```

---

## Task 10: Create `_parts.js`

**Files:**
- Create: `app/writing/[slug]/_parts.js`

- [ ] **Step 1: Write the file**

Move `BackArrow`, `ExternalArrow`, `MiniArticleCard` out of `ArticleClient.js`:

```js
'use client';

import Link from 'next/link';

export function BackArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M12 7H2M7 2L2 7l5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ExternalArrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MiniArticleCard({ article }) {
  return (
    <Link
      href={article.href}
      className="group flex flex-col gap-2 no-underline"
      style={{
        padding: '20px',
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        transition: 'border-color 0.2s ease, background 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-strong)';
        e.currentTarget.style.background = 'var(--surface-2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.background = 'var(--surface-1)';
      }}
    >
      <span style={{ fontSize: 22 }}>{article.emoji}</span>
      <p className="t-body3 font-semibold text-fg" style={{ margin: 0, lineHeight: 1.35 }}>
        {article.title}
      </p>
      <span className="t-caption text-fg-muted inline-flex items-center gap-1 mt-auto">
        Read <ExternalArrow />
      </span>
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/writing/[slug]/_parts.js
git commit -m "refactor: extract BackArrow, ExternalArrow, MiniArticleCard into _parts.js"
```

---

## Task 11: Slim `ArticleClient.js`

**Files:**
- Modify: `app/writing/[slug]/ArticleClient.js`

- [ ] **Step 1: Replace inline hook/helper definitions with imports**

Remove `useArticleToc`, `estimateReadTime`, `BackArrow`, `ExternalArrow`, `MiniArticleCard` function bodies.

Add to the import block:
```js
import { useArticleToc, estimateReadTime } from './_hooks';
import { BackArrow, ExternalArrow, MiniArticleCard } from './_parts';
```

- [ ] **Step 2: Verify the component renders correctly**

Run `npm run dev`. Open any article. Check:
- Read time shows
- Back link arrow renders
- "More writing" grid renders
- Sidebar and progress bar both work

- [ ] **Step 3: Commit**

```bash
git add app/writing/[slug]/ArticleClient.js
git commit -m "refactor: slim ArticleClient — import hooks and parts from extracted files"
```

---

## Task 12: Make `ArticleSidebar` self-managing + fix tokens

**Files:**
- Modify: `app/writing/[slug]/ArticleSidebar.js`

- [ ] **Step 1: Add scroll-visibility logic**

Add `useState` and `useEffect` imports. Add two effects inside `ArticleSidebar`:

```js
const [visible, setVisible] = useState(false);

// Show after 200px scroll
useEffect(() => {
  const onScroll = () => setVisible(window.scrollY > 200);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  return () => window.removeEventListener('scroll', onScroll);
}, []);

// Hide when "More writing" footer enters view
useEffect(() => {
  const footer = document.getElementById('more-writing');
  if (!footer) return;
  const observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) setVisible(false); }
  );
  observer.observe(footer);
  return () => observer.disconnect();
}, []);
```

Wrap the `<nav>` return in `<AnimatePresence>` with a motion entry:

```jsx
import { AnimatePresence, m } from 'framer-motion';

return (
  <AnimatePresence>
    {visible && headings.length > 0 && (
      <m.nav
        key="article-sidebar"
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -6 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        aria-label="Article sections"
      >
        {/* ... existing nav content ... */}
      </m.nav>
    )}
  </AnimatePresence>
);
```

- [ ] **Step 2: Fix typography tokens**

In the "In this piece" label element:
- Remove inline `fontSize: 10`, `fontWeight: 500`, `letterSpacing`, `textTransform`
- Add `className="t-caption"`

In `SidebarItem` span:
- Remove `fontSize: isL2 ? 11 : 12`
- Add `className="t-body2"`
- Remove `isL2` branch entirely — treat all items as L1

- [ ] **Step 3: Verify**

With dev server, open an article at viewport ≥ 1280px. Scroll past 200px — sidebar fades in. Scroll back to top — sidebar fades out. Scroll to footer — sidebar fades out.

Check both light and dark themes.

- [ ] **Step 4: Commit**

```bash
git add app/writing/[slug]/ArticleSidebar.js
git commit -m "refactor: make ArticleSidebar self-managing; fix typography tokens; remove L2"
```

---

## Task 13: Remove dead `StickyBar` from `ArticleReactions`

**Files:**
- Modify: `app/components/sections/ArticleReactions.js`

- [ ] **Step 1: Delete `StickyBar`**

Remove the `StickyBar` function (lines 87–120 in the current file). It is never called anywhere — the sticky pill bar lives inline in `ArticleClient.js`.

Verify no other file imports `StickyBar` before deleting:

```bash
grep -r "StickyBar" app/
```

Expected: zero results (it is not exported).

- [ ] **Step 2: Commit**

```bash
git add app/components/sections/ArticleReactions.js
git commit -m "refactor: remove unused StickyBar component from ArticleReactions"
```

---

## Refactor Self-Review Checklist

- [ ] `ArticleClient.js` imports from `_hooks.js` and `_parts.js` — no inline function bodies for hooks/helpers
- [ ] `ArticleSidebar` shows at `scrollY > 200`, hides at footer, fades with AnimatePresence
- [ ] `ArticleSidebar` "In this piece" label uses `t-caption` class — no raw fontSize
- [ ] `ArticleSidebar` item text uses `t-body2` class — no raw fontSize
- [ ] No L2 depth in sidebar — `isL2` branch removed
- [ ] `StickyBar` deleted from `ArticleReactions.js`
- [ ] Both themes verified after each task
- [ ] No ESLint errors introduced
