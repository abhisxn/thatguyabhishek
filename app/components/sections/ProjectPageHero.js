'use client';

import { motion } from 'framer-motion';
import { fadeUp, stagger, vp } from '@/lib/motion';

function Tag({ label }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full t-caption font-medium"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg-muted)' }}
    >
      {label}
    </span>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProjectPageHero({ project }) {
  if (!project) return null;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="pt-8 pb-12 px-6 sm:px-10 lg:px-16 max-w-[1200px] mx-auto"
    >
      {project.tags?.length > 0 && (
        <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-5">
          {project.tags.map((tag) => <Tag key={tag} label={tag} />)}
        </motion.div>
      )}

      <motion.h1 variants={fadeUp} className="t-display mb-5">
        {project.title}
      </motion.h1>

      {project.desc && (
        <motion.p variants={fadeUp} className="t-body1 text-fg-muted leading-relaxed mb-8">
          {project.desc}
        </motion.p>
      )}

      {project.url && (
        <motion.a
          variants={fadeUp}
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 t-body3 font-semibold px-5 py-3 rounded-full border-2 transition-colors duration-200 hover:bg-[var(--brand)] hover:text-white"
          style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}
        >
          View Live Project <ArrowRight />
        </motion.a>
      )}
    </motion.div>
  );
}
