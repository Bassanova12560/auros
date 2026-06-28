import {
  greenApiError,
  greenApiJson,
  greenApiOptions,
  requireGreenPremiumApiKey,
} from "@/lib/green/api";
import { buildGreenScoreHistoryPayload } from "@/lib/green/scoring/green-score-history";

export const revalidate = 3600;

export function OPTIONS() {
  return greenApiOptions();
}

/** Premium — indicative monthly Green score history for a catalog id. */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const authResult = await requireGreenPremiumApiKey(req);
  if (!authResult.ok) return authResult.response;

  const { id } = await ctx.params;
  const payload = buildGreenScoreHistoryPayload(id);
  if (!payload) {
    return greenApiError("not_found", `Unknown catalog id: ${id}`, 404, authResult.auth);
  }

  return greenApiJson(
    {
      ok: true,
      history: payload,
      tier: authResult.auth.tier,
      generated_at: new Date().toISOString(),
    },
    { auth: authResult.auth }
  );
}
