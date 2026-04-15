'use client';

import { useState } from 'react';
import { m, useSpring } from 'framer-motion';
import { SECTION_STYLES } from '@/lib/section-styles';
import Card from '@/app/components/ui/Card';
import Button, { BUTTON_VARIANTS } from '@/app/components/ui/Button';
import Badge, { BADGE_VARIANTS } from '@/app/components/ui/Badge';
import Tag, { TAG_PALETTE } from '@/app/components/ui/Tag';
import { Input, Textarea } from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import { CARD_SIZES, CARD_STYLES } from '@/app/components/ui/card-utils';
import { LinkCalloutCardUI } from '@/app/components/ui/LinkCalloutCard';
import StyleNav from '@/app/components/ui/StyleNav';
import ArticleReactions from '@/app/components/sections/ArticleReactions';
import { ArrowIcon } from '@/app/components/ui/icons';

/* ── Section wrapper ─────────────────────────────────────────── */
function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="py-12 border-t border-theme scroll-mt-24">
      <div className="mb-8">
        <p className="t-overline text-fg-muted mb-1">{subtitle}</p>
        <h2 className="t-h4 font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Label({ children }) {
  return <p className="t-caption text-fg-muted mb-2 font-mono">{children}</p>;
}

function Code({ children }) {
  return (
    <code
      className="px-1.5 py-0.5 rounded text-sm font-mono"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {children}
    </code>
  );
}

/* ── Colour swatch ───────────────────────────────────────────── */
function Swatch({ label, value, border }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-14 rounded-xl" style={{ background: value, border: border || '1px solid var(--border)' }} />
      <p className="t-caption font-mono" style={{ color: 'var(--fg)' }}>{label}</p>
      <p className="t-caption font-mono opacity-50" style={{ color: 'var(--fg-muted)' }}>{value}</p>
    </div>
  );
}

const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%234839ca"/><stop offset="1" stop-color="%230b1f3a"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><text x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" fill="rgba(255,255,255,0.3)" font-size="18" font-family="sans-serif">cover image</text></svg>';

/* ── Card hover interaction demos ────────────────────────────── */
const STROKE_RING_STYLE = {
  position: 'absolute', inset: 0, borderRadius: 'inherit',
  border: '1px solid color-mix(in srgb, var(--fg) 50%, transparent)',
  pointerEvents: 'none',
};

function StrokeDemoCard({ label, children }) {
  const strokeOpacity = useSpring(0.2, { stiffness: 160, damping: 24 });
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div
        style={{ position: 'relative', borderRadius: 16, padding: '20px 22px', background: 'var(--surface)', cursor: 'default' }}
        onMouseEnter={() => strokeOpacity.set(0.7)}
        onMouseLeave={() => strokeOpacity.set(0.2)}
      >
        <m.div style={{ ...STROKE_RING_STYLE, opacity: strokeOpacity }} />
        {children}
      </div>
    </div>
  );
}

function WritingDemoCard() {
  const [isHov, setIsHov] = useState(false);
  const strokeOpacity = useSpring(0.2, { stiffness: 160, damping: 24 });
  return (
    <div className="flex flex-col gap-2">
      <Label>WritingCard — lift + emoji scale + spring stroke</Label>
      <a
        href="#"
        onClick={e => e.preventDefault()}
        className="no-underline flex flex-col gap-3"
        style={{
          position: 'relative', borderRadius: 16, padding: '20px 22px',
          background: 'var(--surface)', display: 'flex',
          transform: isHov ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: isHov ? 'var(--shadow-md)' : 'none',
          transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
          cursor: 'default',
        }}
        onMouseEnter={() => { setIsHov(true); strokeOpacity.set(0.7); }}
        onMouseLeave={() => { setIsHov(false); strokeOpacity.set(0.2); }}
      >
        <m.div style={{ ...STROKE_RING_STYLE, opacity: strokeOpacity }} />
        <m.span
          animate={{ scale: isHov ? 1.15 : 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontSize: 24, lineHeight: 1, display: 'inline-block', transformOrigin: 'left center' }}
        >✍️</m.span>
        <p className="t-h5 text-fg" style={{ margin: 0 }}>Why designers should learn to say no</p>
        <p className="t-body2 text-fg-muted" style={{ margin: 0 }}>Short description of the article goes here in two lines max.</p>
        <div className="flex items-center gap-1 t-caption font-semibold" style={{ color: isHov ? 'var(--color-coral)' : 'var(--fg-muted)', transition: 'color 0.2s ease' }}>
          <span>Read</span>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
            style={{ opacity: isHov ? 1 : 0.45, transform: isHov ? 'translate(2px,-2px)' : 'translate(0,0)', transition: 'opacity 0.2s ease, transform 0.2s ease' }}>
            <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </a>
    </div>
  );
}

/* ── SpotlightBlob (mirrors ProjectSections) ─────────────────── */
function SpotlightBlob() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 80% at 50% 50%, color-mix(in srgb, var(--brand) 8%, transparent) 0%, transparent 70%)',
      }}
    />
  );
}

/* ── Notion color pill ───────────────────────────────────────── */
const NOTION_COLORS = {
  default:            { label: 'default',    bg: 'var(--surface)', color: 'var(--fg)' },
  gray:               { label: 'gray',       bg: 'rgba(206,205,202,0.3)',  color: '#6b7280' },
  gray_background:    { label: 'gray_bg',    bg: 'rgba(206,205,202,0.25)', color: '#6b7280' },
  blue:               { label: 'blue',       bg: 'rgba(46,125,174,0.15)',  color: '#2e7dae' },
  blue_background:    { label: 'blue_bg',    bg: 'rgba(46,125,174,0.12)',  color: '#2e7dae' },
  purple:             { label: 'purple',     bg: 'rgba(72,57,202,0.15)',   color: '#4839ca' },
  purple_background:  { label: 'purple_bg',  bg: 'rgba(72,57,202,0.12)',   color: '#4839ca' },
  brown:              { label: 'brown',      bg: 'rgba(158,107,79,0.15)',  color: '#9e6b4f' },
  brown_background:   { label: 'brown_bg',   bg: 'rgba(158,107,79,0.12)',  color: '#9e6b4f' },
};

function NotionColorPill({ colorKey }) {
  const c = NOTION_COLORS[colorKey] ?? NOTION_COLORS.default;
  return (
    <span
      className="inline-flex items-center px-2 py-1 rounded-lg t-caption font-mono font-semibold"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}` }}
    >
      {c.label}
    </span>
  );
}

/* ── Section preview (mirrors actual Section component) ──────── */
function SectionPreview({ style, isSplit }) {
  const s = style;
  return (
    <section
      style={{
        color: s.textClr,
        position: s.blob ? 'relative' : undefined,
        overflow: s.blob ? 'hidden' : undefined,
        ...s.wrap,
      }}
    >
      {s.blob && <SpotlightBlob />}
      <div
        className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-10"
        style={s.inner}
      >
        {isSplit ? (
          <div className="grid gap-8 lg:gap-16 lg:grid-cols-[3fr_7fr] items-start">
            <div>
              <p className="t-h4 font-bold leading-snug" style={{ color: s.textClr }}>
                Section Label
              </p>
              <div className="mt-4 h-px w-8" style={{ background: 'var(--brand)' }} />
            </div>
            <div className="flex flex-col gap-4">
              <p className="t-body2 leading-relaxed" style={{ color: s.mutedClr }}>
                Body text in the right column. The <code>heading_1</code> in Notion becomes the sticky left label. Remaining blocks render here — paragraphs, images, lists, callouts.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Research', 'UX Design', 'Prototyping'].map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full t-caption font-medium"
                    style={{ background: 'color-mix(in srgb, currentColor 10%, transparent)', border: '1px solid color-mix(in srgb, currentColor 20%, transparent)', color: s.mutedClr }}
                  >{t}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="t-h4 font-bold" style={{ color: s.textClr }}>Section 0 — Intro (full-width)</p>
            <p className="t-body2 leading-relaxed" style={{ color: s.mutedClr }}>
              This is the intro section — all content before the first <code>heading_1</code>. Always full-width, always style 0 (default).
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Block map row ───────────────────────────────────────────── */
function BlockRow({ block, renders, notes }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr] gap-3 items-start px-4 py-3 rounded-xl border-b"
      style={{ borderColor: 'var(--border)' }}>
      <code className="t-caption font-mono font-semibold text-[var(--brand)]">{block}</code>
      <code className="t-caption font-mono" style={{ color: 'var(--fg)' }}>{renders}</code>
      <p className="t-caption" style={{ color: 'var(--fg-muted)' }}>{notes}</p>
    </div>
  );
}

export default function StyleGuide() {
  return (
    <main className="min-h-screen" style={{ color: 'var(--fg)' }}>

      {/* ── Page header ── */}
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 pt-28 pb-8">
        <p className="t-overline text-fg-muted mb-2">Dev reference · not linked in nav</p>
        <h1 className="t-h2 mb-3">Component Style Guide</h1>
        <p className="t-body1 text-fg-muted" style={{ maxWidth: '55ch' }}>
          All visual components and their variants. Toggle light/dark in the navbar to check both themes.
        </p>
      </div>

      {/* ── Sidebar + content layout ── */}
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex gap-8 items-start">

          {/* ── Sticky left nav ── */}
          <aside className="hidden lg:block w-[172px] shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto">
            <StyleNav />
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* ══════════════════════════════════════════════
                01. COLOURS
            ══════════════════════════════════════════════ */}
            <Section id="colours" title="Colours" subtitle="01 — Design Tokens">
              <div className="flex flex-col gap-8">
                <div>
                  <Label>Accent primitives</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                    <Swatch label="--color-brand"        value="#4839ca" />
                    <Swatch label="--color-coral"        value="#ea8575" />
                  </div>
                </div>
                <div>
                  <Label>Neutral primitives</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <Swatch label="--color-navy"         value="#19223d" />
                    <Swatch label="--color-dark-blue"    value="#0b2261" />
                    <Swatch label="--color-dark-teal"    value="#163846" />
                    <Swatch label="--color-purple-card"  value="#4a2d7f" />
                    <Swatch label="--color-ink"          value="#313138" />
                    <Swatch label="--color-parchment"    value="#f5f4f0" border="1px solid rgba(0,0,0,0.1)" />
                  </div>
                </div>
                <div>
                  <Label>Semantic — Text (changes with dark/light toggle)</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <Swatch label="--fg"          value="var(--fg)"          border="1px solid var(--border)" />
                    <Swatch label="--fg-muted"    value="var(--fg-muted)"    border="1px solid var(--border)" />
                    <Swatch label="--fg-disabled" value="var(--fg-disabled)" border="1px solid var(--border)" />
                    <Swatch label="--bg-solid"    value="var(--bg-solid)"    border="1px solid var(--border)" />
                    <Swatch label="--bg-inverse"  value="var(--bg-inverse)"  border="1px solid var(--border)" />
                  </div>
                </div>
                <div>
                  <Label>Semantic — Surfaces (elevation scale)</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <Swatch label="--surface-0"       value="var(--surface-0)"       border="1px solid var(--border)" />
                    <Swatch label="--surface-1"       value="var(--surface-1)"       border="1px solid var(--border)" />
                    <Swatch label="--surface-2"       value="var(--surface-2)"       border="1px solid var(--border)" />
                    <Swatch label="--surface-inverse" value="var(--surface-inverse)" border="1px solid var(--border)" />
                    <Swatch label="--border"          value="var(--border)"          border="1px solid var(--border)" />
                    <Swatch label="--border-hover"    value="var(--border-hover)"    border="1px solid var(--border-hover)" />
                    <Swatch label="--border-strong"   value="var(--border-strong)"   border="1px solid var(--border-strong)" />
                  </div>
                </div>
                <div>
                  <Label>Semantic — Brand</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <Swatch label="--brand"        value="var(--brand)"        border="1px solid var(--border)" />
                    <Swatch label="--brand-muted"  value="var(--brand-muted)"  border="1px solid var(--border)" />
                    <Swatch label="--brand-border" value="var(--brand-border)" border="1px solid var(--border)" />
                  </div>
                </div>
                <div>
                  <Label>Semantic — Status colors</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Swatch label="--color-success"    value="var(--color-success)"    />
                    <Swatch label="--color-success-bg" value="var(--color-success-bg)" border="1px solid var(--color-success)" />
                    <Swatch label="--color-warning"    value="var(--color-warning)"    />
                    <Swatch label="--color-warning-bg" value="var(--color-warning-bg)" border="1px solid var(--color-warning)" />
                    <Swatch label="--color-error"      value="var(--color-error)"      />
                    <Swatch label="--color-error-bg"   value="var(--color-error-bg)"   border="1px solid var(--color-error)" />
                    <Swatch label="--color-info"       value="var(--color-info)"       />
                    <Swatch label="--color-info-bg"    value="var(--color-info-bg)"    border="1px solid var(--color-info)" />
                  </div>
                </div>
                <div>
                  <Label>Semantic — Section callout surfaces (solid / frosted / blank)</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2 p-5 rounded-2xl" style={{ background: 'var(--section-solid-bg)', border: '1px solid transparent' }}>
                      <p className="t-caption font-mono font-semibold text-white">solid</p>
                      <div className="flex flex-col gap-0.5 mt-1">
                        {['--section-solid-bg','--section-solid-fg'].map((t) => (
                          <code key={t} className="t-caption font-mono opacity-60 text-white">{t}</code>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 p-5 rounded-2xl" style={{ background: 'var(--section-frosted-bg)', border: '1px solid var(--section-frosted-border)', backdropFilter: 'blur(8px)' }}>
                      <p className="t-caption font-mono font-semibold" style={{ color: 'var(--section-frosted-fg)' }}>frosted</p>
                      <div className="flex flex-col gap-0.5 mt-1">
                        {['--section-frosted-bg','--section-frosted-fg','--section-frosted-border'].map((t) => (
                          <code key={t} className="t-caption font-mono opacity-60" style={{ color: 'var(--section-frosted-fg)' }}>{t}</code>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 p-5 rounded-2xl" style={{ background: 'var(--section-blank-bg)', border: '1px solid var(--section-blank-border)' }}>
                      <p className="t-caption font-mono font-semibold" style={{ color: 'var(--section-blank-fg)' }}>blank</p>
                      <div className="flex flex-col gap-0.5 mt-1">
                        {['--section-blank-bg','--section-blank-fg','--section-blank-border'].map((t) => (
                          <code key={t} className="t-caption font-mono opacity-60" style={{ color: 'var(--section-blank-fg)' }}>{t}</code>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>RichText / Notion annotation colours</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'gray',   color: 'var(--fg-muted)' },
                      { name: 'brown',  color: '#9e6b4f' },
                      { name: 'orange', color: 'var(--color-coral)' },
                      { name: 'yellow', color: 'var(--color-warning)' },
                      { name: 'green',  color: 'var(--color-success)' },
                      { name: 'blue',   color: 'var(--color-info)' },
                      { name: 'purple', color: 'var(--brand)' },
                      { name: 'pink',   color: '#e255a1' },
                      { name: 'red',    color: 'var(--color-error)' },
                    ].map(({ name, color }) => (
                      <span key={name} className="t-body2 font-semibold" style={{ color }}>{name}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      { name: 'gray_bg',   bg: 'rgba(206,205,202,0.25)' },
                      { name: 'brown_bg',  bg: 'rgba(158,107,79,0.15)' },
                      { name: 'orange_bg', bg: 'var(--color-warning-bg)' },
                      { name: 'yellow_bg', bg: 'var(--color-warning-bg)' },
                      { name: 'green_bg',  bg: 'var(--color-success-bg)' },
                      { name: 'blue_bg',   bg: 'var(--color-info-bg)' },
                      { name: 'purple_bg', bg: 'var(--brand-muted)' },
                      { name: 'pink_bg',   bg: 'rgba(226,85,161,0.15)' },
                      { name: 'red_bg',    bg: 'var(--color-error-bg)' },
                    ].map(({ name, bg }) => (
                      <span key={name} className="t-body2 font-medium px-1.5 rounded" style={{ background: bg }}>
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* ══════════════════════════════════════════════
                02. TYPOGRAPHY
            ══════════════════════════════════════════════ */}
            <Section id="typography" title="Typography" subtitle="02 — Type Scale">
              <div className="flex flex-col gap-6">
                {[
                  { cls: 't-display',  label: 't-display · 48→84px · Semibold · page banners / hero', text: 'Design that moves' },
                  { cls: 't-h1',       label: 't-h1 · 36→72px · Semibold',     text: 'Design that moves' },
                  { cls: 't-h2',       label: 't-h2 · 30→60px · Semibold · Notion H1', text: 'Design that moves' },
                  { cls: 't-h3',       label: 't-h3 · 24→48px · Semibold · Notion H2', text: 'Design that moves' },
                  { cls: 't-h4',       label: 't-h4 · 20→32px · Semibold · Notion H3', text: 'Design that moves people' },
                  { cls: 't-h5',       label: 't-h5 · 18→28px · Semibold',             text: 'Design that moves people forward' },
                  { cls: 't-h6',       label: 't-h6 · 16px fixed · Semibold',           text: 'Design that moves people forward' },
                  { cls: 't-lead',     label: 't-lead · xl→2xl · Normal · intro paragraphs', text: 'I design systems that scale, interfaces that convert, and experiences that stick.' },
                  { cls: 't-body1',    label: 't-body1 · 22px · Medium',    text: 'I design systems that scale, interfaces that convert, and experiences that stick.' },
                  { cls: 't-body2',    label: 't-body2 · 18px · Medium',    text: 'I design systems that scale, interfaces that convert, and experiences that stick.' },
                  { cls: 't-body3',    label: 't-body3 · 14px · Medium',    text: 'I design systems that scale, interfaces that convert, and experiences that stick.' },
                  { cls: 't-caption',  label: 't-caption · 12px · Bold',    text: 'CAPTION LABEL' },
                  { cls: 't-overline', label: 't-overline · 12px · Tracked uppercase · section labels', text: 'SECTION OVERLINE' },
                  { cls: 't-label',    label: 't-label · 14px · Semibold uppercase · form labels', text: 'FORM LABEL' },
                  { cls: 't-small',    label: 't-small · xs · Normal',      text: 'Small helper text or disclaimer copy.' },
                  { cls: 't-mono',     label: 't-mono · 13px · Monospace',  text: 'const value = tokens.get("--brand");' },
                  { cls: 't-link',     label: 't-link · underlined · hover opacity', text: 'Inline hyperlink style' },
                  { cls: 't-btn1',     label: 't-btn1 · 20px · Semibold · large button text', text: 'Button Label' },
                  { cls: 't-btn2',     label: 't-btn2 · 16px · Semibold · small button text', text: 'Button Label' },
                ].map(({ cls, label, text }) => (
                  <div key={cls} className="flex flex-col gap-0.5">
                    <p className="t-caption font-mono opacity-50">{label}</p>
                    <p className={cls}>{text}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* ══════════════════════════════════════════════
                03. BUTTONS
            ══════════════════════════════════════════════ */}
            <Section id="buttons" title="Buttons" subtitle="03 — Button Variants">
              <div className="flex flex-col gap-10">
                <div>
                  <Label>variant — lg size</Label>
                  <div className="flex flex-wrap gap-4 items-center">
                    {Object.keys(BUTTON_VARIANTS).map((v) => (
                      <Button key={v} variant={v}>{v}</Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>variant — sm size</Label>
                  <div className="flex flex-wrap gap-4 items-center">
                    {Object.keys(BUTTON_VARIANTS).map((v) => (
                      <Button key={v} variant={v} size="sm">{v}</Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>link — section usage (sm, all-caps, arrow)</Label>
                  <div className="flex flex-wrap gap-6 items-center">
                    <Button variant="link" size="sm" icon={<ArrowIcon size={11} />}>KNOW MORE</Button>
                  </div>
                  <p className="t-caption text-[var(--fg-muted)] mt-2">Available variant — no border, fg-muted, coral hover.</p>
                </div>
                <div>
                  <Label>outline sm — section usage (all-caps, arrow)</Label>
                  <div className="flex flex-wrap gap-6 items-center">
                    <Button variant="outline" size="sm" icon={<ArrowIcon size={11} />}>KNOW MORE</Button>
                  </div>
                  <p className="t-caption text-[var(--fg-muted)] mt-2">Used in AboutSection, HelpSection, JourneySoFar section headers</p>
                </div>
              </div>
            </Section>

            {/* ══════════════════════════════════════════════
                04. BADGES
            ══════════════════════════════════════════════ */}
            <Section id="badges" title="Badges" subtitle="04 — Status Indicators">
              <div className="flex flex-col gap-6">
                <div>
                  <Label>with dot (default)</Label>
                  <div className="flex flex-wrap gap-3">
                    {Object.keys(BADGE_VARIANTS).map((v) => (
                      <Badge key={v} variant={v}>{v}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>dot=false</Label>
                  <div className="flex flex-wrap gap-3">
                    {Object.keys(BADGE_VARIANTS).map((v) => (
                      <Badge key={v} variant={v} dot={false}>{v}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* ══════════════════════════════════════════════
                05. TAGS
            ══════════════════════════════════════════════ */}
            <Section id="tags" title="Tags" subtitle="05 — Tag Palette">
              <Label>TAG_PALETTE — 9 colours, assigned by label hash</Label>
              <div className="flex flex-wrap gap-2">
                {['UX Design','Product Design','Microsoft','AI','Research','Agentic AI','Copilot','Case Studies','Strategy'].map((label) => (
                  <Tag key={label} label={label} />
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {TAG_PALETTE.map((p, i) => (
                  <span key={i} className="ui-tag" style={{ background: p.bg, color: p.color, border: `1px solid ${p.color}` }}>
                    Palette {i}
                  </span>
                ))}
              </div>
            </Section>

            {/* ══════════════════════════════════════════════
                06. CARD SIZES
            ══════════════════════════════════════════════ */}
            <Section id="card-sizes" title="Card Sizes" subtitle="06 — All 5 Sizes (default style)">
              <div className="flex flex-col gap-8">
                {Object.keys(CARD_SIZES).map((sz) => (
                  <div key={sz}>
                    <Label>size=&quot;{sz}&quot; — {CARD_SIZES[sz].imgHeight ?? 'no image'}</Label>
                    <div className="max-w-xs">
                      <Card
                        size={sz} cardStyle="default"
                        title="Excel Charting: AI Recommendations"
                        desc="Teaching Excel to be your personal design critic."
                        tags={['UX', 'AI', 'Microsoft']}
                        img={PLACEHOLDER_IMG} href="#" label="Know more"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* ══════════════════════════════════════════════
                07. CARD STYLES
            ══════════════════════════════════════════════ */}
            <Section id="card-styles" title="Card Styles" subtitle="07 — All 7 Visual Styles (size=l)">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {Object.keys(CARD_STYLES).map((cs) => (
                  <div key={cs}>
                    <Label>cardStyle=&quot;{cs}&quot;</Label>
                    <Card
                      size="l" cardStyle={cs}
                      title="Excel Charting: AI Recommendations"
                      desc="Teaching Excel to be your personal design critic."
                      tags={['UX', 'AI']}
                      img={PLACEHOLDER_IMG} href="#" label="Know more"
                    />
                  </div>
                ))}
              </div>
            </Section>

            {/* ══════════════════════════════════════════════
                08. FORM ELEMENTS
            ══════════════════════════════════════════════ */}
            <Section id="forms" title="Form Elements" subtitle="08 — Inputs &amp; Controls">
              <div className="flex flex-col gap-10 max-w-2xl">

                {/* Component API */}
                <div>
                  <p className="t-caption font-mono font-bold tracking-widest mb-5" style={{ color: 'var(--brand)' }}>COMPONENT API — Input / Textarea / Select wrappers</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input label="Your name" id="sg-name" placeholder="Abhishek" />
                    <Input label="Email" id="sg-email" type="email" placeholder="your@email.com" />
                    <Input label="With error" id="sg-error" placeholder="Required field" error="This field is required" />
                    <Select
                      label="Opportunity type"
                      id="sg-select"
                      placeholder="Pick one"
                      options={[{ value: 'ft', label: 'Full-time' }, { value: 'fl', label: 'Freelance' }, { value: 'ad', label: 'Advisory' }]}
                    />
                    <div className="sm:col-span-2">
                      <Textarea label="Message" id="sg-message" rows={3} placeholder="Your message…" />
                    </div>
                    <div className="sm:col-span-2">
                      <Textarea label="With error" id="sg-msg-error" rows={2} error="Message is required" />
                    </div>
                  </div>
                </div>

                {/* Raw CSS classes */}
                <div>
                  <p className="t-caption font-mono font-bold tracking-widest mb-5" style={{ color: 'var(--brand)' }}>RAW CSS — .ui-input / .ui-select classes</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label>.ui-input — text</Label>
                      <input className="ui-input" type="text" placeholder="Your name" />
                    </div>
                    <div>
                      <Label>.ui-input — focused state (click to see)</Label>
                      <input className="ui-input" type="text" defaultValue="Click me to focus" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>.ui-input — textarea</Label>
                      <textarea className="ui-input" rows={3} placeholder="Your message…" />
                    </div>
                    <div>
                      <Label>.ui-input .ui-select</Label>
                      <select className="ui-input ui-select">
                        <option>Select an option</option>
                        <option>Full-time</option>
                        <option>Freelance</option>
                        <option>Advisory</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>
            </Section>

            {/* ══════════════════════════════════════════════
                09. SURFACES
            ══════════════════════════════════════════════ */}
            <Section id="surfaces" title="Surfaces" subtitle="09 — Theme-aware Card Wrappers">
              <div className="flex flex-wrap gap-5">
                {['sm','md','lg'].map((sz) => (
                  <div key={sz} className={`ui-surface ui-surface--${sz} p-6 flex flex-col gap-1`} style={{ minWidth: 180 }}>
                    <p className="t-body2 font-semibold">.ui-surface--{sz}</p>
                    <p className="t-caption text-fg-muted">border-radius varies</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* ══════════════════════════════════════════════
                10. NOTION → SECTION STYLE MAP
            ══════════════════════════════════════════════ */}
            <Section id="section-map" title="Notion → Section Style Map" subtitle="10 — Styles · Layouts · Grids">

              <div className="mb-10">
                <p className="t-caption font-mono font-bold tracking-widest mb-5" style={{ color: 'var(--brand)' }}>STYLES</p>
                <Label>heading_1 color in Notion → section style applied</Label>
                <div className="flex flex-col gap-2 mt-1">
                  {[
                    { colors: ['default'], styleIdx: 0, note: 'No color set (any unmapped color also falls here)' },
                    { colors: ['gray', 'gray_background'], styleIdx: 1, note: 'gray or gray_background only' },
                    { colors: ['blue', 'blue_background'],       styleIdx: 2, note: 'blue or blue_background only' },
                    { colors: ['purple', 'purple_background'],   styleIdx: 3, note: 'purple or purple_background' },
                    { colors: ['brown', 'brown_background'], styleIdx: 4, note: 'brown or brown_background only' },
                  ].map(({ colors, styleIdx, note }) => {
                    const s = SECTION_STYLES[styleIdx];
                    return (
                      <div
                        key={styleIdx}
                        className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                      >
                        <div className="flex flex-wrap gap-2">
                          {colors.map((c) => <NotionColorPill key={c} colorKey={c} />)}
                        </div>
                        <p className="t-caption text-fg-muted font-mono">{note}</p>
                        <span
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full t-caption font-bold"
                          style={{
                            background: styleIdx === 2 ? 'var(--bg-inverse)'
                                      : styleIdx === 3 ? 'linear-gradient(135deg, #4a2d7f 0%, #0b1f3a 100%)'
                                      : styleIdx === 4 ? 'var(--section-solid-bg)'
                                      : 'var(--border)',
                            color:      styleIdx === 2 ? 'var(--bg-solid)'
                                      : styleIdx === 3 ? '#fff'
                                      : styleIdx === 4 ? 'var(--section-solid-fg)'
                                      : 'var(--fg)',
                            border:     '1px solid var(--border)',
                          }}
                        >
                          [{styleIdx}] {s.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-10">
                <p className="t-caption font-mono font-bold tracking-widest mb-5" style={{ color: 'var(--brand)' }}>LAYOUTS</p>
                <Label>section boundary rules — what triggers each layout</Label>
                <div className="flex flex-col gap-2">
                  {[
                    { trigger: 'heading_1 block',                       result: 'New section — becomes the sticky left label in the 30/70 split layout' },
                    { trigger: 'column_list with H1 in first column',   result: 'New section — H1 is the sticky label, any extra col-1 blocks are subtitle, remaining columns fill the right panel' },
                    { trigger: '--- divider block',                     result: 'Hard section break — full-width, resets to default style (use for intros / gallery sections)' },
                    { trigger: 'Divider inside callout',                result: 'Ignored — only top-level blocks form section boundaries' },
                    { trigger: 'Content before first heading',          result: 'Section 0 — full-width, default style. If the page starts directly with a heading, section 0 splits like any other.' },
                  ].map(({ trigger, result }) => (
                    <div key={trigger} className="grid sm:grid-cols-[1fr_2fr] gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                      <Code>{trigger}</Code>
                      <p className="t-caption text-fg-muted">{result}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="t-caption font-mono font-bold tracking-widest mb-5" style={{ color: 'var(--brand)' }}>CONTENT GRIDS</p>
                <Label>column_list — Notion column count → responsive CSS grid class</Label>
                <div className="flex flex-col gap-2">
                  {[
                    { cols: '2 columns', cls: 'grid-cols-1 sm:grid-cols-2' },
                    { cols: '3 columns', cls: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' },
                    { cols: '4 columns', cls: 'grid-cols-2 lg:grid-cols-4' },
                    { cols: '5 columns', cls: 'grid-cols-2 lg:grid-cols-5' },
                  ].map(({ cols, cls }) => (
                    <div key={cols} className="grid sm:grid-cols-[1fr_2fr] gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                      <p className="t-caption font-semibold">{cols}</p>
                      <Code>{cls}</Code>
                    </div>
                  ))}
                </div>
              </div>

            </Section>

            {/* ══════════════════════════════════════════════
                11. SECTION STYLE PREVIEWS
            ══════════════════════════════════════════════ */}
            <section id="section-previews" className="py-12 border-t border-theme scroll-mt-24">
              <div className="mb-8">
                <p className="t-overline text-fg-muted mb-1">11 — Section Style Previews</p>
                <h2 className="t-h4 font-bold mb-2">All 5 Styles × Split + Full-width</h2>
                <p className="t-body2 text-fg-muted">
                  Every style supports both layouts. Split is triggered by <Code>heading_1</Code>. Full-width by <Code>---</Code> divider or section 0.
                </p>
              </div>

              {SECTION_STYLES.map((s, i) => (
                <div key={i} className="mb-4">
                  <div className="flex items-center gap-3 py-3">
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full t-caption font-bold"
                      style={{ background: 'var(--border)', color: 'var(--fg)' }}
                    >
                      {i}
                    </span>
                    <code className="t-caption font-mono font-semibold text-fg-muted">
                      SECTION_STYLES[{i}] — {s.name}
                    </code>
                  </div>
                  <p className="t-caption font-mono opacity-50 pb-1">split layout</p>
                  <div className="rounded-xl overflow-hidden mb-2">
                    <SectionPreview style={s} isSplit={true} />
                  </div>
                  <p className="t-caption font-mono opacity-50 pb-1 pt-2">full-width layout</p>
                  <div className="rounded-xl overflow-hidden">
                    <SectionPreview style={s} isSplit={false} />
                  </div>
                </div>
              ))}
            </section>

            {/* ══════════════════════════════════════════════
                12. NOTION BLOCK MAP
            ══════════════════════════════════════════════ */}
            <Section id="block-map" title="Notion Block Map" subtitle="12 — Block Type → Render Reference">
              <div className="flex flex-col gap-1">
                {/* Header row */}
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr] gap-3 px-4 py-2">
                  <p className="t-caption font-mono font-bold opacity-50">Notion block type</p>
                  <p className="t-caption font-mono font-bold opacity-50">Renders as</p>
                  <p className="t-caption font-mono font-bold opacity-50">Notes</p>
                </div>

                {/* Text blocks */}
                <p className="px-4 pt-4 pb-1 t-caption font-mono text-[var(--brand)] font-semibold opacity-70">Text blocks</p>
                <BlockRow block="paragraph"            renders="<p class='t-body2 text-fg-muted'>"    notes="Empty paragraph → 8px spacer div" />
                <BlockRow block="heading_1"            renders="<h2 class='t-h2 mt-10'>"              notes="Top-level: triggers 30/70 section split; becomes sticky left label" />
                <BlockRow block="heading_2"            renders="<h3 class='t-h3 mt-8'>"              notes="Subsection within right column" />
                <BlockRow block="heading_3"            renders="<h4 class='t-h4 mt-6'>"              notes="Minor heading" />
                <BlockRow block="heading_4"            renders="<h5 class='t-h5 mt-2'>"              notes="Label-level heading; compact mode → t-h6" />
                <BlockRow block="quote"                renders="<blockquote>"                         notes="Native Notion quote block — plain blockquote styling" />
                <BlockRow block="bulleted_list_item"   renders="<ul class='list-disc'><li>"           notes="Consecutive items auto-grouped into one <ul>" />
                <BlockRow block="numbered_list_item"   renders="<ol class='list-decimal'><li>"        notes="Consecutive items auto-grouped into one <ol>" />
                <BlockRow block="to_do"                renders="<input type='checkbox' disabled>"     notes="Checked items: line-through + opacity-50" />
                <BlockRow block="equation"             renders="<pre> plain text"                     notes="Expression rendered as-is; no LaTeX parser" />

                {/* Media */}
                <p className="px-4 pt-4 pb-1 t-caption font-mono text-[var(--brand)] font-semibold opacity-70">Media</p>
                <BlockRow block="image"                renders="<figure><img loading='lazy'>"         notes="Full-width, rounded-xl. Caption optional" />
                <BlockRow block="video"                renders="<iframe aspect-video>"                notes="External URL or file. Accepts YouTube embeds" />
                <BlockRow block="file / pdf"           renders="<a download>"                         notes="Download link. Caption used as filename label" />

                {/* Interactive / structured */}
                <p className="px-4 pt-4 pb-1 t-caption font-mono text-[var(--brand)] font-semibold opacity-70">Interactive &amp; structured</p>
                <BlockRow block="code"                 renders="<pre><code class='font-mono'>"        notes="Language chip above block. 'plain text' hides chip" />
                <BlockRow block="toggle"               renders="<details><summary>"                   notes="Chevron rotates on open. Children rendered recursively" />
                <BlockRow block="table"                renders="<table class='ui-table'>"             notes="Column and/or row headers optional per Notion toggle" />
                <BlockRow block="divider"              renders="<hr> or section break"                notes="Top-level: creates new section. Inside block: visual line" />
                <BlockRow block="button"               renders="<a class='rounded-full border'>"      notes="Requires action.type === 'url'; else renders as muted text" />
                <BlockRow block="bookmark / link_preview" renders="<a> with arrow icon"              notes="Figma URLs → fixed label 'Check out this figma file for details'. Others: caption if set, else domain." />
                <BlockRow block="embed"                renders="<iframe aspect-video>"                notes="Any embeddable URL" />
                <BlockRow block="column_list"          renders="CSS grid or 30/70 split"              notes="H1 in first col → split section. Otherwise: 2→sm:2cols, 3→lg:3cols, 4→lg:4cols, 5→lg:5cols" />
                <BlockRow block="child_database"       renders="<ProjectsGrid>"                       notes="Renders all projects from data/projects.json" />

                {/* Callouts */}
                <p className="px-4 pt-4 pb-1 t-caption font-mono text-[var(--brand)] font-semibold opacity-70">Callout — emoji → type · Notion color → same treatment regardless of emoji</p>
                <p className="px-4 pb-2 t-caption text-[var(--fg-muted)]">Color rank: 0 default→default/default · 1 gray→inverse/inverse · 2 brown→solid/solid · 3 red/pink→outline/outline · 4 orange/yellow→warm/elevated · 5 green→success/solid · 6 blue/purple→gradient/gradient</p>
                <BlockRow block="callout + 💡"          renders="InsightCallout"  notes="Highlighted callout. BG token from color rank above." />
                <BlockRow block="callout + 🎯 or 📊"   renders="FeatureCallout"  notes="Large block. URL child → entire card is linkable. BG token from color rank." />
                <BlockRow block="callout + 💬"          renders="QuoteCallout"    notes="Italic pull-quote. BG token from color rank." />
                <BlockRow block="callout + ✏️"          renders="NoteCallout"     notes="Compact annotation. Emoji at opacity-50. Color ignored." />
                <BlockRow block="callout + 📌"          renders="InsightCallout"  notes="Merged into InsightCallout — emoji left, body2 title + content." />
                <BlockRow block="callout + ⛔️"          renders="card"              notes="Explicit project card. hasImage → size l, else m. CARD_STYLES key from color rank." />
                <BlockRow block="callout + 🌐"          renders="LinkCalloutCard"   notes="Link card: title (body2 semibold) + body + [bracket] hyperlink → CTA button + OG thumbnail. OG image fetched server-side." />
                <BlockRow block="callout (no emoji)"    renders="DefaultCallout"    notes="Clean body text. URL child → linkable with 'Read more →'. BG token from color rank." />
                <BlockRow block="callout (other emoji)" renders="InsightCallout"    notes="Unknown emoji → insight fallback." />

                {/* Skipped */}
                <p className="px-4 pt-4 pb-1 t-caption font-mono text-[var(--brand)] font-semibold opacity-70">Skipped (render null)</p>
                <BlockRow block="synced_block"         renders="null"                                 notes="Ignored — Notion sync blocks not supported" />
                <BlockRow block="table_of_contents"    renders="null"                                 notes="Ignored — nav is page-level, not inline" />
                <BlockRow block="breadcrumb"           renders="null"                                 notes="Ignored" />
              </div>
            </Section>

            {/* ══════════════════════════════════════════════
                13. NOTION BLOCK ELEMENTS (rendered examples)
            ══════════════════════════════════════════════ */}
            <Section id="block-elements" title="Notion Block Elements" subtitle="13 — Rendered Output Reference">
              <div className="flex flex-col gap-12">

                <div>
                  <Label>heading_1 → t-h2 (triggers section split as label)</Label>
                  <h2 className="t-h2 mt-2">Major Section Heading</h2>
                </div>

                <div>
                  <Label>heading_2 → t-h3 (subsection within right column)</Label>
                  <h3 className="t-h3 mt-2">Subsection Heading</h3>
                </div>

                <div>
                  <Label>heading_3 → t-h4</Label>
                  <h4 className="t-h4 mt-2">Minor Heading</h4>
                </div>

                <div>
                  <Label>heading_4 → t-h5 (label-level; compact → t-h6)</Label>
                  <h5 className="t-h5 mt-2">Label Heading</h5>
                </div>

                <div>
                  <Label>paragraph → t-body2 text-fg-muted</Label>
                  <p className="t-body2 text-fg-muted leading-relaxed mt-2">
                    Body paragraph text. I design systems that scale, interfaces that convert, and experiences that stick. This is how regular Notion paragraph blocks are rendered across all section styles.
                  </p>
                </div>

                <div>
                  <Label>quote block → blockquote</Label>
                  <blockquote className="mt-2">
                    Design is not just what it looks like and feels like. Design is how it works.
                  </blockquote>
                </div>

                <div>
                  <Label>bulleted_list_item → ul</Label>
                  <ul className="list-disc list-outside pl-5 space-y-1 t-body2 text-fg-muted mt-2">
                    <li>First bullet point item</li>
                    <li>Second bullet point item with <strong>bold text</strong></li>
                    <li>Third item with a <em>code snippet</em></li>
                  </ul>
                </div>

                <div>
                  <Label>numbered_list_item → ol</Label>
                  <ol className="list-decimal list-outside pl-5 space-y-1 t-body2 text-fg-muted mt-2">
                    <li>First numbered item</li>
                    <li>Second numbered item</li>
                    <li>Third numbered item</li>
                  </ol>
                </div>

                <div>
                  <Label>code block → pre + code</Label>
                  <div className="mt-2">
                    <div className="t-caption font-mono px-4 py-1.5 rounded-t-xl" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', color: 'var(--fg-muted)', opacity: 0.7 }}>
                      javascript
                    </div>
                    <pre className="overflow-x-auto px-5 py-4 text-sm rounded-b-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: 'none' }}>
                      <code className="font-mono">{`const response = await notion.dataSources.query({
  data_source_id: 'f10273fc0bd24a09bcba022726aa63ad',
});`}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <Label>toggle → details / summary</Label>
                  <details className="group rounded-xl border border-theme overflow-hidden mt-2">
                    <summary
                      className="flex items-center gap-2 px-4 py-3 t-body2 font-medium cursor-pointer select-none list-none"
                      style={{ background: 'var(--surface)' }}
                    >
                      <svg className="size-4 flex-shrink-0 transition-transform duration-200 group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      Toggle block — click to expand
                    </summary>
                    <div className="px-5 py-4 flex flex-col gap-3 border-t border-theme">
                      <p className="t-body2 text-fg-muted">Hidden content inside the toggle. Can contain any block type.</p>
                    </div>
                  </details>
                </div>

                <div>
                  <Label>column_list (2 equal cols) → grid-cols-1 sm:grid-cols-2</Label>
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 mt-2">
                    <div className="flex flex-col gap-2 px-4 py-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                      <p className="t-body2 font-semibold">Column 1</p>
                      <p className="t-body3 text-fg-muted">First column content. Both columns are equal width at all breakpoints ≥ sm.</p>
                    </div>
                    <div className="flex flex-col gap-2 px-4 py-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                      <p className="t-body2 font-semibold">Column 2</p>
                      <p className="t-body3 text-fg-muted">Second column content. Stacks on mobile.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>column_list (3 equal cols) → grid-cols-1 sm:grid-cols-2 lg:grid-cols-3</Label>
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-2">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="flex flex-col gap-2 px-4 py-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                        <p className="t-body2 font-semibold">Column {n}</p>
                        <p className="t-body3 text-fg-muted">Equal-width column content.</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>image → full-width rounded-xl with optional caption</Label>
                  <figure className="mt-2">
                    <div className="w-full rounded-xl flex items-center justify-center t-caption font-medium" style={{ height: 200, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg-muted)' }}>
                      image block placeholder
                    </div>
                    <figcaption className="mt-2 text-center text-fg-muted opacity-60 t-caption">Optional caption text from Notion image block</figcaption>
                  </figure>
                </div>

                <div>
                  <Label>divider → hr (or section break at top level)</Label>
                  <hr className="border-0 border-t border-theme mt-2" />
                  <p className="t-caption text-fg-muted mt-2">
                    At top level: creates a new section (hard break). Inside callout/toggle: renders as a visual divider line only.
                  </p>
                </div>

              </div>
            </Section>

            {/* ══════════════════════════════════════════════
                14. CALLOUT BLOCK TYPES
            ══════════════════════════════════════════════ */}
            <Section id="callout-types" title="Callout System" subtitle="14 — Types · Styles · Sizes">
              <div className="flex flex-col gap-14">

                {/* ════ TYPES ════ */}
                <div>
                  <p className="t-caption font-mono font-bold tracking-widest mb-6" style={{ color: 'var(--brand)' }}>TYPES — emoji on the callout block selects the renderer</p>
                  <div className="flex flex-col gap-5">

                    <div>
                      <Label>💡 insight / 📌 pin — unified: emoji left, title body2 semibold, content body2</Label>
                      <div className="flex gap-4 items-start px-6 py-5 rounded-xl mt-2"
                        style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                        <span className="text-xl flex-shrink-0 mt-0.5">💡</span>
                        <div className="flex flex-col gap-2">
                          <p className="t-body2 font-semibold leading-snug">Insight callout title</p>
                          <p className="t-body2 leading-relaxed" style={{ color: 'var(--fg-muted)' }}>Optional child paragraph in muted body2 text.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start px-6 py-5 rounded-xl mt-2"
                        style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                        <span className="text-xl flex-shrink-0 mt-0.5">📌</span>
                        <div className="flex flex-col gap-2">
                          <p className="t-body2 font-semibold leading-snug">Pinned callout title</p>
                          <p className="t-body2 leading-relaxed" style={{ color: 'var(--fg-muted)' }}>Same renderer as insight — emoji on left, body2 content.</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>🎯 feature (also 📊) — large accent block, optionally linkable via URL child</Label>
                      <div className="block rounded-2xl p-8 mt-2" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                        <span className="text-4xl leading-none block mb-5">🎯</span>
                        <p className="t-h4 font-bold leading-snug mb-3">Feature block</p>
                        <p className="t-body2 leading-relaxed" style={{ color: 'var(--fg-muted)' }}>Key result / feature highlight. Add a URL child block → whole card becomes clickable with hover lift + &quot;View →&quot; arrow.</p>
                      </div>
                    </div>

                    <div>
                      <Label>💬 quote — large italic pull-quote</Label>
                      <blockquote className="pl-6 py-2 mt-2">
                        <p className="t-h4 font-normal italic leading-snug">Design is not just what it looks like. Design is how it works.</p>
                      </blockquote>
                    </div>

                    <div>
                      <Label>✏️ note — compact muted annotation</Label>
                      <div className="flex gap-2 items-start px-4 py-3 rounded-lg mt-2" style={{ background: 'var(--surface-0)', border: '1px solid var(--border)' }}>
                        <span className="text-sm flex-shrink-0 mt-0.5 opacity-50">✏️</span>
                        <p className="t-body3 leading-relaxed" style={{ color: 'var(--fg-muted)' }}>Footnote or editorial aside. Emoji rendered at opacity-50 so it doesn&apos;t compete with body copy.</p>
                      </div>
                    </div>

                    <div>
                      <Label>🌐 linkcard — title + optional body + [bracket] CTA + OG thumbnail right</Label>
                      <div className="flex flex-col gap-3 mt-2 max-w-2xl">
                        <LinkCalloutCardUI
                          title="How I redesigned Excel's chart defaults to reduce cognitive load"
                          body="A deep dive into the decision-making process, user research, and system constraints that shaped a new default chart style for millions of users."
                          btnLabel="Read the case study"
                          href="https://thatguyabhishek.com"
                          ogImage={null}
                        />
                        <LinkCalloutCardUI
                          title="GoodWorker Design System"
                          btnLabel="Know more"
                          href="https://thatguyabhishek.com"
                          ogImage={null}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>(no emoji) default — clean body text, optionally linkable via URL child</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                        <div className="px-5 py-4 rounded-xl" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                          <p className="t-body2 leading-relaxed">No URL child — plain text block with optional child paragraphs in muted style below.</p>
                        </div>
                        <div className="px-5 py-4 rounded-xl" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', cursor: 'pointer' }}>
                          <p className="t-body2 leading-relaxed">URL child found — whole block becomes a link with hover border highlight.</p>
                          <p className="mt-3 t-body3 font-semibold" style={{ color: 'var(--brand)' }}>Read more →</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>⛔️ card — explicit project / link card (image + title + CTA)</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div className="flex flex-col overflow-hidden rounded-[24px]" style={{ background: 'var(--surface-inverse)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                          <div className="w-full flex items-center justify-center t-caption font-medium" style={{ height: 160, background: 'var(--surface)', color: 'var(--fg-muted)' }}>cover image</div>
                          <div className="flex flex-col gap-5 px-6 pt-5 pb-8">
                            <p className="t-h4 font-bold" style={{ color: 'var(--color-ink)' }}>Project title</p>
                            <span className="mt-auto inline-flex items-center justify-center px-5 py-3 rounded-full t-btn1 font-semibold border-2"
                              style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}>Know more</span>
                          </div>
                        </div>
                        <div className="flex flex-col overflow-hidden rounded-[20px]" style={{ background: 'var(--surface-inverse)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                          <div className="flex flex-col gap-3 px-5 pt-4 pb-6">
                            <p className="t-h5 font-bold" style={{ color: 'var(--color-ink)' }}>Project — no image</p>
                            <p className="t-body2" style={{ color: 'color-mix(in srgb, var(--color-ink) 70%, transparent)' }}>No child image → size m, no CTA button.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Emoji → type reference table */}
                    <div>
                      <Label>Emoji → type reference (CALLOUT_EMOJI_MAP in card-utils.js)</Label>
                      <div className="flex flex-col gap-2 mt-2">
                        {[
                          { emoji: '💡',        type: 'insight',  rule: 'Emoji left, title body2 semibold, content body2. BG per Notion color.' },
                          { emoji: '🎯',        type: 'feature',  rule: 'Large block. URL child → whole block clickable.' },
                          { emoji: '📊',        type: 'feature',  rule: 'Alias for 🎯 — stats / metrics sections.' },
                          { emoji: '🔗',        type: 'feature',  rule: 'Alias for 🎯 — link / resource blocks.' },
                          { emoji: '💬',        type: 'quote',    rule: 'Italic pull-quote. inverse bg → boxed.' },
                          { emoji: '✏️',        type: 'note',     rule: 'Compact annotation.' },
                          { emoji: '📌',        type: 'insight',  rule: 'Same renderer as 💡 — merged into InsightCallout.' },
                          { emoji: '⛔️',       type: 'card',     rule: 'Explicit project/link card (with variation selector).' },
                          { emoji: '⛔',        type: 'card',     rule: 'Defensive alias — same as ⛔️ without variation selector.' },
                          { emoji: '🌐',        type: 'linkcard', rule: 'Link card: title + body + [bracket] hyperlink → CTA button + OG thumbnail (Microlink).' },
                          { emoji: '(none)',    type: 'default',  rule: 'Clean text. URL child → linkable.' },
                          { emoji: '(other)',   type: 'insight',  rule: 'Unknown emoji → insight fallback.' },
                        ].map(({ emoji, type, rule }) => (
                          <div key={type + emoji} className="grid sm:grid-cols-[6rem_7rem_1fr] gap-3 items-center px-4 py-3 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                            <span className="font-mono t-caption">{emoji}</span>
                            <code className="t-caption font-mono font-semibold" style={{ color: 'var(--brand)' }}>{type}</code>
                            <p className="t-caption" style={{ color: 'var(--fg-muted)' }}>{rule}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* ════ STYLES ════ */}
                <div>
                  <p className="t-caption font-mono font-bold tracking-widest mb-6" style={{ color: 'var(--brand)' }}>STYLES — Notion callout color controls the visual treatment</p>
                  <div className="flex flex-col gap-8">

                    {/* Non-card: BG token */}
                    <div>
                      <Label>insight (incl. pin) / feature / quote / default — color → BG token (7 variants)</Label>
                      <div className="flex flex-col gap-3 mt-2">
                        {[
                          { token: 'default',  notionColors: 'default (no color set)', bg: 'var(--surface-1)',        border: '1px solid var(--border)',        textClr: 'var(--fg)',        mutedClr: 'var(--fg-muted)' },
                          { token: 'inverse',  notionColors: 'gray',                   bg: 'var(--bg-inverse)',        border: '1px solid var(--border)',        textClr: 'var(--bg-solid)',  mutedClr: 'color-mix(in srgb, var(--bg-solid) 65%, transparent)' },
                          { token: 'solid',    notionColors: 'brown',                  bg: 'var(--bg-solid)',          border: '1px solid var(--border)',        textClr: 'var(--bg-inverse)', mutedClr: 'color-mix(in srgb, var(--bg-inverse) 65%, transparent)' },
                          { token: 'outline',  notionColors: 'red, pink',              bg: 'transparent',              border: '2px solid var(--border-strong)', textClr: 'var(--fg)',        mutedClr: 'var(--fg-muted)' },
                          { token: 'warm',     notionColors: 'orange, yellow',         bg: 'color-mix(in srgb, var(--color-warning) 20%, transparent)',  border: '1px solid color-mix(in srgb, var(--color-warning) 35%, transparent)',  textClr: 'var(--fg)', mutedClr: 'var(--fg-muted)' },
                          { token: 'success',  notionColors: 'green',                  bg: 'color-mix(in srgb, var(--color-success) 20%, transparent)',  border: '1px solid color-mix(in srgb, var(--color-success) 35%, transparent)',  textClr: 'var(--fg)', mutedClr: 'var(--fg-muted)' },
                          { token: 'gradient', notionColors: 'blue, purple',           bg: 'linear-gradient(135deg, var(--gradient-dual-from), var(--gradient-dual-to))', border: '1px solid var(--brand-border)', textClr: 'var(--fg)', mutedClr: 'var(--fg-muted)' },
                        ].map(({ token, notionColors, bg, border, textClr, mutedClr }) => (
                          <div key={token} className="flex gap-4 items-start px-6 py-5 rounded-xl"
                            style={{ background: bg, border, '--fg': textClr, '--fg-muted': mutedClr }}>
                            <span className="text-xl flex-shrink-0 mt-0.5">💡</span>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <code className="t-caption font-mono font-bold" style={{ color: 'var(--brand)' }}>bg={token}</code>
                                <p className="t-caption" style={{ color: mutedClr }}>← Notion: {notionColors}</p>
                              </div>
                              <p className="t-body2 font-semibold leading-snug" style={{ color: textClr }}>Insight in {token} style</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="t-caption mt-3" style={{ color: 'var(--fg-muted)' }}>
                        <code>inverse</code> = navy bg (light) / parchment bg (dark) · <code>solid</code> = parchment bg (light) / navy bg (dark). Both flip the default surface; inverse uses the brand dark, solid uses the brand light.
                      </p>
                    </div>

                    {/* Card: CARD_STYLES */}
                    <div>
                      <Label>⛔️ card — Notion callout color → CARD_STYLES key (6 options)</Label>
                      <div className="flex flex-col gap-2 mt-2">
                        {[
                          { cardStyle: 'default',  notionColors: 'default (no color)',  note: 'Always-white bg, ink text, light shadow' },
                          { cardStyle: 'inverse',  notionColors: 'gray',                note: 'Navy bg (light) / parchment bg (dark), dark shadow' },
                          { cardStyle: 'solid',    notionColors: 'brown, green',        note: 'Parchment bg (light) / navy bg (dark), medium shadow' },
                          { cardStyle: 'outline',  notionColors: 'red, pink',           note: 'Transparent bg, border only, no shadow' },
                          { cardStyle: 'elevated', notionColors: 'orange, yellow',      note: 'Always-white bg, stronger shadow' },
                          { cardStyle: 'gradient', notionColors: 'blue, purple',        note: 'Dual-theme gradient bg (dark: blue-purple / light: pastel)' },
                        ].map(({ cardStyle, notionColors, note }) => (
                          <div key={cardStyle} className="grid sm:grid-cols-[7rem_11rem_1fr] gap-3 items-center px-4 py-3 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                            <code className="t-caption font-mono font-semibold" style={{ color: 'var(--brand)' }}>{cardStyle}</code>
                            <p className="t-caption font-mono" style={{ color: 'var(--fg-muted)' }}>{notionColors}</p>
                            <p className="t-caption" style={{ color: 'var(--fg-muted)' }}>{note}</p>
                          </div>
                        ))}
                      </div>
                      <p className="t-caption mt-3" style={{ color: 'var(--fg-muted)' }}>
                        Full visual previews of all 5 card styles → Section 07 Card Styles.
                      </p>
                    </div>

                  </div>
                </div>

                {/* ════ SIZES ════ */}
                <div>
                  <p className="t-caption font-mono font-bold tracking-widest mb-6" style={{ color: 'var(--brand)' }}>SIZES — applies to ⛔️ card type only · auto-selected based on child image presence</p>

                  <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap gap-4">
                      {[
                        { size: 'l', radius: 'rounded-[24px]', imgH: 156, condition: 'has child image block', showBtn: true,  showDesc: true  },
                        { size: 'm', radius: 'rounded-[20px]', imgH: null,  condition: 'no image',             showBtn: false, showDesc: false },
                      ].map(({ size, radius, imgH, condition, showBtn, showDesc }) => (
                        <div key={size} className={`flex flex-col overflow-hidden ${radius} shrink-0`}
                          style={{ width: 220, background: 'var(--surface-inverse)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                          {imgH && (
                            <div className="w-full flex items-center justify-center t-caption" style={{ height: imgH, background: 'var(--surface)', color: 'var(--fg-muted)' }}>
                              image · 312px tall
                            </div>
                          )}
                          <div className="flex flex-col gap-3 px-5 pt-4 pb-6">
                            <div>
                              <code className="t-caption font-mono font-bold" style={{ color: 'var(--brand)' }}>size={size}</code>
                              <p className="t-caption mt-0.5" style={{ color: 'color-mix(in srgb, var(--color-ink) 55%, transparent)' }}>{condition}</p>
                            </div>
                            <p className="t-body3 font-semibold leading-snug" style={{ color: 'var(--color-ink)' }}>Project title</p>
                            {showDesc && <p className="t-body3" style={{ color: 'color-mix(in srgb, var(--color-ink) 65%, transparent)' }}>Desc visible at l+</p>}
                            {showBtn && (
                              <span className="inline-flex items-center justify-center px-4 py-2 rounded-full t-btn1 font-semibold border-2 text-xs"
                                style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}>Know more</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>What changes between sizes</Label>
                      {[
                        { prop: 'radius',    l: 'rounded-[24px]',  m: 'rounded-[20px]' },
                        { prop: 'imgHeight', l: '312px',           m: '— (no image)' },
                        { prop: 'titleCls',  l: 't-h4',            m: 't-h5' },
                        { prop: 'showDesc',  l: 'true',            m: 'false' },
                        { prop: 'showBtn',   l: 'true',            m: 'false' },
                        { prop: 'showTags',  l: 'false',           m: 'true' },
                      ].map(({ prop, l, m }) => (
                        <div key={prop} className="grid grid-cols-[6rem_1fr_1fr] gap-3 items-center px-4 py-2 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                          <code className="t-caption font-mono font-semibold" style={{ color: 'var(--brand)' }}>{prop}</code>
                          <p className="t-caption font-mono" style={{ color: 'var(--fg-muted)' }}>l → {l}</p>
                          <p className="t-caption font-mono" style={{ color: 'var(--fg-muted)' }}>m → {m}</p>
                        </div>
                      ))}
                    </div>
                    <p className="t-caption" style={{ color: 'var(--fg-muted)' }}>
                      Full size range (xl/l/m/s/xs) and all CARD_SIZES props → Section 06 Card Sizes.
                    </p>
                  </div>
                </div>

              </div>
            </Section>

            {/* ══════════════════════════════════════════════
                15. TABLES
            ══════════════════════════════════════════════ */}
            <Section id="tables" title="Tables" subtitle="15 — ui-table Classes">
              <div className="flex flex-col gap-8">
                <div>
                  <Label>.ui-table — with column header</Label>
                  <div className="ui-table-wrap">
                    <table className="ui-table">
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>Dark theme</th>
                          <th>Light theme</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td>--fg</td><td>#ffffff</td><td>#313138</td></tr>
                        <tr><td>--bg-solid</td><td>#161b2a</td><td>#f5f4f0</td></tr>
                        <tr><td>--brand</td><td>#4839ca</td><td>#4839ca</td></tr>
                        <tr><td>--border</td><td>rgba(255,255,255,0.10)</td><td>rgba(25,34,61,0.10)</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <Label>.ui-table.ui-table--row-header — first column bolded + surface bg</Label>
                  <div className="ui-table-wrap">
                    <table className="ui-table ui-table--row-header">
                      <tbody>
                        <tr><td>t-display</td><td>48→84px</td><td>Fluid via clamp()</td></tr>
                        <tr><td>t-h1</td><td>36→72px</td><td>Fluid via clamp()</td></tr>
                        <tr><td>t-body2</td><td>18px</td><td>Fixed</td></tr>
                        <tr><td>t-caption</td><td>12px</td><td>Fixed</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Section>

            {/* ══════════════════════════════════════════════
                16. CARD HOVER INTERACTIONS
            ══════════════════════════════════════════════ */}
            <Section id="card-interactions" title="Card Hover Interactions" subtitle="16 — Option H Spring Stroke">
              <div className="flex flex-col gap-8">

                <div>
                  <p className="t-caption font-mono font-bold tracking-widest mb-4" style={{ color: 'var(--brand)' }}>PATTERN — STROKE_RING</p>
                  <p className="t-body3 text-fg-muted mb-6" style={{ lineHeight: 1.7 }}>
                    Stroke ring lives <strong>inside</strong> the card div as a direct child — same parent as the background,
                    so <code className="font-mono text-xs px-1 py-0.5 rounded" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>borderRadius: inherit</code> always matches perfectly.
                    Spring: <code className="font-mono text-xs px-1 py-0.5 rounded" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>stiffness 160 · damping 24</code>.
                    Resting opacity 0.2 → hover 0.7.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-5">
                    <StrokeDemoCard label="NumberedCard — Beyond the Work">
                      <p className="t-caption tabular-nums font-bold" style={{ color: 'var(--color-coral)', letterSpacing: '0.08em', margin: '0 0 12px' }}>01</p>
                      <p className="t-h5 text-fg" style={{ margin: '0 0 8px' }}>I keep almost starting a business.</p>
                      <p className="t-body2 text-fg-muted" style={{ margin: 0 }}>A 3D print farm. An import operation. None of these are random.</p>
                    </StrokeDemoCard>
                    <StrokeDemoCard label="NumberedCard — What I'm Thinking About">
                      <p className="t-caption tabular-nums font-bold" style={{ color: 'var(--color-coral)', letterSpacing: '0.08em', margin: '0 0 12px' }}>02</p>
                      <p className="t-h5 text-fg" style={{ margin: '0 0 8px' }}>Can designers own strategy?</p>
                      <p className="t-body2 text-fg-muted" style={{ margin: 0 }}>A short description of the thought or interest lives here, two to three lines.</p>
                    </StrokeDemoCard>
                    <WritingDemoCard />
                  </div>
                </div>

                <div>
                  <p className="t-caption font-mono font-bold tracking-widest mb-3" style={{ color: 'var(--brand)' }}>CODE REFERENCE</p>
                  <pre className="t-caption font-mono rounded-xl p-5 overflow-x-auto" style={{ background: 'var(--surface)', border: '1px solid var(--border)', lineHeight: 1.7, color: 'var(--fg-muted)' }}>{`const STROKE_RING = {
  position: 'absolute', inset: 0, borderRadius: 'inherit',
  border: '1px solid color-mix(in srgb, var(--fg) 50%, transparent)',
  pointerEvents: 'none',
};

function Card() {
  const strokeOpacity = useSpring(0.2, { stiffness: 160, damping: 24 });
  return (
    <div
      style={{ position: 'relative', borderRadius: 16, background: 'var(--surface)' }}
      onMouseEnter={() => strokeOpacity.set(0.7)}
      onMouseLeave={() => strokeOpacity.set(0.2)}
    >
      <m.div style={{ ...STROKE_RING, opacity: strokeOpacity }} />
      {/* content */}
    </div>
  );
}`}</pre>
                </div>

                <div>
                  <p className="t-caption font-mono font-bold tracking-widest mb-3" style={{ color: 'var(--brand)' }}>OTHER OPTIONS — /beyond-demo</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { option: 'F', name: 'Glass Glare', desc: 'Perimeter-locked blur blob, parallax at 40%, radial offset keeps center outside card. Most premium.' },
                      { option: 'G', name: 'Border Sweep', desc: 'Conic-gradient ring sweeps clockwise once on hover entry. No fill, no blob.' },
                      { option: 'H', name: 'Spring Stroke ✓ LIVE', desc: 'Spring opacity on border ring. Theme-adaptive. Used on NumberedCard (Beyond + Thinking) and WritingCard.' },
                    ].map(({ option, name, desc }) => (
                      <div key={option} className="grid sm:grid-cols-[4rem_10rem_1fr] gap-3 items-start px-4 py-3 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                        <code className="t-caption font-mono font-semibold" style={{ color: 'var(--brand)' }}>Option {option}</code>
                        <p className="t-caption font-semibold text-fg" style={{ margin: 0 }}>{name}</p>
                        <p className="t-caption text-fg-muted" style={{ margin: 0, lineHeight: 1.6 }}>{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </Section>

            {/* ── Reactions ── */}
            <Section id="reactions" title="Article Reactions" subtitle="Interactions">
              <div className="flex flex-col gap-10">

                <div>
                  <Label>Live component — shared counts via Vercel KV (slug: style-guide-demo)</Label>
                  <p className="t-caption text-fg-muted mb-4">Bar (pill strip) above, card grid below. Click any reaction to test selection, swap, and deselect.</p>
                  <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '0 24px', overflow: 'hidden' }}>
                    <ArticleReactions slug="style-guide-demo" />
                  </div>
                </div>

                <div>
                  <Label>Responsive behaviour</Label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl" style={{ border: '1px solid var(--border)' }}>
                      <p className="t-caption font-semibold text-fg mb-2">Desktop (≥ 768px)</p>
                      <p className="t-caption text-fg-muted leading-relaxed">Bar pills show emoji + label + count. Cards render 5 columns.</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ border: '1px solid var(--border)' }}>
                      <p className="t-caption font-semibold text-fg mb-2">Mobile (&lt; 768px)</p>
                      <p className="t-caption text-fg-muted leading-relaxed">Bar pills show emoji + count only (label hidden via hidden md:inline). Cards collapse to 3 columns.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>States</Label>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Default', desc: 'No reaction selected. All pills and cards show with muted border and surface background.' },
                      { label: 'Selected', desc: 'One reaction active. Brand-coloured border + muted brand fill. Label and count turn brand colour.' },
                      { label: 'Loading', desc: 'Skeleton pills (bar) and skeleton cards pulse with animate-pulse until API responds.' },
                    ].map(({ label, desc }) => (
                      <div key={label} className="p-4 rounded-xl" style={{ border: '1px solid var(--border)' }}>
                        <p className="t-caption font-semibold text-fg mb-2">{label}</p>
                        <p className="t-caption text-fg-muted leading-relaxed">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </Section>

            {/* ── Footer ── */}
            <div className="py-12 border-t border-theme">
              <p className="t-caption text-fg-muted font-mono">thatguyabhishek · style guide · dev only</p>
            </div>

          </div>{/* /content */}
        </div>{/* /flex */}
      </div>{/* /container */}
    </main>
  );
}
