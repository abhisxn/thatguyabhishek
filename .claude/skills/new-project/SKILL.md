---
name: new-project
description: >
  End-to-end workflow for adding a new portfolio project to thatguyabhishek.com.
  Triggers when the user says "add a new project", "create a case study", "I want to
  add [project name] to my portfolio", or "scaffold a new project". Runs an intake,
  creates the Notion page with correct properties, structures the case study sections,
  and verifies the project appears in the work grid. Uses Notion MCP throughout.
user-invocable: true
metadata:
  version: "1.0"
  updated: 2026-03-30
  requires: "Notion MCP"
---

# New Project Skill

Adds a new portfolio project from scratch — intake → Notion page → case study
structure → cache sync → verification. One command, end to end.

---

## Notion IDs (do not change)

```
Work page ID:       372d8d3491624c4ebaa062d8bdb242dc
Work data source:   f10273fc0bd24a09bcba022726aa63ad   ← query with dataSources.query
Projects database:  eb8cd7fc3faf4cb58c491c89860d3f7d   ← schema reference only
```

---

## Step 0 — Detect Mode

```
INPUT                           MODE
──────────────────────────────────────────────────────
Project name only         →   INTAKE MODE   → run 7-question intake
Raw notes / bullets       →   INTAKE MODE   → extract what you can, ask for gaps
Existing Notion URL       →   STRUCTURE MODE → fetch page, apply structure template
"Just create the page"    →   QUICK MODE     → minimal intake (5 questions), bare page
```

Default to **INTAKE MODE** unless the user explicitly provides a Notion URL.

---

## Step 1 — 7-Question Intake

Ask all questions in ONE message. Do not drip them one by one.

```
"To add this project properly, I need 7 things:

1. PROJECT NAME — what's it called? (this becomes the page title and URL slug)

2. YEAR — when was this shipped or completed?

3. YOUR ROLE — one clear title: e.g. Lead Product Designer, Founding Designer,
   Senior UX Designer. Not a list — one title.

4. COMPANY / CONTEXT — where was this? (Microsoft, freelance, your startup, etc.)

5. TAGS — pick from existing or add new:
   Current tags in use: AI, Excel, Microsoft, Mobile App, Design System, Super App,
   Telecom, B2C, B2B, Web App, Strategy, Growth, Internal Tools, Entertainment,
   Education, UX Research, 0-to-1

6. ONE-LINE DESCRIPTION — the summary that appears on the work grid card.
   Should be punchy and specific. Not 'I redesigned the X experience.'
   More like: 'Reframed Excel's chart UX from a formatting problem to a trust problem.
   Moved chart retention 15% across 400M users.'

7. COVER IMAGE — do you have one ready? (URL or file path)
   If not, I'll leave it empty and you can add it later."
```

---

## Step 2 — Confirm Before Creating

Before touching Notion, output a confirmation block:

```
──────────────────────────────────────────
NEW PROJECT SUMMARY — confirm before I create:

Title:        [project name]
Slug:         [auto-generated: lowercase-hyphenated]
Year:         [year]
Role:         [role]
Company:      [company]
Tags:         [tag1], [tag2], [tag3]
Description:  [one-liner]
Cover:        [URL or "none — add later"]

Work grid URL will be: /work/[slug]
──────────────────────────────────────────
Looks right? Say yes to create, or correct anything.
```

Do NOT proceed until the user confirms.

---

## Step 3 — Create the Notion Page

Use Notion MCP to create the page inside the projects database.

### Page properties to set:

```
Name / Title:     [project name]              type: title
Description:      [one-liner]                 type: rich_text
Tags:             [array of tag names]        type: multi_select
Year:             [year as number]            type: number  (or rich_text if needed)
Role:             [role title]               type: rich_text
Company:          [company name]             type: rich_text
Cover:            [URL if provided]          type: files (external URL) or page cover
```

**Slug note:** The slug is auto-derived from the title by `lib/notion-work.js`:
```js
title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
```
So "Microsoft Wiki Agent" → `/work/microsoft-wiki-agent`. Confirm this is correct.

---

## Step 4 — Apply Case Study Structure

After creating the page, add the following block structure as page children.
This is the standard template — all sections are placeholders to fill in later.

```
📋 [CALLOUT — instructions, icon: 📝]
"Fill in each section below. Delete this callout when done."

─── HEADING 1: The 90-Second Summary ───
[paragraph placeholder: Business problem. Your role. The outcome. The decision.]

─── HEADING 1: Business Context ───
[paragraph placeholder: Why this mattered to the company right now.]

─── HEADING 1: The Reframe ───
[paragraph placeholder: What everyone thought the problem was. What you found instead.]

─── HEADING 1: Research & Discovery ───
[paragraph placeholder: Key insight that changed the direction — not methodology.]

─── HEADING 1: Pivotal Decisions ───
[paragraph placeholder: 2–3 decisions. Options considered, choice made, why, outcome.]

─── HEADING 1: Design ───
[paragraph placeholder: What was built. Key screens or flows. Constraints that shaped it.]

─── HEADING 1: Outcome & Impact ───
[paragraph placeholder: Metric. Baseline → result. Attribution. Secondary outcomes.]

─── HEADING 1: What I'd Do Differently ───
[paragraph placeholder: One honest, specific thing.]
```

**Skip sections** the user says are not applicable (e.g. a system project won't have "The Reframe" in the same way).

---

## Step 5 — Register in pages.json (if applicable)

Check if the project needs a manual entry in `data/pages.json`:

```js
// data/pages.json — maps slugs to Notion page IDs for build-time caching
// Format: { "slug": "notion-page-id" }
```

If the Notion page ID is known after creation, add it:
```json
"[slug]": "[notion-page-id]"
```

Edit `data/pages.json` directly. This ensures the project is included in the
build-time cache and doesn't require a live Notion API call on every page load.

---

## Step 6 — Trigger Cache Sync

After the page is created, the build cache needs to refresh.

**Dev (local):**
```
The dev server auto-revalidates via unstable_cache after 3600s.
For immediate local testing, hit: http://localhost:3000/admin/refresh
```

**Production:**
```
Trigger a Vercel deploy to rebuild the static cache:
Use Vercel MCP → deploy_to_vercel, or push a commit to main.
```

Remind the user: the project won't appear on the live site until the next deploy.

---

## Step 7 — Verify

After sync, confirm the project is live:

1. Check `/work` page — does the project card appear?
2. Check `/work/[slug]` — does the project page load?
3. Check the card has: title, tags, description, cover (or note it's missing)
4. Check dark + light theme on the card

Report back:
```
✅ Project created successfully.

Notion page:    [notion page URL]
Work grid:      /work/[slug]
Project page:   /work/[slug]

Missing:        [cover image / any empty properties]
Next step:      [fill in case study content / add cover / run /skill-case-study-rewrite]
```

---

## Quick Reference — Property Keys

The codebase reads these property names from Notion pages:

| Data | Property keys tried (in order) |
|---|---|
| Title | `Name` (title type — auto) |
| Description | `Description`, `Desc`, `Bio`, `About` |
| Summary/tagline | `Summary`, `Tagline`, `Excerpt` |
| Tags | `Tags`, `Tech`, `Stack`, `Category`, `Type` |
| Cover image | Page cover → `Cover`, `Image`, `Thumbnail` |
| Live URL | `URL`, `Link`, `Website`, `Url`, `Demo`, `Live` |

Use `Description` for the work grid one-liner. Use `Tags` for multi-select tags.

---

## Handoff Prompt

After creating the page, offer this:

> "Page is live in Notion. Want me to run `/skill-case-study-rewrite` on it now
> to get a full structured draft? Or `/skill-abhishek-voice` to write the
> one-liner and opening in your voice?"
