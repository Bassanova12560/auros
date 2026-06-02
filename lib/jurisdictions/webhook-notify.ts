export type JurisdictionWebhookEvent =
  | "jurisdiction.lead.guide"
  | "jurisdiction.lead.quote"
  | "jurisdiction.payment.paid";

export type JurisdictionWebhookPayload = {
  event: JurisdictionWebhookEvent;
  leadId: string;
  kind: "guide" | "quote";
  email: string;
  firstName: string;
  leadScore?: number;
  leadTier?: string;
  projectType?: string;
  projectValue?: string;
  jurisdictions?: string[];
  paidTier?: string;
  amountCents?: number;
};

/** Slack / Discord / Make / Zapier — optional instant ops alert. */
export async function notifyJurisdictionWebhook(
  payload: JurisdictionWebhookPayload
): Promise<void> {
  const url =
    process.env.JURISDICTION_WEBHOOK_URL?.trim() ||
    process.env.PARTNER_WEBHOOK_URL?.trim();
  if (!url) return;

  const secret =
    process.env.JURISDICTION_WEBHOOK_SECRET?.trim() ||
    process.env.PARTNER_WEBHOOK_SECRET?.trim();

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "X-Auros-Secret": secret } : {}),
      },
      body: JSON.stringify({
        ...payload,
        source: "auros-jurisdictions",
        at: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8_000),
    });
  } catch (err) {
    console.warn("[jurisdiction-webhook]", err);
  }
}
