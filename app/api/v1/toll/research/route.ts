import { researchAurosAsset } from "@/lib/toll";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollRequireBearer,
} from "@/lib/toll/http";

export const runtime = "nodejs";

/** POST /api/v1/toll/research — Bearer required */
export async function POST(request: Request) {
  const auth = await tollRequireBearer(request);
  if (!auth.ok) return auth.response;
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;
  const q = String(parsed.body.q ?? parsed.body.id ?? "").trim();
  if (!q) {
    return protocolError("invalid_query", "Missing q", 400);
  }
  const result = await researchAurosAsset({ q });
  return protocolJson({ ok: true, ...result });
}
