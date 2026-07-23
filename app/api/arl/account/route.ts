import { NextResponse } from "next/server";
import { z } from "zod";

import {
  attachArlLabCookie,
  isValidArlAccountId,
  resolveArlLabAccount,
} from "@/lib/arl/lab-session";
import { getArlAccount } from "@/lib/arl/ledger";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const accountQuery = z.string().min(3).max(64).regex(/^[a-zA-Z0-9_-]+$/);

export async function GET(req: Request) {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(`arl-account:${ip}`, 120, 3_600_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "rate_limited", message: "Too many requests" }, { status: 429 });
  }

  const url = new URL(req.url);
  const raw = url.searchParams.get("account");
  const claimed =
    raw && accountQuery.safeParse(raw).success && isValidArlAccountId(raw) ? raw : null;

  const { accountId, cookieValue } = resolveArlLabAccount(req, claimed);

  try {
    const snap = await getArlAccount(accountId);
    const res = NextResponse.json(snap);
    return attachArlLabCookie(res, cookieValue);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ledger error";
    return NextResponse.json({ error: "ledger_error", message: msg }, { status: 400 });
  }
}
