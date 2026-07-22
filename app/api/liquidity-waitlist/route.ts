import { NextResponse } from "next/server";

import {
  appendLiquidityWaitlist,
  normalizeLiquidityWaitlistInput,
} from "@/lib/liquidity/waitlist";
import { notifyLiquidityWaitlistSignup } from "@/lib/liquidity/waitlist-notify";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const { allowed } = checkRateLimit(`liquidity-waitlist:${ip}`, 5, 3_600_000);
  if (!allowed) {
    return NextResponse.json({ ok: false, error: "rate_limit" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const normalized = normalizeLiquidityWaitlistInput(
    body as Record<string, unknown>
  );
  if (!normalized.ok) {
    return NextResponse.json(
      { ok: false, error: normalized.error },
      { status: 400 }
    );
  }

  const row = appendLiquidityWaitlist(normalized.entry);
  const notify = await notifyLiquidityWaitlistSignup(row);
  if (!notify.ok) {
    return NextResponse.json(notify, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
