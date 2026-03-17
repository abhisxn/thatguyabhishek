/* ─── Surface — theme-aware card wrapper ────────────────────────
 * Dark theme  → translucent glass (var(--surface) + var(--border))
 * Light theme → white card with shadow
 *
 * The `.ui-surface` CSS class in globals.css handles the theme switch.
 *
 * Props:
 *   as        — element tag or component (default 'div')
 *   size      — 'sm' | 'md' | 'lg' (default 'lg') — corner radius
 *   hover     — add lift-on-hover transition (default false)
 *   className — extra classes
 *   ...rest   — spread to the element (href, onClick, etc.)
 *
 * Usage:
 *   import Surface from '@/app/components/ui/Surface';
 *   <Surface hover>card content</Surface>
 *   <Surface as="a" href="..." hover>clickable card</Surface>
 */

export default function Surface({
  children,
  as        = 'div',
  size      = 'lg',
  hover     = false,
  className = '',
  ...rest
}) {
  const Tag = as;
  const sizeClass = size === 'sm' ? 'ui-surface--sm' : size === 'md' ? 'ui-surface--md' : 'ui-surface--lg';
  const hoverClass = hover ? 'transition-transform duration-300 hover:-translate-y-1' : '';

  return (
    <Tag
      className={`ui-surface ${sizeClass} ${hoverClass} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
