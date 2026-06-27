import {
  authenticateGreenPublicRequest,
  buildGreenIndexChangelog,
  greenApiJson,
  greenApiOptions,
} from "@/lib/green/api";

export const revalidate = 3600;

export function OPTIONS() {
  return greenApiOptions();
}

/** Monthly Green Index movers — press & integrators. */
export async function GET(req: Request) {
  const authResult = await authenticateGreenPublicRequest(req);
  if (!authResult.ok) return authResult.response;

  return greenApiJson(
    {
      ok: true,
      changelog: buildGreenIndexChangelog(),
      tier: authResult.auth.tier,
    },
    { auth: authResult.auth }
  );
}
