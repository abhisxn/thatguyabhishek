'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import CareerChart from './CareerChart';
import { TIMELINE } from '@/data/careerData';

export default function CareerTimeline() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="grid lg:grid-cols-2 gap-5 items-stretch">
      <CareerChart activeIdx={activeIdx} setActiveIdx={setActiveIdx} />

      {/* Timeline list */}
      <div className="ct-list-card">
        <div className="ct-list-inner">
          {TIMELINE.map((item, i) => {
            const isActive = activeIdx === i;
            return (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className="timeline-btn"
              >
                <m.span
                  className="ct-period-pill"
                  animate={{
                    background: isActive ? 'var(--surface-inverse)' : 'var(--surface-0)',
                    color: isActive ? 'var(--fg-on-inverse)' : 'var(--fg-muted)',
                    borderColor: isActive ? 'transparent' : 'var(--border)',
                  }}
                  whileHover={{
                    background: isActive ? 'var(--surface-inverse)' : 'var(--surface-1)',
                    borderColor: isActive ? 'transparent' : 'var(--border-strong)',
                    scale: 1.05,
                  }}
                  transition={{ duration: 0.15 }}
                >
                  {item.period}
                </m.span>
                <span
                  className="t-body1 ct-role-text"
                  style={{ color: isActive ? 'var(--fg)' : 'var(--fg-muted)' }}
                >
                  <span className="font-semibold">{item.role}</span>
                  <span className="font-normal" style={{ color: 'var(--fg-disabled)' }}>
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

