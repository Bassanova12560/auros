import { NextRequest, NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import {
  runCatalogDraftAgent,
  runContentDraftAgent,
} from "@/lib/copilot/agents";

export const runtime = "nodejs";

/**
 * POST — run catalog and/or content draft agents (ops).
 * Authorization: Bearer CRON_SECRET
 * Body: { action: "catalog" | "content", topic?, product_id?, kind_hint?, limit? }
 */
export async function POST(req: NextRequest) {
  if (!isCronAuthorized(req, { allowDevWithoutSecret: false })) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const action = typeof body.action === "string" ? body.action : "catalog";

  if (action === "content") {
    const topic =
      typeof body.topic === "string" && body.topic.trim()
        ? body.topic.trim()
        : null;
    if (!topic) {
      return NextResponse.json(
        { ok: false, error: "topic_required" },
        { status: 400 }
      );
    }
    const kind_hint =
      body.kind_hint === "faq" ||
      body.kind_hint === "listing_blurb" ||
      body.kind_hint === "changelog"
        ? body.kind_hint
        : "faq";
    const draft = await runContentDraftAgent({
      topic,
      product_id:
        typeof body.product_id === "string" ? body.product_id : undefined,
      kind_hint,
    });
    return NextResponse.json({ ok: true, drafts: [draft] });
  }

  const limit =
    typeof body.limit === "number" && body.limit > 0
      ? Math.min(body.limit, 20)
      : 8;
  const drafts = await runCatalogDraftAgent({ limit });
  return NextResponse.json({ ok: true, drafts, count: drafts.length });
}
