import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

/** HttpOnly lab identity — mutations bind to this account, not client-claimed IDs alone. */
export const ARL_LAB_COOKIE = "auros_arl_lab";

const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 90; // 90 days
const ACCOUNT_RE = /^[a-zA-Z0-9_-]{3,64}$/;

export function resolveArlLabSigningKey(): string | null {
  const dedicated = process.env.ARL_LAB_SIGNING_KEY?.trim();
  if (dedicated) return dedicated;
  const cron = process.env.CRON_SECRET?.trim();
  if (cron) return cron;
  if (process.env.NODE_ENV !== "production") return "auros-lab-dev-only";
  return null;
}

export function isValidArlAccountId(value: string): boolean {
  return ACCOUNT_RE.test(value);
}

export function newArlLabAccountId(): string {
  return `lab_${randomBytes(6).toString("hex")}${Date.now().toString(36).slice(-4)}`;
}

function signPayload(secret: string, accountId: string, exp: number): string {
  return createHmac("sha256", secret)
    .update(`auros-arl-lab:v1:${accountId}:${exp}`)
    .digest("base64url");
}

/** Cookie value: v1.<accountId>.<exp>.<sig> */
export function mintArlLabCookieValue(accountId: string, nowMs = Date.now()): string | null {
  const secret = resolveArlLabSigningKey();
  if (!secret || !isValidArlAccountId(accountId)) return null;
  const exp = Math.floor(nowMs / 1000) + COOKIE_MAX_AGE_SEC;
  const sig = signPayload(secret, accountId, exp);
  return `v1.${accountId}.${exp}.${sig}`;
}

export function verifyArlLabCookieValue(
  raw: string | undefined | null,
  nowMs = Date.now(),
): string | null {
  if (!raw) return null;
  const secret = resolveArlLabSigningKey();
  if (!secret) return null;

  const parts = raw.trim().split(".");
  if (parts.length !== 4 || parts[0] !== "v1") return null;
  const [, accountId, expRaw, sig] = parts;
  if (!accountId || !expRaw || !sig || !isValidArlAccountId(accountId)) return null;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp * 1000 < nowMs) return null;

  const expected = signPayload(secret, accountId, exp);
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return accountId;
}

export function readArlLabCookie(req: Request): string | null {
  const header = req.headers.get("cookie") ?? "";
  const match = header.match(new RegExp(`(?:^|;\\s*)${ARL_LAB_COOKIE}=([^;]+)`));
  if (!match?.[1]) return null;
  try {
    return verifyArlLabCookieValue(decodeURIComponent(match[1]));
  } catch {
    return verifyArlLabCookieValue(match[1]);
  }
}

/**
 * Resolve lab account for reads: cookie wins; else claimed; else mint new.
 * Always returns a cookie value to (re)attach when signing key is available.
 */
export function resolveArlLabAccount(
  req: Request,
  claimed: string | null | undefined,
): { accountId: string; cookieValue: string | null } {
  const fromCookie = readArlLabCookie(req);
  if (fromCookie) {
    return { accountId: fromCookie, cookieValue: mintArlLabCookieValue(fromCookie) };
  }

  const claimedId =
    claimed && isValidArlAccountId(claimed) ? claimed : newArlLabAccountId();
  return { accountId: claimedId, cookieValue: mintArlLabCookieValue(claimedId) };
}

/**
 * Mutations: cookie is source of truth.
 * Soft bind: missing cookie + valid claimed id → accept once and set cookie.
 * Mismatch cookie vs claimed → reject.
 */
export function resolveArlLabMutationAccount(
  req: Request,
  claimed: string | null | undefined,
):
  | { ok: true; accountId: string; cookieValue: string | null }
  | { ok: false; status: 401 | 403; error: string; message: string } {
  const fromCookie = readArlLabCookie(req);

  if (fromCookie) {
    if (claimed && isValidArlAccountId(claimed) && claimed !== fromCookie) {
      return {
        ok: false,
        status: 403,
        error: "account_mismatch",
        message: "Lab session does not match accountId",
      };
    }
    return {
      ok: true,
      accountId: fromCookie,
      cookieValue: mintArlLabCookieValue(fromCookie),
    };
  }

  if (claimed && isValidArlAccountId(claimed)) {
    return {
      ok: true,
      accountId: claimed,
      cookieValue: mintArlLabCookieValue(claimed),
    };
  }

  return {
    ok: false,
    status: 401,
    error: "lab_session_required",
    message: "Call GET /api/arl/account first to open a lab session",
  };
}

export function attachArlLabCookie(
  res: NextResponse,
  cookieValue: string | null,
): NextResponse {
  if (!cookieValue) return res;
  res.cookies.set({
    name: ARL_LAB_COOKIE,
    value: cookieValue,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SEC,
  });
  return res;
}
