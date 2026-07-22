import {
  assessWalletBehavioralRisk,
  listWalletAttributions,
  upsertWalletAttribution,
  type WalletEntityRole,
} from "@/lib/toll/wallet-risk";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollMeteredGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

function parseRole(raw: unknown): WalletEntityRole | undefined {
  if (
    raw === "issuer" ||
    raw === "investor" ||
    raw === "operator" ||
    raw === "unknown"
  ) {
    return raw;
  }
  return undefined;
}

/**
 * POST /api/v1/toll/wallet-risk
 * - assess (default): { wallet, entityLabel?, role?, counterpartyWallet? }
 * - attribute: { action: "attribute", wallet, entityLabel, beneficialOwner?, role?, confidence? }
 * - list: { action: "list", wallet? }
 */
export async function POST(request: Request) {
  const guard = await tollMeteredGuard(request, "policy", { requireAuth: true });
  if (!guard.ok) return guard.response;
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;

  const action = String(parsed.body.action ?? "assess").trim();
  const meter = {
    remaining: guard.meter.remaining,
    limit: guard.meter.limit,
    cost: guard.meter.cost,
  };

  if (action === "list") {
    const wallet =
      typeof parsed.body.wallet === "string" ? parsed.body.wallet : undefined;
    return protocolJson({
      ok: true,
      attributions: listWalletAttributions(wallet).slice(0, 50),
      meter,
    });
  }

  if (action === "attribute") {
    const row = upsertWalletAttribution({
      wallet: String(parsed.body.wallet ?? ""),
      entityLabel: String(parsed.body.entityLabel ?? ""),
      beneficialOwner:
        typeof parsed.body.beneficialOwner === "string"
          ? parsed.body.beneficialOwner
          : undefined,
      role: parseRole(parsed.body.role),
      confidence:
        typeof parsed.body.confidence === "number"
          ? parsed.body.confidence
          : undefined,
    });
    if ("error" in row) {
      return protocolError(row.error, row.error, 400);
    }
    const snap = assessWalletBehavioralRisk({ wallet: row.wallet });
    return protocolJson({ ok: true, attribution: row, risk: snap, meter });
  }

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
    role: parseRole(parsed.body.role),
    counterpartyWallet:
      typeof parsed.body.counterpartyWallet === "string"
        ? parsed.body.counterpartyWallet
        : undefined,
  });
  return protocolJson({
    ok: true,
    ...snap,
    meter,
  });
}
