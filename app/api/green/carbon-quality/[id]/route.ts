import {
  authenticateGreenPublicRequest,
  greenApiError,
  greenApiJson,
  greenApiOptions,
  lookupGreenScoreById,
} from "@/lib/green/api";
import { GREEN_COMPARE_ROWS } from "@/lib/green/compare-data";
import { computeCarbonQualityForCompareRow } from "@/lib/green/scoring/carbon-quality";

export const revalidate = 3600;

export function OPTIONS() {
  return greenApiOptions();
}

/** Free public read — Carbon Quality Score for a catalog reference id. */
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

  const result = computeCarbonQualityForCompareRow(row);
  if (!result) {
    return greenApiError(
      "not_carbon_asset",
      `${id} is not a carbon asset — try GET /api/green/score/${id}`,
      422,
      authResult.auth
    );
  }

  const unified = lookupGreenScoreById(id);

  return greenApiJson(
    {
      ok: true,
      id,
      name: row.name,
      carbon_quality: result,
      unified_score_url: `/api/green/score/${id}`,
      watt: unified?.watt ?? null,
      batch_api: "/api/v1/green/carbon-quality/batch",
      companion_api: `/api/green/watt/${id}`,
      docs: "/green/api",
      tier: authResult.auth.tier,
      generated_at: new Date().toISOString(),
    },
    { auth: authResult.auth }
  );
}
