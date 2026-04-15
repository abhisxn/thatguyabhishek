'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, m } from 'framer-motion';

export default function ArticleProgressBar({ headings, activeSlug, progress }) {
  const [visible, setVisible] = useState(false);
  const footerInView = useRef(false);

  // Hide when "More writing" footer enters view
  useEffect(() => {
    const footer = document.getElementById('more-writing');
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => {
      footerInView.current = entry.isIntersecting;
      if (entry.isIntersecting) setVisible(false);
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // Show after 80px scroll (gated by footer visibility)
  useEffect(() => {
    const onScroll = () => {
      if (!footerInView.current) setVisible(window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeText = headings.find((h) => h.slug === activeSlug)?.text ?? '';

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          key="article-progress-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="xl:hidden"
          style={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            zIndex: 40,
            background: 'color-mix(in srgb, var(--bg-solid) 85%, transparent)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {/* Label row */}
          <div
            style={{
              padding: '8px 16px 7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              className="t-caption"
              style={{
                color: 'var(--fg-muted)',
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {activeText}
            </span>
            <span
              className="t-caption"
              style={{ color: 'var(--fg-disabled)', flexShrink: 0, marginLeft: 8 }}
            >
              {progress}%
            </span>
          </div>

          {/* Progress bar — flush at bottom of bar */}
          <div style={{ height: 2, background: 'var(--border)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'var(--brand)',
                transition: 'width 0.15s linear',
              }}
            />
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
