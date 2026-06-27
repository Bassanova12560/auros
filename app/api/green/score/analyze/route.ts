import { z } from "zod";

import {
  authenticateGreenPublicRequest,
  greenApiError,
  greenApiJson,
  greenApiOptions,
} from "@/lib/green/api";
import { computeCarbonQualityFromProfile, inferCarbonProfileFromText } from "@/lib/green/scoring/carbon-quality";

export const revalidate = 0;

const bodySchema = z.object({
  text: z.string().min(10).max(8000),
});

export function OPTIONS() {
  return greenApiOptions();
}

/** Score carbon credit quality from free text — viral due diligence endpoint. */
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

  const profile = inferCarbonProfileFromText(parsed.data.text);
  const carbon_quality = computeCarbonQualityFromProfile(profile);

  return greenApiJson(
    {
      ok: true,
      carbon_quality,
      tier: authResult.auth.tier,
      generated_at: new Date().toISOString(),
    },
    { auth: authResult.auth }
  );
}
