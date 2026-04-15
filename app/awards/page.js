'use client';

import { m } from 'framer-motion';
import GradientBackground from '@/app/components/layout/GradientBackground';
import Button from '@/app/components/ui/Button';
import { ArrowIcon } from '@/app/components/ui/icons';
import { AWARD_YEARS, MENTIONS, getTierStyle } from '@/data/awards';
import { fadeUp, vp } from '@/lib/motion';
import W from '@/app/components/ui/W';

/* ─── Notion link ─────────────────────────────────────────────── */
const NOTION_AWARDS =
  'https://thatguyabhishek.notion.site/Awards-7b1e321f25bf43e5875b73eb17ec3a9b';

/* slightly tighter than default 0.1 — many rows stagger in */
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };


/* ─── AwardRow ────────────────────────────────────────────────── */
function AwardRow({ tier, project, festival }) {
  const s = getTierStyle(tier);
  return (
    <div
      className="grid gap-x-4 gap-y-1 items-start py-3.5 border-b last:border-b-0"
      style={{
        gridTemplateColumns: 'minmax(0,auto) 1fr minmax(0,auto)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Tier badge */}
      <span
        className="t-caption whitespace-nowrap rounded-full px-2 py-1 font-bold self-center shrink-0"
        style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
      >
        {tier}
      </span>

      {/* Project */}
      <p
        className="t-body2 self-center leading-snug"
        style={{ color: 'var(--fg)' }}
      >
        {project}
      </p>

      {/* Festival */}
      <p
        className="t-body3 self-center text-right shrink-0 hidden sm:block"
        style={{ color: 'var(--fg-muted)', opacity: 0.55 }}
      >
        {festival}
      </p>

      {/* Festival below on mobile */}
      <p
        className="t-caption col-start-2 sm:hidden"
        style={{ color: 'var(--fg-muted)', opacity: 0.5 }}
      >
        {festival}
      </p>
    </div>
  );
}

/* ─── MentionCard ─────────────────────────────────────────────── */
function MentionCard({ source, headline }) {
  return (
    <a
      href={NOTION_AWARDS}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2 rounded-2xl p-4 transition-all duration-300"
      style={{
        background:   'var(--surface)',
        border:       '1px solid var(--border)',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(72,57,202,0.45)';
        e.currentTarget.style.background  = 'rgba(72,57,202,0.05)';
        e.currentTarget.style.transform   = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.background  = 'var(--surface)';
        e.currentTarget.style.transform   = 'translateY(0)';
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="t-overline"
          style={{ color: 'var(--fg-muted)', opacity: 0.45 }}
        >
          {source}
        </span>
        <ArrowIcon size={12} className="shrink-0 mt-0.5 opacity-30 group-hover:opacity-70 transition-opacity duration-200" style={{ color: 'var(--fg)' }} />
      </div>
      <p
        className="t-body3 leading-snug line-clamp-3"
        style={{ color: 'var(--fg)' }}
      >
        {headline}
      </p>
    </a>
  );
}

/* ─── NotionCTA card ──────────────────────────────────────────── */
function FullListCard({ count }) {
  return (
    <a
      href={NOTION_AWARDS}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-start justify-between gap-4 rounded-2xl p-4 transition-all duration-300"
      style={{
        background:     'rgba(72,57,202,0.08)',
        border:         '1px solid rgba(72,57,202,0.3)',
        textDecoration: 'none',
        minHeight:      '100px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background  = 'rgba(72,57,202,0.14)';
        e.currentTarget.style.transform   = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background  = 'rgba(72,57,202,0.08)';
        e.currentTarget.style.transform   = 'translateY(0)';
      }}
    >
      <p className="t-body3 font-semibold" style={{ color: 'var(--brand)' }}>
        + {count} more mentions
      </p>
      <div className="flex items-center gap-2">
        <span className="t-caption font-bold" style={{ color: 'var(--brand)' }}>
          Full list on Notion
        </span>
        <ArrowIcon size={12} style={{ color: 'var(--brand)' }} />
      </div>
    </a>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function AwardsPage() {
  const totalAwards = AWARD_YEARS.reduce((acc, y) => acc + y.awards.length, 0);

  return (
    <>
      <GradientBackground />
      <main className="relative min-h-screen z-[1]" style={{ color: 'var(--fg)' }}>

        {/* ══ HERO ══════════════════════════════════════════════════ */}
        <section>
          <W className="pt-32 pb-20">
            <m.div variants={stagger} initial="hidden" animate="visible">
              <m.p variants={fadeUp} className="t-overline mb-4" style={{ color: 'var(--fg-muted)', opacity: 0.5 }}>
                Recognition
              </m.p>

              <m.h1
                variants={fadeUp}
                className="mb-6 max-w-[840px]"
                style={{ textWrap: 'balance' }}
              >
                35+ awards across design, digital &amp; advertising.
              </m.h1>

              <m.p
                variants={fadeUp}
                className="t-body1 max-w-[600px] mb-12"
                style={{ color: 'var(--fg-muted)', opacity: 0.7 }}
              >
                I believe great work is always a team sport. These awards recognise contributions
                across some of the most celebrated festivals in the industry — from Adfest to
                Facebook Accelerator, across 15+ years of craft.
              </m.p>

              {/* Stats */}
              <m.div variants={fadeUp} className="flex flex-wrap gap-10">
                {[
                  { num: '35+',  label: 'Awards won'       },
                  { num: '49+',  label: 'Press mentions'   },
                  { num: '10',   label: 'Global festivals' },
                  { num: '15+',  label: 'Years of craft'   },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col gap-1">
                    <span className="t-h3 font-bold" style={{ color: 'var(--fg)' }}>{s.num}</span>
                    <span className="t-body3" style={{ color: 'var(--fg-muted)', opacity: 0.5 }}>{s.label}</span>
                  </div>
                ))}
              </m.div>
            </m.div>
          </W>
        </section>

        {/* ══ AWARDS TIMELINE ═══════════════════════════════════════ */}
        <section style={{ borderTop: '1px solid var(--border)' }}>
          <W className="py-20">
            <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>

              {/* Section header */}
              <m.div
                variants={fadeUp}
                className="flex items-center justify-between gap-4 flex-wrap mb-14"
              >
                <div className="flex items-center gap-3">
                  <h2 className="t-h4 font-bold" style={{ color: 'var(--fg)' }}>Awards</h2>
                  <span
                    className="t-caption px-2 py-1 rounded-full font-bold"
                    style={{
                      background: 'var(--surface)',
                      border:     '1px solid var(--border)',
                      color:      'var(--fg-muted)',
                      opacity:    0.75,
                    }}
                  >
                    {totalAwards} listed
                  </span>
                </div>
                <Button href={NOTION_AWARDS} external size="sm" variant="outline" icon={<ArrowIcon size={13} />}>
                  Full list on Notion
                </Button>
              </m.div>

              {/* Column header — desktop only */}
              <m.div
                variants={fadeUp}
                className="hidden sm:grid mb-2 px-0"
                style={{
                  gridTemplateColumns: 'minmax(0,auto) 1fr minmax(0,auto)',
                  gap: '1rem',
                }}
              >
                <span className="t-overline" style={{ color: 'var(--fg-muted)', opacity: 0.35, paddingRight: '1rem' }}>Level</span>
                <span className="t-overline" style={{ color: 'var(--fg-muted)', opacity: 0.35 }}>Project</span>
                <span className="t-overline text-right" style={{ color: 'var(--fg-muted)', opacity: 0.35 }}>Festival / Org</span>
              </m.div>

              {/* Year groups */}
              <div className="flex flex-col gap-10">
                {AWARD_YEARS.map(({ year, awards }) => (
                  <m.div key={year} variants={fadeUp}>
                    {/* Year marker */}
                    <div className="flex items-center gap-4 mb-3">
                      <span
                        className="t-h5 font-bold shrink-0"
                        style={{ color: 'var(--fg)', opacity: 0.9 }}
                      >
                        {year}
                      </span>
                      <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                    </div>

                    {/* Award rows */}
                    <div
                      className="rounded-2xl overflow-hidden px-4"
                      style={{
                        background: 'var(--surface)',
                        border:     '1px solid var(--border)',
                      }}
                    >
                      {awards.map((a, i) => (
                        <AwardRow key={i} {...a} />
                      ))}
                    </div>
                  </m.div>
                ))}
              </div>

            </m.div>
          </W>
        </section>

        {/* ══ PRESS MENTIONS ════════════════════════════════════════ */}
        <section style={{ borderTop: '1px solid var(--border)' }}>
          <W className="py-20">
            <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>

              {/* Section header */}
              <m.div
                variants={fadeUp}
                className="flex items-center justify-between gap-4 flex-wrap mb-10"
              >
                <div className="flex items-center gap-3">
                  <h2 className="t-h4 font-bold" style={{ color: 'var(--fg)' }}>Press &amp; Mentions</h2>
                  <span
                    className="t-caption px-2 py-1 rounded-full font-bold"
                    style={{
                      background:  'var(--surface)',
                      border:      '1px solid var(--border)',
                      color:       'var(--fg-muted)',
                      opacity:     0.75,
                    }}
                  >
                    49+ articles
                  </span>
                </div>
                <Button href={NOTION_AWARDS} external size="sm" variant="outline" icon={<ArrowIcon size={13} />}>
                  Full list on Notion
                </Button>
              </m.div>

              {/* Mention grid */}
              <m.div
                variants={fadeUp}
                className="grid gap-3"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}
              >
                {MENTIONS.map((m, i) => (
                  <MentionCard key={i} {...m} />
                ))}

                {/* Full list CTA tile */}
                <FullListCard count={49 - MENTIONS.length} />
              </m.div>

            </m.div>
          </W>
        </section>

      </main>
    </>
  );
}
