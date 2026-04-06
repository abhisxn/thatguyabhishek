'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import CareerChart from './CareerChart';
import { TIMELINE } from '../../../data/careerData';

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
                    background: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.04)',
                    color: isActive ? 'var(--color-dark-blue)' : 'rgba(255,255,255,0.55)',
                    borderColor: isActive ? 'transparent' : 'rgba(255,255,255,0.18)',
                  }}
                  whileHover={{
                    background: isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.13)',
                    borderColor: isActive ? 'transparent' : 'rgba(255,255,255,0.32)',
                    scale: 1.05,
                  }}
                  transition={{ duration: 0.15 }}
                >
                  {item.period}
                </m.span>
                <span
                  className="t-body1 ct-role-text"
                  style={{ color: isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.7)' }}
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

