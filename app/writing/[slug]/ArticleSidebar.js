'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, m } from 'framer-motion';

const CORAL = 'var(--color-coral)';

/* ── Single sidebar item ─────────────────────────────────────────── */
function SidebarItem({ slug, text, level, isActive }) {
  const [hovered, setHovered] = useState(false);
  const isL2 = level === 2;

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
        padding: isL2
          ? '4px 10px 4px 22px'
          : '5px 10px 5px 12px',
        marginBottom: isL2 ? 2 : 4,
        cursor: 'pointer',
        borderRadius: 6,
        transition: 'background 0.25s ease',
        // Warm coral pill when active
        backgroundColor: isActive
          ? 'color-mix(in srgb, var(--color-coral) 10%, transparent)'
          : hovered
          ? 'color-mix(in srgb, var(--color-coral) 5%, transparent)'
          : 'transparent',
      }}
    >
      {/* Active left mark — hairline coral */}
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
        style={{
          display: 'block',
          fontSize: isL2 ? 11 : 12,
          lineHeight: 1.45,
          fontWeight: isActive ? 500 : 400,
          letterSpacing: isL2 ? 0 : '0.005em',
          color: isActive
            ? CORAL
            : hovered
            ? 'color-mix(in srgb, var(--color-coral) 60%, var(--fg-muted))'
            : 'var(--fg-muted)',
          opacity: isActive ? 1 : isL2 ? 0.45 : 0.55,
          transition: 'color 0.25s ease, opacity 0.25s ease',
          // Slight right-truncation so long headings don't overflow
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {text}
      </span>
    </button>
  );
}

/* ── Sidebar ─────────────────────────────────────────────────────── */
export default function ArticleSidebar({ headings, activeSlug }) {
  const [visible, setVisible] = useState(false);

  // Show after article-divider scrolls out of view
  useEffect(() => {
    const divider = document.getElementById('article-divider');
    if (!divider) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: '0px' }
    );
    observer.observe(divider);
    return () => observer.disconnect();
  }, []);

  // Hide when "More writing" footer enters view
  useEffect(() => {
    const footer = document.getElementById('more-writing');
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(false); }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (!headings.length) return null;

  return (
    <AnimatePresence>
      {visible && (
        <m.nav
          key="article-sidebar"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -6 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          aria-label="Article sections"
          className="hidden xl:block"
          style={{
            position: 'fixed',
            left: 'calc(50vw - 400px - 196px)',
            top: 160,
            width: 176,
            zIndex: 30,
          }}
        >
          {/* Label */}
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

          {/* Items */}
          <div>
            {headings.map(({ slug, text, level }) => (
              <SidebarItem
                key={slug}
                slug={slug}
                text={text}
                level={level}
                isActive={slug === activeSlug}
              />
            ))}
          </div>
        </m.nav>
      )}
    </AnimatePresence>
  );
}
