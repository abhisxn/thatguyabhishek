# Design System Content Series — Implementation Plan

> **For agentic workers:** Use superpowers:website-content-writer for each piece. Load skill-abhishek-voice before drafting any word. Confirm outline before writing full draft. Save to Notion after confirmation.

**Goal:** A 4-post + 1 article series documenting the real back-and-forth of building a Figma design system with AI — the failures, the fixes, the audit, the optimized workflow.

**Architecture:** Each post is standalone and can be read independently. Together they form a complete arc: ambition → execution failures → accumulated debt → system repair → optimized workflow. Posts 1–4 are LinkedIn posts (150–300 words). The article is a long-form website piece (1000–1500 words).

**Source material:** Session logs in `~/.claude/projects/-Users-abhishek-thatguyabhishek/` — specifically `f8e21d7c-*.jsonl` (footer/navbar comparisons) and `9dc20aeb-*.jsonl` (input atom).

**Notion DB:** 💡 Raw Notes — Idea Inbox (`d77d1bf075514c2bac0f6590481fd2b4`)

---

## Series Overview

| # | Format | Title | Hook |
|---|---|---|---|
| 1 | LinkedIn post | The Blob Problem | Claude replaced my illustrated avatar with a decorative purple blob. I had to show it my own version to explain what went wrong. |
| 2 | LinkedIn post | Variables Named, Not Bound | It referenced the right token names. It never actually bound them. The design still had hardcoded values everywhere. |
| 3 | LinkedIn post | The 80+ Magic Numbers | My design system had a base-8 grid rule on day one. Two months later: 293px, 63.5px, py-2.5. |
| 4 | LinkedIn post | Skills ≠ MCP Servers | I ran `claude mcp add skill figma-design-system`. That was wrong. Broke my startup. Here's how skills actually work. |
| 5 | Website article | The Full Retrospective | All four moments together, with the optimized workflow and what I'd encode differently from the start. |

---

## Post 1: The Blob Problem
**Platform:** LinkedIn
**Format:** Post (200–280 words)
**Notion status target:** In Progress → Done

### What happened (source material)
- Asked Claude to build the footer component, match the live website, use variables
- Claude built: `text-[32px]` headline (should be `56px`), `280px` card (should be `339px`), 100px link columns (should be `322px`), purple decorative blob (should be actual illustrated avatar), Glory font only (LinkedIn card needs Manrope)
- I built my version to show the gap — then asked Claude to diagnose itself
- Claude's own diagnosis: "guessed proportions from code instead of reading the design, referenced variable names inline but never bound them, replaced a real illustration with a blob, mixed up font context"
- The question I had to ask: "What instructions should I add to the skill so you don't repeat this?"

### Outline
```
HOOK: I asked Claude to match my live website footer exactly.
      It replaced my illustrated avatar with a purple blob.

BODY:
- The spec was detailed. The skill existed. The Figma MCP was connected.
- My version: 56px headline, fixed card dimensions, actual avatar, Manrope on the LinkedIn card.
- Claude's version: 32px headline, a shrunken card, a blob, Glory everywhere.
- When I asked it to diagnose the gap: it named every failure correctly.
  Couldn't apply it forward. Could only explain it backward.

CLOSE: Having the skill doesn't mean the skill runs.
       Knowing the rule doesn't mean executing it unprompted.
       The gap between spec and execution is where the real work is.
```

### Anti-patterns to avoid
- No "AI is bad" framing — this is about discipline, not capability
- No humble lesson arc — the point is the specific failure, not a growth story
- The avatar/blob detail is the hook. Don't bury it.

---

## Post 2: Variables Named, Not Bound
**Platform:** LinkedIn
**Format:** Post (200–250 words)
**Notion status target:** In Progress → Done

### What happened (source material)
- Tokens → variables → components was the rule. Every time.
- Claude referenced `var(--color/surface/card)` inline in Figma properties
- Never created the variable collection first
- Never used `setBoundVariableForPaint` to actually bind
- The design still had hardcoded fills — the variable names were decorative text, not live bindings
- Same session: Button atom collapsed from 36 → 9 variants using variable mode — that worked
- Input atom: Claude gave 15 variants. Same variable-mode solution existed. I had to ask: "Can we not solve this like buttons?"

### Outline
```
HOOK: Claude wrote the right token names everywhere.
      None of them were actually bound to anything.

BODY:
- The rule was: tokens → variables → components. In that order.
- What it did: component → inline variable name strings → called it done.
- The fills were still hardcoded. The variable names were decoration.
- The button worked: 36 variants collapsed to 9 using variable mode.
  I didn't have to ask for that one. It reasoned correctly.
- The input didn't. 15 variants. I had to say "can we not solve this like buttons?"
  It knew the pattern. It just didn't apply it without being prompted.

CLOSE: The frustrating part isn't when AI doesn't know something.
       It's when it knows — and doesn't connect the dots unless you ask.
```

---

## Post 3: The 80+ Magic Numbers
**Platform:** LinkedIn
**Format:** Post (200–280 words)
**Notion status target:** In Progress → Done

### What happened (source material)
- Base-8 grid rule was in CLAUDE.md from the start
- Full audit: 80+ violations across 14 files — `293px`, `63.5px`, `py-2.5`, `gap-1.5`, `22px` column padding
- CLAUDE.md said font was "Glorie" — actual font in `layout.js` is "Glory"
- Stale hex values in docs that had already been replaced with tokens in actual code
- The audit fixed it all. But the drift happened in plain sight, over time.

### Outline
```
HOOK: My design system had a base-8 grid rule from day one.
      Two months in: 293px. 63.5px. py-2.5.

BODY:
- The rule was documented. It just didn't survive every component added at speed.
- 80+ violations. 14 files. Not one big mistake — 80 small ones that accumulated.
- CLAUDE.md said "Glorie." The actual font loaded in layout.js is "Glory."
  Small. Not small. Documentation lies the moment you stop treating code as authoritative.
- The audit fixed it. But the question is: what caused the drift?
  Not laziness. Not carelessness. Incremental shortcuts under context pressure.

CLOSE: Design systems don't break. They drift.
       The rule was never wrong. The discipline was.
```

---

## Post 4: Skills ≠ MCP Servers
**Platform:** LinkedIn
**Format:** Post (180–240 words)
**Notion status target:** In Progress → Done

### What happened (source material)
- Tried to add a skill by running `claude mcp add skill figma-design-system`
- Created a broken stdio entry that errored on every startup
- Skills live in `.claude/skills/[folder-name]/SKILL.md` — auto-discovered, no registration needed
- Also: SKILL.md frontmatter `name:` must match folder name exactly — mismatch causes warnings
- Only supported frontmatter keys: `name`, `description`, `argument-hint`, `compatibility`, `disable-model-invocation`, `license`, `metadata`, `user-invocable`
- Figma MCP was configured but needed auth flow run before any skill using it would work

### Outline
```
HOOK: I ran `claude mcp add skill figma-design-system`.
      That was wrong. It broke my Claude startup.

BODY:
- Skills are not MCP servers. They don't get registered. They get discovered.
- Drop a folder with a SKILL.md in .claude/skills/. Done.
- `claude mcp add` creates a stdio entry. An stdio entry that doesn't point
  to anything useful errors on every session start.
- Also: the name in frontmatter must match the folder name. Exactly.
  A mismatch produces warnings. Not errors. Which means you might not notice.
- And: Figma MCP needs an auth flow before any skill using it will work.
  Had skills, had MCP, had spec. Still couldn't run the workflow until I
  sorted auth first.

CLOSE: The tooling works. Reading it wrong doesn't.
```

---

## Post 5 (Long-form): The Full Retrospective
**Platform:** Website (`thatguyabhishek.com`)
**Format:** Article (1000–1500 words)
**Notion status target:** In Progress

### Structure
```
TITLE: I Built a Figma Design System With AI. Here's What Actually Happened.

LEDE: The spec was detailed. The skills existed. The MCP was connected.
      Claude still built a footer with a purple blob where my avatar should be,
      a navbar with a text placeholder where my logo was, and proportions so 
      small everything looked like a thumbnail. This is the honest account.

SECTIONS:
  1. The Setup — 6-phase spec, what I was trying to build, the two-file architecture
     (source design W3X90ArCwhgRQjTnBUvg93 vs target system 7aiv0CSLE2XLZGQjrqQ9ic)

  2. Failure Mode 1: Read the Code, Skip the Design
     Footer story. My version vs Claude's version side by side.
     The diagnosis Claude gave when I asked. The "only one of two sources" insight.

  3. Failure Mode 2: Name the Token, Don't Bind It
     Variables as decoration. Button worked (36→9). Input didn't (15 variants).
     The pattern of knowing without connecting.

  4. Failure Mode 3: Try the Wrong Layer Twice
     The gradient. Three attempts. All wrong layer. The word "stop."
     What this looks like when you're watching it happen in real time.

  5. The Drift Problem
     80+ magic numbers. CLAUDE.md said Glorie. Code said Glory.
     Documentation is a lag indicator. Code is the source of truth.

  6. What the Optimized Workflow Actually Looks Like
     Step 1: Auth before anything else (MCP, Figma, all of it)
     Step 2: Read live code AND source design file — both, not either
     Step 3: Create variable collection first, bind before building
     Step 4: Mid-build screenshot validation — don't wait until the end
     Step 5: After every design system change: update globals.css AND CLAUDE.md in same commit

  7. Next Steps
     Code Connect. Publish library. CLAUDE.md sync discipline.

CLOSE: The system was right. The skill was right. 
       The problem was each step executed without fully thinking through the step before it.
       That's not an AI problem. That's a process problem.
       And process problems get fixed by encoding the discipline — not assuming it.

TARGET PHRASE: building a design system with AI
```

---

## Execution Order

Run these in sequence. Each post should be confirmed and saved to Notion before moving to the next.

- [ ] **Step 1:** Write Post 1 outline → confirm → full draft → save to Notion
- [ ] **Step 2:** Write Post 2 outline → confirm → full draft → save to Notion
- [ ] **Step 3:** Write Post 3 outline → confirm → full draft → save to Notion
- [ ] **Step 4:** Write Post 4 outline → confirm → full draft → save to Notion
- [ ] **Step 5:** Write Article outline → confirm → full draft → save to Notion
- [ ] **Step 6:** Create `working-with-ai-on-design-systems` skill (see below)

---

## Skill to Create: `working-with-ai-on-design-systems`

Based on all failures above, this skill encodes the optimized workflow so future sessions don't repeat these mistakes.

**Location:** `.claude/skills/working-with-ai-on-design-systems/SKILL.md`

**Core rules to encode:**
1. Auth first — MCP + Figma auth before any design system work
2. Two sources, not one — live code tells you WHAT to build, source Figma tells you HOW it should look at design scale. Both. Always.
3. Variable collection before component — create collection, bind to fills/strokes/text, verify in both modes before building anything
4. Mid-build screenshot validation — after each major component, not at the end
5. Real assets, not placeholders — logo SVG not text, avatar not blob, correct font per context
6. Pattern application is not automatic — if Button used variable mode to collapse variants, explicitly state "apply same pattern to Input" — don't assume transfer
7. `globals.css` is authoritative — CLAUDE.md is documentation, verify token values against actual CSS before using
8. Skills ≠ MCP servers — never `mcp add` a skill

**Trigger:** Use when starting any Figma design system work, component building, or token system work.

---

## Notes

- All session evidence lives in `f8e21d7c-333b-4f7d-9a16-0c607c7d05a3.jsonl` and `9dc20aeb-f608-4066-9497-3d2438a935e8.jsonl`
- Figma comparison links (for article): footer `51:15` (Claude) vs `169:59` (Abhishek), navbar `200:4` (Claude) vs `194:152` (Abhishek)
- Design file for all comparisons: `7aiv0CSLE2XLZGQjrqQ9ic`
