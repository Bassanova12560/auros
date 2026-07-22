import { NextResponse } from "next/server";

import { authenticateProtocolRequest } from "@/lib/protocol/auth/middleware";
import { findKeyRecord, validateApiKey } from "@/lib/protocol/auth/keys";
import { protocolError, protocolJson } from "@/lib/protocol/response";
import { checkRateLimitAsync, getClientIp } from "@/lib/rate-limit";
import {
  consumeTollCredits,
  type TollMeterOp,
  type TollMeterSubject,
} from "@/lib/toll/metering";

export async function tollIpGuard(
  bucket: string,
  max = 60
): Promise<{ ok: true } | { ok: false; response: NextResponse }> {
  const ip = await getClientIp();
  const { allowed } = await checkRateLimitAsync(
    `toll:${bucket}:${ip}`,
    max,
    60_000
  );
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

/**
 * Optional Bearer + credit metering (lookup tax).
 * Anonymous subjects use ip:{ip}; keyed subjects use key:{hash}.
 */
export async function tollMeteredGuard(
  req: Request,
  op: TollMeterOp,
  opts?: { requireAuth?: boolean }
): Promise<
  | {
      ok: true;
      subject: TollMeterSubject;
      meter: Awaited<ReturnType<typeof consumeTollCredits>>;
    }
  | { ok: false; response: NextResponse }
> {
  const ip = await getClientIp();
  const burst = await checkRateLimitAsync(`toll:burst:${ip}`, 90, 60_000);
  if (!burst.allowed) {
    return {
      ok: false,
      response: protocolError("rate_limit", "Too many requests", 429),
    };
  }

  let subject: TollMeterSubject = {
    id: `ip:${ip}`,
    tier: "anonymous",
  };

  const authHeader = req.headers.get("authorization")?.trim();
  if (authHeader?.startsWith("Bearer ")) {
    const raw = authHeader.slice(7).trim();
    const validation = await validateApiKey(raw);
    if (!validation.valid || !validation.keyHash) {
      return {
        ok: false,
        response: protocolError("unauthorized", "Invalid API key", 401),
      };
    }
    let tier: TollMeterSubject["tier"] = validation.isDemo ? "free" : "free";
    if (!validation.isDemo) {
      const record = await findKeyRecord(validation.keyHash);
      if (record?.tier === "premium" || record?.tier === "monitor") {
        tier = "premium";
      }
      if (record?.tier === "enterprise") tier = "enterprise";
    }
    subject = { id: `key:${validation.keyHash}`, tier };
  } else if (opts?.requireAuth) {
    return {
      ok: false,
      response: protocolError(
        "unauthorized",
        "Missing Authorization: Bearer <api_key>",
        401
      ),
    };
  }

  const meter = await consumeTollCredits({ subject, op });
  if (!meter.allowed) {
    return {
      ok: false,
      response: protocolError(
        "quota_exceeded",
        `Toll lookup credits exceeded (${meter.limit}/mo). Buy Lookup Pack at /green/toll or upgrade API tier.`,
        429
      ),
    };
  }

  return { ok: true, subject, meter };
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
