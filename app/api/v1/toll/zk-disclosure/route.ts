import {
  buildSelectiveDisclosure,
  isZkClaimType,
  type ZkClaimType,
} from "@/lib/toll/zk-disclosure";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollMeteredGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

/**
 * POST /api/v1/toll/zk-disclosure — selective-disclosure stub (Bearer + research credits).
 * Body: { claimType, publicInputs, privateHints?, salt? }
 */
export async function POST(request: Request) {
  const guard = await tollMeteredGuard(request, "research", {
    requireAuth: true,
  });
  if (!guard.ok) return guard.response;

  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;

  const claimRaw = String(parsed.body.claimType ?? "").trim().toLowerCase();
  if (!isZkClaimType(claimRaw)) {
    return protocolError(
      "invalid_input",
      "claimType must be eligibility|ratio|policy_match",
      400
    );
  }
  const claimType = claimRaw as ZkClaimType;

  const publicInputs = parsed.body.publicInputs;
  if (
    !publicInputs ||
    typeof publicInputs !== "object" ||
    Array.isArray(publicInputs)
  ) {
    return protocolError(
      "invalid_input",
      "publicInputs object required",
      400
    );
  }

  const privateHints =
    parsed.body.privateHints &&
    typeof parsed.body.privateHints === "object" &&
    !Array.isArray(parsed.body.privateHints)
      ? (parsed.body.privateHints as Record<string, unknown>)
      : undefined;

  const salt =
    typeof parsed.body.salt === "string" ? parsed.body.salt : undefined;

  let claim;
  try {
    claim = buildSelectiveDisclosure({
      claimType,
      publicInputs: publicInputs as Record<string, unknown>,
      privateHints,
      salt,
    });
  } catch {
    return protocolError("invalid_input", "Could not build disclosure claim", 400);
  }

  return protocolJson({
    ok: true,
    stub: true,
    claim,
    meter: {
      remaining: guard.meter.remaining,
      limit: guard.meter.limit,
      cost: guard.meter.cost,
    },
  });
}
