'use client';

import { useRef, useCallback } from 'react';
import { m, useMotionValue, useTransform, useSpring } from 'framer-motion';

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

// Radial offset from card centre — smooth through corners
function offsetPerimPoint(px, py, w, h) {
  const cx = w / 2, cy = h / 2;
  const dx = px - cx, dy = py - cy;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return { x: px + (dx / len) * GLARE_OFFSET, y: py + (dy / len) * GLARE_OFFSET };
}

export function GlassGlareCard({ item }) {
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
        <m.div
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

        <p
          style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-coral)', margin: 0, position: 'relative', zIndex: 1 }}
        >
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
