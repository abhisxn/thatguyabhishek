/**
 * Tests for the pure utility functions in app/components/ui/card-utils.js:
 *   - getCalloutType     (emoji → callout type string)
 *   - calloutColorToBg   (Notion color → BG token)
 *   - styleForNotion     (page or callout → { size, cardStyle })
 *   - CALLOUT_EMOJI_MAP  (data contract)
 *   - CARD_SIZES         (data shape)
 *   - CARD_STYLES        (data shape)
 */
import { describe, it, expect } from 'vitest';
import {
  getCalloutType,
  calloutColorToBg,
  styleForNotion,
  CALLOUT_EMOJI_MAP,
  CARD_SIZES,
  CARD_STYLES,
} from '../../app/components/ui/card-utils.js';

// ── helpers ──────────────────────────────────────────────────────────────────

function calloutBlock(emoji, color = 'default') {
  return {
    callout: {
      icon: emoji ? { type: 'emoji', emoji } : null,
      color,
    },
  };
}

// ── CALLOUT_EMOJI_MAP ─────────────────────────────────────────────────────────

describe('CALLOUT_EMOJI_MAP', () => {
  it('maps 💡 to insight', () => expect(CALLOUT_EMOJI_MAP['💡']).toBe('insight'));
  it('maps 🎯 to feature', () => expect(CALLOUT_EMOJI_MAP['🎯']).toBe('feature'));
  it('maps 💬 to quote',   () => expect(CALLOUT_EMOJI_MAP['💬']).toBe('quote'));
  it('maps ✏️ to note',    () => expect(CALLOUT_EMOJI_MAP['✏️']).toBe('note'));
  it('maps 📊 to feature', () => expect(CALLOUT_EMOJI_MAP['📊']).toBe('feature'));
  it('maps 🔗 to feature', () => expect(CALLOUT_EMOJI_MAP['🔗']).toBe('feature'));
  it('maps ⛔️ to card',   () => expect(CALLOUT_EMOJI_MAP['⛔️']).toBe('card'));
  it('maps ⛔ to card (no variation selector)', () => expect(CALLOUT_EMOJI_MAP['⛔']).toBe('card'));
  it('maps 📌 to pin',     () => expect(CALLOUT_EMOJI_MAP['📌']).toBe('pin'));
});

// ── getCalloutType ────────────────────────────────────────────────────────────

describe('getCalloutType', () => {
  it('returns "default" when there is no emoji', () => {
    expect(getCalloutType(calloutBlock(null))).toBe('default');
  });

  it('returns "default" when block has no callout', () => {
    expect(getCalloutType({})).toBe('default');
    expect(getCalloutType(null)).toBe('default');
    expect(getCalloutType(undefined)).toBe('default');
  });

  it('returns "insight" for 💡', () => {
    expect(getCalloutType(calloutBlock('💡'))).toBe('insight');
  });

  it('returns "feature" for 🎯', () => {
    expect(getCalloutType(calloutBlock('🎯'))).toBe('feature');
  });

  it('returns "quote" for 💬', () => {
    expect(getCalloutType(calloutBlock('💬'))).toBe('quote');
  });

  it('returns "note" for ✏️', () => {
    expect(getCalloutType(calloutBlock('✏️'))).toBe('note');
  });

  it('returns "feature" for 📊', () => {
    expect(getCalloutType(calloutBlock('📊'))).toBe('feature');
  });

  it('returns "card" for ⛔️', () => {
    expect(getCalloutType(calloutBlock('⛔️'))).toBe('card');
  });

  it('returns "card" for ⛔ (no variation selector)', () => {
    expect(getCalloutType(calloutBlock('⛔'))).toBe('card');
  });

  it('returns "pin" for 📌', () => {
    expect(getCalloutType(calloutBlock('📌'))).toBe('pin');
  });

  it('falls back to "insight" for unknown emojis', () => {
    expect(getCalloutType(calloutBlock('🚀'))).toBe('insight');
    expect(getCalloutType(calloutBlock('🎨'))).toBe('insight');
    expect(getCalloutType(calloutBlock('🔥'))).toBe('insight');
  });

  it('handles icon type other than emoji by returning "default"', () => {
    const block = { callout: { icon: { type: 'external', url: 'https://icon.com' } } };
    expect(getCalloutType(block)).toBe('default');
  });
});

// ── calloutColorToBg ──────────────────────────────────────────────────────────

describe('calloutColorToBg', () => {
  it('maps "default" to "default" (rank 0)', () => {
    expect(calloutColorToBg('default')).toBe('default');
  });

  it('maps "gray" to "inverse" (rank 1)', () => {
    expect(calloutColorToBg('gray')).toBe('inverse');
    expect(calloutColorToBg('gray_background')).toBe('inverse');
  });

  it('maps "brown" to "solid" (rank 2)', () => {
    expect(calloutColorToBg('brown')).toBe('solid');
    expect(calloutColorToBg('brown_background')).toBe('solid');
  });

  it('maps "red" and "pink" to "outline" (rank 3)', () => {
    expect(calloutColorToBg('red')).toBe('outline');
    expect(calloutColorToBg('red_background')).toBe('outline');
    expect(calloutColorToBg('pink')).toBe('outline');
    expect(calloutColorToBg('pink_background')).toBe('outline');
  });

  it('maps "orange" and "yellow" to "warm" (rank 4)', () => {
    expect(calloutColorToBg('orange')).toBe('warm');
    expect(calloutColorToBg('orange_background')).toBe('warm');
    expect(calloutColorToBg('yellow')).toBe('warm');
    expect(calloutColorToBg('yellow_background')).toBe('warm');
  });

  it('maps "green" to "success" (rank 5)', () => {
    expect(calloutColorToBg('green')).toBe('success');
    expect(calloutColorToBg('green_background')).toBe('success');
  });

  it('maps "blue" and "purple" to "gradient" (rank 6)', () => {
    expect(calloutColorToBg('blue')).toBe('gradient');
    expect(calloutColorToBg('blue_background')).toBe('gradient');
    expect(calloutColorToBg('purple')).toBe('gradient');
    expect(calloutColorToBg('purple_background')).toBe('gradient');
  });

  it('falls back to "default" for unknown colors', () => {
    expect(calloutColorToBg('magenta')).toBe('default');
    expect(calloutColorToBg(undefined)).toBe('default');
    expect(calloutColorToBg(null)).toBe('default');
  });
});

// ── styleForNotion ────────────────────────────────────────────────────────────

describe('styleForNotion', () => {
  describe('type="db" (database project page)', () => {
    it('returns size "l" and cardStyle "default" for featured projects', () => {
      const result = styleForNotion({ featured: true }, 'db');
      expect(result).toEqual({ size: 'l', cardStyle: 'default' });
    });

    it('returns size "m" and cardStyle "default" for non-featured projects', () => {
      const result = styleForNotion({ featured: false }, 'db');
      expect(result).toEqual({ size: 'm', cardStyle: 'default' });
    });

    it('defaults to "db" type when type arg is omitted', () => {
      const result = styleForNotion({ featured: false });
      expect(result).toEqual({ size: 'm', cardStyle: 'default' });
    });
  });

  describe('type="callout"', () => {
    it('returns size "l" and correct card style when hasImage=true', () => {
      const source = calloutBlock('⛔️', 'blue');
      const result = styleForNotion(source, 'callout', { hasImage: true });
      expect(result.size).toBe('l');
      expect(result.cardStyle).toBe('gradient'); // blue → rank 6 → CARD_TOKENS[6] = 'gradient'
    });

    it('returns size "m" when hasImage=false', () => {
      const source = calloutBlock('⛔️', 'default');
      const result = styleForNotion(source, 'callout', { hasImage: false });
      expect(result.size).toBe('m');
    });

    it('derives cardStyle from Notion color — gray → inverse', () => {
      const source = calloutBlock('⛔️', 'gray');
      expect(styleForNotion(source, 'callout').cardStyle).toBe('inverse');
    });

    it('derives cardStyle from Notion color — brown → solid', () => {
      const source = calloutBlock('⛔️', 'brown');
      expect(styleForNotion(source, 'callout').cardStyle).toBe('solid');
    });

    it('derives cardStyle from Notion color — red → outline', () => {
      const source = calloutBlock('⛔️', 'red');
      expect(styleForNotion(source, 'callout').cardStyle).toBe('outline');
    });

    it('derives cardStyle from Notion color — orange → elevated', () => {
      const source = calloutBlock('⛔️', 'orange');
      expect(styleForNotion(source, 'callout').cardStyle).toBe('elevated');
    });

    it('derives cardStyle from Notion color — green → solid', () => {
      const source = calloutBlock('⛔️', 'green');
      expect(styleForNotion(source, 'callout').cardStyle).toBe('solid');
    });

    it('defaults to "default" for missing callout color', () => {
      const source = { callout: {} }; // no color key
      expect(styleForNotion(source, 'callout').cardStyle).toBe('default');
    });
  });
});

// ── CARD_SIZES shape ─────────────────────────────────────────────────────────

describe('CARD_SIZES', () => {
  const EXPECTED_KEYS = ['xl', 'l', 'm', 's', 'xs'];
  const REQUIRED_FIELDS = ['radius', 'titleCls', 'contentGap', 'innerGap', 'showDesc', 'showBtn', 'showTags', 'showImg'];

  for (const key of EXPECTED_KEYS) {
    it(`has size "${key}" with all required fields`, () => {
      expect(CARD_SIZES).toHaveProperty(key);
      for (const field of REQUIRED_FIELDS) {
        expect(CARD_SIZES[key]).toHaveProperty(field);
      }
    });
  }

  it('showImg is false only for xs', () => {
    expect(CARD_SIZES.xs.showImg).toBe(false);
    expect(CARD_SIZES.s.showImg).toBe(true);
    expect(CARD_SIZES.m.showImg).toBe(true);
  });

  it('showDesc is true for xl and l only', () => {
    expect(CARD_SIZES.xl.showDesc).toBe(true);
    expect(CARD_SIZES.l.showDesc).toBe(true);
    expect(CARD_SIZES.m.showDesc).toBe(false);
    expect(CARD_SIZES.s.showDesc).toBe(false);
    expect(CARD_SIZES.xs.showDesc).toBe(false);
  });
});

// ── CARD_STYLES shape ─────────────────────────────────────────────────────────

describe('CARD_STYLES', () => {
  const EXPECTED_VARIANTS = ['default', 'elevated', 'outline', 'tinted', 'solid', 'inverse', 'gradient'];
  const REQUIRED_FIELDS = ['wrapper', 'titleClr', 'descClr', 'btn'];

  for (const variant of EXPECTED_VARIANTS) {
    it(`has variant "${variant}" with required fields`, () => {
      expect(CARD_STYLES).toHaveProperty(variant);
      for (const field of REQUIRED_FIELDS) {
        expect(CARD_STYLES[variant]).toHaveProperty(field);
      }
    });
  }
});
