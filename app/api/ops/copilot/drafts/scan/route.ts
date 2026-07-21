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

  const { readJsonBodyLimited } = await import("@/lib/security/request-guard");
  const { sanitizeUserText } = await import("@/lib/security/sanitize");

  const parsed = await readJsonBodyLimited<Record<string, unknown>>(req, {
    sensitive: true,
  });
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  const action = typeof body.action === "string" ? body.action : "catalog";

  if (action === "content") {
    const topic = sanitizeUserText(body.topic, 200);
    if (!topic) {
      return NextResponse.json(
        { ok: false, error: "topic_required" },
        { status: 400 }
      );
    }
    const kind_hint =
      body.kind_hint === "faq" ||
      body.kind_hint === "listing_blurb" ||
      body.kind_hint === "changelog" ||
      body.kind_hint === "social_linkedin" ||
      body.kind_hint === "social_x"
        ? body.kind_hint
        : "faq";
    const draft = await runContentDraftAgent({
      topic,
      product_id:
        typeof body.product_id === "string" ? body.product_id : undefined,
      kind_hint,
      canonical_url:
        typeof body.canonical_url === "string" ? body.canonical_url : undefined,
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
