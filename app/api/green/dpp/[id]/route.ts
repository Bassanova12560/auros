import {
  authenticateGreenPublicRequest,
  greenApiError,
  greenApiOptions,
} from "@/lib/green/api";
import { buildDppBridgeDocument } from "@/lib/green/dpp-bridge";

export const revalidate = 3600;

export function OPTIONS() {
  return greenApiOptions();
}

/** DPP Bridge v0 — JSON-LD sustainability passport from Green scores (free read). */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const authResult = await authenticateGreenPublicRequest(req);
  if (!authResult.ok) return authResult.response;

  const { id } = await ctx.params;
  const doc = buildDppBridgeDocument(id);
  if (!doc) {
    return greenApiError("not_found", `Unknown catalog id: ${id}`, 404, authResult.auth);
  }

  const url = new URL(req.url);
  if (url.searchParams.get("format") === "jsonld") {
    return new Response(JSON.stringify(doc, null, 2), {
      headers: {
        "Content-Type": "application/ld+json; charset=utf-8",
        "X-AUROS-Tier": authResult.auth.tier,
      },
    });
  }

  return Response.json({
    ok: true,
    dpp: doc,
    tier: authResult.auth.tier,
    docs: "/green/api",
    generated_at: new Date().toISOString(),
  });
}
