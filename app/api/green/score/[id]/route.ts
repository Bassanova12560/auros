import {
  authenticateGreenPublicRequest,
  greenApiError,
  greenApiJson,
  greenApiOptions,
  lookupGreenScoreById,
} from "@/lib/green/api";

export const revalidate = 3600;

export function OPTIONS() {
  return greenApiOptions();
}

/** Unified AUROS Green score — CQS + Watt + composite + index rank. Free (100/day anon). */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const authResult = await authenticateGreenPublicRequest(req);
  if (!authResult.ok) return authResult.response;

  const { id } = await ctx.params;
  const score = lookupGreenScoreById(id);
  if (!score) {
    return greenApiError("not_found", `Unknown catalog id: ${id}`, 404, authResult.auth);
  }

  return greenApiJson(
    {
      ok: true,
      score,
      tier: authResult.auth.tier,
      upgrade: {
        free_api_key: "POST /api/v1/keys",
        docs: "/green/api",
        batch: "/api/v1/green/carbon-quality/batch",
      },
      generated_at: new Date().toISOString(),
    },
    { auth: authResult.auth }
  );
}
