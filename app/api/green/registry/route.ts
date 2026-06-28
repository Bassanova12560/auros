import {
  authenticateGreenPublicRequest,
  greenApiError,
  greenApiJson,
  greenApiOptions,
} from "@/lib/green/api";
import { lookupRegistryConnect } from "@/lib/green/registry-connect";

export const revalidate = 3600;

export function OPTIONS() {
  return greenApiOptions();
}

/** Registry Connect v1 — Verra / Gold Standard / Puro serial → CQS + Nature Score. */
export async function GET(req: Request) {
  const authResult = await authenticateGreenPublicRequest(req);
  if (!authResult.ok) return authResult.response;

  const url = new URL(req.url);
  const serial = url.searchParams.get("serial") ?? undefined;
  const registry = url.searchParams.get("registry") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;

  if (!serial && !q) {
    return greenApiError(
      "validation_error",
      "Query param required: serial, registry+serial, or q (e.g. ?serial=VCS-674)",
      400,
      authResult.auth
    );
  }

  const outcome = await lookupRegistryConnect({ serial, registry, q });
  if (!outcome.ok) {
    return greenApiError(outcome.code, outcome.message, 422, authResult.auth);
  }

  return greenApiJson(
    {
      ok: true,
      registry_connect: outcome.data,
      tier: authResult.auth.tier,
      docs: "/green/registry-connect",
      generated_at: new Date().toISOString(),
    },
    { auth: authResult.auth }
  );
}
