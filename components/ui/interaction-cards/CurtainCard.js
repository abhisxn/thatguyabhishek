'use client';

import { useState } from 'react';
import { m } from 'framer-motion';

// SVG feTurbulence noise as a data URI — renders as subtle film grain
const NOISE_BG = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Rich dark gradient — always dark regardless of theme
const CURTAIN_GRADIENT = 'linear-gradient(145deg, #0c0b1e 0%, #1a1535 45%, #0d1827 100%)';

export function CurtainCard({ item }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'default',
        border: '1px solid var(--border)',
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
      <m.div
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
        {/* Diagonal highlight streak */}
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
          <m.p
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
            transition={{ duration: 0.32, delay: hovered ? 0.18 : 0, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 12, color: 'rgba(200,190,230,0.7)', lineHeight: 1.8, margin: 0 }}
          >
            {item.body}
          </m.p>
        </div>
      </m.div>
    </div>
  );
}
