# Blur Entry Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add blur-in to scroll-triggered entry animations via `FadeSection`, and validate on a new `/blur-demo` page.

**Architecture:** One-line change to `FadeSection.js` adds `filter: blur()` to existing `initial`/`whileInView` variants. A static demo page at `app/blur-demo/page.js` renders five varied content blocks all wrapped in `<FadeSection>` to exercise the effect at different sizes.

**Tech Stack:** Next.js App Router, Framer Motion (`m` from `framer-motion`), Tailwind CSS, CSS variables.

---

### Task 1: Update FadeSection to include blur

**Files:**
- Modify: `app/components/ui/FadeSection.js`

- [ ] **Step 1: Add `filter` to `initial` and `whileInView`**

Replace the current animation props:

```js
'use client';

import { m } from 'framer-motion';

export default function FadeSection({ children, className = '' }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </m.div>
  );
}
```

- [ ] **Step 2: Verify no existing page is broken**

Run the dev server and visit `/`, `/about`, `/work` — confirm existing `FadeSection` usages animate in cleanly with blur. No layout shift, no flicker.

```bash
npm run dev
```

- [ ] **Step 3: Commit**

```bash
git add app/components/ui/FadeSection.js
git commit -m "feat: add blur-in to FadeSection scroll entry animation"
```

---

### Task 2: Create /blur-demo page

**Files:**
- Create: `app/blur-demo/page.js`

- [ ] **Step 1: Create the demo page**

```js
'use client';

import FadeSection from '@/app/components/ui/FadeSection';

export default function BlurDemoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-8 py-32 flex flex-col gap-32">

        {/* Block 1 — Display heading */}
        <FadeSection>
          <h1 className="text-6xl font-semibold leading-tight">
            Blur entry animation
          </h1>
        </FadeSection>

        {/* Block 2 — Body text */}
        <FadeSection>
          <p className="text-base text-foreground-secondary leading-relaxed max-w-xl">
            Each section fades in from below while unblurring as it enters the
            viewport. The effect uses Framer Motion's <code>whileInView</code>{' '}
            with a <code>filter: blur()</code> transition — no extra library
            required.
          </p>
        </FadeSection>

        {/* Block 3 — 2-column card row */}
        <FadeSection>
          <div className="grid grid-cols-2 gap-8">
            <div className="rounded-lg bg-surface border border-border p-8">
              <p className="text-sm font-medium text-foreground mb-2">Card one</p>
              <p className="text-sm text-foreground-secondary leading-relaxed">
                Surface card at standard size. Blurs in together with its sibling
                since both share the same FadeSection wrapper.
              </p>
            </div>
            <div className="rounded-lg bg-surface border border-border p-8">
              <p className="text-sm font-medium text-foreground mb-2">Card two</p>
              <p className="text-sm text-foreground-secondary leading-relaxed">
                Both cards animate as one unit — a single FadeSection wraps the
                entire grid row.
              </p>
            </div>
          </div>
        </FadeSection>

        {/* Block 4 — Heading + paragraph */}
        <FadeSection>
          <h2 className="text-4xl font-semibold mb-6">A second section</h2>
          <p className="text-base text-foreground-secondary leading-relaxed max-w-xl">
            Scroll speed and viewport margin both affect when the animation
            triggers. The <code>margin: -80px</code> on the viewport means the
            element starts animating just before it's fully in view.
          </p>
        </FadeSection>

        {/* Block 5 — Wide image placeholder */}
        <FadeSection>
          <div className="w-full aspect-video rounded-lg bg-background-secondary border border-border flex items-center justify-center">
            <p className="text-sm text-foreground-tertiary">Image placeholder</p>
          </div>
        </FadeSection>

      </div>
    </main>
  );
}
```

- [ ] **Step 2: Visit `/blur-demo` and verify**

- All 5 blocks are visible when scrolled to
- Each blurs in from `blur(8px)` as it enters the viewport
- Works in both light and dark theme (toggle with ThemeToggle in navbar)
- No layout shift during animation

- [ ] **Step 3: Commit**

```bash
git add app/blur-demo/page.js
git commit -m "feat: add /blur-demo page to test blur entry animation"
```
