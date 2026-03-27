// Shown during client-side navigation to /work/[slug] while server renders.
// Mirrors the page shell so the transition feels instant.
const W = 'max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16';
const pulse = 'animate-pulse rounded';

export default function ProjectLoading() {
  return (
    <div className="relative min-h-screen" style={{ color: 'var(--fg)' }}>

      {/* Back nav */}
      <div className={`${W} pt-24 pb-0`}>
        <div className={`${pulse} h-4 w-28`} style={{ background: 'var(--surface)' }} />
      </div>

      {/* Hero */}
      <div className={`${W} pt-8 pb-12`}>
        {/* Tags */}
        <div className="flex gap-2 mb-5">
          {[56, 72, 48].map((w) => (
            <div key={w} className={`${pulse} h-6 rounded-full`} style={{ width: w, background: 'var(--surface)' }} />
          ))}
        </div>
        {/* Title */}
        <div className={`${pulse} h-10 w-3/4 mb-3`} style={{ background: 'var(--surface)' }} />
        <div className={`${pulse} h-10 w-1/2 mb-8`} style={{ background: 'var(--surface)' }} />
        {/* Description */}
        <div className={`${pulse} h-4 w-full mb-2`} style={{ background: 'var(--surface)' }} />
        <div className={`${pulse} h-4 w-5/6 mb-2`} style={{ background: 'var(--surface)' }} />
        <div className={`${pulse} h-4 w-4/6 mb-8`} style={{ background: 'var(--surface)' }} />
        {/* CTA */}
        <div className={`${pulse} h-10 w-36 rounded-full`} style={{ background: 'var(--surface)' }} />
      </div>

      {/* Banner placeholder */}
      <div className={W}>
        <div className={`${pulse} w-full rounded-2xl`} style={{ height: 420, background: 'var(--surface)' }} />
      </div>

      {/* Content lines */}
      <div className={`${W} py-16`}>
        <div className="space-y-3">
          {[100, 95, 88, 0, 100, 82, 91, 70, 0, 100, 78, 86].map((w, i) =>
            w === 0 ? (
              <div key={i} className="h-5" />
            ) : (
              <div key={i} className={`${pulse} h-4`} style={{ width: `${w}%`, background: 'var(--surface)' }} />
            )
          )}
        </div>
      </div>

    </div>
  );
}
