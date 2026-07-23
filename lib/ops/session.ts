import { createHmac, timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";

/** Ops UI session — never paste CRON_SECRET into the browser after unlock. */
export const OPS_SESSION_COOKIE = "auros_ops";

const COOKIE_MAX_AGE_SEC = 60 * 60 * 12; // 12h

export function resolveOpsSessionSecret(): string | null {
  const dedicated = process.env.OPS_SESSION_SECRET?.trim();
  if (dedicated) return dedicated;
  const cron = process.env.CRON_SECRET?.trim();
  return cron || null;
}

function signExp(secret: string, exp: number): string {
  return createHmac("sha256", secret)
    .update(`auros-ops:v1:${exp}`)
    .digest("base64url");
}

export function mintOpsSessionCookieValue(nowMs = Date.now()): string | null {
  const secret = resolveOpsSessionSecret();
  if (!secret) return null;
  const exp = Math.floor(nowMs / 1000) + COOKIE_MAX_AGE_SEC;
  return `v1.${exp}.${signExp(secret, exp)}`;
}

export function verifyOpsSessionCookieValue(
  raw: string | undefined | null,
  nowMs = Date.now(),
): boolean {
  if (!raw) return false;
  const secret = resolveOpsSessionSecret();
  if (!secret) return false;

  const parts = raw.trim().split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const exp = Number(parts[1]);
  const sig = parts[2];
  if (!Number.isFinite(exp) || !sig || exp * 1000 < nowMs) return false;

  const expected = signExp(secret, exp);
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function readOpsSessionCookie(req: Request): boolean {
  const header = req.headers.get("cookie") ?? "";
  const match = header.match(new RegExp(`(?:^|;\\s*)${OPS_SESSION_COOKIE}=([^;]+)`));
  if (!match?.[1]) return false;
  try {
    return verifyOpsSessionCookieValue(decodeURIComponent(match[1]));
  } catch {
    return verifyOpsSessionCookieValue(match[1]);
  }
}

/** Cookie session OR Bearer cron/ops secret (scripts / Vercel cron). */
export function isOpsAuthorized(
  req: Request,
  options?: { allowDevWithoutSecret?: boolean },
): boolean {
  if (readOpsSessionCookie(req)) return true;
  if (isCronAuthorized(req, options)) return true;

  const opsSecret = process.env.OPS_SESSION_SECRET?.trim();
  if (!opsSecret) return false;
  const auth = req.headers.get("authorization")?.trim() ?? "";
  const bare = auth.startsWith("Bearer ") ? auth.slice(7).trim() : auth;
  if (!bare) return false;
  const a = Buffer.from(bare);
  const b = Buffer.from(opsSecret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function secretsMatch(presented: string, expected: string): boolean {
  const a = Buffer.from(presented);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Accept OPS_SESSION_SECRET or CRON_SECRET for unlock (prefer dedicated ops secret). */
export function isValidOpsUnlockSecret(presented: string): boolean {
  const trimmed = presented.trim();
  if (!trimmed) return false;
  const ops = process.env.OPS_SESSION_SECRET?.trim();
  const cron = process.env.CRON_SECRET?.trim();
  if (ops && secretsMatch(trimmed, ops)) return true;
  if (cron && secretsMatch(trimmed, cron)) return true;
  return false;
}

export function attachOpsSessionCookie(res: NextResponse): NextResponse {
  const value = mintOpsSessionCookieValue();
  if (!value) return res;
  res.cookies.set({
    name: OPS_SESSION_COOKIE,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SEC,
  });
  return res;
}

export function clearOpsSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set({
    name: OPS_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

/** Server components: read cookie jar value. */
export function hasOpsSessionFromCookieValue(raw: string | undefined): boolean {
  return verifyOpsSessionCookieValue(raw);
}
