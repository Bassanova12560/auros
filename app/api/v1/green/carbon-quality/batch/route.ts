import {
  authenticateProtocolRequest,
  findKeyRecord,
  protocolError,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";
import { logProtocolUsage } from "@/lib/protocol/usage/log";
import { batchMaxItemsForTier, type GreenApiTier } from "@/lib/green/api/auth";
import { carbonQualityBatchRequestSchema } from "@/lib/green/schemas/carbon-quality-batch";
import { resolveCarbonQualityBatchItem } from "@/lib/green/scoring/carbon-quality-batch";

async function tierForKey(keyHash: string, isDemo: boolean): Promise<GreenApiTier> {
  if (isDemo) return "demo";
  const record = await findKeyRecord(keyHash);
  if (record?.tier === "premium" || record?.tier === "monitor") return "premium";
  if (record?.tier === "enterprise") return "enterprise";
  return "free";
}

export const POST = protocolRoute(async (req: Request) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return protocolError("invalid_json", "Request body must be valid JSON", 400);
  }

  const parsed = carbonQualityBatchRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const tier = await tierForKey(auth.ctx.keyHash, auth.ctx.isDemo);
  const maxItems = batchMaxItemsForTier(tier);
  if (parsed.data.items.length > maxItems) {
    return protocolError(
      "batch_limit",
      `Max ${maxItems} items per batch on tier ${tier}. Premium (batch 50): /green/api`,
      400
    );
  }

  const results = await Promise.all(
    parsed.data.items.map(async (item, index) => {
      const outcome = await resolveCarbonQualityBatchItem(item);
      if (!outcome.ok) {
        return {
          index,
          ok: false as const,
          error: { code: outcome.code, message: outcome.message },
        };
      }
      return {
        index,
        ok: true as const,
        id: item.id ?? null,
        serial: item.serial ?? outcome.registry_serial ?? null,
        carbon_quality: outcome.result,
      };
    })
  );

  const succeeded = results.filter((r) => r.ok).length;

  await logProtocolUsage(
    auth.ctx.keyHash,
    "/api/v1/green/carbon-quality/batch",
    "POST",
    200
  );

  return protocolJson({
    tier,
    batch_limit: maxItems,
    total: results.length,
    succeeded,
    failed: results.length - succeeded,
    items: results,
    meta: {
      version: "1.0" as const,
      computed_at: new Date().toISOString(),
    },
  });
});
