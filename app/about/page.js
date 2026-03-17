'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GradientBackground from '../components/layout/GradientBackground';
import Button from '../components/ui/Button';
import { ArrowIcon } from '../components/ui/icons';

/* ── Constants ──────────────────────────────────────────────────────── */
const RESUME_URL   = 'https://drive.google.com/file/d/1QuxjEMB-PyVbgwsjjPpacY3xJ3j8eXMU/view?usp=drive_link';
const NOTION_ABOUT = 'https://thatguyabhishek.notion.site/About-fb861d61100943ee9356e50d28be3f03';
const LINKEDIN_URL = 'https://www.linkedin.com/in/thatguyabhishek/';

// About me DB: 93d4d551-25f7-491d-8778-7961daefeab0 (dataSources.query)
const IMG_PORTRAIT = '/portrait.jpg';

/* ── Animation ──────────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const vp = { once: true, margin: '-80px' };

function W({ children, className = '' }) {
  return (
    <div className={`max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}

/* ── How I Work bullets — exact Notion text ─────────────────────────── */
const WORK_ITEMS = [
  {
    label: 'Systems first',
    desc: 'I look for the underlying pattern before designing the individual interaction. A good system makes 100 future decisions faster.',
  },
  {
    label: 'Outcomes over outputs',
    desc: "I care more about the metric that moved than the screen that shipped. Pretty work that doesn't change behaviour is expensive decoration.",
  },
  {
    label: 'Research is not a phase',
    desc: 'Talking to users is something I do continuously, not as a gate before design starts. The best insights come when you\'re not looking for them.',
  },
  {
    label: 'I disagree constructively',
    desc: "I push back on briefs when I think the problem is wrong. I've been proven right sometimes and wrong plenty of others. Both are useful.",
  },
  {
    label: 'AI is a tool, not a trend',
    desc: "I'm actively building AI-native workflows — not just using AI to make faster mockups, but rethinking what's possible when intelligence is embedded in the product itself.",
  },
];

/* ── Skills — from Notion Experience section ────────────────────────── */
const SKILL_GROUPS = [
  {
    label: 'Design Craft',
    icon: '✏️',
    skills: ['Product Design', 'UX Research', 'Design Systems', 'Prototyping', 'Figma', 'Design Thinking', 'Frontend Design'],
  },
  {
    label: 'Product & Strategy',
    icon: '📈',
    skills: ['0→1 Products', 'Scale (100M+ users)', 'Data-Driven Design', 'Growth Strategy', 'Agile & Lean', 'Roadmapping', 'Competitive Analysis'],
  },
  {
    label: 'AI & Innovation',
    icon: '🤖',
    skills: ['Agentic AI Applications', 'LLM UX', 'SaaS', 'D2C & B2B', 'Startups', 'Advertising', 'Content Creation'],
  },
  {
    label: 'Leadership',
    icon: '🧑‍🤝‍🧑',
    skills: ['Team Management', 'UX Leadership', 'Stakeholder Management', 'Cross-Functional Collab', 'Mentoring', 'Exec Comms', 'Documentation'],
  },
];

/* ── Compact sidebar article cards ──────────────────────────────── */
const ARTICLES = [
  {
    emoji: '🎯',
    title: 'Why I chose generalism over specialisation',
    desc: 'On the deliberate choice to stay broad when every signal says to go deep.',
    href: NOTION_ABOUT,
  },
  {
    emoji: '🤖',
    title: 'Designing for AI: what the field still gets wrong',
    desc: "The interaction model has changed. Most design processes haven't.",
    href: NOTION_ABOUT,
  },
  {
    emoji: '📐',
    title: "Systems thinking isn't a design skill — it's a survival skill",
    desc: 'How thinking in systems changes the questions you ask before touching Figma.',
    href: NOTION_ABOUT,
  },
  {
    emoji: '🔥',
    title: 'What 12 years taught me about shipping under pressure',
    desc: 'From zero-marketing startups to 400M-user enterprise features.',
    href: NOTION_ABOUT,
  },
];

/* ── About me DB sections (93d4d551-25f7-491d-8778-7961daefeab0) ── */
const ABOUT_SECTIONS = [
  {
    emoji: '🏄‍♂️',
    title: 'My Experience',
    lead: 'Twelve years. Eight organisations. Two startups. One through-line.',
    body: "Every role I've taken has been a deliberate upgrade in one of three dimensions: scale, complexity, or skin-in-the-game. The arc goes: agency creative → enterprise design leader → startup founder (twice) → AI product at one of the world's most used software applications.\n\nI didn't drift into any of these. I chose them because they would make me better at the thing that matters most: designing products that change how real people work and live.",
    href: 'https://thatguyabhishek.notion.site/My-Experience-05872802d7624f4daa8a8785ba02b5b3',
  },
  {
    emoji: '🙋‍♂️',
    title: 'What I Bring',
    lead: 'Most designers can show you their screens. Fewer can tell you what moved because of them.',
    body: "Fewer still can tell you how they built the team, set the strategy, and made the decisions that led to those screens being built correctly the first time. I can do all three.",
    href: 'https://thatguyabhishek.notion.site/What-I-Bring-26af6091ff9a469eadcde9b42a80a678',
  },
  {
    emoji: '🏓',
    title: 'Recent Reads',
    lead: 'What I\'m reading, and why it matters.',
    body: 'A running list of books, essays, and ideas that are actively shaping how I think about design, AI, and leadership. Updated as I read.',
    href: NOTION_ABOUT,
  },
];

/* ─────────────────────────────────────────────────────────────────── */
const CAROUSEL_INTERVAL = 3500;

export default function AboutPage() {
  const [activeWork, setActiveWork] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setActiveWork((prev) => (prev + 1) % WORK_ITEMS.length);
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [paused, activeWork]);

  function goTo(index) {
    setDirection(index > activeWork ? 1 : -1);
    setActiveWork(index);
    // reset timer
    clearInterval(intervalRef.current);
    setPaused(false);
  }

  return (
    <>
      <GradientBackground />
      <main className="relative min-h-screen text-fg z-[1]">

        {/* ── 1. HERO — 30/70 split ──────────────────────────────────── */}
        <section className="relative">
          <W className="pt-32 pb-20">
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.p variants={fadeUp} className="t-overline text-fg-muted mb-8">About</motion.p>

              <div
                className="grid gap-8 items-start"
                style={{ gridTemplateColumns: '1fr' }}
              >
                {/* 30/70 only on large screens */}
                <style>{`@media (min-width: 1024px) { .about-hero-grid { grid-template-columns: 3fr 7fr !important; } }`}</style>
                <div className="about-hero-grid grid gap-8 items-start">

                  {/* LEFT 30% — portrait + currently callout card + article cards */}
                  <div className="flex flex-col gap-4">

                    {/* Portrait + Currently card */}
                    <motion.div variants={fadeUp}>
                      <div className="ui-surface ui-surface--lg flex flex-col gap-0" style={{ overflow: 'hidden' }}>
                        {/* Portrait — full width, no padding, bleeds to card edges */}
                        <div
                          style={{
                            width: '100%',
                            aspectRatio: '4 / 5',
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={IMG_PORTRAIT}
                            alt="Abhishek Saxena"
                            loading="eager"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center top',
                              display: 'block',
                            }}
                          />
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1, background: 'var(--border)' }} />

                        {/* Currently */}
                        <div className="flex flex-col gap-2.5" style={{ padding: '20px 24px 24px' }}>
                          <p className="t-overline text-fg-muted">Currently</p>
                          {[
                            { emoji: '🏢', text: 'Senior Product Designer at Microsoft — shipping AI-powered features for Excel' },
                            { emoji: '📚', text: 'ISB Leadership & AI Programme — building strategic and business fluency alongside design' },
                            { emoji: '✍️', text: 'Reading about AI-native design, systems thinking, and the future of the design function' },
                            { emoji: '🌏', text: "Based in India. Collaborating globally. Open to what's next." },
                          ].map(({ emoji, text }) => (
                            <div key={text} className="flex items-start gap-2.5">
                              <span style={{ fontSize: 15, lineHeight: 1.65, flexShrink: 0, marginTop: 1 }}>{emoji}</span>
                              <p className="t-body3 text-fg-muted" style={{ lineHeight: 1.65, margin: 0 }}>{text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                  </div>

                  {/* RIGHT 70% — open to badge + h1 + bio + CTAs (no card) */}
                  <motion.div variants={stagger} className="flex flex-col gap-7 lg:pt-1">

                    {/* Open to opportunities badge */}
                    <motion.div variants={fadeUp}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          background: 'color-mix(in srgb, #22c55e 12%, transparent)',
                          border: '1px solid color-mix(in srgb, #22c55e 30%, transparent)',
                          borderRadius: 9999,
                          padding: '5px 14px 5px 10px',
                        }}
                      >
                        <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8, flexShrink: 0 }}>
                          <motion.span
                            animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                              position: 'absolute',
                              inset: 0,
                              borderRadius: '50%',
                              background: '#22c55e',
                              display: 'block',
                            }}
                          />
                          <span
                            style={{
                              position: 'relative',
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: '#22c55e',
                              display: 'block',
                            }}
                          />
                        </span>
                        <span className="t-body3 font-semibold" style={{ color: '#22c55e' }}>
                          Open to opportunities
                        </span>
                      </span>
                    </motion.div>

                    <motion.h1 variants={fadeUp} style={{ color: 'var(--fg)', marginBottom: 0 }}>
                      I&apos;m Abhishek. I design things that matter — and I&apos;ve been doing it long enough to know the difference between design that looks good and design that works.
                    </motion.h1>

                    <motion.div variants={fadeUp} className="flex flex-col gap-4 t-body1 text-fg-muted">
                      <p>
                        Senior Product Designer at Microsoft. ISB Leadership &amp; AI programme.
                        12+ years across enterprise software, consumer apps, e-commerce, telecom,
                        and advertising. Two startups built from zero.
                      </p>
                      <p>
                        But none of that is the interesting part. The interesting part is that I started
                        in digital before UX had a name — when Flash was a career choice, when the only
                        brief was &lsquo;make it work&rsquo;, and when the only feedback loop was whether
                        people came back. That era is gone. But the mindset it gave me isn&apos;t: move fast,
                        stay curious, measure what matters, and never confuse the craft with the outcome.
                      </p>
                    </motion.div>

                    <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                      <Button href={RESUME_URL} external variant="outline" size="lg" icon={<ArrowIcon size={16} />}>
                        Get my resumé
                      </Button>
                      <Button href={LINKEDIN_URL} external variant="filled" size="lg">
                        LinkedIn
                      </Button>
                    </motion.div>

                  </motion.div>
                </div>
              </div>
            </motion.div>
          </W>
        </section>

        {/* ── 1b. WRITING — horizontal card grid ─────────────────────── */}
        <div className="border-t border-theme">
          <W className="py-16">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
                <motion.p variants={fadeUp} className="t-overline text-fg-muted">Writing</motion.p>
                <motion.a
                  variants={fadeUp}
                  href={NOTION_ABOUT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline t-caption font-semibold text-fg-muted inline-flex items-center gap-1.5"
                  style={{ transition: 'color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#ea8575'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = ''; }}
                >
                  All writing on Notion
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.a>
              </div>

              <style>{`@media (max-width: 1023px) { .writing-grid { grid-template-columns: repeat(2, 1fr) !important; } } @media (max-width: 599px) { .writing-grid { grid-template-columns: 1fr !important; } }`}</style>
              <div
                className="writing-grid grid gap-4"
                style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
              >
                {ARTICLES.map((article) => (
                  <motion.a
                    key={article.title}
                    variants={fadeUp}
                    href={article.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group no-underline flex flex-col gap-3 rounded-2xl"
                    style={{
                      padding: '20px 22px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      transition: 'border-color 0.2s ease, transform 0.25s cubic-bezier(0.22,1,0.36,1)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--fg) 20%, transparent)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = ''; }}
                  >
                    <span style={{ fontSize: 24, lineHeight: 1 }}>{article.emoji}</span>
                    <div className="flex flex-col gap-1.5" style={{ flex: 1 }}>
                      <p className="t-body2 font-semibold text-fg" style={{ margin: 0, lineHeight: 1.4 }}>
                        {article.title}
                      </p>
                      <p className="t-caption text-fg-muted" style={{ margin: 0, lineHeight: 1.55 }}>
                        {article.desc}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 t-caption font-semibold text-fg-muted" style={{ marginTop: 4, transition: 'color 0.15s' }}>
                      <span className="group-hover:text-fg" style={{ transition: 'color 0.15s' }}>Read</span>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.45, transition: 'opacity 0.15s' }} className="group-hover:opacity-80">
                        <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </W>
        </div>

        {/* ── 2. PHILOSOPHY ──────────────────────────────────────────── */}
        <div className="border-t border-theme">
          <W className="py-20">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <motion.p variants={fadeUp} className="t-overline text-fg-muted mb-8">Philosophy</motion.p>

              <motion.p
                variants={fadeUp}
                className="t-h3 font-bold mb-10"
                style={{ color: 'var(--fg)', lineHeight: 1.25 }}
              >
                In a world driven by aesthetics, it&apos;s easy to overlook the true essence of design.
                I don&apos;t design because it&apos;s my job.{' '}
                <span style={{ color: 'var(--color-coral)' }}>
                  I design because broken products waste human potential.
                </span>{' '}
                Every confusing interface, every failed interaction, every abandoned cart — that&apos;s
                someone&apos;s time and energy lost. I&apos;d like to get some of that back.
              </motion.p>

              <motion.p variants={fadeUp} className="t-body1 text-fg-muted">
                Design is the most interesting problem-solving discipline I know. It sits at the
                intersection of psychology, business, technology, and aesthetics — and it demands
                fluency in all four simultaneously. What I love most isn&apos;t the deliverable.
                It&apos;s the moment a complex problem suddenly has a shape. When you&apos;ve done
                the research, run the workshops, drawn the frameworks, and suddenly the answer is
                obvious — and you can&apos;t believe it wasn&apos;t obvious before. That moment is
                worth everything that comes before it.
              </motion.p>
            </motion.div>
          </W>
        </div>

        {/* ── 3. HOW I WORK ──────────────────────────────────────────── */}
        <div className="border-t border-theme">
          <W className="py-20">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <motion.p variants={fadeUp} className="t-overline text-fg-muted mb-2">Process</motion.p>
              <motion.h2 variants={fadeUp} className="mb-10">How I Work</motion.h2>

              {/* Top: stacked full-width description */}
              <motion.div variants={fadeUp} className="flex flex-col gap-4 t-body1 text-fg-muted mb-12">
                <p>
                  I am a design generalist by choice. I&apos;ve worked in fashion, advertising,
                  digital agencies, enterprise software, telecom, and startups. I&apos;ve been a
                  Creative Director, a Design Manager, a Founder, and a Senior IC at one of the
                  world&apos;s most complex software products.
                </p>
                <p>
                  That range isn&apos;t scattered. It&apos;s the point. The best design decisions
                  I&apos;ve ever made came from knowing just enough about the adjacent discipline
                  to ask the question nobody else was asking. Generalism isn&apos;t the absence of
                  depth. It&apos;s depth applied across a wider surface.
                </p>
              </motion.div>

              {/* Bottom: headings list (1/3) + content callout (2/3) */}
              <motion.div
                variants={fadeUp}
                className="grid gap-6"
                style={{ gridTemplateColumns: '1fr 2fr' }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                  {/* Left column — stacked headings */}
                  <div className="flex flex-col">
                    {WORK_ITEMS.map((item, i) => (
                      <button
                        key={item.label}
                        onClick={() => goTo(i)}
                        className="text-left w-full"
                        style={{
                          background: 'none',
                          border: 'none',
                          borderLeft: `2px solid ${i === activeWork ? '#4839ca' : 'var(--border)'}`,
                          padding: '14px 16px',
                          cursor: 'pointer',
                          transition: 'border-color 0.2s ease',
                          position: 'relative',
                        }}
                      >
                        {/* Auto-progress fill on active */}
                        {i === activeWork && (
                          <motion.span
                            key={activeWork}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: paused ? undefined : 1 }}
                            transition={{ duration: CAROUSEL_INTERVAL / 1000, ease: 'linear' }}
                            style={{
                              position: 'absolute',
                              left: -2,
                              top: 0,
                              width: 2,
                              height: '100%',
                              background: '#4839ca',
                              transformOrigin: 'top',
                              borderRadius: 1,
                            }}
                          />
                        )}
                        <p
                          className="t-body2 font-semibold"
                          style={{
                            margin: 0,
                            color: i === activeWork ? 'var(--fg)' : 'var(--fg-muted)',
                            opacity: i === activeWork ? 1 : 0.45,
                            transition: 'color 0.2s ease, opacity 0.2s ease',
                          }}
                        >
                          {item.label}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Right column — callout with active content */}
                  <div
                    className="rounded-2xl"
                    style={{
                      background: 'color-mix(in srgb, #4839ca 8%, var(--surface))',
                      border: '1px solid color-mix(in srgb, #4839ca 20%, var(--border))',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <AnimatePresence mode="wait" initial={false} custom={direction}>
                      <motion.div
                        key={activeWork}
                        custom={direction}
                        initial={{ opacity: 0, y: direction * 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: direction * -20 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        style={{ padding: '24px 22px' }}
                      >
                        <p
                          className="t-caption tabular-nums"
                          style={{ color: 'var(--color-coral)', marginBottom: 14, fontWeight: 700, letterSpacing: '0.08em' }}
                        >
                          {String(activeWork + 1).padStart(2, '0')} / {String(WORK_ITEMS.length).padStart(2, '0')}
                        </p>
                        <h3 className="t-h3" style={{ color: 'var(--fg)', margin: 0, lineHeight: 1.35 }}>
                          {WORK_ITEMS[activeWork].desc}
                        </h3>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>

            </motion.div>
          </W>
        </div>

        {/* ── 4. BECOMING AI-NATIVE ──────────────────────────────────── */}
        <div className="border-t border-theme">
          <W className="py-20">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <motion.p variants={fadeUp} className="t-overline text-fg-muted mb-2">Current focus</motion.p>
              <motion.h2 variants={fadeUp} className="mb-10">Becoming AI-Native</motion.h2>

              <div className="grid lg:grid-cols-2 gap-x-16 gap-y-6">
                <motion.div variants={fadeUp} className="flex flex-col gap-5 t-body1 text-fg-muted">
                  <p>The thing about AI in product design isn&apos;t the tools. It&apos;s the shift in what&apos;s possible.</p>
                  <p>
                    At Microsoft, I didn&apos;t just design AI features. I designed for a fundamentally
                    different interaction model — one where the system generates output, and the
                    designer&apos;s job is to shape the intelligence, not just the interface.
                    Chart Insights, the Wiki Agent, Copilot integration — these weren&apos;t UI projects.
                    They were epistemological questions: what should an AI say, when should it say it,
                    and how do you design trust with a system that can be wrong?
                  </p>
                </motion.div>
                <motion.div variants={fadeUp} className="flex flex-col gap-5 t-body1 text-fg-muted">
                  <p>
                    That&apos;s the work I find most interesting right now. I&apos;m currently deepening
                    this through the ISB Leadership &amp; AI programme — learning to think about AI not
                    as a feature, but as a business transformation lever. The goal isn&apos;t to become
                    an AI engineer. It&apos;s to become the designer in the room who understands AI well
                    enough to ask the right questions and build the right experiences around it.
                  </p>
                  <p>
                    I believe the designers who&apos;ll matter in the next decade are the ones who can
                    work fluidly at the boundary of human judgment and machine intelligence.
                    That&apos;s where I&apos;m deliberately positioning myself.
                  </p>
                </motion.div>
              </div>

              {/* T-shaped pull quote */}
              <motion.div
                variants={fadeUp}
                className="mt-14 pt-10"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <p
                  className="t-h4 font-semibold"
                  style={{ color: 'var(--fg-muted)', lineHeight: 1.45 }}
                >
                  &ldquo;My cross-disciplinary curiosity takes me from art to psychology to philosophy
                  to history to science and back. Being T-shaped has led me to experience a variety of
                  design fields and has become a way for my holistic learning.&rdquo;
                </p>
              </motion.div>
            </motion.div>
          </W>
        </div>

        {/* ── 5. BEYOND THE WORK ─────────────────────────────────────── */}
        <div className="border-t border-theme">
          <W className="py-20">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <motion.p variants={fadeUp} className="t-overline text-fg-muted mb-2">The human behind the work</motion.p>
              <motion.h2 variants={fadeUp} className="mb-10">Beyond the Work</motion.h2>

              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  {
                    heading: 'Maker by instinct',
                    body: "I've built apps, launched brands, sold plants, and almost started a 3D print farm. Not all of it worked. Most of it taught me something that no design brief ever has.",
                  },
                  {
                    heading: 'Voracious reader',
                    body: "I consume voraciously across disciplines — philosophy, behavioural economics, AI ethics, business strategy. The reading list isn't decorative. Every book I finish changes how I frame the next problem.",
                  },
                  {
                    heading: 'Opinionated about design',
                    body: "I have strong opinions about the design community's love of process theater. I think most design frameworks are taught wrong. And I believe the best design education is shipping something real and watching what happens.",
                  },
                ].map((card) => (
                  <motion.div
                    key={card.heading}
                    variants={fadeUp}
                    className="flex flex-col gap-3 rounded-2xl p-6"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    <p className="t-body1 font-semibold text-fg">{card.heading}</p>
                    <p className="t-body2 text-fg-muted" style={{ lineHeight: 1.7 }}>{card.body}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </W>
        </div>

        {/* ── 6. MORE ABOUT ME — one full section per entry ────────────── */}
        {ABOUT_SECTIONS.map((section, i) => (
          <div key={section.title} className="border-t border-theme">
            <W className="py-20">
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={vp}
              >
                {/* Overline + "More about me" label on first entry only */}
                {i === 0 && (
                  <motion.p variants={fadeUp} className="t-overline text-fg-muted mb-8">
                    More about me
                  </motion.p>
                )}

                <div className="grid gap-12 items-start" style={{ gridTemplateColumns: '1fr' }}>
                  <style>{`@media (min-width: 1024px) { .about-section-grid-${i} { grid-template-columns: 3fr 7fr !important; } }`}</style>
                  <div className={`about-section-grid-${i} grid gap-12 items-start`}>

                    {/* Left — emoji + title */}
                    <motion.div variants={fadeUp} className="flex flex-col gap-3 lg:pt-1">
                      <span style={{ fontSize: 36, lineHeight: 1 }}>{section.emoji}</span>
                      <h2 className="t-h2" style={{ margin: 0 }}>{section.title}</h2>
                    </motion.div>

                    {/* Right — lead + body + CTA */}
                    <motion.div variants={stagger} className="flex flex-col gap-6">
                      <motion.p
                        variants={fadeUp}
                        className="t-h4"
                        style={{ color: 'var(--color-coral)', margin: 0, lineHeight: 1.4, fontWeight: 600 }}
                      >
                        {section.lead}
                      </motion.p>
                      <motion.p
                        variants={fadeUp}
                        className="t-body1 text-fg-muted"
                        style={{ lineHeight: 1.75, margin: 0, whiteSpace: 'pre-line' }}
                      >
                        {section.body}
                      </motion.p>
                      <motion.div variants={fadeUp}>
                        <a
                          href={section.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="no-underline inline-flex items-center gap-2"
                          style={{
                            padding: '10px 20px',
                            borderRadius: 9999,
                            border: '1px solid var(--border)',
                            color: 'var(--fg-muted)',
                            fontSize: 13,
                            fontWeight: 600,
                            transition: 'border-color 0.2s, color 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-coral)'; e.currentTarget.style.color = 'var(--color-coral)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
                        >
                          Read more on Notion
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </a>
                      </motion.div>
                    </motion.div>

                  </div>
                </div>
              </motion.div>
            </W>
          </div>
        ))}

        {/* ── 7. SKILLS & EXPERTISE ──────────────────────────────────── */}
        <div className="border-t border-theme">
          <W className="py-20">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <motion.p variants={fadeUp} className="t-overline text-fg-muted mb-2">Capabilities</motion.p>
              <motion.h2 variants={fadeUp} className="mb-3">Skills &amp; Expertise</motion.h2>
              <motion.p variants={fadeUp} className="t-body1 text-fg-muted mb-10 max-w-[560px]">
                Built across 12+ years, multiple industries, and two startups.
                T-shaped by design, not by accident.
              </motion.p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {SKILL_GROUPS.map((group) => (
                  <motion.div
                    key={group.label}
                    variants={fadeUp}
                    className="flex flex-col gap-4 rounded-2xl p-5"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl leading-none">{group.icon}</span>
                      <p className="t-body2 font-semibold text-fg" style={{ margin: 0 }}>{group.label}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.skills.map((skill) => (
                        <span
                          key={skill}
                          className="ui-tag"
                          style={{
                            background: 'color-mix(in srgb, var(--fg) 7%, transparent)',
                            color: 'var(--fg-muted)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </W>
        </div>

      </main>
    </>
  );
}
