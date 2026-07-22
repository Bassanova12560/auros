import { searchAurosAssets } from "@/lib/toll";
import {
  parseJsonBody,
  protocolJson,
  tollIpGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

/** POST /api/v1/toll/search { q, limit? } */
export async function POST(request: Request) {
  const guard = await tollIpGuard("search");
  if (!guard.ok) return guard.response;
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;
  const result = await searchAurosAssets({
    q: String(parsed.body.q ?? ""),
    limit: typeof parsed.body.limit === "number" ? parsed.body.limit : 20,
  });
  return protocolJson({ ok: true, ...result });
}
