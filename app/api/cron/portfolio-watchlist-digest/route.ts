import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { runPortfolioWatchlistDigest } from "@/lib/green/portfolio-watchlist-digest";

export const runtime = "nodejs";

/** Daily 13:00 UTC — portfolio watchlist alert digest. */
export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await runPortfolioWatchlistDigest();
  console.log("[portfolio-watchlist-digest]", JSON.stringify(result));
  return NextResponse.json({ ok: true, ...result });
}
