import { NextResponse } from "next/server";
import { z } from "zod";

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
  const parsed = accountQuery.safeParse(url.searchParams.get("account") ?? "");
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", message: "account query required (3–64 [a-zA-Z0-9_-])" },
      { status: 400 },
    );
  }

  try {
    const snap = await getArlAccount(parsed.data);
    return NextResponse.json(snap);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ledger error";
    return NextResponse.json({ error: "ledger_error", message: msg }, { status: 400 });
  }
}
