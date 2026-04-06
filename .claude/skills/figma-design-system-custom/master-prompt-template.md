You are an expert Figma design system architect. Your task is to build a complete,
production-ready Figma design system file and portfolio site layout using the
Figma MCP. Follow every instruction precisely. Do not skip sections. Ask for
clarification if any input is ambiguous before proceeding.

===========================================================
PROJECT CONTEXT
===========================================================

Website:          [WEBSITE URL]
Owner/Brand:      [FULL NAME]
Brand tagline:    [ONE LINE]
Visual direction: [e.g., Editorial-minimal. Dark mode primary. Heavy typographic
                  hierarchy. White space is intentional, not empty.]
Target audience:  [e.g., Hiring managers, design leaders, senior recruiters]

Site reference link:    [PASTE URL or TBD]
Visual reference URLs:  [PASTE LINKS — Behance, Awwwards, Pinterest, etc. or TBD]
Existing Figma file:    [PASTE FIGMA FILE LINK or "Create new file"]
Figma frame reference: [https://www.figma.com/design/W3X90ArCwhgRQjTnBUvg93/Abhishek-Saxena?node-id=1997-832&t=4IsA2TgaKLwVc99e-4][https://www.figma.com/design/W3X90ArCwhgRQjTnBUvg93/Abhishek-Saxena?node-id=1722-1042&t=4IsA2TgaKLwVc99e-4]

===========================================================
FIGMA FILE ARCHITECTURE
===========================================================

Create a new Figma file named: "[BRAND NAME] — Design System + Portfolio"

Pages in this exact order:

  Page 1:  🎨 Cover
  Page 2:  📐 Design Tokens
  Page 3:  ✍️ Typography
  Page 4:  🧩 Components — Atoms
  Page 5:  🧱 Components — Molecules
  Page 6:  🏗️ Components — Organisms
  Page 7:  📏 Layout & Grid
  Page 8:  🌐 Homepage
  Page 9:  💼 Work
  Page 10: 👤 About
  Page 11: 🏆 Awards
  Page 12: ✉️ Contact
  Page 13: 📁 Project Page Template
  Page 14: 🗂️ Archive / Scratch

===========================================================
PHASE 1 — DESIGN TOKENS (Page 2)
===========================================================

Create ALL tokens as Figma Variables using a 3-tier architecture:

--- TIER 1: PRIMITIVE TOKENS ---
Define raw values. No semantic meaning yet.

Color Primitives:
  color/primitive/black            → #0A0A0A
  color/primitive/white            → #FAFAFA
  color/primitive/grey-100 through grey-900
  color/primitive/accent-[NAME]    → [HEX — your brand accent]
  [ADD MORE AS NEEDED]

Font Size Primitives (px): 10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 56, 64, 72, 96
  Naming: size/primitive/[value]

Spacing Primitives (4pt grid): 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128
  Naming: space/primitive/[value]

Border Radius Primitives:
  radius/primitive/none → 0
  radius/primitive/sm   → 4
  radius/primitive/md   → 8
  radius/primitive/lg   → 12
  radius/primitive/xl   → 16
  radius/primitive/2xl  → 24
  radius/primitive/full → 9999

--- TIER 2: SEMANTIC TOKENS ---
Map primitives to meaning. Create 2 Figma Variable Modes: "Light" and "Dark"

Background:
  color/bg/primary     → Light: white | Dark: grey-900
  color/bg/secondary   → Light: grey-100 | Dark: grey-800
  color/bg/tertiary    → Light: grey-200 | Dark: grey-700
  color/bg/inverse     → Light: grey-900 | Dark: white
  color/bg/overlay     → Light: rgba(0,0,0,0.6) | Dark: rgba(0,0,0,0.8)

Text:
  color/text/primary   → Light: grey-900 | Dark: white
  color/text/secondary → Light: grey-600 | Dark: grey-400
  color/text/tertiary  → Light: grey-400 | Dark: grey-600
  color/text/inverse   → Light: white | Dark: grey-900
  color/text/accent    → Light: accent | Dark: accent
  color/text/disabled  → Light: grey-300 | Dark: grey-700

Border:
  color/border/default → Light: grey-200 | Dark: grey-700
  color/border/strong  → Light: grey-400 | Dark: grey-500
  color/border/accent  → accent in both modes

Interactive:
  color/interactive/default  → Light: grey-900 | Dark: white
  color/interactive/hover    → accent in both modes
  color/interactive/focus    → accent
  color/interactive/disabled → Light: grey-300 | Dark: grey-700

Surface:
  color/surface/card   → Light: white | Dark: grey-800
  color/surface/input  → Light: grey-100 | Dark: grey-800

Spacing Semantic:
  space/layout/page-margin  → Mobile: 16 | Tablet: 32 | Desktop: 80
  space/layout/section-gap  → Mobile: 64 | Tablet: 96 | Desktop: 128
  space/layout/content-gap  → Mobile: 24 | Tablet: 32 | Desktop: 48
  space/component/xs → 4 | sm → 8 | md → 16 | lg → 24 | xl → 32

--- TIER 3: COMPONENT TOKENS ---
Only define where component deviates from semantic:
  color/component/button/bg/default
  color/component/button/bg/hover
  color/component/nav/bg
  color/component/card/border
  [Add more as components are built]

===========================================================
PHASE 2 — TYPOGRAPHY SYSTEM (Page 3)
===========================================================

Font family:  [FONT NAME]
Display font: [DISPLAY FONT if different]

Create Figma Text Styles:

Display:
  display/2xl → [SIZE]px / [WEIGHT] / [LINE HEIGHT]% / [TRACKING]
  display/xl  → ...
  display/lg  → ...

Headings:
  heading/h1 through heading/h5

Body:
  body/xl, body/lg, body/md (base), body/sm, body/xs

UI:
  ui/label/lg, ui/label/md, ui/label/sm
  ui/caption/md, ui/caption/sm
  ui/overline/md → UPPERCASE / +0.1em tracking

Mono (if needed):
  mono/md, mono/sm

For each style — create a specimen frame with style name label,
sample text, and token annotations.

===========================================================
PHASE 3 — COMPONENTS (Pages 4, 5, 6)
===========================================================

All components MUST:
- Use Auto Layout (never manual positioning)
- Reference design tokens (not hardcoded values)
- Have Variants for all interaction states
- Use slash notation naming
- Include: Default, Hover, Focused, Active, Disabled states
- Include a usage note frame (when to use / when not to)

--- PAGE 4: ATOMS ---

1. atom/button
   Variants: Type [Primary|Secondary|Ghost|Destructive] × Size [SM|MD|LG]
             × State [Default|Hover|Focused|Active|Disabled|Loading]
             × Icon [None|Left|Right|Icon-only]

2. atom/input
   Variants: State [Empty|Filled|Focused|Error|Disabled]
             × Size [SM|MD|LG] × Type [Default|Prefix|Suffix|Icon]

3. atom/tag — Type, Size, State variants

4. atom/icon — Sizes XS/SM/MD/LG/XL
   Icon library: [SPECIFY — e.g., Lucide]

5. atom/avatar — Type [Image|Initials|Placeholder] × Size × Shape

6. atom/divider — Direction × Style × Label variants

7. atom/chip — Type [Skill|Category|Year|Status] × State

8. atom/link — Style [Inline|Standalone|Nav] × State

9. atom/skeleton — Shape [Text-line|Text-block|Card|Avatar|Image]

10. atom/toggle — State [Off|On] × Hover × Disabled

--- PAGE 5: MOLECULES ---

1. molecule/card/project
   Contains: Image, Title, Tags, Year, Description
   Variants: Layout [Horizontal|Vertical] × State × Size

2. molecule/card/award
   Contains: Award name, Org, Year, Category

3. molecule/nav/topbar
   Contains: Logo, Nav links, CTA, Mode toggle
   Variants: Default | Scrolled | Menu-open | Light | Dark

4. molecule/nav/mobile
   Contains: Stacked links, close button

5. molecule/footer — Simple + Full variants

6. molecule/social/row — Direction × Style variants

7. molecule/project/meta — Role, Duration, Team, Tools (2-col grid)

8. molecule/section/header
   Contains: Overline, Heading, Subheading, CTA
   Variants: Alignment [Left|Center] × With-CTA [True|False]

9. molecule/quote
   Contains: Quote text, Author, Role, Avatar (optional)
   Variants: Minimal | Card | Pulled-quote

10. molecule/scroll/progress — Horizontal + Vertical variants

--- PAGE 6: ORGANISMS ---

Each organism = 3 frames: Desktop 1280px, Tablet 768px, Mobile 375px
All auto-layout. Max-width container constraints applied.

1. organism/hero/homepage
   Contains: Overline, Display headline, Body, CTAs, Scroll indicator
   Full viewport height, content vertically centered

2. organism/work/grid-preview
   Contains: Section header, 3-4 project cards, View All CTA
   2-col desktop, 1-col mobile

3. organism/about/snippet
   Contains: Photo/visual, Bio, Skills, CTA
   2-col split — reverses on mobile

4. organism/awards/row
   Contains: Section header, Award cards (horizontal scroll or grid)

5. organism/contact/cta
   Contains: Headline, Copy, Email link, Social links
   Full-width centered

6. organism/project/hero
   Contains: Title, Tags, Year, Role, Cover image/video

7. organism/project/body-section
   Variants: Text-only | Text-image | Text-image-reversed | Full-image

8. organism/project/results
   Contains: Metrics grid (Stat + label), Impact narrative
   3-4 col metrics row

9. organism/project/related
   Contains: 2 project cards (next/related)

===========================================================
PHASE 4 — LAYOUT SYSTEM (Page 7)
===========================================================

1. Grid System
   Mobile 375px: 4-col, 16px gutter, 16px margin
   Tablet 768px: 8-col, 24px gutter, 32px margin
   Desktop 1280px: 12-col, 24px gutter, 80px margin
   Wide 1440px: 12-col, 24px gutter, auto margin (max content: 1280px)

2. Spacing Scale Visualization — all tokens as labeled bars

3. Z-Index Layers
   base → card → sticky → modal → toast → tooltip

4. Motion Guidelines
   Micro-interactions: ease-out, 200ms
   Page transitions: ease-in-out, 400ms
   Easing curves: visual documentation

===========================================================
PHASE 5 — FULL PAGE DESIGNS (Pages 8–12)
===========================================================

For EVERY page, create 3 frames:
  [PageName]/desktop @ 1280px
  [PageName]/tablet  @ 768px
  [PageName]/mobile  @ 375px

All frames: Auto Layout, vertical direction, 0 gap, full width.
Drop in organism components — do NOT design flat.

--- PAGE 8: HOMEPAGE ---
Sections:
  1. organism/nav/topbar
  2. organism/hero/homepage
  3. organism/work/grid-preview    ← 3 featured projects
  4. organism/about/snippet
  5. organism/awards/row           ← 2-3 featured awards
  6. organism/contact/cta
  7. molecule/footer

Content inputs:
  Hero headline:  [YOUR HEADLINE]
  Featured work:  [PROJECT 1], [PROJECT 2], [PROJECT 3]

--- PAGE 9: WORK ---
Sections:
  1. organism/nav/topbar
  2. Page hero (Title: Work, short subhead)
  3. Filter bar (atom/chip as filters — by Type / Year)
  4. Project grid — all projects (molecule/card/project)
  5. molecule/footer

Projects to show:
  [PROJECT NAME], [YEAR], [TAGS]
  [PROJECT NAME], [YEAR], [TAGS]
  [ADD ALL]

--- PAGE 10: ABOUT ---
Sections:
  1. organism/nav/topbar
  2. About hero (Photo/visual + display headline)
  3. Bio — full text, 2-col layout
  4. Experience timeline or list
  5. Skills/Tools (grouped: Design, Research, Dev, AI)
  6. Speaking/Writing (if applicable)
  7. organism/contact/cta
  8. molecule/footer

Content:
  Bio:        [PASTE BIO or TBD]
  Experience: [COMPANY, ROLE, YEARS, 1-line description — repeat]
  Skills:     [LIST]

--- PAGE 11: AWARDS ---
Sections:
  1. organism/nav/topbar
  2. Page hero (Title: Awards & Recognition)
  3. Awards grid (molecule/card/award)
  4. molecule/footer

Awards:
  [AWARD NAME], [ORG], [YEAR], [CATEGORY]
  [ADD ALL]

--- PAGE 12: CONTACT ---
Sections:
  1. organism/nav/topbar
  2. Contact hero (Headline, copy, email as large link)
  3. Social links (molecule/social/row)
  4. Availability callout
  5. molecule/footer

Contact details:
  Email:      [YOUR EMAIL]
  LinkedIn:   [URL]
  [OTHER SOCIAL: URL]
  Availability note: [e.g., "Open to Director-level roles"]

===========================================================
PHASE 6 — PROJECT PAGE TEMPLATE (Page 13)
===========================================================

Master frame: project-template/desktop @ 1280px
Also create: project-template/mobile @ 375px

Section order:
  1.  organism/nav/topbar (sticky)
  2.  molecule/scroll/progress (horizontal sticky progress bar)
  3.  organism/project/hero
      ↳ [Project title], [Tags], [Cover image placeholder]
  4.  organism/project/meta
      ↳ Role, Duration, Team size, Tools
  5.  organism/project/body-section (Text-only)
      ↳ Problem statement
  6.  organism/project/body-section (Text-image)
      ↳ Research / Discovery
  7.  organism/project/body-section (Full-image)
      ↳ Key visual / insight output
  8.  organism/project/body-section (Text-image-reversed)
      ↳ Design decisions / explorations
  9.  organism/project/body-section (Full-image)
      ↳ Final design — key screens
  10. organism/project/results
      ↳ [METRIC 1], [METRIC 2], [METRIC 3], Impact narrative
  11. molecule/quote
      ↳ Stakeholder quote or key learning
  12. organism/project/related
      ↳ 2 other project cards
  13. molecule/footer

For each section — add blue annotation label + usage note frame (DO / DON'T).

===========================================================
EXECUTION RULES — NEVER VIOLATE THESE
===========================================================

1. NAMING: Slash notation, always.
   ✅ atom/button/primary
   ❌ PrimaryButton, project card, Hero Section

2. AUTO LAYOUT: Every frame. No exceptions.
   Manual coordinates only inside atomic shapes.

3. TOKENS: Every color, spacing, radius, font = variable or text style.
   Zero hardcoded hex values. Zero hardcoded spacing.

4. VARIANTS: Every interactive component = Component Set with all states.
   Never duplicate as separate components.

5. LAYERS: Every layer named. No "Frame 234" or "Rectangle 12".

6. BREAKPOINTS: All page frames at all 3 breakpoints before moving on.

7. SEQUENCE: Tokens → Typography → Atoms → Molecules → Organisms
   → Layout → Pages → Project Template. Do not jump ahead.

8. CHECKPOINTS: After each Phase, output:
   "✅ Phase [X] complete. Created: [list]. Ready for Phase [X+1]?"
   Wait for confirmation before proceeding.

9. DOCUMENTATION: Every component gets a usage frame:
   when to use, when not to use, variant-specific notes.

10. COVER PAGE (Page 1) must include:
    - File name, Brand name + tagline
    - Version number, Date last updated
    - Page index with emoji labels
    - File status: WIP / Review / Final

===========================================================
## 🧪 TESTING RULES
===========================================================


### Phase Validation — run after each checkpoint

- Confirm variable count matches expected minimum (Phase 1 should produce 45+ variables)
- Every token must have values for BOTH Light and Dark modes — flag any mode gaps
- Zero hardcoded hex values anywhere in the file
- Zero hardcoded pixel values for spacing or radius
- Naming convention is 100% consistent slash notation — zero deviation

### Component Integrity

- Every atom has minimum 3 states: Default, Hover, Disabled
- Every component set has at least one Variant property defined
- No detached instances — all must reference a main component
- All text layers use a Text Style — no raw font overrides
- All color fills reference a Variable — no local styles, no hardcoded colors

### Auto Layout Audit

- No frame with manually x/y positioned children
- All page-level frames have vertical Auto Layout enabled
- All padding values reference spacing tokens — not hardcoded numbers
- Nested Auto Layout directions are intentional and consistent

### Breakpoint Coverage

- Each page has exactly 3 frames: `/desktop`, `/tablet`, `/mobile`
- Frame widths match spec: 1280px, 768px, 375px
- Responsive behavior verified: text wraps, columns collapse correctly
- No content overflow or clipping at any breakpoint

### Layer Hygiene

- Zero unnamed layers ("Frame 234", "Rectangle 12", "Group 7")
- No hidden layers in final components — move exploration layers to scratch page
- Layer depth does not exceed 8 levels without documented justification
- All group layers converted to named frames

### Documentation Coverage

- Every component page has a usage note frame (when to use / when not to)
- Every organism has breakpoint annotation labels
- Project template has blue annotation labels on all placeholder sections
- Cover page version number and date are current

### Pre-Handoff Checklist (mark file Final only after all pass)

- [ ]  Library published — components available workspace-wide
- [ ]  All pages labeled with correct emoji prefix
- [ ]  File status on cover updated: WIP → Review → Final
- [ ]  No placeholder text remaining in final page frames
- [ ]  Export settings defined on all image placeholder frames
- [ ]  All organism variants confirmed at 3 breakpoints
- [ ]  Component count documented on cover page