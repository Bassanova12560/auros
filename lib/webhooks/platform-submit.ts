import { isSimulationMode } from "@/lib/simulation/mode";

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
};

/**
 * Optional partner webhook (Make/Zapier/custom). In simulation mode, logs only.
 */
export async function notifyPlatformSubmitWebhook(
  payload: PlatformSubmitWebhookPayload
): Promise<{ sent: boolean; reason: string }> {
  const url = process.env.PARTNER_WEBHOOK_URL?.trim();

  if (!url) {
    return { sent: false, reason: "PARTNER_WEBHOOK_URL not set" };
  }

  if (isSimulationMode()) {
    console.info("[AUROS simulation] platform webhook", JSON.stringify(payload));
    return { sent: false, reason: "simulation mode (logged only)" };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "AUROS-Webhook/1",
        ...(process.env.PARTNER_WEBHOOK_SECRET
          ? { "X-Auros-Secret": process.env.PARTNER_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) {
      return { sent: false, reason: `HTTP ${res.status}` };
    }
    return { sent: true, reason: "ok" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[notifyPlatformSubmitWebhook]", msg);
    return { sent: false, reason: msg };
  }
}
