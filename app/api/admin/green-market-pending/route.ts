import { NextRequest, NextResponse } from "next/server";

import { listPendingGreenMarketListings } from "@/lib/green/market/green-market-db";

export const runtime = "nodejs";

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

/** GET pending marketplace listings — Requires authenticated ops access */
export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const items = await listPendingGreenMarketListings();
  return NextResponse.json({ ok: true, items });
}
