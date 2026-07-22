import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { requireGreenPremiumApiKey } from "@/lib/green/api/auth";
import { DNA_PREMIUM_PORTFOLIO_LIMIT } from "@/lib/green/dna-read-auth";
import { buildPortfolioAirgapPack } from "@/lib/green/portfolio-airgap";
import { getGreenPortfolioSnapshot } from "@/lib/green/portfolio-snapshot";
import { isCronAuthorized } from "@/lib/cron-auth";

export const runtime = "nodejs";

/**
 * Air-gapped portfolio pack (JSON download).
 * Auth: Clerk session OR Premium/Enterprise API key OR CRON_SECRET.
 */
export async function GET(request: Request) {
  const session = await auth();
  let allowed = Boolean(session.userId);

  if (!allowed && isCronAuthorized(request, { allowDevWithoutSecret: true })) {
    allowed = true;
  }

  if (!allowed) {
    const keyAuth = await requireGreenPremiumApiKey(request);
    if (!keyAuth.ok) return keyAuth.response;
    allowed = true;
  }

  if (!allowed) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limitRaw = Number(url.searchParams.get("limit") ?? "100");
  const limit = Number.isFinite(limitRaw)
    ? Math.min(Math.max(limitRaw, 1), DNA_PREMIUM_PORTFOLIO_LIMIT)
    : DNA_PREMIUM_PORTFOLIO_LIMIT;

  const snapshot = await getGreenPortfolioSnapshot(limit);
  const pack = buildPortfolioAirgapPack(snapshot);

  const download = url.searchParams.get("download") === "1";
  const headers: Record<string, string> = {
    "Cache-Control": "no-store",
  };
  if (download) {
    headers["Content-Disposition"] =
      `attachment; filename="auros-portfolio-airgap-${pack.contentHash.slice(0, 12)}.json"`;
  }

  return NextResponse.json({ ok: true, pack }, { headers });
}
