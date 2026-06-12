import { NextResponse } from "next/server";

import { AUROS_LOGO_URL, PROTOCOL_DISCLAIMER, PROTOCOL_VERSION } from "./constants";
import {
  formatRateLimitHeaders,
  getRateLimitContext,
} from "./rate-limit-context";

export function getProtocolResponseHeaders(
  extra?: Record<string, string>,
  responseTime?: string
): Record<string, string> {
  const rateLimit = getRateLimitContext();
  return {
    "X-AUROS-Protocol-Version": PROTOCOL_VERSION,
    "X-AUROS-Logo": AUROS_LOGO_URL,
    ...(responseTime ? { "X-Response-Time": responseTime } : {}),
    ...(rateLimit ? formatRateLimitHeaders(rateLimit) : {}),
    ...extra,
  };
}

export function protocolJson<T extends Record<string, unknown>>(
  body: T,
  init?: { status?: number; headers?: Record<string, string> }
): NextResponse {
  return NextResponse.json(
    { disclaimer: PROTOCOL_DISCLAIMER, ...body },
    {
      status: init?.status ?? 200,
      headers: getProtocolResponseHeaders(init?.headers),
    }
  );
}

export function protocolError(
  code: string,
  message: string,
  status: number
): NextResponse {
  return protocolJson({ error: { code, message } }, { status });
}
