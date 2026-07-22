import { NextResponse } from "next/server";

import { authenticateProtocolRequest } from "@/lib/protocol/auth/middleware";
import { protocolError, protocolJson } from "@/lib/protocol/response";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function tollIpGuard(
  bucket: string,
  max = 60
): Promise<{ ok: true } | { ok: false; response: NextResponse }> {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`toll:${bucket}:${ip}`, max, 60_000);
  if (!allowed) {
    return {
      ok: false,
      response: protocolError("rate_limit", "Too many requests", 429),
    };
  }
  return { ok: true };
}

export async function tollRequireBearer(
  req: Request
): Promise<
  | { ok: true }
  | { ok: false; response: NextResponse }
> {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return { ok: false, response: auth.response };
  return { ok: true };
}

export async function parseJsonBody(
  req: Request
): Promise<
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; response: NextResponse }
> {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    return { ok: true, body };
  } catch {
    return {
      ok: false,
      response: protocolError("invalid_json", "Invalid JSON body", 400),
    };
  }
}

export { protocolJson, protocolError };
