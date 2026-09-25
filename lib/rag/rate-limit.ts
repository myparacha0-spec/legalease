/**
 * Minimal in-memory rate limiter for the chat endpoint.
 *
 * NOTE: In-memory state is per-process — fine for a single-instance dev/FYP
 * deployment. For multi-instance production, replace this with something
 * shared (Redis/Postgres) without changing callers.
 */

interface WindowState {
  timestamps: number[];
}

const buckets = new Map<string, WindowState>();

export interface RateLimitConfig {
  /** Max messages per windowMs. */
  max: number;
  windowMs: number;
}

export const CHAT_RATE_LIMIT: RateLimitConfig = {
  max:
    Number(process.env.LEGALEASE_CHAT_RATE_LIMIT) > 0
      ? Number(process.env.LEGALEASE_CHAT_RATE_LIMIT)
      : 10,
  windowMs: 60_000,
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

export function rateLimit(key: string, config: RateLimitConfig = CHAT_RATE_LIMIT): RateLimitResult {
  const now = Date.now();
  let state = buckets.get(key);
  if (!state) {
    state = { timestamps: [] };
    buckets.set(key, state);
  }

  state.timestamps = state.timestamps.filter((t) => now - t < config.windowMs);

  if (state.timestamps.length >= config.max) {
    const retryAfterMs =
      config.windowMs - (now - state.timestamps[0]);
    return { allowed: false, remaining: 0, retryAfterMs: Math.max(0, retryAfterMs) };
  }

  state.timestamps.push(now);
  return { allowed: true, remaining: config.max - state.timestamps.length, retryAfterMs: 0 };
}

// Prevent unbounded memory growth on long-running processes.
setInterval(() => {
  const now = Date.now();
  for (const [key, state] of buckets) {
    state.timestamps = state.timestamps.filter((t) => now - t < CHAT_RATE_LIMIT.windowMs);
    if (state.timestamps.length === 0) buckets.delete(key);
  }
}, 60_000).unref?.();