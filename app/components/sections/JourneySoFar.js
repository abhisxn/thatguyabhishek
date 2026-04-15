'use client';

import { m } from 'framer-motion';
import { fadeUp } from '@/lib/motion';
import HomeSectionShell from './HomeSectionShell';
import CareerTimeline from './CareerTimeline';

export default function JourneySoFar() {
  return (
    <HomeSectionShell heading="🎢 Journey So Far" ctaHref="/about">
      <m.div variants={fadeUp}>
        <CareerTimeline />
      </m.div>
    </HomeSectionShell>
  );
}
