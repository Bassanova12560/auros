import { createHash, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

/** Ethereum address (strict). */
export const ethAddress = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "invalid ethereum address");

/** Agent / device id: printable, bounded — blocks header injection & log forging. */
export const agentIdSchema = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[a-zA-Z0-9:_@.\-]+$/, "invalid agent id");

export const indexIdSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-zA-Z0-9_\-]+$/, "invalid index id");

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function bucketKey(parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 32);
}

/**
 * Fixed-window rate limit. Returns true if allowed.
 */
export function consumeRateLimit(
  keyParts: string[],
  limit: number,
  windowMs: number,
): { ok: boolean; remaining: number; resetAt: number } {
  const key = bucketKey(keyParts);
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    b = { count: 0, resetAt: now + windowMs };
    buckets.set(key, b);
  }
  if (b.count >= limit) {
    return { ok: false, remaining: 0, resetAt: b.resetAt };
  }
  b.count += 1;
  return { ok: true, remaining: limit - b.count, resetAt: b.resetAt };
}

/** Periodic cleanup to avoid unbounded Map growth. */
setInterval(() => {
  const now = Date.now();
  for (const [k, b] of buckets) {
    if (now >= b.resetAt) buckets.delete(k);
  }
}, 60_000).unref?.();

export function clientIp(req: Request): string {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length > 0) {
    return xf.split(",")[0]!.trim().slice(0, 64);
  }
  return (req.socket.remoteAddress ?? "unknown").slice(0, 64);
}

export function rateLimitMiddleware(opts: {
  limit: number;
  windowMs: number;
  key?: (req: Request) => string[];
}): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    const parts = opts.key
      ? opts.key(req)
      : ["ip", clientIp(req), req.method, req.path];
    const result = consumeRateLimit(parts, opts.limit, opts.windowMs);
    res.setHeader("X-RateLimit-Remaining", String(result.remaining));
    res.setHeader("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));
    if (!result.ok) {
      res.status(429).json({ error: "Rate limit exceeded" });
      return;
    }
    next();
  };
}

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  next();
}

export function corsAllowlist(req: Request, res: Response, next: NextFunction) {
  const raw = process.env.CORS_ORIGINS ?? "http://localhost:3000,https://getauros.com";
  const allowed = raw.split(",").map((s) => s.trim()).filter(Boolean);
  const origin = req.headers.origin;
  if (origin && allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Agent-ID, X-API-Key");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  }
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
}

export function safeEqualString(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/** Operator / keeper key for privileged mock endpoints (mark-price, insurance report, mint). */
export function requireOperatorKey(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.ARL_OPERATOR_KEY ?? process.env.AUROS_LIQUIDITY_API_KEY;
  const provided = req.header("x-api-key") ?? "";
  if (!expected || !safeEqualString(provided, expected)) {
    res.status(401).json({ error: "Operator API key required" });
    return;
  }
  next();
}

export function parseAgentId(req: Request): string | null {
  const raw = req.header("x-agent-id");
  if (!raw) return null;
  const parsed = agentIdSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export function requireValidAgentId(req: Request, res: Response, next: NextFunction) {
  // Probes / load balancers must not need agent credentials.
  if (req.path === "/health") return next();
  const allowAnon = process.env.AGENT_ID_REQUIRED === "false";
  const raw = req.header("x-agent-id");
  if (!raw) {
    if (allowAnon) return next();
    res.status(400).json({ error: "X-Agent-ID header is required" });
    return;
  }
  const parsed = agentIdSchema.safeParse(raw);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid X-Agent-ID", issues: parsed.error.issues });
    return;
  }
  next();
}
