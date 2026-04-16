'use client';

import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';

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

export function ElasticGrid() {
  const [active, setActive] = useState(null);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignItems: 'start' }}>
      {ITEMS.map((item, i) => {
        const isActive  = active === i;
        const isSibling = active !== null && !isActive;

        return (
          <m.div
            key={item.num}
            layout
            animate={{
              scale:   isActive ? 1.03 : isSibling ? 0.97 : 1,
              opacity: isSibling ? 0.55 : 1,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              borderRadius: 16,
              padding: '24px 22px',
              background: isActive
                ? 'color-mix(in srgb, var(--brand) 8%, var(--surface))'
                : 'var(--surface)',
              border: `1px solid ${isActive ? 'color-mix(in srgb, var(--brand) 30%, transparent)' : 'var(--border)'}`,
              cursor: 'default',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: isActive ? 'var(--brand)' : 'var(--color-coral)', margin: 0, marginBottom: 16, transition: 'color 0.2s' }}>
              {item.num}
            </p>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4, margin: 0 }}>
              {item.heading}
            </p>
            <AnimatePresence>
              {isActive && (
                <m.p
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.75, overflow: 'hidden', margin: 0 }}
                >
                  {item.body}
                </m.p>
              )}
            </AnimatePresence>
          </m.div>
        );
      })}
    </div>
  );
}
