import { NextRequest, NextResponse } from "next/server";

import { listCopilotDrafts } from "@/lib/copilot/drafts-store";
import type { CopilotDraftKind, CopilotDraftStatus } from "@/lib/copilot/types";
import { isOpsAuthorized } from "@/lib/ops/session";

export const runtime = "nodejs";

/** GET — list Copilot drafts (ops). Cookie session or Bearer. */
export async function GET(req: NextRequest) {
  if (!isOpsAuthorized(req, { allowDevWithoutSecret: false })) {
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
