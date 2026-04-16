import { describe, it, expect } from 'vitest';
import { slugify, slugifyTitle, slugifyArticle } from '../../lib/slugify.js';

describe('slugify', () => {
  it('lowercases the input', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('foo bar baz')).toBe('foo-bar-baz');
  });

  it('trims whitespace but preserves leading/trailing hyphens from the source', () => {
    // slugify uses .trim() — only whitespace is trimmed, not hyphens
    // Use slugifyTitle for edge-stripping of hyphens
    expect(slugify('-leading and trailing-')).toBe('-leading-and-trailing-');
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
    // slugify strips '.' (not a \w char) — "2.0" becomes "20", not "2-0"
    // Use slugifyTitle if you need dots converted to hyphens
    expect(slugify('Airtel Thanks 2.0: Redesigning Airtel Thanks Program'))
      .toBe('airtel-thanks-20-redesigning-airtel-thanks-program');
  });

  it('handles numbers — dots stripped, not converted to hyphens', () => {
    expect(slugify('project 2.0 update')).toBe('project-20-update');
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

  // Regression: project URL slugs previously used an inline slugify in notion-work.js.
  // slugifyTitle is the canonical version — this test pins that they produce identical output.
  it('slugifyTitle matches the inline slugify that was in notion-work.js', () => {
    const inlineSlugify = (title) =>
      title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const samples = [
      'Microsoft Wiki Agent',
      'GoodWorker Design System',
      'ThinkPlanty.com',
    ];
    for (const s of samples) {
      expect(slugifyTitle(s)).toBe(inlineSlugify(s));
    }
  });
});

describe('slugifyTitle', () => {
  it('lowercases the input', () => {
    expect(slugifyTitle('Hello World')).toBe('hello-world');
  });

  it('collapses any non-alphanumeric run into one hyphen', () => {
    expect(slugifyTitle('ThinkPlanty.com')).toBe('thinkplanty-com');
    expect(slugifyTitle('GoodWorker Design System')).toBe('goodworker-design-system');
    expect(slugifyTitle('Microsoft Wiki Agent')).toBe('microsoft-wiki-agent');
  });

  it('strips leading and trailing hyphens', () => {
    expect(slugifyTitle('-Leading-')).toBe('leading');
  });

  it("handles apostrophes: what's new → what-s-new (apostrophe treated as separator)", () => {
    expect(slugifyTitle("What's new")).toBe('what-s-new');
  });

  it('matches the inline slugify previously in notion-work.js', () => {
    const inline = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const samples = ['Microsoft Wiki Agent', 'GoodWorker Design System', 'ThinkPlanty.com'];
    for (const s of samples) {
      expect(slugifyTitle(s)).toBe(inline(s));
    }
  });

  it('returns empty string for empty input', () => {
    expect(slugifyTitle('')).toBe('');
  });
});

describe('slugifyArticle', () => {
  it('lowercases the input', () => {
    expect(slugifyArticle('Hello World')).toBe('hello-world');
  });

  it('strips specials but preserves spaces before converting to hyphens', () => {
    // apostrophe stripped → space preserved → "whats new" → "whats-new"
    expect(slugifyArticle("What's new")).toBe('whats-new');
  });

  it('handles real article title examples', () => {
    expect(slugifyArticle('Stop Designing Features. Start Designing Decisions.'))
      .toBe('stop-designing-features-start-designing-decisions');
    expect(slugifyArticle('The "Why" Behind Great Design'))
      .toBe('the-why-behind-great-design');
  });

  it('strips leading and trailing hyphens', () => {
    expect(slugifyArticle('  leading and trailing  ')).toBe('leading-and-trailing');
  });

  it('matches the slugifyArticle previously in notion-work.js', () => {
    const inline = (t) =>
      t.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
    const samples = [
      'Stop Designing Features. Start Designing Decisions.',
      "What's new in product design",
      'The "Why" Behind Great Design',
    ];
    for (const s of samples) {
      expect(slugifyArticle(s)).toBe(inline(s));
    }
  });

  it('returns empty string for empty input', () => {
    expect(slugifyArticle('')).toBe('');
  });
});
