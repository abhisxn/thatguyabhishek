---
name: website-content-writer
description: |
  Draft full content pieces for Abhishek's Content Project. Use this skill whenever he says:
  - "write this post", "draft this", "write the article", "let's write the noodles post"
  - "I want to write about [topic]", "help me write this up"
  - References a specific idea from the Raw Notes DB by title
  - Says "let's do the [idea name]" when a content idea has already been rated
  - OR asks to write any LinkedIn post, thread, website article, or AI Musings caption
 
  Handles all four formats: LinkedIn post, LinkedIn thread, website article, AI Musings caption.
  Always: outline first → confirm → full draft. Never skip the outline step.
  Always apply voice rules. Never write before confirming the outline.
  After approval, writes the draft into the Notion DB row as page content AND updates Status to "In Progress".
---
 
# Content Writer Skill
 
Takes a rated idea and produces a complete, post-ready draft. Outline first. Confirm. Then full draft into Notion.
 
---
 
## Dependency: abhishek-voice skill
 
**This skill requires the `skill-abhishek-voice` skill to be active.** Before writing any word of any draft — outline, full post, caption, or article — load and apply all rules from the `skill-abhishek-voice` skill file.
 
The voice skill is not optional and not a fallback. It defines how every sentence is written. If for any reason it isn't loaded, stop and flag it before proceeding.
 
In practice this means:
- Every outline line is written in his register, not neutral template language
- Every opening line of every draft starts with the punchline
- Every draft gets cut by 20% before it's shown
- The anti-patterns list from the voice skill is checked before presenting anything
 
---

## Post Thinking Framework — Write With Intent

Before building any outline, run through these. This is the layer between raw idea and first draft.

### The Lens
**Lead with the human. Land on the insight.**
Empathy is the setup. Analysis is the payoff. Never reverse this order.
Open with one specific person, one visceral detail. Let it land. The insight follows from it — not the other way around.

### Beats — Not Paragraphs
Every post is built from beats. A beat does one job. Name the job before writing the line.

Common beat jobs:
- **The human moment** — one person, not a statistic
- **The reframe** — the wrong interpretation everyone else is running with, corrected
- **The pattern** — the bigger structure hiding behind the single event
- **The twist** — the thing nobody else is talking about
- **The lived experience bridge** — why Abhishek specifically can say this, without making it about him
- **The question** — not rhetorical bait, a real question the audience is already sitting with

Rule: one beat = one job. If a beat is doing two jobs, split it or cut one.

### Constraints Before Drafting
Decide these before writing a single word:
1. **Angle differentiation** — what is every other post on this topic saying? What's different here?
2. **Audience risk** — does this angle risk anything with target companies? If yes, what framing neutralises the risk without softening the truth?
3. **Structural lens** — which lens applies? (Lead with human / Pattern first / Lived experience anchor / Question-led)
4. **Format fit** — post, thread, carousel, or article? Format determines which beats survive.
5. **Only-I-can-write test** — is there a version of this only Abhishek can write given his specific background? If not, find it before starting.

### Hook Structure
The hook is not the opener. The hook is the **reframe**.
It makes every other post on this topic feel incomplete after reading it.

Formula: **[What everyone thinks] vs [What is actually true]** — stated as fact, not a question.

Weak: "Oracle fired 30,000 people. Here's what I think."
Correct: "They didn't fire people because AI replaced them. They fired them to pay for the AI."

The hook must work as a standalone sentence. If someone screenshots only the hook, it should still land.

### Flavour Check — Before Committing to Any Angle
- Is this **timely**? Will it feel stale in 72 hours?
- Is this **differentiated**? Has someone else already said this better?
- Is this **only-I-can-write**? Does Abhishek's background make this sharper than anyone else's version?
- Is this **safe enough**? Analytical framing, not indictment — especially when job hunting.
- Is this **empathetic without being a grief post**? Empathy + analysis. Never one or the other.

### Self-Contained Post Rule (carousels)
Post copy must carry the full argument independently. Anyone who skips the slides gets the complete thought.
Slides are visual amplifiers — not summaries. One slide = one job. Closing slide always carries the question.

---
 
## Notion DB Reference
 
**Database:** 💡 Raw Notes — Idea Inbox
**URL:** https://www.notion.so/d77d1bf075514c2bac0f6590481fd2b4
**Data Source ID:** `0d76012a-a4c9-466a-9a18-f034f5b840ec`
 
**Relevant fields:**
- `Status` → update to "In Progress" when draft begins, "Done" when published
- Page content → this is where the full draft lives
 
---
 
## Format Specs
 
### LinkedIn Post
- 150–300 words
- Single scrollable read — no headers, no bullets unless the format demands it
- Structure: Hook → Observation/argument → Specific example or proof → Provocation or question to close
- Line breaks are intentional — short paragraphs, breath between thoughts
- No hashtag farm — max 2–3 if any, only if genuinely relevant
- No "I'm excited to share", no "Thoughts?", no "Let me know in the comments"
 
### LinkedIn Thread
- 5–7 beats
- Beat 1 = the hook tweet — standalone, makes someone stop scrolling
- Beats 2–6 = one idea each, builds the argument
- Beat 7 = the landing — strong close, not a CTA
- Each beat under 280 characters ideally, max 400
- Number them: 1/ 2/ 3/ etc.
 
### Website Article
- 800–1500 words
- Has a real title (not a clickbait headline — a direct, specific title)
- Structure: Lede (2–3 sentences, the point upfront) → Context → Argument with specific examples → Counter-consideration → Close
- Has 2–3 subheadings max — not a listicle with 12 headers
- Written to rank for a specific phrase — Claude picks one naturally based on the topic
- Ends with one thing the reader should think or do differently
 
### AI Musings Caption
- 100–200 words
- Opens with the observation, never "I built a thing"
- Names what it is and what it does in one sentence
- Names the design thought behind it in one sentence
- Ends with a question or provocation — not "link in bio"
- Always includes: link to the experiment
 
---
 
## Workflow — Step by Step
 
### Step 1 — Identify the Idea
 
If the idea came from the Notion DB: fetch the DB row to get the full Idea title, Notes, and any Source URL already logged.
 
If the idea came fresh in chat: treat as a new idea, apply voice rules, proceed.
 
Confirm the format if not obvious. Ask once: "Post, thread, or article?"
 
### Step 2 — Build the Outline
 
Produce a tight outline based on the format:
 
**For Post / AI Musings caption:**
```
HOOK: [opening line — the punchline or provocation]
BODY: [2–3 bullet points — the argument or observation, one per paragraph]
CLOSE: [the question or landing thought]
```
 
**For Thread:**
```
1/ HOOK: [standalone opening beat]
2/ [beat 2 — setup or context]
3/ [beat 3]
4/ [beat 4]
5/ [beat 5]
6/ [beat 6 — the turn or key insight]
7/ CLOSE: [landing]
```
 
**For Article:**
```
TITLE: [direct, specific]
LEDE: [the point in 2–3 sentences]
SECTIONS:
  1. [section name] — [one line on what this argues]
  2. [section name] — [one line on what this argues]
  3. [section name] — [one line on what this argues]
CLOSE: [what the reader should think or do differently]
TARGET PHRASE: [the natural SEO phrase this would rank for]
```
 
Present the outline. Then ask:
> "Good to go, or any changes before I write the full draft?"
 
**Do not write the full draft until confirmed.**
 
### Step 3 — Write the Full Draft
 
Apply voice rules throughout. Write the complete piece.
 
Present it cleanly in chat — formatted as it would appear on LinkedIn or the website.
 
Then ask:
> "Happy with this? I'll save it to the Notion row and mark it In Progress. Any edits first?"
 
### Step 4 — Save to Notion (after confirmation only)
 
Two actions:
1. Update the DB row's page content with the full draft
2. Update Status from "Rated" → "In Progress"
 
Use `notion-update-page` with `command: update_content` for the draft body, and `command: update_properties` with `Status: "In Progress"` for the status.
 
Confirm with the Notion page URL.
 
### Step 5 — Mark Done (when published)
 
When Abhishek says "I posted it" or "it's live":
- Update Status → "Done"
- Optionally add the published URL to `Source URL` field
 
---
 
## Voice Rules — Applied to Every Word
 
**The register:** Smart friend making a point in a debate. Not a LinkedIn thought leader. Not a UX consultant presenting to stakeholders.
 
**Sentence rhythm:** Short declaratives do the heavy lifting. Long sentences explain. Short ones land.
 
**Word choices:**
- Use: built, broke, shipped, fixed, ran, tested, killed, ignored
- Avoid: leveraged, ideated, synergised, explored, unpacked, delved
 
**Structural rules:**
- Start with the punchline or the provocation — never with context
- Never start with: "I've been thinking...", "Something interesting...", "A lot of people...", "I'm excited to share..."
- Specific beats vague — name the thing, name the number, name the behaviour
- Cut 20% of every draft before presenting it
 
**Anti-patterns — never:**
- Humble brags dressed as lessons ("I failed, but I learned so much")
- Fake vulnerability
- Design jargon as substance (double diamond, empathy map, ideation session)
- LinkedIn engagement bait ("What do you think? Drop a comment below!")
- Ending with a question that's obviously rhetorical and adds nothing
 
---
 
## Format-Specific Voice Notes
 
**LinkedIn Post:** Line breaks are punctuation. One thought per paragraph. White space is intentional. Don't compress everything into a wall of text.
 
**Thread:** Beat 1 must work as a standalone post — someone should be able to RT it without context. Each beat = one idea, fully expressed.
 
**Article:** The lede is not an intro. It's the whole point, compressed. If someone reads only the lede, they should know what you argued.
 
**AI Musings Caption:** The experiment speaks. The caption frames it. Don't over-explain what the thing does — name it and get to the thought behind it.
 
---
 
## Edge Cases
 
**Idea not in Notion yet:** Write the draft in chat. After confirmation, offer to create the Notion row + add the draft in one step.
 
**Abhishek gives significant edits:** Rewrite the affected section, present the updated draft, ask for confirmation again before saving.
 
**Article that needs research:** Flag which specific facts/data points need verification before the draft is final. Don't invent statistics.
 
**Duplicate post risk:** If the topic sounds like something already in the DB with Status "Done", flag it: "This sounds close to [idea title] which is marked Done. New angle or same piece?"
 
---
 
## What This Skill Does NOT Do
 
- Does not post to LinkedIn directly (no LinkedIn API)
- Does not write before the outline is confirmed
- Does not save to Notion before the draft is confirmed
- Does not write SEO-stuffed articles — one natural target phrase, woven in, that's it
 
