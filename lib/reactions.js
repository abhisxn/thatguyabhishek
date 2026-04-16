import { Redis } from '@upstash/redis';
import { REACTIONS } from './reaction-types.js';

let _redis = null;
function getRedis() {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return _redis;
}

const VALID_KEYS = new Set(REACTIONS.map((r) => r.key));

function emptyCounts() {
  return Object.fromEntries(REACTIONS.map((r) => [r.key, 0]));
}

/**
 * Deterministic seed counts for a slug.
 * Pure function — same slug always returns same numbers (20–64 range per reaction).
 * Seeds are layered on top of real Upstash counts when REACTIONS_SEEDED=true.
 * To remove seeds: set REACTIONS_SEEDED=false in your environment — real counts are untouched.
 */
function seedCountsForSlug(slug) {
  // Simple non-crypto hash — stable, fast, good enough for display seeds
  let h = 2166136261; // FNV-1a 32-bit offset basis
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = (Math.imul(h, 16777619) >>> 0);
  }
  const seeds = {};
  for (let i = 0; i < REACTIONS.length; i++) {
    // Each reaction gets a distinct prime-stepped sample from the hash
    const val = (h ^ (h >>> (i * 5 + 3))) >>> 0;
    seeds[REACTIONS[i].key] = 20 + (val % 45); // range: 20–64
  }
  return seeds;
}

const SEEDS_ENABLED = process.env.REACTIONS_SEEDED !== 'false';

/**
 * Fetch reaction counts for an article slug.
 * Returns { counts, total, error? }
 */
export async function getReactions(slug) {
  const seeds = SEEDS_ENABLED ? seedCountsForSlug(slug) : null;
  try {
    const raw = (await getRedis().hgetall(`reactions:${slug}`)) ?? {};
    const counts = {};
    let total = 0;
    for (const { key } of REACTIONS) {
      const real = Math.max(0, parseInt(raw[key] ?? '0', 10));
      counts[key] = real + (seeds ? seeds[key] : 0);
      total += counts[key];
    }
    return { counts, total };
  } catch {
    // Degraded: return seeds-only so UI still looks populated
    if (seeds) {
      const counts = { ...seeds };
      const total = Object.values(seeds).reduce((a, b) => a + b, 0);
      return { counts, total, error: true };
    }
    return { counts: emptyCounts(), total: 0, error: true };
  }
}

/**
 * Atomically swap reactions for an article.
 * prevReaction: current selection (string | null)
 * newReaction:  new selection (string | null — null means deselect)
 * Returns updated { counts, total, error? }
 */
export async function setReaction(slug, prevReaction, newReaction) {
  try {
    const pipeline = getRedis().pipeline();
    if (prevReaction && VALID_KEYS.has(prevReaction)) {
      pipeline.hincrby(`reactions:${slug}`, prevReaction, -1);
    }
    if (newReaction && VALID_KEYS.has(newReaction)) {
      pipeline.hincrby(`reactions:${slug}`, newReaction, 1);
    }
    await pipeline.exec();
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[reactions] pipeline error:', err);
    }
  }
  return getReactions(slug);
}
