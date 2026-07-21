import {
  authenticateGreenPublicRequest,
  greenApiJson,
  greenApiOptions,
} from "@/lib/green/api";
import {
  RESOURCE_SIGNALS,
  RESOURCE_SIGNALS_AS_OF,
  RESOURCE_SIGNALS_DISCLAIMER,
  RESOURCE_SIGNALS_ROUTE,
} from "@/lib/resilience/resource-signals";

export const revalidate = 3600;

export function OPTIONS() {
  return greenApiOptions();
}

/** GET /api/green/eau/resource-signals — indicative spot / minerals bands */
export async function GET(req: Request) {
  const authResult = await authenticateGreenPublicRequest(req);
  if (!authResult.ok) return authResult.response;

  return greenApiJson(
    {
      ok: true,
      product: "resource_signals_snapshot",
      as_of: RESOURCE_SIGNALS_AS_OF,
      signals: RESOURCE_SIGNALS,
      disclaimer: RESOURCE_SIGNALS_DISCLAIMER,
      ui: RESOURCE_SIGNALS_ROUTE,
      note: "Not a live feed — curated bands for stress-test narrative.",
      generated_at: new Date().toISOString(),
      tier: authResult.auth.tier,
    },
    { auth: authResult.auth }
  );
}
