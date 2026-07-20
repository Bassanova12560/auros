import { z } from "zod";

import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { runCopilotChat } from "@/lib/copilot/chat";
import { COPILOT_DISCLAIMER } from "@/lib/copilot/types";

export const runtime = "nodejs";

const contextSchema = z
  .object({
    surface: z.enum([
      "compare",
      "jurisdiction",
      "chargeflow",
      "green",
      "rtms",
      "generic",
    ]),
    product_ids: z.array(z.string().trim().min(1)).max(4).optional(),
    jurisdiction_id: z.string().trim().min(1).max(64).optional(),
    rtms_brief: z.string().trim().max(1500).optional(),
  })
  .optional();

const bodySchema = z.object({
  message: z.string().min(1).max(2000),
  locale: z.enum(["fr", "en", "es", "ar", "zh"]).optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4000),
      })
    )
    .max(8)
    .optional(),
  context: contextSchema,
});

/**
 * Public AUROS Copilot chat — read-only tools (RAG, products, compare, ChargeFlow explain).
 * Never mutates scores / attest / CFU. Optional page context seeds tools.
 */
export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const { allowed } = checkRateLimit(`copilot:${ip}`, 20, 3_600_000);
  if (!allowed) {
    return Response.json(
      {
        error: {
          code: "rate_limited",
          message: "Too many Copilot requests. Try again later.",
        },
      },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json(
      { error: { code: "invalid_json", message: "Body must be JSON" } },
      { status: 400 }
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      {
        error: {
          code: "validation_error",
          message: parsed.error.issues.map((i) => i.message).join("; "),
        },
      },
      { status: 400 }
    );
  }

  const result = await runCopilotChat(parsed.data);
  return Response.json({
    ...result,
    disclaimer: result.disclaimer || COPILOT_DISCLAIMER,
  });
}
