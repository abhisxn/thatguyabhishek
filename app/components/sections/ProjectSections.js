import { RenderBlocks } from './NotionBlocks';

/* ─────────────────────────────────────────────────────────────
 * SECTION STYLES
 *
 * 5 visual treatments applied to sections split at Notion dividers.
 * Edit here to change the look of all project pages at once.
 *
 * 0  plain      — transparent, standard layout
 * 1  surface    — var(--surface) band, subtle border top/bottom
 * 2  dark       — deep navy bg, inverted text
 * 3  accent     — brand-purple left-border strip + tinted bg
 * 4  spotlight  — surface + radial purple gradient overlay
 * ──────────────────────────────────────────────────────────── */
export const SECTION_STYLES = [
  /* 0 — plain */
  {
    wrap:     {},
    inner:    {},
    textClr:  'var(--fg)',
    mutedClr: 'var(--fg-muted)',
  },
  /* 1 — surface */
  {
    wrap: {
      background:   'var(--surface)',
      borderTop:    '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
    },
    inner:    {},
    textClr:  'var(--fg)',
    mutedClr: 'var(--fg-muted)',
  },
  /* 2 — dark */
  {
    wrap:     { background: '#0b1f3a' },
    inner:    {},
    textClr:  '#ffffff',
    mutedClr: 'rgba(255,255,255,0.6)',
  },
  /* 3 — accent */
  {
    wrap: {
      background:   'color-mix(in srgb, #4839ca 6%, var(--bg))',
      borderTop:    '1px solid color-mix(in srgb, #4839ca 20%, transparent)',
      borderBottom: '1px solid color-mix(in srgb, #4839ca 20%, transparent)',
      borderLeft:   '4px solid #4839ca',
    },
    inner:    {},
    textClr:  'var(--fg)',
    mutedClr: 'var(--fg-muted)',
  },
  /* 4 — spotlight */
  {
    wrap: {
      background:   'var(--surface)',
      borderTop:    '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      position:     'relative',
      overflow:     'hidden',
    },
    inner:    { position: 'relative', zIndex: 1 },
    textClr:  'var(--fg)',
    mutedClr: 'var(--fg-muted)',
    blob:     true,
  },
];

/* ── Split blocks at dividers into section groups ────────── */
export function splitSections(blocks) {
  const sections = [];
  let current = [];
  for (const b of blocks) {
    if (b.type === 'divider') {
      if (current.length) sections.push(current);
      current = [];
    } else {
      current.push(b);
    }
  }
  if (current.length) sections.push(current);
  return sections;
}

/* ── Single section with visual style applied ────────────── */
export function Section({ blocks, childrenMap, styleIndex, projects }) {
  const s = SECTION_STYLES[styleIndex % SECTION_STYLES.length];
  return (
    <section style={{ color: s.textClr, ...s.wrap }}>
      {s.blob && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 60% 80% at 50% 50%, color-mix(in srgb, #4839ca 8%, transparent) 0%, transparent 70%)',
          }}
        />
      )}
      <div
        className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16"
        style={s.inner}
      >
        <div className="flex flex-col gap-5">
          <RenderBlocks
            blocks={blocks}
            childrenMap={childrenMap}
            projects={projects}
            skipDatabase
            skipDivider
          />
        </div>
      </div>
    </section>
  );
}

/* ── Convenience: render all sections from a block list ──── */
export function SectionedBlocks({ blocks, childrenMap, projects }) {
  const sections = splitSections(blocks);
  if (!sections.length) return null;
  return (
    <>
      {sections.map((sectionBlocks, i) => (
        <Section
          key={i}
          blocks={sectionBlocks}
          childrenMap={childrenMap}
          projects={projects}
          styleIndex={i}
        />
      ))}
    </>
  );
}
