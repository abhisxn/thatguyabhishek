'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUp, vp } from '@/lib/motion';
import './MoreWorkCard.css';

export default function MoreWorkCard() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={vp}
    >
    <Link
      href="/work"
      className="mw-card group block no-underline relative overflow-hidden rounded-[24px] h-full min-h-[480px] flex flex-col items-center justify-center gap-10 p-10"
      aria-label="View all work"
    >
      <span aria-hidden="true" className="mw-wash pointer-events-none absolute inset-0" />

      <p className="mw-text relative font-semibold leading-[0.95] tracking-tight text-center select-none"
        style={{ fontSize: 'clamp(5.5rem,12vw,9rem)' }}>
        More<br />Work
      </p>

      <span className="mw-circle relative flex items-center justify-center rounded-full w-16 h-16">
        <svg
          className="mw-arrow"
          width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </Link>
    </motion.div>
  );
}
