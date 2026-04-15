'use client';

import { useState } from 'react';

/* Returns the correct CSS aspect-ratio value for a given embed URL */
function getAspectRatio(url) {
  if (!url) return '16/9';
  // Google Slides pubembed — Google's own embed dimensions are 960×569
  if (/pubembed/.test(url)) return '960/569';
  // Google Drive preview, Sheets, Docs — use 4:3 which is more doc-like
  if (/\/preview(\?|$)/.test(url) || /\/htmlview(\?|$)/.test(url)) return '4/3';
  // Everything else (YouTube, Vimeo, Loom, Figma) — 16:9
  return '16/9';
}

function isGoogleAuthBlocked(url) {
  if (!url) return false;
  const isGoogle = /drive\.google\.com|docs\.google\.com/.test(url);
  const isEmbeddable = /\/pubembed(\?|$)/.test(url) || /\/preview(\?|$)/.test(url) || /\/htmlview(\?|$)/.test(url);
  return isGoogle && !isEmbeddable;
}

/* Bookmark card — rich horizontal link card for Notion bookmark blocks */
export function BookmarkCard({ url, caption }) {
  const [faviconError, setFaviconError] = useState(false);

  let domain = url;
  try { domain = new URL(url).hostname.replace(/^www\./, ''); } catch {}

  const isFigma = domain.includes('figma.com');
  const label = isFigma
    ? 'Check out this figma file for details'
    : caption?.length ? caption.map((t) => t.plain_text).join('') : domain;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 w-full px-5 py-4 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-2)] transition-all no-underline"
    >
      {/* Favicon */}
      <div className="flex-shrink-0 size-9 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center overflow-hidden">
        {!faviconError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
            alt=""
            width={20}
            height={20}
            onError={() => setFaviconError(true)}
            className="size-5 object-contain"
          />
        ) : (
          <svg className="size-4 text-[var(--fg-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
          </svg>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="t-body3 font-medium text-[var(--fg)] truncate leading-snug">{label}</p>
        <p className="t-caption text-[var(--fg-muted)] truncate mt-0.5">{domain}</p>
      </div>

      {/* Arrow */}
      <svg
        className="flex-shrink-0 size-4 text-[var(--fg-muted)] group-hover:text-[var(--fg)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5 19.5 4.5M19.5 4.5H8.25M19.5 4.5v11.25" />
      </svg>
    </a>
  );
}

/* Link card — used when the URL can't be iframed (Google auth-required) */
export function EmbedLinkCard({ url, label = 'View file' }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-4 px-6 py-5 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors no-underline"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex-shrink-0 size-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center">
          <svg className="size-5 text-[var(--fg-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="t-body3 font-medium text-[var(--fg)] truncate">{label}</p>
          <p className="t-caption text-[var(--fg-muted)] truncate">{url}</p>
        </div>
      </div>
      <div className="flex-shrink-0 t-caption font-medium px-4 py-2 rounded-full border border-[var(--border)] text-[var(--fg-muted)] group-hover:text-[var(--fg)] group-hover:border-[var(--border-hover)] transition-colors whitespace-nowrap">
        Open →
      </div>
    </a>
  );
}

export default function EmbedBlock({ src, originalUrl, title = 'Embedded content' }) {
  const [failed, setFailed] = useState(false);

  if (isGoogleAuthBlocked(src)) {
    return <EmbedLinkCard url={originalUrl || src} label={title} />;
  }

  const aspectRatio = getAspectRatio(src);

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{ aspectRatio }}
    >
      {!failed ? (
        <iframe
          src={src}
          width="100%"
          height="100%"
          style={{ display: 'block', border: 'none' }}
          allowFullScreen
          allow="autoplay; fullscreen"
          title={title}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[var(--surface-1)] text-[var(--fg-muted)]">
          <svg className="size-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <p className="t-body3 font-medium">Could not load embed</p>
          {(originalUrl || src) && (
            <a href={originalUrl || src} target="_blank" rel="noopener noreferrer" className="t-caption text-[var(--brand)] underline underline-offset-2">
              Open directly →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
