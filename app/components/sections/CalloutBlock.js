import Link from 'next/link';
import RichText from '../ui/RichText';
import { getCalloutType, calloutColorToBg, styleForNotion } from '../ui/card-utils';
import Card from '../ui/Card';
import { slugify } from '../../../lib/slugify';
import projectsJson from '../../../data/projects.json';

/* ── Helpers ──────────────────────────────────────────────────────────────── */

/** Resolves a Notion image block to its public URL (external or signed file). */
export function getImageUrl(imageBlock) {
  if (imageBlock.type === 'external') return imageBlock.external.url;
  if (imageBlock.type === 'file') return imageBlock.file.url;
  return null;
}

/** Finds the first href inside a Notion rich_text array (inline hyperlink). */
function findRichTextUrl(richText) {
  return richText?.find((t) => t.href)?.href ?? null;
}

/** Extracts a Notion page ID from a page-mention (@-link) in a rich_text array. */
function findPageMentionId(richText) {
  const item = richText?.find((t) => t.type === 'mention' && t.mention?.type === 'page');
  return item?.mention?.page?.id?.replace(/-/g, '') ?? null;
}

/** Returns Wrapper component and props for an optional link. */
function useLinkProps(linkUrl, isExternal) {
  if (!linkUrl) return { Wrapper: 'div', wrapperProps: {} };
  if (isExternal) return { Wrapper: 'a', wrapperProps: { href: linkUrl, target: '_blank', rel: 'noopener noreferrer' } };
  return { Wrapper: Link, wrapperProps: { href: linkUrl } };
}

/** Extracts the 32-char Notion page ID from a notion.so URL, stripping dashes. */
function extractNotionPageId(url) {
  if (!url) return null;
  const m = url.match(/([0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12})(?:[?#].*)?$/i);
  return m ? m[1].replace(/-/g, '') : null;
}

/**
 * Extracts the primary link URL from a callout block.
 *
 * Priority order:
 *  1. Inline hyperlink in the callout's own rich_text
 *  2. Button child block  (action.url → url → rich_text href)
 *  3. Bookmark / link_preview / embed child block
 *  4. Hyperlink inside a heading child block (common Notion card pattern)
 *  5. Hyperlink inside a paragraph child block
 *
 * Used by feature, default, and card renderers to make the entire block clickable.
 */
function extractCalloutUrl(calloutTexts, children) {
  const fromCallout = findRichTextUrl(calloutTexts);
  if (fromCallout) return fromCallout;
  for (const b of children) {
    if (b.type === 'button') {
      const url = b.button?.action?.url ?? b.button?.url ?? findRichTextUrl(b.button?.rich_text);
      if (url) return url;
    }
    if (b.type === 'bookmark'     && b.bookmark?.url)     return b.bookmark.url;
    if (b.type === 'link_preview' && b.link_preview?.url) return b.link_preview.url;
    if (b.type === 'embed'        && b.embed?.url)        return b.embed.url;
    if (b.type === 'heading_1' || b.type === 'heading_2' || b.type === 'heading_3') {
      const url = findRichTextUrl(b[b.type]?.rich_text);
      if (url) return url;
    }
    if (b.type === 'paragraph') {
      const url = findRichTextUrl(b.paragraph?.rich_text);
      if (url) return url;
    }
  }
  return null;
}

/* ── bg token → Tailwind classes + CSS variable overrides ────────────────── *
 *
 * The `bg` key comes from calloutColorToBg() in card-utils.js (rank 0–6).
 * Applies uniformly to all callout types regardless of emoji.
 *
 *   rank  Notion color    token     visual
 *   ────────────────────────────────────────────────────────────
 *    0    (none)          default   subtle surface-1 + border
 *    1    gray            inverse   navy light / parchment dark
 *    2    brown           solid     parchment light / navy dark
 *    3    red / pink      outline   transparent + 2px border
 *    4    orange / yellow warm      warning tint + border
 *    5    green           success   success tint + border
 *    6    blue / purple   gradient  dual-theme gradient
 *
 * Each entry:
 *   wrap  — Tailwind bg + border classes on the outer element
 *   fg    — Tailwind text class for primary text
 *   muted — Tailwind text class for secondary / child text
 *   vars  — CSS custom-property overrides scoped to the element
 */
const BG = {
  /* 0 — no Notion color: subtle surface container */
  default: {
    wrap:  'bg-[var(--surface-1)] border border-[var(--border)]',
    fg:    'text-[var(--fg)]',
    muted: 'text-[var(--fg-muted)]',
    vars:  {},
  },
  /* 1 — gray: navy light / parchment dark */
  inverse: {
    wrap:  'bg-[var(--bg-inverse)] border border-[var(--border)]',
    fg:    'text-[var(--bg-solid)]',
    muted: 'text-[color-mix(in_srgb,var(--bg-solid)_65%,transparent)]',
    vars:  { '--fg': 'var(--bg-solid)', '--fg-muted': 'color-mix(in srgb, var(--bg-solid) 65%, transparent)', '--border': 'var(--border-strong)' },
  },
  /* 2 — brown: parchment light / navy dark */
  solid: {
    wrap:  'bg-[var(--bg-solid)] border border-[var(--border)]',
    fg:    'text-[var(--bg-inverse)]',
    muted: 'text-[color-mix(in_srgb,var(--bg-inverse)_65%,transparent)]',
    vars:  { '--fg': 'var(--bg-inverse)', '--fg-muted': 'color-mix(in srgb, var(--bg-inverse) 65%, transparent)' },
  },
  /* 3 — red / pink: transparent + border */
  outline: {
    wrap:  'bg-transparent border-2 border-[var(--border-strong)]',
    fg:    'text-[var(--fg)]',
    muted: 'text-[var(--fg-muted)]',
    vars:  {},
  },
  /* 4 — orange / yellow: warning tint */
  warm: {
    wrap:  'bg-[var(--color-warning-bg)] border border-[var(--color-warning)]',
    fg:    'text-[var(--fg)]',
    muted: 'text-[var(--fg-muted)]',
    vars:  {},
  },
  /* 5 — green: success tint */
  success: {
    wrap:  'bg-[var(--color-success-bg)] border border-[var(--color-success)]',
    fg:    'text-[var(--fg)]',
    muted: 'text-[var(--fg-muted)]',
    vars:  {},
  },
  /* 6 — blue / purple: dual-theme gradient (dark: blue-purple / light: pink-green pastel) */
  gradient: {
    wrap:  'border border-transparent',
    fg:    'text-[var(--fg)]',
    muted: 'text-[var(--fg-muted)]',
    vars:  { background: 'linear-gradient(135deg, var(--gradient-dual-from), var(--gradient-dual-to))' },
  },
};

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

/* ── 💡 Insight ───────────────────────────────────────────────────────────── */
function InsightCallout({ emoji, texts, contentSlot, bg }) {
  const { wrap, fg, muted, vars } = BG[bg] ?? BG.default;
  return (
    <div className={`flex-1 px-6 py-5 rounded-2xl ${wrap}`} style={vars}>
      {emoji && <p className="text-xl mb-3">{emoji}</p>}
      <div className="flex flex-col gap-2 min-w-0 w-full">
        {texts.length > 0 && (
          <p className={`t-body2 font-semibold leading-snug ${fg}`}>
            <RichText texts={texts} />
          </p>
        )}
        {contentSlot && <div className={`flex flex-col gap-2 ${muted}`}>{contentSlot}</div>}
      </div>
    </div>
  );
}

/* ── 🎯 Feature ───────────────────────────────────────────────────────────── */
function FeatureCallout({ emoji, texts, contentSlot, bg, linkUrl, isExternal }) {
  const { wrap, fg, muted, vars } = BG[bg] ?? BG.default;
  const { Wrapper, wrapperProps } = useLinkProps(linkUrl, isExternal);

  return (
    <Wrapper
      {...wrapperProps}
      style={vars}
      className={[
        'flex-1 block no-underline rounded-2xl p-8',
        wrap,
        linkUrl ? `group transition-transform duration-300 ${EASE} hover:-translate-y-1` : '',
      ].join(' ')}
    >
      {emoji && <span className="text-4xl leading-none block mb-5">{emoji}</span>}
      {texts.length > 0 && (
        <p className={`t-h4 font-bold leading-snug mb-3 ${fg}`}>
          <RichText texts={texts} />
        </p>
      )}
      {contentSlot && <div className={`flex flex-col gap-2 ${muted}`}>{contentSlot}</div>}
      {linkUrl && (
        <p className={`mt-5 t-body3 font-semibold ${ ['inverse','solid','gradient'].includes(bg) ? 'text-[var(--fg)]' : 'text-[var(--brand)]'}`}>
          View →
        </p>
      )}
    </Wrapper>
  );
}

/* ── 💬 Quote ─────────────────────────────────────────────────────────────── */
function QuoteCallout({ texts, contentSlot, bg }) {
  const { fg, muted, wrap, vars } = BG[bg] ?? BG.default;
  const isBoxed = bg !== 'default';
  return (
    <blockquote
      style={isBoxed ? vars : undefined}
      className={[
        isBoxed
          ? `rounded-2xl px-6 py-6 ${wrap}`
          : 'border-l-[3px] border-[var(--brand)] pl-6 py-1',
      ].join(' ')}
    >
      <p className={`t-h4 font-normal italic leading-snug ${fg}`}>
        <RichText texts={texts} />
      </p>
      {contentSlot && <div className={`flex flex-col gap-2 mt-3 ${muted}`}>{contentSlot}</div>}
    </blockquote>
  );
}

/* ── ✏️ Note ──────────────────────────────────────────────────────────────── */
function NoteCallout({ emoji, texts, contentSlot }) {
  return (
    <div className="flex gap-3 items-start px-5 py-4 rounded-xl bg-[var(--surface-0)] border border-[var(--border)]">
      {emoji && <span className="text-sm flex-shrink-0 mt-0.5 opacity-50">{emoji}</span>}
      <div className="flex flex-col gap-2 min-w-0 w-full t-body3 text-[var(--fg-muted)] leading-relaxed">
        {texts.length > 0 && <p><RichText texts={texts} /></p>}
        {contentSlot}
      </div>
    </div>
  );
}

/* ── 📌 Pin ────────────────────────────────────────────────────────────────── */
function PinCallout({ texts, contentSlot, bg }) {
  const { wrap, fg, muted, vars } = BG[bg] ?? BG.default;
  return (
    <div className={`flex-1 px-6 py-5 rounded-2xl ${wrap}`} style={vars}>
      <p className="text-base mb-3">📌</p>
      {texts.length > 0 && (
        <p className={`t-h5 leading-snug ${fg}`}>
          <RichText texts={texts} />
        </p>
      )}
      {contentSlot && <div className={`flex flex-col gap-2 mt-3 ${muted}`}>{contentSlot}</div>}
    </div>
  );
}

/* ── Default (no emoji) ───────────────────────────────────────────────────── */
function DefaultCallout({ texts, contentSlot, bg, linkUrl, isExternal }) {
  const { wrap, fg, muted, vars } = BG[bg] ?? BG.default;
  const { Wrapper, wrapperProps } = useLinkProps(linkUrl, isExternal);
  return (
    <Wrapper
      {...wrapperProps}
      style={vars}
      className={[
        'flex-1 block no-underline px-6 py-5 rounded-2xl',
        wrap,
        linkUrl ? `transition-all duration-200 ${EASE} hover:-translate-y-0.5 hover:border-[var(--brand-border)]` : '',
      ].join(' ')}
    >
      {texts.length > 0 && (
        <p className={`t-body2 leading-relaxed ${fg}`}>
          <RichText texts={texts} />
        </p>
      )}
      {contentSlot && <div className={`flex flex-col gap-2 mt-3 ${muted}`}>{contentSlot}</div>}
      {linkUrl && (
        <p className={`mt-4 t-body3 font-semibold ${ ['inverse','solid','gradient'].includes(bg) ? 'text-[var(--fg)]' : 'text-[var(--brand)]'}`}>
          Read more →
        </p>
      )}
    </Wrapper>
  );
}

/* ── Main component ───────────────────────────────────────────────────────── *
 *
 * Props:
 *   block        — raw Notion callout block object
 *   childrenMap  — { [blockId]: Block[] } — pre-fetched children for all blocks
 *                  on the page; the callout's own children are keyed by block.id
 *   contentSlot  — pre-rendered JSX for child blocks (passed in by NotionBlocks)
 *   hrefOverride — forces a specific href on ⛔️ card type (e.g. from Behance logic)
 *
 * Routing logic (emoji → type, via getCalloutType / CALLOUT_EMOJI_MAP):
 *
 *   💡            insight  — compact highlighted callout
 *   🎯 / 📊 / 🔗  feature  — large accent block; URL child → whole block clickable
 *   💬            quote    — italic pull-quote; inverse bg → boxed variant
 *   ✏️            note     — muted compact annotation
 *   📌            pin      — PINNED label header
 *   (no emoji)    default  — plain text; URL child → linkable block
 *   ⛔️ / ⛔       card     — explicit project card: image + title + CTA
 *   (other emoji) insight  — unknown emoji falls back to insight
 */
export default function CalloutBlock({ block, childrenMap, contentSlot, hrefOverride }) {
  const icon            = block.callout?.icon;
  const emoji           = icon?.type === 'emoji' ? icon.emoji : null;
  const texts           = block.callout?.rich_text ?? [];
  const color           = block.callout?.color ?? 'default';
  const calloutChildren = childrenMap?.[block.id] ?? [];

  const type    = getCalloutType(block);
  const bg      = calloutColorToBg(color);  // Notion color → BG token
  const linkUrl = extractCalloutUrl(texts, calloutChildren);
  const isExt   = !!(linkUrl?.startsWith('http://') || linkUrl?.startsWith('https://'));

  if (type === 'insight') {
    return <InsightCallout emoji={emoji} texts={texts} contentSlot={contentSlot} bg={bg} />;
  }
  if (type === 'feature') {
    return <FeatureCallout emoji={emoji} texts={texts} contentSlot={contentSlot} bg={bg} linkUrl={linkUrl} isExternal={isExt} />;
  }
  if (type === 'quote')   return <QuoteCallout texts={texts} contentSlot={contentSlot} bg={bg} />;
  if (type === 'note')    return <NoteCallout emoji={emoji} texts={texts} contentSlot={contentSlot} />;
  if (type === 'pin')     return <PinCallout texts={texts} contentSlot={contentSlot} bg={bg} />;
  if (type === 'default') {
    return <DefaultCallout texts={texts} contentSlot={contentSlot} bg={bg} linkUrl={linkUrl} isExternal={isExt} />;
  }

  /* ⛔️ card — explicit project / link card (image + title + desc + CTA)
   *
   * href resolution order:
   *  1. hrefOverride  — caller-injected (e.g. Behance override in NotionBlocks)
   *  2. projects.json match by Notion page ID (extracted from internal URL)
   *  3. projects.json match by calloutSlug alias (heading text → slug mapping in projects.json)
   *  4. Non-Notion URL from extractCalloutUrl → external link
   *  5. Hyperlink on child heading text
   *
   * Note: Notion button blocks are returned as `unsupported` by the API — their
   * URL is inaccessible. Slug aliases in projects.json.calloutSlugs cover this gap.
   * The old `slugify(title)` last-resort is removed — it generated wrong routes
   * when the Notion heading text differed from the project page title.
   */
  if (type === 'card') {
    const imgBlock     = calloutChildren.find((b) => b.type === 'image');
    const imgUrl       = imgBlock ? getImageUrl(imgBlock.image) : null;
    const headingBlock = calloutChildren.find((b) => b.type === 'heading_1' || b.type === 'heading_2' || b.type === 'heading_3');
    const headingTexts = headingBlock ? (headingBlock[headingBlock.type]?.rich_text ?? []) : [];
    const descBlock    = calloutChildren.find((b) => b.type === 'paragraph' && b.paragraph?.rich_text?.length);
    const desc         = descBlock ? descBlock.paragraph.rich_text.map((t) => t.plain_text).join('') : null;
    const title        = texts.map((t) => t.plain_text).join('') || headingTexts.map((t) => t.plain_text).join('') || null;
    const calloutSlug      = title ? slugify(title) : null;
    const notionUrl        = linkUrl;
    const isInternalNotion = /^https?:\/\/(www\.)?notion\.so\//.test(notionUrl ?? '');
    const notionPageId     = isInternalNotion ? extractNotionPageId(notionUrl) : null;
    // Page mention (@-link) fallback — covers cases where the heading or callout title
    // uses a Notion page mention instead of a regular hyperlink (no href, only mention.page.id)
    const mentionId        = findPageMentionId(texts) ?? findPageMentionId(headingTexts) ?? null;
    const matchedProject   = notionPageId
      ? projectsJson.find((p) => p.id.replace(/-/g, '') === notionPageId)
      : mentionId
        ? projectsJson.find((p) => p.id.replace(/-/g, '') === mentionId)
        : calloutSlug
          ? projectsJson.find((p) => p.slug === calloutSlug || (p.calloutSlugs ?? []).includes(calloutSlug))
          : null;

    let href = hrefOverride;
    if (!href && matchedProject)                 href = `/work/${matchedProject.slug}`;
    if (!href && !isInternalNotion && notionUrl) href = notionUrl;
    if (!href)                                   href = findRichTextUrl(headingTexts);

    const { size, cardStyle } = styleForNotion(block, 'callout', { hasImage: !!imgUrl });
    return <Card size={size} cardStyle={cardStyle} title={title} desc={desc} img={imgUrl} href={href} loading="lazy" />;
  }

  return null;
}
