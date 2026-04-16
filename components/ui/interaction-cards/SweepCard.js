'use client';

import { useState, useCallback } from 'react';
import { m, useMotionValue, useSpring, useMotionTemplate, animate } from 'framer-motion';

export function SweepCard({ item }) {
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
      <m.div
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
