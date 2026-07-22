import { NextResponse } from "next/server";

import { isValidAssetDnaId } from "@/lib/asset-dna";
import { authorizeDnaVolumeRead } from "@/lib/green/dna-read-auth";
import { listProofStreamEventsAsync } from "@/lib/proof-stream";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

/**
 * Proof Stream events for an Asset DNA.
 * Volume: anon ≤20 · free key ≤50 · premium ≤100.
 */
export async function GET(request: Request, { params }: Params) {
  const { id: raw } = await params;
  const id = decodeURIComponent(raw ?? "").trim();
  if (!isValidAssetDnaId(id)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const url = new URL(request.url);
  const limitRaw = Number(url.searchParams.get("limit") ?? "50");
  const auth = await authorizeDnaVolumeRead(request, limitRaw, "stream");
  if (!auth.ok) return auth.response;

  const events = await listProofStreamEventsAsync(id, auth.limit);

  return NextResponse.json({
    ok: true,
    assetDnaId: id,
    count: events.length,
    events,
    meta: {
      tier: auth.tier,
      limit: auth.limit,
      capped: auth.capped,
    },
  });
}
