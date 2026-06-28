import { greenApiJson, greenApiOptions } from "@/lib/green/api";
import { buildGreenApiStatus } from "@/lib/green/api/status";

export const revalidate = 60;

export function OPTIONS() {
  return greenApiOptions();
}

/** Public Green API health — no auth. */
export async function GET() {
  const status = await buildGreenApiStatus();
  return greenApiJson(
    { ok: status.ok, status },
    { status: status.ok ? 200 : 503 }
  );
}
