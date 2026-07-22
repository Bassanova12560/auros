import { isValidAssetDnaId } from "@/lib/asset-dna";
import {
  CERTIFIED_EVENT_KINDS,
  certifyBillableLifecycleEvent,
  isCertifiedEventKind,
  listCertifiedLifecycleEvents,
  type CertifiedEventKind,
} from "@/lib/toll/event-certification";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollMeteredGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

/**
 * GET /api/v1/toll/events?assetDnaId=…&limit= — list certified lifecycle events.
 * Metered as trail (lookup tax).
 */
export async function GET(request: Request) {
  const guard = await tollMeteredGuard(request, "trail");
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const assetDnaId = (url.searchParams.get("assetDnaId") ?? "").trim();
  const limitRaw = url.searchParams.get("limit");
  const limit = limitRaw ? Number(limitRaw) : 50;

  if (!assetDnaId) {
    return protocolError("invalid_query", "Missing assetDnaId", 400);
  }
  if (!isValidAssetDnaId(assetDnaId)) {
    return protocolError("invalid_id", "Invalid Asset DNA id", 400);
  }

  const listed = listCertifiedLifecycleEvents(
    assetDnaId,
    Number.isFinite(limit) ? limit : 50
  );
  if (!listed.ok) {
    return protocolError(listed.error, "Invalid Asset DNA id", 400);
  }

  return protocolJson({
    ok: true,
    assetDnaId: listed.assetDnaId,
    count: listed.events.length,
    events: listed.events,
    meter: {
      remaining: guard.meter.remaining,
      limit: guard.meter.limit,
      cost: guard.meter.cost,
    },
  });
}

/**
 * POST /api/v1/toll/events — certify a lifecycle event (Bearer).
 * Burns lifecycle_event credits via appendBillableLifecycleEvent.
 */
export async function POST(request: Request) {
  const guard = await tollMeteredGuard(request, "schema", { requireAuth: true });
  if (!guard.ok) return guard.response;

  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;

  const assetDnaId = String(parsed.body.assetDnaId ?? "").trim();
  const kindRaw = String(parsed.body.kind ?? "").trim();
  if (!isValidAssetDnaId(assetDnaId)) {
    return protocolError("invalid_id", "Invalid Asset DNA id", 400);
  }
  if (!isCertifiedEventKind(kindRaw)) {
    return protocolError(
      "invalid_kind",
      `Unsupported kind. Allowed: ${CERTIFIED_EVENT_KINDS.join(", ")}`,
      400
    );
  }
  const kind = kindRaw as CertifiedEventKind;

  const result = await certifyBillableLifecycleEvent({
    subject: guard.subject,
    assetDnaId,
    kind,
    occurredAt:
      typeof parsed.body.occurredAt === "string"
        ? parsed.body.occurredAt
        : undefined,
    actor:
      typeof parsed.body.actor === "string" ? parsed.body.actor : undefined,
    payload:
      parsed.body.payload && typeof parsed.body.payload === "object"
        ? (parsed.body.payload as Record<string, unknown>)
        : undefined,
  });

  if (!result.ok) {
    if (result.error === "quota_exceeded") {
      return protocolError(
        "quota_exceeded",
        `Lifecycle event credits exceeded (${result.limit}/mo). Buy Lifecycle Maintain at /green/toll.`,
        429
      );
    }
    return protocolError(
      result.error,
      result.error === "invalid_id"
        ? "Invalid Asset DNA id"
        : "Unsupported event kind",
      400
    );
  }

  return protocolJson({
    ok: true,
    ...result.certification,
    meter: { remaining: result.meterRemaining, cost: 1 },
  });
}
