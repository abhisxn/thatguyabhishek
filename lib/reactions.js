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
 * Fetch reaction counts for an article slug.
 * Returns { counts, total, error? }
 */
export async function getReactions(slug) {
  try {
    const raw = (await getRedis().hgetall(`reactions:${slug}`)) ?? {};
    const counts = {};
    let total = 0;
    for (const { key } of REACTIONS) {
      counts[key] = Math.max(0, parseInt(raw[key] ?? '0', 10));
      total += counts[key];
    }
    return { counts, total };
  } catch {
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
