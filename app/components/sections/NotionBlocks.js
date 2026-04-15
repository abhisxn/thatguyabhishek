import RichText from '../ui/RichText';
import { ProjectsCarousel } from './ProjectCard';
import CalloutBlock, { getImageUrl } from './CalloutBlock';
import { getCalloutType } from '../ui/card-utils';
import EmbedBlock, { BookmarkCard } from '../ui/EmbedBlock';
import EMBED_OVERRIDES from '@/data/embedOverrides';
import Button from '../ui/Button';
import { slugify } from '@/lib/slugify';

function toEmbedUrl(url) {
  if (!url) return url;

  // Figma — use embed.figma.com (old www.figma.com/embed wrapper is deprecated)
  if (url.includes('figma.com')) {
    const base = url.replace('www.figma.com', 'embed.figma.com');
    const sep = base.includes('?') ? '&' : '?';
    return `${base}${sep}embed-host=share`;
  }

  // YouTube watch or short
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

  const ytShorts = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (ytShorts) return `https://www.youtube.com/embed/${ytShorts[1]}`;

  // Vimeo
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  // Loom
  const loom = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
  if (loom) return `https://www.loom.com/embed/${loom[1]}`;

  // Google Drive file
  const driveFile = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (driveFile) return `https://drive.google.com/file/d/${driveFile[1]}/preview`;

  // Google Docs
  const gdoc = url.match(/docs\.google\.com\/document\/d\/([^/?#]+)/);
  if (gdoc) return `https://docs.google.com/document/d/${gdoc[1]}/preview`;

  // Google Slides — /pubembed is the correct iframe URL
  const gslides = url.match(/docs\.google\.com\/presentation\/d\/([^/?#]+)/);
  if (gslides) return `https://docs.google.com/presentation/d/${gslides[1]}/pubembed?start=false&loop=false&delayms=3000`;

  // Google Sheets
  const gsheets = url.match(/docs\.google\.com\/spreadsheets\/d\/([^/?#]+)/);
  if (gsheets) return `https://docs.google.com/spreadsheets/d/${gsheets[1]}/htmlview`;

  return url;
}


export function NotionBlock({ block, projects, childrenMap, skipDatabase, skipDivider, compact, tocHeadings }) {
  switch (block.type) {

    /* ─── Paragraph ─── */
    case 'paragraph': {
      const texts = block.paragraph?.rich_text;
      if (!texts?.length) return <div className="h-4" />;
      return <p className="t-body1 text-fg-muted leading-relaxed"><RichText texts={texts} /></p>;
    }

    /* ─── Headings
     *   page title  → t-display (rendered in page.js / HomeHero / Hero)
     *   heading_1   → t-h2 (major section heading)
     *   heading_2   → t-h3 (subsection)
     *   heading_3   → t-h4 (minor heading)
     *   Top margin: slight boost above the parent flex gap for visual hierarchy.
     *   Bottom margin: 0 — the next block's gap handles spacing below.
     * ─── */
    case 'heading_1': {
      const h1texts = block.heading_1?.rich_text ?? [];
      const tocEntry = tocHeadings?.find((h) => h.id === block.id);
      const h1slug = tocEntry?.slug ?? slugify(h1texts.map((t) => t.plain_text).join(''));
      return (
        <h2
          id={h1slug}
          data-toc
          className={`${compact ? 't-h3' : 't-h2'} mt-4 text-[var(--fg)]`}
        >
          <RichText texts={h1texts} />
        </h2>
      );
    }
    case 'heading_2': {
      const h2texts = block.heading_2?.rich_text ?? [];
      const tocEntry2 = tocHeadings?.find((h) => h.id === block.id);
      const h2slug = tocEntry2?.slug ?? slugify(h2texts.map((t) => t.plain_text).join(''));
      return (
        <h3
          id={h2slug}
          data-toc
          className={`${compact ? 't-h4' : 't-h3'} mt-3 text-[var(--fg)]`}
        >
          <RichText texts={h2texts} />
        </h3>
      );
    }
    case 'heading_3': {
      const h3texts = block.heading_3?.rich_text ?? [];
      return <h4 className={`${compact ? 't-h5' : 't-h4'} mt-2 text-[var(--fg)]`}><RichText texts={h3texts} /></h4>;
    }
    case 'heading_4': {
      const h4texts = block.heading_4?.rich_text ?? [];
      return <h5 className={`${compact ? 't-h6' : 't-h5'} mt-2 text-[var(--fg)]`}><RichText texts={h4texts} /></h5>;
    }

    /* ─── Quote ─── */
    case 'quote':
      return <blockquote><RichText texts={block.quote.rich_text} /></blockquote>;

    /* ─── Code block ─── */
    case 'code': {
      const lang = block.code?.language ?? '';
      const codeText = block.code?.rich_text?.map((t) => t.plain_text).join('') ?? '';
      const caption = block.code?.caption;
      return (
        <figure className="my-1 min-w-0 max-w-full">
          {lang && lang !== 'plain text' && (
            <div className="t-caption font-mono px-4 py-1.5 rounded-t-xl notion-code-lang">
              {lang}
            </div>
          )}
          <pre
            className={`overflow-x-auto px-5 py-4 t-mono text-sm notion-code-pre ${lang && lang !== 'plain text' ? 'rounded-b-xl notion-code-pre--lang' : 'rounded-xl'}`}
          >
            <code className="font-mono">{codeText}</code>
          </pre>
          {caption?.length > 0 && (
            <figcaption className="t-small mt-1.5 text-center text-fg-muted opacity-60">
              <RichText texts={caption} />
            </figcaption>
          )}
        </figure>
      );
    }

    /* ─── Toggle ─── */
    case 'toggle': {
      const texts = block.toggle.rich_text;
      const children = childrenMap?.[block.id] ?? [];
      return (
        <details className="group rounded-2xl border border-theme overflow-hidden">
          <summary
            className="flex items-center gap-2 px-5 py-4 t-body1 font-medium cursor-pointer select-none list-none bg-surface"
          >
            <svg
              className="size-4 flex-shrink-0 transition-transform duration-200 group-open:rotate-90"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <RichText texts={texts} />
          </summary>
          {children.length > 0 && (
            <div className="px-6 py-5 border-t border-theme">
              <RenderBlocks blocks={children} projects={projects} childrenMap={childrenMap} gap="gap-3" />
            </div>
          )}
        </details>
      );
    }

    /* ─── To-do ─── */
    case 'to_do': {
      const texts = block.to_do.rich_text;
      const checked = block.to_do.checked;
      return (
        <label className="flex items-start gap-2.5 t-body1 text-fg-muted cursor-default">
          <input
            type="checkbox"
            defaultChecked={checked}
            disabled
            className="mt-0.5 size-4 flex-shrink-0 accent-[var(--brand)] rounded"
          />
          <span className={checked ? 'line-through opacity-50' : ''}>
            <RichText texts={texts} />
          </span>
        </label>
      );
    }

    /* ─── Equation (display) ─── */
    case 'equation': {
      const expr = block.equation?.expression ?? '';
      return (
        <div className="overflow-x-auto px-5 py-3 rounded-2xl t-mono text-sm text-center bg-surface border border-theme">
          {expr}
        </div>
      );
    }

    /* ─── Divider ─── */
    case 'divider':
      if (skipDivider) return null;
      return <hr className="border-0 border-t border-theme" />;

    /* ─── Callout ─── */
    case 'callout': {
      const calloutChildren = childrenMap?.[block.id] ?? [];
      const texts = block.callout?.rich_text ?? [];

      /* Pin callout with no title text: promote first heading child as the title
       * so it renders in the pin's fg title slot rather than the muted contentSlot. */
      let effectiveBlock = block;
      let contentChildren = calloutChildren;
      if (getCalloutType(block) === 'pin' && texts.length === 0 && calloutChildren[0]?.type?.startsWith('heading_')) {
        const headingChild = calloutChildren[0];
        const promotedText = headingChild[headingChild.type]?.rich_text ?? [];
        effectiveBlock = { ...block, callout: { ...block.callout, rich_text: promotedText } };
        contentChildren = calloutChildren.slice(1);
      }

      const contentSlot = contentChildren.length > 0
        ? <RenderBlocks blocks={contentChildren} projects={projects} childrenMap={childrenMap} gap="gap-3" />
        : null;
      return <CalloutBlock block={effectiveBlock} childrenMap={childrenMap} contentSlot={contentSlot} />;
    }

    /* ─── Lists — grouped in RenderBlocks ─── */
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return null;

    /* ─── Image ─── */
    case 'image': {
      const url = getImageUrl(block.image);
      if (!url) return null;
      const caption = block.image.caption;
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={caption?.map((t) => t.plain_text).join('') || ''} className="w-full rounded-2xl object-cover" loading="lazy" />
          {caption?.length > 0 && (
            <figcaption className="t-small mt-2 text-center text-fg-muted opacity-60">
              <RichText texts={caption} />
            </figcaption>
          )}
        </figure>
      );
    }

    /* ─── Video ─── */
    case 'video': {
      const rawSrc = block.video?.type === 'external' ? block.video.external.url : block.video?.file?.url;
      if (!rawSrc) return null;
      const embedSrc = toEmbedUrl(rawSrc);
      return <EmbedBlock src={embedSrc} originalUrl={rawSrc} title="Embedded video" />;
    }

    /* ─── File / PDF ─── */
    case 'file':
    case 'pdf': {
      const fileData = block.file ?? block.pdf;
      const url = fileData?.type === 'external' ? fileData.external.url : fileData?.file?.url;
      const caption = fileData?.caption;
      const name = caption?.length ? caption.map((t) => t.plain_text).join('') : 'Download file';
      if (!url) return null;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="inline-flex items-center gap-2 t-body3 font-medium px-5 py-3 rounded-2xl border border-theme text-fg hover:bg-surface transition-colors"
        >
          <svg className="size-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          {name}
        </a>
      );
    }

    /* ─── Table ─── */
    case 'table': {
      const rows = childrenMap?.[block.id] ?? [];
      if (!rows.length) return null;
      const hasColHeader = block.table?.has_column_header;
      const hasRowHeader = block.table?.has_row_header;
      const headerRow = hasColHeader ? rows[0] : null;
      const bodyRows = hasColHeader ? rows.slice(1) : rows;
      return (
        <div className={`ui-table-wrap${hasRowHeader ? ' ui-table--row-header' : ''}`}>
          <table className="ui-table">
            {headerRow && (
              <thead>
                <tr>
                  {headerRow.table_row?.cells?.map((cell, j) => (
                    <th key={j}><RichText texts={cell} /></th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {bodyRows.map((row) => (
                <tr key={row.id}>
                  {row.table_row?.cells?.map((cell, j) => (
                    <td key={j}><RichText texts={cell} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    /* ─── Embed ─── */
    case 'embed': {
      const rawUrl = block.embed?.url;
      if (!rawUrl) return null;
      const embedUrl = toEmbedUrl(rawUrl);
      return <EmbedBlock src={embedUrl} originalUrl={rawUrl} title="Embedded content" />;
    }

    /* ─── Bookmark / Link preview ─── */
    case 'bookmark':
    case 'link_preview': {
      const url = block.bookmark?.url ?? block.link_preview?.url;
      const caption = block.bookmark?.caption;
      if (!url) return null;
      return <BookmarkCard url={url} caption={caption} />;
    }

    /* ─── Button ─── */
    case 'button': {
      const label = block.button?.text?.map((t) => t.plain_text).join('') || 'Know More';
      const url = block.button?.action?.type === 'url' ? block.button.action.url : null;
      if (!url) return <span className="t-body3 font-medium text-fg-muted">{label}</span>;
      return (
        <Button href={url} external variant="outline" size="sm">
          {label}
        </Button>
      );
    }

    /* ─── Column layout ───────────────────────────────────────
     * Pure grid renderer. Split-section logic (H1 in first col)
     * is handled upstream by ProjectSections.Section so this
     * case only ever sees genuine equal-column layouts.       */
    case 'column_list': {
      const columns = childrenMap?.[block.id] ?? [];
      if (!columns.length) return null;
      const gridCls = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-2 lg:grid-cols-4',
        5: 'grid-cols-2 lg:grid-cols-5',
      }[columns.length] ?? 'grid-cols-1';
      return (
        <div className={`grid gap-8 ${gridCls}`}>
          {columns.map((col) => {
            const colBlocks = childrenMap?.[col.id] ?? [];
            return (
              <div key={col.id} className="flex flex-col">
                <RenderBlocks blocks={colBlocks} projects={projects} childrenMap={childrenMap} cardCols="grid-cols-1" gap="gap-4" outerClassName="flex-1" />
              </div>
            );
          })}
        </div>
      );
    }

    /* ─── Child database ─── */
    case 'child_database':
    case 'child_data_source':
      if (skipDatabase) return null;
      return <ProjectsCarousel projects={projects} />;

    case 'synced_block':
    case 'table_of_contents':
    case 'breadcrumb':
      return null;

    /* ─── Unsupported (e.g. native Drive/Slides blocks) ─── */
    case 'unsupported': {
      const blockType = block.unsupported?.block_type;
      if (!blockType) return null;
      const override = EMBED_OVERRIDES[block.id];
      if (override) {
        return <EmbedBlock src={override.url} originalUrl={override.url} title={override.label} />;
      }
      return (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] t-body3 text-[var(--fg-muted)]">
          <svg className="size-4 flex-shrink-0 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
          </svg>
          <span>
            {blockType === 'drive'
              ? 'Google Drive embed — add block ID to data/embedOverrides.js to display here'
              : `Unsupported block type: ${blockType}`}
          </span>
        </div>
      );
    }

    default:
      return null;
  }
}

export function RenderBlocks({ blocks, projects, childrenMap, skipDatabase, skipDivider, compact, outerClassName = '', cardCols = 'sm:grid-cols-2', gap = 'gap-6', tocHeadings }) {
  const grouped = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.type === 'bulleted_list_item' || b.type === 'numbered_list_item') {
      const type = b.type;
      const items = [b];
      while (i + 1 < blocks.length && blocks[i + 1].type === type) { i++; items.push(blocks[i]); }
      grouped.push({ _list: type === 'bulleted_list_item' ? 'ul' : 'ol', items });
    } else if (b.type === 'callout' && getCalloutType(b) === 'card') {
      const items = [b];
      while (i + 1 < blocks.length && blocks[i + 1].type === 'callout' && getCalloutType(blocks[i + 1]) === 'card') {
        i++;
        items.push(blocks[i]);
      }
      grouped.push({ _cardGrid: true, items });
    } else {
      grouped.push(b);
    }
    i++;
  }

  return (
    <div className={`flex flex-col ${gap}${outerClassName ? ` ${outerClassName}` : ''}`}>
      {grouped.map((item, idx) => {
        if (item._cardGrid) {
          return (
            <div key={`cardgrid-${idx}`} className={`grid grid-cols-1 ${cardCols} gap-12`}>
              {item.items.map((b) => {
                const children = childrenMap?.[b.id] ?? [];
                const heading = children.find((c) => c.type === 'heading_1' || c.type === 'heading_2' || c.type === 'heading_3');
                const headingText = (heading?.[heading?.type]?.rich_text ?? []).map((t) => t.plain_text).join('').toLowerCase();
                const hrefOverride = headingText.includes('excited') ? 'https://www.behance.net/thatguyabhishek' : undefined;
                return <CalloutBlock key={b.id} block={b} childrenMap={childrenMap} hrefOverride={hrefOverride} />;
              })}
            </div>
          );
        }
        if (item._list === 'ul') {
          return (
            <ul key={`ul-${idx}`} className="list-disc list-outside pl-5 space-y-1.5 t-body1 text-fg-muted">
              {item.items.map((b) => <li key={b.id}><RichText texts={b.bulleted_list_item.rich_text} /></li>)}
            </ul>
          );
        }
        if (item._list === 'ol') {
          return (
            <ol key={`ol-${idx}`} className="list-decimal list-outside pl-5 space-y-1.5 t-body1 text-fg-muted">
              {item.items.map((b) => <li key={b.id}><RichText texts={b.numbered_list_item.rich_text} /></li>)}
            </ol>
          );
        }
        return (
          <NotionBlock
            key={item.id}
            block={item}
            projects={projects}
            childrenMap={childrenMap}
            skipDatabase={skipDatabase}
            skipDivider={skipDivider}
            compact={compact}
            tocHeadings={tocHeadings}
          />
        );
      })}
    </div>
  );
}
