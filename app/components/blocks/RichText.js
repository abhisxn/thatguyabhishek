/* ─── RichText — Notion rich_text array renderer ───────────────
 * Server component. Handles bold, italic, code, strikethrough,
 * underline, color annotations, and inline links.
 *
 * Usage:
 *   import RichText from '@/app/components/blocks/RichText';
 *   <RichText texts={block.paragraph.rich_text} />
 */

/* Notion annotation color → CSS style mapping
 * Foreground colors reference semantic tokens where a match exists.
 * Background highlights: padding/radius snap to base-4 grid. */
const COLOR_MAP = {
  gray:              { color: 'var(--fg-muted)', opacity: 0.65 },
  brown:             { color: '#9e6b4f' },
  orange:            { color: 'var(--color-coral)' },         /* was #ea8575 → token */
  yellow:            { color: 'var(--color-warning)' },       /* was #cb912f → token */
  green:             { color: 'var(--color-success)' },       /* was #448361 → token */
  blue:              { color: 'var(--color-info)' },          /* was #2e7dae → token */
  purple:            { color: 'var(--brand)' },               /* was #4839ca → token */
  pink:              { color: '#e255a1' },
  red:               { color: 'var(--color-error)' },         /* was #c4554d → token */
  gray_background:   { background: 'rgba(206,205,202,0.25)', borderRadius: '4px', padding: '2px 4px' },  /* was 3px/1px 3px → 4px/2px 4px */
  brown_background:  { background: 'rgba(158,107,79,0.15)',  borderRadius: '4px', padding: '2px 4px' },
  orange_background: { background: 'var(--color-warning-bg)', borderRadius: '4px', padding: '2px 4px' },
  yellow_background: { background: 'var(--color-warning-bg)', borderRadius: '4px', padding: '2px 4px' },
  green_background:  { background: 'var(--color-success-bg)', borderRadius: '4px', padding: '2px 4px' },
  blue_background:   { background: 'var(--color-info-bg)',    borderRadius: '4px', padding: '2px 4px' },
  purple_background: { background: 'var(--brand-muted)',      borderRadius: '4px', padding: '2px 4px' },
  pink_background:   { background: 'rgba(226,85,161,0.15)',  borderRadius: '4px', padding: '2px 4px' },
  red_background:    { background: 'var(--color-error-bg)',   borderRadius: '4px', padding: '2px 4px' },
};

export default function RichText({ texts }) {
  if (!texts?.length) return null;
  return (
    <>
      {texts.map((item, i) => {
        const { bold, italic, code, strikethrough, underline, color } = item.annotations;
        const content = item.plain_text;

        /* ── Inline code ── */
        if (code) {
          return (
            <code
              key={i}
              className="px-1.5 py-0.5 rounded-md text-[0.82em] font-mono"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              {content}
            </code>
          );
        }

        const cls = [
          bold          && 'font-semibold',
          italic        && 'italic',
          strikethrough && 'line-through',
          underline     && 'underline underline-offset-2',
        ].filter(Boolean).join(' ');

        const colorStyle = color && color !== 'default' ? COLOR_MAP[color] : undefined;

        /* Split on Notion soft line breaks (\n) → <br /> */
        const parts = content.split('\n');
        const withBreaks = parts.flatMap((part, j) =>
          j < parts.length - 1 ? [part, <br key={`br-${j}`} />] : [part]
        );

        /* ── Inline link ── */
        if (item.href) {
          return (
            <a
              key={i}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline underline-offset-2 hover:opacity-60 transition-opacity ${cls}`}
              style={colorStyle}
            >
              {withBreaks}
            </a>
          );
        }

        /* ── Annotated span ── */
        if (cls || colorStyle) {
          return (
            <span key={i} className={cls || undefined} style={colorStyle}>
              {withBreaks}
            </span>
          );
        }

        return <span key={i}>{withBreaks}</span>;
      })}
    </>
  );
}
