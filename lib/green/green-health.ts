/** Public Green pages probed by cron and `npm run green:health`. */
export const GREEN_HEALTH_PATHS = [
  "/green",
  "/green/register",
  "/green/market",
  "/green/label",
  "/green/compare",
  "/green/rtms-assistant",
  "/green/api",
  "/green/press",
  "/green/registry-connect",
  "/green/dpp",
  "/green/chargeflow",
  "/green/chargeflow/flex",
  "/green/chargeflow/fleets",
  "/green/chargeflow/console",
  "/eau/chargeflow",
  "/eau",
  "/comment-tokeniser/eau",
  "/data/green-index",
  "/data/nature-score",
] as const;

export type GreenHealthCheck = {
  path: string;
  status: number;
  ok: boolean;
  error?: string;
};

export type GreenHealthResult = {
  base: string;
  ok: boolean;
  checks: GreenHealthCheck[];
  checkedAt: string;
};

const GREEN_HEALTH_FETCH_MS = 25_000;

export function resolveGreenHealthBase(): string {
  const fromEnv =
    process.env.AUROS_PROD_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`
      : "");

  if (!fromEnv) return "http://localhost:3000";
  const normalized = fromEnv.replace(/\/$/, "");
  return normalized.startsWith("http")
    ? normalized
    : `https://${normalized}`;
}

export async function runGreenHealthChecks(
  baseInput?: string
): Promise<GreenHealthResult> {
  const base = (baseInput ?? resolveGreenHealthBase()).replace(/\/$/, "");
  const checks: GreenHealthCheck[] = [];

  for (const path of GREEN_HEALTH_PATHS) {
    const url = `${base}${path}`;
    try {
      const res = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(GREEN_HEALTH_FETCH_MS),
        headers: {
          // Avoid Clerk dev-browser handshake loops (Accept: text/html).
          Accept: "*/*",
          "User-Agent": "Auros-Green-Health/1",
        },
      });
      const ok = res.status >= 200 && res.status < 300;
      checks.push({ path, status: res.status, ok });
    } catch (err) {
      checks.push({
        path,
        status: 0,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return {
    base,
    ok: checks.every((c) => c.ok),
    checks,
    checkedAt: new Date().toISOString(),
  };
}
