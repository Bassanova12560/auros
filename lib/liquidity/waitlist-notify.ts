import { Resend } from "resend";

import { resendFrom } from "@/lib/emails/constants";
import type { LiquidityWaitlistEntry } from "@/lib/liquidity/waitlist";

function opsNotifyEmail(): string | null {
  const ops = process.env.OPS_EMAIL?.trim();
  if (ops && ops.includes("@")) return ops;
  const internal = process.env.RESEND_INTERNAL_EMAIL?.trim();
  if (internal && internal.includes("@")) return internal;
  return null;
}

export async function notifyLiquidityWaitlistSignup(
  data: LiquidityWaitlistEntry
): Promise<{ ok: true } | { ok: false; error: string }> {
  const to = opsNotifyEmail();
  if (!to) {
    console.info("[liquidity-waitlist] signup (no ops email)", data.email);
    return { ok: true };
  }
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    console.warn("[liquidity-waitlist] RESEND_API_KEY missing — skip notify");
    return { ok: true };
  }
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: resendFrom(),
    to,
    subject: `[AUROS Liquidity] Waitlist — ${data.role}`,
    html: `<p>Nouvelle inscription Liquidity Bridge (waitlist — pas d'exécution).</p>
<ul>
<li>Email : ${data.email}</li>
<li>Rôle : ${data.role}</li>
<li>Chaîne : ${data.chain || "—"}</li>
<li>Message : ${data.message || "—"}</li>
<li>Locale : ${data.locale}</li>
</ul>`,
  });
  if (error) {
    console.error("[liquidity-waitlist]", error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
