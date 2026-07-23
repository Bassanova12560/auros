import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { runCompareApyAlerts } from "@/lib/comparators/alerts-apy-moves";

export const runtime = "nodejs";

/**
 * Periodic APY/TVL move fan-out for compare shortlist watchers.
 * Auth: same cron gate as other ops jobs (no public recipe).
 */
export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await runCompareApyAlerts();
  console.log("[compare-apy-alerts]", JSON.stringify(result));
  return NextResponse.json({ ok: true, ...result });
}
