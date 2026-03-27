/**
 * Tests for lib/section-styles.js
 *   - SECTION_STYLES     (data contract — shape and count)
 *   - HEADING_COLOR_TO_STYLE (Notion color → style index mapping)
 *   - styleIndexFromColor    (color string → style index)
 */
import { describe, it, expect } from 'vitest';
import {
  SECTION_STYLES,
  HEADING_COLOR_TO_STYLE,
  styleIndexFromColor,
} from '../../lib/section-styles.js';

// ── SECTION_STYLES contract ───────────────────────────────────────────────────

describe('SECTION_STYLES', () => {
  it('exports exactly 5 style entries (indices 0–4)', () => {
    expect(SECTION_STYLES).toHaveLength(5);
  });

  it('each entry has name, wrap, inner, textClr, mutedClr', () => {
    for (const style of SECTION_STYLES) {
      expect(style).toHaveProperty('name');
      expect(style).toHaveProperty('wrap');
      expect(style).toHaveProperty('inner');
      expect(style).toHaveProperty('textClr');
      expect(style).toHaveProperty('mutedClr');
    }
  });

  it('style[0] is named "default"',  () => expect(SECTION_STYLES[0].name).toBe('default'));
  it('style[1] is named "tinted"',   () => expect(SECTION_STYLES[1].name).toBe('tinted'));
  it('style[2] is named "inverse"',  () => expect(SECTION_STYLES[2].name).toBe('inverse'));
  it('style[3] is named "accent"',   () => expect(SECTION_STYLES[3].name).toBe('accent'));
  it('style[4] is named "solid"',    () => expect(SECTION_STYLES[4].name).toBe('solid'));

  it('style[0] has empty wrap and inner objects', () => {
    expect(SECTION_STYLES[0].wrap).toEqual({});
    expect(SECTION_STYLES[0].inner).toEqual({});
  });

  it('style[3] (accent) has a gradient background defined', () => {
    expect(SECTION_STYLES[3].wrap.background).toContain('linear-gradient');
  });
});

// ── HEADING_COLOR_TO_STYLE ────────────────────────────────────────────────────

describe('HEADING_COLOR_TO_STYLE', () => {
  it('"default" maps to style index 0', () => {
    expect(HEADING_COLOR_TO_STYLE['default']).toBe(0);
  });

  it('"gray" and "gray_background" map to index 1 (tinted)', () => {
    expect(HEADING_COLOR_TO_STYLE['gray']).toBe(1);
    expect(HEADING_COLOR_TO_STYLE['gray_background']).toBe(1);
  });

  it('"blue" and "blue_background" map to index 2 (inverse)', () => {
    expect(HEADING_COLOR_TO_STYLE['blue']).toBe(2);
    expect(HEADING_COLOR_TO_STYLE['blue_background']).toBe(2);
  });

  it('"purple" and "purple_background" map to index 3 (accent)', () => {
    expect(HEADING_COLOR_TO_STYLE['purple']).toBe(3);
    expect(HEADING_COLOR_TO_STYLE['purple_background']).toBe(3);
  });

  it('"brown" and "brown_background" map to index 4 (solid)', () => {
    expect(HEADING_COLOR_TO_STYLE['brown']).toBe(4);
    expect(HEADING_COLOR_TO_STYLE['brown_background']).toBe(4);
  });

  it('unmapped colors (red, green, orange, yellow) are not in the map', () => {
    expect(HEADING_COLOR_TO_STYLE['red']).toBeUndefined();
    expect(HEADING_COLOR_TO_STYLE['green']).toBeUndefined();
    expect(HEADING_COLOR_TO_STYLE['orange']).toBeUndefined();
  });
});

// ── styleIndexFromColor ───────────────────────────────────────────────────────

describe('styleIndexFromColor', () => {
  it('returns 0 for "default"', () => {
    expect(styleIndexFromColor('default')).toBe(0);
  });

  it('returns 0 for undefined (null/missing color)', () => {
    expect(styleIndexFromColor(undefined)).toBe(0);
    expect(styleIndexFromColor(null)).toBe(0);
  });

  it('returns 0 for unknown colors', () => {
    expect(styleIndexFromColor('magenta')).toBe(0);
    expect(styleIndexFromColor('red')).toBe(0);
    expect(styleIndexFromColor('green')).toBe(0);
  });

  it('returns 1 for "gray"', () => {
    expect(styleIndexFromColor('gray')).toBe(1);
  });

  it('returns 1 for "gray_background"', () => {
    expect(styleIndexFromColor('gray_background')).toBe(1);
  });

  it('returns 2 for "blue"', () => {
    expect(styleIndexFromColor('blue')).toBe(2);
  });

  it('returns 2 for "blue_background"', () => {
    expect(styleIndexFromColor('blue_background')).toBe(2);
  });

  it('returns 3 for "purple"', () => {
    expect(styleIndexFromColor('purple')).toBe(3);
  });

  it('returns 3 for "purple_background"', () => {
    expect(styleIndexFromColor('purple_background')).toBe(3);
  });

  it('returns 4 for "brown"', () => {
    expect(styleIndexFromColor('brown')).toBe(4);
  });

  it('returns 4 for "brown_background"', () => {
    expect(styleIndexFromColor('brown_background')).toBe(4);
  });

  it('always returns a valid SECTION_STYLES index (0–4)', () => {
    const allColors = [
      'default', 'gray', 'gray_background', 'blue', 'blue_background',
      'purple', 'purple_background', 'brown', 'brown_background',
      'red', 'green', 'orange', null, undefined, 'unknown',
    ];
    for (const color of allColors) {
      const idx = styleIndexFromColor(color);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThanOrEqual(4);
    }
  });
});
