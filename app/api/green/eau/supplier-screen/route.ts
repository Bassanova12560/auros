import { z } from "zod";

import {
  authenticateGreenPublicRequest,
  greenApiError,
  greenApiJson,
  greenApiOptions,
} from "@/lib/green/api";
import { computeSupplierEsgScreen } from "@/lib/eau/supplier-esg-screen";

export const revalidate = 0;

const bodySchema = z.object({
  supplier_name: z.string().max(160).optional(),
  claim_text: z.string().min(20).max(8000),
  evidence_urls: z.array(z.string().url().max(500)).max(8).optional(),
  region: z.string().max(128).optional(),
});

export function OPTIONS() {
  return greenApiOptions();
}

/** POST /api/green/eau/supplier-screen — indicative ESG claim hygiene */
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

  const screen = computeSupplierEsgScreen(parsed.data);

  return greenApiJson(
    {
      ok: true,
      screen,
      product: "supplier_esg_screen",
      ui: { welcome: "/eau/suppliers", tool: "/eau/suppliers/screen" },
      generated_at: new Date().toISOString(),
      tier: authResult.auth.tier,
    },
    { auth: authResult.auth }
  );
}
