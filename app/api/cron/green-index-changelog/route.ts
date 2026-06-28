import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { dispatchGreenIndexChangelogWebhooks } from "@/lib/green/webhooks/dispatch-changelog";

export const runtime = "nodejs";

/** GET — monthly Green Index changelog webhooks (premium subscribers). */
export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "1";

  const result = await dispatchGreenIndexChangelogWebhooks({ force });
  console.log("[green-index-changelog]", JSON.stringify(result));

  return NextResponse.json({ ok: true, ...result });
}
