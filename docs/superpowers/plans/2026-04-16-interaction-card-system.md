# Interaction Card System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract all hover-interaction card variants into a single `components/ui/interaction-cards/` library so every consumer imports from one source of truth.

**Architecture:** Create `components/ui/interaction-cards/` with 10 component files + 1 index re-export. `FlipCard` and `WritingCard` are _merges_ of diverged implementations; `SkillGroupCard` is a new extraction with added hover; the 7 beyond-demo variants are verbatim extractions. All files are `'use client'`. `AboutClient.js`, `_parts.js`, and `beyond-demo/page.js` are then updated to import from the library, deleting their inline definitions. The existing content card system (`Card.js`, `card-utils.js`, `ProjectCard.js`) is never touched.

**Tech Stack:** React / Next.js 15 App Router, Framer Motion (`m`, `useSpring`, `useMotionValue`, `useTransform`, `useMotionTemplate`, `AnimatePresence`, `animate`), CSS custom properties for theming.

---

## File Map

**Create:**
- `components/ui/interaction-cards/FlipCard.js`
- `components/ui/interaction-cards/WritingCard.js`
- `components/ui/interaction-cards/SkillGroupCard.js`
- `components/ui/interaction-cards/GlassGlareCard.js`
- `components/ui/interaction-cards/MagneticCard.js`
- `components/ui/interaction-cards/SpotlightCard.js`
- `components/ui/interaction-cards/CurtainCard.js`
- `components/ui/interaction-cards/SweepCard.js`
- `components/ui/interaction-cards/OutlineCard.js`
- `components/ui/interaction-cards/ElasticGrid.js`
- `components/ui/interaction-cards/index.js`

**Modify:**
- `app/about/AboutClient.js` — remove 4 inline card components + perimeter math; add import; adjust layout
- `app/writing/[slug]/_parts.js` — replace `MiniArticleCard` with `WritingCard` re-export
- `app/beyond-demo/page.js` — remove 8 inline card components; import from library
- `app/globals.css` — remove unused `--flip-back-bg` variable

---

## Task 1: Create FlipCard.js

**Files:**
- Create: `components/ui/interaction-cards/FlipCard.js`

Merges `ThinkingFlipCard` (AboutClient.js:79–140) and `NumberedCard` (AboutClient.js:143–171) and the beyond-demo `FlipCard` (beyond-demo/page.js:75–156). The spec-chosen flip mechanism is the CSS-transition approach from `ThinkingFlipCard` (not Framer `animate`). Back face uses `var(--bg-solid)` (neutral dark, theme-adaptive).

- [ ] **Step 1: Create the file**

```js
'use client';

import { useState } from 'react';
import { m } from 'framer-motion';

export function FlipCard({ num, title, body, titleSize = 'default', minHeight = 280, index = 0 }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <m.div
      initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ minHeight, height: '100%' }}
    >
      <div
        style={{ perspective: '1000px', height: '100%', minHeight, cursor: 'pointer' }}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front face */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              borderRadius: 16,
              padding: '32px 28px',
              background: 'var(--surface)',
              border: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <p
              className="t-caption tabular-nums font-bold"
              style={{ color: 'var(--color-coral)', letterSpacing: '0.08em', margin: 0 }}
            >
              {num}
            </p>
            <p
              className={titleSize === 'lg' ? 't-h4 text-fg' : 't-h5 text-fg'}
              style={{ margin: 0, flex: 1, paddingTop: 20 }}
            >
              {title}
            </p>
            <p className="t-caption text-fg-muted" style={{ margin: 0, opacity: 0.5 }}>
              hover to read
            </p>
          </div>

          {/* Back face */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderRadius: 16,
              padding: '32px 28px',
              background: 'var(--bg-solid)',
              border: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <p
              className="t-caption tabular-nums font-bold"
              style={{ color: 'var(--color-coral)', letterSpacing: '0.08em', margin: 0 }}
            >
              {num}
            </p>
            <p className="t-body2 text-fg" style={{ margin: 0, lineHeight: 1.75 }}>
              {body}
            </p>
          </div>
        </div>
      </div>
    </m.div>
  );
}
```

- [ ] **Step 2: Verify the file exists**

Run: `ls components/ui/interaction-cards/`
Expected: `FlipCard.js`

- [ ] **Step 3: Commit**

```bash
git add components/ui/interaction-cards/FlipCard.js
git commit -m "feat: add FlipCard to interaction-cards library"
```

---

## Task 2: Create WritingCard.js

**Files:**
- Create: `components/ui/interaction-cards/WritingCard.js`

Merges `WritingCard` (AboutClient.js:24–74) and `MiniArticleCard` (_parts.js:21–51). The merged component:
- Always shows emoji + title + CTA row
- Shows desc only when `showDesc={true}` (default)
- Adds `height: '100%'` when `equalHeight={true}`
- Does NOT wrap itself in `<m.div variants={fadeUp}>` — callers handle entry animation

- [ ] **Step 1: Create the file**

```js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { m, useSpring } from 'framer-motion';
import { ArrowIcon } from '@/app/components/ui/icons';

export function WritingCard({ article, showDesc = true, equalHeight = false }) {
  const [isHov, setIsHov] = useState(false);
  const strokeOpacity = useSpring(0.2, { stiffness: 160, damping: 24 });

  return (
    <Link
      href={article.href}
      className="no-underline flex flex-col gap-3"
      style={{
        position: 'relative',
        borderRadius: 16,
        padding: '20px 22px',
        background: 'var(--surface)',
        display: 'flex',
        height: equalHeight ? '100%' : undefined,
        transform: isHov ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHov ? 'var(--shadow-md)' : 'none',
        transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
      }}
      onMouseEnter={() => { setIsHov(true); strokeOpacity.set(0.7); }}
      onMouseLeave={() => { setIsHov(false); strokeOpacity.set(0.2); }}
    >
      {/* Adaptive outline ring */}
      <m.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          border: '1px solid color-mix(in srgb, var(--fg) 50%, transparent)',
          pointerEvents: 'none',
          opacity: strokeOpacity,
        }}
      />

      {/* Emoji */}
      <m.span
        animate={{ scale: isHov ? 1.15 : 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ fontSize: 24, lineHeight: 1, display: 'inline-block', transformOrigin: 'left center' }}
      >
        {article.emoji}
      </m.span>

      {/* Text content */}
      <div className="flex flex-col gap-2" style={{ flex: 1 }}>
        <p className="t-h5 text-fg" style={{ margin: 0 }}>
          {article.title}
        </p>
        {showDesc && article.desc && (
          <p className="t-body2 text-fg-muted" style={{ margin: 0 }}>
            {article.desc}
          </p>
        )}
      </div>

      {/* CTA row */}
      <div
        className="flex items-center gap-1 t-caption font-semibold"
        style={{
          marginTop: 4,
          color: isHov ? 'var(--color-coral)' : 'var(--fg-muted)',
          transition: 'color 0.2s ease',
        }}
      >
        <span>Read</span>
        <span
          style={{
            opacity: isHov ? 1 : 0.45,
            transform: isHov ? 'translate(2px, -2px)' : 'translate(0,0)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            display: 'inline-flex',
          }}
        >
          <ArrowIcon size={11} />
        </span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/interaction-cards/WritingCard.js
git commit -m "feat: add WritingCard to interaction-cards library"
```

---

## Task 3: Create SkillGroupCard.js

**Files:**
- Create: `components/ui/interaction-cards/SkillGroupCard.js`

Extracted from the inline `m.div` blocks in `AboutClient.js:1104–1133`. Adds the Adaptive Outline (H) hover pattern (useSpring stroke ring) which was missing from the plain skill cards.

- [ ] **Step 1: Create the file**

```js
'use client';

import { m, useSpring } from 'framer-motion';

export function SkillGroupCard({ icon, label, skills }) {
  const strokeOpacity = useSpring(0.2, { stiffness: 160, damping: 24 });

  return (
    <div
      style={{ position: 'relative', borderRadius: 16 }}
      onMouseEnter={() => strokeOpacity.set(0.7)}
      onMouseLeave={() => strokeOpacity.set(0.2)}
    >
      {/* Adaptive outline ring */}
      <m.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          border: '1px solid color-mix(in srgb, var(--fg) 50%, transparent)',
          pointerEvents: 'none',
          opacity: strokeOpacity,
        }}
      />

      <div
        className="flex flex-col gap-4 rounded-2xl p-5"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{icon}</span>
          <p className="t-body2 font-semibold text-fg" style={{ margin: 0 }}>
            {label}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="ui-tag"
              style={{
                background: 'color-mix(in srgb, var(--fg) 7%, transparent)',
                color: 'var(--fg-muted)',
                border: '1px solid var(--border)',
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/interaction-cards/SkillGroupCard.js
git commit -m "feat: add SkillGroupCard to interaction-cards library"
```

---

## Task 4: Create GlassGlareCard.js

**Files:**
- Create: `components/ui/interaction-cards/GlassGlareCard.js`

Verbatim extraction of `SubtleCard` from `beyond-demo/page.js:557–666`, renamed to `GlassGlareCard`. Perimeter math functions (`perimToXY`, `cursorToPerimT`, `offsetPerimPoint`) and blob constants are file-local. Props: `{ item: { num, heading, body } }`.

- [ ] **Step 1: Create the file**

```js
'use client';

import { useRef, useCallback } from 'react';
import { m, useMotionValue, useTransform, useSpring } from 'framer-motion';

const BLOB_R       = 80;  // blob radius px
const GLARE_OFFSET = 56;  // how far outside the card boundary the blob center sits
const PARALLAX     = 0.4; // blob moves at 40% of cursor's perimeter speed

// t=0 at bottom-left, clockwise
function perimToXY(t, w, h) {
  const P  = 2 * (w + h);
  const tn = ((t % P) + P) % P;
  if (tn <= w)          return { x: tn,               y: h };
  if (tn <= w + h)      return { x: w,                y: h - (tn - w) };
  if (tn <= 2 * w + h)  return { x: w - (tn - w - h), y: 0 };
  return                       { x: 0,                y: tn - 2 * w - h };
}

// Ray from card centre through cursor hits perimeter — no Voronoi zone jumps
function cursorToPerimT(x, y, w, h) {
  const cx = w / 2, cy = h / 2;
  const dx = x - cx || 0.001;
  const dy = y - cy || 0.001;
  const ts = [
    dx < 0 ? (0 - cx) / dx : Infinity,
    dx > 0 ? (w - cx) / dx : Infinity,
    dy < 0 ? (0 - cy) / dy : Infinity,
    dy > 0 ? (h - cy) / dy : Infinity,
  ].filter(s => s > 0 && isFinite(s));
  const s  = Math.min(...ts);
  const px = Math.max(0, Math.min(w, cx + s * dx));
  const py = Math.max(0, Math.min(h, cy + s * dy));
  const eps = 0.5;
  if (px < eps)     return 2 * w + h + py;
  if (px > w - eps) return w + (h - py);
  if (py < eps)     return w + h + (w - px);
  return px;
}

// Radial offset from card centre — smooth through corners
function offsetPerimPoint(px, py, w, h) {
  const cx = w / 2, cy = h / 2;
  const dx = px - cx, dy = py - cy;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return { x: px + (dx / len) * GLARE_OFFSET, y: py + (dy / len) * GLARE_OFFSET };
}

export function GlassGlareCard({ item }) {
  const cardRef    = useRef(null);
  const cardDims   = useRef({ w: 0, h: 0 });
  const perimCanon = useRef(0);

  const perimBlob  = useMotionValue(0);
  const glowX = useTransform(perimBlob, t => {
    const { w, h } = cardDims.current;
    if (!w || !h) return 0;
    const { x: px, y: py } = perimToXY(t, w, h);
    return offsetPerimPoint(px, py, w, h).x;
  });
  const glowY = useTransform(perimBlob, t => {
    const { w, h } = cardDims.current;
    if (!w || !h) return 0;
    const { x: px, y: py } = perimToXY(t, w, h);
    return offsetPerimPoint(px, py, w, h).y;
  });
  const glowOpacity = useSpring(0, { stiffness: 80, damping: 28 });
  const glowLeft = useTransform(glowX, v => v - BLOB_R);
  const glowTop  = useTransform(glowY, v => v - BLOB_R);

  const updateGlare = useCallback((ex, ey) => {
    const { w, h } = cardDims.current;
    if (!w || !h) return;
    const P       = 2 * (w + h);
    const rawT    = cursorToPerimT(ex, ey, w, h);
    const rawNorm = ((rawT % P) + P) % P;
    const curNorm = ((perimCanon.current % P) + P) % P;
    let delta = rawNorm - curNorm;
    if (delta >  P / 2) delta -= P;
    if (delta < -P / 2) delta += P;
    perimCanon.current += delta;
    perimBlob.set(perimBlob.get() + delta * PARALLAX);
  }, [perimBlob]);

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current.getBoundingClientRect();
    cardDims.current = { w: rect.width, h: rect.height };
    updateGlare(e.clientX - rect.left, e.clientY - rect.top);
  }, [updateGlare]);

  const handleMouseEnter = useCallback((e) => {
    const rect = cardRef.current.getBoundingClientRect();
    cardDims.current = { w: rect.width, h: rect.height };
    const snapT = cursorToPerimT(e.clientX - rect.left, e.clientY - rect.top, cardDims.current.w, cardDims.current.h);
    perimCanon.current = snapT;
    perimBlob.set(snapT);
    glowOpacity.set(1);
  }, [perimBlob, glowOpacity]);

  const handleMouseLeave = useCallback(() => {
    glowOpacity.set(0);
  }, [glowOpacity]);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        style={{
          borderRadius: 16,
          padding: '24px 22px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'default',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Blur blob — center lives outside card boundary, overflow:hidden clips it */}
        <m.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: BLOB_R * 2,
            height: BLOB_R * 2,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.55)',
            filter: 'blur(56px)',
            x: glowLeft,
            y: glowTop,
            opacity: glowOpacity,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <p
          style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-coral)', margin: 0, position: 'relative', zIndex: 1 }}
        >
          {item.num}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4, margin: 0 }}>
            {item.heading}
          </p>
          <p style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.8, margin: 0 }}>
            {item.body}
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/interaction-cards/GlassGlareCard.js
git commit -m "feat: add GlassGlareCard to interaction-cards library"
```

---

## Task 5: Create MagneticCard.js

**Files:**
- Create: `components/ui/interaction-cards/MagneticCard.js`

Verbatim extraction of `MagneticCard` from `beyond-demo/page.js:163–255`. Props: `{ item: { num, heading, body } }`.

- [ ] **Step 1: Create the file**

```js
'use client';

import { useState, useRef, useCallback } from 'react';
import { m, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';

export function MagneticCard({ item }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback((e) => {
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(nx);
    y.set(ny);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setHovered(false);
  }, [x, y]);

  return (
    <m.div
      ref={ref}
      style={{ perspective: 800, height: 220, cursor: 'default' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <m.div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 16,
          padding: '24px 22px',
          background: 'var(--surface)',
          border: `1px solid ${hovered ? 'color-mix(in srgb, var(--fg) 20%, transparent)' : 'var(--border)'}`,
          boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          transition: 'border-color 0.25s ease, box-shadow 0.3s ease',
        }}
      >
        <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-coral)', margin: 0, transform: 'translateZ(20px)' }}>
          {item.num}
        </p>
        <div style={{ transform: 'translateZ(20px)' }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4, margin: 0 }}>
            {item.heading}
          </p>
        </div>
        <AnimatePresence>
          {hovered && (
            <m.div
              initial={{ y: 40, opacity: 0, filter: 'blur(6px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: 40, opacity: 0, filter: 'blur(6px)' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px 22px',
                background: 'linear-gradient(to top, var(--surface) 80%, transparent)',
                borderRadius: '0 0 16px 16px',
              }}
            >
              <p style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.75, margin: 0 }}>
                {item.body}
              </p>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </m.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/interaction-cards/MagneticCard.js
git commit -m "feat: add MagneticCard to interaction-cards library"
```

---

## Task 6: Create SpotlightCard.js

**Files:**
- Create: `components/ui/interaction-cards/SpotlightCard.js`

Verbatim extraction of `SpotlightCard` from `beyond-demo/page.js:262–329`. Props: `{ item: { num, heading, body } }`.

- [ ] **Step 1: Create the file**

```js
'use client';

import { useState, useRef, useCallback } from 'react';
import { m } from 'framer-motion';

export function SpotlightCard({ item }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e) => {
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <m.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 220,
        borderRadius: 16,
        padding: '24px 22px',
        background: 'var(--surface)',
        border: `1px solid ${hovered ? 'color-mix(in srgb, var(--brand) 40%, transparent)' : 'var(--border)'}`,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'border-color 0.3s ease',
      }}
    >
      <m.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle 120px at ${pos.x}% ${pos.y}%, color-mix(in srgb, var(--brand) 14%, transparent) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-coral)', margin: 0, position: 'relative' }}>
        {item.num}
      </p>
      <div style={{ position: 'relative' }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4, margin: 0 }}>
          {item.heading}
        </p>
        <m.p
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.75, marginTop: 10, marginBottom: 0 }}
        >
          {item.body}
        </m.p>
      </div>
    </m.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/interaction-cards/SpotlightCard.js
git commit -m "feat: add SpotlightCard to interaction-cards library"
```

---

## Task 7: Create CurtainCard.js

**Files:**
- Create: `components/ui/interaction-cards/CurtainCard.js`

Verbatim extraction of `CurtainCard` from `beyond-demo/page.js:343–440`. Props: `{ item: { num, heading, body } }`.

- [ ] **Step 1: Create the file**

```js
'use client';

import { useState } from 'react';
import { m } from 'framer-motion';

// SVG feTurbulence noise as a data URI — renders as subtle film grain
const NOISE_BG = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Rich dark gradient — always dark regardless of theme
const CURTAIN_GRADIENT = 'linear-gradient(145deg, #0c0b1e 0%, #1a1535 45%, #0d1827 100%)';

export function CurtainCard({ item }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'default',
        border: '1px solid var(--border)',
        minHeight: 240,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Front face */}
      <div
        style={{
          padding: '24px 22px',
          background: 'var(--surface)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 240,
          gap: 48,
        }}
      >
        <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-coral)', margin: 0 }}>
          {item.num}
        </p>
        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4, margin: 0 }}>
          {item.heading}
        </p>
      </div>

      {/* Curtain — sweeps down from top */}
      <m.div
        initial={false}
        animate={{ clipPath: hovered ? 'inset(0% 0% 0% 0% round 16px)' : 'inset(0% 0% 100% 0% round 16px)' }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: 'absolute',
          inset: 0,
          background: CURTAIN_GRADIENT,
          padding: '24px 22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 16,
          minHeight: 240,
        }}
      >
        {/* Noise grain overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: NOISE_BG,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            opacity: 0.035,
            pointerEvents: 'none',
            mixBlendMode: 'overlay',
          }}
        />
        {/* Diagonal highlight streak */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />
        <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(160,140,220,0.55)', margin: 0, position: 'relative' }}>
          {item.num}
        </p>
        <div style={{ position: 'relative' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.92)', lineHeight: 1.4, marginBottom: 12, margin: '0 0 12px 0' }}>
            {item.heading}
          </p>
          <m.p
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
            transition={{ duration: 0.32, delay: hovered ? 0.18 : 0, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 12, color: 'rgba(200,190,230,0.7)', lineHeight: 1.8, margin: 0 }}
          >
            {item.body}
          </m.p>
        </div>
      </m.div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/interaction-cards/CurtainCard.js
git commit -m "feat: add CurtainCard to interaction-cards library"
```

---

## Task 8: Create SweepCard.js

**Files:**
- Create: `components/ui/interaction-cards/SweepCard.js`

Verbatim extraction of `SweepCard` from `beyond-demo/page.js:672–734`. Props: `{ item: { num, heading, body } }`.

- [ ] **Step 1: Create the file**

```js
'use client';

import { useState, useCallback } from 'react';
import { m, useMotionValue, useSpring, useMotionTemplate, animate } from 'framer-motion';

export function SweepCard({ item }) {
  const [hovered, setHovered] = useState(false);
  const borderAngle   = useMotionValue(0);
  const borderOpacity = useSpring(0, { stiffness: 180, damping: 26 });
  const borderBg = useMotionTemplate`conic-gradient(from ${borderAngle}deg at 50% 50%, transparent 0%, rgba(255,255,255,0.18) 10%, rgba(255,255,255,0.32) 17%, rgba(255,255,255,0.18) 24%, transparent 34%)`;

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    borderOpacity.set(1);
    borderAngle.set(0);
    animate(borderAngle, 360, { duration: 1.1, ease: [0.3, 0, 0.3, 1] });
  }, [borderAngle, borderOpacity]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    borderOpacity.set(0);
  }, [borderOpacity]);

  return (
    <div
      style={{ position: 'relative', borderRadius: 16 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sweep ring */}
      <m.div
        style={{
          position: 'absolute',
          inset: -1,
          borderRadius: 17,
          background: borderBg,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          padding: 1,
          pointerEvents: 'none',
          opacity: borderOpacity,
        }}
      />
      <div
        style={{
          borderRadius: 16,
          padding: '24px 22px',
          background: 'var(--surface)',
          border: `1px solid ${hovered ? 'color-mix(in srgb, var(--fg) 20%, transparent)' : 'var(--border)'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          transition: 'border-color 0.4s ease',
        }}
      >
        <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-coral)', margin: 0 }}>
          {item.num}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4, margin: 0 }}>{item.heading}</p>
          <p style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.8, margin: 0 }}>{item.body}</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/interaction-cards/SweepCard.js
git commit -m "feat: add SweepCard to interaction-cards library"
```

---

## Task 9: Create OutlineCard.js

**Files:**
- Create: `components/ui/interaction-cards/OutlineCard.js`

Verbatim extraction of `OutlineCard` from `beyond-demo/page.js:741–771`. Props: `{ item: { num, heading, body } }`.

- [ ] **Step 1: Create the file**

```js
'use client';

import { m, useSpring } from 'framer-motion';

export function OutlineCard({ item }) {
  const strokeOpacity = useSpring(0.2, { stiffness: 160, damping: 24 });

  return (
    <div
      style={{ position: 'relative', borderRadius: 16, cursor: 'default' }}
      onMouseEnter={() => strokeOpacity.set(0.7)}
      onMouseLeave={() => strokeOpacity.set(0.2)}
    >
      <m.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 16,
          border: '1px solid color-mix(in srgb, var(--fg) 50%, transparent)',
          opacity: strokeOpacity,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          borderRadius: 16,
          padding: '24px 22px',
          background: 'var(--surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-coral)', margin: 0 }}>
          {item.num}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4, margin: 0 }}>{item.heading}</p>
          <p style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.8, margin: 0 }}>{item.body}</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/interaction-cards/OutlineCard.js
git commit -m "feat: add OutlineCard to interaction-cards library"
```

---

## Task 10: Create ElasticGrid.js

**Files:**
- Create: `components/ui/interaction-cards/ElasticGrid.js`

Verbatim extraction of `ElasticGrid` from `beyond-demo/page.js:447–505`. This is a grid-level component (manages shared sibling state across all 4 cards simultaneously). It imports its own `ITEMS` data locally — this data is beyond-demo showcase content, not page data passed via props.

- [ ] **Step 1: Create the file**

```js
'use client';

import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';

const ITEMS = [
  {
    num: '01',
    heading: 'Maker by instinct',
    body: "I've built apps, launched brands, sold plants online, and once nearly started a 3D print farm. The businesses that worked taught me about users. The ones that didn't taught me about everything else.",
  },
  {
    num: '02',
    heading: "I learn when I'm stuck",
    body: "The things I know best, I learned because a problem forced me to. Not from a planned reading list — from a question I couldn't answer until I went looking. A video essay at 1am. A thread that led to three more.",
  },
  {
    num: '03',
    heading: 'Opinionated about craft',
    body: "I have strong opinions about the design community's love of process theater — the double diamonds, the 'how might we' workshops. Most aren't wrong. They're just taught wrong. As rituals instead of tools.",
  },
  {
    num: '04',
    heading: 'Started before the rules',
    body: "Digital design in the early 2000s meant Flash, no grids, no systems, no precedent. The only brief was 'make it work.' That era is gone — but the mindset isn't.",
  },
];

export function ElasticGrid() {
  const [active, setActive] = useState(null);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignItems: 'start' }}>
      {ITEMS.map((item, i) => {
        const isActive  = active === i;
        const isSibling = active !== null && !isActive;

        return (
          <m.div
            key={item.num}
            layout
            animate={{
              scale:   isActive ? 1.03 : isSibling ? 0.97 : 1,
              opacity: isSibling ? 0.55 : 1,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              borderRadius: 16,
              padding: '24px 22px',
              background: isActive
                ? 'color-mix(in srgb, var(--brand) 8%, var(--surface))'
                : 'var(--surface)',
              border: `1px solid ${isActive ? 'color-mix(in srgb, var(--brand) 30%, transparent)' : 'var(--border)'}`,
              cursor: 'default',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: isActive ? 'var(--brand)' : 'var(--color-coral)', margin: 0, marginBottom: 16, transition: 'color 0.2s' }}>
              {item.num}
            </p>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4, margin: 0 }}>
              {item.heading}
            </p>
            <AnimatePresence>
              {isActive && (
                <m.p
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.75, overflow: 'hidden', margin: 0 }}
                >
                  {item.body}
                </m.p>
              )}
            </AnimatePresence>
          </m.div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/interaction-cards/ElasticGrid.js
git commit -m "feat: add ElasticGrid to interaction-cards library"
```

---

## Task 11: Create index.js and verify the complete library

**Files:**
- Create: `components/ui/interaction-cards/index.js`

- [ ] **Step 1: Create the index file**

```js
export { FlipCard }       from './FlipCard';
export { WritingCard }    from './WritingCard';
export { SkillGroupCard } from './SkillGroupCard';
export { GlassGlareCard } from './GlassGlareCard';
export { MagneticCard }   from './MagneticCard';
export { SpotlightCard }  from './SpotlightCard';
export { CurtainCard }    from './CurtainCard';
export { SweepCard }      from './SweepCard';
export { OutlineCard }    from './OutlineCard';
export { ElasticGrid }    from './ElasticGrid';
```

- [ ] **Step 2: Verify all 11 files are present**

Run: `ls components/ui/interaction-cards/`
Expected output (in any order):
```
CurtainCard.js   ElasticGrid.js   FlipCard.js      GlassGlareCard.js
MagneticCard.js  OutlineCard.js   SkillGroupCard.js SpotlightCard.js
SweepCard.js     WritingCard.js   index.js
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/interaction-cards/index.js
git commit -m "feat: add interaction-cards index — library complete"
```

---

## Task 12: Update AboutClient.js

**Files:**
- Modify: `app/about/AboutClient.js`

Six changes in one file:
1. Add import from interaction-cards
2. Delete inline `WritingCard`, `ThinkingFlipCard`, `NumberedCard`, `WhatIBringCard` + `STROKE_RING` + all perimeter math constants/functions (lines 16–341)
3. Writing section: remove "All writing on Notion" button, add `items-stretch` to grid, wrap each card in `<m.div variants={fadeUp}>`
4. 5 Things I Bring section: replace `<WhatIBringCard>` with `<FlipCard titleSize="lg">`
5. Beyond the Work section: replace `<NumberedCard>` with `<FlipCard>`
6. What I'm Thinking section: replace `<ThinkingFlipCard>` with `<FlipCard>`
7. Skills & Expertise section: replace inline `m.div` blocks with `<SkillGroupCard>`
8. How I Work desktop grid: `gap-8` → `gap-4`, `'1fr 2fr'` → `'1fr 2.5fr'`

- [ ] **Step 1: Add the import after the existing imports block**

Find this line in `app/about/AboutClient.js`:
```js
import { SECTION_STYLES } from '@/lib/section-styles';
```

Add after it:
```js
import { FlipCard, WritingCard, SkillGroupCard } from '@/app/components/ui/interaction-cards';
```

- [ ] **Step 2: Delete the STROKE_RING constant and all 4 inline card components**

Delete lines 16–341 (everything from `/* ── Shared stroke ring */` through the closing `}` of `WhatIBringCard`). This removes:
- `STROKE_RING` constant
- `WritingCard` function (lines 23–74)
- `ThinkingFlipCard` function (lines 76–140)
- `NumberedCard` function (lines 142–171)
- Perimeter math constants `WIB_BLOB_R`, `WIB_GLARE_OFFSET`, `WIB_PARALLAX` (lines 173–176)
- `wibPerimToXY`, `wibCursorToPerimT`, `wibOffsetPerimPoint` functions (lines 178–212)
- `WhatIBringCard` function (lines 214–341)

After deletion, also remove `useCallback` from the React import at line 3 (it was only used by `WhatIBringCard`). The new line 3 becomes:
```js
import { useState, useEffect, useRef } from 'react';
```

Also remove `useMotionValue, useTransform` from the framer-motion import — these were only used by `WhatIBringCard`. New line 4 becomes:
```js
import { m, AnimatePresence, useSpring } from 'framer-motion';
```

- [ ] **Step 3: Update the Writing section**

Find (approximately, after the section restructure):
```jsx
<div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
  <m.p variants={fadeUp} className="t-overline text-fg-muted">Writing</m.p>
  <m.div variants={fadeUp}>
    <Button
      href={NOTION_ABOUT}
      external
      variant="link"
      size="sm"
      icon={<ArrowIcon size={11} />}
    >
      All writing on Notion
    </Button>
  </m.div>
</div>

<div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  {displayArticles.map((article) => (
    <WritingCard key={article.title} article={article} />
  ))}
</div>
```

Replace with:
```jsx
<m.p variants={fadeUp} className="t-overline text-fg-muted mb-8">Writing</m.p>

<div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
  {displayArticles.map((article) => (
    <m.div key={article.title} variants={fadeUp}>
      <WritingCard article={article} equalHeight />
    </m.div>
  ))}
</div>
```

- [ ] **Step 4: Update the 5 Things I Bring section**

Find:
```jsx
<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
  {WHAT_I_BRING_ITEMS.slice(0, 3).map((item, i) => (
    <WhatIBringCard
      key={item.title}
      item={item}
      index={i}
      textClr={SECTION_STYLES[4].textClr}
      mutedClr={SECTION_STYLES[4].mutedClr}
    />
  ))}
</div>
<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 mb-12">
  {WHAT_I_BRING_ITEMS.slice(3).map((item, i) => (
    <WhatIBringCard
      key={item.title}
      item={item}
      index={i + 3}
      textClr={SECTION_STYLES[4].textClr}
      mutedClr={SECTION_STYLES[4].mutedClr}
    />
  ))}
</div>
```

Replace with:
```jsx
<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
  {WHAT_I_BRING_ITEMS.slice(0, 3).map((item, i) => (
    <FlipCard
      key={item.title}
      num={String(i + 1).padStart(2, '0')}
      title={item.title}
      body={item.body}
      titleSize="lg"
      minHeight={280}
      index={i}
    />
  ))}
</div>
<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 mb-12">
  {WHAT_I_BRING_ITEMS.slice(3).map((item, i) => (
    <FlipCard
      key={item.title}
      num={String(i + 4).padStart(2, '0')}
      title={item.title}
      body={item.body}
      titleSize="lg"
      minHeight={280}
      index={i + 3}
    />
  ))}
</div>
```

- [ ] **Step 5: Update Beyond the Work section**

Find:
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
  {BEYOND_ITEMS.map((card, i) => (
    <NumberedCard key={card.heading} heading={card.heading} body={card.body} index={i} style={{ minHeight: 220 }} />
  ))}
</div>
```

Replace with:
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
  {BEYOND_ITEMS.map((card, i) => (
    <FlipCard
      key={card.heading}
      num={String(i + 1).padStart(2, '0')}
      title={card.heading}
      body={card.body}
      minHeight={220}
      index={i}
    />
  ))}
</div>
```

- [ ] **Step 6: Update What I'm Thinking section**

Find:
```jsx
{THINKING_ITEMS.slice(0, thinkingExpanded ? undefined : THINKING_INITIAL).map((item, i) => (
  <ThinkingFlipCard
    key={item.id || item.label}
    heading={item.title || item.label}
    body={item.description || item.desc}
    index={i}
  />
))}
```

Replace with:
```jsx
{THINKING_ITEMS.slice(0, thinkingExpanded ? undefined : THINKING_INITIAL).map((item, i) => (
  <FlipCard
    key={item.id || item.label}
    num={String(i + 1).padStart(2, '0')}
    title={item.title || item.label}
    body={item.description || item.desc}
    minHeight={280}
    index={i}
  />
))}
```

- [ ] **Step 7: Update Skills & Expertise section**

Find:
```jsx
<div className="grid sm:grid-cols-2 gap-6">
  {SKILL_GROUPS.map((group) => (
    <m.div
      key={group.label}
      variants={fadeUp}
      className="flex flex-col gap-4 rounded-2xl p-5"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl leading-none">{group.icon}</span>
        <p className="t-body2 font-semibold text-fg" style={{ margin: 0 }}>{group.label}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {group.skills.map((skill) => (
          <span
            key={skill}
            className="ui-tag"
            style={{
              background: 'color-mix(in srgb, var(--fg) 7%, transparent)',
              color: 'var(--fg-muted)',
              border: '1px solid var(--border)',
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </m.div>
  ))}
</div>
```

Replace with:
```jsx
<div className="grid sm:grid-cols-2 gap-6">
  {SKILL_GROUPS.map((group) => (
    <m.div key={group.label} variants={fadeUp}>
      <SkillGroupCard icon={group.icon} label={group.label} skills={group.skills} />
    </m.div>
  ))}
</div>
```

- [ ] **Step 8: Update How I Work desktop grid**

Find:
```jsx
<div className="hidden md:grid gap-8" style={{ gridTemplateColumns: '1fr 2fr' }}>
```

Replace with:
```jsx
<div className="hidden md:grid gap-4" style={{ gridTemplateColumns: '1fr 2.5fr' }}>
```

- [ ] **Step 9: Start dev server and visually verify all 6 sections**

Run: `npm run dev`

Navigate to `http://localhost:3000/about` and check:
- Writing section: 4 cards same height, no "All writing on Notion" button
- 5 Things I Bring: FlipCards with large title, neutral dark back face on hover
- Beyond the Work: FlipCards with 220px min-height
- What I'm Thinking: FlipCards with stagger entry animation
- Skills & Expertise: Cards have stroke ring brightening on hover
- How I Work: narrower left column, wider right column

Check both dark and light theme using the theme toggle.

- [ ] **Step 10: Commit**

```bash
git add app/about/AboutClient.js
git commit -m "refactor: migrate AboutClient to interaction-cards library"
```

---

## Task 13: Update _parts.js

**Files:**
- Modify: `app/writing/[slug]/_parts.js`

Replace the inline `MiniArticleCard` with a re-export of `WritingCard` under the same name, so `ArticleClient.js` needs no changes.

- [ ] **Step 1: Open `app/writing/[slug]/_parts.js`**

Current file (52 lines):
```js
'use client';

import Link from 'next/link';

export function BackArrow() { ... }
export function ExternalArrow() { ... }
export function MiniArticleCard({ article }) { ... }
```

- [ ] **Step 2: Replace MiniArticleCard with a re-export**

New file content — keep `BackArrow` and `ExternalArrow` unchanged, replace only the `MiniArticleCard` function:

```js
'use client';

import Link from 'next/link';
import { WritingCard } from '@/app/components/ui/interaction-cards';

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
  return <WritingCard article={article} showDesc={false} equalHeight />;
}
```

- [ ] **Step 3: Verify article page**

Navigate to any article at `http://localhost:3000/writing/[any-slug]` and scroll to "More writing" section. Cards should have the WritingCard interaction (stroke ring, lift on hover, emoji scale) instead of the old plain border-change style.

- [ ] **Step 4: Commit**

```bash
git add app/writing/[slug]/_parts.js
git commit -m "refactor: replace MiniArticleCard with WritingCard from interaction-cards"
```

---

## Task 14: Update beyond-demo/page.js

**Files:**
- Modify: `app/beyond-demo/page.js`

Remove all 8 inline card component definitions (FlipCard, MagneticCard, SpotlightCard, CurtainCard, ElasticGrid, SubtleCard, SweepCard, OutlineCard) and the perimeter math block. Import from the library. Update the `SubtleCard` render call to `GlassGlareCard`. Update `FlipCard` call to use the new prop API (`num`, `title`, `body` instead of `item`).

The `DemoSection` shell and `ITEMS` data array remain inline — they are page-specific.

- [ ] **Step 1: Replace the file's import block and remove inline components**

The new top of `beyond-demo/page.js` (replace everything from `'use client'` through the end of `OutlineCard` function, up to the `/* ── Page ──` comment):

```js
'use client';

import { useState } from 'react';
import {
  FlipCard,
  MagneticCard,
  SpotlightCard,
  CurtainCard,
  ElasticGrid,
  GlassGlareCard,
  SweepCard,
  OutlineCard,
} from '@/app/components/ui/interaction-cards';

/* ── Data ──────────────────────────────────────────────────────────────── */
const ITEMS = [
  {
    num: '01',
    heading: 'Maker by instinct',
    body: "I've built apps, launched brands, sold plants online, and once nearly started a 3D print farm. The businesses that worked taught me about users. The ones that didn't taught me about everything else.",
  },
  {
    num: '02',
    heading: "I learn when I'm stuck",
    body: "The things I know best, I learned because a problem forced me to. Not from a planned reading list — from a question I couldn't answer until I went looking. A video essay at 1am. A thread that led to three more.",
  },
  {
    num: '03',
    heading: 'Opinionated about craft',
    body: "I have strong opinions about the design community's love of process theater — the double diamonds, the 'how might we' workshops. Most aren't wrong. They're just taught wrong. As rituals instead of tools.",
  },
  {
    num: '04',
    heading: 'Started before the rules',
    body: "Digital design in the early 2000s meant Flash, no grids, no systems, no precedent. The only brief was 'make it work.' That era is gone — but the mindset isn't.",
  },
];

/* ── Shared demo shell ─────────────────────────────────────────────────── */
function DemoSection({ label, sublabel, children }) {
  return (
    <section style={{ marginBottom: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
          {label}
        </p>
        <p style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.6, maxWidth: 520 }}>
          {sublabel}
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update the Page component render — replace card usages**

Find in the `BeyondDemo` page component the `{/* A — Flip */}` block:
```jsx
{ITEMS.map((item) => <FlipCard key={item.num} item={item} />)}
```

Replace with (new API maps `heading` → `title`):
```jsx
{ITEMS.map((item, i) => (
  <FlipCard
    key={item.num}
    num={item.num}
    title={item.heading}
    body={item.body}
    index={i}
  />
))}
```

- [ ] **Step 3: Replace SubtleCard usage with GlassGlareCard**

Find:
```jsx
{ITEMS.map((item) => <SubtleCard key={item.num} item={item} />)}
```

Replace with:
```jsx
{ITEMS.map((item) => <GlassGlareCard key={item.num} item={item} />)}
```

Also update the label in the `DemoSection` that wraps it:
```jsx
<DemoSection
  label="Option F — Glass Glare (perimeter-locked blur)"
```
(label text stays the same — already says "Glass Glare")

- [ ] **Step 4: Verify `beyond-demo` page**

Navigate to `http://localhost:3000/beyond-demo`. All 8 sections (A through H) should render and interact identically to before. The Elastic Grid section (E) has its data embedded in `ElasticGrid.js` so it still displays all 4 items.

- [ ] **Step 5: Commit**

```bash
git add app/beyond-demo/page.js
git commit -m "refactor: migrate beyond-demo to interaction-cards library"
```

---

## Task 15: Remove --flip-back-bg from globals.css

**Files:**
- Modify: `app/globals.css`

`--flip-back-bg` was only used by `ThinkingFlipCard` (now deleted). FlipCard uses `var(--bg-solid)` directly. Remove the orphaned variable from both dark and light theme blocks.

- [ ] **Step 1: Remove the dark-theme declaration**

Find in `app/globals.css` (around line 144–145):
```css
  /* Flip card back */
  --flip-back-bg:            #19223d;
```

Delete both lines (the comment and the variable declaration).

- [ ] **Step 2: Remove the light-theme declaration**

Find (around line 212):
```css
  --flip-back-bg:            #f5f4f0;
```

Delete this line.

- [ ] **Step 3: Verify no remaining usages**

Run: `grep -r "flip-back-bg" app/`
Expected: no output (zero results)

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "chore: remove unused --flip-back-bg CSS variable"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| FlipCard — CSS rotateY, neutral dark back, entry animation | Task 1 |
| WritingCard — stroke ring, lift, emoji scale, showDesc, equalHeight | Task 2 |
| SkillGroupCard — extracted + Adaptive Outline hover added | Task 3 |
| GlassGlareCard — perimeter math, blob, parallax | Task 4 |
| MagneticCard, SpotlightCard, CurtainCard, SweepCard, OutlineCard | Tasks 5–9 |
| ElasticGrid | Task 10 |
| index.js re-exports | Task 11 |
| AboutClient — all 6 section updates, layout tweaks | Task 12 |
| _parts.js — MiniArticleCard replaced | Task 13 |
| beyond-demo — imports from library | Task 14 |
| --flip-back-bg removal | Task 15 |
| "All writing on Notion" button removed | Task 12 Step 3 |
| How I Work gap-4 / 1fr 2.5fr | Task 12 Step 8 |

**Placeholder scan:** No TODOs or TBDs.

**Type/name consistency check:**
- `FlipCard` props: `num`, `title`, `body`, `titleSize`, `minHeight`, `index` — consistent across Task 1, Task 12 Steps 4–6, Task 14 Step 2.
- `WritingCard` props: `article`, `showDesc`, `equalHeight` — consistent across Task 2, Task 12 Step 3, Task 13 Step 2.
- `SkillGroupCard` props: `icon`, `label`, `skills` — consistent across Task 3, Task 12 Step 7.
- `GlassGlareCard`, `MagneticCard`, etc.: `{ item }` — consistent across Tasks 4–9, Task 14.
- beyond-demo `ITEMS` shape: `{ num, heading, body }` — FlipCard call in Task 14 correctly maps `item.heading → title`. All other card calls use `item` directly (unchanged API).
