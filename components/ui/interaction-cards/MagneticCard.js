'use client';

import { useState, useRef, useCallback } from 'react';
import { m, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';

export function MagneticCard({ item }) {
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
    <m.div
      ref={ref}
      style={{ perspective: 800, height: 220, cursor: 'default' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <m.div
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
        <AnimatePresence>
          {hovered && (
            <m.div
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
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </m.div>
  );
}
