import { z } from "zod";

import {
  authenticateGreenPublicRequest,
  greenApiError,
  greenApiJson,
  greenApiOptions,
} from "@/lib/green/api";
import { computeWelhrFromText } from "@/lib/eau/water-legal-risk";
import { buildResilienceBrief } from "@/lib/resilience/resilience-brief";

export const revalidate = 0;

const bodySchema = z.object({
  text: z.string().min(20).max(8000),
  region: z.string().max(128).optional(),
  asset_hint: z
    .enum(["data_center", "water_rights", "energy", "cooling", "other"])
    .optional(),
});

export function OPTIONS() {
  return greenApiOptions();
}

/**
 * Composite resilience brief (WELHR → score + max 3 priorities).
 * POST /api/green/eau/resilience-brief
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

  const welhr = computeWelhrFromText(parsed.data);
  const brief = buildResilienceBrief(welhr);

  return greenApiJson(
    {
      ok: true,
      welhr,
      brief,
      product: "resilience_brief",
      ui: {
        compass: "/compass/dashboard?mode=water",
        resilience: "/resilience",
      },
      generated_at: new Date().toISOString(),
      tier: authResult.auth.tier,
    },
    { auth: authResult.auth }
  );
}
