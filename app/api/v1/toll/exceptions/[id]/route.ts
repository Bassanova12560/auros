import {
  getTollException,
  parseResolveExceptionInput,
  parseUpdateExceptionInput,
  resolveTollException,
  updateTollException,
} from "@/lib/toll/exceptions";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollIpGuard,
  tollMeteredGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/** GET /api/v1/toll/exceptions/[id] — single case + evidence trail */
export async function GET(_request: Request, ctx: Ctx) {
  const guard = await tollIpGuard("exceptions-get-one", 40);
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;
  const row = getTollException(id);
  if (!row) {
    return protocolError("not_found", "Exception not found", 404);
  }
  return protocolJson({
    ok: true,
    exception: row,
    disclaimer:
      "HITL evidence trail — AUROS does not auto-resolve or certify compliance.",
  });
}

/**
 * PATCH /api/v1/toll/exceptions/[id]
 * Body: update fields, or { action: "resolve", resolutionNote } for HITL resolve.
 */
export async function PATCH(request: Request, ctx: Ctx) {
  const meter = await tollMeteredGuard(request, "trail", { requireAuth: true });
  if (!meter.ok) return meter.response;

  const { id } = await ctx.params;
  if (!id?.startsWith("exc_")) {
    return protocolError("invalid_id", "Invalid exception id", 400);
  }

  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;

  const action =
    typeof parsed.body.action === "string"
      ? parsed.body.action.trim().toLowerCase()
      : undefined;

  if (action === "resolve") {
    const input = parseResolveExceptionInput(parsed.body);
    if (!input.ok) {
      return protocolError(input.error, input.error, 400);
    }
    const row = resolveTollException(id, input.data);
    if (!row) {
      const existing = getTollException(id);
      return protocolError(
        existing ? "not_updatable" : "not_found",
        existing ? "Exception closed or not updatable" : "Exception not found",
        existing ? 409 : 404
      );
    }
    return protocolJson({
      ok: true,
      exception: row,
      message:
        "Resolved with evidence note — no compliance claim; integrator decides.",
      meter: {
        remaining: meter.meter.remaining,
        limit: meter.meter.limit,
        cost: meter.meter.cost,
      },
    });
  }

  const input = parseUpdateExceptionInput(parsed.body);
  if (!input.ok) {
    return protocolError(input.error, input.error, 400);
  }

  const row = updateTollException(id, input.data);
  if (!row) {
    const existing = getTollException(id);
    return protocolError(
      existing ? "not_updatable" : "not_found",
      existing ? "Exception closed or not updatable" : "Exception not found",
      existing ? 409 : 404
    );
  }

  return protocolJson({
    ok: true,
    exception: row,
    meter: {
      remaining: meter.meter.remaining,
      limit: meter.meter.limit,
      cost: meter.meter.cost,
    },
  });
}
