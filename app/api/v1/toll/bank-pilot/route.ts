import { NextResponse } from "next/server";

import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";
import {
  appendBankDecision,
  enrollBankPilot,
  getBankPilotBySlug,
  listBankDecisions,
  listBankPilots,
  BANK_PILOT_DISCLAIMER,
} from "@/lib/toll/bank-pilot";
import { routeEligibility } from "@/lib/toll/eligibility";
import { evaluateTollPolicy } from "@/lib/toll/policy";
import { resolveAurosAsset } from "@/lib/toll/resolve";
import { listProofStreamEventsAsync } from "@/lib/proof-stream";
import type { TollPolicyRuleId } from "@/lib/toll/policy";
import type { TollEligibilityRuleId } from "@/lib/toll/eligibility";

export const runtime = "nodejs";

/** GET ?slug= — pilot profile + recent decisions; or list */
export async function GET(request: Request) {
  const ip = getRequestIp(request);
  const { allowed } = await checkRateLimitAsync(
    `toll-bank-get:${ip}`,
    40,
    60_000
  );
  if (!allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }
  const url = new URL(request.url);
  const slug = (url.searchParams.get("slug") ?? "").trim();
  if (!slug) {
    return NextResponse.json({
      ok: true,
      pilots: listBankPilots().map((p) => ({
        id: p.id,
        slug: p.slug,
        bankName: p.bankName,
        status: p.status,
        jurisdiction: p.jurisdiction,
        createdAt: p.createdAt,
      })),
      disclaimer: BANK_PILOT_DISCLAIMER,
    });
  }
  const pilot = getBankPilotBySlug(slug);
  if (!pilot) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({
    ok: true,
    pilot,
    decisions: listBankDecisions({ bankPilotId: pilot.id, limit: 20 }),
    disclaimer: BANK_PILOT_DISCLAIMER,
  });
}

/**
 * POST actions:
 * - enroll: { action: "enroll", bankName, contactEmail, slug?, ... }
 * - decide: { action: "decide", slug, kind: "policy"|"eligibility", q, ... }
 */
export async function POST(request: Request) {
  const ip = getRequestIp(request);
  const { allowed } = await checkRateLimitAsync(
    `toll-bank-post:${ip}`,
    20,
    3_600_000
  );
  if (!allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const action = String(body.action ?? "enroll").trim();

  if (action === "enroll") {
    const row = enrollBankPilot({
      bankName: String(body.bankName ?? ""),
      contactEmail: String(body.contactEmail ?? ""),
      slug: typeof body.slug === "string" ? body.slug : undefined,
      jurisdiction:
        typeof body.jurisdiction === "string" ? body.jurisdiction : undefined,
      policyRules: Array.isArray(body.policyRules)
        ? (body.policyRules as TollPolicyRuleId[])
        : undefined,
      eligibilityRules: Array.isArray(body.eligibilityRules)
        ? (body.eligibilityRules as TollEligibilityRuleId[])
        : undefined,
      notes: typeof body.notes === "string" ? body.notes : undefined,
    });
    if ("error" in row) {
      return NextResponse.json(row, { status: 400 });
    }
    return NextResponse.json({
      ok: true,
      pilot: row,
      desk: `/green/toll/bank?slug=${row.slug}`,
      disclaimer: BANK_PILOT_DISCLAIMER,
    });
  }

  if (action === "decide") {
    const slug = String(body.slug ?? "").trim();
    const pilot = getBankPilotBySlug(slug);
    if (!pilot || pilot.status === "paused") {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    const kind = body.kind === "eligibility" ? "eligibility" : "policy";
    const q = String(body.q ?? body.assetDnaId ?? "").trim();
    if (!q) {
      return NextResponse.json({ error: "invalid_q" }, { status: 400 });
    }

    if (kind === "eligibility") {
      const result = await routeEligibility({
        assetQuery: q,
        operation: (["mint", "buy", "transfer", "redeem", "list"].includes(
          String(body.operation)
        )
          ? body.operation
          : "buy") as "mint" | "buy" | "transfer" | "redeem" | "list",
        rules: pilot.eligibilityRules,
        investor:
          body.investor && typeof body.investor === "object"
            ? (body.investor as {
                jurisdiction?: string;
                residency?: string;
                wallet?: string;
                pep?: boolean;
                accredited?: boolean;
              })
            : undefined,
      });
      const log = appendBankDecision({
        bankPilotId: pilot.id,
        kind: "eligibility",
        query: q,
        decision: result.decision,
        ruleIds: result.ruleIds,
        reasons: result.reasons,
        trustOverall: result.trustOverall,
      });
      return NextResponse.json({
        ok: true,
        kind,
        pilot: { id: pilot.id, slug: pilot.slug, bankName: pilot.bankName },
        result,
        logId: log.id,
        disclaimer: BANK_PILOT_DISCLAIMER,
      });
    }

    const resolved = await resolveAurosAsset({ q });
    const dna = resolved.resolved ? resolved.dna : null;
    const events = dna
      ? await listProofStreamEventsAsync(dna.id, 50)
      : undefined;
    const policy = evaluateTollPolicy({
      dna,
      events,
      rules: pilot.policyRules,
    });
    const log = appendBankDecision({
      bankPilotId: pilot.id,
      kind: "policy",
      query: q,
      decision: policy.decision,
      ruleIds: policy.ruleIds,
      reasons: policy.reasons,
      trustOverall: policy.trustOverall,
    });
    return NextResponse.json({
      ok: true,
      kind,
      pilot: { id: pilot.id, slug: pilot.slug, bankName: pilot.bankName },
      resolved: resolved.resolved,
      result: policy,
      logId: log.id,
      disclaimer: BANK_PILOT_DISCLAIMER,
    });
  }

  return NextResponse.json({ error: "invalid_action" }, { status: 400 });
}
