/**
 * Tests for the pure property-extractor functions exported by lib/notion-work.js.
 *
 * The module imports `next/cache` and `./notion` at the top level, so both are
 * mocked below before the module under test is imported.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';

// ── module-level mocks (hoisted by vitest) ──────────────────────────────────
vi.mock('next/cache', () => ({
  unstable_cache: (fn) => fn,
}));

vi.mock('../../lib/notion.js', () => ({
  default: { blocks: { children: { list: vi.fn() } } },
}));

vi.mock('../../lib/notion-utils.js', () => ({
  withRetry: (fn) => fn(),
  createLimiter: () => (fn) => fn(),
}));

// ── import after mocks are registered ───────────────────────────────────────
const {
  getTitle,
  getDescription,
  getSummary,
  getTags,
  getCoverUrl,
  getFirstBlockImage,
  getUrl,
} = await import('../../lib/notion-work.js');

// ── helpers ─────────────────────────────────────────────────────────────────

/** Build a minimal Notion page object with the given properties */
function makePage(properties = {}, cover = null) {
  return { properties, cover };
}

function titleProp(text) {
  return { type: 'title', title: [{ plain_text: text }] };
}

function richTextProp(text) {
  return { type: 'rich_text', rich_text: [{ plain_text: text }] };
}

function multiSelectProp(names) {
  return { type: 'multi_select', multi_select: names.map((name) => ({ name })) };
}

function selectProp(name) {
  return { type: 'select', select: { name } };
}

function urlProp(url) {
  return { type: 'url', url };
}

function filesProp(url, type = 'external') {
  const file =
    type === 'external'
      ? { type: 'external', external: { url } }
      : { type: 'file', file: { url } };
  return { type: 'files', files: [file] };
}

// ── getTitle ─────────────────────────────────────────────────────────────────

describe('getTitle', () => {
  it('extracts text from the title property', () => {
    const page = makePage({ Name: titleProp('My Project') });
    expect(getTitle(page)).toBe('My Project');
  });

  it('returns "Untitled" when no title property exists', () => {
    expect(getTitle(makePage({}))).toBe('Untitled');
  });

  it('returns "Untitled" when title array is empty', () => {
    const page = makePage({ Name: { type: 'title', title: [] } });
    expect(getTitle(page)).toBe('Untitled');
  });

  it('concatenates multi-segment title', () => {
    const page = makePage({
      Name: { type: 'title', title: [{ plain_text: 'foo' }, { plain_text: ' bar' }] },
    });
    expect(getTitle(page)).toBe('foo bar');
  });
});

// ── getDescription ────────────────────────────────────────────────────────────

describe('getDescription', () => {
  it('reads from "Description" key', () => {
    const page = makePage({ Description: richTextProp('A great project') });
    expect(getDescription(page)).toBe('A great project');
  });

  it('reads from "Desc" key as fallback', () => {
    const page = makePage({ Desc: richTextProp('Short desc') });
    expect(getDescription(page)).toBe('Short desc');
  });

  it('reads from "Bio" key', () => {
    const page = makePage({ Bio: richTextProp('My bio') });
    expect(getDescription(page)).toBe('My bio');
  });

  it('reads from "About" key', () => {
    const page = makePage({ About: richTextProp('About me') });
    expect(getDescription(page)).toBe('About me');
  });

  it('returns null when no matching key found', () => {
    expect(getDescription(makePage({}))).toBeNull();
  });

  it('returns null when rich_text array is empty', () => {
    const page = makePage({ Description: { type: 'rich_text', rich_text: [] } });
    expect(getDescription(page)).toBeNull();
  });

  it('prioritises "Description" over later keys', () => {
    const page = makePage({
      Description: richTextProp('primary'),
      About: richTextProp('secondary'),
    });
    expect(getDescription(page)).toBe('primary');
  });
});

// ── getSummary ────────────────────────────────────────────────────────────────

describe('getSummary', () => {
  it('reads from "Summary" key', () => {
    const page = makePage({ Summary: richTextProp('The summary') });
    expect(getSummary(page)).toBe('The summary');
  });

  it('reads from "Tagline" key', () => {
    const page = makePage({ Tagline: richTextProp('A tagline') });
    expect(getSummary(page)).toBe('A tagline');
  });

  it('reads from "Excerpt" key', () => {
    const page = makePage({ Excerpt: richTextProp('An excerpt') });
    expect(getSummary(page)).toBe('An excerpt');
  });

  it('returns null when no matching key found', () => {
    expect(getSummary(makePage({}))).toBeNull();
  });
});

// ── getTags ───────────────────────────────────────────────────────────────────

describe('getTags', () => {
  it('reads from multi_select "Tags" property', () => {
    const page = makePage({ Tags: multiSelectProp(['UX', 'Product']) });
    expect(getTags(page)).toEqual(['UX', 'Product']);
  });

  it('reads from "Tech" key', () => {
    const page = makePage({ Tech: multiSelectProp(['React', 'Next.js']) });
    expect(getTags(page)).toEqual(['React', 'Next.js']);
  });

  it('reads from "Stack" key', () => {
    const page = makePage({ Stack: multiSelectProp(['TypeScript']) });
    expect(getTags(page)).toEqual(['TypeScript']);
  });

  it('reads from "Category" key', () => {
    const page = makePage({ Category: multiSelectProp(['Design System']) });
    expect(getTags(page)).toEqual(['Design System']);
  });

  it('reads from "Type" key', () => {
    const page = makePage({ Type: multiSelectProp(['Case Study']) });
    expect(getTags(page)).toEqual(['Case Study']);
  });

  it('reads from single select property', () => {
    const page = makePage({ Type: selectProp('Branding') });
    expect(getTags(page)).toEqual(['Branding']);
  });

  it('returns empty array when no matching key found', () => {
    expect(getTags(makePage({}))).toEqual([]);
  });

  it('returns empty array when multi_select is empty', () => {
    const page = makePage({ Tags: { type: 'multi_select', multi_select: [] } });
    expect(getTags(page)).toEqual([]);
  });
});

// ── getCoverUrl ───────────────────────────────────────────────────────────────

describe('getCoverUrl', () => {
  it('returns external cover url from page.cover', () => {
    const page = makePage({}, { type: 'external', external: { url: 'https://img.com/cover.jpg' } });
    expect(getCoverUrl(page)).toBe('https://img.com/cover.jpg');
  });

  it('returns file cover url from page.cover', () => {
    const page = makePage({}, { type: 'file', file: { url: 'https://s3.aws.com/file.jpg' } });
    expect(getCoverUrl(page)).toBe('https://s3.aws.com/file.jpg');
  });

  it('falls back to "Cover" files property', () => {
    const page = makePage({ Cover: filesProp('https://cdn.com/cover.png') });
    expect(getCoverUrl(page)).toBe('https://cdn.com/cover.png');
  });

  it('falls back to "Image" files property', () => {
    const page = makePage({ Image: filesProp('https://cdn.com/image.png') });
    expect(getCoverUrl(page)).toBe('https://cdn.com/image.png');
  });

  it('falls back to "Thumbnail" files property', () => {
    const page = makePage({ Thumbnail: filesProp('https://cdn.com/thumb.png') });
    expect(getCoverUrl(page)).toBe('https://cdn.com/thumb.png');
  });

  it('falls back to lowercase "cover" property', () => {
    const page = makePage({ cover: filesProp('https://cdn.com/lc.png') });
    expect(getCoverUrl(page)).toBe('https://cdn.com/lc.png');
  });

  it('falls back to lowercase "image" property', () => {
    const page = makePage({ image: filesProp('https://cdn.com/li.png') });
    expect(getCoverUrl(page)).toBe('https://cdn.com/li.png');
  });

  it('reads file (not external) upload from files property', () => {
    const page = makePage({ Cover: filesProp('https://s3.aws/f.jpg', 'file') });
    expect(getCoverUrl(page)).toBe('https://s3.aws/f.jpg');
  });

  it('returns null when no cover exists', () => {
    expect(getCoverUrl(makePage({}))).toBeNull();
  });

  it('prefers page.cover over files property', () => {
    const page = makePage(
      { Cover: filesProp('https://prop-url.com/img.jpg') },
      { type: 'external', external: { url: 'https://page-cover.com/banner.jpg' } }
    );
    expect(getCoverUrl(page)).toBe('https://page-cover.com/banner.jpg');
  });
});

// ── getFirstBlockImage ────────────────────────────────────────────────────────

describe('getFirstBlockImage', () => {
  it('returns url from the first image block (external)', () => {
    const blocks = [
      { type: 'paragraph' },
      { type: 'image', image: { type: 'external', external: { url: 'https://img.com/a.jpg' } } },
      { type: 'image', image: { type: 'external', external: { url: 'https://img.com/b.jpg' } } },
    ];
    expect(getFirstBlockImage(blocks)).toBe('https://img.com/a.jpg');
  });

  it('returns url from a file-hosted image block', () => {
    const blocks = [
      { type: 'image', image: { type: 'file', file: { url: 'https://s3.aws/img.png' } } },
    ];
    expect(getFirstBlockImage(blocks)).toBe('https://s3.aws/img.png');
  });

  it('returns null when no image blocks exist', () => {
    const blocks = [{ type: 'paragraph' }, { type: 'heading_1' }];
    expect(getFirstBlockImage(blocks)).toBeNull();
  });

  it('returns null for empty blocks array', () => {
    expect(getFirstBlockImage([])).toBeNull();
  });

  it('returns null when called with no argument', () => {
    expect(getFirstBlockImage()).toBeNull();
  });
});

// ── getUrl ────────────────────────────────────────────────────────────────────

describe('getUrl', () => {
  it('reads from "URL" property', () => {
    const page = makePage({ URL: urlProp('https://example.com') });
    expect(getUrl(page)).toBe('https://example.com');
  });

  it('reads from "Link" property', () => {
    const page = makePage({ Link: urlProp('https://link.com') });
    expect(getUrl(page)).toBe('https://link.com');
  });

  it('reads from "Website" property', () => {
    const page = makePage({ Website: urlProp('https://site.com') });
    expect(getUrl(page)).toBe('https://site.com');
  });

  it('reads from "Url" property (lowercase u)', () => {
    const page = makePage({ Url: urlProp('https://url.com') });
    expect(getUrl(page)).toBe('https://url.com');
  });

  it('reads from "Demo" property', () => {
    const page = makePage({ Demo: urlProp('https://demo.com') });
    expect(getUrl(page)).toBe('https://demo.com');
  });

  it('reads from "Live" property', () => {
    const page = makePage({ Live: urlProp('https://live.com') });
    expect(getUrl(page)).toBe('https://live.com');
  });

  it('returns null when no url property found', () => {
    expect(getUrl(makePage({}))).toBeNull();
  });

  it('returns null when url value is null/empty', () => {
    const page = makePage({ URL: { type: 'url', url: null } });
    expect(getUrl(page)).toBeNull();
  });
});
