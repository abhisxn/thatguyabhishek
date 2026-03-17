import Link from 'next/link';
import GradientBackground from '../../components/layout/GradientBackground';
import { RenderBlocks } from '../../components/sections/NotionBlocks';
import { getProjectPageData } from '../../../lib/notion-project';

/* Always fetch fresh — Notion signed URLs expire in ~1 hour */
export const dynamic = 'force-dynamic';

/* ─────────────────────────────────────────────────────────────
 * 5 SECTION STYLES
 *
 * Sections are blocks grouped between dividers.
 * Each section gets one of 5 styles, cycling 0→4→0→…
 *
 * 0  plain      — transparent, standard layout
 * 1  surface    — var(--surface) band, subtle border top/bottom
 * 2  dark       — deep navy bg, inverted text
 * 3  accent     — brand-purple left-border strip + tinted bg
 * 4  spotlight  — centered, radial-gradient overlay, bold typography
 * ──────────────────────────────────────────────────────────── */
const SECTION_STYLES = [
  /* 0 — plain */
  {
    wrap:    {},
    inner:   {},
    textClr: 'var(--fg)',
    mutedClr:'var(--fg-muted)',
  },
  /* 1 — surface */
  {
    wrap:  {
      background:  'var(--surface)',
      borderTop:   '1px solid var(--border)',
      borderBottom:'1px solid var(--border)',
    },
    inner:   {},
    textClr: 'var(--fg)',
    mutedClr:'var(--fg-muted)',
  },
  /* 2 — dark */
  {
    wrap:  { background: '#0b1f3a' },
    inner: {},
    textClr: '#ffffff',
    mutedClr:'rgba(255,255,255,0.6)',
  },
  /* 3 — accent */
  {
    wrap:  {
      background:  'color-mix(in srgb, #4839ca 6%, var(--bg))',
      borderTop:   '1px solid color-mix(in srgb, #4839ca 20%, transparent)',
      borderBottom:'1px solid color-mix(in srgb, #4839ca 20%, transparent)',
      borderLeft:  '4px solid #4839ca',
    },
    inner: {},
    textClr: 'var(--fg)',
    mutedClr:'var(--fg-muted)',
  },
  /* 4 — spotlight */
  {
    wrap:  {
      background:   'var(--surface)',
      borderTop:    '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      position:     'relative',
      overflow:     'hidden',
    },
    inner: { position: 'relative', zIndex: 1 },
    textClr: 'var(--fg)',
    mutedClr:'var(--fg-muted)',
    blob: true,
  },
];

/* ── Helpers ─────────────────────────────────────────────── */
function BackArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

/* Full-width outer / constrained inner */
function W({ children, outerStyle, innerStyle, className = '' }) {
  return (
    <div style={outerStyle}>
      <div
        className={`max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 ${className}`}
        style={innerStyle}
      >
        {children}
      </div>
    </div>
  );
}

/* ── Section splitter ────────────────────────────────────── */
function splitSections(blocks) {
  const sections = [];
  let current = [];
  for (const b of blocks) {
    if (b.type === 'divider') {
      if (current.length) sections.push(current);
      current = [];
    } else {
      current.push(b);
    }
  }
  if (current.length) sections.push(current);
  return sections;
}

/* ── Section renderer ────────────────────────────────────── */
function Section({ blocks, childrenMap, styleIndex }) {
  const s = SECTION_STYLES[styleIndex % SECTION_STYLES.length];

  return (
    <section style={{ color: s.textClr, '--section-muted': s.mutedClr, ...s.wrap }}>
      {/* Spotlight radial blob */}
      {s.blob && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 60% 80% at 50% 50%, color-mix(in srgb, #4839ca 8%, transparent) 0%, transparent 70%)',
          }}
        />
      )}
      <div
        className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16"
        style={s.inner}
      >
        {/* For dark/accent sections, apply muted colour override via CSS custom prop */}
        <div
          className="flex flex-col gap-5"
          style={{ '--tw-prose-body': s.mutedClr }}
        >
          <RenderBlocks
            blocks={blocks}
            childrenMap={childrenMap}
            skipDatabase
            skipDivider
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
 * PAGE
 * ──────────────────────────────────────────────────────────── */
export default async function ProjectPage({ params }) {
  const { id } = await params;

  let data  = null;
  let error = null;

  try {
    data = await getProjectPageData(id);
  } catch (err) {
    error = err.message;
  }

  /* ── Error state ── */
  if (error) {
    return (
      <>
        <GradientBackground />
        <main className="relative min-h-screen pt-32 pb-24" style={{ color: 'var(--fg)', zIndex: 1 }}>
          <W className="pt-8">
            <Link href="/work" className="inline-flex items-center gap-1.5 t-caption font-medium text-fg-muted hover:text-fg transition-colors mb-10">
              <BackArrow /> Back to Work
            </Link>
            <p className="t-body2 text-fg-muted">Could not load project: {error}</p>
          </W>
        </main>
      </>
    );
  }

  const { meta, blocks, childrenMap } = data;

  /* Strip leading image → use as hero banner */
  const heroImageBlock = blocks[0]?.type === 'image' ? blocks[0] : null;
  const contentBlocks  = heroImageBlock ? blocks.slice(1) : blocks;

  const heroBannerUrl = heroImageBlock
    ? (heroImageBlock.image?.type === 'external'
        ? heroImageBlock.image.external.url
        : heroImageBlock.image?.file?.url)
    : meta.cover;

  /* Split content at dividers into sections */
  const sections = splitSections(contentBlocks);

  return (
    <>
      <GradientBackground />
      <main className="relative min-h-screen" style={{ color: 'var(--fg)', zIndex: 1 }}>

        {/* ── Back nav ── */}
        <W className="pt-24 pb-0">
          <Link href="/work" className="inline-flex items-center gap-1.5 t-caption font-medium text-fg-muted hover:text-fg transition-colors">
            <BackArrow /> Back to Work
          </Link>
        </W>

        {/* ── Hero ── */}
        <W className="pt-8 pb-12">
          {meta.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {meta.tags.map((tag) => <Tag key={tag} label={tag} />)}
            </div>
          )}

          <h1 className="t-h1 mb-5" style={{ textWrap: 'balance', maxWidth: '18ch' }}>
            {meta.title}
          </h1>

          {meta.desc && (
            <p className="t-body1 text-fg-muted leading-relaxed mb-8" style={{ maxWidth: '60ch' }}>
              {meta.desc}
            </p>
          )}

          {meta.url && (
            <a
              href={meta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 t-body3 font-semibold px-5 py-2.5 rounded-full border-2 transition-colors duration-200 hover:bg-[#4839ca] hover:text-white"
              style={{ borderColor: '#4839ca', color: '#4839ca' }}
            >
              View Live Project <ArrowRight />
            </a>
          )}
        </W>

        {/* ── Hero banner image ── */}
        {heroBannerUrl && (
          <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 mb-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroBannerUrl}
              alt={meta.title}
              className="w-full rounded-2xl object-cover"
              style={{ maxHeight: 560 }}
              loading="eager"
            />
          </div>
        )}

        {/* ── Sectioned content ── */}
        {sections.length > 0 ? (
          <div className={heroBannerUrl ? 'mt-0' : ''}>
            {sections.map((sectionBlocks, i) => (
              <Section
                key={i}
                blocks={sectionBlocks}
                childrenMap={childrenMap}
                styleIndex={i}
              />
            ))}
          </div>
        ) : (
          /* Empty page — point to Notion */
          <W className="py-20">
            <div
              className="flex flex-col items-center gap-5 py-20 text-center rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <p className="t-body1 text-fg-muted">Full case study lives on Notion.</p>
              <a
                href={meta.notionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 t-body3 font-semibold px-5 py-2.5 rounded-full border-2 transition-colors duration-200 hover:bg-[#4839ca] hover:text-white"
                style={{ borderColor: '#4839ca', color: '#4839ca' }}
              >
                Read on Notion <ArrowRight />
              </a>
            </div>
          </W>
        )}

        {/* ── Footer CTA ── */}
        <W className="py-16 border-t border-theme mt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="t-h4 font-bold mb-1">Liked this project?</p>
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
