/**
 * Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is set.
 * Admin/cron routes should use this helper for consistent checks.
 */
export function isCronAuthorized(
  request: Request,
  options?: { allowDevWithoutSecret?: boolean }
): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return (
      options?.allowDevWithoutSecret !== false &&
      process.env.NODE_ENV !== "production"
    );
  }

  const auth = request.headers.get("authorization")?.trim() ?? "";
  if (auth === `Bearer ${secret}`) return true;

  const bare = auth.startsWith("Bearer ") ? auth.slice(7).trim() : auth;
  if (bare === secret) return true;

  const cronHeader = request.headers.get("x-cron-secret")?.trim();
  if (cronHeader === secret) return true;

  return false;
}
