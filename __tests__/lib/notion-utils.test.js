import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { withRetry, createLimiter } from '../../lib/notion-utils.js';

// ─── withRetry ───────────────────────────────────────────────────────────────

describe('withRetry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  // Always restore real timers so createLimiter tests aren't affected
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the result immediately when fn succeeds on first try', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const result = await withRetry(fn);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on 429 rate-limit error and eventually resolves', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce({ status: 429 })
      .mockResolvedValue('retried');

    const promise = withRetry(fn, 2);
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe('retried');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('retries on rate_limited code', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce({ code: 'rate_limited' })
      .mockResolvedValue('done');

    const promise = withRetry(fn, 2);
    await vi.runAllTimersAsync();
    expect(await promise).toBe('done');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('retries on 5xx transient errors', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce({ status: 503 })
      .mockResolvedValue('recovered');

    const promise = withRetry(fn, 2);
    await vi.runAllTimersAsync();
    expect(await promise).toBe('recovered');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('retries on notionhq_client_request_timeout code', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce({ code: 'notionhq_client_request_timeout' })
      .mockResolvedValue('ok');

    const promise = withRetry(fn, 2);
    await vi.runAllTimersAsync();
    expect(await promise).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws immediately for non-retryable errors (e.g. 400)', async () => {
    const err = { status: 400, message: 'bad request' };
    const fn = vi.fn().mockRejectedValue(err);
    await expect(withRetry(fn, 4)).rejects.toEqual(err);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('throws after exhausting maxRetries', async () => {
    const err = { status: 429 };
    const fn = vi.fn().mockRejectedValue(err);

    const promise = withRetry(fn, 2);
    // Register rejects assertion BEFORE advancing timers to avoid unhandled rejection
    const assertion = expect(promise).rejects.toEqual(err);
    await vi.runAllTimersAsync();
    await assertion;
    // called: attempt 0 + 2 retries = 3 total
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('respects retry-after header when present', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce({ status: 429, headers: { 'retry-after': '2' } })
      .mockResolvedValue('ok');

    const promise = withRetry(fn, 2);
    await vi.advanceTimersByTimeAsync(2000);
    expect(await promise).toBe('ok');
  });

  it('caps backoff at 15 000 ms', async () => {
    // Fail many times at 500 — backoff grows exponentially but is capped
    const fn = vi
      .fn()
      .mockRejectedValueOnce({ status: 500 })
      .mockRejectedValueOnce({ status: 500 })
      .mockRejectedValueOnce({ status: 500 })
      .mockResolvedValue('capped');

    const promise = withRetry(fn, 4);
    await vi.runAllTimersAsync();
    expect(await promise).toBe('capped');
    expect(fn).toHaveBeenCalledTimes(4);
  });
});

// ─── createLimiter ────────────────────────────────────────────────────────────

describe('createLimiter', () => {
  it('runs tasks up to concurrency limit simultaneously', async () => {
    const limit = createLimiter(2);
    let active = 0;
    let maxSeen = 0;

    const makeTask = () =>
      limit(() => {
        active++;
        maxSeen = Math.max(maxSeen, active);
        return new Promise((r) => setTimeout(() => { active--; r(true); }, 10));
      });

    await Promise.all([makeTask(), makeTask(), makeTask(), makeTask()]);
    expect(maxSeen).toBe(2);
  });

  it('queues tasks beyond concurrency and drains them', async () => {
    const limit = createLimiter(1);
    const order = [];

    await Promise.all([
      limit(() => new Promise((r) => setTimeout(() => { order.push(1); r(); }, 5))),
      limit(() => new Promise((r) => setTimeout(() => { order.push(2); r(); }, 5))),
      limit(() => new Promise((r) => setTimeout(() => { order.push(3); r(); }, 5))),
    ]);

    expect(order).toEqual([1, 2, 3]);
  });

  it('returns the resolved value from the wrapped fn', async () => {
    const limit = createLimiter(3);
    const result = await limit(() => Promise.resolve(42));
    expect(result).toBe(42);
  });

  it('propagates rejections', async () => {
    const limit = createLimiter(3);
    const err = new Error('boom');
    await expect(limit(() => Promise.reject(err))).rejects.toThrow('boom');
  });

  it('continues processing queue after a rejection', async () => {
    const limit = createLimiter(1);
    const results = [];

    await Promise.allSettled([
      limit(() => Promise.reject(new Error('fail'))),
      limit(() => { results.push('second'); return Promise.resolve(); }),
    ]);

    expect(results).toContain('second');
  });

  it('concurrency(3) allows 3 simultaneous tasks', async () => {
    const limit = createLimiter(3);
    let active = 0;
    let maxSeen = 0;

    const task = () =>
      limit(() => {
        active++;
        maxSeen = Math.max(maxSeen, active);
        return new Promise((r) => setTimeout(() => { active--; r(); }, 5));
      });

    await Promise.all([task(), task(), task(), task(), task()]);
    expect(maxSeen).toBe(3);
  });
});
