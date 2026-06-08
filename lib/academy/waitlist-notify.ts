import { Resend } from "resend";

import { resendFrom } from "@/lib/emails/constants";

function opsNotifyEmail(): string | null {
  const ops = process.env.OPS_EMAIL?.trim();
  if (ops && ops.includes("@")) return ops;
  const internal = process.env.RESEND_INTERNAL_EMAIL?.trim();
  if (internal && internal.includes("@")) return internal;
  return null;
}

export async function notifyAcademyWaitlistSignup(data: {
  email: string;
  track: string;
  locale: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const to = opsNotifyEmail();
  if (!to) {
    console.info("[academy-waitlist] signup (no ops email configured)", data);
    return { ok: true };
  }

  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    console.warn("[academy-waitlist] RESEND_API_KEY missing — skip notify");
    return { ok: true };
  }

  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: resendFrom(),
    to,
    subject: `[AUROS Academy] Liste d'attente — ${data.track}`,
    html: `<p>Nouvelle inscription liste d'attente Academy.</p>
<ul>
<li>Email : ${data.email}</li>
<li>Parcours : ${data.track}</li>
<li>Locale : ${data.locale}</li>
</ul>`,
  });

  if (error) {
    console.error("[academy-waitlist] Resend error:", error);
    return { ok: false, error: "email_failed" };
  }

  return { ok: true };
}
