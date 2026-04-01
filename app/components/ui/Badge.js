/* ─── Badge — status / label indicator ─────────────────────────
 * Server component. Fixed semantic color pairs, not palette-hashed.
 *
 * Variants: default | success | warning | error | info | brand
 *
 * Usage:
 *   import Badge from '@/app/components/ui/Badge';
 *   <Badge variant="success">Available</Badge>
 *   <Badge variant="brand" dot={false}>Microsoft</Badge>
 */

export const BADGE_VARIANTS = {
  default: 'ui-badge--default',
  success: 'ui-badge--success',
  warning: 'ui-badge--warning',
  error:   'ui-badge--error',
  info:    'ui-badge--info',
  brand:   'ui-badge--brand',
};

const VARIANT = BADGE_VARIANTS;

export default function Badge({
  children,
  variant  = 'default',
  dot      = true,
  className = '',
}) {
  return (
    <span className={`ui-badge ${VARIANT[variant] ?? VARIANT.default} ${className}`}>
      {dot && (
        <span
          aria-hidden="true"
          className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0"
        />
      )}
      {children}
    </span>
  );
}
