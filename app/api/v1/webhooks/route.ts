import {
  authenticateProtocolRequest,
  checkPremiumAccess,
  protocolError,
  protocolJson,
  webhookRegisterSchema,
} from "@/lib/protocol";
import { findKeyRecord } from "@/lib/protocol/auth/keys";
import { registerWebhook, listWebhooksForKey } from "@/lib/protocol/webhooks/store";
import { logProtocolUsage } from "@/lib/protocol/usage/log";

export async function POST(req: Request) {
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

  const parsed = webhookRegisterSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const existing = await listWebhooksForKey(auth.ctx.keyHash);
  if (existing.filter((w) => w.active).length >= 10) {
    return protocolError(
      "quota_exceeded",
      "Maximum 10 webhooks actifs par clé API",
      429
    );
  }

  const webhook = await registerWebhook(auth.ctx.keyHash, parsed.data);

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/webhooks", "POST", 201);

  return protocolJson(
    {
      id: webhook.id,
      url: webhook.url,
      events: webhook.events,
      active: webhook.active,
      created_at: webhook.created_at,
      signature_header: "X-AUROS-Signature",
      signature_algorithm: "HMAC-SHA256",
    },
    { status: 201 }
  );
}

export async function GET(req: Request) {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  const webhooks = await listWebhooksForKey(auth.ctx.keyHash);

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/webhooks", "GET", 200);

  return protocolJson({
    webhooks: webhooks
      .filter((w) => w.active)
      .map((w) => ({
        id: w.id,
        url: w.url,
        events: w.events,
        active: w.active,
        created_at: w.created_at,
      })),
    total: webhooks.filter((w) => w.active).length,
  });
}
