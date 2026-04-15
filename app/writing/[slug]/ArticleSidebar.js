'use client';

import { useState } from 'react';

function SidebarItem({ slug, text, isActive }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      aria-label={`Scroll to ${text}`}
      onClick={() => document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative block w-full text-left border-none cursor-pointer rounded-md mb-1 transition-[background-color] duration-[250ms] ease-out"
      style={{
        padding: '5px 10px 5px 12px',
        background: 'none',
        backgroundColor: isActive
          ? 'color-mix(in srgb, var(--color-coral) 10%, transparent)'
          : hovered
          ? 'color-mix(in srgb, var(--color-coral) 5%, transparent)'
          : 'transparent',
      }}
    >
      {/* Active hairline left mark */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-sm"
        style={{
          height: isActive ? '70%' : '0%',
          background: 'var(--color-coral)',
          opacity: isActive ? 1 : 0,
          transition: 'height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.25s ease',
        }}
      />

      <span
        className="t-body2 line-clamp-2"
        style={{
          fontWeight: isActive ? 500 : 400,
          color: isActive
            ? 'var(--color-coral)'
            : hovered
            ? 'color-mix(in srgb, var(--color-coral) 60%, var(--fg))'
            : 'var(--fg)',
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
      <p className="t-overline text-fg opacity-35 mb-2.5 pl-3">
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
