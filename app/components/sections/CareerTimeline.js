'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import CareerChart from './CareerChart';
import { TIMELINE } from './careerData';

export default function CareerTimeline() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <CareerChart activeIdx={activeIdx} setActiveIdx={setActiveIdx} />

      {/* Timeline list */}
      <div style={{ background: '#0b2261', borderRadius: 24, padding: '20px 22px', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          {TIMELINE.map((item, i) => {
            const isActive = activeIdx === i;
            return (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className="timeline-btn"
                style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
              >
                <motion.span
                  animate={{
                    background: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.04)',
                    color: isActive ? '#0b2261' : 'rgba(255,255,255,0.55)',
                    borderColor: isActive ? 'transparent' : 'rgba(255,255,255,0.18)',
                  }}
                  whileHover={{
                    background: isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.13)',
                    borderColor: isActive ? 'transparent' : 'rgba(255,255,255,0.32)',
                    scale: 1.05,
                  }}
                  transition={{ duration: 0.15 }}
                  style={{ flexShrink: 0, display: 'inline-block', fontSize: 11, padding: '3px 8px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.18)', minWidth: 82, textAlign: 'center', fontWeight: 600, fontFamily: 'var(--font-glory-var, sans-serif)' }}
                >
                  {item.period}
                </motion.span>
                <span
                  className="t-body1"
                  style={{ color: isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }}
                >
                  <span className="font-semibold">{item.role}</span>
                  <span className="font-normal" style={{ color: isActive ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.4)' }}>
                    {' '}@ {item.org}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
