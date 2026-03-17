/* ─── Hero — five layout styles ─────────────────────────────────
 * Server component.
 *
 * variant:
 *   "centered"      — text centered, large headline, subtitle, CTA buttons
 *   "split"         — headline left, media right (2-column)
 *   "minimal"       — eyebrow + headline + description, left-aligned, no image
 *   "banner-full"   — edge-to-edge image, text overlay at bottom (full bleed)
 *   "banner-boxed"  — image contained to 1200px, text above or overlaid
 *
 * Props (all optional):
 *   variant       "centered" | "split" | "minimal" | "banner-full" | "banner-boxed"
 *   eyebrow       string   — small label above headline
 *   title         string   — main headline
 *   description   string   — body text
 *   actions       ReactNode — CTA buttons / links
 *   media         ReactNode — image / video (split, banner-full, banner-boxed)
 *   overlay       boolean  — dark overlay on banner image (default true for banners)
 *   aspectRatio   string   — CSS aspect-ratio for banner image (default "21/9")
 *   className     string
 */

/* ── Shared wrapper ── */
function W({ children, className = '' }) {
  return (
    <div className={`max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}

/* ── Eyebrow label ── */
function Eyebrow({ text, light = false }) {
  if (!text) return null;
  return (
    <p className={`t-overline mb-4 ${light ? 'text-white/65' : 'text-fg-muted'}`}>
      {text}
    </p>
  );
}

/* ────────────────────────────────────────────────────────────────
   VARIANT 1 — Centered
   ──────────────────────────────────────────────────────────────── */
function HeroCentered({ eyebrow, title, description, actions }) {
  return (
    <section className="relative flex items-center min-h-[70vh]">
      <W className="w-full py-32 text-center">
        <Eyebrow text={eyebrow} />
        {title && (
          <h1 className="mb-6 mx-auto max-w-[900px]">{title}</h1>
        )}
        {description && (
          <p className="t-body1 text-fg-muted leading-relaxed mb-10 mx-auto max-w-[600px]">
            {description}
          </p>
        )}
        {actions && (
          <div className="flex flex-wrap gap-4 justify-center">{actions}</div>
        )}
      </W>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────
   VARIANT 2 — Split
   ──────────────────────────────────────────────────────────────── */
function HeroSplit({ eyebrow, title, description, actions, media }) {
  return (
    <section className="relative flex items-center min-h-[70vh]">
      <W className="w-full py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex flex-col">
            <Eyebrow text={eyebrow} />
            {title && (
              <h1 className="mb-6">{title}</h1>
            )}
            {description && (
              <p className="t-body1 text-fg-muted leading-relaxed mb-10">{description}</p>
            )}
            {actions && (
              <div className="flex flex-wrap gap-4">{actions}</div>
            )}
          </div>
          {media && (
            <div className="w-full rounded-[24px] overflow-hidden" style={{ aspectRatio: '4/3' }}>
              {media}
            </div>
          )}
        </div>
      </W>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────
   VARIANT 3 — Minimal
   ──────────────────────────────────────────────────────────────── */
function HeroMinimal({ eyebrow, title, description, actions }) {
  return (
    <section className="relative flex items-center">
      <W className="w-full pt-32 pb-20">
        <Eyebrow text={eyebrow} />
        {title && (
          <h1 className="mb-6 max-w-[900px]">{title}</h1>
        )}
        {description && (
          <p className="t-body1 text-fg-muted leading-relaxed mb-10 max-w-[620px]">
            {description}
          </p>
        )}
        {actions && (
          <div className="flex flex-wrap gap-4">{actions}</div>
        )}
      </W>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────
   VARIANT 4 — Banner Full
   Edge-to-edge image spanning the full viewport width.
   overlay=true  → text pinned over image with gradient scrim
   overlay=false → image above, text below
   ──────────────────────────────────────────────────────────────── */
function HeroBannerFull({ eyebrow, title, description, actions, media, overlay = true, aspectRatio = '21/9' }) {
  if (overlay) {
    return (
      <section className="relative w-full overflow-hidden" style={{ aspectRatio }}>
        <div className="absolute inset-0">{media}</div>
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)' }}
        />
        <div className="absolute inset-x-0 bottom-0">
          <W className="pb-10 pt-20">
            <Eyebrow text={eyebrow} light />
            {title && <h1 className="text-white mb-4">{title}</h1>}
            {description && (
              <p className="t-body1 text-white/75 leading-relaxed mb-8 max-w-[620px]">{description}</p>
            )}
            {actions && <div className="flex flex-wrap gap-4">{actions}</div>}
          </W>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full">
      <div className="w-full overflow-hidden" style={{ aspectRatio }}>{media}</div>
      {(title || description || actions) && (
        <W className="pt-10 pb-16">
          <Eyebrow text={eyebrow} />
          {title && <h1 className="mb-4">{title}</h1>}
          {description && (
            <p className="t-body1 text-fg-muted leading-relaxed mb-8 max-w-[620px]">{description}</p>
          )}
          {actions && <div className="flex flex-wrap gap-4">{actions}</div>}
        </W>
      )}
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────
   VARIANT 5 — Banner Boxed
   Image contained within 1200px column with rounded corners.
   overlay=false → text above, image below
   overlay=true  → text pinned over image with gradient scrim
   ──────────────────────────────────────────────────────────────── */
function HeroBannerBoxed({ eyebrow, title, description, actions, media, overlay = false, aspectRatio = '16/7' }) {
  if (overlay) {
    return (
      <section className="relative">
        <W className="pt-28 pb-0">
          <div className="relative w-full rounded-[24px] overflow-hidden" style={{ aspectRatio }}>
            <div className="absolute inset-0">{media}</div>
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }}
            />
            <div className="absolute inset-x-0 bottom-0 p-8 lg:p-12">
              <Eyebrow text={eyebrow} light />
              {title && <h1 className="text-white mb-3">{title}</h1>}
              {description && (
                <p className="t-body1 text-white/75 leading-relaxed mb-6 max-w-[560px]">{description}</p>
              )}
              {actions && <div className="flex flex-wrap gap-4">{actions}</div>}
            </div>
          </div>
        </W>
      </section>
    );
  }

  return (
    <section className="relative">
      <W className="pt-28 pb-10">
        <Eyebrow text={eyebrow} />
        {title && <h1 className="mb-4 max-w-[900px]">{title}</h1>}
        {description && (
          <p className="t-body1 text-fg-muted leading-relaxed mb-8 max-w-[620px]">{description}</p>
        )}
        {actions && <div className="flex flex-wrap gap-4 mb-10">{actions}</div>}
        {media && (
          <div className="w-full rounded-[24px] overflow-hidden" style={{ aspectRatio }}>{media}</div>
        )}
      </W>
    </section>
  );
}

/* ── Public export ── */
const VARIANTS = {
  centered:       HeroCentered,
  split:          HeroSplit,
  minimal:        HeroMinimal,
  'banner-full':  HeroBannerFull,
  'banner-boxed': HeroBannerBoxed,
};

export default function Hero({ variant = 'centered', ...props }) {
  const Component = VARIANTS[variant] ?? HeroCentered;
  return <Component {...props} />;
}
