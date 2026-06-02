const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_RE.test(value.trim());
}

/** Share tokens from nanoid(12) — alphanumeric + _ - */
export function isShareToken(value: string): boolean {
  const t = value.trim();
  return t.length >= 8 && t.length <= 32 && /^[A-Za-z0-9_-]+$/.test(t);
}

export function clampScore(value: unknown): number {
  const n = typeof value === "number" ? value : Number.parseInt(String(value), 10);
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
}
