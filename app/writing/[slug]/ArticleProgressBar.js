'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, m } from 'framer-motion';

/* ── Desktop heading pill ────────────────────────────────────────── */
function HeadingPill({ slug, text, isActive }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      aria-label={`Scroll to ${text}`}
      data-slug={slug}
      onClick={() => document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        background: 'none',
        border: 'none',
        padding: '6px 14px',
        cursor: 'pointer',
        borderRadius: 'var(--radius-pill)',
        backgroundColor: isActive
          ? 'var(--color-coral-muted)'
          : hovered
          ? 'color-mix(in srgb, var(--fg) 8%, transparent)'
          : 'transparent',
        outline: isActive ? '1px solid color-mix(in srgb, var(--color-coral) 30%, transparent)' : 'none',
        transition: 'background-color 0.2s ease, outline 0.2s ease',
        maxWidth: 200,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      <span
        className="t-body3"
        style={{
          fontWeight: isActive ? 600 : 400,
          color: isActive ? 'var(--color-coral)' : hovered ? 'var(--fg)' : 'var(--fg-muted)',
          transition: 'color 0.2s ease',
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {text}
      </span>
    </button>
  );
}

/* ── Main export ─────────────────────────────────────────────────── */
export default function ArticleProgressBar({ headings, activeSlug, progress }) {
  const [visible, setVisible] = useState(false);
  const footerInView = useRef(false);
  const pillsRef = useRef(null);

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

  // Show after 80px scroll (gated by footer visibility)
  useEffect(() => {
    const onScroll = () => {
      if (!footerInView.current) setVisible(window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll active pill into view on desktop
  useEffect(() => {
    if (!activeSlug || !pillsRef.current) return;
    const active = pillsRef.current.querySelector(`[data-slug="${activeSlug}"]`);
    if (active) {
      active.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
  }, [activeSlug]);

  const activeText = headings.find((h) => h.slug === activeSlug)?.text ?? '';

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          key="article-progress-bar"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
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
          {/* ── Mobile: active section label + % ── */}
          <div
            className="flex xl:hidden items-center justify-between"
            style={{ padding: '10px 20px 9px' }}
          >
            <span
              className="t-body3"
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
              className="t-body3"
              style={{ color: 'var(--fg-disabled)', flexShrink: 0, marginLeft: 12, fontVariantNumeric: 'tabular-nums' }}
            >
              {progress}%
            </span>
          </div>

          {/* ── Desktop: scrollable heading pills + progress ── */}
          <div
            className="hidden xl:flex items-center overflow-hidden"
            style={{ gap: 4, padding: '8px 32px' }}
          >
            {/* Scrollable pill row */}
            <div
              ref={pillsRef}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                overflowX: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {headings.map(({ slug, text }) => (
                <HeadingPill
                  key={slug}
                  slug={slug}
                  text={text}
                  isActive={slug === activeSlug}
                />
              ))}
            </div>

            {/* % only — progress track is the bottom bar */}
            <span
              className="t-body3"
              style={{
                color: 'var(--fg-disabled)',
                fontVariantNumeric: 'tabular-nums',
                minWidth: 32,
                textAlign: 'right',
                flexShrink: 0,
              }}
            >
              {progress}%
            </span>
          </div>

          {/* Progress bar — flush at bottom, all breakpoints */}
          <div style={{ height: 3, background: 'var(--border)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
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
