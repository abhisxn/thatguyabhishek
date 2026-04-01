import Link from 'next/link';

/*
 * Variants (CSS classes defined in globals.css — hover inversion baked in)
 *  outline       — white border/text  → hover: white fill  (dark bg)
 *  filled        — white fill         → hover: white outline (dark bg)
 *  outline-brand — brand border/text  → hover: brand fill
 *  filled-brand  — brand fill         → hover: brand outline
 *
 * Sizes
 *  lg  — btn1: 20px Glory Medium, px-5 py-3
 *  sm  — btn2: 16px Glory Medium, pl-5 pr-3 py-3 (room for trailing icon)
 */

export const BUTTON_VARIANTS = {
  'outline':       'btn-outline',
  'filled':        'btn-filled',
  'outline-brand': 'btn-outline-brand',
  'filled-brand':  'btn-filled-brand',
};

// internal alias kept for component use
const VARIANT_CLASS = BUTTON_VARIANTS;

export default function Button({
  children,
  href,
  variant   = 'outline',
  size      = 'lg',
  icon      = null,
  external  = false,
  onClick,
  className = '',
  style     = {},
}) {
  const sizeClass = size === 'sm'
    ? 't-btn2 pl-5 pr-3 py-3'   /* was py-2.5 (10px, not ×4) → py-3 = 12px */
    : 't-btn1 px-5 py-3';        /* was py-2.5 (10px, not ×4) → py-3 = 12px */

  const cls = [
    'inline-flex items-center justify-center gap-2',  /* was gap-1.5 (6px, not ×4) → gap-2 = 8px */
    'rounded-full font-medium',
    VARIANT_CLASS[variant] ?? 'btn-outline',
    sizeClass,
    className,
  ].join(' ');

  const inner = (
    <>
      {children}
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
    </>
  );

  if (href) {
    if (!external && href.startsWith('/')) {
      return <Link href={href} className={cls} style={style}>{inner}</Link>;
    }
    return (
      <a
        href={href}
        className={cls}
        style={style}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={cls} style={style}>
      {inner}
    </button>
  );
}
