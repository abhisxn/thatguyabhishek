import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import projectsJson from '../../../data/projects.json';
import GradientBackground from '../../components/layout/GradientBackground';
import { SectionedBlocks } from '../../components/sections/ProjectSections';
import ProjectsExpandableGrid from '../../components/sections/ProjectsExpandableGrid';
import { getProjectPageData } from '../../../lib/notion-project';
import { findProjectBySlug } from '../../../lib/notion-work';
import W from '../../components/ui/W';
import DevBlockMap from '../../components/dev/DevBlockMap';
import ProjectPageHero from '../../components/sections/ProjectPageHero';
import FadeSection from '../../components/ui/FadeSection';

// ISR: revalidate every hour — Notion signed image URLs expire after ~1 hour
export const revalidate = 3600;

// Do not pre-render at build time — pages render on first request then cache.
// generateStaticParams + recursive Notion fetches exceed Vercel's 60s build
// per-page limit. ISR via unstable_cache handles caching after first visit.
export const dynamicParams = true;

const BASE_URL = 'https://thatguyabhishek.com';

// ─── Metadata — reads from static JSON, always instant ───────────────────────

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projectsJson.find((p) => p.slug === slug);
  if (!project) return {};

  const title       = project.title;
  const description = project.desc || `A product design case study by Abhishek Saxena.`;
  const url         = `${BASE_URL}/work/${slug}`;
  const image       = project.cover || `${BASE_URL}/og-default.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article', url, title, description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      authors: ['Abhishek Saxena'],
      tags: project.tags,
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

// ─── Skeleton for the Suspense boundary ──────────────────────────────────────

function ContentSkeleton() {
  const pulse = 'animate-pulse rounded';
  const bg    = { background: 'var(--surface)' };
  return (
    <>
      {/* Banner placeholder */}
      <W className="mb-0">
        <div className={`${pulse} w-full rounded-2xl`} style={{ height: 420, ...bg }} />
      </W>
      {/* Content lines */}
      <W className="py-16">
        <div className="space-y-3">
          {[100, 95, 88, 0, 100, 82, 91, 70, 0, 100, 78, 86].map((w, i) =>
            w === 0 ? (
              <div key={i} className="h-5" />
            ) : (
              <div key={i} className={`${pulse} h-4`} style={{ width: `${w}%`, ...bg }} />
            )
          )}
        </div>
      </W>
    </>
  );
}

// ─── Small UI atoms ──────────────────────────────────────────────────────────

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

// ─── ProjectContent — async, streams in via Suspense ─────────────────────────
// Everything that requires a Notion API call lives here.

async function ProjectContent({ slug, projectJson }) {
  // Fast path: ID from static JSON. Fallback: live Notion query for new projects.
  const notionId = projectJson?.id ?? (await findProjectBySlug(slug))?.id;
  if (!notionId) notFound();

  let data  = null;
  let error = null;
  try {
    data = await getProjectPageData(notionId);
  } catch (err) {
    error = err.message;
  }

  if (error) {
    return (
      <W className="py-20">
        <p className="t-body2 text-fg-muted">Could not load project content: {error}</p>
      </W>
    );
  }

  const { meta, blocks, childrenMap } = data;

  const heroImageBlock = blocks[0]?.type === 'image' ? blocks[0] : null;
  const contentBlocks  = heroImageBlock ? blocks.slice(1) : blocks;

  const bannerUrl = heroImageBlock
    ? (heroImageBlock.image?.type === 'external'
        ? heroImageBlock.image.external.url
        : heroImageBlock.image?.file?.url)
    : meta.cover;

  return (
    <>
      {/* Banner image — authoritative from Notion */}
      {bannerUrl && (
        <W className="mb-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerUrl}
            alt={projectJson?.title ?? meta.title}
            className="w-full rounded-2xl object-cover"
            style={{ maxHeight: 560 }}
            loading="eager"
          />
        </W>
      )}

      {/* Content blocks */}
      <DevBlockMap blocks={blocks} childrenMap={childrenMap} />
      {contentBlocks.length > 0 ? (
        <SectionedBlocks blocks={contentBlocks} childrenMap={childrenMap} />
      ) : (
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
              className="inline-flex items-center gap-2 t-body3 font-semibold px-5 py-3 rounded-full border-2 transition-colors duration-200 hover:bg-[var(--brand)] hover:text-white"
              style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}
            >
              Read on Notion <ArrowRight />
            </a>
          </div>
        </W>
      )}
    </>
  );
}

// ─── Page — renders hero instantly, streams content ───────────────────────────

export default async function ProjectPage({ params }) {
  const { slug }   = await params;
  const project    = projectsJson.find((p) => p.slug === slug);
  // Unknown slug? ProjectContent will try Notion and call notFound() if absent.

  // JSON-LD from static data — no Notion needed
  const projectJsonLd = project ? {
    '@context': 'https://schema.org',
    '@type':    'CreativeWork',
    name:        project.title,
    description: project.desc || undefined,
    url:         `${BASE_URL}/work/${slug}`,
    image:       project.cover || `${BASE_URL}/og-default.jpg`,
    author:      { '@type': 'Person', name: 'Abhishek Saxena', url: BASE_URL },
    keywords:    project.tags?.join(', ') || undefined,
  } : null;

  return (
    <>
      {projectJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
        />
      )}
      <GradientBackground />
      <main className="relative min-h-screen" style={{ color: 'var(--fg)', zIndex: 1 }}>

        {/* ── Back nav — instant ── */}
        <W className="pt-24 pb-0">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 t-caption font-medium text-fg-muted hover:text-fg transition-colors"
          >
            <BackArrow /> Back to Work
          </Link>
        </W>

        {/* ── Hero — instant, from static JSON ── */}
        {project && <ProjectPageHero project={project} />}

        {/* ── Banner + content — streams from Notion ── */}
        <Suspense fallback={<ContentSkeleton />}>
          <ProjectContent slug={slug} projectJson={project} />
        </Suspense>

        {/* ── More projects — instant, from static JSON ── */}
        {project && projectsJson.filter((p) => p.slug !== slug).length > 0 && (
          <W className="py-16 mt-4">
            <ProjectsExpandableGrid
              projects={projectsJson}
              excludeSlug={slug}
              heading="More Projects"
              viewAllLabel="View All Projects"
            />
          </W>
        )}

        {/* ── Footer CTA ── */}
        <FadeSection>
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
                  className="inline-flex items-center gap-2 t-body3 font-semibold px-5 py-3 rounded-full btn-filled-brand"
                >
                  Get in touch
                </a>
              </div>
            </div>
          </W>
        </FadeSection>

      </main>
    </>
  );
}
