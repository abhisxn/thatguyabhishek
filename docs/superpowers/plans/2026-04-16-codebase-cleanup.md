# Codebase Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Three non-behavioral refactors — consolidate slug functions into one module, audit the image proxy, and move `collectCardCallouts` to the data layer.

**Architecture:** Each task is independent and produces a green build on its own. All three touch different files with no overlapping changes. Execute in order: slugify → image audit → callout relocation.

**Tech Stack:** Next.js 16, Vitest (`__tests__/lib/`), Node.js CJS for scripts/

---

## File Map

| File | Change |
|---|---|
| `lib/slugify.js` | Add `slugifyTitle` and `slugifyArticle` exports |
| `lib/notion-work.js` | Remove `slugifyArticle` (line 140) and private `slugify` (line 325); add import; add `collectCardCallouts` export |
| `scripts/notion-sync.js` | Remove private `slugify` (line 31); add `require` for `slugifyTitle` |
| `app/page.js` | Remove inline `collectCardCallouts`; add it to the import from `@/lib/notion-work` |
| `__tests__/lib/slugify.test.js` | Add tests for `slugifyTitle` and `slugifyArticle`; update the regression test |

---

## Task 1: Extend `lib/slugify.js` with `slugifyTitle` and `slugifyArticle`

**Files:**
- Modify: `lib/slugify.js`
- Modify: `__tests__/lib/slugify.test.js`

- [ ] **Step 1: Write failing tests for `slugifyTitle` and `slugifyArticle`**

Append to `__tests__/lib/slugify.test.js` (keep the existing `slugify` tests, add below them):

```js
import { describe, it, expect } from 'vitest';
import { slugify, slugifyTitle, slugifyArticle } from '../../lib/slugify.js';
```

Replace the import at line 2 with the one above (adds the two new names), then append:

```js
describe('slugifyTitle', () => {
  it('lowercases the input', () => {
    expect(slugifyTitle('Hello World')).toBe('hello-world');
  });

  it('collapses any non-alphanumeric run into one hyphen', () => {
    expect(slugifyTitle('ThinkPlanty.com')).toBe('thinkplanty-com');
    expect(slugifyTitle('GoodWorker Design System')).toBe('goodworker-design-system');
    expect(slugifyTitle('Microsoft Wiki Agent')).toBe('microsoft-wiki-agent');
  });

  it('strips leading and trailing hyphens', () => {
    expect(slugifyTitle('-Leading-')).toBe('leading');
  });

  it('handles apostrophes: What\'s new → whats-new is wrong, what-s-new is correct', () => {
    // slugifyTitle collapses the apostrophe as a non-alphanumeric char
    expect(slugifyTitle("What's new")).toBe('what-s-new');
  });

  it('matches the inline slugify previously in notion-work.js', () => {
    const inline = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const samples = ['Microsoft Wiki Agent', 'GoodWorker Design System', 'ThinkPlanty.com'];
    for (const s of samples) {
      expect(slugifyTitle(s)).toBe(inline(s));
    }
  });

  it('returns empty string for empty input', () => {
    expect(slugifyTitle('')).toBe('');
  });
});

describe('slugifyArticle', () => {
  it('lowercases the input', () => {
    expect(slugifyArticle('Hello World')).toBe('hello-world');
  });

  it('strips specials but preserves spaces before converting to hyphens', () => {
    // apostrophe stripped → space preserved → "whats new" → "whats-new"
    expect(slugifyArticle("What's new")).toBe('whats-new');
  });

  it('handles real article title examples', () => {
    expect(slugifyArticle('Stop Designing Features. Start Designing Decisions.'))
      .toBe('stop-designing-features-start-designing-decisions');
    expect(slugifyArticle('The "Why" Behind Great Design'))
      .toBe('the-why-behind-great-design');
  });

  it('strips leading and trailing hyphens', () => {
    expect(slugifyArticle('  leading and trailing  ')).toBe('leading-and-trailing');
  });

  it('matches the slugifyArticle previously in notion-work.js', () => {
    const inline = (t) =>
      t.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
    const samples = [
      'Stop Designing Features. Start Designing Decisions.',
      "What's new in product design",
      'The "Why" Behind Great Design',
    ];
    for (const s of samples) {
      expect(slugifyArticle(s)).toBe(inline(s));
    }
  });

  it('returns empty string for empty input', () => {
    expect(slugifyArticle('')).toBe('');
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd /Users/abhishek/thatguyabhishek && npx vitest run __tests__/lib/slugify.test.js
```

Expected: tests for `slugifyTitle` and `slugifyArticle` fail with `slugifyTitle is not a function` / `slugifyArticle is not a function`.

- [ ] **Step 3: Also update the regression test in the existing `slugify` describe block**

The current regression test at line 52–63 inlines the old `notion-work.js` implementation and asserts `slugify` matches it. That test was guarding against drift between the two — once `slugifyTitle` exists, the test should verify `slugifyTitle` instead. Replace lines 51–63 of `__tests__/lib/slugify.test.js`:

```js
  // Regression: project URL slugs previously used an inline slugify in notion-work.js.
  // slugifyTitle is the canonical version — this test pins that they produce identical output.
  it('slugifyTitle matches the inline slugify that was in notion-work.js', () => {
    const inlineSlugify = (title) =>
      title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const samples = [
      'Microsoft Wiki Agent',
      'GoodWorker Design System',
      'ThinkPlanty.com',
    ];
    for (const s of samples) {
      expect(slugifyTitle(s)).toBe(inlineSlugify(s));
    }
  });
```

- [ ] **Step 4: Add `slugifyTitle` and `slugifyArticle` to `lib/slugify.js`**

Replace the entire contents of `lib/slugify.js`:

```js
/**
 * Converts a heading string into a URL-safe slug.
 * Handles duplicate slugs via the `seen` map passed by the caller.
 * Preserves underscores — used for heading anchors / ToC.
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Converts a project title into a URL-safe slug.
 * Collapses any non-alphanumeric run (including apostrophes) to a single hyphen.
 * Used for project page URLs in notion-work.js and notion-sync.js.
 */
export function slugifyTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * Converts an article title into a URL-safe slug.
 * Strips special characters first (preserving spaces), then converts spaces to hyphens.
 * Apostrophes are stripped rather than becoming hyphens: "What's" → "whats".
 * Used for writing article URLs in notion-work.js.
 */
export function slugifyArticle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
```

- [ ] **Step 5: Run tests — all must pass**

```bash
cd /Users/abhishek/thatguyabhishek && npx vitest run __tests__/lib/slugify.test.js
```

Expected: all tests pass, zero failures.

- [ ] **Step 6: Commit**

```bash
cd /Users/abhishek/thatguyabhishek && git add lib/slugify.js __tests__/lib/slugify.test.js && git commit -m "feat: add slugifyTitle and slugifyArticle exports to lib/slugify.js"
```

---

## Task 2: Remove duplicate slug functions from `lib/notion-work.js`

**Files:**
- Modify: `lib/notion-work.js`

- [ ] **Step 1: Add the import for `slugifyTitle` and `slugifyArticle` to `lib/notion-work.js`**

At line 4 of `lib/notion-work.js`, add the slugify import after the existing imports:

```js
import { unstable_cache } from 'next/cache';
import notion from './notion';
import { withRetry, createLimiter } from './notion-utils';
import { slugifyTitle, slugifyArticle } from './slugify.js';
```

- [ ] **Step 2: Delete the `slugifyArticle` export from `lib/notion-work.js` (lines 140–147)**

Remove these lines entirely:

```js
export function slugifyArticle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
```

- [ ] **Step 3: Delete the private `slugify` function from `lib/notion-work.js` (lines 325–327 in original, line numbers shift after step 2)**

Remove these lines entirely:

```js
function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
```

- [ ] **Step 4: Update the `findProjectBySlug` call to use `slugifyTitle`**

Find the line in `findProjectBySlug`:
```js
return pages.find((p) => slugify(getTitle(p)) === slug) ?? null;
```

Change it to:
```js
return pages.find((p) => slugifyTitle(getTitle(p)) === slug) ?? null;
```

- [ ] **Step 5: Confirm `slugifyArticle` is still referenced correctly in `mapArticlePage`**

The two `slugifyArticle(title)` calls in `mapArticlePage` (slug property and href property) now resolve to the imported function from `lib/slugify.js` — no other changes needed.

- [ ] **Step 6: Run the full test suite**

```bash
cd /Users/abhishek/thatguyabhishek && npx vitest run
```

Expected: all tests pass (slugify, notion-work, card-utils, section-styles, notion-utils).

- [ ] **Step 7: Run build to verify no import errors**

```bash
cd /Users/abhishek/thatguyabhishek && npm run build 2>&1 | tail -20
```

Expected: build succeeds with no errors.

- [ ] **Step 8: Commit**

```bash
cd /Users/abhishek/thatguyabhishek && git add lib/notion-work.js && git commit -m "refactor: remove duplicate slug functions from notion-work.js, import from lib/slugify"
```

---

## Task 3: Remove duplicate slug function from `scripts/notion-sync.js`

**Files:**
- Modify: `scripts/notion-sync.js`

- [ ] **Step 1: Add `require` for `slugifyTitle` at the top of `scripts/notion-sync.js`**

`notion-sync.js` uses CommonJS (`require`). The `lib/slugify.js` file uses ES module `export`. Node.js can `require()` an ESM file if the project has `"type": "module"` in package.json, or via a dynamic import workaround. Check first:

```bash
cd /Users/abhishek/thatguyabhishek && node -e "const { slugifyTitle } = require('./lib/slugify.js'); console.log(slugifyTitle('test'))"
```

If this errors with `ERR_REQUIRE_ESM`, use a destructured inline instead — replace the private function body with the single-line expression directly in the call site (no import needed):

**Option A — if require() works:**
Add after line 13 (`const { Client } = require('@notionhq/client');`):
```js
const { slugifyTitle } = require('../lib/slugify.js');
```
Then at line 145 replace `slugify(title)` with `slugifyTitle(title)`.
Then delete lines 31–33 (the private `function slugify`).

**Option B — if require() fails (ESM boundary):**
Delete lines 31–33 (the private `function slugify`). Replace `slugify(title)` at line 145 with the inline expression:
```js
slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
```

Note: Option B is acceptable here because `notion-sync.js` is a standalone script, not imported by any other module — a one-off inline is not a maintenance risk.

- [ ] **Step 2: Run the sync script in dry-run mode to confirm no crash**

```bash
cd /Users/abhishek/thatguyabhishek && node -e "
// Quick smoke test: require the script's slug logic without hitting the network
const slugifyTitle = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
console.log(slugifyTitle('GoodWorker Design System')); // expected: goodworker-design-system
console.log(slugifyTitle('ThinkPlanty.com'));           // expected: thinkplanty-com
"
```

Expected output:
```
goodworker-design-system
thinkplanty-com
```

- [ ] **Step 3: Run build again to confirm nothing broke**

```bash
cd /Users/abhishek/thatguyabhishek && npm run build 2>&1 | tail -10
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
cd /Users/abhishek/thatguyabhishek && git add scripts/notion-sync.js && git commit -m "refactor: remove duplicate slugify from notion-sync.js"
```

---

## Task 4: Image proxy audit (read-only verification)

**Files:**
- No code changes expected

- [ ] **Step 1: Grep for raw Notion/S3 URLs in component props**

```bash
cd /Users/abhishek/thatguyabhishek && grep -r "notion.so\|s3.us-west\|prod-files-secure" app/ --include="*.js"
```

- [ ] **Step 2: Evaluate results**

**If zero matches:** Audit passes. Continue to Task 5.

**If matches found:** For each match, determine whether the URL is:
- In a hardcoded string literal (not a Notion API response) — acceptable, leave it
- In a component prop rendering a Notion image URL from API data — needs fix: wrap with `/api/notion-image?block_id=<id>` or call `proxyNotionImageUrl`

- [ ] **Step 3: Document the result**

Whether the audit passes or finds issues, note the result in a comment in `app/api/notion-image/route.js` at line 1:

```js
// Image proxy audit 2026-04-16: zero raw Notion S3 URLs found in app/ components. ✓
```

(Or describe any findings if matches were present.)

- [ ] **Step 4: Commit (even if no code changed)**

```bash
cd /Users/abhishek/thatguyabhishek && git add app/api/notion-image/route.js && git commit -m "chore: document image proxy audit result (2026-04-16)"
```

---

## Task 5: Move `collectCardCallouts` to `lib/notion-work.js`

**Files:**
- Modify: `lib/notion-work.js`
- Modify: `app/page.js`

- [ ] **Step 1: Confirm `getCalloutType` is importable from `app/components/ui/card-utils.js`**

```bash
cd /Users/abhishek/thatguyabhishek && grep -n "export" app/components/ui/card-utils.js | head -10
```

Expected: `getCalloutType` is a named export. Confirm the file has zero imports of its own (no circular risk):

```bash
grep -n "^import\|^const.*require" app/components/ui/card-utils.js
```

Expected: no output (zero imports).

- [ ] **Step 2: Add `getCalloutType` import and `collectCardCallouts` export to `lib/notion-work.js`**

Add the import at the top of `lib/notion-work.js` (after the existing imports):

```js
import { getCalloutType } from '@/app/components/ui/card-utils';
```

Then append `collectCardCallouts` as a named export at the end of `lib/notion-work.js`:

```js
/**
 * Collect all callout blocks of type 'card' from a flat block list,
 * including cards nested inside column_list blocks.
 * Moved from app/page.js to make this available to any Notion-fetching page.
 */
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

- [ ] **Step 3: Update `app/page.js` — replace inline definition with import**

Remove lines 13–32 from `app/page.js` (the `import { getCalloutType }` line and the inline `collectCardCallouts` function). Replace the import at line 12 with:

```js
import { getHomePageData, collectCardCallouts } from '@/lib/notion-work';
```

After the change, `app/page.js` should have no reference to `getCalloutType` directly and no inline `collectCardCallouts`. The function call at line 41 (`collectCardCallouts(data.blocks, data.childrenMap)`) remains unchanged.

- [ ] **Step 4: Run build**

```bash
cd /Users/abhishek/thatguyabhishek && npm run build 2>&1 | tail -20
```

Expected: build succeeds with no errors.

- [ ] **Step 5: Run full test suite**

```bash
cd /Users/abhishek/thatguyabhishek && npx vitest run
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
cd /Users/abhishek/thatguyabhishek && git add lib/notion-work.js app/page.js && git commit -m "refactor: move collectCardCallouts to lib/notion-work.js"
```

---

## Final verification

- [ ] **Run the complete build one last time**

```bash
cd /Users/abhishek/thatguyabhishek && npm run build
```

Expected: clean build, no errors or warnings about missing exports.

- [ ] **Spot-check in browser (dev server)**

```bash
npm run dev
```

1. Open `http://localhost:3000` — homepage work cards must render
2. Open a project page (e.g. `/work/goodworker-design-system`) — must resolve correctly
3. Open a writing article (e.g. `/writing/stop-designing-features-start-designing-decisions`) — must resolve correctly

---

## Self-review against spec

| Spec requirement | Task that covers it |
|---|---|
| `slugifyTitle` as canonical project slug function | Tasks 1, 2, 3 |
| `slugifyArticle` moved to `lib/slugify.js` | Task 1, 2 |
| `slugify` (heading anchors) unchanged | Task 1 — existing tests unchanged |
| `notion-work.js` uses imports, not private copies | Task 2 |
| `notion-sync.js` uses `slugifyTitle` | Task 3 |
| No URL output changes anywhere | Regression tests in Task 1 pin exact output |
| Image proxy audit | Task 4 |
| `collectCardCallouts` in data layer | Task 5 |
| No circular imports | Task 5 Step 1 verifies before writing |
| Build passes | End of Tasks 2, 3, 5, and final verification |
| vitest passes | End of Tasks 2 and 5 |
