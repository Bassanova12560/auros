import {
  authenticateProtocolRequest,
  checkPremiumAccess,
  countActiveRegulatorySubscriptions,
  createRegulatorySubscription,
  premiumPricingMeta,
  protocolError,
  protocolJson,
  protocolRoute,
  regulatorySubscribeSchema,
} from "@/lib/protocol";
import { findKeyRecord } from "@/lib/protocol/auth/keys";
import { logProtocolUsage } from "@/lib/protocol/usage/log";
import { KEY_PREFIX_LIVE } from "@/lib/protocol/constants";

const SUBSCRIPTION_LIMIT_LIVE = 10;
const SUBSCRIPTION_LIMIT_TEST = 3;

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

  const parsed = regulatorySubscribeSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const activeCount = await countActiveRegulatorySubscriptions(auth.ctx.keyHash);
  const limit = rawKey.startsWith(KEY_PREFIX_LIVE)
    ? SUBSCRIPTION_LIMIT_LIVE
    : SUBSCRIPTION_LIMIT_TEST;
  if (activeCount >= limit) {
    return protocolError(
      "quota_exceeded",
      `Limite d'abonnements feed réglementaire atteinte (${limit} actifs).`,
      429
    );
  }

  const subscription = await createRegulatorySubscription(
    auth.ctx.keyHash,
    parsed.data,
    auth.ctx.email
  );

  await logProtocolUsage(
    auth.ctx.keyHash,
    "/api/v1/regulatory/subscribe",
    "POST",
    201
  );

  return protocolJson(
    {
      id: subscription.id,
      jurisdictions: subscription.jurisdictions,
      tags: subscription.tags,
      webhook_url: subscription.webhook_url,
      email: subscription.email,
      status: "active",
      created_at: subscription.created_at,
      events: ["regulatory.update"],
      ...premiumPricingMeta(),
    },
    { status: 201 }
  );
});
