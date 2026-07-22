import {
  createTollException,
  isTollExceptionStatus,
  listTollExceptions,
  parseCreateExceptionInput,
} from "@/lib/toll/exceptions";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollIpGuard,
  tollMeteredGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

/** GET /api/v1/toll/exceptions?status=&limit= — ops queue (rate-limited) */
export async function GET(request: Request) {
  const guard = await tollIpGuard("exceptions-get", 40);
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const statusRaw = url.searchParams.get("status");
  const status =
    statusRaw && isTollExceptionStatus(statusRaw) ? statusRaw : undefined;
  const limitRaw = Number(url.searchParams.get("limit") ?? "50");
  const limit = Number.isFinite(limitRaw) ? limitRaw : 50;

  const rows = listTollExceptions({ status, limit }).map((r) => ({
    id: r.id,
    kind: r.kind,
    severity: r.severity,
    status: r.status,
    title: r.title,
    summary: r.summary,
    assetDnaId: r.assetDnaId,
    assignee: r.assignee,
    dueAt: r.dueAt,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    resolvedAt: r.resolvedAt,
    evidenceCount: r.evidence.length,
  }));

  return protocolJson({
    ok: true,
    exceptions: rows,
    disclaimer:
      "HITL queue only — AUROS does not auto-resolve or certify compliance.",
  });
}

/** POST /api/v1/toll/exceptions — create case (Bearer + light metering) */
export async function POST(request: Request) {
  const meter = await tollMeteredGuard(request, "trail", { requireAuth: true });
  if (!meter.ok) return meter.response;

  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;

  const input = parseCreateExceptionInput(parsed.body);
  if (!input.ok) {
    return protocolError(input.error, input.error, 400);
  }

  const row = createTollException(input.data);
  return protocolJson({
    ok: true,
    exception: row,
    message: "Exception opened — ops HITL owns escalate / assign / resolve.",
    meter: {
      remaining: meter.meter.remaining,
      limit: meter.meter.limit,
      cost: meter.meter.cost,
    },
  });
}
