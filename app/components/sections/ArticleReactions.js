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
      <div className="h-4 w-[120px] rounded-md mb-5 animate-pulse bg-[var(--surface-2)]" />
    );
  }
  return (
    <p className="t-caption text-fg-muted mb-5 tracking-[0.06em]">
      {total === 0 ? 'Be the first to react' : `${formatCount(total)} reactions`}
    </p>
  );
}

/* ── Reaction bar (pill strip) ────────────────────────────────── */

function ReactionBar({ counts, userReaction, onReact, loading }) {
  if (loading) {
    return (
      <div className="flex flex-wrap gap-2 mb-6">
        {REACTIONS.map((r) => (
          <div key={r.key} className="h-9 w-20 rounded-full animate-pulse bg-[var(--surface-2)]" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {REACTIONS.map((r) => {
        const selected = userReaction === r.key;
        return (
          <m.button
            key={r.key}
            onClick={() => onReact(r.key)}
            whileTap={{ scale: 1.12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
            aria-label={`React with ${r.label}`}
            aria-pressed={selected}
            className={[
              'inline-flex items-center gap-2 t-caption font-medium rounded-full px-4 h-9',
              'border transition-colors duration-150 cursor-pointer',
              selected
                ? 'border-[var(--brand)] bg-[var(--brand-muted)] text-[var(--brand)]'
                : 'border-[var(--border)] bg-[var(--surface-1)] text-[var(--fg-muted)]',
            ].join(' ')}
          >
            <span>{r.emoji}</span>
            {/* Label hidden below md breakpoint */}
            <span className="hidden md:inline">{r.label}</span>
            <m.span
              key={counts[r.key]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatCount(counts[r.key] ?? 0)}
            </m.span>
          </m.button>
        );
      })}
    </div>
  );
}

/* ── Reaction cards (emoji grid) ─────────────────────────────── */

function ReactionCards({ counts, userReaction, onReact, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {REACTIONS.map((r) => (
          <div
            key={r.key}
            className="h-24 rounded-[var(--radius-card)] animate-pulse bg-[var(--surface-2)]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
      {REACTIONS.map((r) => {
        const selected = userReaction === r.key;
        return (
          <m.button
            key={r.key}
            onClick={() => onReact(r.key)}
            whileTap={{ scale: 1.12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
            aria-label={`React with ${r.label}`}
            aria-pressed={selected}
            className={[
              'flex flex-col items-center justify-center gap-2 py-5 rounded-[var(--radius-card)]',
              'border transition-colors duration-150 cursor-pointer',
              selected
                ? 'border-[var(--brand)] bg-[var(--brand-muted)]'
                : 'border-[var(--border)] bg-[var(--surface-1)]',
            ].join(' ')}
          >
            <span className="text-4xl leading-none">{r.emoji}</span>
            <span className={`t-caption ${selected ? 'text-[var(--brand)]' : 'text-fg-muted'}`}>
              {r.label}
            </span>
            <m.span
              key={counts[r.key]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className={`t-body3 font-semibold ${selected ? 'text-[var(--brand)]' : 'text-fg'}`}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatCount(counts[r.key] ?? 0)}
            </m.span>
          </m.button>
        );
      })}
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────── */

export default function ArticleReactions({ slug }) {
  const [counts, setCounts] = useState(emptyCountsObj());
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/reactions?slug=${encodeURIComponent(slug)}`)
      .then((r) => {
        if (!r.ok) throw new Error('fetch error');
        return r.json();
      })
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

      // Persist to server — revert optimistic update on failure
      fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, reaction: next }),
      })
        .then((r) => {
          if (!r.ok) throw new Error('server error');
          return r.json();
        })
        .then((data) => {
          setCounts(data.counts ?? emptyCountsObj());
          setUserReaction(data.userReaction ?? null);
        })
        .catch(() => {
          // Revert optimistic update (note: if user clicks again while this
          // request is in-flight, the revert will race with the newer state)
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
        className="py-12"
      >
        <m.div variants={fadeUp}>
          <TotalCount total={total} loading={loading} />
        </m.div>

        <m.div variants={fadeUp}>
          <ReactionBar
            counts={counts}
            userReaction={userReaction}
            onReact={handleReact}
            loading={loading}
          />
        </m.div>

        <m.div variants={fadeUp}>
          <ReactionCards
            counts={counts}
            userReaction={userReaction}
            onReact={handleReact}
            loading={loading}
          />
        </m.div>
      </m.div>
    </LazyMotion>
  );
}
