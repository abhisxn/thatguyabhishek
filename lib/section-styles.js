/* ─────────────────────────────────────────────────────────────
 * Section style definitions — single source of truth
 *
 * Shared between ProjectSections.js and any other renderer
 * that needs section-level styling. Kept here to avoid the
 * circular dependency that would arise from importing
 * ProjectSections ↔ NotionBlocks.
 *
 * Style index is driven by the heading_1 COLOR in Notion.
 * See HEADING_COLOR_TO_STYLE below for the full mapping.
 * ──────────────────────────────────────────────────────────── */

export const SECTION_STYLES = [
  /* 0 — default */
  {
    name:     'default',
    wrap:     {},
    inner:    {},
    textClr:  'var(--fg)',
    mutedClr: 'var(--fg-muted)',
  },
  /* 1 — tinted */
  {
    name:  'tinted',
    wrap:  {
      background:   'var(--surface)',
      borderTop:    '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
    },
    inner:    {},
    textClr:  'var(--fg)',
    mutedClr: 'var(--fg-muted)',
  },
  /* 2 — inverse */
  {
    name:     'inverse',
    wrap:     { background: 'var(--bg-inverse)' },
    inner:    {},
    textClr:  'var(--bg-solid)',
    mutedClr: 'color-mix(in srgb, var(--bg-solid) 65%, transparent)',
  },
  /* 3 — accent */
  {
    name:  'accent',
    wrap:  {
      background: 'linear-gradient(135deg, var(--section-accent-gradient-from) 0%, var(--section-accent-gradient-to) 100%)',
      position:   'relative',
      overflow:   'hidden',
    },
    inner:    {},
    textClr:  'var(--fg)',
    mutedClr: 'var(--fg-muted)',
  },
  /* 4 — solid */
  {
    name:     'solid',
    wrap:     {
      background:   'var(--section-solid-bg)',
      borderTop:    '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
    },
    inner:    {},
    textClr:  'var(--section-solid-fg)',
    mutedClr: 'color-mix(in srgb, var(--section-solid-fg) 65%, transparent)',
  },
];

/* ── Notion heading_1 color → style index ─────────────────── */
/*
 *   default (+ any unmapped color)  →  0   default  — transparent
 *   gray                            →  1   tinted   — surface band
 *   blue                            →  2   inverse  — dark inverted bg
 *   purple                          →  3   accent   — gradient bg
 *   brown                           →  4   solid    — editorial solid bg
 */
export const HEADING_COLOR_TO_STYLE = {
  default:                    0,
  gray:              1, gray_background:   1,
  blue:              2, blue_background:   2,
  purple:            3, purple_background: 3,
  brown:             4, brown_background:  4,
};

export function styleIndexFromColor(color) {
  return HEADING_COLOR_TO_STYLE[color ?? 'default'] ?? 0;
}
