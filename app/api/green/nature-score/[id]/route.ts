import {
  authenticateGreenPublicRequest,
  greenApiError,
  greenApiJson,
  greenApiOptions,
  lookupNatureScoreById,
} from "@/lib/green/api";
import { GREEN_COMPARE_ROWS } from "@/lib/green/compare-data";

export const revalidate = 3600;

export function OPTIONS() {
  return greenApiOptions();
}

/** AUROS Nature Score (TNFD LEAP-inspired) — free public read. */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const authResult = await authenticateGreenPublicRequest(req);
  if (!authResult.ok) return authResult.response;

  const { id } = await ctx.params;
  const row = GREEN_COMPARE_ROWS.find((r) => r.id === id);
  if (!row) {
    return greenApiError("not_found", `Unknown catalog id: ${id}`, 404, authResult.auth);
  }

  const nature = lookupNatureScoreById(id);
  if (!nature) {
    return greenApiError(
      "not_nature_asset",
      `${id} has no nature/biodiversity profile — try GET /api/green/score/${id}`,
      422,
      authResult.auth
    );
  }

  return greenApiJson(
    {
      ok: true,
      id,
      name: row.name,
      nature_score: nature,
      unified_score_url: `/api/green/score/${id}`,
      docs: "/green/api",
      tier: authResult.auth.tier,
      generated_at: new Date().toISOString(),
    },
    { auth: authResult.auth }
  );
}
