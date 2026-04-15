'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { RenderBlocks } from '@/app/components/sections/NotionBlocks';
import GradientBackground from '@/app/components/layout/GradientBackground';
import { fadeUp, stagger, vp } from '@/lib/motion';
import ArticleSidebar from './ArticleSidebar';
import ArticleProgressBar from './ArticleProgressBar';
import ArticleReactions from '@/app/components/sections/ArticleReactions';
import { ArrowIcon } from '@/app/components/ui/icons';

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

/* ── Small writing card used in "more writing" footer grid ───────── */
function MiniArticleCard({ article }) {
  return (
    <Link
      href={article.href}
      className="flex flex-col gap-2 no-underline p-5 bg-[var(--surface-1)] border border-[var(--border)] rounded-[var(--radius-card)] transition-[border-color,background] duration-200 hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]"
    >
      <span className="text-2xl">{article.emoji}</span>
      <p className="t-body3 font-semibold text-fg m-0 leading-[1.35]">
        {article.title}
      </p>
      <span className="t-caption text-fg-muted inline-flex items-center gap-1 mt-auto opacity-70">
        Read <ArrowIcon size={11} />
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

      <div className="relative z-[1]">

        {/* ── Two-column layout — 1200px total ───────────────────── */}
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
          <div
            className="flex items-start gap-14"
            style={{ paddingTop: 'clamp(80px, 10vw, 120px)' }}
          >

            {/* ── Left: persistent sticky sidebar (xl+) ──────────── */}
            <aside className="hidden xl:block w-[220px] shrink-0 sticky top-[50vh] -translate-y-1/2 self-start">
              <ArticleSidebar headings={headings} activeSlug={activeSlug} />
            </aside>

            {/* ── Right: article content ─────────────────────────── */}
            <div className="flex-1 min-w-0">

              {/* Article header */}
              <m.div variants={stagger} initial="hidden" animate="visible">

                {/* Back link */}
                <m.div variants={fadeUp}>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 t-caption text-fg-muted no-underline mb-10 transition-colors duration-200 hover:text-fg"
                  >
                    <BackArrow />
                    Back to writing
                  </Link>
                </m.div>

                {/* Emoji */}
                <m.div
                  variants={fadeUp}
                  className="leading-none mb-6"
                  style={{ fontSize: 'clamp(48px, 8vw, 72px)' }}
                >
                  {article.emoji}
                </m.div>

                {/* Overline — topic + read time */}
                <m.p variants={fadeUp} className="t-overline text-fg-muted mb-4">
                  {hasTopic ? `${article.topic[0]} · ` : ''}{readTime} min read
                </m.p>

                {/* Title */}
                <m.h1 variants={fadeUp} className="t-h1 text-fg mb-0 leading-[1.1]">
                  {article.title}
                </m.h1>

                {/* Hook pull-quote */}
                {article.desc && (
                  <m.blockquote
                    variants={fadeUp}
                    className="mt-8 px-6 py-5 bg-brand-muted rounded-r-xl"
                    style={{ borderLeft: '3px solid var(--brand)' }}
                  >
                    <p className="t-body1 text-fg-muted m-0 italic leading-relaxed opacity-90">
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
                className="mt-10 origin-left"
              >
                <div className="h-px w-full" style={{ background: 'var(--border-strong)' }} />
              </m.div>

              {/* Article body */}
              <m.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="pt-12 pb-20"
              >
                {blocks.length > 0 ? (
                  <div className="flex flex-col gap-5">
                    <RenderBlocks blocks={blocks} childrenMap={childrenMap} tocHeadings={headings} />
                  </div>
                ) : (
                  <p className="t-body2 text-fg-muted opacity-50">
                    Article content coming soon.
                  </p>
                )}
              </m.div>

              {/* Reactions */}
              <div className="border-t border-theme">
                <ArticleReactions slug={article.slug} />
              </div>

            </div>
          </div>
        </div>

        {/* ── More writing ─────────────────────────────────────────── */}
        {otherArticles.length > 0 && (
          <div
            id="more-writing"
            className="border-t border-theme"
            style={{ padding: 'clamp(48px, 8vw, 80px) 0' }}
          >
            <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
              <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
                <m.p variants={fadeUp} className="t-overline text-fg-muted mb-6">
                  More writing
                </m.p>
                <div
                  className="grid gap-4"
                  style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
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
