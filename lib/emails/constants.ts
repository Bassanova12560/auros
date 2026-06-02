export function siteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://auros-delta.vercel.app"
  );
}

export function resendFrom(): string {
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (from) return from.includes("<") ? from : `AUROS <${from}>`;
  return "AUROS <onboarding@resend.dev>";
}

export function internalNotifyEmail(): string | null {
  const email =
    process.env.RESEND_INTERNAL_EMAIL?.trim() ||
    process.env.AUROS_TEAM_EMAIL?.trim();
  return email && email.includes("@") ? email : null;
}
