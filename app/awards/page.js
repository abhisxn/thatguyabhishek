'use client';

import { motion } from 'framer-motion';
import GradientBackground from '../components/layout/GradientBackground';
import Button from '../components/ui/Button';
import { ArrowIcon } from '../components/ui/icons';

/* ─── Notion link ─────────────────────────────────────────────── */
const NOTION_AWARDS =
  'https://thatguyabhishek.notion.site/Awards-7b1e321f25bf43e5875b73eb17ec3a9b';

/* ─── Animation presets ───────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const vp = { once: true, margin: '-80px' };

/* ─── Layout wrapper ──────────────────────────────────────────── */
function W({ children, className = '' }) {
  return (
    <div className={`max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}

/* ─── Award data (sourced from Notion Awards page) ────────────── */
const AWARD_YEARS = [
  {
    year: '2025',
    awards: [
      { tier: 'Certificate', project: 'AI powered Insights for Excel Charts', festival: 'Microsoft' },
      { tier: 'Certificate', project: 'Successful hosting of UX Day event',    festival: 'Microsoft' },
    ],
  },
  {
    year: '2023',
    awards: [
      { tier: 'Certificate',         project: 'Solving for Gig Interviews with Live Rooms', festival: 'GoodWorker'  },
      { tier: 'Brand Collaboration', project: 'Planty × Microsoft for CXO events',          festival: 'ThinkPlanty' },
    ],
  },
  {
    year: '2020',
    awards: [
      { tier: 'Certificate', project: 'Launch of Airtel Thanks 2.0', festival: 'Airtel HQ' },
      { tier: 'Certificate', project: 'Growth Playbook',              festival: 'Airtel HQ' },
    ],
  },
  {
    year: '2018',
    awards: [
      { tier: 'Certificate', project: 'Benefits Crossroads Portal', festival: 'Avizva' },
    ],
  },
  {
    year: '2016',
    awards: [
      { tier: 'Winner · $40K',    project: 'Watchlyst',                                    festival: 'Facebook Startup Accelerator' },
      { tier: 'Bronze',           project: 'Happy Hours Rewind — Best Use of Merchandising', festival: "Adfest '16"                  },
      { tier: 'Honoree',          project: 'Distruct-o-matic',                              festival: 'Webby Awards'                 },
    ],
  },
  {
    year: '2015',
    awards: [
      { tier: 'Gold · Silver · 2× Bronze', project: 'Happy Hours Rewind',                             festival: "Goafest '15"              },
      { tier: 'Gold',                      project: "Lia's HoHoHo — A Christmas Carol",                festival: 'The Communicator Awards'  },
      { tier: 'Gold',                      project: 'Happy Hours Rewind',                             festival: 'W3 Awards'                },
      { tier: 'Blue Elephant',             project: 'Happy Hours Rewind — Innovative Use of Technology', festival: 'Kyoorius'              },
      { tier: 'WebTV',                     project: 'Happy Hours Rewind',                             festival: 'The FWA'                  },
    ],
  },
  {
    year: '2014',
    awards: [
      { tier: 'Silver',                   project: 'Distruct-o-matic — Best Brand Campaign', festival: "Goafest '14" },
      { tier: 'Gold · Silver · Bronze',   project: 'Distruct-o-matic',                       festival: 'PromaxBDA'   },
    ],
  },
  {
    year: '2013',
    awards: [
      { tier: 'Bronze',           project: 'Peeloo',                                     festival: "Adfest '13"          },
      { tier: 'Mobile of the Day', project: 'Peeloo',                                    festival: 'The FWA'             },
      { tier: 'Shortlist',        project: 'Peeloo — Best Website',                      festival: 'Spikes Asia'         },
      { tier: 'Bronze',           project: 'Interactive Lotus — Best Use of Technology', festival: "Adfest '13"          },
      { tier: 'Gold',             project: 'Harmonium Love Banner',                      festival: 'CI Digital Crest Awards' },
      { tier: 'Gold',             project: 'Harmonium Love — Best Website',              festival: 'WAT Awards'          },
    ],
  },
  {
    year: '2012',
    awards: [
      { tier: 'Gold',      project: 'Agency Hackathon',                    festival: 'Yahoo'        },
      { tier: 'Gold',      project: 'Agency of the Year',                  festival: 'Olive Green'  },
      { tier: 'Gold',      project: 'Young Green Art Director of the Year', festival: 'Olive Crowne' },
      { tier: 'Shortlist', project: 'Harmonium Love',                      festival: 'Spikes Asia'  },
    ],
  },
  {
    year: '2011',
    awards: [
      { tier: 'Silver',      project: 'Project Freedom',              festival: 'Yahoo Big Chair Awards' },
      { tier: 'Merit Award', project: 'HBO Hung Series',              festival: "OneShow '11"             },
      { tier: 'Certificate', project: 'Commonwealth Games — Designer', festival: "CWG '10"               },
    ],
  },
];

/* ─── Press mentions — curated 14 of 49 ──────────────────────── */
const MENTIONS = [
  { source: 'The FWA',                  headline: 'Peeloo — Interactive Loo Service' },
  { source: 'Campaign India',           headline: "Webchutney's 'Y! Loo' wins Yahoo agency hack contest" },
  { source: 'Adfest',                   headline: 'Taproot India crowned Agency of the Year, brings home 11 metals' },
  { source: 'Exchange4media',           headline: 'Goafest 2015: Webchutney wins only Gold in Digital Abbys' },
  { source: 'Brand Equity',             headline: 'Agency Reckoner 2015–16: Dentsu Webchutney walks away as No. 1 digital agency' },
  { source: 'Promax',                   headline: 'Search Award Winners' },
  { source: 'Spikes Asia',              headline: 'Spikes Asia 2015 — India' },
  { source: 'Campaign India',           headline: "Webchutney powers Anger Management with 'Destruct-O-Matic' App" },
  { source: 'Kyoorius',                 headline: 'Kyoorius Awards 2014 — Digital & Interactive' },
  { source: 'Ads of the World',         headline: "Webchutney: Peeloo — When nature comes calling" },
  { source: 'The Hindu BusinessLine',   headline: "Nokia wins 'Advertiser of the Year' at Olive Crowns" },
  { source: 'ThinkPlanty',              headline: 'Think Planty & Make These Little Potted Plants Your Go-To Gift' },
  { source: 'MxMIndia',                 headline: 'Taproot is Agency of the Year at Adfest 2013' },
  { source: 'Economic Times',           headline: 'BE Agency Reckoner 2014: OgilvyOne tops the Digital chart' },
];

/* ─── Tier badge style helper ─────────────────────────────────── */
function getTierStyle(tier) {
  if (tier.startsWith('Gold'))
    return { bg: 'rgba(251,191,36,0.12)',  color: '#ca8a04', border: 'rgba(202,138,4,0.4)'   };
  if (tier.startsWith('Silver'))
    return { bg: 'rgba(148,163,184,0.1)',  color: '#64748b', border: 'rgba(100,116,139,0.35)' };
  if (tier.startsWith('Bronze'))
    return { bg: 'rgba(180,83,9,0.10)',    color: '#b45309', border: 'rgba(180,83,9,0.35)'   };
  if (['Winner · $40K', 'Blue Elephant', 'WebTV', 'Mobile of the Day'].includes(tier))
    return { bg: 'rgba(72,57,202,0.10)',   color: '#4839ca', border: 'rgba(72,57,202,0.35)'  };
  /* Certificate, Honoree, Merit Award, Shortlist, Brand Collaboration */
  return { bg: 'var(--surface)', color: 'var(--fg-muted)', border: 'var(--border)' };
}

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
        className="t-caption whitespace-nowrap rounded-full px-2.5 py-1 font-bold self-center shrink-0"
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
      <p className="t-body3 font-semibold" style={{ color: '#4839ca' }}>
        + {count} more mentions
      </p>
      <div className="flex items-center gap-1.5">
        <span className="t-caption font-bold" style={{ color: '#4839ca' }}>
          Full list on Notion
        </span>
        <ArrowIcon size={11} style={{ color: '#4839ca' }} />
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
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.p variants={fadeUp} className="t-overline mb-4" style={{ color: 'var(--fg-muted)', opacity: 0.5 }}>
                Recognition
              </motion.p>

              <motion.h1
                variants={fadeUp}
                className="mb-6 max-w-[840px]"
                style={{ textWrap: 'balance' }}
              >
                35+ awards across design, digital &amp; advertising.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="t-body1 max-w-[600px] mb-12"
                style={{ color: 'var(--fg-muted)', opacity: 0.7 }}
              >
                I believe great work is always a team sport. These awards recognise contributions
                across some of the most celebrated festivals in the industry — from Adfest to
                Facebook Accelerator, across 15+ years of craft.
              </motion.p>

              {/* Stats */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-10">
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
              </motion.div>
            </motion.div>
          </W>
        </section>

        {/* ══ AWARDS TIMELINE ═══════════════════════════════════════ */}
        <section style={{ borderTop: '1px solid var(--border)' }}>
          <W className="py-20">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>

              {/* Section header */}
              <motion.div
                variants={fadeUp}
                className="flex items-center justify-between gap-4 flex-wrap mb-14"
              >
                <div className="flex items-center gap-3">
                  <h2 className="t-h4 font-bold" style={{ color: 'var(--fg)' }}>Awards</h2>
                  <span
                    className="t-caption px-2.5 py-1 rounded-full font-bold"
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
              </motion.div>

              {/* Column header — desktop only */}
              <motion.div
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
              </motion.div>

              {/* Year groups */}
              <div className="flex flex-col gap-10">
                {AWARD_YEARS.map(({ year, awards }) => (
                  <motion.div key={year} variants={fadeUp}>
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
                  </motion.div>
                ))}
              </div>

            </motion.div>
          </W>
        </section>

        {/* ══ PRESS MENTIONS ════════════════════════════════════════ */}
        <section style={{ borderTop: '1px solid var(--border)' }}>
          <W className="py-20">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>

              {/* Section header */}
              <motion.div
                variants={fadeUp}
                className="flex items-center justify-between gap-4 flex-wrap mb-10"
              >
                <div className="flex items-center gap-3">
                  <h2 className="t-h4 font-bold" style={{ color: 'var(--fg)' }}>Press &amp; Mentions</h2>
                  <span
                    className="t-caption px-2.5 py-1 rounded-full font-bold"
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
              </motion.div>

              {/* Mention grid */}
              <motion.div
                variants={fadeUp}
                className="grid gap-3"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}
              >
                {MENTIONS.map((m, i) => (
                  <MentionCard key={i} {...m} />
                ))}

                {/* Full list CTA tile */}
                <FullListCard count={49 - MENTIONS.length} />
              </motion.div>

            </motion.div>
          </W>
        </section>

      </main>
    </>
  );
}
