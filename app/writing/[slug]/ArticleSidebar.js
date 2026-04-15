'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, m } from 'framer-motion';

const CORAL = 'var(--color-coral)';

/* ── Single sidebar item ─────────────────────────────────────────── */
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
            ? 'color-mix(in srgb, var(--color-coral) 60%, var(--fg))'
            : 'var(--fg)',
          transition: 'color 0.25s ease',
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
  const footerInView = useRef(false);

  // Hide when site footer enters view
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => {
      footerInView.current = entry.isIntersecting;
      if (entry.isIntersecting) setVisible(false);
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // Show after 200px scroll (gated by footer visibility)
  useEffect(() => {
    const onScroll = () => {
      if (!footerInView.current) setVisible(window.scrollY > 200);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
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
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          aria-label="Article sections"
        >
          <p
            className="t-caption"
            style={{
              color: 'var(--fg-disabled)',
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
        </m.nav>
      )}
    </AnimatePresence>
  );
}
