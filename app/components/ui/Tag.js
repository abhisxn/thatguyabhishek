/* ─── Tag — single source of truth for tag pill styling ────────
 * Shared across Card.js, work/page.js, awards/page.js.
 * Server component — no hooks, pure render.
 *
 * Usage:
 *   import Tag from '@/app/components/ui/Tag';
 *   <Tag label="Product Design" />
 */

export const TAG_PALETTE = [
  { bg: '#FADEC9', color: '#D9730D' },
  { bg: '#FDECC8', color: '#CB912F' },
  { bg: '#DBEDDB', color: '#448361' },
  { bg: '#D3E5EF', color: '#2E7DAE' },
  { bg: '#E8DEEE', color: '#9065B0' },
  { bg: '#F5E0E9', color: '#C14F8A' },
  { bg: '#FFE2DD', color: '#C4554D' },
  { bg: '#EEE0DA', color: '#9F6B53' },
  { bg: '#E3E2E0', color: '#787774' },
];

export function tagStyle(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  const { bg, color } = TAG_PALETTE[h % TAG_PALETTE.length];
  return { background: bg, color, border: `1px solid ${color}` };
}

export default function Tag({ label, className = '' }) {
  return (
    <span
      className={`ui-tag ${className}`}
      style={tagStyle(String(label))}
    >
      {label}
    </span>
  );
}
