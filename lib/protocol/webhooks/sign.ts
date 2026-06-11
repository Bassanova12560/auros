import { createHmac, timingSafeEqual } from "node:crypto";

const DEV_SECRET = "auros-webhook-dev-secret";

function isProduction(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production"
  );
}

export function webhookSecret(): string {
  const s = process.env.WEBHOOK_SECRET?.trim();
  if (s && (!isProduction() || s !== DEV_SECRET)) return s;
  if (isProduction()) return DEV_SECRET;
  return DEV_SECRET;
}

export function signWebhookPayload(body: string): string {
  return createHmac("sha256", webhookSecret()).update(body).digest("hex");
}

export function webhookSignatureHeader(body: string): string {
  return `sha256=${signWebhookPayload(body)}`;
}

export function verifyWebhookSignature(body: string, signature: string): boolean {
  const expected = `sha256=${signWebhookPayload(body)}`;
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(signature.trim());
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export type WebhookEventPayload = {
  event: string;
  severity: "low" | "medium" | "high";
  impact_on_score: number;
  monitor_id?: string;
  asset_type?: string;
  jurisdiction?: string;
  structure?: string;
  summary: string;
  details?: Record<string, unknown>;
  timestamp: string;
  disclaimer: string;
};

export async function dispatchWebhook(
  url: string,
  payload: WebhookEventPayload
): Promise<{ ok: boolean; status?: number }> {
  const body = JSON.stringify(payload);
  const signature = webhookSignatureHeader(body);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-AUROS-Signature": signature,
        "X-AUROS-Event": payload.event,
        "User-Agent": "AUROS-Protocol-Webhook/1.0",
      },
      body,
      signal: AbortSignal.timeout(15_000),
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false };
  }
}
