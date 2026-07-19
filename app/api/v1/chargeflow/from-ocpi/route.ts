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
  chargeflowFromOcpiRequestSchema,
  createChargeflowEBatch,
  mapFromOcpiRequestToCreateItems,
  summarizeChargeflowBatch,
} from "@/lib/chargeflow";

/**
 * Offline OCPI/CSV → CFU-E adapter. Not a live OCPI connection.
 */
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

  const parsed = chargeflowFromOcpiRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const items = mapFromOcpiRequestToCreateItems(parsed.data);
  const results = await createChargeflowEBatch(auth.ctx.keyHash, items);
  const summary = summarizeChargeflowBatch(results);

  await logProtocolUsage(
    auth.ctx.keyHash,
    "/api/v1/chargeflow/from-ocpi",
    "POST",
    200
  );

  return protocolJson({
    source: "ocpi_stub",
    disclaimer:
      "Offline OCPI/CSV stub — not a live OCPI sync. Indicative ChargeFlow registration only.",
    ...summary,
    ...premiumPricingMeta(),
  });
});
