import { z } from "zod";

import {
  authenticateGreenPublicRequest,
  greenApiError,
  greenApiJson,
  greenApiOptions,
} from "@/lib/green/api";
import { simulateSustainableRoi } from "@/lib/resilience/roi-simulator";

export const revalidate = 0;

const bodySchema = z.object({
  mw_it: z.number().min(1).max(500),
  stress: z.enum(["extreme", "high", "medium", "low", "unknown"]).optional(),
  water_eur_per_m3: z.number().min(0.5).max(8).optional(),
  target_closed_loop: z.boolean().optional(),
});

export function OPTIONS() {
  return greenApiOptions();
}

/**
 * Indicative sustainable ROI / water savings for data-center cooling scenarios.
 * POST /api/green/eau/roi
 */
export async function POST(req: Request) {
  const authResult = await authenticateGreenPublicRequest(req);
  if (!authResult.ok) return authResult.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return greenApiError("invalid_json", "Request body must be JSON", 400, authResult.auth);
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return greenApiError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400,
      authResult.auth
    );
  }

  const roi = simulateSustainableRoi({
    mw_it: parsed.data.mw_it,
    stress: parsed.data.stress ?? "medium",
    water_eur_per_m3: parsed.data.water_eur_per_m3 ?? 2.4,
    target_closed_loop: parsed.data.target_closed_loop ?? true,
  });

  return greenApiJson(
    {
      ok: true,
      roi,
      product: "sustainable_roi_simulator",
      ui: {
        demo: "/demos/data-center-100mw",
        resilience: "/resilience",
      },
      generated_at: new Date().toISOString(),
      tier: authResult.auth.tier,
    },
    { auth: authResult.auth }
  );
}
