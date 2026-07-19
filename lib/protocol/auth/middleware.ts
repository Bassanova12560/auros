import { checkIpBurstLimit, checkProtocolRateLimit } from "./rate-limit";
import { validateApiKey } from "./keys";
import { protocolError } from "../response";
import { setRateLimitContext } from "../rate-limit-context";

export type AuthContext = {
  keyHash: string;
  isDemo: boolean;
  email?: string;
};

function applyRateLimitHeaders(rate: {
  limit: number;
  remaining: number;
  reset: number;
}): void {
  setRateLimitContext({
    limit: rate.limit,
    remaining: rate.remaining,
    reset: rate.reset,
  });
}

export async function authenticateProtocolRequest(
  req: Request
): Promise<{ ok: true; ctx: AuthContext } | { ok: false; response: ReturnType<typeof protocolError> }> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const burst = await checkIpBurstLimit(ip);
  if (!burst.allowed) {
    applyRateLimitHeaders(burst);
    return {
      ok: false,
      response: protocolError("rate_limit", "Too many requests. Slow down.", 429),
    };
  }

  const auth = req.headers.get("authorization")?.trim();
  if (!auth?.startsWith("Bearer ")) {
    return {
      ok: false,
      response: protocolError(
        "unauthorized",
        "Missing Authorization: Bearer <api_key>",
        401
      ),
    };
  }

  const rawKey = auth.slice(7).trim();
  const validation = await validateApiKey(rawKey);
  if (!validation.valid || !validation.keyHash) {
    return {
      ok: false,
      response: protocolError("unauthorized", "Invalid API key", 401),
    };
  }

  const rate = await checkProtocolRateLimit(validation.keyHash, validation.isDemo);
  applyRateLimitHeaders(rate);
  if (!rate.allowed) {
    return {
      ok: false,
      response: protocolError(
        "quota_exceeded",
        `Monthly quota exceeded (${rate.limit} requests/month on free tier)`,
        429
      ),
    };
  }

  return {
    ok: true,
    ctx: {
      keyHash: validation.keyHash,
      isDemo: validation.isDemo,
      email: validation.email,
    },
  };
}
