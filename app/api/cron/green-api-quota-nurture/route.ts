import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { runGreenApiQuotaNurture } from "@/lib/green/green-api-nurture";

export const runtime = "nodejs";

/** Daily — email free API keys at 80%+ monthly quota with Premium upsell. */
export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await runGreenApiQuotaNurture();
  console.log("[green-api-quota-nurture]", JSON.stringify(result));
  return NextResponse.json({ ok: true, ...result });
}
