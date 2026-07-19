import {
  authenticateProtocolRequest,
  checkPremiumAccess,
  findKeyRecord,
  logProtocolUsage,
  premiumPricingMeta,
  protocolError,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";
import {
  chargeflowFBatchRequestSchema,
  createChargeflowFBatch,
  summarizeChargeflowBatch,
} from "@/lib/chargeflow";

export const POST = protocolRoute(async (req: Request) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return protocolError("invalid_json", "Request body must be valid JSON", 400);
  }

  const parsed = chargeflowFBatchRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const items = await createChargeflowFBatch(
    auth.ctx.keyHash,
    parsed.data.items
  );
  const summary = summarizeChargeflowBatch(items);

  await logProtocolUsage(
    auth.ctx.keyHash,
    "/api/v1/chargeflow/f/batch",
    "POST",
    200
  );

  return protocolJson({
    ...summary,
    ...premiumPricingMeta(),
  });
});
