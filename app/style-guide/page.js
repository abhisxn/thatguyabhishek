import GradientBackground from '../components/layout/GradientBackground';
import { SECTION_STYLES } from '../components/sections/ProjectSections';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Tag, { TAG_PALETTE, tagStyle } from '../components/ui/Tag';
import { CARD_SIZES, CARD_STYLES } from '../components/ui/card-utils';

/* ── Section wrapper ─────────────────────────────────────────── */
function Section({ title, subtitle, children }) {
  return (
    <section className="py-12 border-t border-theme">
      <div className="mb-8">
        <p className="t-overline text-fg-muted mb-1">{subtitle}</p>
        <h2 className="t-h4 font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Label({ children }) {
  return (
    <p className="t-caption text-fg-muted mb-2 font-mono">{children}</p>
  );
}

/* ── Colour swatch ───────────────────────────────────────────── */
function Swatch({ label, value, border }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-14 rounded-xl"
        style={{ background: value, border: border || '1px solid var(--border)' }}
      />
      <p className="t-caption font-mono" style={{ color: 'var(--fg)' }}>{label}</p>
      <p className="t-caption font-mono opacity-50" style={{ color: 'var(--fg-muted)' }}>{value}</p>
    </div>
  );
}

/* ── Placeholder cover image (data URI gradient) ─────────────── */
const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%234839ca"/><stop offset="1" stop-color="%230b1f3a"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><text x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" fill="rgba(255,255,255,0.3)" font-size="18" font-family="sans-serif">cover image</text></svg>';

const SECTION_STYLE_NAMES = ['plain', 'surface', 'dark', 'split', 'spotlight'];

export default function StyleGuide() {
  return (
    <>
      <GradientBackground />
      <main className="relative min-h-screen" style={{ color: 'var(--fg)', zIndex: 1 }}>
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">

          {/* ── Header ── */}
          <div className="pt-28 pb-4">
            <p className="t-overline text-fg-muted mb-2">Dev reference · not linked in nav</p>
            <h1 className="t-h2 mb-3">Component Style Guide</h1>
            <p className="t-body1 text-fg-muted" style={{ maxWidth: '55ch' }}>
              All visual components and their variants. Toggle light/dark in the navbar to check both themes.
            </p>
          </div>

          {/* ══════════════════════════════════════════════
              1. COLOURS
          ══════════════════════════════════════════════ */}
          <Section title="Colours" subtitle="01 — Design Tokens">

            <div className="flex flex-col gap-8">

              <div>
                <Label>Brand</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  <Swatch label="--color-brand"        value="#4839ca" />
                  <Swatch label="--color-coral"        value="#ea8575" />
                  <Swatch label="--color-navy"         value="#19223d" />
                  <Swatch label="--color-purple-card"  value="#4a2d7f" />
                  <Swatch label="--color-dark-blue"    value="#0b2261" />
                  <Swatch label="--color-dark-teal"    value="#163846" />
                  <Swatch label="--color-lavender"     value="#e5d7e8" border="1px solid rgba(0,0,0,0.1)" />
                </div>
              </div>

              <div>
                <Label>Theme variables (changes with dark/light toggle)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <Swatch label="--fg"       value="var(--fg)"       border="1px solid var(--border)" />
                  <Swatch label="--fg-muted" value="var(--fg-muted)" border="1px solid var(--border)" />
                  <Swatch label="--surface"  value="var(--surface)"  border="1px solid var(--border)" />
                  <Swatch label="--border"   value="var(--border)"   border="1px solid var(--border)" />
                  <Swatch label="--bg-solid" value="var(--bg-solid)" border="1px solid var(--border)" />
                </div>
              </div>

              <div>
                <Label>RichText / Notion annotation colours</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'gray',   color: 'var(--fg-muted)' },
                    { name: 'brown',  color: '#9e6b4f' },
                    { name: 'orange', color: '#ea8575' },
                    { name: 'yellow', color: '#cb912f' },
                    { name: 'green',  color: '#448361' },
                    { name: 'blue',   color: '#2e7dae' },
                    { name: 'purple', color: '#4839ca' },
                    { name: 'pink',   color: '#e255a1' },
                    { name: 'red',    color: '#c4554d' },
                  ].map(({ name, color }) => (
                    <span key={name} className="t-body2 font-semibold" style={{ color }}>{name}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    { name: 'gray_bg',   bg: 'rgba(206,205,202,0.25)' },
                    { name: 'brown_bg',  bg: 'rgba(158,107,79,0.15)' },
                    { name: 'orange_bg', bg: 'rgba(234,133,117,0.15)' },
                    { name: 'yellow_bg', bg: 'rgba(203,145,47,0.15)' },
                    { name: 'green_bg',  bg: 'rgba(68,131,97,0.15)' },
                    { name: 'blue_bg',   bg: 'rgba(46,125,174,0.15)' },
                    { name: 'purple_bg', bg: 'rgba(72,57,202,0.15)' },
                    { name: 'pink_bg',   bg: 'rgba(226,85,161,0.15)' },
                    { name: 'red_bg',    bg: 'rgba(196,85,77,0.15)' },
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
              2. TYPOGRAPHY
          ══════════════════════════════════════════════ */}
          <Section title="Typography" subtitle="02 — Type Scale">
            <div className="flex flex-col gap-6">
              {[
                { cls: 't-h1',      label: 't-h1 · 72px · Bold',      text: 'Design that moves' },
                { cls: 't-h2',      label: 't-h2 · 56px · Bold',      text: 'Design that moves' },
                { cls: 't-h3',      label: 't-h3 · 48px · Bold',      text: 'Design that moves' },
                { cls: 't-h4',      label: 't-h4 · 32px · Semibold',  text: 'Design that moves people' },
                { cls: 't-h5',      label: 't-h5 · 28px · Semibold',  text: 'Design that moves people forward' },
                { cls: 't-body1',   label: 't-body1 · 20px · Normal', text: 'I design systems that scale, interfaces that convert, and experiences that stick.' },
                { cls: 't-body2',   label: 't-body2 · 16px · Medium', text: 'I design systems that scale, interfaces that convert, and experiences that stick.' },
                { cls: 't-body3',   label: 't-body3 · 14px · Normal', text: 'I design systems that scale, interfaces that convert, and experiences that stick.' },
                { cls: 't-caption', label: 't-caption · 12px · Bold', text: 'CAPTION LABEL OVERLINE' },
                { cls: 't-overline',label: 't-overline · 12px · Tracked', text: 'SECTION OVERLINE' },
              ].map(({ cls, label, text }) => (
                <div key={cls} className="flex flex-col gap-0.5">
                  <p className="t-caption font-mono opacity-50">{label}</p>
                  <p className={cls}>{text}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* ══════════════════════════════════════════════
              3. BUTTONS
          ══════════════════════════════════════════════ */}
          <Section title="Buttons" subtitle="03 — Button Variants">
            <div className="flex flex-col gap-10">

              <div>
                <Label>variant — lg size</Label>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="outline">btn-outline</Button>
                  <Button variant="filled">btn-filled</Button>
                  <Button variant="outline-brand">btn-outline-brand</Button>
                  <Button variant="filled-brand">btn-filled-brand</Button>
                </div>
              </div>

              <div>
                <Label>variant — sm size</Label>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="outline"       size="sm">btn-outline</Button>
                  <Button variant="filled"        size="sm">btn-filled</Button>
                  <Button variant="outline-brand" size="sm">btn-outline-brand</Button>
                  <Button variant="filled-brand"  size="sm">btn-filled-brand</Button>
                </div>
              </div>

              <div>
                <Label>Footer card buttons (white bg context)</Label>
                <div
                  className="flex flex-wrap gap-4 items-center p-8 rounded-2xl"
                  style={{ background: '#4a2d7f' }}
                >
                  <a href="#" className="btn-card-purple">btn-card-purple</a>
                </div>
                <div
                  className="flex flex-wrap gap-4 items-center p-8 rounded-2xl mt-3 bg-white"
                >
                  <a href="#" className="btn-card-linkedin">btn-card-linkedin</a>
                </div>
              </div>

            </div>
          </Section>

          {/* ══════════════════════════════════════════════
              4. BADGES
          ══════════════════════════════════════════════ */}
          <Section title="Badges" subtitle="04 — Status Indicators">
            <div className="flex flex-col gap-6">
              <div>
                <Label>with dot (default)</Label>
                <div className="flex flex-wrap gap-3">
                  {['default','success','warning','error','info','brand'].map((v) => (
                    <Badge key={v} variant={v}>{v}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>dot=false</Label>
                <div className="flex flex-wrap gap-3">
                  {['default','success','warning','error','info','brand'].map((v) => (
                    <Badge key={v} variant={v} dot={false}>{v}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* ══════════════════════════════════════════════
              5. TAGS
          ══════════════════════════════════════════════ */}
          <Section title="Tags" subtitle="05 — Tag Palette">
            <Label>TAG_PALETTE — 9 colours, assigned by label hash</Label>
            <div className="flex flex-wrap gap-2">
              {['UX Design','Product Design','Microsoft','AI','Research','Agentic AI','Copilot','Case Studies','Strategy'].map((label) => (
                <Tag key={label} label={label} />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {TAG_PALETTE.map((p, i) => (
                <span
                  key={i}
                  className="ui-tag"
                  style={{ background: p.bg, color: p.color, border: `1px solid ${p.color}` }}
                >
                  Palette {i}
                </span>
              ))}
            </div>
          </Section>

          {/* ══════════════════════════════════════════════
              6. CARD SIZES
          ══════════════════════════════════════════════ */}
          <Section title="Card Sizes" subtitle="06 — All 5 Sizes (default style)">
            <div className="flex flex-col gap-8">
              {Object.keys(CARD_SIZES).map((sz) => (
                <div key={sz}>
                  <Label>size=&quot;{sz}&quot; — {CARD_SIZES[sz].imgHeight ?? 'no image'}</Label>
                  <div className="max-w-xs">
                    <Card
                      size={sz}
                      cardStyle="default"
                      title="Excel Charting: AI Recommendations"
                      desc="Teaching Excel to be your personal design critic."
                      tags={['UX', 'AI', 'Microsoft']}
                      img={PLACEHOLDER_IMG}
                      href="#"
                      label="Know more"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ══════════════════════════════════════════════
              7. CARD STYLES
          ══════════════════════════════════════════════ */}
          <Section title="Card Styles" subtitle="07 — All 5 Visual Styles (size=l)">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.keys(CARD_STYLES).map((cs) => (
                <div key={cs}>
                  <Label>cardStyle=&quot;{cs}&quot;</Label>
                  <Card
                    size="l"
                    cardStyle={cs}
                    title="Excel Charting: AI Recommendations"
                    desc="Teaching Excel to be your personal design critic."
                    tags={['UX', 'AI']}
                    img={PLACEHOLDER_IMG}
                    href="#"
                    label="Know more"
                  />
                </div>
              ))}
            </div>
          </Section>

          {/* ══════════════════════════════════════════════
              8. FORM ELEMENTS
          ══════════════════════════════════════════════ */}
          <Section title="Form Elements" subtitle="08 — Inputs &amp; Controls">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
              <div>
                <Label>.ui-input — text</Label>
                <input className="ui-input" type="text" placeholder="Your name" />
              </div>
              <div>
                <Label>.ui-input — email</Label>
                <input className="ui-input" type="email" placeholder="your@email.com" />
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
              <div>
                <Label>.ui-input — focused state (click to see)</Label>
                <input className="ui-input" type="text" defaultValue="Click me to focus" />
              </div>
            </div>
          </Section>

          {/* ══════════════════════════════════════════════
              9. SURFACES
          ══════════════════════════════════════════════ */}
          <Section title="Surfaces" subtitle="09 — Theme-aware Card Wrappers">
            <div className="flex flex-wrap gap-5">
              {['sm','md','lg'].map((sz) => (
                <div
                  key={sz}
                  className={`ui-surface ui-surface--${sz} p-6 flex flex-col gap-1`}
                  style={{ minWidth: 180 }}
                >
                  <p className="t-body2 font-semibold">.ui-surface--{sz}</p>
                  <p className="t-caption text-fg-muted">border-radius varies</p>
                </div>
              ))}
            </div>
          </Section>

        </div>

        {/* ══════════════════════════════════════════════
            10. PROJECT SECTION STYLES  (full-width)
        ══════════════════════════════════════════════ */}
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="py-12 border-t border-theme">
            <p className="t-overline text-fg-muted mb-1">10 — Project Page Sections</p>
            <h2 className="t-h4 font-bold mb-2">Section Styles</h2>
            <p className="t-body2 text-fg-muted mb-2">
              Triggered by <code className="px-1.5 py-0.5 rounded text-sm font-mono" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>---</code> dividers in Notion. Cycles 0 → 4 → 0.
              Edit in <code className="px-1.5 py-0.5 rounded text-sm font-mono" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>app/components/sections/ProjectSections.js</code>
            </p>
          </div>
        </div>

        {SECTION_STYLES.map((s, i) => (
          <section
            key={i}
            style={{
              color: s.textClr,
              position: s.blob ? 'relative' : undefined,
              overflow: s.blob ? 'hidden' : undefined,
              ...s.wrap,
            }}
          >
            {s.blob && (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: 'radial-gradient(ellipse 60% 80% at 50% 50%, color-mix(in srgb, #4839ca 8%, transparent) 0%, transparent 70%)',
                }}
              />
            )}
            <div
              className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-10"
              style={s.inner}
            >
              {/* Label row */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full t-caption font-bold"
                  style={{
                    background: s.textClr === '#ffffff' ? 'rgba(255,255,255,0.15)' : 'var(--border)',
                    color: s.textClr,
                  }}
                >
                  {i}
                </span>
                <code
                  className="t-caption font-mono font-semibold"
                  style={{ color: s.mutedClr }}
                >
                  SECTION_STYLES[{i}] — {SECTION_STYLE_NAMES[i]}
                </code>
              </div>

              {/* Sample content */}
              {s.split ? (
                <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                  <div className="md:w-[30%] shrink-0">
                    <p className="t-h4 font-bold leading-snug" style={{ color: s.textClr }}>Section Label</p>
                    <div className="mt-4 h-px w-8" style={{ background: '#4839ca' }} />
                  </div>
                  <div className="md:flex-1 flex flex-col gap-4">
                    <p className="t-body2 leading-relaxed" style={{ color: s.mutedClr }}>
                      Body text in the right column. The first heading in this Notion section becomes the sticky left label. Remaining blocks render here.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Research', 'UX Design', 'Prototyping'].map((t) => (
                        <span key={t} className="px-3 py-1 rounded-full t-caption font-medium" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: s.mutedClr }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="t-h4 font-bold" style={{ color: s.textClr }}>Section heading</p>
                  <p className="t-body2 leading-relaxed" style={{ color: s.mutedClr }}>
                    Body text inside this section style. Background, borders, and text colour all come from the section wrapper.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Research', 'UX Design', 'Prototyping'].map((t) => (
                      <span key={t} className="px-3 py-1 rounded-full t-caption font-medium" style={{ background: s.textClr === '#ffffff' ? 'rgba(255,255,255,0.12)' : 'var(--surface)', border: `1px solid ${s.textClr === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'var(--border)'}`, color: s.mutedClr }}>{t}</span>
                    ))}
                  </div>
                  <div className="h-20 rounded-xl flex items-center justify-center t-caption font-medium" style={{ background: s.textClr === '#ffffff' ? 'rgba(255,255,255,0.08)' : 'var(--surface)', border: `1px solid ${s.textClr === '#ffffff' ? 'rgba(255,255,255,0.12)' : 'var(--border)'}`, color: s.mutedClr }}>
                    image / embed placeholder
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}

        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-12 border-t border-theme">
          <p className="t-caption text-fg-muted font-mono">thatguyabhishek · style guide · dev only</p>
        </div>

      </main>
    </>
  );
}
