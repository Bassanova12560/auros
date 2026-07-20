import { SITE_URL } from "@/lib/comparators/site";
import { protocolError, protocolJson, protocolRoute } from "@/lib/protocol";
import { createCloudTapReceipt } from "@/lib/shield";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Zero-friction sandbox — no API key.
 * Paste any text → proof receipt. Rate-limited per IP.
 */
export const POST = protocolRoute(async (req: Request) => {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(`shield-demo:${ip}`, 20, 3_600_000);
  if (!rate.allowed) {
    return protocolError(
      "rate_limited",
      "Demo limit reached (20/h). Create a free key for 100 taps/mo — getauros.com/developers",
      429
    );
  }

  const raw = await req.text();
  if (!raw?.trim()) {
    return protocolError(
      "validation_error",
      "Send any non-empty body (text, JSON, CSV…). No schema required.",
      400
    );
  }
  if (raw.length > 200_000) {
    return protocolError(
      "payload_too_large",
      "Demo max 200KB. Production ingest allows more with an API key.",
      413
    );
  }

  const result = createCloudTapReceipt(
    {
      body: raw,
      kind: "tap",
      label: "demo",
      plan: "free",
      tenant_ref: `demo:${ip.slice(0, 24)}`,
    },
    SITE_URL
  );

  if (!result.ok) {
    return protocolError(
      result.status === 503 ? "service_unavailable" : "validation_error",
      result.error,
      result.status
    );
  }

  return protocolJson({
    ok: true,
    demo: true,
    how_easy:
      "You just POSTed raw bytes. Production: same URL pattern with Bearer key → /api/v1/shield/ingest",
    ...result.receipt,
    useful_next: {
      verify: `POST ${SITE_URL}/api/v1/shield/verify { "id": "${result.receipt.id}" }`,
      pack: "POST /api/v1/shield/pack (Premium) — CFU + taps for your bank file",
      product: `${SITE_URL}/developers/shield`,
    },
  });
});
