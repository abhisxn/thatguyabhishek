/* ─────────────────────────────────────────────────────────────────────────────
 * LinkCalloutCard — triggered by 🌐 callout emoji
 *
 * Layout (per Figma node 1914:829):
 *   Left:  title (body2 semibold) + optional body + [bracket] CTA label
 *   Right: 200px OG thumbnail, flush to edge, full card height
 *
 * Default export is an async server component that fetches OG image via
 * Microlink API (handles JS-rendered pages, bot-blocked sites).
 * LinkCalloutCardUI is the pure visual shell for style-guide / client use.
 * ──────────────────────────────────────────────────────────────────────────── */

import { CALLOUT_BG } from './card-utils';

/* ── OG image fetch via Microlink ────────────────────────────────────────── */

async function fetchOgImage(url) {
  if (!url) return null;
  try {
    const res = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=false`,
      { next: { revalidate: 86400 }, headers: { Accept: 'application/json' } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.image?.url ?? null;
  } catch {
    return null;
  }
}

/* ── Pure UI component ───────────────────────────────────────────────────── */

export function LinkCalloutCardUI({ title, body, btnLabel, href, ogImage, bg = 'default' }) {
  const { wrap, vars } = CALLOUT_BG[bg] ?? CALLOUT_BG.default;
  const Wrapper = href ? 'a' : 'div';
  const wrapperProps = href
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      style={vars}
      className={[
        'flex overflow-hidden rounded-2xl no-underline',
        wrap,
        href ? 'hover:border-[var(--border-hover)] hover:-translate-y-0.5 transition-all duration-200' : '',
      ].join(' ')}
    >
      {/* ── Left: content ── */}
      <div className="flex flex-1 flex-col gap-2 p-5 min-w-0">
        {title && (
          <p className="t-body2 font-semibold leading-snug text-[var(--fg)] line-clamp-3">
            {title}
          </p>
        )}
        {body && (
          <p className="t-body3 leading-relaxed text-[var(--fg-muted)] line-clamp-2">
            {body}
          </p>
        )}
        {btnLabel && (
          <span className="mt-auto pt-2 t-body2 font-semibold text-[var(--brand)] inline-flex items-center gap-1.5">
            {btnLabel}
            <svg
              className="size-3.5 flex-shrink-0"
              fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5 19.5 4.5M19.5 4.5H8.25M19.5 4.5v11.25" />
            </svg>
          </span>
        )}
      </div>

      {/* ── Right: OG thumbnail — full card height ── */}
      {ogImage && (
        <div className="w-[120px] sm:w-[200px] shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ogImage}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </Wrapper>
  );
}

/* ── Async server component (default export) ─────────────────────────────── */

export default async function LinkCalloutCard({ title, body, btnLabel, href, bg = 'default' }) {
  const ogImage = await fetchOgImage(href);
  return (
    <LinkCalloutCardUI
      title={title}
      body={body}
      btnLabel={btnLabel}
      href={href}
      ogImage={ogImage}
      bg={bg}
    />
  );
}
