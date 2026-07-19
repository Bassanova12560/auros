import { isSimulationMode } from "@/lib/simulation/mode";
import { resolveWebhookTarget } from "@/lib/platforms/resolve-platform-pure";
import type { PartnerRecord } from "@/lib/partners/types";

export type PlatformSubmitWebhookPayload = {
  event: "dossier.submitted";
  dossierId: string;
  assetType: string;
  score: number;
  admissionPercent: number;
  platform: string;
  country: string;
  email?: string;
  firstName?: string;
  submittedAt: string;
  partnerPlatformId?: string;
};

/**
 * Notify platform webhook — per-tenant URL if provided, else PARTNER_WEBHOOK_URL.
 */
export async function notifyPlatformSubmitWebhook(
  payload: PlatformSubmitWebhookPayload,
  platformPartner?: PartnerRecord | null
): Promise<{ sent: boolean; reason: string }> {
  const target = resolveWebhookTarget(platformPartner ?? null);

  if (!target.url) {
    return { sent: false, reason: "no webhook URL (tenant or PARTNER_WEBHOOK_URL)" };
  }

  if (isSimulationMode()) {
    console.info(
      "[AUROS simulation] platform webhook",
      target.source,
      JSON.stringify(payload)
    );
    return { sent: false, reason: "simulation mode (logged only)" };
  }

  try {
    const res = await fetch(target.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "AUROS-Webhook/1",
        ...(target.secret ? { "X-Auros-Secret": target.secret } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) {
      return { sent: false, reason: `HTTP ${res.status}` };
    }
    return { sent: true, reason: `ok (${target.source})` };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[notifyPlatformSubmitWebhook]", msg);
    return { sent: false, reason: msg };
  }
}
