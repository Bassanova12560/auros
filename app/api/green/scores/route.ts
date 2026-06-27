import {
  authenticateGreenPublicRequest,
  bulkMaxIdsForTier,
  greenApiError,
  greenApiJson,
  greenApiOptions,
  listGreenScoreCatalogIds,
  lookupGreenScoresByIds,
} from "@/lib/green/api";

export const revalidate = 3600;

export function OPTIONS() {
  return greenApiOptions();
}

/** Bulk Green scores — ?ids=toucan,moss,sunexchange */
export async function GET(req: Request) {
  const authResult = await authenticateGreenPublicRequest(req);
  if (!authResult.ok) return authResult.response;

  const url = new URL(req.url);
  const idsParam = url.searchParams.get("ids")?.trim();
  if (!idsParam) {
    return greenApiJson(
      {
        ok: true,
        catalog_ids: listGreenScoreCatalogIds(),
        hint: "Pass ?ids=toucan,moss,sunexchange",
        tier: authResult.auth.tier,
      },
      { auth: authResult.auth }
    );
  }

  const ids = [...new Set(idsParam.split(",").map((s) => s.trim()).filter(Boolean))];
  const maxIds = bulkMaxIdsForTier(authResult.auth.tier);
  if (ids.length > maxIds) {
    return greenApiError(
      "too_many_ids",
      `Max ${maxIds} ids for tier ${authResult.auth.tier}. Use an API key for higher limits.`,
      400,
      authResult.auth
    );
  }

  const { found, missing } = lookupGreenScoresByIds(ids);

  return greenApiJson(
    {
      ok: true,
      count: found.length,
      missing,
      scores: found,
      tier: authResult.auth.tier,
      generated_at: new Date().toISOString(),
    },
    { auth: authResult.auth }
  );
}
