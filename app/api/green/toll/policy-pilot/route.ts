import { NextResponse } from "next/server";

import { listProofStreamEventsAsync } from "@/lib/proof-stream";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { resolveAurosAsset } from "@/lib/toll/resolve";
import {
  evaluateTollPolicy,
  type TollPolicyRuleId,
} from "@/lib/toll/policy";

export const runtime = "nodejs";

const ALL_RULES: TollPolicyRuleId[] = [
  "deny_unknown",
  "deny_doc_stale_90d",
  "deny_unmapped_entity",
  "review_demo_tier",
  "review_low_trust",
  "require_jurisdiction",
];

/** POST /api/green/toll/policy-pilot — desk demo without burning API credits */
export async function POST(request: Request) {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`toll-policy-pilot:${ip}`, 30, 3_600_000);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const q = String(body.q ?? body.assetDnaId ?? "").trim();
  if (!q) {
    return NextResponse.json({ error: "invalid_query" }, { status: 400 });
  }

  const rawRules = Array.isArray(body.rules) ? body.rules : ALL_RULES;
  const rules = rawRules.filter((r): r is TollPolicyRuleId =>
    ALL_RULES.includes(r as TollPolicyRuleId)
  );

  const resolved = await resolveAurosAsset({ q });
  const dna = resolved.resolved ? resolved.dna : null;
  const events = dna
    ? await listProofStreamEventsAsync(dna.id, 50)
    : undefined;
  const decision = evaluateTollPolicy({
    dna,
    events,
    rules: rules.length ? rules : ALL_RULES,
  });

  return NextResponse.json({
    ok: true,
    query: q,
    resolved: resolved.resolved,
    ...decision,
  });
}
