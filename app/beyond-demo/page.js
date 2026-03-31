'use client';

/**
 * BEYOND THE WORK — Card Hover Interaction Demos
 * ------------------------------------------------
 * 5 distinct options. All use Framer Motion.
 * Visit: /beyond-demo
 *
 * Option A — 3D Flip Card          (classic premium, both faces designed)
 * Option B — Magnetic Tilt         (mouse-tracked 3D parallax + slide-up body)
 * Option C — Spotlight Radial      (cursor-driven radial gradient reveal)
 * Option D — Curtain Wipe          (clip-path colour sweep reveals back face)
 * Option E — Elastic Expand        (hovered card grows, siblings shrink)
 */

import { useState, useRef, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionTemplate,
  animate,
} from 'framer-motion';

/* ── Data ──────────────────────────────────────────────────────────────── */
const ITEMS = [
  {
    num: '01',
    heading: 'Maker by instinct',
    body: "I've built apps, launched brands, sold plants online, and once nearly started a 3D print farm. The businesses that worked taught me about users. The ones that didn't taught me about everything else.",
  },
  {
    num: '02',
    heading: "I learn when I'm stuck",
    body: "The things I know best, I learned because a problem forced me to. Not from a planned reading list — from a question I couldn't answer until I went looking. A video essay at 1am. A thread that led to three more.",
  },
  {
    num: '03',
    heading: 'Opinionated about craft',
    body: "I have strong opinions about the design community's love of process theater — the double diamonds, the 'how might we' workshops. Most aren't wrong. They're just taught wrong. As rituals instead of tools.",
  },
  {
    num: '04',
    heading: 'Started before the rules',
    body: "Digital design in the early 2000s meant Flash, no grids, no systems, no precedent. The only brief was 'make it work.' That era is gone — but the mindset isn't.",
  },
];

/* ── Shared card shell ─────────────────────────────────────────────────── */
function DemoSection({ label, sublabel, children }) {
  return (
    <section style={{ marginBottom: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
          {label}
        </p>
        <p style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.6, maxWidth: 520 }}>
          {sublabel}
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {children}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   OPTION A — 3D Flip Card (Inverse back face)
   Front: normal surface. Back: inverted — fg as background, bg as text.
   Theme-adaptive: dark card in light mode, light card in dark mode.
══════════════════════════════════════════════════════════════════════════ */
function FlipCard({ item }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      style={{ perspective: 1000, minHeight: 260, cursor: 'pointer' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%',
          height: '100%',
          minHeight: 260,
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front face — normal surface */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: 16,
            padding: '24px 22px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-coral)', margin: 0 }}>
            {item.num}
          </p>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4, margin: 0 }}>
              {item.heading}
            </p>
            <p style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 8, letterSpacing: '0.04em', opacity: 0.6 }}>
              hover →
            </p>
          </div>
        </div>

        {/* Back face — fully inverted: var(--fg) bg, var(--background) text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 16,
            padding: '24px 22px',
            background: 'var(--fg)',
            border: '1px solid var(--fg)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-coral)', margin: 0 }}>
            {item.num}
          </p>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--background)', lineHeight: 1.4, marginBottom: 10 }}>
              {item.heading}
            </p>
            <p style={{ fontSize: 12, color: 'var(--background)', lineHeight: 1.75, margin: 0, opacity: 0.6 }}>
              {item.body}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   OPTION B — Magnetic Tilt + Slide-up Body
   Mouse position inside card drives a 3D tilt.
   On hover, body slides up from bottom with blur.
══════════════════════════════════════════════════════════════════════════ */
function MagneticCard({ item }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback((e) => {
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(nx);
    y.set(ny);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setHovered(false);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{
        perspective: 800,
        height: 220,
        cursor: 'default',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 16,
          padding: '24px 22px',
          background: 'var(--surface)',
          border: `1px solid ${hovered ? 'color-mix(in srgb, var(--fg) 20%, transparent)' : 'var(--border)'}`,
          boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          transition: 'border-color 0.25s ease, box-shadow 0.3s ease',
        }}
      >
        <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-coral)', margin: 0, transform: 'translateZ(20px)' }}>
          {item.num}
        </p>

        <div style={{ transform: 'translateZ(20px)' }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4, margin: 0 }}>
            {item.heading}
          </p>
        </div>

        {/* Body slides up from below */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ y: 40, opacity: 0, filter: 'blur(6px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: 40, opacity: 0, filter: 'blur(6px)' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px 22px',
                background: 'linear-gradient(to top, var(--surface) 80%, transparent)',
                borderRadius: '0 0 16px 16px',
              }}
            >
              <p style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.75, margin: 0 }}>
                {item.body}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   OPTION C — Spotlight / Radial Cursor Reveal
   A radial gradient follows the mouse inside the card bounds.
   Body text fades in as spotlight activates.
══════════════════════════════════════════════════════════════════════════ */
function SpotlightCard({ item }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e) => {
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 220,
        borderRadius: 16,
        padding: '24px 22px',
        background: 'var(--surface)',
        border: `1px solid ${hovered ? 'color-mix(in srgb, var(--accent) 40%, transparent)' : 'var(--border)'}`,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'border-color 0.3s ease',
      }}
    >
      {/* Spotlight layer */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle 120px at ${pos.x}% ${pos.y}%, color-mix(in srgb, var(--accent) 14%, transparent) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-coral)', margin: 0, position: 'relative' }}>
        {item.num}
      </p>

      <div style={{ position: 'relative' }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4, margin: 0 }}>
          {item.heading}
        </p>
        <motion.p
          animate={{
            opacity: hovered ? 1 : 0,
            y: hovered ? 0 : 8,
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.75, marginTop: 10, marginBottom: 0 }}
        >
          {item.body}
        </motion.p>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   OPTION D — Curtain Wipe (clip-path sweep) — Premium
   Deep gradient + SVG film-grain noise overlay.
   Auto-height: no clipping, card grows to fit content.
══════════════════════════════════════════════════════════════════════════ */

// SVG feTurbulence noise as a data URI — renders as subtle film grain
const NOISE_BG = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Rich dark gradient — always dark regardless of theme (the "reveal" contrast)
const CURTAIN_GRADIENT = 'linear-gradient(145deg, #0c0b1e 0%, #1a1535 45%, #0d1827 100%)';

function CurtainCard({ item }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'default',
        border: '1px solid var(--border)',
        // min-height ensures consistent look, auto grows for long text
        minHeight: 240,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Front face */}
      <div
        style={{
          padding: '24px 22px',
          background: 'var(--surface)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 240,
          gap: 48,
        }}
      >
        <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-coral)', margin: 0 }}>
          {item.num}
        </p>
        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4, margin: 0 }}>
          {item.heading}
        </p>
      </div>

      {/* Curtain — sweeps down from top */}
      <motion.div
        initial={false}
        animate={{ clipPath: hovered ? 'inset(0% 0% 0% 0% round 16px)' : 'inset(0% 0% 100% 0% round 16px)' }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: 'absolute',
          inset: 0,
          background: CURTAIN_GRADIENT,
          padding: '24px 22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 16,
          minHeight: 240,
        }}
      >
        {/* Noise grain overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: NOISE_BG,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            opacity: 0.035,
            pointerEvents: 'none',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Subtle diagonal highlight streak */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />

        <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(160,140,220,0.55)', margin: 0, position: 'relative' }}>
          {item.num}
        </p>

        <div style={{ position: 'relative' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.92)', lineHeight: 1.4, marginBottom: 12, margin: '0 0 12px 0' }}>
            {item.heading}
          </p>
          <motion.p
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
            transition={{ duration: 0.32, delay: hovered ? 0.18 : 0, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 12, color: 'rgba(200,190,230,0.7)', lineHeight: 1.8, margin: 0 }}
          >
            {item.body}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   OPTION E — Elastic Expand (focused card grows, siblings shrink)
   The hovered card scale-expands and gets taller via layout animation.
   The other cards scale down subtly, creating depth.
══════════════════════════════════════════════════════════════════════════ */
function ElasticGrid() {
  const [active, setActive] = useState(null);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignItems: 'start' }}>
      {ITEMS.map((item, i) => {
        const isActive = active === i;
        const isSibling = active !== null && !isActive;

        return (
          <motion.div
            key={item.num}
            layout
            animate={{
              scale: isActive ? 1.03 : isSibling ? 0.97 : 1,
              opacity: isSibling ? 0.55 : 1,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              borderRadius: 16,
              padding: '24px 22px',
              background: isActive
                ? 'color-mix(in srgb, var(--accent) 8%, var(--surface))'
                : 'var(--surface)',
              border: `1px solid ${isActive ? 'color-mix(in srgb, var(--accent) 30%, transparent)' : 'var(--border)'}`,
              cursor: 'default',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: isActive ? 'var(--accent)' : 'var(--color-coral)', margin: 0, marginBottom: 16, transition: 'color 0.2s' }}>
              {item.num}
            </p>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4, margin: 0 }}>
              {item.heading}
            </p>

            <AnimatePresence>
              {isActive && (
                <motion.p
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.75, overflow: 'hidden', margin: 0 }}
                >
                  {item.body}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   OPTION F — Glass Glare
   • Blob locked to perimeter via 1D arc-length coordinate
   • Parallax: blob travels at PARALLAX fraction of cursor's perimeter delta
   • Blob center offset radially outside card — overflow:hidden shows only falloff
══════════════════════════════════════════════════════════════════════════ */

const BLOB_R       = 80;  // blob radius px
const GLARE_OFFSET = 56;  // how far outside the card boundary the blob center sits
const PARALLAX     = 0.4; // blob moves at 40% of cursor's perimeter speed

// t=0 at bottom-left, clockwise
function perimToXY(t, w, h) {
  const P  = 2 * (w + h);
  const tn = ((t % P) + P) % P;
  if (tn <= w)          return { x: tn,               y: h };
  if (tn <= w + h)      return { x: w,                y: h - (tn - w) };
  if (tn <= 2 * w + h)  return { x: w - (tn - w - h), y: 0 };
  return                       { x: 0,                y: tn - 2 * w - h };
}

// Ray from card centre through cursor hits perimeter — no Voronoi zone jumps
function cursorToPerimT(x, y, w, h) {
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

// Radial offset from card centre — smooth and continuous through corners
function offsetPerimPoint(px, py, w, h) {
  const cx = w / 2, cy = h / 2;
  const dx = px - cx, dy = py - cy;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return { x: px + (dx / len) * GLARE_OFFSET, y: py + (dy / len) * GLARE_OFFSET };
}

function SubtleCard({ item }) {
  const cardRef    = useRef(null);
  const cardDims   = useRef({ w: 0, h: 0 });
  const perimCanon = useRef(0);

  const perimBlob  = useMotionValue(0);
  const glowX = useTransform(perimBlob, t => {
    const { w, h } = cardDims.current;
    if (!w || !h) return 0;
    const { x: px, y: py } = perimToXY(t, w, h);
    return offsetPerimPoint(px, py, w, h).x;
  });
  const glowY = useTransform(perimBlob, t => {
    const { w, h } = cardDims.current;
    if (!w || !h) return 0;
    const { x: px, y: py } = perimToXY(t, w, h);
    return offsetPerimPoint(px, py, w, h).y;
  });
  const glowOpacity = useSpring(0, { stiffness: 80, damping: 28 });
  const glowLeft = useTransform(glowX, v => v - BLOB_R);
  const glowTop  = useTransform(glowY, v => v - BLOB_R);

  const updateGlare = useCallback((ex, ey) => {
    const { w, h } = cardDims.current;
    if (!w || !h) return;
    const P       = 2 * (w + h);
    const rawT    = cursorToPerimT(ex, ey, w, h);
    const rawNorm = ((rawT % P) + P) % P;
    const curNorm = ((perimCanon.current % P) + P) % P;
    let delta = rawNorm - curNorm;
    if (delta >  P / 2) delta -= P;
    if (delta < -P / 2) delta += P;
    perimCanon.current += delta;
    perimBlob.set(perimBlob.get() + delta * PARALLAX);
  }, [perimBlob]);

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current.getBoundingClientRect();
    cardDims.current = { w: rect.width, h: rect.height };
    updateGlare(e.clientX - rect.left, e.clientY - rect.top);
  }, [updateGlare]);

  const handleMouseEnter = useCallback((e) => {
    const rect = cardRef.current.getBoundingClientRect();
    cardDims.current = { w: rect.width, h: rect.height };
    const snapT = cursorToPerimT(e.clientX - rect.left, e.clientY - rect.top, cardDims.current.w, cardDims.current.h);
    perimCanon.current = snapT;
    perimBlob.set(snapT);
    glowOpacity.set(1);
  }, [perimBlob, glowOpacity]);

  const handleMouseLeave = useCallback(() => {
    glowOpacity.set(0);
  }, [glowOpacity]);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        style={{
          borderRadius: 16,
          padding: '24px 22px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'default',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Blur blob — center lives outside card boundary, overflow:hidden clips it */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: BLOB_R * 2,
            height: BLOB_R * 2,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.55)',
            filter: 'blur(56px)',
            x: glowLeft,
            y: glowTop,
            opacity: glowOpacity,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-coral)', margin: 0, position: 'relative', zIndex: 1 }}>
          {item.num}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4, margin: 0 }}>
            {item.heading}
          </p>
          <p style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.8, margin: 0 }}>
            {item.body}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   OPTION G — Border Sweep
   Clockwise conic-gradient ring fires once on mouseenter. No blob, no fill.
══════════════════════════════════════════════════════════════════════════ */
function SweepCard({ item }) {
  const [hovered, setHovered] = useState(false);
  const borderAngle   = useMotionValue(0);
  const borderOpacity = useSpring(0, { stiffness: 180, damping: 26 });
  const borderBg = useMotionTemplate`conic-gradient(from ${borderAngle}deg at 50% 50%, transparent 0%, rgba(255,255,255,0.18) 10%, rgba(255,255,255,0.32) 17%, rgba(255,255,255,0.18) 24%, transparent 34%)`;

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    borderOpacity.set(1);
    borderAngle.set(0);
    animate(borderAngle, 360, { duration: 1.1, ease: [0.3, 0, 0.3, 1] });
  }, [borderAngle, borderOpacity]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    borderOpacity.set(0);
  }, [borderOpacity]);

  return (
    <div
      style={{ position: 'relative', borderRadius: 16 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sweep ring */}
      <motion.div
        style={{
          position: 'absolute',
          inset: -1,
          borderRadius: 17,
          background: borderBg,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          padding: 1,
          pointerEvents: 'none',
          opacity: borderOpacity,
        }}
      />
      <div
        style={{
          borderRadius: 16,
          padding: '24px 22px',
          background: 'var(--surface)',
          border: `1px solid ${hovered ? 'color-mix(in srgb, var(--fg) 20%, transparent)' : 'var(--border)'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          transition: 'border-color 0.4s ease',
        }}
      >
        <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-coral)', margin: 0 }}>
          {item.num}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4, margin: 0 }}>{item.heading}</p>
          <p style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.8, margin: 0 }}>{item.body}</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   OPTION H — Adaptive Outline
   Border brightens in dark mode, darkens in light mode on hover.
   Pure CSS transition — no JS animation.
══════════════════════════════════════════════════════════════════════════ */
function OutlineCard({ item }) {
  // Spring opacity: 0.2 resting → 0.7 hover. Color = 50% fg, theme-adaptive.
  const strokeOpacity = useSpring(0.2, { stiffness: 160, damping: 24 });
  return (
    <div
      style={{ position: 'relative', borderRadius: 16, cursor: 'default' }}
      onMouseEnter={() => strokeOpacity.set(0.7)}
      onMouseLeave={() => strokeOpacity.set(0.2)}
    >
      <motion.div style={{ position: 'absolute', inset: 0, borderRadius: 16, border: '1px solid color-mix(in srgb, var(--fg) 50%, transparent)', opacity: strokeOpacity, pointerEvents: 'none' }} />
      <div
        style={{
          borderRadius: 16,
          padding: '24px 22px',
          background: 'var(--surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-coral)', margin: 0 }}>
          {item.num}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4, margin: 0 }}>{item.heading}</p>
          <p style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.8, margin: 0 }}>{item.body}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */
export default function BeyondDemo() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        padding: '80px 48px',
        maxWidth: 1100,
        margin: '0 auto',
      }}
    >
      <div style={{ marginBottom: 64 }}>
        <p style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.14em', color: 'var(--fg-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
          Interaction Demo · Beyond the Work
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--fg)', margin: 0, marginBottom: 12 }}>
          8 Card Hover Options
        </h1>
        <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7, maxWidth: 580 }}>
          All built with Framer Motion. Pick your favourite — or mix elements.
          Each option uses a distinct interaction paradigm.
        </p>
      </div>

      {/* A — Flip */}
      <DemoSection
        label="Option A — 3D Flip Card"
        sublabel="Front face shows heading. Mouse-enter triggers a Y-axis flip revealing the body on the back face. Both faces are fully designed. Classic premium pattern — good for content-heavy cards."
      >
        {ITEMS.map((item) => <FlipCard key={item.num} item={item} />)}
      </DemoSection>

      {/* B — Magnetic Tilt */}
      <DemoSection
        label="Option B — Magnetic 3D Tilt + Slide-up Body"
        sublabel="Mouse position inside the card drives a real-time 3D tilt via useMotionValue + useTransform + useSpring. Body text slides up from the bottom with blur. Premium, tactile, alive."
      >
        {ITEMS.map((item) => <MagneticCard key={item.num} item={item} />)}
      </DemoSection>

      {/* C — Spotlight */}
      <DemoSection
        label="Option C — Cursor Spotlight Reveal"
        sublabel="A radial gradient spotlight follows the mouse inside each card. Body text fades and slides in on hover. Subtle, editorial, works especially well in dark mode."
      >
        {ITEMS.map((item) => <SpotlightCard key={item.num} item={item} />)}
      </DemoSection>

      {/* D — Curtain */}
      <DemoSection
        label="Option D — Curtain Wipe (clip-path sweep)"
        sublabel="An accent-coloured plane sweeps over the card from top to bottom using clip-path animation. Reveals a fully designed back face. Cinematic, high-contrast, very editorial."
      >
        {ITEMS.map((item) => <CurtainCard key={item.num} item={item} />)}
      </DemoSection>

      {/* E — Elastic */}
      <section style={{ marginBottom: 80 }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
            Option E — Elastic Expand (layout animation)
          </p>
          <p style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.6, maxWidth: 520 }}>
            Hovered card scale-expands and grows to reveal the body. Sibling cards fade and shrink slightly, creating a depth/focus effect. Uses Framer&apos;s layout animation — no fixed heights needed.
          </p>
        </div>
        <ElasticGrid />
      </section>

      {/* F — Glass Glare */}
      <DemoSection
        label="Option F — Glass Glare (perimeter-locked blur)"
        sublabel="Blur blob locked to the card perimeter via 1D arc-length coordinate. Parallax: blob travels at 40% of cursor's perimeter delta, stops instantly. Radial offset keeps center outside the card — overflow:hidden shows only the soft falloff."
      >
        {ITEMS.map((item) => <SubtleCard key={item.num} item={item} />)}
      </DemoSection>

      {/* G — Border Sweep */}
      <DemoSection
        label="Option G — Border Sweep"
        sublabel="A conic-gradient highlight sweeps clockwise around the card border once on hover entry. No fill, no blob — just the ring. Clean, fast, satisfying."
      >
        {ITEMS.map((item) => <SweepCard key={item.num} item={item} />)}
      </DemoSection>

      {/* H — Adaptive Outline */}
      <DemoSection
        label="Option H — Adaptive Outline"
        sublabel="Border brightens in dark mode, darkens in light mode on hover. Pure CSS transition — no JavaScript animation. Minimal, theme-aware, works as a base layer under any other effect."
      >
        {ITEMS.map((item) => <OutlineCard key={item.num} item={item} />)}
      </DemoSection>

    </main>
  );
}
