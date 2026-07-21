import {
  authenticateGreenPublicRequest,
  greenApiJson,
  greenApiOptions,
} from "@/lib/green/api";
import {
  CONNECTOR_SPECS,
  CONNECTORS_DISCLAIMER,
  CONNECTORS_ROUTE,
} from "@/lib/resilience/connectors";

export const revalidate = 3600;

export function OPTIONS() {
  return greenApiOptions();
}

/** GET /api/green/eau/connectors — BIM/ERP export contracts */
export async function GET(req: Request) {
  const authResult = await authenticateGreenPublicRequest(req);
  if (!authResult.ok) return authResult.response;

  return greenApiJson(
    {
      ok: true,
      product: "connectors_export_first",
      disclaimer: CONNECTORS_DISCLAIMER,
      ui: CONNECTORS_ROUTE,
      connectors: CONNECTOR_SPECS,
      generated_at: new Date().toISOString(),
      tier: authResult.auth.tier,
    },
    { auth: authResult.auth }
  );
}
