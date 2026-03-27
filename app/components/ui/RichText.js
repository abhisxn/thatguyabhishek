/* ─── RichText — Notion rich_text array renderer ───────────────
 * Server component. Handles bold, italic, code, strikethrough,
 * underline, color annotations, and inline links.
 *
 * Usage:
 *   import RichText from '@/app/components/ui/RichText';
 *   <RichText texts={block.paragraph.rich_text} />
 */

/* Notion annotation color → CSS style mapping */
const COLOR_MAP = {
  gray:              { color: 'var(--fg-muted)', opacity: 0.65 },
  brown:             { color: '#9e6b4f' },
  orange:            { color: '#ea8575' },
  yellow:            { color: '#cb912f' },
  green:             { color: '#448361' },
  blue:              { color: '#2e7dae' },
  purple:            { color: '#4839ca' },
  pink:              { color: '#e255a1' },
  red:               { color: '#c4554d' },
  gray_background:   { background: 'rgba(206,205,202,0.25)', borderRadius: '3px', padding: '1px 3px' },
  brown_background:  { background: 'rgba(158,107,79,0.15)',  borderRadius: '3px', padding: '1px 3px' },
  orange_background: { background: 'rgba(234,133,117,0.15)', borderRadius: '3px', padding: '1px 3px' },
  yellow_background: { background: 'rgba(203,145,47,0.15)',  borderRadius: '3px', padding: '1px 3px' },
  green_background:  { background: 'rgba(68,131,97,0.15)',   borderRadius: '3px', padding: '1px 3px' },
  blue_background:   { background: 'rgba(46,125,174,0.15)',  borderRadius: '3px', padding: '1px 3px' },
  purple_background: { background: 'rgba(72,57,202,0.15)',   borderRadius: '3px', padding: '1px 3px' },
  pink_background:   { background: 'rgba(226,85,161,0.15)',  borderRadius: '3px', padding: '1px 3px' },
  red_background:    { background: 'rgba(196,85,77,0.15)',   borderRadius: '3px', padding: '1px 3px' },
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
