'use client';

import { m } from 'framer-motion';
import Button from '../ui/Button';
import CareerTimeline from './CareerTimeline';
import { fadeUp, stagger, vp } from '@/lib/motion';
import W from '../ui/W';

export default function JourneySoFar() {
  return (
    <div className="border-t border-theme">
      <W className="py-20">
        <m.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
          <m.div variants={fadeUp} className="flex items-center justify-between mb-10">
            <h2>🎢 Journey So Far</h2>
            <Button href="/about" variant="link" size="sm" icon={<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}>
              KNOW MORE
            </Button>
          </m.div>
          <m.div variants={fadeUp}>
            <CareerTimeline />
          </m.div>
        </m.div>
      </W>
    </div>
  );
}
