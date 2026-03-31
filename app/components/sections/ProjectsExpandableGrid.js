'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectCard } from './ProjectCard';
import { fadeUp, stagger, vp } from '../../../lib/motion';

/* ── Sort: featured first (by order), then non-featured (by order) ── */
function sortProjects(projects) {
  const featured    = projects.filter((p) => p.featured).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  const nonFeatured = projects.filter((p) => !p.featured).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  return [...featured, ...nonFeatured];
}

/* ─────────────────────────────────────────────────────────────────────────────
 * ProjectsExpandableGrid
 *
 * Props:
 *   projects      Project[]   — full list from projects.json
 *   initialCount  number      — how many to show before "View All" (default 3)
 *   excludeSlug   string      — slug to omit (e.g. current project page)
 *   heading       string      — optional section heading
 *   viewAllLabel  string      — override default button label
 * ───────────────────────────────────────────────────────────────────────────── */
export default function ProjectsExpandableGrid({
  projects     = [],
  initialCount = 3,
  excludeSlug,
  heading,
  viewAllLabel = 'View All Projects',
}) {
  const [expanded, setExpanded] = useState(false);

  const sorted  = sortProjects(excludeSlug ? projects.filter((p) => p.slug !== excludeSlug) : projects);
  const initial = sorted.slice(0, initialCount);
  const rest    = sorted.slice(initialCount);
  const hasMore = rest.length > 0;

  if (!sorted.length) return null;

  return (
    <div>
      {heading && (
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          className="t-h3 mb-8 text-[var(--fg)]"
        >
          {heading}
        </motion.h2>
      )}

      {/* Initial cards — always visible */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {initial.map((p) => (
          <motion.div key={p.id} variants={fadeUp}>
            <ProjectCard page={p} size="s" showDesc />
          </motion.div>
        ))}
      </motion.div>

      {/* Expanded cards — animate in */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="expanded"
            variants={stagger}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
          >
            {rest.map((p) => (
              <motion.div key={p.id} variants={fadeUp}>
                <ProjectCard page={p} size="s" showDesc />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* View All / Show Less toggle */}
      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full t-body3 font-semibold btn-outline-brand"
            aria-expanded={expanded}
          >
            {expanded ? 'Show Less' : viewAllLabel}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}
            >
              <path d="M2 5l5 5 5-5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
