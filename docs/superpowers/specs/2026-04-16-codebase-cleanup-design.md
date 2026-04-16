# Codebase Cleanup — Design Spec
**Date:** 2026-04-16
**Scope:** Three targeted refactors identified by graphify graph analysis

---

## Overview

Three independent refactors with no behavioral changes to the site:

1. **Slugify consolidation** — eliminate three duplicate slug implementations, all slug logic into `lib/slugify.js`
2. **Image proxy audit** — confirm all Notion image URLs are routed through `/api/notion-image`
3. **`collectCardCallouts` relocation** — move homepage callout classifier from page component to data layer

---

## 1. Slugify Consolidation

### Problem

Three separate slug implementations exist across the codebase. The private `slugify` in `lib/notion-work.js` and the identical one in `scripts/notion-sync.js` are the critical pair — they generate and look up project slugs respectively. If they drift, project lookups break silently with no tests catching it.

### Current state

| Location | Function | Pattern |
|---|---|---|
| `lib/slugify.js` | `slugify(text)` | `[^\w\s-]` stripped, spaces→`-` — keeps underscores, used for heading anchors |
| `lib/notion-work.js` line 140 | `slugifyArticle(title)` (exported) | strips specials, then spaces→`-` |
| `lib/notion-work.js` line 325 | `slugify(title)` (private) | `[^a-z0-9]+`→`-` — for project URL slugs |
| `scripts/notion-sync.js` line 31 | `slugify(title)` (private) | identical to above |

### Design

`lib/slugify.js` becomes the single slug module — three named exports:

```js
// Unchanged — for heading anchors (ToC). Preserves underscores.
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// New export — for project/page URL slugs. Collapses any non-alphanumeric run to '-'.
export function slugifyTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Moved from notion-work.js — for article URL slugs.
// Strips specials first (preserving spaces), then converts spaces to '-'.
// Different from slugifyTitle: "What's new" → "whats-new" not "what-s-new"
export function slugifyArticle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
```

### Changes

**`lib/notion-work.js`**
- Delete `export function slugifyArticle` (lines 140–147) — it moves to `lib/slugify.js`
- Delete private `function slugify` (lines 325–327)
- Add to imports: `import { slugifyTitle, slugifyArticle } from '@/lib/slugify'`
- Replace `slugify(title)` call in `findProjectBySlug` with `slugifyTitle(title)`

**`scripts/notion-sync.js`**
- Delete private `function slugify` (lines 31–33)
- Add: `import { slugifyTitle } from '../lib/slugify.js'`
- Replace `slugify(title)` call with `slugifyTitle(title)`

### Invariants

- No URL changes anywhere — output of each function is identical to today
- `slugify` (heading anchors) behavior unchanged
- `slugifyTitle` and `slugifyArticle` produce identical output to the functions they replace

---

## 2. Image Proxy Audit

### Problem

`/api/notion-image` exists to re-fetch fresh Notion S3 signed URLs before they expire (~1hr TTL). If any component renders a raw Notion S3 URL directly, it will break for users who load the page after the URL expires.

### Current coverage (confirmed by code reading)

- `scripts/notion-sync.js` — rewrites all image block URLs and page cover URLs to `/api/notion-image` at build time ✓
- `app/components/blocks/NotionBlocks.js` — proxies file-type image blocks at render time ✓
- `app/api/notion-image/route.js` — re-fetches live URL from Notion API on each request ✓

### Audit procedure

Grep the codebase for raw Notion/S3 URL patterns appearing in component props:

```
grep -r "notion.so\|s3.us-west\|prod-files-secure" app/ --include="*.js"
```

If no matches: audit passes, document as confirmed-covered.
If matches found: each raw URL becomes a fix item (wrap with `proxyNotionImageUrl` helper or route through `/api/notion-image?block_id=`).

### Expected outcome

No raw Notion URLs in component props — the sync script and NotionBlocks.js already handle both the build-time and render-time paths. Audit is confirmation, not remediation.

---

## 3. `collectCardCallouts` Relocation

### Problem

`collectCardCallouts` is a pure data transformation function (filters Notion blocks by callout type) that lives inside `app/page.js`. This couples data-shaping logic to a page component, and makes the function unavailable to the work page or project pages without duplication.

### Design

Move the function from `app/page.js` to `lib/notion-work.js` as a named export.

**`lib/notion-work.js`** — add export:
```js
export function collectCardCallouts(blocks, childrenMap) {
  const cards = [];
  for (const block of blocks) {
    if (block.type === 'callout' && getCalloutType(block) === 'card') {
      cards.push(block);
    } else if (block.type === 'column_list') {
      const columns = childrenMap[block.id] ?? [];
      for (const col of columns) {
        for (const b of (childrenMap[col.id] ?? [])) {
          if (b.type === 'callout' && getCalloutType(b) === 'card') {
            cards.push(b);
          }
        }
      }
    }
  }
  return cards;
}
```

Note: `lib/notion-work.js` will need to import `getCalloutType` from `@/app/components/ui/card-utils`. This is safe — `card-utils.js` has zero imports of its own (pure utility), so no circular dependency.

**`app/page.js`** — replace inline definition with import:
```js
import { getHomePageData, collectCardCallouts } from '@/lib/notion-work';
```

### Outcome

`app/page.js` becomes a pure composition/render file. `collectCardCallouts` is available for reuse in work page, project pages, or any future Notion-fetching page.

---

## Testing

All three changes are non-behavioral — no output changes. Verification:

1. Run `npm run build` — must succeed with no errors
2. Run `npm test` (vitest) — slugify tests must pass
3. Spot-check project pages in browser — slugs must resolve correctly
4. Spot-check `/writing/[slug]` — article slugs must resolve correctly
5. Run the image proxy audit grep — zero raw Notion URLs expected

---

## Order of execution

1. Slugify consolidation (lib change, lowest risk)
2. Image proxy audit (read-only verification)
3. `collectCardCallouts` relocation (check for circular import first)
