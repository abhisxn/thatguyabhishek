'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { m, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';
import GradientBackground from '@/app/components/layout/GradientBackground';
import Button from '@/app/components/ui/Button';
import { ArrowIcon } from '@/app/components/ui/icons';

import { WORK_ITEMS, SKILL_GROUPS, ARTICLES, ABOUT_SECTIONS, THINKING_ITEMS as THINKING_FALLBACK, OPINIONS, BEYOND_ITEMS } from '@/data/about';
import CareerTimeline from '@/app/components/sections/CareerTimeline';
import { fadeUp, stagger, vp } from '@/lib/motion';
import W from '@/app/components/ui/W';
import { SECTION_STYLES } from '@/lib/section-styles';

/* ── Shared stroke ring — always inside the card div (borderRadius: inherit) ── */
const STROKE_RING = {
  position: 'absolute', inset: 0, borderRadius: 'inherit',
  border: '1px solid color-mix(in srgb, var(--fg) 50%, transparent)',
  pointerEvents: 'none',
};

/* ── Writing card ────────────────────────────────────────────────────── */
function WritingCard({ article }) {
  const [isHov, setIsHov] = useState(false);
  const strokeOpacity = useSpring(0.2, { stiffness: 160, damping: 24 });

  return (
    <m.div variants={fadeUp}>
      <Link
        href={article.href}
        className="no-underline flex flex-col gap-3"
        style={{
          position: 'relative',
          borderRadius: 16,
          padding: '20px 22px',
          background: 'var(--surface)',
          display: 'flex',
          transform: isHov ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: isHov ? 'var(--shadow-md)' : 'none',
          transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
        }}
        onMouseEnter={() => { setIsHov(true); strokeOpacity.set(0.7); }}
        onMouseLeave={() => { setIsHov(false); strokeOpacity.set(0.2); }}
      >
        <m.div style={{ ...STROKE_RING, opacity: strokeOpacity }} />
        <m.span
          animate={{ scale: isHov ? 1.15 : 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontSize: 24, lineHeight: 1, display: 'inline-block', transformOrigin: 'left center' }}
        >
          {article.emoji}
        </m.span>
        <div className="flex flex-col gap-2" style={{ flex: 1 }}>
          <p className="t-h5 text-fg" style={{ margin: 0 }}>
            {article.title}
          </p>
          <p className="t-body2 text-fg-muted" style={{ margin: 0 }}>
            {article.desc}
          </p>
        </div>
        <div
          className="flex items-center gap-1 t-caption font-semibold"
          style={{ marginTop: 4, color: isHov ? 'var(--color-coral)' : 'var(--fg-muted)', transition: 'color 0.2s ease' }}
        >
          <span>Read</span>
          <span style={{ opacity: isHov ? 1 : 0.45, transform: isHov ? 'translate(2px, -2px)' : 'translate(0,0)', transition: 'opacity 0.2s ease, transform 0.2s ease', display: 'inline-flex' }}>
            <ArrowIcon size={11} />
          </span>
        </div>
      </Link>
    </m.div>
  );
}

/* ── 3D Flip Card — What I'm Thinking About ─────────────────────── */
const THINKING_INITIAL = 4;

function ThinkingFlipCard({ heading, body, index }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <m.div
      initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ minHeight: 280 }}
    >
      <div
        style={{ perspective: '1000px', height: '100%', minHeight: 280, cursor: 'pointer' }}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        onClick={() => setFlipped(f => !f)}
      >
        <div
          style={{
            position: 'relative', width: '100%', height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            style={{
              position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
              borderRadius: 16, padding: '32px 28px',
              background: 'var(--surface)',
              border: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)',
              display: 'flex', flexDirection: 'column', gap: 20,
            }}
          >
            <p className="t-caption tabular-nums font-bold" style={{ color: 'var(--color-coral)', letterSpacing: '0.08em', margin: 0 }}>
              {String(index + 1).padStart(2, '0')}
            </p>
            <p className="t-h5 text-fg" style={{ margin: 0, flex: 1 }}>{heading}</p>
            <p className="t-caption text-fg-muted" style={{ margin: 0, opacity: 0.5 }}>hover to read</p>
          </div>
          {/* Back */}
          <div
            style={{
              position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderRadius: 16, padding: '32px 28px',
              background: 'var(--flip-back-bg)',
              border: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16,
            }}
          >
            <p className="t-caption tabular-nums font-bold" style={{ color: 'var(--color-coral)', letterSpacing: '0.08em', margin: 0 }}>
              {String(index + 1).padStart(2, '0')}
            </p>
            <p className="t-body2 text-fg" style={{ margin: 0, lineHeight: 1.65 }}>{body}</p>
          </div>
        </div>
      </div>
    </m.div>
  );
}

/* ── Shared numbered card — used by Beyond the Work ─────────────── */
function NumberedCard({ heading, body, index, style }) {
  const strokeOpacity = useSpring(0.2, { stiffness: 160, damping: 24 });

  return (
    <m.div variants={fadeUp} style={{ height: '100%' }}>
      <div
        style={{
          position: 'relative', borderRadius: 16, padding: '24px',
          background: 'var(--surface)', cursor: 'default',
          display: 'flex', flexDirection: 'column', gap: 16, height: '100%',
          ...style,
        }}
        onMouseEnter={() => strokeOpacity.set(0.7)}
        onMouseLeave={() => strokeOpacity.set(0.2)}
      >
        <m.div style={{ ...STROKE_RING, opacity: strokeOpacity }} />
        <p className="t-caption tabular-nums font-bold" style={{ color: 'var(--color-coral)', letterSpacing: '0.08em', margin: 0 }}>
          {String(index + 1).padStart(2, '0')}
        </p>
        <p className="t-h5 text-fg" style={{ margin: 0 }}>
          {heading}
        </p>
        <p className="t-body2 text-fg-muted" style={{ margin: 0 }}>
          {body}
        </p>
      </div>
    </m.div>
  );
}

/* ── Perimeter math — Glass Glare (F) ────────────────────────────── */
const WIB_BLOB_R       = 80;
const WIB_GLARE_OFFSET = 56;
const WIB_PARALLAX     = 0.4;

function wibPerimToXY(t, w, h) {
  const P  = 2 * (w + h);
  const tn = ((t % P) + P) % P;
  if (tn <= w)         return { x: tn,               y: h };
  if (tn <= w + h)     return { x: w,                y: h - (tn - w) };
  if (tn <= 2 * w + h) return { x: w - (tn - w - h), y: 0 };
  return                      { x: 0,                y: tn - 2 * w - h };
}

function wibCursorToPerimT(x, y, w, h) {
  const cx = w / 2, cy = h / 2;
  const dx = x - cx || 0.001;
  const dy = y - cy || 0.001;
  const ts = [
    dx < 0 ? (0 - cx) / dx : Infinity,
    dx > 0 ? (w - cx) / dx : Infinity,
    dy < 0 ? (0 - cy) / dy : Infinity,
    dy > 0 ? (h - cy) / dy : Infinity,
  ].filter(s => s > 0 && isFinite(s));
  const s  = Math.min(...ts);
  const px = Math.max(0, Math.min(w, cx + s * dx));
  const py = Math.max(0, Math.min(h, cy + s * dy));
  const eps = 0.5;
  if (px < eps)     return 2 * w + h + py;
  if (px > w - eps) return w + (h - py);
  if (py < eps)     return w + h + (w - px);
  return px;
}

function wibOffsetPerimPoint(px, py, w, h) {
  const cx = w / 2, cy = h / 2;
  const dx = px - cx, dy = py - cy;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return { x: px + (dx / len) * WIB_GLARE_OFFSET, y: py + (dy / len) * WIB_GLARE_OFFSET };
}

/* ── What I Bring card — Style F (Glass Glare) + G (Border Sweep) ── */
function WhatIBringCard({ item, index, textClr, mutedClr }) {
  const cardRef    = useRef(null);
  const cardDims   = useRef({ w: 0, h: 0 });
  const perimCanon = useRef(0);

  // F — Glass Glare: perimeter-locked blur blob
  const perimBlob   = useMotionValue(0);
  const glowOpacity = useSpring(0, { stiffness: 80, damping: 28 });
  const glowX = useTransform(perimBlob, t => {
    const { w, h } = cardDims.current;
    if (!w || !h) return 0;
    const { x: px, y: py } = wibPerimToXY(t, w, h);
    return wibOffsetPerimPoint(px, py, w, h).x;
  });
  const glowY = useTransform(perimBlob, t => {
    const { w, h } = cardDims.current;
    if (!w || !h) return 0;
    const { x: px, y: py } = wibPerimToXY(t, w, h);
    return wibOffsetPerimPoint(px, py, w, h).y;
  });
  const glowLeft = useTransform(glowX, v => v - WIB_BLOB_R);
  const glowTop  = useTransform(glowY, v => v - WIB_BLOB_R);

  const updateGlare = useCallback((ex, ey) => {
    const { w, h } = cardDims.current;
    if (!w || !h) return;
    const P       = 2 * (w + h);
    const rawT    = wibCursorToPerimT(ex, ey, w, h);
    const rawNorm = ((rawT % P) + P) % P;
    const curNorm = ((perimCanon.current % P) + P) % P;
    let delta = rawNorm - curNorm;
    if (delta >  P / 2) delta -= P;
    if (delta < -P / 2) delta += P;
    perimCanon.current += delta;
    perimBlob.set(perimBlob.get() + delta * WIB_PARALLAX);
  }, [perimBlob]);

  // H — Adaptive Outline: spring-animated stroke ring
  const strokeOpacity = useSpring(0.2, { stiffness: 160, damping: 24 });

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current.getBoundingClientRect();
    cardDims.current = { w: rect.width, h: rect.height };
    updateGlare(e.clientX - rect.left, e.clientY - rect.top);
  }, [updateGlare]);

  const handleMouseEnter = useCallback((e) => {
    const rect = cardRef.current.getBoundingClientRect();
    cardDims.current = { w: rect.width, h: rect.height };
    const snapT = wibCursorToPerimT(
      e.clientX - rect.left, e.clientY - rect.top,
      cardDims.current.w, cardDims.current.h,
    );
    perimCanon.current = snapT;
    perimBlob.set(snapT);
    glowOpacity.set(1);
    strokeOpacity.set(0.7);
  }, [perimBlob, glowOpacity, strokeOpacity]);

  const handleMouseLeave = useCallback(() => {
    glowOpacity.set(0);
    strokeOpacity.set(0.2);
  }, [glowOpacity, strokeOpacity]);

  const num = String(index + 1).padStart(2, '0');

  return (
    <m.div variants={fadeUp} style={{ height: '100%' }}>
      {/* Outer wrapper holds the sweep ring (needs overflow:visible) */}
      <div
        style={{ position: 'relative', borderRadius: 17, height: '100%' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* H — adaptive outline */}
        <m.div style={{ ...STROKE_RING, opacity: strokeOpacity }} />

        {/* Card body — overflow:hidden clips the glare blob */}
        <div
          ref={cardRef}
          style={{
            borderRadius: 16,
            padding: '24px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
            cursor: 'default',
          }}
        >
          {/* F — glare blob */}
          <m.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width:  WIB_BLOB_R * 2,
              height: WIB_BLOB_R * 2,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.45)',
              filter: 'blur(52px)',
              x: glowLeft,
              y: glowTop,
              opacity: glowOpacity,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          <p className="t-caption tabular-nums font-bold" style={{ color: 'var(--color-coral)', letterSpacing: '0.08em', margin: 0, position: 'relative', zIndex: 1 }}>
            {num}
          </p>
          <p className="t-body1 font-semibold" style={{ margin: 0, lineHeight: 1.4, color: textClr, position: 'relative', zIndex: 1 }}>
            {item.title}
          </p>
          <p className="t-body2" style={{ margin: 0, lineHeight: 1.75, color: mutedClr, position: 'relative', zIndex: 1 }}>
            {item.body}
          </p>
        </div>
      </div>
    </m.div>
  );
}

/* ── Constants ──────────────────────────────────────────────────────── */
const RESUME_URL        = 'https://drive.google.com/file/d/1QuxjEMB-PyVbgwsjjPpacY3xJ3j8eXMU/view?usp=drive_link';
const NOTION_ABOUT      = 'https://thatguyabhishek.notion.site/About-fb861d61100943ee9356e50d28be3f03';
const LINKEDIN_URL      = 'https://www.linkedin.com/in/thatguyabhishek/';

const WHAT_I_BRING_ITEMS = [
  {
    title: 'AI-Native Product Design',
    body: "I've shipped AI features used by 400M+ people. Not 'used AI in my process' — designed the AI experience itself. Chart Insights, Copilot Excel integration, Wiki Agent. I understand the design challenges specific to AI: calibrating trust, handling uncertainty, designing for outputs you don't fully control. This is a rare combination right now and I'm deepening it actively.",
  },
  {
    title: 'Systems Thinking at Scale',
    body: "I've built design systems from scratch at four different organisations. I've designed for products that served 100M users simultaneously. I think in systems, not screens — which means I'm valuable long before and long after Figma is open. The design of how design gets done is as important to me as the design itself.",
  },
  {
    title: 'Startup Instinct Inside Enterprise Structure',
    body: "Two GTM startups. Four design practices built from zero. At Microsoft, I didn't just execute — I identified an opportunity (the Wiki Agent), built the case, designed the solution, and shipped it. That entrepreneurial instinct — seeing what doesn't exist yet and making it — is something I carry into every role, regardless of company size.",
  },
  {
    title: 'Design That Moves Business Metrics',
    body: "30% reduction in feature abandonment at Microsoft. 6% MAU lift for 100M+ Airtel users. 12% conversion improvement at GoodWorker. 50K app downloads with zero marketing spend. These aren't lucky outcomes — they're the result of designing with business outcomes as the constraint, not the afterthought.",
  },
  {
    title: 'The Full Range — IC to Leader',
    body: "I can do the work and I can lead the people doing the work. I've been a hands-on product designer, a Design Manager, a Creative Director, and a Founder. I know what good craft looks like up close. I know what a design team needs to stay motivated, unblocked, and shipping at quality. I'm most useful in organisations where both things are valued.",
  },
];

const WHAT_I_BRING_METRICS = [
  { stat: '30%',   label: 'Feature abandonment reduced at Microsoft' },
  { stat: '100M+', label: 'Users on Airtel Thanks 2.0' },
  { stat: '50K',   label: 'App downloads, almost zero marketing spend' },
];

const IMG_PORTRAIT = '/portrait.jpg';

/* ─────────────────────────────────────────────────────────────────── */
const CAROUSEL_INTERVAL = 3500;

export default function AboutPage({ thinkingItems: thinkingProp = [], articles: articlesProp = [] }) {
  const THINKING_ITEMS = thinkingProp.length > 0 ? thinkingProp : THINKING_FALLBACK;
  const displayArticles = articlesProp.length > 0 ? articlesProp.slice(0, 4) : ARTICLES;
  const [activeWork, setActiveWork] = useState(0);
  const [thinkingExpanded, setThinkingExpanded] = useState(false);
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
            <m.div variants={stagger} initial="hidden" animate="visible">
              <m.p variants={fadeUp} className="t-overline text-fg-muted mb-8">About</m.p>

              <div className="grid gap-12 items-start lg:grid-cols-[3fr_7fr]">

                  {/* LEFT 30% — portrait + currently callout card + article cards */}
                  <div className="flex flex-col gap-4">

                    {/* Portrait + Currently card */}
                    <m.div variants={fadeUp}>
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
                    </m.div>

                  </div>

                  {/* RIGHT 70% — open to badge + h1 + bio + CTAs (no card) */}
                  <m.div variants={stagger} className="flex flex-col gap-7 lg:pt-1">

                    {/* Open to opportunities badge */}
                    <m.div variants={fadeUp}>
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
                          <m.span
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
                    </m.div>

                    <m.h1 variants={fadeUp} style={{ color: 'var(--fg)', marginBottom: 0 }}>
                      I&apos;m Abhishek. I design things that matter — and I&apos;ve been doing it long enough to know the difference between design that looks good and design that works.
                    </m.h1>

                    <m.div variants={fadeUp} className="flex flex-col gap-4 t-body1 text-fg-muted">
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
                    </m.div>

                    <m.div variants={fadeUp} className="flex flex-wrap gap-3">
                      <Button href={RESUME_URL} external variant="outline" size="lg" icon={<ArrowIcon size={16} />}>
                        Get my resumé
                      </Button>
                      <Button href={LINKEDIN_URL} external variant="filled" size="lg">
                        LinkedIn
                      </Button>
                    </m.div>

                  </m.div>
              </div>
            </m.div>
          </W>
        </section>

        {/* ── 1b. WRITING — horizontal card grid ─────────────────────── */}
        <div className="border-t border-theme">
          <W className="py-16">
            <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
                <m.p variants={fadeUp} className="t-overline text-fg-muted">Writing</m.p>
                <m.div variants={fadeUp}>
                  <Button
                    href={NOTION_ABOUT}
                    external
                    variant="link"
                    size="sm"
                    icon={<ArrowIcon size={11} />}
                  >
                    All writing on Notion
                  </Button>
                </m.div>
              </div>

              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {displayArticles.map((article) => (
                  <WritingCard key={article.title} article={article} />
                ))}
              </div>
            </m.div>
          </W>
        </div>

        {/* ── 2. PHILOSOPHY ──────────────────────────────────────────── */}
        <div style={SECTION_STYLES[1].wrap}>
          <W className="py-20">
            <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <m.p variants={fadeUp} className="t-overline text-fg-muted mb-8">Philosophy</m.p>

              <m.p
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
              </m.p>

              <m.p variants={fadeUp} className="t-body1 text-fg-muted">
                Design is the most interesting problem-solving discipline I know. It sits at the
                intersection of psychology, business, technology, and aesthetics — and it demands
                fluency in all four simultaneously. What I love most isn&apos;t the deliverable.
                It&apos;s the moment a complex problem suddenly has a shape. When you&apos;ve done
                the research, run the workshops, drawn the frameworks, and suddenly the answer is
                obvious — and you can&apos;t believe it wasn&apos;t obvious before. That moment is
                worth everything that comes before it.
              </m.p>
            </m.div>
          </W>
        </div>

        {/* ── 5. WHAT I BRING ────────────────────────────────────────── */}
        <div style={SECTION_STYLES[4].wrap}>
          <W className="py-20">
            <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>

              {/* Header row */}
              <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
                <div>
                  <m.p variants={fadeUp} className="t-overline mb-2" style={{ color: SECTION_STYLES[4].mutedClr }}>
                    What I bring
                  </m.p>
                  <m.h3 variants={fadeUp} style={{ color: SECTION_STYLES[4].textClr, margin: 0 }}>
                    The 5 Things I Bring
                  </m.h3>
                </div>
              </div>

              {/* 5 cards — 3 col first row, 2 col second row */}
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                {WHAT_I_BRING_ITEMS.slice(0, 3).map((item, i) => (
                  <WhatIBringCard
                    key={item.title}
                    item={item}
                    index={i}
                    textClr={SECTION_STYLES[4].textClr}
                    mutedClr={SECTION_STYLES[4].mutedClr}
                  />
                ))}
              </div>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 mb-12">
                {WHAT_I_BRING_ITEMS.slice(3).map((item, i) => (
                  <WhatIBringCard
                    key={item.title}
                    item={item}
                    index={i + 3}
                    textClr={SECTION_STYLES[4].textClr}
                    mutedClr={SECTION_STYLES[4].mutedClr}
                  />
                ))}
              </div>

              {/* Metrics strip */}
              <m.div
                variants={fadeUp}
                className="grid grid-cols-3 gap-px"
                style={{
                  background: 'color-mix(in srgb, var(--section-solid-fg) 10%, transparent)',
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: '1px solid color-mix(in srgb, var(--section-solid-fg) 10%, transparent)',
                }}
              >
                {WHAT_I_BRING_METRICS.map((m) => (
                  <div
                    key={m.stat}
                    className="flex flex-col gap-2 py-6 px-6"
                    style={{ background: 'color-mix(in srgb, var(--section-solid-fg) 5%, transparent)' }}
                  >
                    <p className="t-h2 font-bold tabular-nums" style={{ color: 'var(--color-coral)', margin: 0, lineHeight: 1.1 }}>
                      {m.stat}
                    </p>
                    <p className="t-body3" style={{ color: SECTION_STYLES[4].mutedClr, margin: 0, lineHeight: 1.5 }}>
                      {m.label}
                    </p>
                  </div>
                ))}
              </m.div>

            </m.div>
          </W>
        </div>

        {/* ── 6. HOW I WORK ──────────────────────────────────────────── */}
        <div className="border-t border-theme">
          <W className="py-20">
            <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <m.p variants={fadeUp} className="t-overline text-fg-muted mb-2">Process</m.p>
              <m.h3 variants={fadeUp} className="mb-10">How I Work</m.h3>

              {/* Top: stacked full-width description */}
              <m.div variants={fadeUp} className="flex flex-col gap-4 t-body1 text-fg-muted mb-12">
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
              </m.div>

              {/* Bottom: tabs + content callout */}
              <m.div
                variants={fadeUp}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                {/* ── Mobile: horizontal scrollable pill tabs ── */}
                <div className="block md:hidden overflow-x-auto -mx-6 px-6 pb-3 mb-5">
                  <div className="flex gap-2" style={{ width: 'max-content' }}>
                    {WORK_ITEMS.map((item, i) => (
                      <Button
                        key={item.label}
                        onClick={() => goTo(i)}
                        variant={i === activeWork ? 'filled-brand' : 'outline-brand'}
                        size="sm"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* ── Mobile: content panel below tabs ── */}
                <div
                  className="block md:hidden rounded-2xl"
                  style={{
                    background: 'color-mix(in srgb, var(--brand) 8%, var(--surface))',
                    border: '1px solid color-mix(in srgb, var(--brand) 20%, var(--border))',
                    overflow: 'hidden',
                    minHeight: 160,
                  }}
                >
                  <AnimatePresence mode="wait" initial={false} custom={direction}>
                    <m.div
                      key={`mob-${activeWork}`}
                      custom={direction}
                      initial={{ opacity: 0, x: direction * 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: direction * -24 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      style={{ padding: '28px 24px' }}
                    >
                      <p
                        className="t-caption tabular-nums"
                        style={{ color: 'var(--color-coral)', marginBottom: 14, fontWeight: 700, letterSpacing: '0.08em' }}
                      >
                        {String(activeWork + 1).padStart(2, '0')} / {String(WORK_ITEMS.length).padStart(2, '0')}
                      </p>
                      <p className="t-h3" style={{ color: 'var(--fg)', margin: 0, lineHeight: 1.35, fontWeight: 600 }}>
                        {WORK_ITEMS[activeWork].desc}
                      </p>
                    </m.div>
                  </AnimatePresence>
                </div>

                {/* ── Desktop: side-by-side grid (1fr + 2fr) ── */}
                <div className="hidden md:grid gap-8" style={{ gridTemplateColumns: '1fr 2fr' }}>
                  {/* Left column — stacked border-left headings */}
                  <div className="flex flex-col">
                    {WORK_ITEMS.map((item, i) => (
                      <button
                        key={item.label}
                        onClick={() => goTo(i)}
                        className="text-left w-full"
                        style={{
                          background: 'none',
                          border: 'none',
                          borderLeft: `2px solid ${i === activeWork ? 'var(--brand)' : 'var(--border)'}`,
                          padding: '16px 16px',
                          cursor: 'pointer',
                          transition: 'border-color 0.2s ease',
                          position: 'relative',
                        }}
                      >
                        {/* Auto-progress fill on active */}
                        {i === activeWork && (
                          <m.span
                            key={activeWork}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: paused ? undefined : 1 }}
                            transition={{ duration: CAROUSEL_INTERVAL / 1000, ease: 'linear' }}
                            style={{
                              position: 'absolute',
                              left: -2, top: 0,
                              width: 2, height: '100%',
                              background: 'var(--brand)',
                              transformOrigin: 'top',
                              borderRadius: 2,
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
                      background: 'color-mix(in srgb, var(--brand) 8%, var(--surface))',
                      border: '1px solid color-mix(in srgb, var(--brand) 20%, var(--border))',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <AnimatePresence mode="wait" initial={false} custom={direction}>
                      <m.div
                        key={activeWork}
                        custom={direction}
                        initial={{ opacity: 0, y: direction * 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: direction * -20 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        style={{ padding: '40px' }}
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
                      </m.div>
                    </AnimatePresence>
                  </div>
                </div>
              </m.div>

            </m.div>
          </W>
        </div>

        {/* ── 7. BEYOND THE WORK ─────────────────────────────────────── */}
        <div className="border-t border-theme">
          <W className="py-20">
            <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <m.p variants={fadeUp} className="t-overline text-fg-muted mb-2">The human behind the work</m.p>
              <m.h3 variants={fadeUp} className="mb-10">Beyond the Work</m.h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                {BEYOND_ITEMS.map((card, i) => (
                  <NumberedCard key={card.heading} heading={card.heading} body={card.body} index={i} style={{ minHeight: 220 }} />
                ))}
              </div>
            </m.div>
          </W>
        </div>

        {/* ── 8. BECOMING AI-NATIVE ──────────────────────────────────── */}
        <div className="border-t border-theme">
          <W className="py-20">
            <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <m.p variants={fadeUp} className="t-overline text-fg-muted mb-2">Current focus</m.p>
              <m.h3 variants={fadeUp} className="mb-10">Becoming AI-Native</m.h3>

              <div className="grid lg:grid-cols-2 gap-x-16 gap-y-6">
                <m.div variants={fadeUp} className="flex flex-col gap-5 t-body1 text-fg-muted">
                  <p>The thing about AI in product design isn&apos;t the tools. It&apos;s the shift in what&apos;s possible.</p>
                  <p>
                    At Microsoft, I didn&apos;t just design AI features. I designed for a fundamentally
                    different interaction model — one where the system generates output, and the
                    designer&apos;s job is to shape the intelligence, not just the interface.
                    Chart Insights, the Wiki Agent, Copilot integration — these weren&apos;t UI projects.
                    They were epistemological questions: what should an AI say, when should it say it,
                    and how do you design trust with a system that can be wrong?
                  </p>
                </m.div>
                <m.div variants={fadeUp} className="flex flex-col gap-5 t-body1 text-fg-muted">
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
                </m.div>
              </div>

              {/* T-shaped pull quote */}
              <m.div
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
              </m.div>
            </m.div>
          </W>
        </div>

        {/* ── 5b. STRONG OPINIONS ────────────────────────────────────── */}
        <div style={SECTION_STYLES[2].wrap}>
          <W className="py-20">
            <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <m.p variants={fadeUp} className="t-overline mb-2" style={{ color: SECTION_STYLES[2].mutedClr }}>Unfiltered</m.p>
              <m.h3 variants={fadeUp} className="mb-10" style={{ color: SECTION_STYLES[2].textClr }}>Strong Opinions</m.h3>

              <div className="grid sm:grid-cols-2 gap-x-16 gap-y-0">
                {OPINIONS.map((opinion, i) => {
                  const colCount = 2;
                  const lastRowStart = OPINIONS.length - (OPINIONS.length % colCount || colCount);
                  const isLastRow = i >= lastRowStart;
                  return (
                    <m.div
                      key={i}
                      variants={fadeUp}
                      className="flex gap-5 items-start py-7"
                      style={{
                        borderTop: `1px solid color-mix(in srgb, ${SECTION_STYLES[2].textClr} 12%, transparent)`,
                        borderBottom: isLastRow ? 'none' : `1px solid color-mix(in srgb, ${SECTION_STYLES[2].textClr} 12%, transparent)`,
                      }}
                    >
                      <p
                        className="t-caption tabular-nums font-bold flex-shrink-0"
                        style={{ color: 'var(--color-coral)', letterSpacing: '0.08em', marginTop: 3, minWidth: 24 }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      <p className="t-body1" style={{ margin: 0, lineHeight: 1.7, color: SECTION_STYLES[2].textClr }}>
                        {opinion}
                      </p>
                    </m.div>
                  );
                })}
              </div>
            </m.div>
          </W>
        </div>

        {/* ── 5c. CAREER TIMELINE ────────────────────────────────────── */}
        <div className="border-t border-theme">
          <W className="py-20">
            <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <m.p variants={fadeUp} className="t-overline text-fg-muted mb-2">Track record</m.p>
              <m.h3 variants={fadeUp} className="mb-10">Career Timeline</m.h3>
              <m.div variants={fadeUp}>
                <CareerTimeline />
              </m.div>
            </m.div>
          </W>
        </div>

        {/* ── 11. EXPERIENCE ───────────────────────────────────────────── */}
        {[ABOUT_SECTIONS[0]].map((section) => (
          <div key={section.title} className="border-t border-theme">
            <W className="py-20">
              <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
                <m.p variants={fadeUp} className="t-overline text-fg-muted mb-8">More about me</m.p>
                <div className="grid gap-12 items-start lg:grid-cols-[3fr_7fr]">
                  <m.div variants={fadeUp} className="flex flex-col gap-3 lg:pt-1">
                    <h3 className="t-h3" style={{ margin: 0 }}>{section.title}</h3>
                  </m.div>
                  <m.div variants={stagger} className="flex flex-col gap-6">
                    <m.p variants={fadeUp} className="t-h4" style={{ color: 'var(--color-coral)', margin: 0, lineHeight: 1.4, fontWeight: 600 }}>
                      {section.lead}
                    </m.p>
                    <m.p variants={fadeUp} className="t-body1 text-fg-muted" style={{ lineHeight: 1.75, margin: 0, whiteSpace: 'pre-line' }}>
                      {section.body}
                    </m.p>
                    <m.div variants={fadeUp}>
                      <Button
                        href={section.href}
                        external
                        variant="muted"
                        size="sm"
                        icon={<ArrowIcon size={12} />}
                      >
                        Read more on Notion
                      </Button>
                    </m.div>
                  </m.div>
                </div>
              </m.div>
            </W>
          </div>
        ))}

        {/* ── 12. WHAT I'M THINKING ──────────────────────────────────── */}
        <div className="border-t border-theme">
          <W className="py-20">
            <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <m.p variants={fadeUp} className="t-overline text-fg-muted mb-2">On my mind</m.p>
              <m.div variants={fadeUp} className="mb-10">
                <h3 style={{ margin: 0 }}>What I&apos;m Thinking About</h3>
              </m.div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {THINKING_ITEMS.slice(0, thinkingExpanded ? undefined : THINKING_INITIAL).map((item, i) => (
                  <ThinkingFlipCard
                    key={item.id || item.label}
                    heading={item.title || item.label}
                    body={item.description || item.desc}
                    index={i}
                  />
                ))}
              </div>
              {THINKING_ITEMS.length > THINKING_INITIAL && (
                <m.div variants={fadeUp} className="flex justify-center mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setThinkingExpanded(e => !e)}
                    icon={
                      <svg
                        width="12" height="12" viewBox="0 0 12 12" fill="none"
                        style={{ transform: thinkingExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
                      >
                        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    }
                  >
                    {thinkingExpanded ? 'Show less' : `Show ${THINKING_ITEMS.length - THINKING_INITIAL} more`}
                  </Button>
                </m.div>
              )}
            </m.div>
          </W>
        </div>

        {/* ── 13. RECENT READS ─────────────────────────────────────────── */}
        {[ABOUT_SECTIONS[1]].map((section) => (
          <div key={section.title} className="border-t border-theme">
            <W className="py-20">
              <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
                <div className="grid gap-12 items-start lg:grid-cols-[3fr_7fr]">
                  <m.div variants={fadeUp} className="flex flex-col gap-3 lg:pt-1">
                    <h3 className="t-h3" style={{ margin: 0 }}>{section.title}</h3>
                  </m.div>
                  <m.div variants={stagger} className="flex flex-col gap-6">
                    <m.p variants={fadeUp} className="t-h4" style={{ color: 'var(--color-coral)', margin: 0, lineHeight: 1.4, fontWeight: 600 }}>
                      {section.lead}
                    </m.p>
                    <m.p variants={fadeUp} className="t-body1 text-fg-muted" style={{ lineHeight: 1.75, margin: 0, whiteSpace: 'pre-line' }}>
                      {section.body}
                    </m.p>
                    <m.div variants={fadeUp}>
                      <Button
                        href={section.href}
                        external
                        variant="muted"
                        size="sm"
                        icon={<ArrowIcon size={12} />}
                      >
                        Read more on Notion
                      </Button>
                    </m.div>
                  </m.div>
                </div>
              </m.div>
            </W>
          </div>
        ))}

        {/* ── 7. SKILLS & EXPERTISE ──────────────────────────────────── */}
        <div className="border-t border-theme">
          <W className="py-20">
            <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <div className="grid gap-12 items-start lg:grid-cols-[3fr_7fr]">

                {/* Left 30% — label + h3 + subtitle */}
                <m.div variants={fadeUp} className="flex flex-col gap-3 lg:pt-1">
                  <p className="t-overline text-fg-muted">Capabilities</p>
                  <h3 className="t-h3" style={{ margin: 0 }}>Skills &amp; Expertise</h3>
                  <p className="t-body2 text-fg-muted" style={{ lineHeight: 1.65, margin: 0 }}>
                    Built across 12+ years, multiple industries, and two startups.
                    T-shaped by design, not by accident.
                  </p>
                </m.div>

                {/* Right 70% — 2×2 skill group grid */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {SKILL_GROUPS.map((group) => (
                    <m.div
                      key={group.label}
                      variants={fadeUp}
                      className="flex flex-col gap-4 rounded-2xl p-5"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl leading-none">{group.icon}</span>
                        <p className="t-body2 font-semibold text-fg" style={{ margin: 0 }}>{group.label}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
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
                    </m.div>
                  ))}
                </div>

              </div>
            </m.div>
          </W>
        </div>

      </main>
    </>
  );
}
