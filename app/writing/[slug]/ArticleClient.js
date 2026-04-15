'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { RenderBlocks } from '@/app/components/sections/NotionBlocks';
import GradientBackground from '@/app/components/layout/GradientBackground';
import { fadeUp, stagger, vp } from '@/lib/motion';
import ArticleSidebar from './ArticleSidebar';
import ArticleProgressBar from './ArticleProgressBar';

/* ── Article TOC + scroll progress hook ──────────────────────────── */
function useArticleToc(headings) {
  const [activeSlug, setActiveSlug] = useState(headings[0]?.slug ?? null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveSlug(visible.target.id);
      },
      { rootMargin: '0px 0px -65% 0px' }
    );
    headings.forEach(({ slug }) => {
      const el = document.getElementById(slug);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  return { activeSlug, progress };
}

/* ── Estimated reading time ───────────────────────────────────────── */
function estimateReadTime(blocks) {
  const words = blocks
    .flatMap((b) => {
      const texts = b[b.type]?.rich_text ?? b[b.type]?.caption ?? [];
      return texts.map((t) => t.plain_text);
    })
    .join(' ')
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/* ── Back arrow ───────────────────────────────────────────────────── */
function BackArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M12 7H2M7 2L2 7l5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExternalArrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Small writing card used in "more writing" footer grid ───────── */
function MiniArticleCard({ article }) {
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
      <span
        className="t-caption text-fg-muted inline-flex items-center gap-1 mt-auto"
        style={{ opacity: 0.7 }}
      >
        Read <ExternalArrow />
      </span>
    </Link>
  );
}

/* ── Main component ───────────────────────────────────────────────── */
export default function ArticleClient({ article, blocks, childrenMap, otherArticles, headings = [] }) {
  const readTime = estimateReadTime(blocks);
  const { activeSlug, progress } = useArticleToc(headings);
  const hasTopic = article.topic?.length > 0;

  return (
    <LazyMotion features={domAnimation}>
      <GradientBackground />

      {/* Mobile / tablet: fixed progress bar */}
      <ArticleProgressBar headings={headings} activeSlug={activeSlug} progress={progress} />

      <div className="relative" style={{ zIndex: 1 }}>

        {/* ── Two-column layout — 1280px total ───────────────────── */}
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 32px',
          }}
        >
          <div
            className="flex items-start"
            style={{
              gap: 56,
              paddingTop: 'clamp(80px, 10vw, 120px)',
            }}
          >

            {/* ── Left: persistent sticky sidebar (xl+) ──────────── */}
            <aside
              className="hidden xl:block"
              style={{
                width: 220,
                flexShrink: 0,
                position: 'sticky',
                top: 88,
                alignSelf: 'flex-start',
              }}
            >
              <ArticleSidebar headings={headings} activeSlug={activeSlug} />
            </aside>

            {/* ── Right: article content ─────────────────────────── */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* Article header */}
              <m.div variants={stagger} initial="hidden" animate="visible">

                {/* Back link */}
                <m.div variants={fadeUp}>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 t-caption text-fg-muted no-underline mb-10"
                    style={{ transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--fg)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
                  >
                    <BackArrow />
                    Back to writing
                  </Link>
                </m.div>

                {/* Emoji */}
                <m.div
                  variants={fadeUp}
                  style={{ fontSize: 'clamp(48px, 8vw, 72px)', lineHeight: 1, marginBottom: 24 }}
                >
                  {article.emoji}
                </m.div>

                {/* Overline — topic + read time */}
                <m.p
                  variants={fadeUp}
                  className="t-overline text-fg-muted"
                  style={{ marginBottom: 16, letterSpacing: '0.12em' }}
                >
                  {hasTopic ? `${article.topic[0]} · ` : ''}{readTime} min read
                </m.p>

                {/* Title */}
                <m.h1
                  variants={fadeUp}
                  className="t-h1 text-fg"
                  style={{ marginBottom: 0, lineHeight: 1.1 }}
                >
                  {article.title}
                </m.h1>

                {/* Hook pull-quote */}
                {article.desc && (
                  <m.blockquote
                    variants={fadeUp}
                    style={{
                      margin: '32px 0 0',
                      padding: '20px 24px',
                      borderLeft: '3px solid var(--brand)',
                      background: 'var(--brand-muted)',
                      borderRadius: '0 12px 12px 0',
                    }}
                  >
                    <p
                      className="t-body1 text-fg-muted"
                      style={{ margin: 0, fontStyle: 'italic', lineHeight: 1.6, opacity: 0.9 }}
                    >
                      {article.desc}
                    </p>
                  </m.blockquote>
                )}
              </m.div>

              {/* Divider */}
              <m.div
                id="article-divider"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ margin: '40px 0 0', transformOrigin: 'left center' }}
              >
                <div style={{ height: 1, background: 'var(--border-strong)', width: '100%' }} />
              </m.div>

              {/* Article body */}
              <m.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ padding: '48px 0 80px' }}
              >
                {blocks.length > 0 ? (
                  <div className="flex flex-col gap-5">
                    <RenderBlocks blocks={blocks} childrenMap={childrenMap} tocHeadings={headings} />
                  </div>
                ) : (
                  <p className="t-body2 text-fg-muted" style={{ opacity: 0.5 }}>
                    Article content coming soon.
                  </p>
                )}
              </m.div>

            </div>
          </div>
        </div>

        {/* ── More writing ─────────────────────────────────────────── */}
        {otherArticles.length > 0 && (
          <div
            id="more-writing"
            style={{
              borderTop: '1px solid var(--border)',
              padding: 'clamp(48px, 8vw, 80px) 32px',
            }}
          >
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
              <m.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={vp}
              >
                <m.p variants={fadeUp} className="t-overline text-fg-muted" style={{ marginBottom: 24 }}>
                  More writing
                </m.p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: 16,
                  }}
                >
                  {otherArticles.map((a) => (
                    <m.div key={a.id} variants={fadeUp}>
                      <MiniArticleCard article={a} />
                    </m.div>
                  ))}
                </div>
              </m.div>
            </div>
          </div>
        )}

      </div>
    </LazyMotion>
  );
}
