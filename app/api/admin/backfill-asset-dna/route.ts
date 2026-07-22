import { NextRequest, NextResponse } from "next/server";

import { backfillGreenAssetDna } from "@/lib/green/backfill-asset-dna";

export const runtime = "nodejs";

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

/** POST — mint deterministic Asset DNA for registry/market rows missing asset_dna_id. */
export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const result = await backfillGreenAssetDna();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "backfill_failed";
    console.error("[backfill-asset-dna]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
