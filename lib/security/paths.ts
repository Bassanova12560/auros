/** Paths scanners probe — respond 404 without hitting app logic. */
const BLOCKED_PATH_PREFIXES = [
  "/.env",
  "/wp-admin",
  "/wp-login",
  "/phpmyadmin",
  "/xmlrpc.php",
  "/vendor/phpunit",
  "/.git",
  "/actuator",
  "/debug/default",
] as const;

const SENSITIVE_API_PREFIXES = [
  "/api/ops",
  "/api/admin",
  "/api/dev",
  "/api/cron",
] as const;

export function isBlockedProbePath(pathname: string): boolean {
  const p = pathname.toLowerCase();
  if (p.includes("..") || p.includes("%2e%2e") || p.includes("\0")) {
    return true;
  }
  return BLOCKED_PATH_PREFIXES.some(
    (prefix) => p === prefix || p.startsWith(`${prefix}/`) || p.startsWith(prefix)
  );
}

export function isSensitiveApiPath(pathname: string): boolean {
  return SENSITIVE_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
