# Article Reactions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add globally persistent emoji reactions (bar + card styles) to every article page, backed by Vercel KV (Redis), with optimistic UI and cookie-based dedup.

**Architecture:** A single `ArticleReactions` client component renders two visual styles (responsive pill bar + emoji card grid) sharing one state object. A Next.js API route handles GET/POST against Vercel KV. A `lib/reactions.js` helper owns all KV logic so the route stays thin.

**Tech Stack:** `@vercel/kv`, Next.js App Router API routes, `next/headers` cookies, Framer Motion (`fadeUp`/`stagger`/`vp` from `lib/motion.js`), Tailwind CSS + CSS custom properties.

> **Note:** No test framework is set up in this project. Each task uses manual browser/curl verification instead of automated tests.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `lib/reactions.js` | `REACTIONS` constant, `getReactions(slug)`, `setReaction(slug, prev, next)` |
| Create | `app/api/reactions/route.js` | GET + POST handlers, cookie read/write |
| Create | `app/components/sections/ArticleReactions.js` | Client component — state, bar, cards |
| Modify | `app/writing/[slug]/ArticleClient.js` | Import and slot `<ArticleReactions>` |
| Modify | `app/style-guide/page.js` | Add Reactions section |

---

## Task 1: Install @vercel/kv and configure env

**Files:**
- Modify: `package.json` (via npm)
- Modify: `.env.local`

- [ ] **Step 1: Install the package**

```bash
npm install @vercel/kv
```

Expected output: package added to `node_modules`, `@vercel/kv` appears in `package.json` dependencies.

- [ ] **Step 2: Add placeholder env vars to `.env.local`**

Append to `.env.local`:
```
# Vercel KV — get real values from Vercel dashboard > Storage > your KV store > .env.local tab
KV_URL=redis://localhost:6379
KV_REST_API_URL=http://localhost:6379
KV_REST_API_TOKEN=placeholder
KV_REST_API_READ_ONLY_TOKEN=placeholder
```

> For real local dev: create a free Upstash Redis at upstash.com, then paste the four env vars it gives you. The API route degrades gracefully if KV is unreachable (returns zero counts, no crash).

- [ ] **Step 3: Verify dev server still starts**

```bash
npm run dev
```

Expected: server starts on `localhost:3000` with no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install @vercel/kv for article reactions"
```

---

## Task 2: lib/reactions.js — constants and KV helpers

**Files:**
- Create: `lib/reactions.js`

- [ ] **Step 1: Create the file**

```js
import { kv } from '@vercel/kv';

export const REACTIONS = [
  { key: 'thoughtful', emoji: '🤔', label: 'Thoughtful' },
  { key: 'helpful',    emoji: '👍', label: 'Helpful'    },
  { key: 'loved',      emoji: '❤️', label: 'Loved it'   },
  { key: 'mindblown',  emoji: '🤯', label: 'Mind-blown' },
  { key: 'relatable',  emoji: '🙏', label: 'Relatable'  },
];

const VALID_KEYS = new Set(REACTIONS.map((r) => r.key));

function emptycounts() {
  return Object.fromEntries(REACTIONS.map((r) => [r.key, 0]));
}

/**
 * Fetch reaction counts for an article slug.
 * Returns { counts, total, error? }
 */
export async function getReactions(slug) {
  try {
    const raw = (await kv.hgetall(`reactions:${slug}`)) ?? {};
    const counts = {};
    let total = 0;
    for (const { key } of REACTIONS) {
      counts[key] = Math.max(0, parseInt(raw[key] ?? 0, 10));
      total += counts[key];
    }
    return { counts, total };
  } catch {
    return { counts: emptyounts(), total: 0, error: true };
  }
}

/**
 * Atomically swap reactions for an article.
 * prevReaction: current selection (string | null)
 * newReaction:  new selection (string | null — null = deselect)
 * Returns updated { counts, total, error? }
 */
export async function setReaction(slug, prevReaction, newReaction) {
  try {
    const pipeline = kv.pipeline();
    if (prevReaction && VALID_KEYS.has(prevReaction)) {
      pipeline.hincrby(`reactions:${slug}`, prevReaction, -1);
    }
    if (newReaction && VALID_KEYS.has(newReaction)) {
      pipeline.hincrby(`reactions:${slug}`, newReaction, 1);
    }
    await pipeline.exec();
  } catch {
    // Fall through — getReactions will return current state
  }
  return getReactions(slug);
}
```

- [ ] **Step 2: Fix the typo introduced above**

In `getReactions`, the catch block calls `emptyounts()` — fix to `emptyCount()`. Actually, correct both the function definition and the call to use a consistent name. The function defined above as `emptyounts` should be `emptyCounts`:

```js
function emptyCounts() {
  return Object.fromEntries(REACTIONS.map((r) => [r.key, 0]));
}
```

And in the catch block:
```js
return { counts: emptyCounts(), total: 0, error: true };
```

- [ ] **Step 3: Commit**

```bash
git add lib/reactions.js
git commit -m "feat: add reactions KV helpers and REACTIONS constant"
```

---

## Task 3: GET /api/reactions

**Files:**
- Create: `app/api/reactions/route.js`

- [ ] **Step 1: Create the route file with the GET handler**

```js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getReactions, REACTIONS } from '@/lib/reactions';

const VALID_KEYS = new Set(REACTIONS.map((r) => r.key));

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const userReaction = cookieStore.get(`reaction_${slug}`)?.value ?? null;
  const safeUserReaction = userReaction && VALID_KEYS.has(userReaction) ? userReaction : null;

  const { counts, total, error } = await getReactions(slug);

  return NextResponse.json({ counts, total, userReaction: safeUserReaction, ...(error && { degraded: true }) });
}
```

- [ ] **Step 2: Verify GET with curl**

With the dev server running:
```bash
curl "http://localhost:3000/api/reactions?slug=test-article"
```

Expected response (KV unreachable with placeholder creds → degraded mode):
```json
{"counts":{"thoughtful":0,"helpful":0,"loved":0,"mindblown":0,"relatable":0},"total":0,"userReaction":null,"degraded":true}
```

Or, if Upstash is configured:
```json
{"counts":{"thoughtful":0,"helpful":0,"loved":0,"mindblown":0,"relatable":0},"total":0,"userReaction":null}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/reactions/route.js
git commit -m "feat: add GET /api/reactions endpoint"
```

---

## Task 4: POST /api/reactions

**Files:**
- Modify: `app/api/reactions/route.js`

- [ ] **Step 1: Add the POST handler to the same file**

Append to `app/api/reactions/route.js` (after the GET function):

```js
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { slug, reaction } = body;

  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }
  if (reaction !== null && !VALID_KEYS.has(reaction)) {
    return NextResponse.json({ error: 'Invalid reaction' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const prevRaw = cookieStore.get(`reaction_${slug}`)?.value ?? null;
  const prevReaction = prevRaw && VALID_KEYS.has(prevRaw) ? prevRaw : null;

  const { counts, total, error } = await setReaction(slug, prevReaction, reaction);

  const response = NextResponse.json({
    counts,
    total,
    userReaction: reaction,
    ...(error && { degraded: true }),
  });

  if (reaction) {
    response.cookies.set(`reaction_${slug}`, reaction, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
  } else {
    response.cookies.delete(`reaction_${slug}`);
  }

  return response;
}
```

- [ ] **Step 2: Verify POST with curl**

```bash
curl -X POST http://localhost:3000/api/reactions \
  -H "Content-Type: application/json" \
  -d '{"slug":"test-article","reaction":"thoughtful"}'
```

Expected: same shape as GET, `userReaction: "thoughtful"`, count for thoughtful = 1 (if KV connected) or 0 degraded.

```bash
curl -X POST http://localhost:3000/api/reactions \
  -H "Content-Type: application/json" \
  -d '{"slug":"test-article","reaction":"badvalue"}'
```

Expected: `{"error":"Invalid reaction"}` with status 400.

- [ ] **Step 3: Commit**

```bash
git add app/api/reactions/route.js
git commit -m "feat: add POST /api/reactions endpoint with cookie-based dedup"
```

---

## Task 5: ArticleReactions — state shell + TotalCount

**Files:**
- Create: `app/components/sections/ArticleReactions.js`

- [ ] **Step 1: Create the file with state, data fetching, handleReact, and TotalCount**

```js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { stagger, fadeUp, vp } from '@/lib/motion';
import { REACTIONS } from '@/lib/reactions';

/* ── Helpers ──────────────────────────────────────────────────── */

function formatCount(n) {
  if (typeof n !== 'number') return '0';
  return n.toLocaleString();
}

function emptyCountsObj() {
  return Object.fromEntries(REACTIONS.map((r) => [r.key, 0]));
}

/* ── Total count line ─────────────────────────────────────────── */

function TotalCount({ total, loading }) {
  if (loading) {
    return (
      <div
        style={{
          height: 16,
          width: 120,
          borderRadius: 8,
          background: 'var(--surface-2)',
          marginBottom: 20,
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
    );
  }
  return (
    <p
      className="t-caption text-fg-muted"
      style={{ marginBottom: 20, letterSpacing: '0.06em' }}
    >
      {total === 0 ? 'Be the first to react' : `${formatCount(total)} reactions`}
    </p>
  );
}

/* ── Main component ───────────────────────────────────────────── */

export default function ArticleReactions({ slug }) {
  const [counts, setCounts] = useState(emptyCountsObj());
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reactions?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => {
        setCounts(data.counts ?? emptyCountsObj());
        setUserReaction(data.userReaction ?? null);
        setLoading(false);
      })
      .catch(() => {
        setCounts(emptyCountsObj());
        setLoading(false);
      });
  }, [slug]);

  const handleReact = useCallback(
    (type) => {
      const prev = userReaction;
      const next = prev === type ? null : type;

      // Optimistic update
      setCounts((c) => {
        const updated = { ...c };
        if (prev) updated[prev] = Math.max(0, (updated[prev] ?? 0) - 1);
        if (next) updated[next] = (updated[next] ?? 0) + 1;
        return updated;
      });
      setUserReaction(next);

      // Persist to server
      fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, reaction: next }),
      })
        .then((r) => r.json())
        .then((data) => {
          setCounts(data.counts ?? emptyCountsObj());
          setUserReaction(data.userReaction ?? null);
        })
        .catch(() => {
          // Revert optimistic update
          setCounts((c) => {
            const reverted = { ...c };
            if (next) reverted[next] = Math.max(0, (reverted[next] ?? 0) - 1);
            if (prev) reverted[prev] = (reverted[prev] ?? 0) + 1;
            return reverted;
          });
          setUserReaction(prev);
        });
    },
    [slug, userReaction],
  );

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        style={{ padding: '48px 0' }}
      >
        <m.div variants={fadeUp}>
          <TotalCount total={total} loading={loading} />
        </m.div>

        {/* ReactionBar and ReactionCards go here in Tasks 6 and 7 */}
      </m.div>
    </LazyMotion>
  );
}
```

- [ ] **Step 2: Slot into ArticleClient.js temporarily to verify mount + fetch**

In `app/writing/[slug]/ArticleClient.js`, add this import at the top:
```js
import ArticleReactions from '../components/sections/ArticleReactions';
```

Wait — the path from `app/writing/[slug]/` to `app/components/` would be `../../components/sections/ArticleReactions`. Use the `@/` alias instead:
```js
import ArticleReactions from '@/app/components/sections/ArticleReactions';
```

Add the component after the article body closing tag (line ~198 in ArticleClient.js, after the `</m.div>` that wraps the body content, before the "More writing" block):

```jsx
{/* ── Reactions ──────────────────────────────────────────── */}
<div style={{ borderTop: '1px solid var(--border)', maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
  <ArticleReactions slug={article.slug} />
</div>
```

- [ ] **Step 3: Open an article in the browser, open DevTools Network tab**

Navigate to any article at `http://localhost:3000/writing/[any-slug]`. Verify:
- No console errors on mount
- A network request fires to `/api/reactions?slug=...` and returns 200
- "Be the first to react" text appears (or a count if KV has data)

- [ ] **Step 4: Commit**

```bash
git add app/components/sections/ArticleReactions.js app/writing/[slug]/ArticleClient.js
git commit -m "feat: ArticleReactions shell with state, fetch, and TotalCount"
```

---

## Task 6: ReactionBar — responsive pill strip

**Files:**
- Modify: `app/components/sections/ArticleReactions.js`

- [ ] **Step 1: Add the ReactionBar sub-component before the main export**

Add this function above `export default function ArticleReactions`:

```js
/* ── Reaction bar (pill strip) ────────────────────────────────── */

function ReactionBar({ counts, userReaction, onReact, loading }) {
  if (loading) {
    return (
      <div className="flex flex-wrap gap-2" style={{ marginBottom: 24 }}>
        {REACTIONS.map((r) => (
          <div
            key={r.key}
            style={{
              height: 36,
              width: 80,
              borderRadius: 'var(--radius-pill)',
              background: 'var(--surface-2)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2" style={{ marginBottom: 24 }}>
      {REACTIONS.map((r) => {
        const selected = userReaction === r.key;
        return (
          <m.button
            key={r.key}
            onClick={() => onReact(r.key)}
            whileTap={{ scale: 1.12 }}
            aria-label={`React with ${r.label}`}
            aria-pressed={selected}
            className="inline-flex items-center gap-1.5 t-caption font-medium"
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              border: `1px solid ${selected ? 'var(--brand)' : 'var(--border)'}`,
              background: selected ? 'var(--brand-muted)' : 'var(--surface-1)',
              color: selected ? 'var(--brand)' : 'var(--fg-muted)',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease, background 0.15s ease, color 0.15s ease',
            }}
          >
            <span>{r.emoji}</span>
            {/* Label — hidden below md breakpoint */}
            <span className="hidden md:inline">{r.label}</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatCount(counts[r.key] ?? 0)}
            </span>
          </m.button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Wire ReactionBar into the main component**

Replace the comment `{/* ReactionBar and ReactionCards go here in Tasks 6 and 7 */}` with:

```jsx
<m.div variants={fadeUp}>
  <ReactionBar
    counts={counts}
    userReaction={userReaction}
    onReact={handleReact}
    loading={loading}
  />
</m.div>
```

- [ ] **Step 3: Verify in browser**

- Pills render with emoji, label (desktop), count
- Resize to mobile width (< 768px) — labels disappear, emoji + count remain
- Click a pill: count increments instantly (optimistic), pill highlights with brand colour
- Click same pill: deselects, count decrements
- Click different pill: previous deselects, new selects

- [ ] **Step 4: Commit**

```bash
git add app/components/sections/ArticleReactions.js
git commit -m "feat: add responsive ReactionBar pill strip"
```

---

## Task 7: ReactionCards — emoji card grid

**Files:**
- Modify: `app/components/sections/ArticleReactions.js`

- [ ] **Step 1: Add the ReactionCards sub-component above the main export**

```js
/* ── Reaction cards (emoji grid) ─────────────────────────────── */

function ReactionCards({ counts, userReaction, onReact, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {REACTIONS.map((r) => (
          <div
            key={r.key}
            style={{
              height: 100,
              borderRadius: 'var(--radius-card)',
              background: 'var(--surface-2)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
      {REACTIONS.map((r) => {
        const selected = userReaction === r.key;
        return (
          <m.button
            key={r.key}
            onClick={() => onReact(r.key)}
            whileTap={{ scale: 1.06 }}
            aria-label={`React with ${r.label}`}
            aria-pressed={selected}
            className="flex flex-col items-center justify-center gap-1"
            style={{
              padding: '20px 12px',
              borderRadius: 'var(--radius-card)',
              border: `1px solid ${selected ? 'var(--brand)' : 'var(--border)'}`,
              background: selected ? 'var(--brand-muted)' : 'var(--surface-1)',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease, background 0.15s ease',
            }}
          >
            <span style={{ fontSize: 32, lineHeight: 1 }}>{r.emoji}</span>
            <span
              className="t-caption"
              style={{ color: selected ? 'var(--brand)' : 'var(--fg-muted)', marginTop: 8 }}
            >
              {r.label}
            </span>
            <span
              className="t-caption font-semibold"
              style={{
                color: selected ? 'var(--brand)' : 'var(--fg)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatCount(counts[r.key] ?? 0)}
            </span>
          </m.button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Wire ReactionCards into the main component**

After the `<m.div>` wrapping `ReactionBar`, add:

```jsx
<m.div variants={fadeUp}>
  <ReactionCards
    counts={counts}
    userReaction={userReaction}
    onReact={handleReact}
    loading={loading}
  />
</m.div>
```

- [ ] **Step 3: Verify in browser — card grid**

- 5 columns on desktop, 3 columns on mobile (wraps to 3+2)
- Clicking a card selects it with brand border + tint
- Clicking same card deselects
- Clicking a card while bar has a different selection: bar updates too (shared state)
- Clicking a bar pill while cards have a selection: cards update too
- Both styles always in sync

- [ ] **Step 4: Commit**

```bash
git add app/components/sections/ArticleReactions.js
git commit -m "feat: add ReactionCards emoji grid, both styles share state"
```

---

## Task 8: Finalise ArticleClient.js integration

**Files:**
- Modify: `app/writing/[slug]/ArticleClient.js`

- [ ] **Step 1: Verify the import and placement added in Task 5 is correct**

The import at the top of `ArticleClient.js` should read:
```js
import ArticleReactions from '@/app/components/sections/ArticleReactions';
```

The placement block (after article body, before "More writing") should read:
```jsx
{/* ── Reactions ──────────────────────────────────────────── */}
<div style={{ borderTop: '1px solid var(--border)' }}>
  <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
    <ArticleReactions slug={article.slug} />
  </div>
</div>
```

- [ ] **Step 2: Verify full article page layout in browser**

Navigate to `http://localhost:3000/writing/[any-slug]`. Check:
- Article body renders
- Thin border divider appears
- TotalCount line renders
- ReactionBar renders (responsive on resize)
- ReactionCards render below the bar
- Another border divider then "More writing" grid
- No layout shift or flash on load (skeleton shows during fetch)

- [ ] **Step 3: Test dark theme**

Toggle theme. Verify:
- All borders, backgrounds, text colours respond to `var(--*)` tokens
- Selected state brand colour is readable in both themes
- Skeleton pulses are visible in both themes

- [ ] **Step 4: Commit**

```bash
git add app/writing/[slug]/ArticleClient.js
git commit -m "feat: slot ArticleReactions into article page layout"
```

---

## Task 9: Style guide section

**Files:**
- Modify: `app/style-guide/page.js`

- [ ] **Step 1: Add a Reactions section to the style guide**

Find the last section in `app/style-guide/page.js` and add after it:

```jsx
{/* ── Reactions ─────────────────────────────────────── */}
<section>
  <h2 className="t-h2 text-fg" style={{ marginBottom: 8 }}>Reactions</h2>
  <p className="t-body2 text-fg-muted" style={{ marginBottom: 32 }}>
    Article emoji reactions — bar (pill strip) and card grid. Both interactive, shared state.
  </p>

  <h3 className="t-h3 text-fg" style={{ marginBottom: 16 }}>Live component</h3>
  <p className="t-caption text-fg-muted" style={{ marginBottom: 16 }}>
    Slug <code>style-guide-demo</code> — reactions persist to KV.
  </p>
  <ArticleReactions slug="style-guide-demo" />
</section>
```

Add the import at the top of the style guide file:
```js
import ArticleReactions from '@/app/components/sections/ArticleReactions';
```

- [ ] **Step 2: Verify at `http://localhost:3000/style-guide`**

- Reactions section appears at the bottom
- Bar and cards are interactive
- Both themes look correct

- [ ] **Step 3: Commit**

```bash
git add app/style-guide/page.js
git commit -m "docs: add Reactions section to style guide"
```

---

## Task 10: Add @keyframes pulse to globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Check if a pulse keyframe already exists**

Search `app/globals.css` for `@keyframes pulse`. If it already exists, skip to Step 3.

- [ ] **Step 2: Add the keyframe if missing**

Append to `app/globals.css`:
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
```

- [ ] **Step 3: Verify skeleton loading state**

In DevTools Network tab, throttle to "Slow 3G". Reload an article. The skeleton pills and cards should animate with a pulsing opacity while the fetch is in-flight.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat: add pulse keyframe for skeleton loading states"
```

---

## Self-Review Checklist

- [x] **Bar style responsive** — `hidden md:inline` on label span covers `< 768px` → emoji+count, `≥ 768px` → emoji+label+count
- [x] **Card grid responsive** — `grid-cols-3 md:grid-cols-5`
- [x] **Shared state** — both styles receive same `counts`, `userReaction`, `onReact` props from parent
- [x] **Swap behaviour** — `handleReact` decrements prev, increments next atomically in optimistic state and in KV pipeline
- [x] **Deselect behaviour** — `next = prev === type ? null : type` covers toggle-off
- [x] **Optimistic revert** — catch block in `handleReact` restores prev counts and prev selection
- [x] **Cookie security** — `httpOnly: true`, `sameSite: lax`, 1-year max-age
- [x] **KV degraded mode** — `getReactions` catch returns zero counts; component renders without crashing
- [x] **`fadeUp` variant** — uses `hidden`/`visible` keys (matching `lib/motion.js`) not `initial`/`animate`
- [x] **`article.slug`** — confirmed available via `generateStaticParams` in `page.js`
- [x] **Style guide** — live component with demo slug, not static mockup
- [x] **Pulse animation** — Task 10 ensures the `@keyframes pulse` exists for skeleton states
