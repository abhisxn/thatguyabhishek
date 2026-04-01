import Link from 'next/link';
import RichText from '../ui/RichText';
import { getCalloutType, calloutColorToBg, styleForNotion, CALLOUT_BG } from '../ui/card-utils';
import Card from '../ui/Card';
import LinkCalloutCard from '../ui/LinkCalloutCard';
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

/** Resolves the href from a rich_text item — checks top-level href and text.link.url fallback. */
function getRichTextHref(t) {
  return t.href || t.text?.link?.url || null;
}

/**
 * Checks whether a rich_text ARRAY (whole paragraph) represents a [bracket] button.
 *
 * Notion stores \[[Read more](url)\] as three separate items:
 *   "[" (no href)  +  "Read more" (href set)  +  "]" (no href)
 * Per-item checks miss this pattern — we must test the FULL joined plain text.
 */
function isBracketBtnParagraph(richText) {
  if (!richText?.length) return false;
  const full = richText.map((t) => t.plain_text).join('').trim();
  return /^\[.+\]$/.test(full) && richText.some((t) => getRichTextHref(t));
}

/**
 * Extracts the [bracket] link button from a callout's child paragraphs.
 * Returns { label, url } or null.
 */
function extractLinkButton(children) {
  for (const b of children) {
    if (b.type !== 'paragraph') continue;
    const rt = b.paragraph?.rich_text ?? [];
    if (!isBracketBtnParagraph(rt)) continue;
    const label = rt.map((t) => t.plain_text).join('').trim().slice(1, -1);
    const url   = getRichTextHref(rt.find((t) => getRichTextHref(t)));
    return { label, url };
  }
  return null;
}

/**
 * Returns the plain text of the first paragraph child that is NOT the [bracket] button.
 */
function extractBodyParagraph(children) {
  for (const b of children) {
    if (b.type !== 'paragraph') continue;
    const rt = b.paragraph?.rich_text ?? [];
    if (!rt.length || isBracketBtnParagraph(rt)) continue;
    return rt.map((t) => t.plain_text).join('');
  }
  return null;
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

/* BG token map lives in card-utils.js as CALLOUT_BG — imported above. */
const BG = CALLOUT_BG;

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

/* ── 💡 Insight / 📌 Pin (unified) ───────────────────────────────────────── */
function InsightCallout({ emoji, texts, contentSlot, bg }) {
  const { wrap, fg, muted, vars } = BG[bg] ?? BG.default;
  return (
    <div className={`flex-1 flex gap-4 items-start px-6 py-5 rounded-2xl ${wrap}`} style={vars}>
      {emoji && <span className="text-xl flex-shrink-0 mt-0.5">{emoji}</span>}
      <div className="flex flex-col gap-2 min-w-0 w-full">
        {texts.length > 0 && (
          <p className={`t-body2 font-semibold leading-snug ${fg}`}>
            <RichText texts={texts} />
          </p>
        )}
        {contentSlot && <div className={`flex flex-col gap-2 t-body2 ${muted}`}>{contentSlot}</div>}
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
        <p className={`t-h5 font-bold leading-snug mb-3 ${fg}`}>
          <RichText texts={texts} />
        </p>
      )}
      {contentSlot && <div className={`flex flex-col gap-2 ${muted}`}>{contentSlot}</div>}
      {linkUrl && (
        <p className={`mt-5 t-body2 font-semibold ${ ['inverse','solid','gradient'].includes(bg) ? 'text-[var(--fg)]' : 'text-[var(--brand)]'}`}>
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
      {emoji && <span className="text-m flex-shrink-0 mt-0.5 opacity-50">{emoji}</span>}
      <div className="flex flex-col gap-2 min-w-0 w-full t-body2 text-[var(--fg-muted)] leading-relaxed">
        {texts.length > 0 && <p><RichText texts={texts} /></p>}
        {contentSlot}
      </div>
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
        <p className={`mt-4 t-body2 font-semibold ${ ['inverse','solid','gradient'].includes(bg) ? 'text-[var(--fg)]' : 'text-[var(--brand)]'}`}>
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

  const type = getCalloutType(block);
  const bg   = calloutColorToBg(color);

  /* ── 🌐 Link card — title + body + [btn] hyperlink + OG thumbnail ── */
  if (type === 'linkcard') {
    // Button: check callout's own texts first (paragraph-level), then child paragraphs
    const textsAreBtn = isBracketBtnParagraph(texts);
    const btn = textsAreBtn
      ? {
          label: texts.map((t) => t.plain_text).join('').trim().slice(1, -1),
          url:   getRichTextHref(texts.find((t) => getRichTextHref(t))),
        }
      : extractLinkButton(calloutChildren);

    // Title = callout texts — but only if they're NOT the bracket button itself
    const title = textsAreBtn
      ? null
      : texts.map((t) => t.plain_text).join('').trim() || null;

    const body = extractBodyParagraph(calloutChildren);
    return (
      <LinkCalloutCard
        title={title}
        body={body}
        btnLabel={btn?.label ?? null}
        href={btn?.url ?? null}
        bg={bg}
      />
    );
  }

  if (type === 'insight') {
    return <InsightCallout emoji={emoji} texts={texts} contentSlot={contentSlot} bg={bg} />;
  }
  if (type === 'feature') {
    const linkUrl = extractCalloutUrl(texts, calloutChildren);
    const isExt   = !!(linkUrl?.startsWith('http://') || linkUrl?.startsWith('https://'));
    return <FeatureCallout emoji={emoji} texts={texts} contentSlot={contentSlot} bg={bg} linkUrl={linkUrl} isExternal={isExt} />;
  }
  if (type === 'quote')   return <QuoteCallout texts={texts} contentSlot={contentSlot} bg={bg} />;
  if (type === 'note')    return <NoteCallout emoji={emoji} texts={texts} contentSlot={contentSlot} />;
  if (type === 'pin')     return <InsightCallout emoji={emoji} texts={texts} contentSlot={contentSlot} bg={bg} />;
  if (type === 'default') {
    const linkUrl = extractCalloutUrl(texts, calloutChildren);
    const isExt   = !!(linkUrl?.startsWith('http://') || linkUrl?.startsWith('https://'));
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
    const linkUrl          = extractCalloutUrl(texts, calloutChildren);
    const notionUrl        = linkUrl;
    // extractNotionPageId handles both absolute (https://notion.so/...) and
    // relative (/abc123...) URLs — Notion returns relative paths for internal page links
    const notionPageId     = extractNotionPageId(notionUrl);
    const isInternalNotion = !!(notionPageId || /^https?:\/\/(www\.)?notion\.so\//.test(notionUrl ?? ''));
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
