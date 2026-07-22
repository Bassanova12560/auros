import {
  isSearchAudience,
  isSearchVisibility,
  listSearchAudit,
  searchWithControlPlane,
  SEARCH_CONTROL_DISCLAIMER,
} from "@/lib/toll/search-control";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollMeteredGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

/**
 * POST /api/v1/toll/search-control
 * Body: { q, audience, visibility?, actorId?, limit? }
 * Bearer required — burns search credits; writes indicative audit log.
 */
export async function POST(request: Request) {
  const guard = await tollMeteredGuard(request, "search", {
    requireAuth: true,
  });
  if (!guard.ok) return guard.response;
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;

  const q = String(parsed.body.q ?? "").trim();
  if (!q) {
    return protocolError("invalid_input", "q required", 400);
  }
  if (!isSearchAudience(parsed.body.audience)) {
    return protocolError(
      "invalid_input",
      "audience must be bank|ai|audit|trading|regulator",
      400
    );
  }
  if (
    parsed.body.visibility !== undefined &&
    !isSearchVisibility(parsed.body.visibility)
  ) {
    return protocolError(
      "invalid_input",
      "visibility must be public|partial|private",
      400
    );
  }

  const actorId =
    typeof parsed.body.actorId === "string" && parsed.body.actorId.trim()
      ? parsed.body.actorId.trim()
      : guard.subject.id;

  const result = await searchWithControlPlane({
    q,
    audience: parsed.body.audience,
    visibility: isSearchVisibility(parsed.body.visibility)
      ? parsed.body.visibility
      : undefined,
    actorId,
    limit: typeof parsed.body.limit === "number" ? parsed.body.limit : 20,
  });

  return protocolJson({
    ok: true,
    ...result,
    meter: {
      remaining: guard.meter.remaining,
      limit: guard.meter.limit,
      cost: guard.meter.cost,
    },
    disclaimer: SEARCH_CONTROL_DISCLAIMER,
  });
}

/**
 * GET /api/v1/toll/search-control?actorId=&limit=
 * — list indicative search audit (Bearer + search credits).
 */
export async function GET(request: Request) {
  const guard = await tollMeteredGuard(request, "search", {
    requireAuth: true,
  });
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const actorId = (url.searchParams.get("actorId") ?? "").trim() || undefined;
  const limitRaw = url.searchParams.get("limit");
  const limit = limitRaw ? Number(limitRaw) : 50;

  const entries = listSearchAudit({
    actorId,
    limit: Number.isFinite(limit) ? limit : 50,
  });

  return protocolJson({
    ok: true,
    entries,
    meter: {
      remaining: guard.meter.remaining,
      limit: guard.meter.limit,
      cost: guard.meter.cost,
    },
    disclaimer: SEARCH_CONTROL_DISCLAIMER,
  });
}
