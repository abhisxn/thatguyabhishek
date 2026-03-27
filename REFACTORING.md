# Refactoring Impact Analysis
> Generated 2026-03-28 — do not edit manually, update when refactors land.

All issues below are ranked by **impact × effort**. Tests in `__tests__/` document
current behaviour and must stay green before and after every change.

---

## 1. CRITICAL — Duplicate `slugify()` in 3 places
**Impact:** Bug-magnet. If the algorithm changes, 3 files drift silently.
**Files:**
- `lib/slugify.js` — canonical export ✅
- `lib/notion-work.js:212` — local copy (never imports from lib/slugify)
- `scripts/notion-sync.js:27` — local copy

**Fix:** Remove both local copies; `import { slugify } from './slugify.js'` in each.
**Test coverage:** `__tests__/lib/slugify.test.js` pins the algorithm and includes a
regression test that compares the canonical export against the inline implementation.

---

## 2. HIGH — Duplicate child-fetching logic across `notion-work.js` / `notion-project.js`
**Impact:** Rate-limit handling and pagination must be maintained in two files.
`notion-work.js`'s `fetchChildren` has **no pagination** (drops blocks beyond page 100);
`notion-project.js`'s version paginates correctly.

**Files / lines:**
- `lib/notion-work.js:10–62` — fetchChildren (no pagination) + fetchColumnListChildren + fetchBlocksWithChildren
- `lib/notion-project.js:16–48` — fetchChildren (paginated) + buildChildrenMap

**Fix:** Extract a single `fetchChildrenPaginated(blockId)` to `lib/notion-utils.js`.
Replace both file-local copies. Align RECURSE_TYPES into a shared constant.

**Risk:** The home/work page fetcher currently only recurses one level into columns.
The project fetcher recurses into all RECURSE_TYPES. Merging must preserve both
behaviours — separate the recursion strategies, not the pagination primitive.

---

## 3. HIGH — Repeated callout safety-pass pattern (3×)
**Impact:** Any bug fix must be applied in three places.

```js
// This exact block appears in _getHomePageData, _getWorkPageData, _getProjectPageData
const allBlocks = [...blocks, ...Object.values(childrenMap).flat()];
await Promise.all(
  allBlocks
    .filter((b) => b.type === 'callout' && !childrenMap[b.id])
    .map(async (b) => { childrenMap[b.id] = await fetchChildren(b.id); })
);
```

**Fix:** Extract to `lib/notion-utils.js`:
```js
export async function safelyFetchCalloutChildren(blocks, childrenMap, fetchChildren) { ... }
```

---

## 4. MEDIUM-HIGH — `NotionBlocks.js` (446 lines) — single-file switch for 25+ block types
**Impact:** Every block type change touches the same file; hard to navigate; hard to test.

**Fix:** Extract a block-type registry:
```js
// lib/block-renderers/index.js
const RENDERERS = {
  paragraph: ParagraphBlock,
  heading_1: HeadingBlock,
  callout: CalloutBlock,
  // ...
};
```
Each renderer becomes its own file and can be unit-tested in isolation.

**Priority note:** This is high-value but high-effort. Complete 1–3 first.

---

## 5. MEDIUM — `CalloutBlock.js` (356 lines) — styling constants bloat
**Impact:** 87 lines of BG color constants live here but are logically part of
`card-utils.js` (where `calloutColorToBg` already lives).

**Fix:** Move the BG object to `card-utils.js` or to the new `lib/callout-styles.js`.
**Already tested:** `__tests__/lib/card-utils.test.js` covers `calloutColorToBg`.

---

## 6. MEDIUM — `about/page.js` (620 lines) — monolithic client component
**Impact:** Entire page shipped as JS; no server-rendering of static sections.
Carousel state blocks hydration of the whole page tree.

**Fix:** Split into:
- `app/about/page.js` — server component (fetches data, renders static sections)
- `app/components/sections/WorkCarousel.js` — `'use client'` island (carousel only)

**Effort:** High. Requires careful data boundary design. Do last.

---

## 7. LOW — Property extraction helpers not shared with `scripts/notion-sync.js`
**Impact:** `scripts/notion-sync.js:32–57` re-implements getText/getSelect/getMultiSelect/
getUrl/getCheckbox/getNumber instead of importing from `lib/notion-work.js`.

**Fix:** Import from `lib/notion-work.js` or extract to a shared `lib/notion-props.js`.

---

## Test files added
```
__tests__/lib/slugify.test.js          — 11 tests, pins slugify algorithm
__tests__/lib/notion-utils.test.js     — 15 tests, withRetry + createLimiter
__tests__/lib/notion-work.test.js      — 66 tests, all property extractors
__tests__/lib/card-utils.test.js       — 51 tests, callout type/color/style system
__tests__/lib/section-styles.test.js   — 20 tests, section style index + color map
Total: 153 tests, 0 failures
```

Run with: `npm test`
