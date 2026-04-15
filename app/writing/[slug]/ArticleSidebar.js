'use client';

import { useState } from 'react';

const CORAL = 'var(--color-coral)';

function SidebarItem({ slug, text, isActive }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      aria-label={`Scroll to ${text}`}
      onClick={() => document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        textAlign: 'left',
        background: 'none',
        border: 'none',
        padding: '5px 10px 5px 12px',
        marginBottom: 4,
        cursor: 'pointer',
        borderRadius: 6,
        backgroundColor: isActive
          ? 'color-mix(in srgb, var(--color-coral) 10%, transparent)'
          : hovered
          ? 'color-mix(in srgb, var(--color-coral) 5%, transparent)'
          : 'transparent',
        transition: 'background-color 0.25s ease',
      }}
    >
      {/* Active hairline left mark */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 2,
          height: isActive ? '70%' : '0%',
          background: CORAL,
          borderRadius: 2,
          opacity: isActive ? 1 : 0,
          transition: 'height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.25s ease',
        }}
      />

      <span
        className="t-body2"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          fontWeight: isActive ? 500 : 400,
          color: isActive
            ? CORAL
            : hovered
            ? 'color-mix(in srgb, var(--color-coral) 60%, var(--fg-muted))'
            : 'var(--fg-muted)',
          opacity: isActive ? 1 : 0.55,
          transition: 'color 0.25s ease, opacity 0.25s ease',
        }}
      >
        {text}
      </span>
    </button>
  );
}

export default function ArticleSidebar({ headings, activeSlug }) {
  if (!headings.length) return null;

  return (
    <nav aria-label="Article sections">
      <p
        style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--fg-muted)',
          opacity: 0.35,
          marginBottom: 10,
          paddingLeft: 12,
        }}
      >
        In this piece
      </p>

      <div>
        {headings.map(({ slug, text }) => (
          <SidebarItem
            key={slug}
            slug={slug}
            text={text}
            isActive={slug === activeSlug}
          />
        ))}
      </div>
    </nav>
  );
}
