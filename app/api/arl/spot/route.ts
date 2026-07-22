import { NextResponse } from "next/server";
import { z } from "zod";

import { settleSpot } from "@/lib/arl/ledger";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const bodySchema = z.object({
  accountId: z.string().min(3).max(64).regex(/^[a-zA-Z0-9_-]+$/),
  marketId: z.enum(["kwh-france", "kwh-texas", "h2o-ca", "flop"]),
  side: z.enum(["buy", "sell"]),
  amount: z.number().positive().max(100_000),
  markOverride: z.number().positive().optional(),
});

/** Settle spot against shared lab balances (EUR ↔ resource). */
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

  try {
    const snap = await settleSpot(parsed.data);
    return NextResponse.json(snap);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "spot failed";
    return NextResponse.json({ error: "spot_rejected", message: msg }, { status: 400 });
  }
}
