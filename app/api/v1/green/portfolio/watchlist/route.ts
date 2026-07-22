import { NextResponse } from "next/server";

import { isValidCaptureEmail } from "@/lib/email-capture";
import { upsertPortfolioWatchlist } from "@/lib/green/portfolio-watchlist";

export const runtime = "nodejs";

/**
 * POST /api/v1/green/portfolio/watchlist
 * Body: { email, assetDnaIds?: string[], locale?: string }
 * Empty assetDnaIds = watch entire portfolio snapshot.
 */
export async function POST(request: Request) {
  let body: {
    email?: string;
    assetDnaIds?: string[];
    locale?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  if (!isValidCaptureEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const assetDnaIds = Array.isArray(body.assetDnaIds)
    ? body.assetDnaIds.map((id) => String(id).trim()).filter(Boolean).slice(0, 20)
    : [];

  const row = await upsertPortfolioWatchlist({
    email,
    assetDnaIds,
    locale: body.locale,
  });

  return NextResponse.json({
    ok: true,
    id: row.id,
    email: row.email,
    scope: row.assetDnaIds.length === 0 ? "all" : "selected",
    assetCount: row.assetDnaIds.length,
  });
}
