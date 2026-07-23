import { NextResponse } from "next/server";
import { z } from "zod";

import {
  attachArlLabCookie,
  resolveArlLabMutationAccount,
} from "@/lib/arl/lab-session";
import { settleSpot } from "@/lib/arl/ledger";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const bodySchema = z.object({
  accountId: z.string().min(3).max(64).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  marketId: z.enum(["kwh-france", "kwh-texas", "h2o-ca", "flop"]),
  side: z.enum(["buy", "sell"]),
  amount: z.number().positive().max(100_000),
  markOverride: z.number().positive().optional(),
});

/** Settle spot against shared lab balances (EUR ↔ resource). Cookie session. */
export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(`arl-spot:${ip}`, 80, 3_600_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "rate_limited", message: "Spot rate limit" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json", message: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", message: parsed.error.issues.map((i) => i.message).join("; ") },
      { status: 400 },
    );
  }

  const session = resolveArlLabMutationAccount(req, parsed.data.accountId);
  if (!session.ok) {
    return NextResponse.json(
      { error: session.error, message: session.message },
      { status: session.status },
    );
  }

  try {
    const snap = await settleSpot({
      accountId: session.accountId,
      marketId: parsed.data.marketId,
      side: parsed.data.side,
      amount: parsed.data.amount,
      markOverride: parsed.data.markOverride,
    });
    const res = NextResponse.json(snap);
    return attachArlLabCookie(res, session.cookieValue);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "spot failed";
    const unavailable = /unavailable|transport|corrupt|save failed/i.test(msg);
    return NextResponse.json(
      { error: unavailable ? "service_unavailable" : "spot_rejected", message: msg },
      { status: unavailable ? 503 : 400 },
    );
  }
}
