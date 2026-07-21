/** Escape HTML entities for safe interpolation in emails / HTML fragments. */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strip control chars and cap length for user-supplied display strings. */
export function sanitizeUserText(
  input: unknown,
  maxLen = 2_000
): string | null {
  if (typeof input !== "string") return null;
  const cleaned = input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
  if (!cleaned) return null;
  return cleaned.length > maxLen ? cleaned.slice(0, maxLen) : cleaned;
}

/** Normalize email for storage / comparison (lowercase, trim, length). */
export function sanitizeEmail(input: unknown): string | null {
  const raw = sanitizeUserText(input, 320);
  if (!raw) return null;
  const email = raw.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}
