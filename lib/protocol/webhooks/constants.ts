/** Max delivery attempts before dead_letter. */
export const WEBHOOK_MAX_DELIVERY_ATTEMPTS = 5;

/** Backoff delays in ms after each failed attempt (1-based index). */
export const WEBHOOK_RETRY_BACKOFF_MS = [
  60_000,
  5 * 60_000,
  15 * 60_000,
  60 * 60_000,
  4 * 60 * 60_000,
] as const;

export function webhookRetryDelayMs(attempts: number): number {
  const idx = Math.max(0, Math.min(attempts - 1, WEBHOOK_RETRY_BACKOFF_MS.length - 1));
  return WEBHOOK_RETRY_BACKOFF_MS[idx];
}
