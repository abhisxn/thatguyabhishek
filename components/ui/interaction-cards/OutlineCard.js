'use client';

import { m, useSpring } from 'framer-motion';

export function OutlineCard({ item }) {
  const strokeOpacity = useSpring(0.2, { stiffness: 160, damping: 24 });

  return (
    <div
      style={{ position: 'relative', borderRadius: 16, cursor: 'default' }}
      onMouseEnter={() => strokeOpacity.set(0.7)}
      onMouseLeave={() => strokeOpacity.set(0.2)}
    >
      <m.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 16,
          border: '1px solid color-mix(in srgb, var(--fg) 50%, transparent)',
          opacity: strokeOpacity,
          pointerEvents: 'none',
        }}
      />
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
