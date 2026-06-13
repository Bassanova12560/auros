import {
  authenticateProtocolRequest,
  checkPremiumAccess,
  protocolError,
  protocolJson,
  protocolRoute,
  regulatoryFeedQuerySchema,
} from "@/lib/protocol";
import { findKeyRecord } from "@/lib/protocol/auth/keys";
import {
  queryRegulatoryFeed,
  REGULATORY_FEED_LAST_UPDATED,
  toPublicFeedItem,
} from "@/lib/protocol/regulatory/feed";
import { logProtocolUsage } from "@/lib/protocol/usage/log";

export const GET = protocolRoute(async (req: Request) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  const url = new URL(req.url);
  const raw = Object.fromEntries(url.searchParams.entries());
  const parsed = regulatoryFeedQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const items = queryRegulatoryFeed(parsed.data);

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/regulatory/feed", "GET", 200);

  return protocolJson({
    last_updated: REGULATORY_FEED_LAST_UPDATED,
    total: items.length,
    query: parsed.data,
    items: items.map(toPublicFeedItem),
    meta: {
      version: "1.0",
      source: "curated",
      note: "v1 curated feed — v2 will add live ESMA/AMF/BaFin polling.",
    },
  });
});
