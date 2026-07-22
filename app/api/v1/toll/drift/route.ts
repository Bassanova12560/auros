import { getAssetDrift } from "@/lib/toll";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollIpGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

/** POST /api/v1/toll/drift { assetDnaId } */
export async function POST(request: Request) {
  const guard = await tollIpGuard("drift");
  if (!guard.ok) return guard.response;
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;
  const assetDnaId = String(
    parsed.body.assetDnaId ?? parsed.body.id ?? ""
  ).trim();
  if (!assetDnaId) {
    return protocolError("invalid_query", "Missing assetDnaId", 400);
  }
  const result = await getAssetDrift({ assetDnaId });
  if ("error" in result) {
    return protocolError(result.error, result.error, result.error === "not_found" ? 404 : 400);
  }
  return protocolJson({ ok: true, ...result });
}
