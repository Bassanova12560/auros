import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { checkRegulatoryUpdates } from "@/lib/protocol/monitor/check-regulatory-updates";
import { retryPendingDeliveries } from "@/lib/protocol/webhooks/deliveries";

/** Cron endpoint — CRON_SECRET required in production. */
export async function GET(req: Request) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const [monitorResult, retryResult] = await Promise.all([
    checkRegulatoryUpdates(),
    retryPendingDeliveries(),
  ]);
  return NextResponse.json({
    ok: true,
    ...monitorResult,
    webhook_retries: retryResult,
  });
}
