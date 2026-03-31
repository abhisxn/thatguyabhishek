---
name: skill-case-study-rewrite
description: >
  Restructure and rewrite product design case studies to Staff/Principal/Senior
  level quality. Use this skill whenever the user shares a case study and asks
  to improve it, rewrite it, restructure it, make it stronger, elevate the
  narrative, or prepare it for a specific job application. Also triggers for
  requests like "make this sound more senior", "fix the opening", "strengthen
  the impact section", "rewrite this for a Director role", or "help me turn
  this into a case study". Always combines with the abhishek-voice skill — every
  rewrite must sound like him, not like a polished template. When in doubt,
  use this skill — a case study that reads like a mid-level IC is actively
  hurting the application.
compatibility:
  requires: abhishek-voice
---

# Case Study Rewrite Skill

Elevates product design case studies from mid-level execution narratives to
Staff/Principal-level strategic stories. Detects the case study type, applies
the right structural template, and rewrites in Abhishek's voice.

Always combines with `abhishek-voice` skill. Every output must sound like him.

---

## Step 0 — Smart Routing (Do This First)

Before doing anything else, identify which mode applies based on what was given.
Do NOT ask the user to choose — detect it and proceed.

```
INPUT RECEIVED          MODE                    WHAT TO DO
─────────────────────────────────────────────────────────────────────
Notion URL          →   REWRITE MODE        →   Fetch → parse → rewrite
Website URL         →   REWRITE MODE        →   Fetch → parse → rewrite
Pasted text         →   REWRITE MODE        →   Parse directly → rewrite
Raw notes/bullets   →   BUILD MODE          →   Run 5-question intake → draft
"New case study"    →   BUILD MODE          →   Run 5-question intake → draft
No content given    →   BUILD MODE          →   Ask which project → intake
─────────────────────────────────────────────────────────────────────
```

**REWRITE MODE** = content already exists, needs elevation
**BUILD MODE** = starting from scratch or raw notes, needs structure first

---

### BUILD MODE — 5-Question Intake

When content doesn't exist yet, run this intake sequence.
Ask all 5 questions in one message — don't drip them one by one.

```
"To build this case study properly, I need 5 things:

1. PROJECT NAME + your role + timeline
2. THE PROBLEM — what was broken, missing, or painful? 
   (one sentence, business terms, not design terms)
3. WHAT YOU SPECIFICALLY DID — not the team, you.
   (2-3 sentences)
4. THE OUTCOME — any numbers, reactions, or results?
   (even rough ones — 'users stopped complaining about X' counts)
5. THE HONEST BIT — what didn't work, what would you do differently?
   (one sentence — this is what makes it credible)"
```

Once answered: auto-detect case study type from the answers, apply the
matching template from Step 4, produce a full draft in their voice.

---

## Step 1 — Collect the Input (REWRITE MODE)

Accept case study content from any of these sources:
- Notion URL → fetch with Notion MCP
- Website URL → fetch with web tool
- Pasted text → use directly
- File upload → extract content

Also collect (ask only if genuinely unclear):
- **Target role** (if known): IC Senior/Staff/Principal vs. Manager/Director
- **Target company** (if known): shapes emphasis
- **Output mode** (ask if not specified — see Step 3)

---

## Step 2 — Auto-Detect Case Study Type

Analyse the content and classify into one of five types.
Do NOT ask the user which type — detect it from the material.

### Type 1: Feature / AI Product Work
**Signals:** Single feature or product area, shipped to users, has metrics,
involves engineering/PM collaboration, includes design iterations.

**Examples in portfolio:** Chart Insights, Chart Recommendations, Smarter Chart Defaults

**What this type must prove:**
- You solved a business problem, not a design problem
- You made 2–3 pivotal decisions that changed the project's direction
- You owned the metrics, not just the pixels
- You navigated real constraints (technical, political, resource)

---

### Type 2: Strategy / Vision / Roadmap
**Signals:** No single shipped feature — defines the WHY and the WHAT across
multiple features or a product area. Research-heavy. Frames a problem space.
Often the parent of multiple execution case studies.

**Examples in portfolio:** Excel Data Visualisation: The Strategy Behind the Roadmap

**What this type must prove:**
- You reframed the problem in a way that changed what got built
- You influenced the roadmap, not just contributed to it
- The strategy was tested by reality — at least one thing shipped from it
- You can connect research insights to business consequences

---

### Type 3: Leadership / Scale Story
**Signals:** Large user base, cross-functional scope, team leadership, launch
complexity, zero-downtime constraints, growth design or design function building.

**Examples in portfolio:** Airtel Thanks 2.0

**What this type must prove:**
- You led something, not just participated in it
- Scale created real constraints that shaped your decisions
- You built design capability, not just designed a product
- The outcome is measured at the business level (MAU, retention, revenue)

---

### Type 4: Founder / Startup Story
**Signals:** 0-to-1 product, wore multiple hats, no large team, real business
stakes (funding, growth, failure), GTM execution, honest postmortem.

**Examples in portfolio:** Watchlyst, ThinkPlanty

**What this type must prove:**
- You understand design's role inside a working (or failing) business
- You made product and business decisions, not just design decisions
- You can evaluate your own work honestly, including where it failed
- The experience shaped how you design differently today

---

### Type 5: Design System / Internal Tool
**Signals:** System-level thinking, multiple teams or products served, token
architecture, governance model, adoption strategy, operational impact.

**Examples in portfolio:** GoodWorker Design System, Copilot Excel Wiki Agent

**What this type must prove:**
- You solved an organisational problem, not just a visual consistency problem
- The system was adopted (not just built)
- You have a governance and maintenance model, not just a component library
- The system unlocked product velocity or quality improvement you can measure

---

## Step 3 — Confirm Output Mode

If the user hasn't specified, ask once:

> "Which output do you want?
> A) Fully rewritten case study — ready to paste into Notion/website
> B) Restructured outline + rewritten key sections (opening, decisions, impact)
> C) Side-by-side — original vs. suggested rewrite with commentary explaining each change"

Default to **B** if the user seems exploratory or uncertain.
Default to **A** if they've already done multiple revision rounds.
Default to **C** if they're trying to learn, not just get a deliverable.

---

## Step 4 — Apply The Structural Template

Each type has a required narrative architecture.
Non-negotiable sections are marked **[REQUIRED]**.
Contextual sections are marked **[IF EARNED]** — only include if the content genuinely supports it.

---

### Template 1: Feature / AI Product Work

```
[REQUIRED] THE 90-SECOND SUMMARY
─────────────────────────────────────────────────────────────
Business problem in one sentence (not design problem)
My specific role in one sentence (not "the team")
The outcome in one specific metric
The decision that made the difference
─────────────────────────────────────────────────────────────

[REQUIRED] THE BUSINESS CONTEXT
Why this problem mattered to the company right now.
Market context, competitive pressure, or internal data
that made this urgent. Not background — stakes.

[REQUIRED] THE REFRAME
What everyone thought the problem was.
What you determined the problem actually was.
Why that distinction changed everything.

[IF EARNED] THE RESEARCH FOUNDATION
Only if research genuinely shaped the direction —
not if it just validated the brief.
Specific insight, not methodology list.

[REQUIRED] THE PIVOTAL DECISIONS (2–3 maximum)
For each decision:
  - What were the options?
  - What did you choose and why?
  - What would have happened with the other option?
  - Who disagreed and how did you handle it?

[IF EARNED] THE CONSTRAINTS THAT SHAPED THE WORK
Technical, timeline, resource, or political constraints
that weren't in the brief — and how you designed within them.
Only if the constraints genuinely shaped the outcome.

[REQUIRED] THE OUTCOME
Specific metric. Baseline → result.
Attribution: what part of the result was design's contribution?
Secondary outcomes (qualitative, strategic, team).

[IF EARNED] WHAT I'D DO DIFFERENTLY
Only if genuinely true and specific.
Not a formulaic "lessons learned" section.
```

---

### Template 2: Strategy / Vision / Roadmap

```
[REQUIRED] THE STAKES
What business decision was this strategy meant to inform?
Who commissioned it? What would they do with it?
What happened if the strategy was wrong?

[REQUIRED] THE CONVENTIONAL WISDOM YOU CHALLENGED
What did everyone already think about this problem?
Why was that insufficient, incomplete, or wrong?
What data or observation made you see it differently?

[REQUIRED] THE REFRAME
One sentence: the problem reframed.
This should be the sentence that made stakeholders
stop and reconsider their assumptions.

[REQUIRED] THE EVIDENCE BASE
What research, data, or competitive analysis
built the case for the reframe?
Be specific — not "I conducted research" but
"22% of Copilot-enabled users were charting but
only 11% were using Copilot features. That 11pp
gap was the brief."

[REQUIRED] THE STRATEGIC DECISIONS
What did you recommend building and what did you
explicitly recommend NOT building — and why?
Prioritisation is strategy. Show yours.

[REQUIRED] THE CONNECTION TO OUTCOMES
What shipped from this strategy?
What metrics did those shipped features move?
If nothing shipped yet — what's the evidence the
strategy is being followed?

[IF EARNED] WHAT THE STRATEGY GOT WRONG
Only if time or results have revealed gaps.
Intellectual honesty here earns more credibility
than a clean strategy narrative.
```

---

### Template 3: Leadership / Scale Story

```
[REQUIRED] THE SCALE CONTEXT
Numbers first. Not as a flex — as a constraint.
"100M users, single launch, no rollback option"
tells the reader immediately why your decisions
were different from a standard product launch.

[REQUIRED] WHAT I BUILT — NOT WHAT I DESIGNED
The team, function, or capability you created.
Not the screens. The organisation's new ability.
"I established the growth design function" is
a leadership claim. Support it specifically.

[REQUIRED] THE PIVOTAL LEADERSHIP DECISIONS
2–3 decisions where your call as the leader
changed the outcome. Not design decisions —
scope, team, process, or strategic decisions.

[REQUIRED] THE CROSS-FUNCTIONAL INFLUENCE
Who did you need to bring along?
What was their initial position?
How did you move them?
What would have shipped without your influence?

[REQUIRED] THE OUTCOME AT BUSINESS SCALE
Not "users responded positively."
MAU delta. Revenue implication. Zero incidents.
Team capability before and after.

[IF EARNED] WHAT THIS UNLOCKED
Subsequent work, promotions, capabilities, or
product directions that this leadership made possible.
```

---

### Template 4: Founder / Startup Story

```
[REQUIRED] THE SHORT VERSION
Stats table: downloads, revenue, funding, timeline, team size.
One sentence of honest summary — including the failure
if there was one. Don't bury it. Lead with it.

[REQUIRED] THE PROBLEM SPACE
Why this problem, why now, why you.
Market context that made the opportunity real.
The insight that others had missed.

[REQUIRED] THE PRODUCT DECISIONS
2–3 core product bets and why you made them.
Not features — bets. What would be true if you were right?
What alternatives did you reject?

[REQUIRED] THE BUSINESS THINKING
Monetisation strategy, go-to-market approach,
growth mechanics. Founders think about the whole
system. Show that you did too.

[REQUIRED] THE HONEST NUMBERS
What worked. What didn't. Both with specificity.
Don't let the good metrics hide the bad signals
you chose to ignore. That's where the learning is.

[REQUIRED] THE FAILURE AUTOPSY (if applicable)
Not "what I learned." What specifically went wrong.
What decision, in retrospect, was the mistake.
What you would do differently with the same resources
and the same information.

[REQUIRED] WHAT THIS CHANGED IN HOW I DESIGN
Not platitudes. Specific examples from subsequent roles
where this experience directly shaped a decision.
```

---

### Template 5: Design System / Internal Tool

```
[REQUIRED] THE ORGANISATIONAL PROBLEM
Not "we needed consistency." The actual business
problem: velocity loss, rework cost, quality failures,
new-hire ramp time. Quantify if possible.

[REQUIRED] WHY THE OBVIOUS SOLUTION WASN'T ENOUGH
What had been tried before? Why didn't it hold?
The answer to this is usually governance, not craft.

[REQUIRED] THE STRATEGIC DECISIONS
Component architecture, token strategy, governance model,
adoption playbook. Which of these decisions were yours?
What options did you reject and why?

[REQUIRED] THE ADOPTION STORY
Building the system is 20% of the work.
Getting teams to use it is 80%.
What was your adoption strategy?
What resistance did you face and how did you overcome it?

[REQUIRED] THE OUTCOME
Not "improved consistency." Specific:
- Design-to-dev handoff time before vs. after
- New component build time before vs. after
- Adoption rate at 30/60/90 days
- Rework reduction or quality improvement

[IF EARNED] THE GOVERNANCE MODEL
Who owns new component decisions?
How are breaking changes handled?
This signals whether the system will outlast you.

[IF EARNED] SECOND-ORDER EFFECTS
What did the system make possible that couldn't
have been built without it?
```

---

## Step 5 — The Rewrite Execution

### The Opening (most critical — rewrite this first)

Every case study must open with the **90-second version** of the story.
This is not an introduction. It's the whole story compressed.

**The formula:**
```
[Business problem, one sentence, no jargon]
[My specific contribution, one sentence, first person]
[The primary metric, specific and earned]
[The decision or insight that made it work]
```

**Mid-level opening (before):**
> "In this case study, I'll walk you through the design process I followed
> when I was asked to improve the chart experience in Microsoft Excel."

**Staff-level opening (after):**
> "Excel had a 98% chart deletion rate. That's not a charting problem —
> it's a trust collapse at the product's most critical moment.
> I reframed the brief, ran the competitive case, and designed the feature
> that moved chart retention by 15% across 400M users.
> Three decisions made the difference."

### The Pivotal Decision Section (second most critical)

The most common case study failure: describing what was built without explaining
why it was built *this way* and not another way.

For each pivotal decision, use this structure:
```
DECISION: [one-sentence statement of the choice]
OPTIONS: [what were the real alternatives?]
CHOSEN PATH: [what you did and the specific reasoning]
THE TENSION: [who disagreed, what the constraint was, what was at risk]
THE OUTCOME: [what happened as a result of this specific choice]
```

### The Impact Section (third most critical)

**Never:** "The redesign improved the user experience and received positive feedback."

**Always:** Metric + baseline + timeframe + attribution

```
[X]% improvement in [specific metric]
From [baseline] to [result] over [timeframe]
Attribution: [how much of this was design's contribution?]
Secondary: [what else moved as a result?]
```

---

## Step 6 — Voice Check

After structuring, apply the `abhishek-voice` skill to every section.
Key voice checks for case studies specifically:

- **Opening:** Does it sound like him talking to a smart friend, or like
  a case study template? If it reads like something any designer could
  have written, it's not ready.

- **Decision sections:** Are they in first person with specific reasoning,
  or passive voice with vague justification? "We decided to..." → "I made
  the call to... because..."

- **Metrics:** Are they stated with confidence or over-qualified?
  "Roughly about approximately 15% improvement" → "15% improvement."
  Own the number.

- **Failure/learning sections:** Do they have the Watchlyst quality —
  specific, precise, honest — or do they read like performative vulnerability?

---

## Step 7 — Role-Level Calibration

Adjust emphasis based on target role:

| Target Level | Lead with | De-emphasise |
|---|---|---|
| Senior IC / Staff | Craft decisions, research rigour, systemic thinking | Management, team size |
| Principal | Strategic influence, org-level impact, cross-team systems | Individual screens |
| Manager | Team building, design culture, mentorship evidence | Personal craft details |
| Director | Vision + roadmap ownership, executive influence | Feature-level execution |

**Rule:** Never oversell scope. If you were an IC, don't imply you ran the team.
If you ran the team, don't hide it to seem more hands-on.
Authenticity > positioning.

---

## Output Mode Formats

### Mode A: Full Rewrite
Deliver the complete case study ready to paste.
Include: restructured narrative, rewritten opening, all sections in order,
voice-checked throughout.
Flag any sections where source material was thin and you've had to extrapolate.

### Mode B: Outline + Key Sections
Deliver:
1. Recommended structural outline (section headers, 1-line description each)
2. Fully rewritten opening (90-second version)
3. Rewritten pivotal decisions section
4. Rewritten impact section
5. Commentary on what's missing from the source material

### Mode C: Side-by-Side Commentary
Deliver a table or annotated version with:
- Original text (left/top)
- Suggested rewrite (right/bottom)
- Commentary explaining *why* the change elevates it
- Flag which changes are voice, which are structure, which are strategic framing

---

## Common Failure Modes to Fix

These appear in almost every first-draft case study. Look for all of them.

| Failure | Signal | Fix |
|---|---|---|
| Process narration | "First I did X, then Y, then Z" | Replace with decision narration — why, not what |
| Team credit diffusion | "We collaborated to..." | Clarify what *you* specifically owned |
| Metric orphaning | Metric with no baseline or context | Add baseline + timeframe + attribution |
| Jargon as substance | "Ideated solutions to improve the UX" | Replace with the actual decision made |
| Generic personas | "Meet Sarah, 32, a marketing manager..." | Replace with real user insight or cut entirely |
| Process diagrams | Double diamond, design sprint diagram | Replace with decision diagram or cut |
| Buried lede | Important insight on page 3 | Move to opening or second paragraph |
| Passive ownership | "The design was well-received" | "65% thumbs-up rate in early testing" |
| Inflated scope | Implying you ran something you contributed to | Clarify role — honesty is more credible |
| Missing failure | Everything worked first time | Add the constraint, the pivot, the thing that didn't work — this is where craft shows |

---

## Version & Maintenance

- Version: 1.0
- Works with: abhishek-voice skill (required), design-career-audit skill (optional context)
- Built from: Analysis of 9 actual case studies across 5 detected types
- Structural templates derived from: FAANG Staff/Principal portfolio bar
- Update when: New case study types are added, or target role level shifts significantly
- Maintained by: Abhishek Saxena — thatguyabhishek.com
