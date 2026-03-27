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

// ISR: revalidate every hour — Notion signed image URLs expire after ~1 hour
export const revalidate = 3600;

const BASE_URL = 'https://thatguyabhishek.com';

// Pre-render all known project pages at build time
export function generateStaticParams() {
  return projectsJson.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projectsJson.find((p) => p.slug === slug);
  if (!project) return {};

  const title = project.title;
  const description = project.desc || `A product design case study by Abhishek Saxena.`;
  const url = `${BASE_URL}/work/${slug}`;
  const image = project.cover || `${BASE_URL}/og-default.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      authors: ['Abhishek Saxena'],
      tags: project.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

async function resolveNotionId(slug) {
  // Fast path: static JSON
  const match = projectsJson.find((p) => p.slug === slug);
  if (match) return match.id;

  // Fallback: live Notion query (new projects not yet synced to JSON)
  const page = await findProjectBySlug(slug);
  return page?.id ?? null;
}

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

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const notionId = await resolveNotionId(slug);

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

  const heroImageBlock = blocks[0]?.type === 'image' ? blocks[0] : null;
  const contentBlocks  = heroImageBlock ? blocks.slice(1) : blocks;

  const heroBannerUrl = heroImageBlock
    ? (heroImageBlock.image?.type === 'external'
        ? heroImageBlock.image.external.url
        : heroImageBlock.image?.file?.url)
    : meta.cover;

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: meta.title,
    description: meta.desc || undefined,
    url: `${BASE_URL}/work/${slug}`,
    image: heroBannerUrl || undefined,
    author: {
      '@type': 'Person',
      name: 'Abhishek Saxena',
      url: BASE_URL,
    },
    keywords: meta.tags?.join(', ') || undefined,
    dateModified: meta.lastEdited || undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
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

          <h1 className="t-display mb-5">
            {meta.title}
          </h1>

          {meta.desc && (
            <p className="t-body1 text-fg-muted leading-relaxed mb-8">
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

        {/* ── Hero banner ── */}
        {heroBannerUrl && (
          <W className="mb-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroBannerUrl}
              alt={meta.title}
              className="w-full rounded-2xl object-cover"
              style={{ maxHeight: 560 }}
              loading="eager"
            />
          </W>
        )}

        {/* ── Sectioned content ── */}
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
                className="inline-flex items-center gap-2 t-body3 font-semibold px-5 py-2.5 rounded-full border-2 transition-colors duration-200 hover:bg-[#4839ca] hover:text-white"
                style={{ borderColor: '#4839ca', color: '#4839ca' }}
              >
                Read on Notion <ArrowRight />
              </a>
            </div>
          </W>
        )}

        {/* ── More projects grid ── */}
        {projectsJson.filter((p) => p.slug !== slug).length > 0 && (
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
                className="inline-flex items-center gap-2 t-body3 font-semibold px-5 py-2.5 rounded-full btn-filled-brand"
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
