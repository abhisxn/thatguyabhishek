---
name: skill-case-study-rewrite
description: >
  Use when restructuring or rewriting product design case studies to
  Staff/Principal/Senior level quality. Triggers when the user shares a case
  study to improve, rewrite, or prepare for a job application. Also triggers
  for: "make this sound more senior", "fix the opening", "strengthen the
  impact section", "rewrite this for a Director role", or "help me turn this
  into a case study". Always combines with abhishek-voice.
compatibility:
  requires: abhishek-voice
---

# Case Study Rewrite Skill

Elevates case studies from mid-level execution narratives to Staff/Principal-level
strategic stories. Detects case study type, applies matching structural template,
rewrites in Abhishek's voice.

Always combines with `abhishek-voice`. Every output must sound like him.

---

## Step 0 — Smart Routing (Do This First)

Detect mode from input. Do NOT ask the user to choose.

| Input | Mode | What to do |
|---|---|---|
| Notion URL | REWRITE | Fetch → parse → rewrite |
| Website URL | REWRITE | Fetch → parse → rewrite |
| Pasted text | REWRITE | Parse directly → rewrite |
| Raw notes/bullets | BUILD | Run 5-question intake → draft |
| "New case study" | BUILD | Run 5-question intake → draft |
| No content given | BUILD | Ask which project → intake |

---

## BUILD MODE — 5-Question Intake

Ask all 5 in one message — don't drip them:

> 1. PROJECT NAME + your role + timeline
> 2. THE PROBLEM — what was broken? (business terms, not design terms)
> 3. WHAT YOU SPECIFICALLY DID — not the team. (2-3 sentences)
> 4. THE OUTCOME — any numbers? ("users stopped complaining about X" counts)
> 5. THE HONEST BIT — what didn't work? what would you do differently?

Auto-detect case study type from answers → apply matching template → full draft.

---

## Step 1 — Collect Input (REWRITE MODE)

Accept from: Notion URL / website URL / pasted text / file upload.
Also collect (ask only if unclear): target role, target company, output mode.

---

## Step 2 — Auto-Detect Case Study Type

Classify into one of 5 types from the content. Do NOT ask the user.

| Type | Key signals |
|---|---|
| 1. Feature / AI Product | Single feature, shipped, has metrics, PM/eng collaboration |
| 2. Strategy / Vision | No single shipped feature, research-heavy, frames a problem space |
| 3. Leadership / Scale | Large user base, cross-functional scope, launch complexity |
| 4. Founder / Startup | 0-to-1, wore multiple hats, real business stakes, postmortem |
| 5. Design System / Internal Tool | System-level thinking, multi-team scope, governance model |

Full structural templates for each type: see `case-study-templates.md`.

---

## Step 3 — Confirm Output Mode

If not specified, ask once:

> A) Fully rewritten case study — ready to paste into Notion/website
> B) Restructured outline + rewritten key sections (opening, decisions, impact)
> C) Side-by-side — original vs. suggested rewrite with commentary

Default to **B** if exploratory. **A** if multiple revision rounds done. **C** if learning.

---

## Step 4 — Apply Structural Template

Templates are in `case-study-templates.md`. Apply the one matching the detected type.
Non-negotiable sections: marked **[REQUIRED]**. Conditional sections: **[IF EARNED]**.

---

## Step 5 — Rewrite Execution

### The Opening (most critical — rewrite this first)

Formula:
```
[Business problem, one sentence, no jargon]
[My specific contribution, one sentence, first person]
[The primary metric, specific and earned]
[The decision or insight that made it work]
```

**Mid-level (before):**
> "In this case study, I'll walk you through the design process I followed when
> I was asked to improve the chart experience in Microsoft Excel."

**Staff-level (after):**
> "Excel had a 98% chart deletion rate. That's not a charting problem — it's a
> trust collapse at the product's most critical moment. I reframed the brief,
> ran the competitive case, and designed the feature that moved chart retention
> by 15% across 400M users. Three decisions made the difference."

### Pivotal Decision Section

For each decision:
```
DECISION: [one-sentence statement of the choice]
OPTIONS: [what were the real alternatives?]
CHOSEN PATH: [what you did and the specific reasoning]
THE TENSION: [who disagreed, what was at risk]
THE OUTCOME: [what happened as a result of this choice]
```

### Impact Section

Never: "The redesign improved the user experience and received positive feedback."

Always:
```
[X]% improvement in [specific metric]
From [baseline] to [result] over [timeframe]
Attribution: [how much was design's contribution?]
Secondary: [what else moved as a result?]
```

---

## Step 6 — Voice Check

After structuring, apply `abhishek-voice` to every section.

- **Opening:** Sounds like him talking to a smart friend — not a template?
- **Decisions:** First person with specific reasoning — not passive vague?
- **Metrics:** Stated with confidence? "Roughly approximately 15%" → "15%"
- **Failure sections:** Watchlyst quality — specific, precise, honest?

---

## Step 7 — Role-Level Calibration

| Target Level | Lead with | De-emphasise |
|---|---|---|
| Senior IC / Staff | Craft decisions, research rigour, systemic thinking | Management, team size |
| Principal | Strategic influence, org-level impact, cross-team systems | Individual screens |
| Manager | Team building, design culture, mentorship evidence | Personal craft details |
| Director | Vision + roadmap ownership, executive influence | Feature-level execution |

**Never oversell scope.** Authenticity > positioning.

---

## Common Failure Modes

| Failure | Signal | Fix |
|---|---|---|
| Process narration | "First I did X, then Y" | Replace with decision narration |
| Team credit diffusion | "We collaborated to..." | Clarify what you specifically owned |
| Metric orphaning | Metric with no baseline | Add baseline + timeframe + attribution |
| Jargon as substance | "Ideated solutions to improve the UX" | Replace with the actual decision |
| Generic personas | "Meet Sarah, 32..." | Replace with real insight or cut |
| Process diagrams | Double diamond, design sprint | Replace with decision diagram or cut |
| Buried lede | Important insight on page 3 | Move to opening or second paragraph |
| Passive ownership | "The design was well-received" | "65% thumbs-up rate in early testing" |
| Inflated scope | Implying you ran something you contributed to | Clarify role — honesty is more credible |
| Missing failure | Everything worked first time | Add the constraint, the pivot, the thing that didn't work |

---

## Reference

Full structural templates for all 5 case study types: `case-study-templates.md`
