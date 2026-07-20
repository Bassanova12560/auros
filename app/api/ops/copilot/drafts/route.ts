import { NextRequest, NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { listCopilotDrafts } from "@/lib/copilot/drafts-store";
import type { CopilotDraftKind, CopilotDraftStatus } from "@/lib/copilot/types";

export const runtime = "nodejs";

/** GET — list Copilot drafts (ops). Authorization: Bearer CRON_SECRET */
export async function GET(req: NextRequest) {
  if (!isCronAuthorized(req, { allowDevWithoutSecret: false })) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get("status") as CopilotDraftStatus | null;
  const kind = url.searchParams.get("kind") as CopilotDraftKind | null;
  const drafts = await listCopilotDrafts({
    status: status === "pending" || status === "approved" || status === "rejected"
      ? status
      : undefined,
    kind: kind === "catalog" || kind === "content" ? kind : undefined,
    limit: 50,
  });

  return NextResponse.json({ ok: true, drafts });
}
