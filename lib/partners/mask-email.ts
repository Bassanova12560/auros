/** Mask email for partner portal — first char + domain only. */
export function maskPartnerEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.indexOf("@");
  if (at < 1) return "•••";
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  if (!domain) return "•••";
  return `${local[0]}•••@${domain}`;
}
