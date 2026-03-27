import { describe, it, expect } from 'vitest';
import { slugify } from '../../lib/slugify.js';

describe('slugify', () => {
  it('lowercases the input', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('foo bar baz')).toBe('foo-bar-baz');
  });

  it('strips leading and trailing hyphens', () => {
    expect(slugify('-leading and trailing-')).toBe('leading-and-trailing');
  });

  it('collapses consecutive non-alphanumeric chars into one hyphen', () => {
    expect(slugify('a : b')).toBe('a-b');
    expect(slugify('a -- b')).toBe('a-b');
  });

  it('strips special characters', () => {
    expect(slugify('hello! world?')).toBe('hello-world');
  });

  it('handles the documented Notion title examples', () => {
    expect(slugify('Excel Charting : AI-Powered Chart Insights'))
      .toBe('excel-charting-ai-powered-chart-insights');
    expect(slugify('Airtel Thanks 2.0: Redesigning Airtel Thanks Program'))
      .toBe('airtel-thanks-2-0-redesigning-airtel-thanks-program');
  });

  it('handles numbers', () => {
    expect(slugify('project 2.0 update')).toBe('project-2-0-update');
  });

  it('returns empty string for empty input', () => {
    expect(slugify('')).toBe('');
  });

  it('handles single word with no special chars', () => {
    expect(slugify('design')).toBe('design');
  });

  it('is deterministic — same input always produces same output', () => {
    const title = 'GrowthX Bootcamp: UX Strategy';
    expect(slugify(title)).toBe(slugify(title));
  });

  // Regression: notion-work.js has a local copy of slugify with the same impl.
  // This test pins the algorithm so both copies stay in sync.
  it('matches the inline slugify in notion-work.js', () => {
    const inlineSlugify = (title) =>
      title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const samples = [
      'Microsoft Wiki Agent',
      'GoodWorker Design System',
      'ThinkPlanty.com',
    ];
    for (const s of samples) {
      expect(slugify(s)).toBe(inlineSlugify(s));
    }
  });
});
