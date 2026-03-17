import Link from 'next/link';
import GradientBackground from '../../components/layout/GradientBackground';
import { RenderBlocks } from '../../components/sections/NotionBlocks';
import { getProjectPageData } from '../../../lib/notion-project';

/* Always fetch fresh — Notion signed URLs expire in ~1 hour */
export const dynamic = 'force-dynamic';

/* ── Back arrow icon ─────────────────────────────────────── */
function BackArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Tag chip ────────────────────────────────────────────── */
function Tag({ label }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full t-caption font-medium"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg-muted)' }}
    >
      {label}
    </span>
  );
}

/* ── Wrapper ─────────────────────────────────────────────── */
function W({ children, className = '' }) {
  return (
    <div className={`max-w-[800px] mx-auto px-6 sm:px-10 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default async function ProjectPage({ params }) {
  const { id } = await params;

  let data = null;
  let error = null;

  try {
    data = await getProjectPageData(id);
  } catch (err) {
    error = err.message;
  }

  if (error) {
    return (
      <>
        <GradientBackground />
        <main className="relative min-h-screen pt-32 pb-24" style={{ color: 'var(--fg)', zIndex: 1 }}>
          <W>
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 t-caption font-medium text-fg-muted hover:text-fg transition-colors mb-10"
            >
              <BackArrow /> Back to Work
            </Link>
            <p className="t-body2 text-fg-muted">Could not load project: {error}</p>
          </W>
        </main>
      </>
    );
  }

  const { meta, blocks, childrenMap } = data;

  /* First block: if it's an image, use as full-width hero banner */
  const heroImageBlock = blocks[0]?.type === 'image' ? blocks[0] : null;
  const contentBlocks  = heroImageBlock ? blocks.slice(1) : blocks;

  /* Hero banner image URL */
  const heroBannerUrl = heroImageBlock
    ? (heroImageBlock.image?.type === 'external'
        ? heroImageBlock.image.external.url
        : heroImageBlock.image?.file?.url)
    : meta.cover;

  return (
    <>
      <GradientBackground />
      <main className="relative min-h-screen pt-20 pb-24" style={{ color: 'var(--fg)', zIndex: 1 }}>

        {/* ── Back nav ── */}
        <W className="pt-8 pb-0">
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 t-caption font-medium text-fg-muted hover:text-fg transition-colors"
          >
            <BackArrow /> Back to Work
          </Link>
        </W>

        {/* ── Hero ── */}
        <W className="pt-8 pb-10">
          {/* Tags */}
          {meta.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {meta.tags.map((tag) => <Tag key={tag} label={tag} />)}
            </div>
          )}

          {/* Title */}
          <h1 className="t-h2 mb-4" style={{ textWrap: 'balance' }}>{meta.title}</h1>

          {/* Description */}
          {meta.desc && (
            <p className="t-body1 text-fg-muted leading-relaxed mb-6" style={{ maxWidth: '65ch' }}>
              {meta.desc}
            </p>
          )}

          {/* External link CTA if project has a live URL */}
          {meta.url && (
            <a
              href={meta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 t-body3 font-semibold px-5 py-2.5 rounded-full border-2 transition-colors duration-200"
              style={{ borderColor: '#4839ca', color: '#4839ca' }}
            >
              View Live Project
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </W>

        {/* ── Cover / hero image ── */}
        {heroBannerUrl && (
          <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 mb-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroBannerUrl}
              alt={meta.title}
              className="w-full rounded-2xl object-cover"
              style={{ maxHeight: 520 }}
              loading="eager"
            />
          </div>
        )}

        {/* ── Content blocks ── */}
        <W>
          {contentBlocks.length > 0 ? (
            <div className="flex flex-col gap-5">
              <RenderBlocks
                blocks={contentBlocks}
                childrenMap={childrenMap}
                skipDatabase
                skipDivider={false}
              />
            </div>
          ) : (
            /* Empty page — point to Notion */
            <div
              className="flex flex-col items-center gap-5 py-20 text-center rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <p className="t-body1 text-fg-muted">Full case study lives on Notion.</p>
              <a
                href={meta.notionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 t-body3 font-semibold px-5 py-2.5 rounded-full border-2 transition-colors duration-200"
                style={{ borderColor: '#4839ca', color: '#4839ca' }}
              >
                Read on Notion
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          )}
        </W>

        {/* ── Footer CTA ── */}
        <W className="mt-20 pt-10 border-t border-theme">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="t-h5 font-bold mb-1">Liked this project?</p>
              <p className="t-body2 text-fg-muted">Let&apos;s talk about what we can build together.</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link href="/work" className="t-body3 font-medium text-fg-muted hover:text-fg transition-colors">
                ← More work
              </Link>
              <a
                href="mailto:abhisxn@gmail.com"
                className="inline-flex items-center gap-2 t-body3 font-semibold px-5 py-2.5 rounded-full transition-colors duration-200"
                style={{ background: '#4839ca', color: '#ffffff' }}
              >
                Get in touch
              </a>
            </div>
          </div>
        </W>

      </main>
    </>
  );
}
