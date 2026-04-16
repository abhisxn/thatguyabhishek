'use client';

import { useState, useRef, useCallback } from 'react';
import { m } from 'framer-motion';

export function SpotlightCard({ item }) {
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
    <m.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 220,
        borderRadius: 16,
        padding: '24px 22px',
        background: 'var(--surface)',
        border: `1px solid ${hovered ? 'color-mix(in srgb, var(--brand) 40%, transparent)' : 'var(--border)'}`,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'border-color 0.3s ease',
      }}
    >
      <m.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle 120px at ${pos.x}% ${pos.y}%, color-mix(in srgb, var(--brand) 14%, transparent) 0%, transparent 70%)`,
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
        <m.p
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.75, marginTop: 10, marginBottom: 0 }}
        >
          {item.body}
        </m.p>
      </div>
    </m.div>
  );
}
