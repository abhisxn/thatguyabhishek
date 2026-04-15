'use client';

import { useState, useEffect, useCallback } from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { stagger, fadeUp, vp } from '@/lib/motion';
import { REACTIONS } from '@/lib/reaction-types';

/* ── Helpers ──────────────────────────────────────────────────── */

function formatCount(n) {
  if (typeof n !== 'number') return '0';
  return n.toLocaleString();
}

function emptyCountsObj() {
  return Object.fromEntries(REACTIONS.map((r) => [r.key, 0]));
}

/* ── Total count line ─────────────────────────────────────────── */

function TotalCount({ total, loading }) {
  if (loading) {
    return (
      <div
        style={{
          height: 16,
          width: 120,
          borderRadius: 8,
          background: 'var(--surface-2)',
          marginBottom: 20,
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
    );
  }
  return (
    <p
      className="t-caption text-fg-muted"
      style={{ marginBottom: 20, letterSpacing: '0.06em' }}
    >
      {total === 0 ? 'Be the first to react' : `${formatCount(total)} reactions`}
    </p>
  );
}

/* ── Main component ───────────────────────────────────────────── */

export default function ArticleReactions({ slug }) {
  const [counts, setCounts] = useState(emptyCountsObj());
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reactions?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => {
        setCounts(data.counts ?? emptyCountsObj());
        setUserReaction(data.userReaction ?? null);
        setLoading(false);
      })
      .catch(() => {
        setCounts(emptyCountsObj());
        setLoading(false);
      });
  }, [slug]);

  const handleReact = useCallback(
    (type) => {
      const prev = userReaction;
      const next = prev === type ? null : type;

      // Optimistic update
      setCounts((c) => {
        const updated = { ...c };
        if (prev) updated[prev] = Math.max(0, (updated[prev] ?? 0) - 1);
        if (next) updated[next] = (updated[next] ?? 0) + 1;
        return updated;
      });
      setUserReaction(next);

      // Persist to server
      fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, reaction: next }),
      })
        .then((r) => r.json())
        .then((data) => {
          setCounts(data.counts ?? emptyCountsObj());
          setUserReaction(data.userReaction ?? null);
        })
        .catch(() => {
          // Revert optimistic update
          setCounts((c) => {
            const reverted = { ...c };
            if (next) reverted[next] = Math.max(0, (reverted[next] ?? 0) - 1);
            if (prev) reverted[prev] = (reverted[prev] ?? 0) + 1;
            return reverted;
          });
          setUserReaction(prev);
        });
    },
    [slug, userReaction],
  );

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        style={{ padding: '48px 0' }}
      >
        <m.div variants={fadeUp}>
          <TotalCount total={total} loading={loading} />
        </m.div>

        {/* ReactionBar and ReactionCards will be added in Tasks 6 and 7 */}
      </m.div>
    </LazyMotion>
  );
}
