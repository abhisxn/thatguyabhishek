'use client';

/* ─── Select — themed dropdown ──────────────────────────────────
 * Client component. Uses `.ui-input .ui-select` CSS classes.
 *
 * Props:
 *   label       — optional label text
 *   id          — links label htmlFor
 *   options     — Array<{ value, label }> or string[]
 *   placeholder — first disabled option (optional)
 *   error       — error message (optional)
 *
 * Usage:
 *   import Select from '@/app/components/ui/Select';
 *   <Select
 *     label="Category"
 *     placeholder="Pick one"
 *     options={[{ value: 'ux', label: 'UX Design' }, 'Strategy']}
 *   />
 */

export default function Select({
  label,
  id,
  options  = [],
  placeholder,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-[12px] font-semibold tracking-wide uppercase"
          style={{ color: 'var(--fg-muted)', letterSpacing: '0.06em' }}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          className={`ui-input ui-select ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const value = typeof opt === 'string' ? opt : opt.value;
            const label = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>

        {/* Chevron icon */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center"
          style={{ color: 'var(--fg-muted)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {error && (
        <p className="text-[12px] font-medium" style={{ color: 'var(--color-error)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
