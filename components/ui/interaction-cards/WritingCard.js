'use client';

import { useState } from 'react';
import Link from 'next/link';
import { m, useSpring } from 'framer-motion';
import { ArrowIcon } from '@/app/components/ui/icons';

export function WritingCard({ article, showDesc = true, equalHeight = false }) {
  const [isHov, setIsHov] = useState(false);
  const strokeOpacity = useSpring(0.2, { stiffness: 160, damping: 24 });

  return (
    <Link
      href={article.href}
      className="no-underline flex flex-col gap-3"
      style={{
        position: 'relative',
        borderRadius: 16,
        padding: '20px 22px',
        background: 'var(--surface)',
        display: 'flex',
        height: equalHeight ? '100%' : undefined,
        transform: isHov ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHov ? 'var(--shadow-md)' : 'none',
        transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
      }}
      onMouseEnter={() => { setIsHov(true); strokeOpacity.set(0.7); }}
      onMouseLeave={() => { setIsHov(false); strokeOpacity.set(0.2); }}
    >
      {/* Adaptive outline ring */}
      <m.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          border: '1px solid color-mix(in srgb, var(--fg) 50%, transparent)',
          pointerEvents: 'none',
          opacity: strokeOpacity,
        }}
      />

      {/* Emoji */}
      <m.span
        animate={{ scale: isHov ? 1.15 : 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ fontSize: 24, lineHeight: 1, display: 'inline-block', transformOrigin: 'left center' }}
      >
        {article.emoji}
      </m.span>

      {/* Text content */}
      <div className="flex flex-col gap-2" style={{ flex: 1 }}>
        <p className="t-h5 text-fg" style={{ margin: 0 }}>
          {article.title}
        </p>
        {showDesc && article.desc && (
          <p className="t-body2 text-fg-muted" style={{ margin: 0 }}>
            {article.desc}
          </p>
        )}
      </div>

      {/* CTA row */}
      <div
        className="flex items-center gap-1 t-caption font-semibold"
        style={{
          marginTop: 4,
          color: isHov ? 'var(--color-coral)' : 'var(--fg-muted)',
          transition: 'color 0.2s ease',
        }}
      >
        <span>Read</span>
        <span
          style={{
            opacity: isHov ? 1 : 0.45,
            transform: isHov ? 'translate(2px, -2px)' : 'translate(0,0)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            display: 'inline-flex',
          }}
        >
          <ArrowIcon size={11} />
        </span>
      </div>
    </Link>
  );
}
