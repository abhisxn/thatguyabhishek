'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, m } from 'framer-motion';

export default function ArticleSidebar({ headings, activeSlug }) {
  const [visible, setVisible] = useState(false);

  // Show after the article divider scrolls out of view
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
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          aria-label="Article sections"
          className="hidden xl:block"
          style={{
            position: 'fixed',
            left: 'calc(50vw - 360px - 184px)',
            top: 160,
            width: 160,
            zIndex: 30,
          }}
        >
          <p
            style={{
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--fg-muted)',
              opacity: 0.5,
              marginBottom: 14,
            }}
          >
            On this page
          </p>

          <div style={{ position: 'relative', paddingLeft: 16 }}>
            {/* Vertical track rail */}
            <div
              style={{
                position: 'absolute',
                left: 3,
                top: 0,
                bottom: 0,
                width: 1,
                background: 'var(--border)',
              }}
            />

            {headings.map(({ slug, text }) => {
              const isActive = slug === activeSlug;
              return (
                <button
                  key={slug}
                  onClick={() =>
                    document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' })
                  }
                  style={{
                    position: 'relative',
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    padding: '0 0 12px',
                    cursor: 'pointer',
                  }}
                >
                  {/* Accent bar */}
                  <div
                    style={{
                      position: 'absolute',
                      left: -16,
                      top: 4,
                      width: isActive ? 3 : 2,
                      height: isActive ? 14 : 10,
                      background: isActive ? 'var(--brand)' : 'var(--border-strong)',
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--brand)' : 'var(--fg-muted)',
                      opacity: isActive ? 1 : 0.4,
                      lineHeight: 1.4,
                      transition: 'color 0.2s ease, opacity 0.2s ease, font-weight 0.2s ease',
                      display: 'block',
                    }}
                  >
                    {text}
                  </span>
                </button>
              );
            })}
          </div>
        </m.nav>
      )}
    </AnimatePresence>
  );
}
