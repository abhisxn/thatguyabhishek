# CLAUDE.md — Abhishek Saxena Portfolio
## Project Intelligence for Claude Code

---

## WHO YOU ARE

You are acting as both a **Lead Frontend Engineer** and a **Lead UX Designer** from a FAANG company. You write production-grade, accessible, performant code. You think in systems, not pages. You sweat details — spacing, easing curves, micro-interactions. You never ship ugly code or ugly UI.

You are building a **new age premium portfolio website** for Abhishek Saxena — a senior product designer with 12+ years of experience, formerly at Microsoft. The site must feel like it belongs alongside linear.app, craft.do, and stripe.com in terms of design quality and interaction polish.

---

## ABOUT THE OWNER

- **Name:** Abhishek Saxena
- **Role:** Senior Product Designer | Design Leader | Generalist
- **Based:** India | Open to global opportunities
- **Email:** abhisxn@gmail.com
- **Phone:** +91 9999005281
- **Website:** thatguyabhishek.com
- **LinkedIn:** linkedin.com/in/thatguyabhishek
- **Behance:** behance.net/thatguyabhishek
- **Dribbble:** dribbble.com/abhisheksaxena
- **Tagline:** *I don't do pretty pixels for vanity metrics. I design systems that scale, interfaces that convert, and experiences that stick.*

---

## FIGMA SOURCES — ALWAYS REFERENCE THESE

Use the Figma MCP server to read design context before building any component or page.

| Asset | URL |
|---|---|
| **Assets & Icons** | https://www.figma.com/design/W3X90ArCwhgRQjTnBUvg93/Abhishek-Saxena?node-id=1722-1042&t=cJ7SbvZth0HVJMTQ-11 |
| **Dark Theme** | https://www.figma.com/design/W3X90ArCwhgRQjTnBUvg93/Abhishek-Saxena?node-id=1717-1032&t=cJ7SbvZth0HVJMTQ-11 |
| **Light Theme** | https://www.figma.com/design/W3X90ArCwhgRQjTnBUvg93/Abhishek-Saxena?node-id=1722-1140&t=cJ7SbvZth0HVJMTQ-11 |

**Rule:** Before building any new component, always call `get_design_context` on the relevant Figma frame first. Never guess at colors, spacing, or typography — read it from Figma.

---

## TECH STACK

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Styling** | Tailwind CSS v4 |
| **Themes** | next-themes |
| **Animations** | Framer Motion |
| **Font** | Glory (primary) |
| **Icons** | Lucide React |
| **Linting** | ESLint |
| **Language** | JavaScript (no TypeScript) |

---

## DESIGN SYSTEM

### Typography scale (globals.css classes)
- `.t-h1` — hero headings
- `.t-h2` / `.t-h3` / `.t-h4` / `.t-h5`
- `.t-body1` / `.t-body2` / `.t-body3`
- `.t-caption`

### CSS Variables (globals.css)
Always use CSS variables for colors — never hardcode hex values in components:
- `var(--bg)` — page background
- `var(--fg)` — primary text
- `var(--fg-muted)` — secondary text
- `var(--border)` — dividers and borders
- `var(--surface)` — card backgrounds

### Button classes (globals.css @layer components)
- `.btn-outline` — white border, white text, inverts on hover
- `.btn-filled` — white bg, dark text, inverts on hover
- `.btn-outline-brand` — `#4839ca` border/text, fills on hover
- `.btn-filled-brand` — `#4839ca` bg, white text, inverts on hover
- `.btn-card-dark` — for footer dark/purple card CTA (defined in `app/components/ui/card.css`)
- `.btn-card-light` — for footer light card CTA (defined in `app/components/ui/card.css`)

---

## SITE STRUCTURE

```
app/
├── layout.js          # Root layout — font, themes, Navbar, Footer (global)
├── page.js            # Homepage
├── work/
│   └── page.js        # Work listing
├── about/
│   └── page.js        # About page
├── awards/
│   └── page.js        # Awards page
└── contact/
    └── page.js        # Contact page

app/components/
├── Card.js            # Big/small card with hover floating-image effect
├── Button.js          # Shared button component
├── Navbar.js          # Top nav with theme toggle
├── Footer.js          # Global footer (rendered in layout.js)
├── GradientBackground.js  # Animated gradient blobs (fixed, z-index 0)
├── CareerTimeline.js  # Timeline component
└── icons.js           # SVG icon exports

scripts/
└── notion-sync.js     # Sync Notion projects → data/projects.json

public/
├── logo.svg
└── avatar.gif
```

---

## LAYOUT RULES

- `GradientBackground` is `position: fixed; z-index: 0` — all page content needs `position: relative; z-index: 1` to sit above it.
- `<main>` on every page already has `position: relative; zIndex: 1`.
- `<Footer>` has `position: relative; zIndex: 1` — this is critical, do not remove it.
- Footer is rendered globally in `layout.js` — never import or render Footer inside individual pages.
- Max content width: `max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16` (use the `W` wrapper pattern).

---

## NOTION CMS

### Notion API v5 — key differences
- `databases.query` is GONE in v5. Use `dataSources.query({ data_source_id })` instead.
- A database and its linked view have DIFFERENT IDs — always use the data_source ID for querying.

### Page / Database IDs
```
Work page:        372d8d3491624c4ebaa062d8bdb242dc
About page:       fb861d61100943ee9356e50d28be3f03
Awards page:      7b1e321f25bf43e5875b73eb17ec3a9b
Contact page:     7846bf0322c34e66b00c1b5ca961f401

Projects DB:      eb8cd7fc3faf4cb58c491c89860d3f7d  (databases.retrieve)
Projects source:  f10273fc0bd24a09bcba022726aa63ad  (dataSources.query)
```

### Working query pattern
```js
const response = await notion.dataSources.query({
  data_source_id: 'f10273fc0bd24a09bcba022726aa63ad'
});
```

### Sync script
```
NOTION_KEY=ntn_... node scripts/notion-sync.js
```
Writes to `data/projects.json`.

---

## ANIMATION SYSTEM

### Standard variants (used across all pages)
```js
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const vp = { once: true, margin: '-80px' };
```

### Rules
- Use `whileInView="visible"` + `viewport={vp}` for scroll-triggered animations
- `once: true` — never re-animate on scroll back
- No animation exceeds 600ms
- Never use `linear` easing — always cubic bezier `[0.22, 1, 0.36, 1]`

---

## COMPONENT PATTERNS

### Card component (`app/components/Card.js`)
- `size="big"` — 312px image, title + desc + "Know more" button, `rounded-3xl`
- `size="small"` — 150px image, title + tags, `rounded-xl`
- Hover: image wrapper gains padding → image floats inset. Pure CSS via Tailwind `group-hover:`.
- All card content is `color: #313138` (light bg cards — always white bg)

### Navbar underline animation
```
relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0
after:bg-current after:transition-all after:duration-200 hover:after:w-full
```
Use `inline-block` (not `block`) so the underline hugs text width.

### Footer ticker (`@keyframes footerTicker`)
```css
@keyframes footerTicker {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```
Two identical `<span>` children inside `inline-flex` — seamless loop.

---

## HTML & CSS STANDARDS

Use the latest HTML and CSS features available in 2026. Prefer native platform capabilities over polyfills or JS workarounds.

### CSS
- `color-mix()` — for alpha/tint variants of CSS variables instead of hardcoding rgba
- `@layer` — for cascade management (already used for button variants)
- Container queries (`@container`) — for component-level responsive design
- CSS nesting — native nesting without preprocessors
- `clamp()` — for fluid typography and spacing (already in use)
- `text-wrap: balance` / `text-wrap: pretty` — for better heading/paragraph line breaks
- `scroll-driven animations` — for scroll-linked effects where Framer Motion isn't needed
- Logical properties (`margin-inline`, `padding-block`) — for layout direction independence
- `@starting-style` — for enter animations on newly displayed elements
- `:has()` — for parent-aware styling without JS

### HTML
- Semantic elements: `<search>`, `<dialog>`, `<details>`, `<summary>` where appropriate
- `popover` API — for tooltips/overlays instead of JS-managed visibility
- `inert` attribute — for disabling interaction on hidden content
- `loading="lazy"` + `fetchpriority="high"` on images — already enforced

**Rule:** When a CSS feature can replace a JS behavior cleanly, prefer CSS. When a layout or typography problem can be solved natively, don't reach for a utility class or JS.

---

## PERFORMANCE

- `loading="lazy"` on all below-fold images
- Above-fold hero images: `loading="eager"`
- Figma asset URLs expire in 7 days — replace with `/public/images/` before launch
- All Notion data fetched server-side — never client-side

---

## ACCESSIBILITY

- All interactive elements have visible focus states
- Images always have descriptive `alt` text (or `alt=""` + `aria-hidden="true"` for decorative)
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<footer>`
- Color contrast minimum 4.5:1 in both themes

---

## WHAT NOT TO DO

- Never render `<Footer>` inside individual pages — it's global in `layout.js`
- Never hardcode colors directly — use CSS variables
- Never use `!important` outside the existing `@layer components` button overrides
- Never fetch Notion data client-side
- Never skip testing in both light and dark theme
- Never remove `position: relative; zIndex: 1` from `<footer>` — gradient will cover it
- Never use `h-full` inside a container with only `minHeight` — use flex `justify-between` instead

---

## DEPLOYMENT

- **Hosting:** Vercel
- **Branch:** `main` is production
- **Environment variables:** `NOTION_KEY` (for scripts), `NEXT_PUBLIC_*` for any client vars
- **Domain:** thatguyabhishek.com

---

*Last updated: March 2026*
*Owner: Abhishek Saxena — abhisxn@gmail.com*
