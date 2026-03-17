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
 * 3  split      — 30/70 layout: first heading left, content right
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
  /* 3 — split  (30 : 70)
   * First heading block → sticky left label
   * Remaining blocks    → right content column            */
  {
    wrap: {
      borderTop:    '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
    },
    inner:    {},
    textClr:  'var(--fg)',
    mutedClr: 'var(--fg-muted)',
    split:    true,
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

  /* ── Split layout ── */
  if (s.split) {
    const headingTypes = new Set(['heading_1', 'heading_2', 'heading_3']);
    const firstHeadingIdx = blocks.findIndex((b) => headingTypes.has(b.type));
    const labelBlock  = firstHeadingIdx !== -1 ? blocks[firstHeadingIdx] : null;
    const bodyBlocks  = labelBlock
      ? [...blocks.slice(0, firstHeadingIdx), ...blocks.slice(firstHeadingIdx + 1)]
      : blocks;

    /* Extract plain text from heading rich_text */
    const headingText = labelBlock
      ? (labelBlock[labelBlock.type]?.rich_text ?? []).map((t) => t.plain_text).join('')
      : null;

    return (
      <section style={{ color: s.textClr, ...s.wrap }}>
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Left — 30% label */}
            <div className="md:w-[30%] shrink-0">
              <div className="md:sticky md:top-28">
                {headingText && (
                  <p
                    className="t-h4 font-bold leading-snug"
                    style={{ color: s.textClr }}
                  >
                    {headingText}
                  </p>
                )}
                {/* Decorative rule under the label */}
                <div
                  className="mt-4 h-px w-8"
                  style={{ background: '#4839ca' }}
                />
              </div>
            </div>

            {/* Right — 70% content */}
            <div className="md:flex-1 flex flex-col gap-5">
              <RenderBlocks
                blocks={bodyBlocks}
                childrenMap={childrenMap}
                projects={projects}
                skipDatabase
                skipDivider
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── Standard layout ── */
  return (
    <section style={{ color: s.textClr, position: s.blob ? 'relative' : undefined, overflow: s.blob ? 'hidden' : undefined, ...s.wrap }}>
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
