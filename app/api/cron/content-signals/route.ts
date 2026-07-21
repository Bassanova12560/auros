import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { runSocialContentSignalsAgent } from "@/lib/copilot/agents";

export const runtime = "nodejs";

/**
 * GET — weekly social draft signals for /ops/copilot (LinkedIn + X).
 * Does NOT publish. Requires authenticated ops access
 */
export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const drafts = await runSocialContentSignalsAgent();
  console.log(
    "[content-signals]",
    JSON.stringify({ count: drafts.length, ids: drafts.map((d) => d.id) })
  );

  return NextResponse.json({
    ok: true,
    created: drafts.length,
    draft_ids: drafts.map((d) => d.id),
    inbox: "/ops/copilot",
    note: "Human approve required — no auto-publish to LinkedIn/X.",
  });
}
