import { NextResponse } from "next/server";

import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

import { isSensitiveApiPath } from "./paths";

export { isBlockedProbePath, isSensitiveApiPath } from "./paths";

const MAX_JSON_BYTES_DEFAULT = 256_000;
const MAX_JSON_BYTES_SENSITIVE = 64_000;

export function newRequestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Edge / proxy burst limit for sensitive API surfaces. */
export async function enforceSensitiveApiBurst(
  request: Request,
  pathname: string
): Promise<NextResponse | null> {
  if (!isSensitiveApiPath(pathname)) return null;

  const ip = getRequestIp(request);
  const rate = await checkRateLimitAsync(
    `edge-sensitive:${pathname.split("/").slice(0, 4).join("/")}:${ip}`,
    60,
    60_000
  );
  if (rate.allowed) return null;

  return NextResponse.json(
    { ok: false, error: "rate_limit", message: "Too many requests." },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.max(1, rate.reset - Math.floor(Date.now() / 1000))),
        "X-RateLimit-Remaining": "0",
      },
    }
  );
}

/**
 * Safe JSON body read with hard size cap (users + APIs).
 * Returns null body when empty; throws Response-shaped errors via result.
 */
export async function readJsonBodyLimited<T = unknown>(
  request: Request,
  options?: { maxBytes?: number; sensitive?: boolean }
): Promise<
  | { ok: true; data: T }
  | { ok: false; response: NextResponse }
> {
  const maxBytes =
    options?.maxBytes ??
    (options?.sensitive ? MAX_JSON_BYTES_SENSITIVE : MAX_JSON_BYTES_DEFAULT);

  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    const n = Number(contentLength);
    if (Number.isFinite(n) && n > maxBytes) {
      return {
        ok: false,
        response: NextResponse.json(
          { ok: false, error: "payload_too_large" },
          { status: 413 }
        ),
      };
    }
  }

  const buf = await request.arrayBuffer();
  if (buf.byteLength > maxBytes) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: "payload_too_large" },
        { status: 413 }
      ),
    };
  }

  if (buf.byteLength === 0) {
    return { ok: true, data: {} as T };
  }

  try {
    const text = new TextDecoder("utf-8", { fatal: false }).decode(buf);
    return { ok: true, data: JSON.parse(text) as T };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: "invalid_json" },
        { status: 400 }
      ),
    };
  }
}
