import { buildAurosAuditExport } from "@/lib/toll/audit-export";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollMeteredGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

/** POST /api/v1/toll/audit-export { assetDnaId } — costs research credits */
export async function POST(request: Request) {
  const guard = await tollMeteredGuard(request, "research", {
    requireAuth: true,
  });
  if (!guard.ok) return guard.response;
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;
  const assetDnaId = String(
    parsed.body.assetDnaId ?? parsed.body.id ?? ""
  ).trim();
  const result = await buildAurosAuditExport({ assetDnaId });
  if (!result.ok) {
    return protocolError(
      result.error,
      result.error,
      result.error === "not_found" ? 404 : 400
    );
  }
  return protocolJson({
    ok: true,
    pack: result.pack,
    meter: {
      remaining: guard.meter.remaining,
      limit: guard.meter.limit,
      cost: guard.meter.cost,
    },
  });
}
