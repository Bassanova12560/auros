/** Public Green pages probed by cron and `npm run green:health`. */
export const GREEN_HEALTH_PATHS = [
  "/green/register",
  "/green/market",
  "/green/label",
  "/green/compare",
  "/green/rtms-assistant",
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

export function resolveGreenHealthBase(): string {
  const fromEnv =
    process.env.AUROS_PROD_URL?.trim() ||
    process.env.BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`
      : "");

  if (!fromEnv) return "http://localhost:3000";
  return fromEnv.replace(/\/$/, "");
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
        headers: { Accept: "text/html" },
      });
      const ok = res.status >= 200 && res.status < 400;
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
