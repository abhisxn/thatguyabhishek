'use client';

import { useState } from 'react';
import {
  FlipCard,
  MagneticCard,
  SpotlightCard,
  CurtainCard,
  ElasticGrid,
  GlassGlareCard,
  SweepCard,
  OutlineCard,
} from '@/components/ui/interaction-cards';

/* ── Data ──────────────────────────────────────────────────────────────── */
const ITEMS = [
  {
    num: '01',
    heading: 'Maker by instinct',
    body: "I've built apps, launched brands, sold plants online, and once nearly started a 3D print farm. The businesses that worked taught me about users. The ones that didn't taught me about everything else.",
  },
  {
    num: '02',
    heading: "I learn when I'm stuck",
    body: "The things I know best, I learned because a problem forced me to. Not from a planned reading list — from a question I couldn't answer until I went looking. A video essay at 1am. A thread that led to three more.",
  },
  {
    num: '03',
    heading: 'Opinionated about craft',
    body: "I have strong opinions about the design community's love of process theater — the double diamonds, the 'how might we' workshops. Most aren't wrong. They're just taught wrong. As rituals instead of tools.",
  },
  {
    num: '04',
    heading: 'Started before the rules',
    body: "Digital design in the early 2000s meant Flash, no grids, no systems, no precedent. The only brief was 'make it work.' That era is gone — but the mindset isn't.",
  },
];

/* ── Shared card shell ─────────────────────────────────────────────────── */
function DemoSection({ label, sublabel, children }) {
  return (
    <section style={{ marginBottom: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
          {label}
        </p>
        <p style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.6, maxWidth: 520 }}>
          {sublabel}
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {children}
      </div>
    </section>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */
export default function BeyondDemo() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--bg-solid)',
        padding: '80px 48px',
        maxWidth: 1100,
        margin: '0 auto',
      }}
    >
      <div style={{ marginBottom: 64 }}>
        <p style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.14em', color: 'var(--fg-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
          Interaction Demo · Beyond the Work
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--fg)', margin: 0, marginBottom: 12 }}>
          8 Card Hover Options
        </h1>
        <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7, maxWidth: 580 }}>
          All built with Framer Motion. Pick your favourite — or mix elements.
          Each option uses a distinct interaction paradigm.
        </p>
      </div>

      {/* A — Flip */}
      <DemoSection
        label="Option A — 3D Flip Card"
        sublabel="Front face shows heading. Mouse-enter triggers a Y-axis flip revealing the body on the back face. Both faces are fully designed. Classic premium pattern — good for content-heavy cards."
      >
        {ITEMS.map((item, i) => (
          <FlipCard
            key={item.num}
            num={item.num}
            title={item.heading}
            body={item.body}
            index={i}
          />
        ))}
      </DemoSection>

      {/* B — Magnetic Tilt */}
      <DemoSection
        label="Option B — Magnetic 3D Tilt + Slide-up Body"
        sublabel="Mouse position inside the card drives a real-time 3D tilt via useMotionValue + useTransform + useSpring. Body text slides up from the bottom with blur. Premium, tactile, alive."
      >
        {ITEMS.map((item) => <MagneticCard key={item.num} item={item} />)}
      </DemoSection>

      {/* C — Spotlight */}
      <DemoSection
        label="Option C — Cursor Spotlight Reveal"
        sublabel="A radial gradient spotlight follows the mouse inside each card. Body text fades and slides in on hover. Subtle, editorial, works especially well in dark mode."
      >
        {ITEMS.map((item) => <SpotlightCard key={item.num} item={item} />)}
      </DemoSection>

      {/* D — Curtain */}
      <DemoSection
        label="Option D — Curtain Wipe (clip-path sweep)"
        sublabel="An accent-coloured plane sweeps over the card from top to bottom using clip-path animation. Reveals a fully designed back face. Cinematic, high-contrast, very editorial."
      >
        {ITEMS.map((item) => <CurtainCard key={item.num} item={item} />)}
      </DemoSection>

      {/* E — Elastic */}
      <section style={{ marginBottom: 80 }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
            Option E — Elastic Expand (layout animation)
          </p>
          <p style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.6, maxWidth: 520 }}>
            Hovered card scale-expands and grows to reveal the body. Sibling cards fade and shrink slightly, creating a depth/focus effect. Uses Framer&apos;s layout animation — no fixed heights needed.
          </p>
        </div>
        <ElasticGrid />
      </section>

      {/* F — Glass Glare */}
      <DemoSection
        label="Option F — Glass Glare (perimeter-locked blur)"
        sublabel="Blur blob locked to the card perimeter via 1D arc-length coordinate. Parallax: blob travels at 40% of cursor's perimeter delta, stops instantly. Radial offset keeps center outside the card — overflow:hidden shows only the soft falloff."
      >
        {ITEMS.map((item) => <GlassGlareCard key={item.num} item={item} />)}
      </DemoSection>

      {/* G — Border Sweep */}
      <DemoSection
        label="Option G — Border Sweep"
        sublabel="A conic-gradient highlight sweeps clockwise around the card border once on hover entry. No fill, no blob — just the ring. Clean, fast, satisfying."
      >
        {ITEMS.map((item) => <SweepCard key={item.num} item={item} />)}
      </DemoSection>

      {/* H — Adaptive Outline */}
      <DemoSection
        label="Option H — Adaptive Outline"
        sublabel="Border brightens in dark mode, darkens in light mode on hover. Pure CSS transition — no JavaScript animation. Minimal, theme-aware, works as a base layer under any other effect."
      >
        {ITEMS.map((item) => <OutlineCard key={item.num} item={item} />)}
      </DemoSection>

    </main>
  );
}
