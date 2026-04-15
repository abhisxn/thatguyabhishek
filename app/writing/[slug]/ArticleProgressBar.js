'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, m } from 'framer-motion';

export default function ArticleProgressBar({ headings, activeSlug, progress }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const footer = document.getElementById('more-writing');
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(false); }
    );
    observer.observe(footer);
    return () => observer.disconnect();
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
          className="xl:hidden fixed top-16 inset-x-0 z-40 border-b border-theme backdrop-blur-md"
          style={{ background: 'color-mix(in srgb, var(--bg-solid) 85%, transparent)' }}
        >
          {/* Label row */}
          <div className="flex items-center justify-between px-4 py-2">
            <span className="t-caption text-fg opacity-60 truncate min-w-0">
              {activeText}
            </span>
            <span className="t-caption text-fg opacity-30 shrink-0 ml-2">
              {progress}%
            </span>
          </div>

          {/* Progress track */}
          <div className="h-0.5 overflow-hidden bg-[var(--border)]">
            <div
              className="h-full"
              style={{
                width: `${progress}%`,
                background: 'var(--brand-gradient)',
                transition: 'width 0.15s linear',
              }}
            />
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
