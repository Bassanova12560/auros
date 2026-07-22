import {
  assessContinuityReadiness,
  enrollContinuityPlan,
  getContinuityPlaybook,
  listContinuityPlans,
  parseAssessContinuityInput,
  parseEnrollContinuityInput,
  CONTINUITY_DISCLAIMER,
  CONTINUITY_PLAYBOOKS,
  CONTINUITY_SCENARIO_KINDS,
  isContinuityScenarioKind,
} from "@/lib/toll/continuity";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollIpGuard,
  tollMeteredGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

/**
 * GET /api/v1/toll/continuity?assetDnaId=&scenario=&limit=
 * List enrollments + playbook templates (rate-limited).
 */
export async function GET(request: Request) {
  const guard = await tollIpGuard("continuity-get", 40);
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const assetDnaId = url.searchParams.get("assetDnaId")?.trim() || undefined;
  const scenarioRaw = url.searchParams.get("scenario");
  const scenario =
    scenarioRaw && isContinuityScenarioKind(scenarioRaw)
      ? scenarioRaw
      : undefined;
  const limitRaw = Number(url.searchParams.get("limit") ?? "50");
  const limit = Number.isFinite(limitRaw) ? limitRaw : 50;

  const plans = listContinuityPlans({ assetDnaId, scenario, limit });
  return protocolJson({
    ok: true,
    scenarios: CONTINUITY_SCENARIO_KINDS,
    playbooks: CONTINUITY_SCENARIO_KINDS.map((s) => getContinuityPlaybook(s)),
    plans,
    disclaimer: CONTINUITY_DISCLAIMER,
  });
}

/**
 * POST /api/v1/toll/continuity
 * - { action: "assess", assetDnaId, scenarios? } — readiness (Bearer + policy)
 * - enroll body — enroll playbook (Bearer + policy)
 */
export async function POST(request: Request) {
  const meter = await tollMeteredGuard(request, "policy", { requireAuth: true });
  if (!meter.ok) return meter.response;

  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;

  const action =
    typeof parsed.body.action === "string"
      ? parsed.body.action.trim().toLowerCase()
      : "enroll";

  if (action === "assess") {
    const input = parseAssessContinuityInput(parsed.body);
    if (!input.ok) {
      return protocolError(input.error, input.error, 400);
    }
    const readiness = assessContinuityReadiness(input.data);
    return protocolJson({
      ok: true,
      action: "assess",
      readiness,
      meter: {
        remaining: meter.meter.remaining,
        limit: meter.meter.limit,
        cost: meter.meter.cost,
      },
    });
  }

  if (action !== "enroll") {
    return protocolError(
      "invalid_action",
      "action must be enroll|assess",
      400
    );
  }

  const input = parseEnrollContinuityInput(parsed.body);
  if (!input.ok) {
    return protocolError(input.error, input.error, 400);
  }

  const plan = enrollContinuityPlan(input.data);
  const playbook = getContinuityPlaybook(plan.scenario);
  return protocolJson({
    ok: true,
    action: "enroll",
    plan,
    playbook,
    message:
      "Continuity plan enrolled — HITL checklist only; no custody recovery executed.",
    disclaimer: CONTINUITY_DISCLAIMER,
    meter: {
      remaining: meter.meter.remaining,
      limit: meter.meter.limit,
      cost: meter.meter.cost,
    },
  });
}
