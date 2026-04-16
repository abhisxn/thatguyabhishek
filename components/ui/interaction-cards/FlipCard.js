'use client';

import { useState } from 'react';
import { m } from 'framer-motion';

export function FlipCard({ num, title, body, titleSize = 'default', minHeight = 280, index = 0 }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <m.div
      initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ minHeight, height: '100%' }}
    >
      <div
        style={{ perspective: '1000px', height: '100%', minHeight, cursor: 'pointer' }}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front face */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              borderRadius: 16,
              padding: '32px 28px',
              background: 'var(--surface)',
              border: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <p
              className="t-caption tabular-nums font-bold"
              style={{ color: 'var(--color-coral)', letterSpacing: '0.08em', margin: 0 }}
            >
              {num}
            </p>
            <p
              className={titleSize === 'lg' ? 't-h4 text-fg' : 't-h5 text-fg'}
              style={{ margin: 0, flex: 1, paddingTop: 20 }}
            >
              {title}
            </p>
            <p className="t-caption text-fg-muted" style={{ margin: 0, opacity: 0.5 }}>
              hover to read
            </p>
          </div>

          {/* Back face */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderRadius: 16,
              padding: '32px 28px',
              background: 'var(--bg-solid)',
              border: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <p
              className="t-caption tabular-nums font-bold"
              style={{ color: 'var(--color-coral)', letterSpacing: '0.08em', margin: 0 }}
            >
              {num}
            </p>
            <p className="t-body2 text-fg" style={{ margin: 0, lineHeight: 1.75 }}>
              {body}
            </p>
          </div>
        </div>
      </div>
    </m.div>
  );
}
