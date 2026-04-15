'use client';

import { m } from 'framer-motion';
import { fadeUp, vp } from '@/lib/motion';

export default function FadeSection({ children, className = '', delay = 0 }) {
  return (
    <m.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={vp}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </m.div>
  );
}
