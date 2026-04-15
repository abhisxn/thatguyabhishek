# Article Reactions — Design Spec
**Date:** 2026-04-15
**Status:** Draft

---

## Overview

A globally persistent reactions section for writing articles on thatguyabhishek.com. Readers can express how an article made them feel. Counts are shared across all visitors (global state), stored in Vercel KV (Redis).

The section uses **two visual styles** — both interactive, both present on the article page:

| Style | Breakpoint | Layout |
|---|---|---|
| **Card** | All viewports | Grid of emoji cards with label + count below each |
| **Bar** | All viewports | Horizontal strip of pills, responsive label behaviour |

The card style is the primary hero interaction. The bar style sits above it as a compact at-a-glance summary. Both are wired to the same data — clicking either updates both.

---

## Reactions Set

Five reactions:

| Emoji | Label | Key |
|---|---|---|
| 🤔 | Thoughtful | `thoughtful` |
| 👍 | Helpful | `helpful` |
| ❤️ | Loved it | `loved` |
| 🤯 | Mind-blown | `mindblown` |
| 🙏 | Relatable | `relatable` |

---

## Layout & Placement

**Location in ArticleClient.js:** Between the article body and the "More writing" section, separated by a `1px var(--border)` divider.

```
[ Article body ]
────────────────────────────────
[ Total count line ]
[ Bar style — pill strip       ]  ← compact summary
[ Card style — emoji grid      ]  ← primary interaction
────────────────────────────────
[ More writing grid ]
```

---

## Visual Specs

### Bar Style (pill strip)

A horizontal row of pills. **Responsive:**

| Viewport | Pill content | Example |
|---|---|---|
| `≥ 768px` (md+) | emoji + label + count | `🤔 Thoughtful 42` |
| `< 768px` | emoji + count only | `🤔 42` |

- Pills sit in a `flex-wrap` row with `gap-2`
- Each pill: `border border-[var(--border)] rounded-full`
- Selected state: `border-[var(--brand)] bg-[var(--brand-muted)] text-[var(--brand)]`
- Unselected: default surface, `text-fg-muted`
- On mobile the label hides via `hidden md:inline` on the label `<span>`

### Card Style (emoji grid)

A grid of cards. **Responsive:**

| Viewport | Columns |
|---|---|
| `≥ 768px` | 5 columns (one per reaction) |
| `< 768px` | 3 columns (wraps to 3+2) |

Each card contains:
- Emoji — large, centred (`text-4xl`)
- Label — `t-caption text-fg-muted`, below emoji
- Count — `t-body3 font-semibold text-fg`, below label

Selected state: brand-coloured border (`border-[var(--brand)]`), subtle brand tint background, label and count switch to brand colour.

---

## UX Behaviour

### Interaction model (shared across both styles)
- Clicking any reaction in either style selects it and increments its count (optimistic UI)
- A user can select **one reaction per article** per browser session
- Selecting a different reaction **swaps** the previous one (decrement old, increment new)
- Selecting the same reaction again **deselects** it (decrement)
- Both bar and card reflect the same selected state simultaneously — they share state

### Total count line
- Sits above the bar: `[N] reactions` — e.g. "2,382 reactions"
- Comma-formatted numbers
- Zero state: "Be the first to react" (no number shown)

### Animation
- On click: selected item does a `scale: [1, 1.12, 1]` spring pulse (Framer Motion)
- Count number: fade transition via `key` prop change
- Entry: whole section fades up with `fadeUp` + `whileInView` + `viewport={{ once: true }}`

---

## Data Model

### Storage: Vercel KV (Redis)
Package: `@vercel/kv`

**Per-article reaction counts hash:**
```
Key:    reactions:{slug}
Type:   Redis Hash
Fields: thoughtful | helpful | loved | mindblown | relatable
Value:  integer (count)
```

**Total** is computed on read (sum of all field values) — no separate key.

### Deduplication
- Cookie-based: `reaction_{slug}`, value = current selected reaction key (e.g. `thoughtful`)
- `HttpOnly: true` — component reads `userReaction` from API response, not `document.cookie`
- `SameSite: Lax`, `Max-Age: 365 days`
- Soft guard — appropriate for a portfolio, not a voting system

---

## API

### `GET /api/reactions?slug={slug}`

**Response:**
```json
{
  "counts": {
    "thoughtful": 42,
    "helpful": 18,
    "loved": 94,
    "mindblown": 31,
    "relatable": 57
  },
  "total": 242,
  "userReaction": "loved"
}
```

`userReaction` is read from the request cookie. `null` if user hasn't reacted.

### `POST /api/reactions`

**Body:** `{ slug, reaction }` — `reaction` is one of the five keys, or `null` to deselect.

**Logic:**
1. Read previous reaction from cookie
2. If previous differs from new: `HINCRBY reactions:{slug} {prev} -1`
3. If new reaction is not null: `HINCRBY reactions:{slug} {new} 1`
4. Set/delete cookie
5. Return updated counts + total

**Response:** same shape as GET.

**Error cases:**
- Invalid slug → 400
- Invalid reaction type → 400
- KV unavailable → 503 (component degrades: shows pills without counts, reactions still fire and are queued client-side — no, out of scope — just show without counts)

---

## File Structure

```
app/
  api/
    reactions/
      route.js                      # GET + POST handlers
app/
  components/
    sections/
      ArticleReactions.js           # Client component — bar + card, shared state
lib/
  reactions.js                      # KV helpers: getReactions(), setReaction()
```

`ArticleReactions.js` contains both styles as internal sub-components (`ReactionBar`, `ReactionCards`) sharing the same `counts`, `userReaction`, and `handleReact` state/handler from the parent.

---

## Component: `ArticleReactions`

**Location:** `app/components/sections/ArticleReactions.js`

**Props:** `{ slug: string }`

**Internal structure:**
```
ArticleReactions
  ├── state: counts, userReaction, loading, error
  ├── effect: GET /api/reactions on mount
  ├── handleReact(type): optimistic update → POST → confirm or revert
  ├── <TotalCount />        — "N reactions" line
  ├── <ReactionBar />       — pill strip, responsive label
  └── <ReactionCards />     — emoji grid
```

**Fallback states:**
- Loading: skeleton pills (bar) + skeleton cards (grid), pulsing opacity
- Error / KV unavailable: pills and cards render without counts, still interactive
- Zero reactions: "Be the first to react" total line, counts show as `—` or hidden

---

## Integration: ArticleClient.js

Add `<ArticleReactions slug={article.slug} />` after the article body section, before "More writing". The `article.slug` field is confirmed available — it's set by `getArticleBySlug` and used in `generateStaticParams`.

---

## Environment Variables

Add to `.env.local` and Vercel dashboard:
```
KV_URL=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

Auto-generated when adding a KV store in the Vercel dashboard.

---

## Style Guide Update

Add a "Reactions" section to `app/style-guide/page.js` demonstrating:
- Bar + card in default (unselected) state
- Bar + card with one reaction selected
- Loading skeleton state
- Zero-state ("Be the first to react")
- Mobile-width simulation (narrow container) showing bar pill label collapse

---

## Out of Scope

- Per-reaction breakdown tooltip on hover
- Reactions in article listing cards (can add later using bar style only)
- Admin view of most-reacted articles
- Rate limiting beyond cookie dedup
- Anonymous user identity / accounts
