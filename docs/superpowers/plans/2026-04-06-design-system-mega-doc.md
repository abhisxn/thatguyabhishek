# What Actually Happens When You Build a Figma Design System With AI

*A complete, unedited account — the failures, the back-and-forth, the audit, the drift, and what the optimized workflow looks like now.*

---

> **Document status:** Full draft — ready for Notion
> **Format:** Website article (~2200 words)
> **Target phrase:** building a design system with AI
> **Screenshots needed:**
> - ✅ `footer-correct.png` — molecule/footer/full (node 217:45) — Abhishek's final version
> - ✅ `navbar-correct.png` — molecule/nav/topbar (node 232:78) — Abhishek's final version
> - ✅ `footer-archive.png` — archive footer (node 223:358) — older dark-mode draft
> - ❌ `footer-claude.png` — Claude's wrong version (node 51:15) — **deleted from file**
> - ❌ `navbar-claude.png` — Claude's wrong version (node 200:4) — **deleted from file**
> *The wrong versions no longer exist in the Figma file. The verbatim session text is the evidence.*

---

## FULL DRAFT

---

The spec was detailed. The skill existed. The Figma MCP was connected. Claude still built a footer with a purple blob where my avatar should be.

That's where this account starts — not with the tool failing, but with the tool doing something, producing output, and that output being wrong in a specific, instructive way. Wrong enough that I had to build the correct version myself and put both side by side and ask: what exactly happened here?

This is that account.

---

### The Setup

I was building the design system for my portfolio site — a proper one, not a colors page in Figma. Six phases: design tokens, typography, atoms, molecules, organisms, full page layouts. Two Figma files: the source design (`W3X90ArCwhgRQjTnBUvg93`) as visual reference, and the target system file (`7aiv0CSLE2XLZGQjrqQ9ic`) as the output being built.

The rule was explicit: **tokens → variables → components.** Always in that order. Create the variable collection first. Bind fills, strokes, and text to those variables. Build the component frame after. No hardcoded values anywhere.

I had a skill for this. The Figma MCP was configured. I had written a 400-line spec document covering every phase, every component, every testing checkpoint. The tooling was as good as it gets.

---

### The Footer: First Real Comparison

I asked Claude to build the footer component — match the live website exactly, use variables, no guessing.

Here's the exact message:

> *"I asked you to create footer component using /figma-design-system /figma-generate-library*
> *I wanted it to exactly look like live website, active on localserver.*
> *I want to understand what went wrong? why is your version bad?*
> *you made this — [node 51:15]*
> *I made this — [node 169:59]*
> *Note: I did not use tokens and variables, but I expect you to do this. Always tokens→variables→components"*

— Abhishek, session log `f8e21d7c`

> **[SCREENSHOT: footer-claude.png — Claude's version, node 51:15 — DELETED FROM FILE]**
> **[SCREENSHOT: footer-correct.png — Abhishek's version, node 169:59 / current: 217:45]**

Here's what Claude built vs what I built:

| | Claude's version | My version |
|---|---|---|
| Headline size | `32px` | `56px` |
| Purple CTA card | `min-h-[280px]`, flex grow | `h-[339px] w-[563px]` fixed |
| LinkedIn card | `w-[380px]`, `rounded-[8px]` | `flex-1`, `rounded-[24px]` |
| Link columns | `w-[100px]` | `w-[322px]` with `leading-[72px]` row height |
| CTA card personality | Purple decorative blob | Actual illustrated avatar |
| Font on LinkedIn card | Glory (brand font) | Manrope (LinkedIn's font) |

My version didn't use tokens or variables — I built it fast to show the gap. Claude was supposed to do both: match the visual AND use variables. It did neither correctly.

When I asked it to diagnose itself, it named every failure with complete accuracy:

> *"My component looked like a miniature because I guessed dimensions instead of reading the live website first.*
> *I put a purple blob (`mix-blend-hard-light`) inside the CTA card as a decorative element. You used the actual illustrated Abhishek avatar sitting at the bottom-right of the card. That's the entire personality of that card — I replaced it with a blob.*
> *What I did instead [of variable binding]: jumped to building the component frame, referenced some `var(--color/...)` strings inline in the Figma node properties, and called it done. I never created the variable collection in Figma first, bound those variables to the component's fills, strokes, text colors, or verified the variables resolved correctly in both light and dark modes."*

— Claude, same session

It could explain every mistake backward. It couldn't apply the rules forward without being pushed.

I then asked: *"What instructions should I add to the skill so you don't repeat this?"*

It gave me four rules. Detailed. Correct. Rules that should have been obvious from the spec that already existed.

---

### The Navbar: Same Pattern, Different Component

After updating the skill with those four rules, I asked for a rebuild — footer and navbar. The footer improved. The navbar had the same fundamental problem in a different form.

> *"same problem I found in navbar you just created —*
> *you created this — [node 200:4]*
> *I created this — [node 194:152]"*

— Abhishek, same session

> **[SCREENSHOT: navbar-claude.png — Claude's version, node 200:4 — DELETED FROM FILE]**
> **[SCREENSHOT: navbar-correct.png — Abhishek's version / current: 232:78]**

| | Claude's version | My version |
|---|---|---|
| Logo | Text node: "thatguyabhishek" | Imported logo vectors from source file |
| Nav link size | 18px Medium | 20px Regular |
| Nav link gap | 28px | 40px |
| Resume button border | 1px | 2px |
| Resume button padding | 16px/8px symmetric | 20px left / 14px right (asymmetric, for arrow) |
| Arrow icon on button | Missing | 16×16 vector |

Claude saw the arrow icon in the live code (`icon={<ArrowIcon size={14} />}`) and skipped it. The logo it literally replaced with a text node because it couldn't embed the SVG directly.

Its self-diagnosis this time:

> *"The live code tells me what to build. The source Figma tells me how it should look at design scale. I used only one of the two."*

That sentence is the whole problem. Stated exactly. After the fact.

The live code and the source Figma are two different sources of truth, both necessary. The code tells you what props exist, what dimensions are set, what variants are needed. The source design tells you how it should look at Figma's scale — where visual weight requires adjustments, where proportions differ from the rendered web output. Using only one of them produces something that is technically derived from the code but visually off.

---

### The Gradient: The Moment I Said "Stop"

Mid-way through a rebuild, Claude needed to apply a pink gradient effect to the CTA card in the footer.

It tried three approaches:
1. Applied the gradient to the card's fill layer — didn't render visibly
2. Created a gradient blob element — too subtle
3. Applied gradient as a fill layer — still incorrect

The correct answer: the gradient comes from a child vector shape, not the card fill at all.

It found this only after I sent one word:

> *"stop"*

— Abhishek, session log `f8e21d7c`

Claude's response:

> *"Stopped. Here's where things stand:*
> *Completed: molecule/nav/topbar — rebuilt with Default + Scrolled variants, matching the reference exactly*
> *In progress (abandoned): Purple card gradient blob — the pink gradient isn't rendering visibly. The fill-layer approach isn't producing the vivid pink-to-purple effect from the reference. This might need manual tweaking in Figma directly.*
> *What would you like to do next?"*

Three failed attempts at the same wrong layer is not a tool problem. If you've properly read the component structure before starting, you don't try the fill approach twice. You look at the children. You find the vector shape. You apply to that.

The pattern: attempt → fail → try same thing slightly differently → fail → try slightly differently again → stop. The reasoning that should have happened before the first attempt happened instead after the third failure.

---

### Variables Named, Not Bound

The tokens → variables → components rule produced one consistent failure mode: Claude would write the right variable token names in comments, in labels, in inline property strings. None of them were actually bound to anything.

A fill showing `color/surface/card` as a text annotation is not a bound variable. The frame still has a hardcoded `#FFFFFF` fill. The variable name is decoration.

The contrast with the Button atom makes this obvious. Button had 36 variants. Claude collapsed them to 9 using variable modes — correctly, without being asked. That worked.

Then came the Input atom. 15 variants. The same variable-mode solution was right there. I had to ask:

> *"can we not solve similarly like buttons - for this input atom?*
> *[node 20:32]"*

— Abhishek, session log `9dc20aeb`

It knew the pattern. Applied it to buttons unprompted. Didn't apply it to inputs without being told. The same reasoning that produced a correct button produced a bloated input — not because the capability was missing, but because the pattern transfer wasn't automatic.

---

### Despite Having Skills

The `figma-design-system-custom` skill existed. It contained the rules. The Figma MCP was configured. None of that made the workflow reliable.

Skills don't execute themselves. They constrain a reasoning process that still happens step by step, and that process can still skip steps, use the wrong source, or apply a known pattern only where explicitly prompted. The skill was correct. The execution was inconsistent.

There was also a harder failure: early in setup, trying to add the skill via command line.

`claude mcp add skill figma-design-system`

Wrong. That creates a broken stdio MCP entry. Skills live in `.claude/skills/[folder-name]/SKILL.md`. They're auto-discovered. No registration. No MCP. No `mcp add`. Running that command creates an entry that errors on every session startup — silently, persistently, until you find and delete it.

On top of that: the Figma MCP needed an explicit auth flow run before any workflow using it would work. Skills configured. MCP configured. Auth not run. The whole workflow was dead until that was sorted.

---

### The Drift

The base-8 grid rule was in `CLAUDE.md` from day one. Two months in: a full audit found **80+ violations across 14 files**.

`293px`. `63.5px`. `py-2.5`. `gap-1.5`. `22px` column padding on a list card. Not one big mistake — 80 small ones, each made under the pressure of building fast and moving on.

`CLAUDE.md` said the font was "Glorie." The font loaded in `layout.js` is "Glory." Small difference. Not a small problem. Documentation that diverges from code by a single letter is documentation you can't trust at all.

Stale hex values in the docs that had already been replaced with tokens in the actual codebase. `#4839ca` written in CLAUDE.md after the code had already moved to `var(--brand)`. The docs were describing a system that no longer existed.

Documentation is a lag indicator. The moment you stop treating the code as the single source of truth, the docs start describing the past. The rule: `globals.css` is authoritative. CLAUDE.md is notes. Verify against the CSS file before using any token value from the docs.

---

### What the Optimized Workflow Actually Looks Like

Every failure above maps to a specific rule. These are the rules now:

**1. Auth first.** MCP auth and Figma auth before any design system session starts. Not after. Not "I'll sort it when it breaks." Before.

**2. Two sources, not one.** Live code = what to build. Source Figma = how it should look at design scale. Both. Always. Either alone produces wrong output. The code gives you props and dimensions. The design gives you visual weight and proportion adjustments. You need both to produce a component that is technically correct and visually accurate.

**3. Variable collection before component frame.** Create the collection. Define variables. Bind fills, strokes, and text colors. Verify they resolve correctly in both light and dark modes. Only then build the component frame.

**4. Real assets, not placeholders.** Logo SVG, not a text node. Actual illustrated avatar, not a decorative blob. Correct font per component context — Glory for brand components, Manrope for components mimicking third-party UIs. A wrong placeholder at the right size is better than a wrong asset — but neither is acceptable when the real thing exists.

**5. Mid-build screenshot validation.** After each major component. Not at the end, when errors have compounded across ten frames. Get a screenshot, compare against the reference, fix before moving on.

**6. State pattern transfers explicitly.** If Button used variable mode to collapse variants, say: "apply the same approach to Input." Don't assume it transfers. It doesn't.

**7. `globals.css` is authoritative.** Any token value in CLAUDE.md or any doc — verify it against the CSS file before using. The docs can lie. The CSS can't.

**8. Skills are not MCP servers.** Drop a folder with a SKILL.md in `.claude/skills/`. That's it. Never run `mcp add` for a skill.

**9. Same-commit sync.** Any design system change → update `globals.css` AND `CLAUDE.md` in the same commit. Not separately. Not "I'll update the docs later." Same commit, every time.

---

### The Close

The system was right. The spec was right. The skill was right.

The problem was each step executed without fully thinking through the step before it. Rules known but not applied without prompting. Two sources available but only one used. Variables named but not bound. Patterns demonstrated but not transferred.

That's not a capability problem. It's a discipline problem. And discipline that lives only in a skill document — one that can be read and still not applied — isn't actually discipline. It has to be encoded into the process itself. Checkpoints. Explicit transfers. Validation gates. The things that make "I know the rule" and "I followed the rule" the same statement.

That's the work that's still ongoing.

---

*Abhishek Saxena — April 2026*
*thatguyabhishek.com*
