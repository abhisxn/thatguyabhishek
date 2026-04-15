# Codebase Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate design-system violations, component duplication, accessibility gaps, and performance anti-patterns across the thatguyabhishek.com codebase without changing any visible behaviour.

**Architecture:** Impact-first execution — token/import fixes first (no risk, instant payoff), then component extraction, then accessibility, then performance, then folder restructure last (single commit, pure mechanical path updates after all other work is done).

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, Framer Motion (`m` + `LazyMotion`), Notion API, Vercel ISR, JavaScript (no TypeScript)

---

## Task 1: Fix hardcoded hex values in `lib/section-styles.js`

**Files:**
- Modify: `lib/section-styles.js:43–53`

### Why
The `accent` style (index 3) uses raw hex `#4a2d7f`, `#0b1f3a`, `#ffffff`, `rgba(255,255,255,0.65)` — these are already defined as `@theme` primitives in `globals.css` and must be referenced via CSS variables.

- [ ] **Open `lib/section-styles.js` and locate the `accent` block at index 3 (around line 43)**

- [ ] **Replace the accent style with token-based values:**

```js
/* 3 — accent */
{
  name:  'accent',
  wrap:  {
    background: 'linear-gradient(135deg, var(--color-purple-card) 0%, var(--color-dark-teal) 100%)',
    position:   'relative',
    overflow:   'hidden',
  },
  inner:    {},
  textClr:  'var(--fg)',
  mutedClr: 'var(--fg-muted)',
},
```

- [ ] **Verify `--color-purple-card` and `--color-dark-teal` exist in `globals.css`**

Open `app/globals.css` and confirm these two lines appear in the `@theme` block:
```css
--color-dark-teal:    #163846;
--color-purple-card:  #4a2d7f;
```
Both should already be there. If missing, add them to the `@theme` block.

- [ ] **Run the dev server and visually verify the accent section still renders correctly**

```bash
npm run dev
```
Open http://localhost:3000 — navigate to any page that uses the accent section style. Confirm gradient still appears purple-to-dark.

- [ ] **Commit**

```bash
git add lib/section-styles.js
git commit -m "fix: replace hardcoded hex in section-styles accent with CSS tokens"
```

---

## Task 2: Fix hardcoded rgba values in `CareerTimeline.js`

**Files:**
- Modify: `app/components/sections/CareerTimeline.js:29–37`

### Why
The active/hover state Framer Motion animate props use raw `rgba(255,255,255,*)` values and `var(--color-dark-blue)` which don't respond to light theme.

- [ ] **Open `app/components/sections/CareerTimeline.js` and find the `m.span` animate block (~line 29)**

- [ ] **Replace all raw rgba values with semantic tokens:**

```js
<m.span
  className="ct-period-pill"
  animate={{
    background:  isActive ? 'var(--surface-inverse)' : 'var(--surface-0)',
    color:       isActive ? 'var(--bg-solid)'         : 'var(--fg-muted)',
    borderColor: isActive ? 'transparent'             : 'var(--border)',
  }}
  whileHover={{
    background:  isActive ? 'var(--surface-inverse)' : 'var(--surface-2)',
    borderColor: isActive ? 'transparent'            : 'var(--border-strong)',
    scale: 1.05,
  }}
  transition={{ duration: 0.15 }}
>
  {item.period}
```

- [ ] **Run dev server and manually test CareerTimeline in both themes**

```bash
npm run dev
```
Open http://localhost:3000 — scroll to the Career Timeline section. Toggle theme (dark → light → dark). Active pill and hover states must look correct in both themes.

- [ ] **Commit**

```bash
git add app/components/sections/CareerTimeline.js
git commit -m "fix: replace hardcoded rgba in CareerTimeline with semantic tokens"
```

---

## Task 3: Standardise all import paths to `@/` aliases

**Files:**
- Modify: `app/components/sections/ProjectsExpandableGrid.js`
- Modify: `app/components/sections/JourneySoFar.js`
- Modify: `app/components/sections/HelpSection.js`
- Modify: `app/components/sections/AboutSection.js`
- Modify: Any other file using `'../../..'` or `'../'` relative paths to `lib/` or `app/components/`

### Why
Relative `../../..` paths break silently when files move. `@/` aliases are stable and consistent with the rest of the codebase.

- [ ] **Find all files using relative paths to `lib/` or cross-directory imports**

Run from the project root:
```bash
grep -r "from '\.\." app/components --include="*.js" -l
grep -r "from '\.\." app/pages --include="*.js" -l 2>/dev/null || true
```

Note every file listed.

- [ ] **In `app/components/sections/ProjectsExpandableGrid.js`, replace relative imports:**

```js
// BEFORE
import { fadeUp, stagger, vp } from '../../../lib/motion';
import Button from '../ui/Button';

// AFTER
import { fadeUp, stagger, vp } from '@/lib/motion';
import Button from '@/app/components/ui/Button';
```

- [ ] **In `app/components/sections/JourneySoFar.js`, replace relative imports:**

```js
// BEFORE
import { fadeUp, stagger, vp } from '../../../lib/motion';
import W from '../ui/W';

// AFTER
import { fadeUp, stagger, vp } from '@/lib/motion';
import W from '@/app/components/ui/W';
```

- [ ] **In `app/components/sections/AboutSection.js`, replace relative imports:**

```js
// BEFORE
import { fadeUp, stagger, vp } from '../../../lib/motion';
import W from '../ui/W';
import Button from '../ui/Button';

// AFTER
import { fadeUp, stagger, vp } from '@/lib/motion';
import W from '@/app/components/ui/W';
import Button from '@/app/components/ui/Button';
```

- [ ] **In `app/components/sections/HelpSection.js`, replace relative imports:**

```js
// BEFORE
import { fadeUp, stagger, vp } from '../../../lib/motion';
import W from '../ui/W';
import Button from '../ui/Button';

// AFTER
import { fadeUp, stagger, vp } from '@/lib/motion';
import W from '@/app/components/ui/W';
import Button from '@/app/components/ui/Button';
```

- [ ] **Apply the same `@/` fix to every other file found in the grep step**

- [ ] **Run build to confirm no broken imports**

```bash
npm run build
```
Expected: build completes with no errors. Fix any import error before proceeding.

- [ ] **Commit**

```bash
git add app/components/sections/
git commit -m "fix: standardise all imports to @/ alias — remove relative ../../.. paths"
```

---

## Task 4: Replace inline arrow SVGs with `<ArrowIcon>`

**Files:**
- Modify: `app/components/sections/JourneySoFar.js`
- Modify: `app/components/sections/AboutSection.js`
- Modify: `app/components/sections/HelpSection.js`
- Modify: `app/components/sections/HomeHero.js`

### Why
`ArrowIcon` already exists in `app/components/ui/icons.js`. Three sections ignore it and define their own inline SVG path. One extra inline arrow exists in the HomeHero "Click here" link. All must use the shared component.

- [ ] **In `JourneySoFar.js`, import and use `ArrowIcon`:**

```js
// Add import
import { ArrowIcon } from '@/app/components/ui/icons';

// Replace the icon prop on Button — change from:
icon={<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}

// To:
icon={<ArrowIcon size={11} />}
```

- [ ] **In `AboutSection.js`, import and use `ArrowIcon`:**

```js
import { ArrowIcon } from '@/app/components/ui/icons';
// Replace icon prop — same pattern as above
icon={<ArrowIcon size={11} />}
```

- [ ] **In `HelpSection.js`, import and use `ArrowIcon`:**

```js
import { ArrowIcon } from '@/app/components/ui/icons';
icon={<ArrowIcon size={11} />}
```

- [ ] **In `HomeHero.js`, replace the inline arrow in the "Click here" link**

Find the `<a>` tag around line 58 with an inline SVG. The `ArrowIcon` viewBox is `0 0 12 12` — the inline one is `0 0 14 14`. Use `ArrowIcon` with `size={14}`:

```js
import { ArrowIcon } from '@/app/components/ui/icons';
// Replace the inline SVG inside the <a> with:
<ArrowIcon size={14} />
```

- [ ] **Run dev server and visually verify arrows look correct in all four locations**

```bash
npm run dev
```
Check: homepage Journey section, About section, Help section, and the hero "Click here" link.

- [ ] **Commit**

```bash
git add app/components/sections/JourneySoFar.js \
        app/components/sections/AboutSection.js \
        app/components/sections/HelpSection.js \
        app/components/sections/HomeHero.js
git commit -m "fix: replace all inline arrow SVGs with shared ArrowIcon component"
```

---

## Task 5: Fix inline style in `work/page.js`

**Files:**
- Modify: `app/work/page.js:40`

- [ ] **Open `app/work/page.js` and find the `<main>` element around line 40**

- [ ] **Replace inline style with Tailwind classes:**

```js
// BEFORE
<main className="relative min-h-screen pt-16" style={{ color: 'var(--fg)', zIndex: 1 }}>

// AFTER
<main className="relative min-h-screen pt-16 text-fg z-[1]">
```

- [ ] **Run build**

```bash
npm run build
```
Expected: no errors.

- [ ] **Commit**

```bash
git add app/work/page.js
git commit -m "fix: replace inline style on work page main with Tailwind classes"
```

---

## Task 6: Migrate `<img>` tags to `next/image`

**Files:**
- Modify: `app/components/sections/HomeHero.js`
- Modify: `app/components/sections/AboutSection.js`
- Modify: `app/components/sections/HelpSection.js`

### Why
Raw `<img>` bypasses Next.js image optimisation (WebP conversion, lazy loading, sizing). Above-fold images also need `priority` to avoid LCP delay.

- [ ] **In `HomeHero.js`, replace the desktop avatar `<img>` with `next/image`**

Add import at top of file:
```js
import Image from 'next/image';
```

Find the `<div className="avatar-circle">` block and replace the `<img>` inside it (both desktop and mobile instances):

```js
// Desktop avatar (inside avatar-circle div, around line 106)
// BEFORE
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src="/avatar.gif" alt="Abhishek Saxena" className="hero-avatar-img" />

// AFTER
<Image
  src="/avatar.gif"
  alt="Abhishek Saxena"
  width={420}
  height={420}
  priority
  unoptimized
  className="hero-avatar-img"
/>
```

Apply the same replacement to the mobile avatar `<img>` with `className="hero-avatar-img-sm"`:
```js
<Image
  src="/avatar.gif"
  alt="Abhishek Saxena"
  width={200}
  height={200}
  priority
  unoptimized
  className="hero-avatar-img-sm"
/>
```

- [ ] **In `AboutSection.js`, replace `<img>` with `next/image` using `fill` pattern**

Add import:
```js
import Image from 'next/image';
```

Replace the image block:
```js
// BEFORE
{/* eslint-disable-next-line @next/next/no-img-element */}
<img
  src={IMG_ABOUT}
  alt="About Abhishek Saxena"
  loading="lazy"
  className="w-full rounded-3xl object-cover h-[500px]"
/>

// AFTER — wrap in a sized container, use fill
<div className="relative w-full h-[500px] rounded-3xl overflow-hidden">
  <Image
    src="/about-photo.jpg"
    alt="Abhishek Saxena — product designer with 12+ years of experience"
    fill
    className="object-cover"
    priority
  />
</div>
```

Remove the `const IMG_ABOUT = '/about-photo.jpg';` constant — it's no longer needed.

- [ ] **In `HelpSection.js`, replace `<img>` with `next/image` using `fill` pattern**

Add import:
```js
import Image from 'next/image';
```

Replace the image block:
```js
// BEFORE
{/* eslint-disable-next-line @next/next/no-img-element */}
<img
  src={IMG_HELP}
  alt="How can I help"
  loading="lazy"
  className="w-full rounded-3xl object-cover h-[500px]"
/>

// AFTER
<div className="relative w-full h-[500px] rounded-3xl overflow-hidden">
  <Image
    src="/help-photo.jpg"
    alt="Abhishek Saxena — available for design leadership and consulting"
    fill
    className="object-cover"
    priority
  />
</div>
```

Remove the `const IMG_HELP = '/help-photo.jpg';` constant.

- [ ] **Run dev server and verify all three images render correctly in both themes**

```bash
npm run dev
```
Check: homepage hero avatar (animated GIF must still animate), About section image, Help section image. No broken images.

- [ ] **Run build to verify no next/image warnings**

```bash
npm run build
```
Expected: no image-related warnings or errors.

- [ ] **Commit**

```bash
git add app/components/sections/HomeHero.js \
        app/components/sections/AboutSection.js \
        app/components/sections/HelpSection.js
git commit -m "feat: migrate all img tags to next/image with priority for LCP images"
```

---

## Task 7: Audit Notion image proxy usage

**Files:**
- Read: `app/components/sections/NotionBlocks.js`
- Read: `app/components/sections/CalloutBlock.js`
- Read: `app/api/notion-image/route.js`

### Why
Notion signed image URLs expire after ~1 hour. Every Notion image render must go through `/api/notion-image?url=` proxy, never use the raw Notion URL directly.

- [ ] **Read `app/api/notion-image/route.js` to understand the proxy signature**

Note the query param name (likely `url`) and how it rewrites the URL.

- [ ] **Search `NotionBlocks.js` for all image src assignments**

```bash
grep -n "src\|imageUrl\|notion.*image\|s3.*amazonaws" app/components/sections/NotionBlocks.js
```

For every image rendered, confirm the src goes through the proxy:
```js
// CORRECT — proxied
src={`/api/notion-image?url=${encodeURIComponent(block.image.file.url)}`}

// BROKEN — raw Notion URL expires in 1 hour
src={block.image.file.url}
```

Fix any raw URL usage by wrapping in the proxy pattern.

- [ ] **Search `CalloutBlock.js` for the same pattern**

```bash
grep -n "src\|imageUrl\|notion.*image\|s3.*amazonaws" app/components/sections/CalloutBlock.js
```

Apply the same fix for any raw Notion URLs found.

- [ ] **Commit any fixes found (skip commit if no changes were needed)**

```bash
git add app/components/sections/NotionBlocks.js \
        app/components/sections/CalloutBlock.js
git commit -m "fix: ensure all Notion image URLs go through /api/notion-image proxy"
```

---

## Task 8: Extract `HomeSectionShell` and collapse duplicate sections

**Files:**
- Create: `app/components/sections/home/HomeSectionShell.js`
- Modify: `app/components/sections/AboutSection.js`
- Modify: `app/components/sections/HelpSection.js`
- Modify: `app/components/sections/JourneySoFar.js`

### Why
`AboutSection`, `HelpSection`, and `JourneySoFar` share an identical shell: `border-t → W → stagger → flex header with emoji h2 + link button`. This is ~15 lines of structural duplication per file. Extract once, use three times.

- [ ] **Create `app/components/sections/home/HomeSectionShell.js`**

```js
'use client';

import { m } from 'framer-motion';
import { stagger, fadeUp, vp } from '@/lib/motion';
import { ArrowIcon } from '@/app/components/ui/icons';
import Button from '@/app/components/ui/Button';
import W from '@/app/components/ui/W';

export default function HomeSectionShell({ heading, href, linkLabel = 'KNOW MORE', children }) {
  return (
    <div className="border-t border-theme">
      <W className="py-20">
        <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
          <m.div variants={fadeUp} className="flex items-center justify-between mb-10">
            <h2 className="t-h3">{heading}</h2>
            {href && (
              <Button href={href} variant="link" size="sm" icon={<ArrowIcon size={11} />}>
                {linkLabel}
              </Button>
            )}
          </m.div>
          {children}
        </m.div>
      </W>
    </div>
  );
}
```

- [ ] **Rewrite `app/components/sections/AboutSection.js` using `HomeSectionShell`**

```js
'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import { fadeUp, stagger } from '@/lib/motion';
import HomeSectionShell from '@/app/components/sections/home/HomeSectionShell';

export default function AboutSection() {
  return (
    <HomeSectionShell heading="🙋🏻‍♂️ About me" href="/about">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <m.div variants={fadeUp}>
          <div className="relative w-full h-[500px] rounded-3xl overflow-hidden">
            <Image
              src="/about-photo.jpg"
              alt="Abhishek Saxena — product designer with 12+ years of experience"
              fill
              className="object-cover"
              priority
            />
          </div>
        </m.div>
        <m.div variants={stagger} className="flex flex-col gap-6">
          <m.div variants={fadeUp} className="flex flex-col gap-6">
            <p className="t-body1 text-fg-muted">I started in the era before UX had rules — when digital was still figuring itself out, flash websites were a career, and the only metric that mattered was whether people came back.</p>
            <p className="t-body1 text-fg-muted">That wired me differently. I think in systems. I measure in outcomes. I&apos;ve led design at a telecom giant, shipped AI features for 400M+ Excel users, and built two products from zero — one of which hit 50K downloads with no marketing budget.</p>
            <p className="t-body1 text-fg-muted">I&apos;m a design generalist. That&apos;s not a hedge — it&apos;s a deliberate choice. The best design decisions I&apos;ve made came from knowing just enough about business strategy, product thinking, data, and engineering to ask the right questions before picking up Figma.</p>
          </m.div>
        </m.div>
      </div>
    </HomeSectionShell>
  );
}
```

- [ ] **Rewrite `app/components/sections/HelpSection.js` using `HomeSectionShell`**

```js
'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import { fadeUp, stagger } from '@/lib/motion';
import HomeSectionShell from '@/app/components/sections/home/HomeSectionShell';

export default function HelpSection() {
  return (
    <HomeSectionShell heading="🧑🏼‍🚀 How can I help?" href="/about">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <m.div variants={fadeUp}>
          <div className="relative w-full h-[500px] rounded-3xl overflow-hidden">
            <Image
              src="/help-photo.jpg"
              alt="Abhishek Saxena — available for design leadership and consulting"
              fill
              className="object-cover"
              priority
            />
          </div>
        </m.div>
        <m.div variants={stagger} className="flex flex-col gap-6">
          <m.div variants={fadeUp} className="flex flex-col gap-6">
            <p className="t-body1 text-fg-muted">I work best when the problem is hard, the stakes are real, and someone needs to bridge the gap between what users need and what the business is trying to build.</p>
            <p className="t-body1 text-fg-muted">Whether that&apos;s defining a design system from scratch, leading a team through a zero-to-one product, redesigning a broken experience for 100M users, or embedding AI into a workflow that people actually use — I&apos;ve done it. More than once. At different scales.</p>
            <p className="t-body1 text-fg-muted">If you need hands-on craft, I can do that. If you need someone to run a design function, set strategy, hire, and report to leadership — I can do that too. That range is the point.</p>
          </m.div>
        </m.div>
      </div>
    </HomeSectionShell>
  );
}
```

- [ ] **Rewrite `app/components/sections/JourneySoFar.js` using `HomeSectionShell`**

```js
'use client';

import { m } from 'framer-motion';
import { fadeUp } from '@/lib/motion';
import CareerTimeline from '@/app/components/sections/CareerTimeline';
import HomeSectionShell from '@/app/components/sections/home/HomeSectionShell';

export default function JourneySoFar() {
  return (
    <HomeSectionShell heading="🎢 Journey So Far" href="/about">
      <m.div variants={fadeUp}>
        <CareerTimeline />
      </m.div>
    </HomeSectionShell>
  );
}
```

- [ ] **Run dev server and verify all three sections render correctly**

```bash
npm run dev
```
Open http://localhost:3000 and scroll through all three homepage sections. Confirm:
- Section heading, link button, and arrow all appear
- Layout and spacing unchanged
- Animations work (stagger, fade-up on scroll)
- Both light and dark theme correct

- [ ] **Run build**

```bash
npm run build
```
Expected: no errors.

- [ ] **Commit**

```bash
git add app/components/sections/home/HomeSectionShell.js \
        app/components/sections/AboutSection.js \
        app/components/sections/HelpSection.js \
        app/components/sections/JourneySoFar.js
git commit -m "refactor: extract HomeSectionShell — collapse 3 duplicate section shells into one"
```

---

## Task 9: Add skip navigation link

**Files:**
- Modify: `app/layout.js`
- Modify: `app/page.js`
- Modify: `app/work/page.js`
- Modify: `app/about/AboutClient.js`
- Modify: `app/work/[slug]/page.js`
- Modify: `app/writing/[slug]/page.js`
- Modify: `app/awards/page.js`
- Modify: `app/contact/page.js`

### Why
Keyboard users must tab through the entire navbar on every page load with no way to skip to content. WCAG 2.2 AA requires a skip navigation link.

- [ ] **Open `app/layout.js` and add the skip link before `<Navbar>` (or before whatever is the first child of `<body>`)**

```js
{/* Skip navigation — keyboard and screen reader users */}
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-md focus:bg-[var(--brand)] focus:text-white focus:outline-none"
>
  Skip to main content
</a>
```

- [ ] **Add `id="main-content"` to the `<main>` element in every page file**

In `app/page.js`:
```js
<main id="main-content" ...>
```

In `app/work/page.js`:
```js
<main id="main-content" className="relative min-h-screen pt-16 text-fg z-[1]">
```

Repeat for `app/about/AboutClient.js`, `app/work/[slug]/page.js`, `app/writing/[slug]/page.js`, `app/awards/page.js`, `app/contact/page.js` — add `id="main-content"` to each `<main>` element.

- [ ] **Verify skip link works manually**

```bash
npm run dev
```
Open http://localhost:3000. Press Tab once. The skip link should appear (visible with focus styling). Press Enter. The page should jump to the main content area. The link must be invisible until focused.

- [ ] **Commit**

```bash
git add app/layout.js app/page.js app/work/page.js app/about/AboutClient.js \
        "app/work/[slug]/page.js" "app/writing/[slug]/page.js" \
        app/awards/page.js app/contact/page.js
git commit -m "feat(a11y): add skip navigation link to all pages"
```

---

## Task 10: Fix `ThemeToggle` missing `aria-label`

**Files:**
- Modify: `app/components/ui/ThemeToggle.js`

- [ ] **Open `app/components/ui/ThemeToggle.js` and read the current implementation**

- [ ] **Add `aria-label` to the toggle button, dynamic based on current theme**

Locate the button element and add:
```js
// If using next-themes resolvedTheme:
import { useTheme } from 'next-themes';
const { resolvedTheme, setTheme } = useTheme();

<button
  aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
  ...
>
```

If the component already uses `useTheme`, just add the `aria-label` prop — do not change existing toggle logic.

- [ ] **Verify with keyboard navigation**

```bash
npm run dev
```
Tab to the theme toggle. Confirm a screen reader would announce "Switch to light theme" or "Switch to dark theme" based on current state.

- [ ] **Commit**

```bash
git add app/components/ui/ThemeToggle.js
git commit -m "fix(a11y): add dynamic aria-label to ThemeToggle button"
```

---

## Task 11: Audit external links for `rel="noopener noreferrer"`

**Files:**
- Read + potentially modify: `app/components/sections/HomeHero.js`
- Read + potentially modify: `app/components/sections/NotionBlocks.js`
- Read + potentially modify: `app/components/sections/CalloutBlock.js`
- Read + potentially modify: `app/components/layout/Footer.js`

- [ ] **Search all component files for `target="_blank"` without `rel`**

```bash
grep -rn 'target="_blank"' app/components --include="*.js" -A 1
```

For every match, confirm the same element has `rel="noopener noreferrer"`. If missing, add it.

- [ ] **Also check page files**

```bash
grep -rn 'target="_blank"' app --include="*.js" -A 1
```

- [ ] **Fix any `<a target="_blank">` missing rel attribute**

```js
// BEFORE
<a href={url} target="_blank">

// AFTER
<a href={url} target="_blank" rel="noopener noreferrer">
```

Note: The `Button` component automatically applies `rel="noopener noreferrer"` when `external={true}`. Only inline `<a>` tags need manual auditing.

- [ ] **Commit any fixes (skip if no changes needed)**

```bash
git add -p   # stage only changed files
git commit -m "fix(a11y): add rel=noopener noreferrer to all external links"
```

---

## Task 12: Verify and enforce focus ring styles

**Files:**
- Read + potentially modify: `app/globals.css`

- [ ] **Search `globals.css` for `:focus-visible` definition**

```bash
grep -n "focus-visible" app/globals.css
```

- [ ] **If no explicit `:focus-visible` rule exists, add one after the scrollbar block**

```css
/* ─── Focus ring — visible on keyboard navigation ──────────────── */
:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 3px;
  border-radius: 4px;
}

/* Remove focus ring for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

- [ ] **Verify contrast of the focus ring**

`var(--brand)` = `#4839ca` (dark) / `#4839ca` (light). Against white background: contrast ratio ~5.5:1. Against dark bg (`#161b2a`): ~4.8:1. Both pass 3:1 minimum. ✓

- [ ] **Manual keyboard test**

```bash
npm run dev
```
Tab through the homepage. Every interactive element (nav links, buttons, theme toggle) must show a visible focus indicator.

- [ ] **Commit if changes were made**

```bash
git add app/globals.css
git commit -m "fix(a11y): add explicit :focus-visible ring to globals.css"
```

---

## Task 13: Audit and fix ISR `revalidate` values

**Files:**
- Modify: `app/about/page.js`
- Modify: `app/work/[slug]/page.js`
- Modify: `app/writing/[slug]/page.js`
- Modify: `app/awards/page.js`
- Modify: `app/contact/page.js`

### Why
Missing `revalidate` means pages are fully static and never update from Notion. Notion signed image URLs also expire after 1 hour — `revalidate = 3600` ensures pages are regenerated before images go stale.

- [ ] **Open each page file and check the top for `export const revalidate`**

- [ ] **Add or correct `revalidate` in each file:**

```js
// app/about/page.js — add at top
export const revalidate = 3600;

// app/work/[slug]/page.js — add at top
export const revalidate = 3600;

// app/writing/[slug]/page.js — add at top
export const revalidate = 3600;

// app/awards/page.js — add at top
export const revalidate = 3600;

// app/contact/page.js — contact content changes rarely
export const revalidate = 86400;
```

`app/work/page.js` already has `revalidate = 3600` — leave it unchanged.

- [ ] **Run build**

```bash
npm run build
```
Expected: no errors.

- [ ] **Commit**

```bash
git add app/about/page.js "app/work/[slug]/page.js" "app/writing/[slug]/page.js" \
        app/awards/page.js app/contact/page.js
git commit -m "fix: add ISR revalidate = 3600 to all Notion-driven pages"
```

---

## Task 14: Remove barrel import file

**Files:**
- Read: `app/components/ui/index.js`
- Delete: `app/components/ui/index.js`

### Why
`ui/index.js` re-exports all UI components. Any page that does `import { Button } from '@/app/components/ui'` pulls every UI component into its bundle, even unused ones.

- [ ] **Check `ui/index.js` to see what it exports**

```bash
cat app/components/ui/index.js
```

- [ ] **Search for any file importing from the barrel**

```bash
grep -rn "from '@/app/components/ui'" app --include="*.js"
grep -rn "from '../ui'" app --include="*.js"
grep -rn "from '../../components/ui'" app --include="*.js"
```

Note every file that imports from the index (not a specific file like `ui/Button`).

- [ ] **For each barrel importer, change to direct file import**

```js
// BEFORE
import { Button, Badge } from '@/app/components/ui';

// AFTER
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
```

- [ ] **Delete `app/components/ui/index.js`**

```bash
rm app/components/ui/index.js
```

- [ ] **Run build to confirm no broken imports**

```bash
npm run build
```
Expected: no errors. Fix any import error that references the barrel file.

- [ ] **Commit**

```bash
git add -A
git commit -m "perf: remove barrel ui/index.js — all imports now direct for better tree-shaking"
```

---

## Task 15: Audit Notion data fetching for parallel opportunities

**Files:**
- Read + potentially modify: `lib/notion-work.js`
- Read + potentially modify: `lib/notion-project.js`

- [ ] **Read `lib/notion-work.js` — look for sequential awaits on independent operations**

```bash
cat lib/notion-work.js
```

If you find sequential awaits where the second doesn't depend on the first:

```js
// BEFORE — sequential, adds latency
const page = await notion.pages.retrieve({ page_id });
const blocks = await notion.blocks.children.list({ block_id });

// AFTER — parallel, both start simultaneously
const [page, blocks] = await Promise.all([
  notion.pages.retrieve({ page_id }),
  notion.blocks.children.list({ block_id }),
]);
```

- [ ] **Read `lib/notion-project.js` and apply the same analysis**

```bash
cat lib/notion-project.js
```

Apply `Promise.all` wherever independent fetches are sequential.

- [ ] **Run build and verify data still loads correctly on dev server**

```bash
npm run build && npm run dev
```
Open http://localhost:3000/work and a project page. Confirm all content loads correctly.

- [ ] **Commit any changes (skip if no sequential awaits found)**

```bash
git add lib/notion-work.js lib/notion-project.js
git commit -m "perf: parallelise independent Notion fetch operations with Promise.all"
```

---

## Task 16: Folder restructure (single commit)

**Files:** All moves listed below. Zero logic changes in this task.

### Why this is last
All imports now use `@/` aliases (Task 3). The restructure is pure mechanical path updates. Doing it last means no file is edited twice.

### Moves

```
MOVE:  app/components/sections/NotionBlocks.js
  TO:  app/components/blocks/NotionBlocks.js

MOVE:  app/components/sections/CalloutBlock.js
  TO:  app/components/blocks/CalloutBlock.js

MOVE:  app/components/ui/EmbedBlock.js
  TO:  app/components/blocks/EmbedBlock.js

MOVE:  app/components/ui/LinkCalloutCard.js
  TO:  app/components/blocks/LinkCalloutCard.js

MOVE:  app/components/sections/HomeHero.js
  TO:  app/components/sections/home/HomeHero.js

MOVE:  app/components/sections/JourneySoFar.js
  TO:  app/components/sections/home/JourneySoFar.js

MOVE:  app/components/sections/AboutSection.js
  TO:  app/components/sections/home/AboutSection.js

MOVE:  app/components/sections/HelpSection.js
  TO:  app/components/sections/home/HelpSection.js

MOVE:  app/components/sections/CareerTimeline.js
  TO:  app/components/sections/home/CareerTimeline.js

MOVE:  app/components/sections/CareerChart.js
  TO:  app/components/sections/home/CareerChart.js

MOVE:  app/components/sections/ProjectsExpandableGrid.js
  TO:  app/components/sections/home/ProjectsExpandableGrid.js

MOVE:  app/components/sections/Hero.js
  TO:  app/components/sections/project/Hero.js

MOVE:  app/components/sections/ProjectCard.js
  TO:  app/components/sections/project/ProjectCard.js

MOVE:  app/components/sections/ProjectPageHero.js
  TO:  app/components/sections/project/ProjectPageHero.js

MOVE:  app/components/sections/ProjectSections.js
  TO:  app/components/sections/project/ProjectSections.js

MOVE:  app/components/sections/MoreWorkCard.js
  TO:  app/components/sections/project/MoreWorkCard.js
```

- [ ] **Create the new directories**

```bash
mkdir -p app/components/blocks
mkdir -p app/components/sections/home
mkdir -p app/components/sections/project
```

- [ ] **Move all files using `git mv` (preserves git history)**

```bash
git mv app/components/sections/NotionBlocks.js app/components/blocks/NotionBlocks.js
git mv app/components/sections/CalloutBlock.js app/components/blocks/CalloutBlock.js
git mv app/components/ui/EmbedBlock.js app/components/blocks/EmbedBlock.js
git mv app/components/ui/LinkCalloutCard.js app/components/blocks/LinkCalloutCard.js

git mv app/components/sections/HomeHero.js app/components/sections/home/HomeHero.js
git mv app/components/sections/JourneySoFar.js app/components/sections/home/JourneySoFar.js
git mv app/components/sections/AboutSection.js app/components/sections/home/AboutSection.js
git mv app/components/sections/HelpSection.js app/components/sections/home/HelpSection.js
git mv app/components/sections/CareerTimeline.js app/components/sections/home/CareerTimeline.js
git mv app/components/sections/CareerChart.js app/components/sections/home/CareerChart.js
git mv app/components/sections/ProjectsExpandableGrid.js app/components/sections/home/ProjectsExpandableGrid.js

git mv app/components/sections/Hero.js app/components/sections/project/Hero.js
git mv app/components/sections/ProjectCard.js app/components/sections/project/ProjectCard.js
git mv app/components/sections/ProjectPageHero.js app/components/sections/project/ProjectPageHero.js
git mv app/components/sections/ProjectSections.js app/components/sections/project/ProjectSections.js
git mv app/components/sections/MoreWorkCard.js app/components/sections/project/MoreWorkCard.js
```

- [ ] **Update all `@/` import paths in every file that imports from moved locations**

Search for stale import paths:
```bash
grep -rn "components/sections/NotionBlocks\|components/sections/CalloutBlock\|components/ui/EmbedBlock\|components/ui/LinkCalloutCard" app --include="*.js"
grep -rn "components/sections/HomeHero\|components/sections/JourneySoFar\|components/sections/AboutSection\|components/sections/HelpSection" app --include="*.js"
grep -rn "components/sections/CareerTimeline\|components/sections/ProjectsExpandableGrid\|components/sections/ProjectCard" app --include="*.js"
grep -rn "components/sections/ProjectPageHero\|components/sections/ProjectSections\|components/sections/MoreWorkCard" app --include="*.js"
```

For each match, update the import to the new path. Examples:
```js
// BEFORE
import { RenderBlocks } from '@/app/components/sections/NotionBlocks';
// AFTER
import { RenderBlocks } from '@/app/components/blocks/NotionBlocks';

// BEFORE
import HomeHero from '@/app/components/sections/HomeHero';
// AFTER
import HomeHero from '@/app/components/sections/home/HomeHero';

// BEFORE
import ProjectCard from '@/app/components/sections/ProjectCard';
// AFTER
import ProjectCard from '@/app/components/sections/project/ProjectCard';
```

- [ ] **Also update cross-imports inside moved files themselves**

The moved files may import each other. For example, `CareerTimeline.js` imports `CareerChart.js` — after both move to `home/`, the import stays `@/app/components/sections/home/CareerChart` (already correct with alias). Check each moved file:
```bash
grep -n "from '@/" app/components/sections/home/*.js app/components/sections/project/*.js app/components/blocks/*.js
```
Update any path that still points to the old location.

- [ ] **Run build**

```bash
npm run build
```
Expected: no errors. Fix any remaining broken import path before committing.

- [ ] **Run dev server and verify all pages load correctly**

```bash
npm run dev
```
Check: homepage, /work, /about, a project page, /writing/[slug].

- [ ] **Commit the entire restructure as one atomic commit**

```bash
git add -A
git commit -m "refactor: reorganise component folders — blocks/, sections/home/, sections/project/"
```

---

## Self-Review Checklist

After all 16 tasks are complete:

- [ ] Run `npm run build` — zero errors, zero warnings
- [ ] Run `npm run lint` — zero ESLint errors
- [ ] Open http://localhost:3000 in both light and dark theme — all sections render correctly
- [ ] Tab through homepage with keyboard only — skip link appears, focus ring visible on all interactive elements
- [ ] Check CareerTimeline in light theme — active/hover states use theme-aware colours
- [ ] Check all three section images load (about-photo, help-photo, avatar.gif animated)
- [ ] Verify ThemeToggle announces correct label via browser accessibility inspector (Chrome DevTools > Accessibility tab)

---

*Plan author: Claude Code — 2026-04-15*  
*Based on: Codebase Audit Design Spec (2026-04-15)*  
*Owner: Abhishek Saxena — abhisxn@gmail.com*