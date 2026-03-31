'use client';

/* ─── Input / Textarea — themed form fields ─────────────────────
 * Client component (event handlers).
 * Uses `.ui-input` CSS class from globals.css for dark/light theming.
 *
 * Usage:
 *   import { Input, Textarea } from '@/app/components/ui/Input';
 *   <Input label="Your name" placeholder="Abhishek" />
 *   <Textarea label="Message" rows={5} error="Required" />
 */

export function Input({ label, id, error, className = '', ...props }) {
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
      <input
        id={id}
        className={`ui-input ${className}`}
        {...props}
      />
      {error && (
        <p className="text-[12px] font-medium" style={{ color: 'var(--color-error)' }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function Textarea({ label, id, rows = 4, error, className = '', ...props }) {
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
      <textarea
        id={id}
        rows={rows}
        className={`ui-input resize-none ${className}`}
        {...props}
      />
      {error && (
        <p className="text-[12px] font-medium" style={{ color: 'var(--color-error)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
