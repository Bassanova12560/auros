import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import { assistWetsScore } from "@/lib/wets/assist";
import { WETS_CATEGORIES } from "@/lib/wets/constants";
import { listWetsRiskEvents } from "@/lib/wets/store";

export const runtime = "nodejs";

const bodySchema = z.object({
  name: z.string().min(2).max(200),
  ticker: z.string().max(32).optional(),
  category: z.enum(WETS_CATEGORIES),
  website_url: z.string().url().optional().or(z.literal("")),
  description: z.string().min(10).max(8000),
  legal_structure: z.string().max(500).optional(),
  jurisdiction: z.string().max(128).optional(),
});

/**
 * POST /api/score-project — assisted WETS scoring (auth required).
 * Anthropic → Groq → WELHR heuristic.
 */
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json(
      { ok: false, error: { code: "unauthorized", message: "Sign in required" } },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { ok: false, error: { code: "invalid_json", message: "JSON body required" } },
      { status: 400 }
    );
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        ok: false,
        error: {
          code: "validation_error",
          message: parsed.error.issues.map((i) => i.message).join("; "),
        },
      },
      { status: 400 }
    );
  }

  const events = await listWetsRiskEvents({
    region: parsed.data.jurisdiction,
  });
  const riskCtx = events.events
    .slice(0, 8)
    .map(
      (e) =>
        `- [${e.severity}] ${e.region} ${e.event_type}: ${e.description ?? ""}`
    )
    .join("\n");

  const assisted = await assistWetsScore({
    ...parsed.data,
    website_url: parsed.data.website_url || null,
    risk_events_context: riskCtx || undefined,
  });

  return Response.json({
    ok: true,
    provider: assisted.provider,
    criteria: assisted.criteria,
    disclaimer:
      "Indicative assisted draft — human validation required before publish.",
  });
}
