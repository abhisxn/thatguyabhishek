'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import { RenderBlocks } from '@/app/components/blocks/NotionBlocks';
import { fadeUp, stagger, vp } from '@/lib/motion';
import ArticleSidebar from './ArticleSidebar';
import ArticleProgressBar from './ArticleProgressBar';
import {
  useReactions,
  TotalCount,
  ArticleReactionPills,
  ArticleReactionCards,
} from '@/app/components/sections/ArticleReactions';
import { useArticleToc, estimateReadTime } from './_hooks';
import { BackArrow, MiniArticleCard } from './_parts';

/* ── Main component ───────────────────────────────────────────────── */
export default function ArticleClient({ article, blocks, childrenMap, otherArticles, headings = [] }) {
  const readTime = estimateReadTime(blocks);
  const { activeSlug, progress } = useArticleToc(headings);
  const hasTopic = article.topic?.length > 0;

  /* ── Shared reactions state ─────────────────────────────────────── */
  const { counts, userReaction, loading, handleReact, total } = useReactions(article.slug);

  /* ── Sticky bar visibility ──────────────────────────────────────── */
  const [hasScrolled, setHasScrolled] = useState(false);
  const [cardsInView, setCardsInView] = useState(false);
  const cardsRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsInView(true);
        } else {
          setCardsInView(entry.boundingClientRect.top < 0);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      {/* Mobile / tablet: fixed progress bar */}
      <ArticleProgressBar headings={headings} activeSlug={activeSlug} progress={progress} />

      {/* ── Floating pill bar — outside stacking context ─────────────── */}
      <AnimatePresence>
        {hasScrolled && !cardsInView && (
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            style={{
              position: 'fixed',
              bottom: 24,
              left: '50%',
              x: '-50%',
              zIndex: 50,
              background: 'var(--fg)',
              border: '1px solid var(--fg-muted)',
              borderRadius: 'var(--radius-card)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
              padding: '10px 14px',
            }}
          >
            <ArticleReactionPills
              counts={counts}
              userReaction={userReaction}
              onReact={handleReact}
              loading={loading}
              inverse
            />
          </m.div>
        )}
      </AnimatePresence>

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

            {/* ── Left: fixed sidebar (xl+) — left of centered 700px column */}
            <aside
              className="hidden xl:block"
              style={{
                position: 'fixed',
                top: 88,
                left: 'calc(50vw - 602px)',
                width: 220,
                zIndex: 10,
              }}
            >
              <ArticleSidebar headings={headings} activeSlug={activeSlug} />
            </aside>

            {/* ── Right: article content ─────────────────────────── */}
            <div style={{ flex: 1, minWidth: 0, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>

              {/* Article header */}
              <m.div variants={stagger} initial="hidden" animate="visible">

                {/* Back link */}
                <m.div variants={fadeUp}>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 t-caption text-fg-muted hover:text-fg no-underline mb-10 transition-colors duration-200"
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

              {/* ── Reactions — end of article card grid ──────────── */}
              <div ref={cardsRef} style={{ borderTop: '1px solid var(--border)', padding: '48px 0' }}>
                <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
                  <m.h3 variants={fadeUp} className="t-h3 text-fg" style={{ marginBottom: 8 }}>
                    How do you feel about this article?
                  </m.h3>
                  <m.div variants={fadeUp}>
                    <TotalCount total={total} loading={loading} />
                  </m.div>
                  <m.div variants={fadeUp}>
                    <ArticleReactionCards
                      counts={counts}
                      userReaction={userReaction}
                      onReact={handleReact}
                      loading={loading}
                    />
                  </m.div>
                </m.div>
              </div>

            </div>
          </div>
        </div>

        {/* ── More writing ─────────────────────────────────────────── */}
        {otherArticles.length > 0 && (
          <div
            id="more-writing"
            className="border-t border-[var(--border)]"
            style={{ padding: 'clamp(48px, 8vw, 80px) 0' }}
          >
            <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
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
