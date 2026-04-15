'use client';

import Link from 'next/link';

export function BackArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M12 7H2M7 2L2 7l5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ExternalArrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MiniArticleCard({ article }) {
  return (
    <Link
      href={article.href}
      className="group flex flex-col gap-2 no-underline"
      style={{
        padding: '20px',
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        transition: 'border-color 0.2s ease, background 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-strong)';
        e.currentTarget.style.background = 'var(--surface-2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.background = 'var(--surface-1)';
      }}
    >
      <span style={{ fontSize: 22 }}>{article.emoji}</span>
      <p className="t-body3 font-semibold text-fg" style={{ margin: 0, lineHeight: 1.35 }}>
        {article.title}
      </p>
      <span className="t-caption text-fg-muted inline-flex items-center gap-1 mt-auto">
        Read <ExternalArrow />
      </span>
    </Link>
  );
}
