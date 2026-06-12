import { AsyncLocalStorage } from "node:async_hooks";

export type RateLimitHeaderValues = {
  limit: number;
  remaining: number;
  /** Unix timestamp (seconds) when the limit window resets. */
  reset: number;
};

type RateLimitStore = {
  current?: RateLimitHeaderValues;
};

const rateLimitStorage = new AsyncLocalStorage<RateLimitStore>();

export function runWithRateLimitContext<T>(fn: () => T | Promise<T>): Promise<T> {
  return Promise.resolve(rateLimitStorage.run({}, fn));
}

export function setRateLimitContext(values: RateLimitHeaderValues): void {
  const store = rateLimitStorage.getStore();
  if (store) {
    store.current = values;
  }
}

export function getRateLimitContext(): RateLimitHeaderValues | undefined {
  return rateLimitStorage.getStore()?.current;
}

/** First second of next UTC calendar month (monthly API key quota reset). */
export function monthQuotaResetUnix(): number {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0));
  return Math.floor(next.getTime() / 1000);
}

export function formatRateLimitHeaders(
  values: RateLimitHeaderValues
): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(values.limit),
    "X-RateLimit-Remaining": String(Math.max(0, values.remaining)),
    "X-RateLimit-Reset": String(values.reset),
  };
}
