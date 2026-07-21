import { NextResponse } from "next/server";

import { getGreenPortfolioSnapshot } from "@/lib/green/portfolio-snapshot";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** Public read — Portfolio Console snapshot (DNA + recent Proof Stream). */
export async function GET(request: Request) {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`green-portfolio:${ip}`, 30, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }

  const url = new URL(request.url);
  const limitRaw = Number(url.searchParams.get("limit") ?? "50");
  const limit = Number.isFinite(limitRaw)
    ? Math.min(Math.max(limitRaw, 1), 100)
    : 50;

  const snapshot = await getGreenPortfolioSnapshot(limit);
  return NextResponse.json({ ok: true, ...snapshot });
}
