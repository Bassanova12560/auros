import { NextResponse } from "next/server";

import { isValidAssetDnaId } from "@/lib/asset-dna";
import { listProofStreamEventsAsync } from "@/lib/proof-stream";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

/** Public read — Proof Stream events for an Asset DNA. */
export async function GET(request: Request, { params }: Params) {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`asset-dna-stream:${ip}`, 60, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }

  const { id: raw } = await params;
  const id = decodeURIComponent(raw ?? "").trim();
  if (!isValidAssetDnaId(id)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const url = new URL(request.url);
  const limitRaw = Number(url.searchParams.get("limit") ?? "50");
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 50;

  const events = await listProofStreamEventsAsync(id, limit);

  return NextResponse.json({
    ok: true,
    assetDnaId: id,
    count: events.length,
    events,
  });
}
