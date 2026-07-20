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
import { listReceiptsForExport } from "@/lib/shield";

export const runtime = "nodejs";

/** Premium — export recent cloud-anchored receipts (hash only). */
export const GET = protocolRoute(async (req: Request) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 100), 1000);
  const items = listReceiptsForExport(limit);

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/shield/export", "GET", 200);

  return protocolJson({
    count: items.length,
    items,
    ...premiumPricingMeta(),
  });
});
