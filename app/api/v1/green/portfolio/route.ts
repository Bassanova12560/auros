import { NextResponse } from "next/server";

import { authorizeDnaVolumeRead } from "@/lib/green/dna-read-auth";
import { getGreenPortfolioSnapshot } from "@/lib/green/portfolio-snapshot";

export const runtime = "nodejs";

/**
 * Portfolio Console snapshot.
 * Volume: anon ≤20 · free key ≤50 · premium ≤100 (Bearer API key).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const limitRaw = Number(url.searchParams.get("limit") ?? "50");
  const auth = await authorizeDnaVolumeRead(request, limitRaw, "portfolio");
  if (!auth.ok) return auth.response;

  const snapshot = await getGreenPortfolioSnapshot(auth.limit);
  return NextResponse.json({
    ok: true,
    ...snapshot,
    meta: {
      tier: auth.tier,
      limit: auth.limit,
      capped: auth.capped,
    },
  });
}
