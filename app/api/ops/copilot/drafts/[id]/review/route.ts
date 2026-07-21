import { NextRequest, NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { reviewCopilotDraft } from "@/lib/copilot/drafts-store";

export const runtime = "nodejs";

/**
 * POST — approve or reject a draft (ops).
 * Requires authenticated ops access
 * Body: { status: "approved" | "rejected", review_note? }
 */
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!isCronAuthorized(req, { allowDevWithoutSecret: false })) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const status = body.status;
  if (status !== "approved" && status !== "rejected") {
    return NextResponse.json(
      { ok: false, error: "status_must_be_approved_or_rejected" },
      { status: 400 }
    );
  }

  const draft = await reviewCopilotDraft({
    id,
    status,
    review_note:
      typeof body.review_note === "string" ? body.review_note : undefined,
  });

  if (!draft) {
    return NextResponse.json(
      { ok: false, error: "not_found_or_not_pending" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, draft });
}
