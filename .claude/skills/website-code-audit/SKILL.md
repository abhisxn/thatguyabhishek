---
name: website-code-audit
description: >
  Conduct a comprehensive audit, testing, debugging, and refactoring session
  for a premium Next.js / React website against industry benchmarks and best
  practices. Use this skill whenever the user says "audit my site", "debug my
  website", "refactor my codebase", "check my performance", "test my site",
  "run a site audit", "what's wrong with my website", or shares a site URL
  and asks for a quality review. Also triggers when the user wants to improve
  Lighthouse scores, fix Core Web Vitals, fix accessibility issues, clean up
  TypeScript errors, improve bundle size, set up CI/CD pipelines, or get a
  prioritised list of what to fix on their site. Always runs all 10 phases
  unless the user scopes it explicitly — partial audits miss the dependencies
  between phases. This skill is the complete workflow, not a checklist generator.
compatibility:
  stack: Next.js 13+, React, TypeScript, Tailwind CSS (adapts to other stacks)
  hosting: Vercel, Netlify, AWS
---

# Website Audit Skill

Full-spectrum audit covering performance, accessibility, code quality, SEO,
visual QA, testing, debugging, and refactoring. Produces a prioritised backlog
with specific fixes — not recommendations, actual code changes.

**Before starting:** Confirm these variables with the user:
- Site URL
- Stack (framework, CSS, animation library)
- CMS / data layer
- Hosting platform
- Node version + package manager

If any are unknown, make a reasonable assumption and note it.

---

## Benchmark Targets (non-negotiable defaults)

| Metric | Target |
|---|---|
| Lighthouse Performance (mobile) | ≥ 90 |
| Lighthouse Performance (desktop) | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | ≥ 90 |
| LCP | ≤ 2.5s |
| INP | ≤ 200ms |
| CLS | ≤ 0.1 |
| Initial JS bundle (gzipped) | ≤ 200KB |
| TTFB (global p75) | ≤ 800ms |
| WCAG | 2.2 Level AA (AAA on critical paths) |

---

## Phase Sequence

Run phases in order. The sequence matters — fixing TTFB before images,
establishing baselines before fixes, writing tests before refactoring.

---

## Phase 1 — Environment + Baseline

**Goal:** Establish ground truth before touching anything.

```bash
npm audit --audit-level=moderate
npx npm-check-updates --format group
npx depcheck
npm run build                        # capture all warnings, not just errors
npm run lint
npx tsc --noEmit
NEXT_ANALYZE=true npm run build      # bundle analysis (Next.js)
```

Run 3 Lighthouse audits per key page (home, about, work/portfolio, 1 case study,
contact) — average the scores. One run lies. Mobile + desktop profiles both.

Output: Score table, current vs. target, every metric, every page.
Do not skip this. The audit is worthless without a before/after.

Zero tolerance: build errors, TypeScript errors in strict mode.

---

## Phase 2 — Performance

### LCP (target ≤ 2.5s)
- Identify LCP element per page via DevTools > Performance > LCP marker
- Check: `priority` prop set on Next.js Image for above-fold images?
- Check: LCP image preloaded with `<link rel="preload">`?
- Check: Asset served from CDN edge? (inspect response headers)
- If TTFB > 600ms — that's a server problem, not an image problem. Fix TTFB first.
- Fix: Add `fetchpriority="high"` on LCP `<img>` if not using framework Image component

### INP (target ≤ 200ms)
- Profile via Chrome DevTools > Performance Insights > Interactions
- Flag: interaction handlers doing > 50ms synchronous JS on main thread
- Flag: Long Tasks > 50ms blocking input
- Fix patterns: `setTimeout` deferral, `scheduler.yield()`, Web Workers

### CLS (target ≤ 0.1)
- Run DevTools Layout Instability highlighter
- Flag: Images without explicit `width`/`height` or `aspect-ratio`
- Flag: Dynamically injected content above existing content
- Flag: Web fonts causing FOUT/FOIT (check `font-display: swap` + `size-adjust`)
- Fix: `aspect-ratio` on all media. `font-display: optional` for non-critical fonts.

### Bundle
- Total initial JS payload target: ≤ 200KB gzip
- Flag chunks > 50KB loaded eagerly
- Lazy-load all below-fold components: `dynamic(() => import('./X'), { ssr: false })`
- Replace moment.js → date-fns. Replace lodash → individual imports.
- Move analytics/chat widgets to `next/script strategy="lazyOnload"`
- Framer Motion: use `LazyMotion` + `domAnimation` feature bundle (~20KB savings)

### Caching Headers (check every asset type)
```
Static assets (JS/CSS/fonts):  Cache-Control: public, max-age=31536000, immutable
HTML pages:                     Cache-Control: no-cache (or s-maxage=60 + SWR)
Images via CDN:                 Cache-Control: public, max-age=86400, stale-while-revalidate=604800
```

### Third-Party Scripts
- Audit all third-party scripts and measure blocking impact
- Self-host Google Fonts (eliminates DNS lookup + connection overhead)
- Use `rel="preconnect"` for all third-party origins

---

## Phase 3 — Accessibility (WCAG 2.2 AA)

Treat violations as bugs, not suggestions.

### Automated Scan
```bash
npx @axe-core/cli [SITE_URL]
npx pa11y [SITE_URL] --standard WCAG2AA
# + Lighthouse Accessibility on each key page
```

Capture every violation: element selector, WCAG criterion, impact level.

### Manual Keyboard Test (no mouse)
Tab through every page. Verify:
- Visible focus indicator on every interactive element (≥ 3:1 contrast, non-offset outline)
- Logical tab order matches visual reading order
- Modals trap focus when open, restore on close
- Skip nav link ("Skip to main content") present and functional
- No keyboard traps
- Dropdowns / accordions: Enter/Space/Arrow keys work

### Screen Reader Test (VoiceOver + Safari)
Navigate by headings (H key). Verify:
- One H1 per page, H2→H3 sequence unbroken
- Meaningful `alt` text on all images (empty `alt=""` if decorative)
- Buttons have accessible names — not just icons with no label
- Inputs have `<label>` (not just placeholder text)
- Error messages use `role="alert"` or `aria-live="polite"`
- SVG icons used as controls have `aria-label` or `<title>`

### Colour + Typography
- Body text: ≥ 4.5:1 contrast (target 7:1)
- Large text (≥ 18pt or 14pt bold): ≥ 3:1
- Check contrast in ALL states: default, hover, focus, disabled, error
- Never convey information by colour alone
- Body font ≥ 16px, line-height ≥ 1.5, max line length ≤ 75 chars
- Usable at 200% and 400% zoom

### Motion
All animations must respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## Phase 4 — Code Quality

### TypeScript Strictness
Enable and fix all errors with:
```json
{ "strict": true, "noImplicitAny": true, "strictNullChecks": true,
  "noUnusedLocals": true, "noUnusedParameters": true }
```
Any `as any` or `@ts-ignore` must have a comment explaining why.
No justification → fix the type, don't suppress the error.

### Component Architecture Anti-Patterns — Flag These
- **God components:** > 200 lines doing data fetch + logic + render → split
- **Prop drilling > 2 levels:** Extract context or colocate state
- **Inline styles mixed with Tailwind:** Pick one. Convert inline to Tailwind classes.
- **Hardcoded values:** Magic numbers, colours outside design tokens, literal strings
- **Duplicated logic:** Same transformation in > 1 file → extract to util
- **Missing error boundaries:** Any async component without one → add one
- **Missing Suspense boundaries:** Any async component without loading fallback

### Data Fetching (Next.js)
- Static content pages → `generateStaticParams` + static rendering
- Dynamic data → ISR with appropriate `revalidate`
- Client-side fetching → SWR or React Query. No raw `useEffect + fetch`.
- API routes → Zod validation on request body before processing
- Flag N+1 fetch patterns in data layer

### Error Handling
- Every `fetch` / `async` → try/catch or `.catch()`
- User-facing errors → human-readable message, never raw error objects
- Styled 404 + 500 pages must exist
- Missing env vars must throw at build time, not silently fail at runtime

### Security Headers (check all)
```
Content-Security-Policy     — restrictive
X-Frame-Options             — DENY or SAMEORIGIN
X-Content-Type-Options      — nosniff
Referrer-Policy             — strict-origin-when-cross-origin
All external links          — rel="noopener noreferrer"
No API keys in client bundle — check source maps
```

Run: `npx is-website-vulnerable [SITE_URL]`

---

## Phase 5 — SEO + Metadata

### Per-Page Requirements
- Unique `<title>` (50–60 chars)
- Unique `<meta name="description">` (150–160 chars)
- `<link rel="canonical">`
- OG: `og:title`, `og:description`, `og:image` (1200×630px), `og:type`, `og:url`
- Twitter: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

OG images: ≥ 1200×630px, < 1MB, text readable small. Generate dynamically
for case studies with `@vercel/og`.

### Structured Data
- Home: `Organization` or `Person` schema
- Articles/case studies: `Article` schema with author + dates
- Validate with Google Rich Results Test

### Crawlability
- `robots.txt` — not blocking crawlers
- `sitemap.xml` — present and up to date
- Run: `npx broken-link-checker [SITE_URL] -ro`

---

## Phase 6 — Visual QA

### Breakpoints to Test
375px, 768px, 1280px, 1440px, 1920px
Browsers: Chrome, Firefox, Safari (macOS + iOS), Android Chrome

Per breakpoint verify:
- No horizontal scroll
- Typography scales correctly (no overflow, no orphaned headlines)
- Spacing + layout correct (no overlapping elements)
- Touch targets ≥ 44×44px on mobile

### Design Token Consistency
- Flag one-off hex colours not in the design system
- Flag spacing values breaking the 4/8px base grid
- Flag mixed font families (should be exactly N fonts in config)
- Shadows, border-radius, transition timing → all tokenised

### Animation Quality
- Easing: spring physics or cubic-bezier — never linear (except loaders)
- Duration: micro-interactions 100–200ms, page transitions 300–500ms, reveals 400–700ms
- No animation that draws attention without serving navigation or feedback
- Scroll-triggered reveals: IntersectionObserver, not scroll event listeners
- Only animate `transform` and `opacity` — never `width`, `height`, `top`, `left`

---

## Phase 7 — Testing

### Unit Tests (Vitest preferred)
Coverage target ≥ 70% for: util functions, hooks, data transforms, API handlers.

### Component Tests (@testing-library/react)
For each component: smoke test, content with props, edge cases (empty/null/loading/error),
interactive events, accessibility via `jest-axe`.

### E2E Tests (Playwright)
Critical flows: Home → Work → Case Study, Contact form (success + error),
all nav links, interactive features. Run against preview deployments in CI.

### Visual Regression (Playwright + Percy or Chromatic)
Capture baselines for: home (mobile + desktop), nav, hero, card, footer.
All interactive states. Any PR changing visual output shows a diff for review.

---

## Phase 8 — Debugging Protocol

When a bug is encountered:

1. **Reproduce first.** Minimal test case. Document: input → expected → actual.
   Note: browser, viewport, network condition.

2. **Isolate the layer.** Data? Rendering? Styling? Timing?
   Use React DevTools to inspect state/props at point of failure.

3. **Fix the root cause, not the symptom.**
   If a workaround is unavoidable, document WHY in a comment.
   Write a test that would have caught this. Then check for regressions.

### Common Patterns — Check These First

| Pattern | Root Cause | Fix |
|---|---|---|
| Hydration error | Client/server render mismatch | Guard `window`/`document` access; avoid `Math.random()` |
| Stale closure | Wrong `useEffect` deps | Add missing deps or use `useRef` |
| Memory leak | Event listeners not cleaned up | Return cleanup fn from `useEffect` |
| Race condition | Multiple async requests | `AbortController` to cancel in-flight |
| CMS shape mismatch | Field renamed in CMS | Zod schema on API response, fail at parse not render |

---

## Phase 9 — Refactoring

### Priority Matrix
Score every refactor candidate:
- **Impact:** 1 (cosmetic) → 5 (performance / bug risk)
- **Effort:** 1 (1 hour) → 5 (1 week+)
- **Priority score:** Impact ÷ Effort × 10

Only schedule refactors with score ≥ 5. Everything else goes to backlog.

### Mandatory Refactors (ship before anything else)
- Components > 200 lines doing data fetch + render → split
- Duplicated fetch logic across pages → custom hook or server action
- Hardcoded colour/spacing → design token
- Missing error handling on fetch calls → add now
- `any` type in critical business logic → type properly

### Refactor Execution Rules
1. One refactor per PR — never bundle with feature work
2. Tests pass before and after
3. No "while I'm in here" scope creep
4. Re-run Lighthouse before/after significant refactors
5. Note in PR description why deleted code was removed

---

## Phase 10 — CI/CD + Monitoring

### CI Pipeline (runs on every PR before merge)
```yaml
- eslint --max-warnings 0
- tsc --noEmit
- vitest run --coverage
- npm run build
- playwright test (against preview URL)
- bundlesize or size-limit (fail if JS budget exceeded)
- lhci autorun (fail if score drops > 5 points)
- npm audit --audit-level=high
```

### Production Monitoring (set up if not already in place)
- **Error tracking:** Sentry
- **Analytics:** Vercel Analytics or Plausible (no cookie banner needed)
- **Uptime:** Better Uptime or UptimeRobot (alert within 1 minute)
- **Core Web Vitals:** Vercel Speed Insights or `web-vitals` library → analytics

---

## Output Format

Deliver in this order:

### 1. Executive Summary
- Overall health score (weighted average across phases)
- Top 3 critical issues requiring immediate action
- Top 3 quick wins (high impact, low effort)
- Benchmark scorecard: current vs. target, all key metrics

### 2. Findings (per phase)
Each finding must include:
```
Severity:    CRITICAL / HIGH / MEDIUM / LOW
Category:    Performance / Accessibility / Code Quality / SEO / Security
What:        What is broken and why it matters (specific, not vague)
Evidence:    Metric, code reference (file + line), or screenshot
Fix:         Exact change required — not "consider X", actual code or config
Effort:      Estimated hours
Impact:      Metric improvement expected
```

### 3. Prioritised Backlog
Ordered by priority score (Impact ÷ Effort × 10):
```
[Score] [Severity] [Category] — [Title] — [Est. Hours]
```

### 4. Before/After Metrics
Lighthouse scores, bundle size, CLS/LCP/INP — baseline vs. post-audit.

### 5. Remaining Technical Debt
Items deferred, with rationale for deferral.

---

## Operating Principles

1. **Say what's broken. Don't soften it.** "The LCP is 6.2 seconds on mobile" — not "there's room to improve load performance."

2. **Every finding gets a specific fix.** Not "consider lazy-loading images." But "add `loading='lazy'` to all `<img>` tags below the fold, starting with the portfolio grid at line 47 in `components/WorkGrid.tsx`."

3. **Measure twice.** Run Lighthouse 3 times per page. Variance between runs is signal, not noise.

4. **Fix in order of impact.** Fix TTFB before image sizes. Fix images before JS bundle. The sequence matters.

5. **Test in production conditions.** Throttle to Fast 3G mobile for Lighthouse runs. Your laptop on WiFi lies.

6. **Don't audit what you're not going to fix.** If something is out of scope, exclude it from the report entirely.

---

## Version & Maintenance

- Version: 1.0
- Benchmarks: Core Web Vitals 2024, WCAG 2.2, Lighthouse 11
- Stack assumptions: Next.js 13+, TypeScript, Tailwind, Vercel
- Update annually — browser standards and benchmark targets shift
- Maintained by: Abhishek Saxena — thatguyabhishek.com
