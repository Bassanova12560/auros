import { getAurosMetadataSchema } from "@/lib/toll";
import { protocolJson, tollIpGuard } from "@/lib/toll/http";

export const runtime = "nodejs";

/** GET /api/v1/toll/schema — AUROS Metadata Standard */
export async function GET() {
  const guard = await tollIpGuard("schema", 120);
  if (!guard.ok) return guard.response;
  return protocolJson({
    ok: true,
    schema: getAurosMetadataSchema(),
  });
}
