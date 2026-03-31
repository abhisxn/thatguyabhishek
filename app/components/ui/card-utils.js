/* ─────────────────────────────────────────────────────────────────────────────
 * Pure (non-client) utilities for the Card component.
 * Kept in a separate file so server components can import them without pulling
 * in the 'use client' Card.js boundary.
 * ──────────────────────────────────────────────────────────────────────────── */

export const CARD_SIZES = {
  xl: {
    radius:    'rounded-[28px]',
    imgHeight: 'h-[400px]',
    hoverPad:  'group-hover:pt-4 group-hover:px-4',
    imgRadius: 'rounded-t-[24px] group-hover:rounded-[24px]',
    titleCls:  't-h3',
    descCls:   't-body1',
    contentGap: 'gap-8 px-7 pt-6 pb-9',
    innerGap:  'gap-4',
    showDesc:  true,
    showBtn:   true,
    showTags:  false,
    showImg:   true,
  },
  l: {
    radius:    'rounded-[24px]',
    imgHeight: 'h-[312px]',
    hoverPad:  'group-hover:pt-3 group-hover:px-3',
    imgRadius: 'rounded-t-[20px] group-hover:rounded-[20px]',
    titleCls:  't-h4',
    descCls:   't-body2',
    contentGap: 'gap-8 px-6 pt-5 pb-8',
    innerGap:  'gap-4',
    showDesc:  true,
    showBtn:   true,
    showTags:  false,
    showImg:   true,
  },
  m: {
    radius:    'rounded-[20px]',
    imgHeight: 'h-[224px]',  /* was 220px (not ×8) → 224 = 8×28 */
    hoverPad:  'group-hover:pt-3 group-hover:px-3',  /* was 2.5 → 10px (not ×4); pt-3 = 12px */
    imgRadius: 'rounded-t-[16px] group-hover:rounded-[16px]',
    titleCls:  't-h5',
    descCls:   't-body2',
    contentGap: 'gap-5 px-5 pt-4 pb-6',
    innerGap:  'gap-3',
    showDesc:  false,
    showBtn:   false,
    showTags:  true,
    showImg:   true,
  },
  s: {
    radius:    'rounded-xl',
    imgHeight: 'h-[152px]',  /* was 150px (not ×8) → 152 = 8×19 */
    hoverPad:  'group-hover:pt-2 group-hover:px-2',
    imgRadius: 'rounded-t-[8px] group-hover:rounded-[8px]',  /* was 10px (not ×4) → 8 = 8×1 */
    titleCls:  'text-base font-semibold leading-tight',
    descCls:   't-body3 line-clamp-3',
    contentGap: 'gap-3 px-3 pt-3 pb-4',
    innerGap:  'gap-2',   /* was 1.5 → 6px (not ×4); gap-2 = 8px */
    showDesc:  false,
    showBtn:   false,
    showTags:  true,
    showImg:   true,
  },
  xs: {
    radius:    'rounded-lg',
    imgHeight: null,
    hoverPad:  null,
    imgRadius: null,
    titleCls:  'text-sm font-semibold leading-snug',
    contentGap: 'gap-2 px-3 py-3',
    innerGap:  'gap-2',  /* was 1.5 → 6px (not ×4); gap-2 = 8px */
    showDesc:  false,
    showBtn:   false,
    showTags:  true,
    showImg:   false,
  },
};

export const CARD_STYLES = {
  // Always white — intentionally theme-invariant (default project cards)
  // Text uses --color-ink (always #313138) since bg is always white.
  default: {
    wrapper:  'bg-[var(--surface-inverse)]',
    shadow:   '0 4px 24px rgba(0,0,0,0.08)',
    titleClr: 'text-[var(--color-ink)]',
    descClr:  'text-[color-mix(in_srgb,var(--color-ink)_70%,transparent)]',
    btn:      'border-[var(--brand)] text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white',
  },
  // Always white, stronger shadow
  elevated: {
    wrapper:  'bg-[var(--surface-inverse)]',
    shadow:   '0 8px 40px rgba(0,0,0,0.16)',
    titleClr: 'text-[var(--color-ink)]',
    descClr:  'text-[color-mix(in_srgb,var(--color-ink)_70%,transparent)]',
    btn:      'border-[var(--brand)] text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white',
  },
  // Theme-aware: transparent bg with strong border  (red / pink in Notion)
  outline: {
    wrapper:  'bg-transparent border border-[var(--border)]',
    shadow:   'none',
    titleClr: 'text-[var(--fg)]',
    descClr:  'text-[color-mix(in_srgb,var(--fg)_60%,transparent)]',
    btn:      'border-[var(--fg)] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg-solid)]',
  },
  // Theme-aware: frosted surface  (no color — used as override/default)
  tinted: {
    wrapper:  'bg-[var(--surface-1)] border border-[var(--border)] backdrop-blur-sm',
    shadow:   'none',
    titleClr: 'text-[var(--fg)]',
    descClr:  'text-[color-mix(in_srgb,var(--fg)_60%,transparent)]',
    btn:      'border-[var(--brand)] text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white',
  },
  // Theme-aware: parchment light / navy dark  (brown + green in Notion)
  solid: {
    wrapper:  'bg-[var(--bg-solid)]',
    shadow:   '0 4px 24px rgba(0,0,0,0.12)',
    titleClr: 'text-[var(--bg-inverse)]',
    descClr:  'text-[color-mix(in_srgb,var(--bg-inverse)_70%,transparent)]',
    btn:      'border-[var(--bg-inverse)] text-[var(--bg-inverse)] hover:bg-[var(--bg-inverse)] hover:text-[var(--bg-solid)]',
  },
  // Theme-aware: navy light / parchment dark  (gray in Notion)
  inverse: {
    wrapper:  'bg-[var(--bg-inverse)]',
    shadow:   '0 4px 24px rgba(0,0,0,0.32)',
    titleClr: 'text-[var(--bg-solid)]',
    descClr:  'text-[color-mix(in_srgb,var(--bg-solid)_70%,transparent)]',
    btn:      'border-[var(--bg-solid)] text-[var(--bg-solid)] hover:bg-[var(--bg-solid)] hover:text-[var(--bg-inverse)]',
  },
  // Dual-theme gradient — dark: blue-purple / light: pink-green pastel  (blue+purple in Notion)
  gradient: {
    wrapper:  '[background:linear-gradient(135deg,var(--gradient-dual-from),var(--gradient-dual-to))]',
    shadow:   '0 4px 24px rgba(0,0,0,0.16)',
    titleClr: 'text-[var(--fg)]',
    descClr:  'text-[color-mix(in_srgb,var(--fg)_70%,transparent)]',
    btn:      'border-[var(--fg)] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg-solid)]',
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
 * CALLOUT EMOJI → TYPE MAP
 *
 * Emoji is the primary signal for how a Notion callout is rendered.
 * No emoji → project/link card (default behavior).
 * Unknown emoji → 'insight' (styled callout, not a navigable card).
 *
 *   💡  insight  — highlighted inline callout with left brand accent
 *   🎯  feature  — large full-width accent block (key result / overview)
 *   💬  quote    — large italic pull-quote
 *   ✏️  note     — subtle muted annotation
 *   📊  feature  — same as 🎯, alias for stats/metrics sections
 *   ⛔️  card     — explicit project / link card (image + title + CTA)
 *   📌  pin      — pinned callout with top brand accent
 *
 * No emoji → 'default' callout (clean body text block, optionally linkable).
 * Unknown emoji → 'insight' (styled content, never a nav card).
 * ──────────────────────────────────────────────────────────────────────────── */
export const CALLOUT_EMOJI_MAP = {
  '💡': 'insight',
  '🎯': 'feature',
  '💬': 'quote',
  '✏️': 'note',
  '📊': 'feature',
  '🔗': 'feature',
  '⛔️': 'card',
  '⛔':  'card',   // without variation selector — defensive alias
  '📌': 'pin',
};

/* Returns 'default' (no emoji), 'card' (⛔️), 'pin' (📌),
 * or a named type from CALLOUT_EMOJI_MAP.
 * Unknown emojis fall back to 'insight'. */
export function getCalloutType(block) {
  const icon  = block?.callout?.icon;
  const emoji = icon?.type === 'emoji' ? icon.emoji : null;
  if (!emoji) return 'default';
  return CALLOUT_EMOJI_MAP[emoji] ?? 'insight';
}

/* ─────────────────────────────────────────────────────────────────────────────
 * NOTION COLOR → CALLOUT TREATMENT
 *
 * colorRank() maps every Notion color to an intent level (0–6).
 * Two arrays then convert that rank to the right token for each system:
 *   BG_TOKENS   → callout wrapper background (all emoji types)
 *   CARD_TOKENS → CARD_STYLES key (⛔️ card callouts only)
 *
 *   rank   Notion color      BG token          CARD_STYLES token
 *   ────────────────────────────────────────────────────────────
 *    0     default           default (surface)  default
 *    1     gray              inverse (navy/wht)  inverse
 *    2     brown             solid   (wht/navy)  solid
 *    3     red / pink        outline             outline
 *    4     orange / yellow   warm                elevated
 *    5     green             success             solid
 *    6     blue / purple     gradient (dual)     gradient (dual)
 * ──────────────────────────────────────────────────────────────────────────── */

/* Rank each Notion color to a shared intent level (0–6). */
function colorRank(color) {
  if (['gray',   'gray_background'                                  ].includes(color)) return 1;
  if (['brown',  'brown_background'                                 ].includes(color)) return 2;
  if (['red',    'red_background',    'pink',   'pink_background'  ].includes(color)) return 3;
  if (['orange', 'orange_background', 'yellow', 'yellow_background'].includes(color)) return 4;
  if (['green',  'green_background'                                 ].includes(color)) return 5;
  if (['blue',   'blue_background',   'purple', 'purple_background'].includes(color)) return 6;
  return 0;
}

/* rank → BG token (callout wrapper) */
const BG_TOKENS   = ['default', 'inverse', 'solid', 'outline', 'warm', 'success', 'gradient'];
/* rank → CARD_STYLES key (⛔️ card callouts) */
const CARD_TOKENS = ['default', 'inverse', 'solid', 'outline', 'elevated', 'solid', 'gradient'];

export function calloutColorToBg(color)  { return BG_TOKENS[colorRank(color)]   ?? 'default'; }
function        colorToCardStyle(color)  { return CARD_TOKENS[colorRank(color)]  ?? 'default'; }

/* ─────────────────────────────────────────────────────────────────────────────
 * NOTION → CARD STYLE MAPPER
 * ──────────────────────────────────────────────────────────────────────────── */
export function styleForNotion(source, type = 'db', { hasImage = false } = {}) {
  if (type === 'callout') {
    const color = source?.callout?.color ?? 'default';
    return {
      size:      hasImage ? 'l' : 'm',
      cardStyle: colorToCardStyle(color),
    };
  }

  // Notion DB page (projects.json shape)
  return {
    size:      source?.featured ? 'l' : 'm',
    cardStyle: 'default',
  };
}
