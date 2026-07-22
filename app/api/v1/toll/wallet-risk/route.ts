import { assessWalletBehavioralRisk } from "@/lib/toll/wallet-risk";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollMeteredGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

/** POST /api/v1/toll/wallet-risk { wallet, entityLabel?, role? } */
export async function POST(request: Request) {
  const guard = await tollMeteredGuard(request, "policy", { requireAuth: true });
  if (!guard.ok) return guard.response;
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;
  const wallet = String(parsed.body.wallet ?? "").trim();
  if (wallet.length < 6) {
    return protocolError("invalid_wallet", "Missing wallet", 400);
  }
  const snap = assessWalletBehavioralRisk({
    wallet,
    entityLabel:
      typeof parsed.body.entityLabel === "string"
        ? parsed.body.entityLabel
        : undefined,
    role:
      parsed.body.role === "issuer" ||
      parsed.body.role === "investor" ||
      parsed.body.role === "operator" ||
      parsed.body.role === "unknown"
        ? parsed.body.role
        : undefined,
  });
  return protocolJson({
    ok: true,
    ...snap,
    meter: {
      remaining: guard.meter.remaining,
      limit: guard.meter.limit,
      cost: guard.meter.cost,
    },
  });
}
