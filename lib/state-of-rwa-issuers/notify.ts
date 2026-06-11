import { Resend } from "resend";

import { internalNotifyEmail, resendFrom } from "@/lib/emails/constants";

export async function notifyReportDownloadSignup(data: {
  name: string;
  email: string;
  edition: string;
  locale: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const to = internalNotifyEmail();
  if (!to) {
    console.info("[report-download] signup (no ops email configured)", data);
    return { ok: true };
  }

  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    console.warn("[report-download] RESEND_API_KEY missing — skip notify");
    return { ok: true };
  }

  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: resendFrom(),
    to,
    subject: `[AUROS] State of RWA Issuers — ${data.edition}`,
    html: `<p>Nouveau téléchargement rapport trimestriel.</p>
<ul>
<li>Nom : ${data.name}</li>
<li>Email : ${data.email}</li>
<li>Édition : ${data.edition}</li>
<li>Locale : ${data.locale}</li>
</ul>`,
  });

  if (error) {
    console.error("[report-download] Resend error:", error);
    return { ok: false, error: "email_failed" };
  }

  return { ok: true };
}
