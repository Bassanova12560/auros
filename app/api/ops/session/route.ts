import { NextResponse } from "next/server";
import { z } from "zod";

import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";
import {
  attachOpsSessionCookie,
  clearOpsSessionCookie,
  isOpsAuthorized,
  isValidOpsUnlockSecret,
  resolveOpsSessionSecret,
} from "@/lib/ops/session";

export const runtime = "nodejs";

const bodySchema = z.object({
  secret: z.string().min(8).max(512),
});

/** Unlock ops UI session (HttpOnly cookie). Do not store the secret in localStorage. */
export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(`ops-session:${ip}`, 20, 3_600_000);
  if (!rate.allowed) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const expected = resolveOpsSessionSecret();
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "ops_unconfigured", message: "OPS_SESSION_SECRET (or CRON_SECRET) missing" },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation_error" }, { status: 400 });
  }

  if (!isValidOpsUnlockSecret(parsed.data.secret)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  return attachOpsSessionCookie(res);
}

/** Clear ops session cookie. */
export async function DELETE(req: Request) {
  if (!isOpsAuthorized(req, { allowDevWithoutSecret: false })) {
    const res = NextResponse.json({ ok: true });
    return clearOpsSessionCookie(res);
  }
  const res = NextResponse.json({ ok: true });
  return clearOpsSessionCookie(res);
}

/** Session probe for ops UI. */
export async function GET(req: Request) {
  if (!isOpsAuthorized(req, { allowDevWithoutSecret: false })) {
    return NextResponse.json({ ok: false, authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true, authenticated: true });
}
