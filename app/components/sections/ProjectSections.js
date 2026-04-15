import { RenderBlocks } from '../blocks/NotionBlocks';
import RichText from '../blocks/RichText';
import { SECTION_STYLES, styleIndexFromColor } from '@/lib/section-styles';
import FadeSection from '../ui/FadeSection';

/* ─────────────────────────────────────────────────────────────
 * SECTION LAYOUT SYSTEM
 *
 * Style is driven by heading_1 COLOR in Notion — see lib/section-styles.js
 *
 * Two authoring patterns both produce a 30/70 split section:
 *   1. Bare heading_1 as the first top-level block
 *   2. column_list whose first column starts with a heading_1
 *      (common for project pages — heading + subtext on left,
 *       content columns on right)
 *
 * Layout rules:
 *   • Section 0 (intro — before any heading) — always full-width
 *   • All other sections — 30/70 split with sticky left label
 *   • Dividers in Notion → hard section break (full-width after)
 *   • column_list with no H1 → equal-column grid (in NotionBlocks)
 * ──────────────────────────────────────────────────────────── */

/* ── Detect split layout and extract its parts ───────────────
 * Returns a descriptor object for both authoring patterns,
 * or null when the section should be full-width.             */
function getSplitInfo(blocks, childrenMap) {
  const first = blocks[0];
  if (!first) return null;

  /* Pattern 1 — bare heading_1 */
  if (first.type === 'heading_1') {
    return {
      headingRichText: first.heading_1?.rich_text ?? [],
      subtitleBlocks:  [],
      bodyColumns:     [],
      bodyBlocks:      blocks.slice(1),
    };
  }

  /* Pattern 2 — column_list with heading_1 in first column */
  if (first.type === 'column_list') {
    const columns        = childrenMap?.[first.id] ?? [];
    const firstColBlocks = childrenMap?.[columns[0]?.id] ?? [];
    const h1Idx          = firstColBlocks.findIndex((b) => b.type === 'heading_1');
    if (h1Idx !== -1) {
      return {
        headingRichText: firstColBlocks[h1Idx].heading_1?.rich_text ?? [],
        subtitleBlocks:  firstColBlocks.slice(h1Idx + 1), // subtext / captions below H1 in col 1
        bodyColumns:     columns.slice(1),                 // remaining columns → right panel
        bodyBlocks:      blocks.slice(1),                  // blocks after the column_list → right panel
      };
    }
  }

  return null;
}

/* ── Split blocks at dividers OR heading boundaries ──────────
 * Both top-level heading_1 and column_list-with-H1 trigger a
 * new section so the section wrapper gets the right style.   */
export function splitSections(blocks, childrenMap) {
  const sections = [];
  let current = [];
  let pendingSplit = 'start';

  for (const b of blocks) {
    if (b.type === 'divider') {
      if (current.length) sections.push({ blocks: current, splitBy: pendingSplit });
      current = [];
      pendingSplit = 'divider';

    } else if (b.type === 'heading_1' && current.length) {
      sections.push({ blocks: current, splitBy: pendingSplit });
      current = [b];
      pendingSplit = 'heading';

    } else if (b.type === 'column_list' && current.length) {
      /* Split if the column_list has a heading_1 anywhere in its first column */
      const columns        = childrenMap?.[b.id] ?? [];
      const firstColBlocks = childrenMap?.[columns[0]?.id] ?? [];
      if (firstColBlocks.some((cb) => cb.type === 'heading_1')) {
        sections.push({ blocks: current, splitBy: pendingSplit });
        current = [b];
        pendingSplit = 'heading';
      } else {
        current.push(b);
      }

    } else {
      current.push(b);
    }
  }

  if (current.length) sections.push({ blocks: current, splitBy: pendingSplit });
  return sections;
}

/* ── Derive style index from the section's heading ────────── */
function styleIndexFor(blocks, childrenMap) {
  /* Top-level heading_1 */
  const h1 = blocks.find((b) => b.type === 'heading_1');
  if (h1) return styleIndexFromColor(h1.heading_1?.color);

  /* heading_1 nested inside a column_list */
  const colList = blocks.find((b) => b.type === 'column_list');
  if (colList) {
    const columns        = childrenMap?.[colList.id] ?? [];
    const firstColBlocks = childrenMap?.[columns[0]?.id] ?? [];
    const h1             = firstColBlocks.find((b) => b.type === 'heading_1');
    if (h1) return styleIndexFromColor(h1.heading_1?.color);
  }

  return 0;
}

/* ── Visual divider between sections ──────────────────────── */
function SectionDivider() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
      <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
    </div>
  );
}

/* ── Gradient blob for accent style ────────────────────────── */
function SpotlightBlob() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background:
          'radial-gradient(ellipse 60% 80% at 50% 50%, color-mix(in srgb, var(--brand) 8%, transparent) 0%, transparent 70%)',
      }}
    />
  );
}

/* ── Single section with visual style applied ────────────── */
export function Section({ blocks, childrenMap, styleIndex, projects, isIntro }) {
  const s     = SECTION_STYLES[styleIndex % SECTION_STYLES.length];
  const split = isIntro ? null : getSplitInfo(blocks, childrenMap);

  const wrapStyle = {
    color:       s.textClr,
    '--fg':      s.textClr,
    '--fg-muted': s.mutedClr,
    ...s.wrap,
  };

  /* ── Split layout — 30/70 with sticky left label ── */
  if (split) {
    const { headingRichText, subtitleBlocks, bodyColumns, bodyBlocks } = split;

    return (
      <section style={wrapStyle}>
        {s.name === 'accent' && <SpotlightBlob />}

        <div
          className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16"
          style={s.inner}
        >
          <div className="grid gap-8 lg:gap-16 lg:grid-cols-[30fr_70fr]">

            {/* Left — 30% sticky label + optional subtitle from col 1 */}
            <div className="min-w-0">
              <div className="lg:sticky lg:top-28">
                <p
                  className="t-h4 font-bold leading-snug"
                  style={{ color: s.textClr }}
                >
                  <RichText texts={headingRichText} />
                </p>
                <div className="mt-4 h-px w-8" style={{ background: 'var(--brand)' }} />
                {subtitleBlocks.length > 0 && (
                  <div className="mt-3" style={{ color: s.mutedClr }}>
                    <RenderBlocks
                      blocks={subtitleBlocks}
                      projects={projects}
                      childrenMap={childrenMap}
                      gap="gap-2"
                      compact
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right — 70% content: body columns first, then remaining blocks */}
            <div className="flex flex-col gap-5 min-w-0" style={{ color: s.mutedClr }}>
              {bodyColumns.map((col) => {
                const colBlocks = childrenMap?.[col.id] ?? [];
                return (
                  <RenderBlocks
                    key={col.id}
                    blocks={colBlocks}
                    projects={projects}
                    childrenMap={childrenMap}
                    skipDatabase
                    skipDivider
                    cardCols="grid-cols-1"
                    gap="gap-4"
                  />
                );
              })}
              {bodyBlocks.length > 0 && (
                <RenderBlocks
                  blocks={bodyBlocks}
                  childrenMap={childrenMap}
                  projects={projects}
                  skipDatabase
                  skipDivider
                />
              )}
            </div>

          </div>
        </div>
      </section>
    );
  }

  /* ── Full-width layout (intro or divider-split sections) ── */
  return (
    <section style={wrapStyle}>
      {s.name === 'accent' && <SpotlightBlob />}

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

/* ── Render all sections from a block list ──────────────────── */
export function SectionedBlocks({ blocks, childrenMap, projects }) {
  const sections = splitSections(blocks, childrenMap);
  if (!sections.length) return null;
  return (
    <>
      {sections.map(({ blocks: sectionBlocks }, i) => (
        <FadeSection key={i}>
          {i > 0 && <SectionDivider />}
          <Section
            blocks={sectionBlocks}
            childrenMap={childrenMap}
            projects={projects}
            styleIndex={styleIndexFor(sectionBlocks, childrenMap)}
            isIntro={i === 0 && getSplitInfo(sectionBlocks, childrenMap) === null}
          />
        </FadeSection>
      ))}
    </>
  );
}
