---
name: website-content-writer
description: >
  Use when drafting LinkedIn posts, articles, thinking notes, AI Musings
  write-ups, or any piece for Abhishek's Content Project. Triggers on:
  "write this post", "draft this", "write the article", "let's write the
  [idea name]", "I want to write about [topic]", or when referencing a
  Content Hub row, Raw Note idea, or any content destination by name.
---

# Content Writer Skill

Takes a rated idea and produces a complete, destination-ready draft.
Workflow: outline → confirm → draft → confirm → save. Never skip steps.

**REQUIRED:** Load and apply `abhishek-voice` skill before writing any word.
Voice rules are not optional — outline language, not just the draft.

---

## Notion DB Reference

| DB | Data Source ID |
|---|---|
| Content Hub | `336848f1-3d34-8024-ac1f-fa1d880ada7a` |
| Raw Notes | `0d76012a-a4c9-466a-9a18-f034f5b840ec` |
| Content Hub Parent Page | `333848f13d348122aa46fdf152520591` |

---

## Post Thinking Framework

**Lead with the human. Land on the insight.** Empathy is the setup. Analysis is the payoff.

**Beats — not paragraphs.** Every piece is built from beats. Name the beat's job before writing.
Common jobs: human moment / reframe / pattern / twist / lived experience bridge / real question

**Constraints before drafting:**
1. Angle differentiation — what's every other post on this topic saying? What's different here?
2. Audience risk — analytical framing neutralises anything that could read as pointed
3. Only-I-can-write test — is there a version only Abhishek can write given his background?

**Hook = the reframe.** Not the opener. Makes every other post on this topic feel incomplete.
Formula: `[What everyone thinks]` vs `[What is actually true]` — stated as fact, not a question.

---

## Workflow

### Step 1 — Identify the Idea

- **From Content Hub:** Fetch the row. Get title, notes, hook, destination, format, content family, raw note relation.
- **From Raw Notes:** Check if a Content Hub row already exists — if yes, use that.
- **Fresh in chat:** Treat as content-first. Proceed without Notion lookup.
- **Parse `> [Claude]` instructions** from Raw Note body if fetched — they override Claude's judgment.
- Confirm destination if not obvious. Ask once.

When piece belongs to a content family: fetch siblings, check for argument overlap, confirm this piece does its distinct job in sequence.

### Step 2 — Build the Outline

Outline templates and destination formats are in `content-templates.md`.

Present the outline. Ask: "Good to go, or any changes before I write the full draft?"
**Do not write the full draft until confirmed.**

### Step 3 — Write the Full Draft

Apply voice rules throughout. Destination specs and word counts are in `content-templates.md`.
Present the draft formatted as it would appear at its destination.

Ask: "Happy with this? I'll save it to Notion. Any edits first?"

### Step 4 — Save to Notion (after confirmation only)

**Two separate Notion calls — never combine:**

- **Call 1 (body):** `notion-update-page` with `command: update_content` — full draft as page content
- **Call 2 (properties):** `notion-update-page` with `command: update_properties`:
  - `Workflow Stage` → Draft (first save) or Ready (confirmed final)
  - `Platform Status` → Not Started

If no existing Content Hub row: create it first via `notion-create-pages`, then add draft.

### Step 5 — Mark Published

When Abhishek says "posted" or "it's live":
- `Workflow Stage` → Published
- `Platform Status` → Published
- `Published URL` → add if provided

---

## Edge Cases

- **Significant edits:** Rewrite affected section. Present updated draft. Confirm again before saving.
- **Facts/data needed:** Flag which data points need verification. Never invent statistics.
- **Duplicate risk:** Flag if this sounds close to something already Published.
- **Out of family sequence:** Note it — ask if Abhishek wants to draft the core first.
- **`> [Claude]` instructions found:** Apply them. Note what was instructed vs. inferred.

---

## What This Skill Does NOT Do

- Does not post to LinkedIn directly
- Does not write before the outline is confirmed
- Does not save to Notion before the draft is confirmed
- Does not combine Notion body + properties into one call
- Does not skip the content family check when siblings exist
