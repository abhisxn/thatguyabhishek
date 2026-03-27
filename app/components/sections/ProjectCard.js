import Link from 'next/link';
import Card from '../ui/Card';
import { styleForNotion } from '../ui/card-utils';
import { getTitle, getDescription, getSummary, getTags, getCoverUrl } from '../../../lib/notion-work';
import { slugify } from '../../../lib/slugify';

/* ── Shared thumbnail resolver ───────────────────────────────────────────────
 * Single source of truth used by ProjectCard (and therefore both ProjectsGrid
 * and ProjectsCarousel). Accepts either shape:
 *   • flat  — { title, desc, tags, cover, slug }  (from projects.json)
 *   • live  — Notion page object with .properties  (from dataSources.query)
 * ─────────────────────────────────────────────────────────────────────────── */
function resolveProjectProps(page) {
  const isFlat = !page.properties;
  return {
    title:    isFlat ? page.title           : getTitle(page),
    desc:     isFlat ? page.desc            : getDescription(page),
    summary:  isFlat ? page.summary         : getSummary(page),
    tags:     isFlat ? (page.tags ?? [])    : getTags(page),
    coverUrl: isFlat ? (page.cover || null) : getCoverUrl(page),
    url:      isFlat ? `/work/${page.slug}` : `/work/${slugify(getTitle(page))}`,
    ...(isFlat
      ? { size: page.featured ? 'l' : 's', cardStyle: 'default' }
      : styleForNotion(page, 'db')),
  };
}

const SUMMARY_SIZES = new Set(['s', 'xs', 'm']);

export function ProjectCard({ page, size: sizeProp, cardStyle: styleProp, showDesc }) {
  const { title, desc, summary, tags, coverUrl, url, size: inferredSize, cardStyle: inferredStyle } =
    resolveProjectProps(page);

  const size      = sizeProp   ?? inferredSize;
  const cardStyle = styleProp  ?? inferredStyle;
  // L/XL cards use the full description; S/M/XS cards use the short summary
  const displayDesc = SUMMARY_SIZES.has(size) ? (summary || desc) : desc;

  return (
    <Card
      size={size}
      cardStyle={cardStyle}
      title={title}
      desc={displayDesc}
      tags={tags}
      img={coverUrl}
      href={url}
      altText={title}
      loading="lazy"
      showDesc={showDesc}
    />
  );
}

/* ── Full grid — work listing page ──────────────────────────────────────────
 * 3-column layout, size s cards, desc shown as summary.
 * ─────────────────────────────────────────────────────────────────────────── */
export function ProjectsGrid({ projects, size, cardStyle }) {
  if (!projects?.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((page) => (
        <ProjectCard
          key={page.id}
          page={page}
          size={size ?? 's'}
          cardStyle={cardStyle}
          showDesc
        />
      ))}
    </div>
  );
}

/* ── Horizontal carousel — project detail pages & homepage sections ─────────
 * Shows 3 cards at a time with CSS scroll-snap. No JS needed.
 * ─────────────────────────────────────────────────────────────────────────── */
export function ProjectsCarousel({
  projects,
  size,
  cardStyle,
  heading   = 'More Projects',
  viewAllHref = '/work',
}) {
  const items = projects?.slice(0, 9) ?? [];
  if (!items.length) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="t-h4 font-semibold">{heading}</p>
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1.5 t-body3 font-semibold px-4 py-2 rounded-full btn-outline-brand"
        >
          View all
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Scroll track */}
      <div
        className="flex gap-5 overflow-x-auto scroll-smooth pb-2"
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {items.map((page) => (
          <div
            key={page.id}
            className="shrink-0 w-[calc(33.333%-14px)] min-w-[240px]"
            style={{ scrollSnapAlign: 'start' }}
          >
            <ProjectCard
              page={page}
              size={size ?? 's'}
              cardStyle={cardStyle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
