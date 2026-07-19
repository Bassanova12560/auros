import { headers } from "next/headers";

/** In-memory limiter — fallback when Upstash is unset (dev / single instance). */
const requests = new Map<string, { count: number; resetAt: number }>();

type UpstashResponse = { result?: number | string | null };

async function upstashCommand(command: (string | number)[]): Promise<UpstashResponse | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    });
    if (!res.ok) return null;
    return (await res.json()) as UpstashResponse;
  } catch {
    return null;
  }
}

export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 3_600_000
): { allowed: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const record = requests.get(identifier);

  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    requests.set(identifier, {
      count: 1,
      resetAt,
    });
    return { allowed: true, remaining: limit - 1, reset: Math.ceil(resetAt / 1000) };
  }

  const reset = Math.ceil(record.resetAt / 1000);

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, reset };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count, reset };
}

/**
 * Durable rate limit via Upstash when configured; otherwise in-memory fallback.
 * Prefer this on Vercel for anon / IP limits that must survive cold starts.
 */
export async function checkRateLimitAsync(
  identifier: string,
  limit: number = 10,
  windowMs: number = 3_600_000
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const redisKey = `auros:rl:${identifier}`;
  const incr = await upstashCommand(["INCR", redisKey]);
  if (incr?.result !== undefined && incr.result !== null) {
    const count = Number(incr.result);
    if (count === 1) {
      await upstashCommand(["PEXPIRE", redisKey, windowMs]);
    }
    const ttl = await upstashCommand(["PTTL", redisKey]);
    const ttlMs = Number(ttl?.result ?? windowMs);
    const reset =
      ttlMs > 0
        ? Math.ceil((Date.now() + ttlMs) / 1000)
        : Math.ceil((Date.now() + windowMs) / 1000);
    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      reset,
    };
  }

  return checkRateLimit(identifier, limit, windowMs);
}

/** Client IP from Next.js server actions / RSC (falls back to `unknown`). */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = h.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

/** Client IP from Vercel / proxy headers (falls back to `unknown`). */
export function getRequestIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}
