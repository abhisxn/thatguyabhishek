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
    titleCls:  't-h3 font-bold',
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
    titleCls:  't-h4 font-bold',
    contentGap: 'gap-8 px-6 pt-5 pb-8',
    innerGap:  'gap-4',
    showDesc:  true,
    showBtn:   true,
    showTags:  false,
    showImg:   true,
  },
  m: {
    radius:    'rounded-[20px]',
    imgHeight: 'h-[220px]',
    hoverPad:  'group-hover:pt-2.5 group-hover:px-2.5',
    imgRadius: 'rounded-t-[16px] group-hover:rounded-[16px]',
    titleCls:  't-h5 font-bold',
    contentGap: 'gap-5 px-5 pt-4 pb-6',
    innerGap:  'gap-3',
    showDesc:  true,
    showBtn:   false,
    showTags:  true,
    showImg:   true,
  },
  s: {
    radius:    'rounded-xl',
    imgHeight: 'h-[150px]',
    hoverPad:  'group-hover:pt-2 group-hover:px-2',
    imgRadius: 'rounded-t-[10px] group-hover:rounded-[10px]',
    titleCls:  'text-lg font-bold leading-tight',
    contentGap: 'gap-3 px-3 pt-3 pb-4',
    innerGap:  'gap-2',
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
    innerGap:  'gap-1.5',
    showDesc:  false,
    showBtn:   false,
    showTags:  true,
    showImg:   false,
  },
};

export const CARD_STYLES = {
  default: {
    wrapper:  'bg-white',
    shadow:   '0 4px 24px rgba(0,0,0,0.08)',
    titleClr: 'text-[#313138]',
    descClr:  'text-[rgba(49,49,56,0.75)]',
    btn:      'border-[#4839ca] text-[#4839ca] hover:bg-[#4839ca] hover:text-white',
  },
  elevated: {
    wrapper:  'bg-white',
    shadow:   '0 8px 40px rgba(0,0,0,0.16)',
    titleClr: 'text-[#313138]',
    descClr:  'text-[rgba(49,49,56,0.75)]',
    btn:      'border-[#4839ca] text-[#4839ca] hover:bg-[#4839ca] hover:text-white',
  },
  outline: {
    wrapper:  'bg-transparent border border-[var(--border)]',
    shadow:   'none',
    titleClr: 'text-[var(--fg)]',
    descClr:  'text-[color-mix(in_srgb,var(--fg)_60%,transparent)]',
    btn:      'border-[var(--fg)] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg-solid)]',
  },
  tinted: {
    wrapper:  'bg-[var(--surface)] border border-[var(--border)] backdrop-blur-sm',
    shadow:   'none',
    titleClr: 'text-[var(--fg)]',
    descClr:  'text-[color-mix(in_srgb,var(--fg)_60%,transparent)]',
    btn:      'border-[#4839ca] text-[#4839ca] hover:bg-[#4839ca] hover:text-white',
  },
  dark: {
    wrapper:  'bg-[#0b2261]',
    shadow:   '0 4px 24px rgba(0,0,0,0.32)',
    titleClr: 'text-white',
    descClr:  'text-[rgba(255,255,255,0.70)]',
    btn:      'border-white text-white hover:bg-white hover:text-[#0b2261]',
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
 * NOTION → CARD STYLE MAPPER
 * ──────────────────────────────────────────────────────────────────────────── */
export function styleForNotion(source, type = 'db', { hasImage = false } = {}) {
  if (type === 'callout') {
    const color = source?.callout?.color ?? 'default';

    const colorMap = {
      blue_background:   'dark',
      blue:              'dark',
      purple_background: 'dark',
      purple:            'dark',
      gray_background:   'tinted',
      gray:              'tinted',
      brown_background:  'tinted',
      brown:             'tinted',
    };

    return {
      size:      hasImage ? 'l' : 'm',
      cardStyle: colorMap[color] ?? (hasImage ? 'elevated' : 'tinted'),
    };
  }

  // Notion DB page (projects.json shape)
  return {
    size:      source?.featured ? 'l' : 'm',
    cardStyle: 'default',
  };
}
