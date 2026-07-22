import { routeEligibility, type TollEligibilityOperation } from "@/lib/toll";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollMeteredGuard,
} from "@/lib/toll/http";
import {
  ALL_ELIGIBILITY_RULES,
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

/** POST /api/v1/toll/eligibility — Bearer + policy credits */
export async function POST(request: Request) {
  const guard = await tollMeteredGuard(request, "policy", { requireAuth: true });
  if (!guard.ok) return guard.response;

  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;

  const q = String(
    parsed.body.assetQuery ??
      parsed.body.assetDnaId ??
      parsed.body.q ??
      parsed.body.id ??
      ""
  ).trim();
  if (!q) {
    return protocolError(
      "invalid_query",
      "Missing assetQuery or assetDnaId",
      400
    );
  }

  const opRaw = String(parsed.body.operation ?? "").trim().toLowerCase();
  if (!OPS.includes(opRaw as TollEligibilityOperation)) {
    return protocolError(
      "invalid_query",
      "operation must be mint|buy|transfer|redeem|list",
      400
    );
  }
  const operation = opRaw as TollEligibilityOperation;

  const inv = parsed.body.investor;
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

  const rawRules = Array.isArray(parsed.body.rules)
    ? parsed.body.rules
    : ALL_ELIGIBILITY_RULES;
  const rules = rawRules.filter((r): r is TollEligibilityRuleId =>
    ALL_ELIGIBILITY_RULES.includes(r as TollEligibilityRuleId)
  );

  const result = await routeEligibility({
    assetQuery: q,
    investor,
    operation,
    rules: rules.length ? rules : ALL_ELIGIBILITY_RULES,
  });

  return protocolJson({
    ok: true,
    ...result,
    meter: {
      remaining: guard.meter.remaining,
      limit: guard.meter.limit,
      cost: guard.meter.cost,
    },
  });
}
