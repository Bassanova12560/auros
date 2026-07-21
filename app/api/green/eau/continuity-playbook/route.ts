import { z } from "zod";

import {
  authenticateGreenPublicRequest,
  greenApiError,
  greenApiJson,
  greenApiOptions,
} from "@/lib/green/api";
import { computeWelhrFromText } from "@/lib/eau/water-legal-risk";
import {
  buildContinuityPlaybook,
  continuityPlaybookMarkdown,
  type ContinuityCoolingProfile,
} from "@/lib/wets/continuity-playbook";

export const revalidate = 0;

const bodySchema = z.object({
  text: z.string().min(20).max(8000),
  region: z.string().max(128).optional(),
  project_label: z.string().max(160).optional(),
  mw_it: z.number().min(1).max(500).optional(),
  cooling: z.enum(["tower", "closed_loop", "hybrid"]).optional(),
  include_markdown: z.boolean().optional(),
});

export function OPTIONS() {
  return greenApiOptions();
}

/**
 * Continuity playbook from WELHR signals — indicative, no auto-execution.
 * POST /api/green/eau/continuity-playbook
 */
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

  const {
    text,
    region,
    project_label,
    mw_it,
    cooling,
    include_markdown,
  } = parsed.data;

  const welhr = computeWelhrFromText({
    text,
    region,
    asset_hint: "data_center",
  });

  const playbook = buildContinuityPlaybook({
    project_label: project_label?.trim() || "Projet",
    region: region?.trim() || "—",
    mw_it: mw_it ?? 100,
    cooling: (cooling ?? "tower") as ContinuityCoolingProfile,
    welhr,
  });

  return greenApiJson(
    {
      ok: true,
      welhr,
      playbook,
      markdown: include_markdown ? continuityPlaybookMarkdown(playbook) : undefined,
      product: "continuity_playbook",
      ui: {
        welcome: "/eau/continuity",
        tool: "/eau/continuity/playbook",
        pdf: "/api/resilience/continuity-playbook/pdf",
      },
      generated_at: new Date().toISOString(),
      tier: authResult.auth.tier,
    },
    { auth: authResult.auth }
  );
}
