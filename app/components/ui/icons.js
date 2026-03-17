/* ─── Shared icon components ────────────────────────────────── */

export function ArrowIcon({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M1.5 10.5L10.5 1.5M10.5 1.5H4.5M10.5 1.5V7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MenuIcon({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="5.5"  width="16" height="2" rx="1" fill="currentColor" />
      <rect x="4" y="10.5" width="16" height="2" rx="1" fill="currentColor" />
      <rect x="4" y="15.5" width="16" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}
