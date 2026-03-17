import RichText from '../ui/RichText';
import { ProjectsGrid } from './ProjectCard';
import CalloutBlock, { getImageUrl } from './CalloutBlock';

function findRichTextUrl(richText) {
  return richText?.find((t) => t.href)?.href ?? null;
}

export function NotionBlock({ block, projects, childrenMap, skipDatabase, skipDivider }) {
  switch (block.type) {

    /* ─── Paragraph ─── */
    case 'paragraph': {
      const texts = block.paragraph.rich_text;
      if (!texts.length) return <div className="h-2" />;
      return <p className="t-body2 text-fg-muted leading-relaxed"><RichText texts={texts} /></p>;
    }

    /* ─── Headings
     *   heading_1 → major section heading (maps to t-h3)
     *   heading_2 → subsection           (maps to t-h4)
     *   heading_3 → minor heading        (maps to t-h5)
     * ─── */
    case 'heading_1':
      return <h2 className="t-h3 mt-10 mb-3"><RichText texts={block.heading_1.rich_text} /></h2>;
    case 'heading_2':
      return <h3 className="t-h4 mt-8 mb-2"><RichText texts={block.heading_2.rich_text} /></h3>;
    case 'heading_3':
      return <h4 className="t-h5 mt-6 mb-1"><RichText texts={block.heading_3.rich_text} /></h4>;

    /* ─── Quote ─── */
    case 'quote':
      return <blockquote><RichText texts={block.quote.rich_text} /></blockquote>;

    /* ─── Code block ─── */
    case 'code': {
      const lang = block.code?.language ?? '';
      const codeText = block.code?.rich_text?.map((t) => t.plain_text).join('') ?? '';
      const caption = block.code?.caption;
      return (
        <figure className="my-1">
          {lang && lang !== 'plain text' && (
            <div
              className="t-caption font-mono px-4 py-1.5 rounded-t-xl"
              style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', color: 'var(--fg-muted)', opacity: 0.7 }}
            >
              {lang}
            </div>
          )}
          <pre
            className={`overflow-x-auto px-5 py-4 t-mono text-sm ${lang && lang !== 'plain text' ? 'rounded-b-xl' : 'rounded-xl'}`}
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: lang && lang !== 'plain text' ? 'none' : undefined }}
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
        <details className="group rounded-xl border border-theme overflow-hidden">
          <summary
            className="flex items-center gap-2 px-4 py-3 t-body2 font-medium cursor-pointer select-none list-none"
            style={{ background: 'var(--surface)' }}
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
            <div className="px-5 py-4 flex flex-col gap-3 border-t border-theme">
              <RenderBlocks blocks={children} projects={projects} childrenMap={childrenMap} />
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
        <label className="flex items-start gap-2.5 t-body2 text-fg-muted cursor-default">
          <input
            type="checkbox"
            defaultChecked={checked}
            disabled
            className="mt-0.5 size-4 flex-shrink-0 accent-[#4839ca] rounded"
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
        <div
          className="overflow-x-auto px-5 py-3 rounded-xl t-mono text-sm text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {expr}
        </div>
      );
    }

    /* ─── Divider ─── */
    case 'divider':
      if (skipDivider) return null;
      return <hr className="border-0 border-t border-theme" />;

    /* ─── Callout ─── */
    case 'callout':
      return <CalloutBlock block={block} childrenMap={childrenMap} />;

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
          <img src={url} alt={caption?.map((t) => t.plain_text).join('') || ''} className="w-full rounded-xl object-cover" loading="lazy" />
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
      const src = block.video?.type === 'external' ? block.video.external.url : block.video?.file?.url;
      if (!src) return null;
      return (
        <div className="rounded-xl overflow-hidden aspect-video bg-surface border border-theme">
          <iframe src={src} className="w-full h-full" allowFullScreen title="Embedded video" />
        </div>
      );
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
          className="inline-flex items-center gap-2 t-body3 font-medium px-4 py-2.5 rounded-xl border border-theme text-fg hover:bg-surface transition-colors"
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
      const url = block.embed?.url;
      if (!url) return null;
      return (
        <div className="rounded-xl overflow-hidden aspect-video bg-surface border border-theme">
          <iframe src={url} className="w-full h-full" allowFullScreen title="Embedded content" />
        </div>
      );
    }

    /* ─── Bookmark / Link preview ─── */
    case 'bookmark':
    case 'link_preview': {
      const url = block.bookmark?.url ?? block.link_preview?.url;
      const caption = block.bookmark?.caption;
      if (!url) return null;
      const label = caption?.length ? caption.map((t) => t.plain_text).join('') : 'View Project';
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 t-body3 font-medium t-link text-fg">
          {label}
          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      );
    }

    /* ─── Button ─── */
    case 'button': {
      const label = block.button?.text?.map((t) => t.plain_text).join('') || 'Know More';
      const url = block.button?.action?.type === 'url' ? block.button.action.url : null;
      if (!url) return <span className="t-body3 font-medium text-fg-muted">{label}</span>;
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 t-body3 font-medium px-4 py-2 rounded-full transition-colors border border-theme text-fg hover:bg-surface">
          {label}
        </a>
      );
    }

    /* ─── Column layout ─── */
    case 'column_list': {
      const columns = childrenMap?.[block.id] ?? [];
      if (!columns.length) return null;
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '1rem' }}>
          {columns.map((col) => {
            const colBlocks = childrenMap?.[col.id] ?? [];
            return (
              <div key={col.id} className="flex flex-col gap-3">
                <RenderBlocks blocks={colBlocks} projects={projects} childrenMap={childrenMap} />
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
      return (
        <div className="flex flex-col gap-4">
          <h2>All Projects</h2>
          <ProjectsGrid projects={projects} />
        </div>
      );

    case 'synced_block':
    case 'table_of_contents':
    case 'breadcrumb':
      return null;

    default:
      return null;
  }
}

export function RenderBlocks({ blocks, projects, childrenMap, skipDatabase, skipDivider }) {
  const grouped = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.type === 'bulleted_list_item' || b.type === 'numbered_list_item') {
      const type = b.type;
      const items = [b];
      while (i + 1 < blocks.length && blocks[i + 1].type === type) { i++; items.push(blocks[i]); }
      grouped.push({ _list: type === 'bulleted_list_item' ? 'ul' : 'ol', items });
    } else {
      grouped.push(b);
    }
    i++;
  }

  return (
    <>
      {grouped.map((item, idx) => {
        if (item._list === 'ul') {
          return (
            <ul key={`ul-${idx}`} className="list-disc list-outside pl-5 space-y-1 t-body2 text-fg-muted">
              {item.items.map((b) => <li key={b.id}><RichText texts={b.bulleted_list_item.rich_text} /></li>)}
            </ul>
          );
        }
        if (item._list === 'ol') {
          return (
            <ol key={`ol-${idx}`} className="list-decimal list-outside pl-5 space-y-1 t-body2 text-fg-muted">
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
          />
        );
      })}
    </>
  );
}
