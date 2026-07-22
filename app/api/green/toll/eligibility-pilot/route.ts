import { NextResponse } from "next/server";

import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  ALL_ELIGIBILITY_RULES,
  routeEligibility,
  type TollEligibilityOperation,
  type TollEligibilityRuleId,
} from "@/lib/toll/eligibility";

export const runtime = "nodejs";

const OPS: TollEligibilityOperation[] = [
  "mint",
  "buy",
  "transfer",
  "redeem",
  "list",
];

/** POST /api/green/toll/eligibility-pilot — desk demo without burning API credits */
export async function POST(request: Request) {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(
    `toll-eligibility-pilot:${ip}`,
    30,
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

  const q = String(body.q ?? body.assetDnaId ?? body.assetQuery ?? "").trim();
  if (!q) {
    return NextResponse.json({ error: "invalid_query" }, { status: 400 });
  }

  const opRaw = String(body.operation ?? "buy").trim().toLowerCase();
  if (!OPS.includes(opRaw as TollEligibilityOperation)) {
    return NextResponse.json({ error: "invalid_operation" }, { status: 400 });
  }

  const inv = body.investor;
  const investor =
    inv && typeof inv === "object" && !Array.isArray(inv)
      ? {
          jurisdiction:
            typeof (inv as Record<string, unknown>).jurisdiction === "string"
              ? String((inv as Record<string, unknown>).jurisdiction)
              : undefined,
          residency:
            typeof (inv as Record<string, unknown>).residency === "string"
              ? String((inv as Record<string, unknown>).residency)
              : undefined,
          wallet:
            typeof (inv as Record<string, unknown>).wallet === "string"
              ? String((inv as Record<string, unknown>).wallet)
              : undefined,
          pep:
            typeof (inv as Record<string, unknown>).pep === "boolean"
              ? Boolean((inv as Record<string, unknown>).pep)
              : undefined,
          accredited:
            typeof (inv as Record<string, unknown>).accredited === "boolean"
              ? Boolean((inv as Record<string, unknown>).accredited)
              : undefined,
        }
      : undefined;

  const rawRules = Array.isArray(body.rules) ? body.rules : ALL_ELIGIBILITY_RULES;
  const rules = rawRules.filter((r): r is TollEligibilityRuleId =>
    ALL_ELIGIBILITY_RULES.includes(r as TollEligibilityRuleId)
  );

  const result = await routeEligibility({
    assetQuery: q,
    investor,
    operation: opRaw as TollEligibilityOperation,
    rules: rules.length ? rules : ALL_ELIGIBILITY_RULES,
  });

  return NextResponse.json({ ok: true, ...result });
}
