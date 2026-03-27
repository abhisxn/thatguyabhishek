/**
 * Notion API rate-limit utilities.
 *
 * Notion enforces ~3 req/s per integration. During Next.js static generation
 * (npm run build), 9 workers run in parallel and each page fires many concurrent
 * blocks.children.list calls — this blows through the limit fast.
 *
 * Two tools here:
 *   withRetry   — retries a single call on 429 / network errors
 *   createLimiter — caps how many calls run simultaneously
 */

/**
 * Retry an async fn up to `maxRetries` times on 429 or transient errors.
 * Respects Notion's `retry-after` header when present.
 */
export async function withRetry(fn, maxRetries = 4) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      const isRateLimit = err.status === 429 || err.code === 'rate_limited';
      const isTransient  = err.status >= 500 || err.code === 'notionhq_client_request_timeout';

      if (attempt >= maxRetries || (!isRateLimit && !isTransient)) throw err;

      // Respect Retry-After header if Notion sends one (in seconds)
      const retryAfterSec = Number(err.headers?.['retry-after'] ?? 0);
      const backoffMs = retryAfterSec > 0
        ? retryAfterSec * 1000
        : Math.min(1000 * 2 ** attempt + Math.random() * 200, 15000);

      await new Promise((res) => setTimeout(res, backoffMs));
      attempt++;
    }
  }
}

/**
 * Returns a limiter function that caps concurrent async operations.
 * Usage:
 *   const limit = createLimiter(3);
 *   await Promise.all(items.map(item => limit(() => fetchSomething(item))));
 */
export function createLimiter(concurrency) {
  let active = 0;
  const queue = [];

  return function limit(fn) {
    return new Promise((resolve, reject) => {
      const run = () => {
        active++;
        Promise.resolve()
          .then(fn)
          .then(resolve, reject)
          .finally(() => {
            active--;
            if (queue.length) queue.shift()();
          });
      };

      if (active < concurrency) {
        run();
      } else {
        queue.push(run);
      }
    });
  };
}
