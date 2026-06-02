import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import { resolveAcademySessionSecret } from "./security";

function secret(): string | null {
  return resolveAcademySessionSecret();
}

function sign(payload: string): string | null {
  const s = secret();
  if (!s) return null;
  return createHmac("sha256", s).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function encodeSignedPayload<T extends object>(payload: T): string {
  const p = JSON.stringify(payload);
  const s = sign(p);
  if (!s) {
    throw new Error("ACADEMY_SESSION_SECRET not configured");
  }
  return Buffer.from(JSON.stringify({ p, s })).toString("base64url");
}

export function decodeSignedPayload<T extends object>(token: string): T | null {
  try {
    const raw = JSON.parse(
      Buffer.from(token, "base64url").toString("utf8")
    ) as { p?: string; s?: string };
    if (!raw.p || !raw.s) return null;
    const expected = sign(raw.p);
    if (!expected || !safeEqual(expected, raw.s)) return null;
    return JSON.parse(raw.p) as T;
  } catch {
    return null;
  }
}

export function newSessionId(): string {
  return randomBytes(8).toString("hex");
}

export function sessionExpired(iso: string): boolean {
  return Date.now() > new Date(iso).getTime();
}

export function expiresInMinutes(minutes: number): string {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}
