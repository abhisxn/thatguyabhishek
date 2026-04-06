# Figma Design System — Master Prompt

Paste this into Claude Code after confirming Figma MCP is connected.

---

```
You are an expert Figma design system architect. Your task is to build a
complete, production-ready Figma design system file and portfolio site
layout using the Figma MCP.

Follow every instruction precisely. Do not skip sections.
Ask for clarification if any input is ambiguous before proceeding.

===========================================================
PROJECT CONTEXT
===========================================================

Website:          thatguyabhishek.com
Owner/Brand:      Abhishek Saxena
Brand tagline:    "I don't do pretty pixels for vanity metrics. I design
                  systems that scale, interfaces that convert, and
                  experiences that stick."
Visual direction: Editorial-minimal. Dark mode primary. Heavy typographic
                  hierarchy. White space is intentional. Brand purple
                  (#4839ca) accent on near-black (#161b2a) backgrounds.
                  Coral (#ea8575) as a warm secondary accent. Feels like
                  linear.app, craft.do, stripe.com — premium and precise.
Target audience:  Hiring managers, design leaders, senior recruiters at
                  product companies and scale-ups globally.

Site reference:         https://thatguyabhishek.com
Visual references:      linear.app / stripe.com / craft.do
Existing Figma file:    https://www.figma.com/design/W3X90ArCwhgRQjTnBUvg93/Abhishek-Saxena
Figma frame reference:  https://www.figma.com/design/W3X90ArCwhgRQjTnBUvg93/Abhishek-Saxena?node-id=1717-1032 (dark theme homepage)

===========================================================
FIGMA FILE ARCHITECTURE
===========================================================

File name: "Abhishek Saxena — Design System + Portfolio"

Create pages in this exact order:

  Page 1:  🎨 Cover
  Page 2:  📐 Design Tokens
  Page 3:  ✍️  Typography
  Page 4:  🧩 Components — Atoms
  Page 5:  🧱 Components — Molecules
  Page 6:  🏗️  Components — Organisms
  Page 7:  📏 Layout & Grid
  Page 8:  🌐 Homepage
  Page 9:  💼 Work
  Page 10: 👤 About
  Page 11: 🏆 Awards
  Page 12: ✉️  Contact
  Page 13: 📁 Project Page Template
  Page 14: 🗂️  Archive / Scratch

===========================================================
PHASE 1 — DESIGN TOKENS  (Page 2)
===========================================================

Create ALL tokens as Figma Variables using a 3-tier architecture.

--- TIER 1: PRIMITIVE TOKENS ---
Raw values only. No semantic meaning.
These are the exact values from @theme in globals.css — do not change them.

Color — Accent:
  color/primitive/brand          → #4839ca
  color/primitive/coral          → #ea8575

Color — Named neutrals:
  color/primitive/canvas         → #161b2a   ← darkest page bg / dark mode solid bg
  color/primitive/navy           → #19223d
  color/primitive/card-dark      → #3a405d   ← dark section / callout surface
  color/primitive/dark-blue      → #0b2261
  color/primitive/dark-teal      → #163846
  color/primitive/ink            → #313138   ← near-black text / light mode fg
  color/primitive/parchment      → #f5f4f0   ← light page bg
  color/primitive/white          → #ffffff
  color/primitive/lavender       → #e5d7e8
  color/primitive/purple-card    → #4a2d7f

Color — Gradients (dark mode):
  color/primitive/gradient-dark-from  → #4a2d7f
  color/primitive/gradient-dark-to    → #0b1f3a

Color — Gradients (light mode):
  color/primitive/gradient-light-from → #fce7f3
  color/primitive/gradient-light-to   → #d1fae5

Color — Status:
  color/primitive/success        → #448361
  color/primitive/warning        → #cb912f
  color/primitive/error          → #c4554d
  color/primitive/info           → #2e7dae

Font size (px — use: size/primitive/[value]):
  10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 40, 48, 56, 64, 72, 84, 96

Spacing — 4pt / 8pt grid (use: space/primitive/[value]):
  0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128

Border radius — matches globals.css @theme (use: radius/primitive/[name]):
  btn  → 8px    (--radius-btn)
  card → 24px   (--radius-card)
  pill → 100px  (--radius-pill)

--- TIER 2: SEMANTIC TOKENS ---
Map primitives to meaning.
Create 2 Figma Variable Modes: "Light" and "Dark"
Token names mirror the actual CSS custom properties used in the codebase.

Text:
  --fg           → Light: ink (#313138)         | Dark: white (#ffffff)
  --fg-muted     → Light: rgba(49,49,56,0.70)   | Dark: rgba(255,255,255,0.70)
  --fg-disabled  → Light: rgba(49,49,56,0.30)   | Dark: rgba(255,255,255,0.30)

Background:
  --bg           → Light: parchment (#f5f4f0)   | Dark: transparent (gradient canvas)
  --bg-solid     → Light: parchment (#f5f4f0)   | Dark: canvas (#161b2a)
  --bg-inverse   → Light: canvas (#161b2a)       | Dark: parchment (#f5f4f0)

Surfaces (elevation scale — frosted glass over bg-solid):
  --surface-0    → Light: rgba(25,34,61,0.03)   | Dark: rgba(255,255,255,0.03)  ← hover / zebra
  --surface-1    → Light: rgba(25,34,61,0.05)   | Dark: rgba(255,255,255,0.06)  ← cards, inputs
  --surface-2    → Light: rgba(25,34,61,0.09)   | Dark: rgba(255,255,255,0.10)  ← dropdowns, tooltips
  --surface-inverse → Light: white              | Dark: white                   ← white card on dark

Borders:
  --border       → Light: rgba(25,34,61,0.10)   | Dark: rgba(255,255,255,0.10)
  --border-strong→ Light: rgba(25,34,61,0.22)   | Dark: rgba(255,255,255,0.22)

Brand:
  --brand        → #4839ca (both modes — same hue, no mode switch)
  --brand-muted  → Light: rgba(72,57,202,0.12)  | Dark: rgba(72,57,202,0.15)
  --brand-border → Light: rgba(72,57,202,0.35)  | Dark: rgba(72,57,202,0.40)

Section callout surfaces:
  --section-solid-bg     → Light: white          | Dark: canvas (#161b2a)
  --section-solid-fg     → Light: ink            | Dark: white
  --section-frosted-bg   → Light: rgba(58,64,93,0.05) | Dark: rgba(255,255,255,0.05)
  --section-frosted-fg   → Light: ink            | Dark: white
  --section-frosted-border → Light: rgba(58,64,93,0.16) | Dark: rgba(255,255,255,0.16)
  --section-blank-bg     → transparent (both)
  --section-col-bg       → Light: rgba(58,64,93,0.05) | Dark: rgba(255,255,255,0.05)
  --section-col-border   → Light: rgba(58,64,93,0.16) | Dark: rgba(255,255,255,0.16)

Callout solid (Notion callout blocks):
  --callout-solid-bg     → Light: white          | Dark: canvas (#161b2a)
  --callout-solid-fg     → Light: ink            | Dark: white

Status (same hues both modes):
  --color-success     → #448361
  --color-success-bg  → rgba(68,131,97,0.12)
  --color-warning     → #cb912f
  --color-warning-bg  → rgba(203,145,47,0.12)
  --color-error       → #c4554d
  --color-error-bg    → rgba(196,85,77,0.12)
  --color-info        → #2e7dae
  --color-info-bg     → rgba(46,125,174,0.12)

Spacing (mode-aware):
  space/layout/page-margin → Mobile: 16 | Tablet: 32 | Desktop: 80
  space/layout/section-gap → Mobile: 64 | Tablet: 96 | Desktop: 128
  space/layout/content-gap → Mobile: 24 | Tablet: 32 | Desktop: 48
  space/component/xs → 4 | sm → 8 | md → 16 | lg → 24 | xl → 32

--- TIER 3: COMPONENT TOKENS ---
Only define where a component deviates from semantic tokens.
Add as components are built. Starting set:
  color/component/button/bg/default
  color/component/button/bg/hover
  color/component/button/text/default
  color/component/nav/bg
  color/component/card/border

✅ Phase 1 checkpoint: Output variable count. Confirm 50+ variables created.
Wait for approval before proceeding.

===========================================================
PHASE 2 — TYPOGRAPHY SYSTEM  (Page 3)
===========================================================

Font family:  Glory (Google Font — next/font/google, primary — all headings, body, UI)
Secondary:    Manrope (Google Font — next/font/google, used in LinkedIn / social cards)
Mono font:    ui-monospace / system-mono (code blocks only)

NOTE: The codebase uses fluid clamp() for all headings. Figma does not natively support
clamp(). Create TWO versions per heading style: one at min size (mobile) and one at max
size (desktop). Label each clearly.

Create Figma Text Styles with slash notation:

Display:
  display/desktop → 84px / SemiBold (600) / 100% leading / -0.02em
  display/mobile  → 48px / SemiBold (600) / 100% leading / -0.02em

Headings:
  heading/h1/desktop → 72px / SemiBold / 100% / -0.01em
  heading/h1/mobile  → 36px / SemiBold / 100% / -0.01em
  heading/h2/desktop → 60px / SemiBold / 120% / 0em
  heading/h2/mobile  → 30px / SemiBold / 120% / 0em
  heading/h3/desktop → 48px / SemiBold / 120% / 0em
  heading/h3/mobile  → 24px / SemiBold / 120% / 0em
  heading/h4/desktop → 32px / SemiBold / 120% / 0em
  heading/h4/mobile  → 20px / SemiBold / 120% / 0em
  heading/h5/desktop → 28px / SemiBold / 120% / 0em
  heading/h5/mobile  → 18px / SemiBold / 120% / 0em
  heading/h6         → 16px / SemiBold / 120% / 0em  (fixed — no fluid)

Body (fixed):
  body/1 → 22px / Medium (500) / 120%   ← prominent paragraphs
  body/2 → 18px / Medium (500) / 120%   ← standard body
  body/3 → 14px / Medium (500) / 120%   ← small / secondary

Caption:
  caption → 12px / Bold (700) / 120%    ← labels, chips, fine print

UI / Button:
  ui/btn/lg → 20px / Medium / 120%
  ui/btn/md → 16px / Medium / 120%

Monospace:
  mono/md → 14px / ui-monospace / Regular
  mono/sm → 12px / ui-monospace / Regular

For every text style — create a specimen frame:
  style name label | sample text | token reference annotations

✅ Phase 2 checkpoint: Confirm all text styles created with specimens.

===========================================================
PHASE 3 — COMPONENTS  (Pages 4, 5, 6)
===========================================================

All components MUST:
- Use Auto Layout (no manual positioning)
- Reference design tokens (no hardcoded values)
- Have Variants for every interaction state
- Use slash notation naming — always
- Include Default, Hover, Focused, Active, Disabled states
- Include a usage note frame beside each component set

BEFORE BUILDING ANY MOLECULE OR ORGANISM:
Read the live codebase component file. Record these values before writing any use_figma code:
  - Component file path
  - Outer frame: width, height (or min-height), border-radius
  - Internal card/section dimensions if the component contains sub-cards
  - All gap and padding values used
  - Font sizes and weights per text node
  - Any secondary font families used (e.g. Manrope in social cards)

Before building a component that contains a logo, icon, or brand asset: find that asset
in the source design file (W3X90ArCwhgRQjTnBUvg93) or public/ folder first. Never
substitute a text node for a visual mark. If the asset can't be imported, create a
correctly-sized placeholder frame with the asset's exact dimensions and annotate it.

--- PAGE 4: ATOMS ---

1. atom/button
   Variants: Type [Primary|Secondary|Ghost|Destructive]
             × Size [SM|MD|LG]
             × State [Default|Hover|Focused|Active|Disabled|Loading]
             × Icon [None|Left|Right|Icon-only]
   Padding: SM 8px/16px | MD 12px/20px | LG 16px/24px
   Radius: radius/md (8px)

2. atom/input
   Variants: State [Empty|Filled|Focused|Error|Disabled]
             × Size [SM|MD|LG]
             × Type [Default|Prefix|Suffix|Icon]
   Height: SM 36px | MD 40px | LG 48px

3. atom/tag
   Variants: Type [Default|Filled|Outline] × Size [SM|MD] × State
   Padding: 4px/8px | Radius: radius/full

4. atom/icon
   Variants: Size [XS(12)|SM(16)|MD(20)|LG(24)|XL(32)]
   Library: Lucide React

5. atom/avatar
   Variants: Type [Image|Initials|Placeholder]
             × Size [XS(24)|SM(32)|MD(40)|LG(48)|XL(80)]
             × Shape [Circle|Square-rounded]

6. atom/divider
   Variants: Direction [Horizontal|Vertical] × Style [Solid|Dashed|Dotted] × Label [None|With-label]

7. atom/chip
   Variants: Type [Skill|Category|Year|Status] × State [Default|Active|Hover]
   Padding: 4px/12px | Radius: radius/full

8. atom/link
   Variants: Style [Inline|Standalone|Nav] × State [Default|Hover|Active|Visited]

9. atom/skeleton
   Variants: Shape [Text-line|Text-block|Card|Avatar|Image]

10. atom/toggle
    Variants: State [Off-Default|Off-Hover|On-Default|On-Hover|Disabled]

--- PAGE 5: MOLECULES ---

1. molecule/card/project
   Contains: Image thumbnail, Title, Tags, Year, Description
   Variants: Layout [Horizontal|Vertical] × State × Size [SM|MD|LG]

2. molecule/card/award
   Contains: Award name, Organisation, Year, Category tag
   Variants: State [Default|Hover]

3. molecule/nav/topbar
   Contains: Logo/name, Nav links, CTA button, Mode toggle
   Variants: Default | Scrolled | Menu-open | Light | Dark
   Layout: Horizontal, space-between, full width

4. molecule/nav/mobile
   Contains: Stacked nav links, close button
   Variants: Open | Closed

5. molecule/footer
   Contains: Logo, nav links, social links, copyright
   Variants: Simple | Full

6. molecule/social/row
   Contains: Icon + label per social platform
   Variants: Direction [Horizontal|Vertical] × Style [Icon-only|Icon-label]

7. molecule/project/meta
   Contains: Role, Duration, Team size, Tools/Stack
   Layout: 2-column auto layout grid

8. molecule/section/header
   Contains: Overline, Heading, Subheading (optional), CTA (optional)
   Variants: Alignment [Left|Center] × With-CTA [True|False]

9. molecule/quote
   Contains: Quote text, Author name, Author role, Avatar (optional)
   Variants: Minimal | Card | Pulled-quote

10. molecule/scroll/progress
    Contains: Progress bar, optional chapter labels
    Variants: Horizontal | Vertical

--- PAGE 6: ORGANISMS ---

Every organism = 3 frames:
  Desktop @ 1280px | Tablet @ 768px | Mobile @ 375px
All Auto Layout. Max-width container constraints applied.

1. organism/hero/homepage
   Contains: Overline, Display headline, Body copy, CTA pair, Scroll indicator

2. organism/work/grid-preview
   Contains: Section header, 3–4 project cards, View All CTA
   Layout: 2-col desktop → 1-col mobile

3. organism/about/snippet
   Contains: Photo or visual, Bio summary, Skills chips, CTA
   Layout: 2-col split — reverses on mobile

4. organism/awards/row
   Contains: Section header, award cards in grid or horizontal scroll

5. organism/contact/cta
   Contains: Headline, body copy, email CTA, social links

6. organism/project/hero
   Contains: Project title, Tags, Year, Role, Cover image/video placeholder

7. organism/project/body-section
   Variants: Text-only | Text-image | Text-image-reversed | Full-image

8. organism/project/results
   Contains: 3–4 stat blocks (metric + label), Impact narrative below

9. organism/project/related
   Contains: 2 project cards (next / related work)

✅ Phase 3 checkpoint: List all components created. Confirm variant coverage.

===========================================================
PHASE 4 — LAYOUT SYSTEM  (Page 7)
===========================================================

1. Grid System
   Mobile  375px: 4-col  | 16px gutter | 16px margin
   Tablet  768px: 8-col  | 24px gutter | 32px margin
   Desktop 1280px: 12-col | 24px gutter | 80px margin
   Wide   1440px: 12-col | 24px gutter | auto margin | max-content: 1280px

2. Spacing Scale — all tokens as horizontal bars with labels

3. Z-Index Layers
   base → card → sticky → modal → toast → tooltip

4. Motion Guidelines
   Micro-interactions:  ease-out  | 200ms
   Page transitions:    ease-in-out | 400ms
   Framer Motion easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)

✅ Phase 4 checkpoint: Confirm layout page complete before proceeding.

===========================================================
PHASE 5 — FULL PAGE DESIGNS  (Pages 8–12)
===========================================================

For every page, create 3 frames:
  [page-name]/desktop @ 1280px
  [page-name]/tablet  @ 768px
  [page-name]/mobile  @ 375px

All frames: vertical Auto Layout, 0 gap, full width.
Compose pages from organisms — do NOT design flat.

--- PAGE 8: HOMEPAGE ---

Section stack:
  1. organism/nav/topbar
  2. organism/hero/homepage
  3. organism/work/grid-preview   ← 3 featured projects
  4. organism/about/snippet
  5. organism/awards/row          ← 2–3 featured awards
  6. organism/contact/cta
  7. molecule/footer

Content:
  Hero headline:  "Hey there, I'm Abhishek Saxena, a product designer
                  enabling growth led design for 12+ years"
  Hero subhead:   "I don't do pretty pixels for vanity metrics. I design
                  systems that scale, interfaces that convert, and
                  experiences that stick."
  Featured work:  Microsoft Wiki Agent | Excel AI Chart Insights | Airtel Thanks 2.0

--- PAGE 9: WORK ---

Section stack:
  1. organism/nav/topbar
  2. Page hero — title "Work" + short subhead
  3. Filter bar — atom/chip filters by Type and Year
  4. Project grid — all projects using molecule/card/project
  5. molecule/footer

Projects:
  Excel Data Visualisation,            2024, Data Design / Excel / Microsoft
  Excel Chart Design Recommendations,  2024, AI / Excel / Microsoft
  Excel AI Chart Insights,             2024, AI / Excel / Microsoft
  Smarter Chart Defaults,              2024, AI / Excel / Microsoft
  Microsoft Wiki Agent,                2024, AI / Internal Tools / Microsoft
  Airtel Thanks 2.0,                   2022, Super App / Mobile / Telecom
  Watchlyst App,                       2020, Mobile App / Entertainment
  ThinkPlanty.com,                     2023, Web App / B2C / Growth
  GoodWorker Design System,            2023, Design System / B2B
  GrowthX Capstone,                    2023, Strategy / Growth
  GrowthX Bootcamp,                    2023, Strategy / Education

--- PAGE 10: ABOUT ---

Section stack:
  1. organism/nav/topbar
  2. About hero — photo/visual + display headline
  3. Bio — full text, 2-column layout
  4. Experience — timeline or list
  5. Skills/Tools — grouped by Design | Research | Dev | AI
  6. organism/contact/cta
  7. molecule/footer

Bio:
  "I'm a senior product designer with 12+ years of experience, building
  digital products that scale. Formerly at Microsoft, leading growth-led
  design for Excel AI features. Based in India — open to global
  opportunities. I design systems that hold up under pressure, not just
  pixels that look good in Figma."

Experience (newest first):
  Microsoft,          Senior Product Designer,    2023–present
  ThinkPlanty.com,    Lead Designer,              2020–2023
  GoodWorker,         Lead Designer,              2022–2023
  Airtel,             Senior Product Designer,    2019–2020
  Cheil / Samsung,    UX Designer,                2018–2019
  Watchlyst,          Founding Designer,          2016–2018
  Avizva,             UX Designer,                2015–2018
  Toaster / Google,   UX Designer,                2015–2016
  Dentsu / Webchuntey, Designer,                  2011–2015

Skills:
  Design:    Product Design, UX Design, Design Systems, Visual Design,
             Motion Design, Information Architecture, Prototyping
  Research:  Usability Testing, User Interviews, Journey Mapping,
             Jobs To Be Done, Competitive Analysis
  Dev:       HTML/CSS, Tailwind CSS, React basics, Framer, Figma Variables
  AI:        Prompt Engineering, AI-augmented design workflows,
             Microsoft Copilot integration, Generative UI patterns

--- PAGE 11: AWARDS ---

Section stack:
  1. organism/nav/topbar
  2. Page hero — title "Awards & Recognition" + subhead
  3. Awards grid — molecule/card/award
  4. molecule/footer

[Fetch from Notion Awards page: 7b1e321f25bf43e5875b73eb17ec3a9b]
Use real entries — do not fabricate award names.

--- PAGE 12: CONTACT ---

Section stack:
  1. organism/nav/topbar
  2. Contact hero — headline, copy, email as large CTA link
  3. Social links — molecule/social/row
  4. Availability callout block
  5. molecule/footer

Details:
  Email:     abhisxn@gmail.com
  LinkedIn:  linkedin.com/in/thatguyabhishek
  Behance:   behance.net/thatguyabhishek
  Dribbble:  dribbble.com/abhisheksaxena
  Phone:     +91 9999005281
  Note:      "Open to senior / director-level design roles globally.
              Available for freelance projects and consulting."

✅ Phase 5 checkpoint: Confirm all 5 pages exist at all 3 breakpoints.

===========================================================
PHASE 6 — PROJECT PAGE TEMPLATE  (Page 13)
===========================================================

Create 2 master frames:
  project-template/desktop @ 1280px
  project-template/mobile  @ 375px

Section order:
  1.  organism/nav/topbar                     [sticky]
  2.  molecule/scroll/progress                [horizontal, sticky]
  3.  organism/project/hero                   Title | Tags | Cover image placeholder
  4.  organism/project/meta                   Role | Duration | Team size | Tools
  5.  organism/project/body-section           [Text-only] — Problem statement
  6.  organism/project/body-section           [Text-image] — Research / Discovery
  7.  organism/project/body-section           [Full-image] — Key visual
  8.  organism/project/body-section           [Text-image-reversed] — Design decisions
  9.  organism/project/body-section           [Full-image] — Final design screens
  10. organism/project/results                [METRIC 1] | [METRIC 2] | [METRIC 3]
  11. molecule/quote                          Stakeholder quote or key learning
  12. organism/project/related                2 related project cards
  13. molecule/footer

For every section:
- Add a blue annotation label (e.g., "↑ Drop research images here")
- Add a usage note frame with DO / DON'T guidance

✅ Phase 6 checkpoint: Confirm template complete at both breakpoints.
```
