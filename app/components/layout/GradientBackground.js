'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

/*
 * Performance model:
 *  - All 4 blobs drift to random positions on mousemove
 *  - Each blob has an independent cooldown (2–5 s) so they stagger naturally
 *  - CSS transition handles smoothness; RAF only fires on mousemove
 *  - Zero GPU work when the mouse is idle
 */

const DARK = [
  { color: '#8030f0', w: '90vw', h: '80vh', left: '-10vw', top: '-18vh' },
  { color: '#ff7820', w: '65vw', h: '68vh', left: '5vw',   top: '-24vh' },
  { color: '#00c8c0', w: '75vw', h: '70vh', left: '28vw',  top: '-14vh' },
  { color: '#e8c870', w: '60vw', h: '55vh', left: '-6vw',  top: '18vh'  },
];

const LIGHT = [
  { color: '#c090ff', w: '90vw', h: '80vh', left: '-10vw', top: '-18vh' },
  { color: '#ffaa80', w: '65vw', h: '68vh', left: '5vw',   top: '-24vh' },
  { color: '#70d8d0', w: '75vw', h: '70vh', left: '28vw',  top: '-14vh' },
  { color: '#ffd870', w: '60vw', h: '55vh', left: '-6vw',  top: '18vh'  },
];

/* Per-blob cooldown range (ms) — staggered so blobs don't all lock simultaneously */
const COOLDOWNS = [2000, 3000, 2500, 3500];

export default function GradientBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const wrapperRefs = useRef([]);
  const driftReady  = useRef([true, true, true, true]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    /* Assign unique transition durations so blobs feel independent */
    wrapperRefs.current.forEach((el, i) => {
      if (!el) return;
      const dur = 2.5 + i * 0.6 + Math.random() * 1.5; // 2.5 – 6 s, spread by index
      el.style.transition = `transform ${dur}s cubic-bezier(0.2, 0.8, 0.3, 1)`;
    });

    let movePending = false;

    const onMove = () => {
      if (movePending) return;
      movePending = true;
      requestAnimationFrame(() => {
        movePending = false;
        wrapperRefs.current.forEach((el, i) => {
          if (!el || !driftReady.current[i]) return;
          driftReady.current[i] = false;

          const sx = Math.random() < 0.5 ? 1 : -1;
          const sy = Math.random() < 0.5 ? 1 : -1;
          const rx = sx * (100 + Math.random() * 350); // 100 – 450 px
          const ry = sy * (100 + Math.random() * 500); // 100 – 400 px
          el.style.transform = `translate(${rx}px,${ry}px)`;

          /* Cooldown varies per blob + jitter so they desync over time */
          const base = COOLDOWNS[i];
          setTimeout(() => { driftReady.current[i] = true; }, base + Math.random() * 2000);
        });
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [mounted, resolvedTheme]);

  if (!mounted) return null;

  const isDark  = resolvedTheme !== 'light';
  const blobs   = isDark ? DARK  : LIGHT;
  const bgColor = isDark ? '#161B2A' : '#f5f4f0';
  const blend   = isDark ? 'hard-light' : 'multiply';
  const blur    = isDark ? 'blur(55px)' : 'blur(65px)';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0, background: bgColor }}
    >
      {blobs.map((blob, i) => (
        <div
          key={`${resolvedTheme}-${i}`}
          ref={(el) => { wrapperRefs.current[i] = el; }}
          style={{
            position: 'absolute',
            width: blob.w,
            height: blob.h,
            left: blob.left,
            top: blob.top,
            willChange: 'transform',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `radial-gradient(ellipse at center, ${blob.color} 0%, transparent 65%)`,
              mixBlendMode: blend,
              filter: blur,
            }}
          />
        </div>
      ))}
    </div>
  );
}
