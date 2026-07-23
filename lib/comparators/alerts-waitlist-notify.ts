import { Resend } from "resend";

import { resendFrom } from "@/lib/emails/constants";
import type { CompareAlertsWaitlistEntry } from "./alerts-waitlist";

function opsNotifyEmail(): string | null {
  const ops = process.env.OPS_EMAIL?.trim();
  if (ops && ops.includes("@")) return ops;
  const internal = process.env.RESEND_INTERNAL_EMAIL?.trim();
  if (internal && internal.includes("@")) return internal;
  return null;
}

export async function notifyCompareAlertsWaitlistSignup(
  data: CompareAlertsWaitlistEntry
): Promise<{ ok: true } | { ok: false; error: string }> {
  const to = opsNotifyEmail();
  if (!to) {
    console.info("[compare-alerts] signup (no ops email)", data.email ?? data.webhookUrl);
    return { ok: true };
  }
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    console.warn("[compare-alerts] RESEND_API_KEY missing — skip notify");
    return { ok: true };
  }
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: resendFrom(),
    to,
    subject: `[AUROS Compare] Alerts waitlist — ${data.channel} · ${data.productIds.length} ids`,
    html: `<p>Nouvelle inscription alertes comparateur (watcher persisté — moves APY/TVL best-effort via cron).</p>
<ul>
<li>Channel : ${data.channel}</li>
<li>Email : ${data.email || "—"}</li>
<li>Webhook : ${data.webhookUrl || "—"}</li>
<li>Produits : ${data.productIds.join(", ")}</li>
<li>Locale : ${data.locale}</li>
<li>At : ${data.createdAt}</li>
</ul>`,
  });
  if (error) {
    console.error("[compare-alerts]", error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
