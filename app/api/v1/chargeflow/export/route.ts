import {
  authenticateProtocolRequest,
  checkPremiumAccess,
  findKeyRecord,
  logProtocolUsage,
  premiumPricingMeta,
  protocolError,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";
import {
  listChargeflowForKey,
  type ChargeflowStatus,
  type ChargeflowUnitKind,
} from "@/lib/chargeflow";
import { SITE_URL } from "@/lib/comparators/site";
import {
  appendShieldAudit,
  createCloudTapReceipt,
  getTapUsage,
  incrementTapUsage,
  notifyShieldTapWebhooks,
  shieldPlanFromPremium,
  shieldTapLimit,
} from "@/lib/shield";

const EXPORT_MAX = 5000;
const EXPORT_DISCLAIMER =
  "ChargeFlow export is an indicative portfolio of off-chain CFU proofs — not a regulated audit opinion, GO/REC certificate, or investment advice.";

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) {
    return "id,unit_kind,status,created_at,verify_url,content_hash,generation_source\n";
  }
  const keys = [
    "id",
    "unit_kind",
    "status",
    "created_at",
    "retired_at",
    "verify_url",
    "content_hash",
    "generation_source",
    "operator_id",
  ];
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [keys.join(",")];
  for (const row of rows) {
    lines.push(keys.map((k) => escape(row[k])).join(","));
  }
  return `${lines.join("\n")}\n`;
}

export const GET = protocolRoute(async (req: Request) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  const url = new URL(req.url);
  const format = (url.searchParams.get("format") ?? "json").toLowerCase();
  if (format !== "json" && format !== "csv") {
    return protocolError("validation_error", "format must be json or csv", 400);
  }

  const shieldTap =
    url.searchParams.get("shield") === "1" ||
    url.searchParams.get("shield_tap") === "1";

  const kindRaw = url.searchParams.get("kind");
  let unit_kind: ChargeflowUnitKind | undefined;
  if (kindRaw) {
    if (kindRaw !== "e" && kindRaw !== "w" && kindRaw !== "f") {
      return protocolError("validation_error", "kind must be e, w, or f", 400);
    }
    unit_kind = kindRaw;
  }

  const statusRaw = url.searchParams.get("status");
  let status: ChargeflowStatus | undefined;
  if (statusRaw) {
    if (statusRaw !== "active" && statusRaw !== "retired") {
      return protocolError(
        "validation_error",
        "status must be active or retired",
        400
      );
    }
    status = statusRaw;
  }

  const operator_id = url.searchParams.get("operator_id")?.trim() || undefined;
  const limitRaw = url.searchParams.get("limit");
  const limit = limitRaw ? Number.parseInt(limitRaw, 10) : 1000;
  if (!Number.isFinite(limit) || limit < 1 || limit > EXPORT_MAX) {
    return protocolError(
      "validation_error",
      `limit must be between 1 and ${EXPORT_MAX}`,
      400
    );
  }

  const pageSize = Math.min(100, limit);
  const units: Record<string, unknown>[] = [];
  let offset = 0;
  let total = 0;
  while (units.length < limit) {
    const page = await listChargeflowForKey(auth.ctx.keyHash, {
      unit_kind,
      status,
      operator_id,
      limit: pageSize,
      offset,
    });
    total = page.total;
    if (page.items.length === 0) break;
    for (const item of page.items) {
      units.push({
        id: item.id,
        unit_kind: item.unit_kind,
        status: item.status,
        created_at: item.created_at,
        retired_at: item.retired_at ?? null,
        verify_url: item.verify_url,
        content_hash: item.content_hash,
        generation_source: item.generation_source ?? null,
        operator_id: item.operator_id ?? null,
      });
      if (units.length >= limit) break;
    }
    offset += page.items.length;
    if (offset >= page.total) break;
  }

  await logProtocolUsage(
    auth.ctx.keyHash,
    "/api/v1/chargeflow/export",
    "GET",
    200
  );

  const exported_at = new Date().toISOString();
  let shield:
    | {
        receipt_id: string;
        content_hash: string;
        verify_url: string;
        cloud_signature: string;
      }
    | undefined;

  if (shieldTap) {
    const plan = shieldPlanFromPremium(true);
    const tapLimit = shieldTapLimit(plan);
    const usage = getTapUsage(auth.ctx.keyHash);
    if (usage.count < tapLimit) {
      const exportBody = JSON.stringify({ exported_at, total, count: units.length, units });
      const tap = createCloudTapReceipt(
        {
          body: exportBody,
          kind: "tap",
          label: "chargeflow-export",
          plan,
          tenant_ref: auth.ctx.keyHash,
        },
        SITE_URL
      );
      if (tap.ok) {
        incrementTapUsage(auth.ctx.keyHash);
        void notifyShieldTapWebhooks(auth.ctx.keyHash, tap.receipt).catch(
          () => undefined
        );
        appendShieldAudit({
          key_hash: auth.ctx.keyHash,
          action: "export",
          receipt_id: tap.receipt.id,
          content_hash: tap.receipt.content_hash,
        });
        shield = {
          receipt_id: tap.receipt.id,
          content_hash: tap.receipt.content_hash,
          verify_url: tap.receipt.verify_url,
          cloud_signature: tap.receipt.cloud_signature,
        };
      }
    }
  }

  if (format === "csv") {
    const headers: Record<string, string> = {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="auros-chargeflow-export.csv"`,
      "X-AUROS-Export-Total": String(total),
      "X-AUROS-Export-Count": String(units.length),
    };
    if (shield) {
      headers["X-AUROS-Shield-Receipt"] = shield.receipt_id;
      headers["X-AUROS-Shield-Verify"] = shield.verify_url;
    }
    return new Response(toCsv(units), { status: 200, headers });
  }

  return protocolJson({
    exported_at,
    total,
    count: units.length,
    units,
    ...(shield
      ? {
          shield: {
            ...shield,
            note: "Opt-in via ?shield=1 — export hashed, payload discarded",
          },
        }
      : { shield_hint: "Add ?shield=1 to auto-tap this export" }),
    disclaimer: EXPORT_DISCLAIMER,
    pricing: premiumPricingMeta(),
  });
});
