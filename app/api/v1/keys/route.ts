import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import {
  createApiKey,
  createKeyRequestSchema,
  protocolError,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";
import { findKeyByEmail } from "@/lib/protocol/auth/keys";
import { FREE_TIER_MONTHLY_LIMIT } from "@/lib/protocol/constants";
import { setRateLimitContext } from "@/lib/protocol/rate-limit-context";
import { sendGreenApiKeyWelcome } from "@/lib/emails/send";

const KEYS_IP_LIMIT = 5;
const KEYS_IP_WINDOW_MS = 3_600_000;

export const POST = protocolRoute(async (req: Request) => {
  const ip = getRequestIp(req);
  const rate = checkRateLimit(`protocol-keys:${ip}`, KEYS_IP_LIMIT, KEYS_IP_WINDOW_MS);
  setRateLimitContext({
    limit: KEYS_IP_LIMIT,
    remaining: rate.remaining,
    reset: rate.reset,
  });
  if (!rate.allowed) {
    return protocolError("rate_limit", "Too many key requests from this IP", 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return protocolError("invalid_json", "Request body must be valid JSON", 400);
  }

  const parsed = createKeyRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const existing = await findKeyByEmail(email);
  if (existing) {
    return protocolJson({
      ok: true,
      already_exists: true,
      tier: existing.tier,
      monthly_limit: FREE_TIER_MONTHLY_LIMIT,
      upgrade_url: "/green/api",
      message:
        "An API key already exists for this email (not shown again). Upgrade to Premium at /green/api or use your existing key.",
    });
  }

  const { apiKey, tier, monthlyLimit } = await createApiKey(email);

  void sendGreenApiKeyWelcome(email, { monthlyLimit });

  return protocolJson({
    ok: true,
    api_key: apiKey,
    tier,
    monthly_limit: monthlyLimit,
    upgrade_url: "/green/api",
    message:
      "Store this key securely — it will not be shown again. Free tier: 1000 Green + Protocol requests/month.",
  });
});
