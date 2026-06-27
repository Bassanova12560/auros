import { NextResponse } from "next/server";

import type { GreenApiAuth } from "./auth";

const GREEN_API_VERSION = "1.0";

export function greenApiHeaders(
  auth?: GreenApiAuth,
  extra?: Record<string, string>
): Record<string, string> {
  const headers: Record<string, string> = {
    "X-AUROS-Green-API-Version": GREEN_API_VERSION,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    ...extra,
  };
  if (auth) {
    headers["X-AUROS-Green-Tier"] = auth.tier;
    headers["X-RateLimit-Limit"] = String(auth.rateLimit.limit);
    headers["X-RateLimit-Remaining"] = String(auth.rateLimit.remaining);
    headers["X-RateLimit-Reset"] = String(auth.rateLimit.reset);
  }
  return headers;
}

export function greenApiJson<T extends Record<string, unknown>>(
  body: T,
  init?: { status?: number; auth?: GreenApiAuth; headers?: Record<string, string> }
): NextResponse {
  return NextResponse.json(
    {
      disclaimer:
        "Indicative AUROS Green signals — not Verra/ICVCM certification or investment advice.",
      ...body,
    },
    {
      status: init?.status ?? 200,
      headers: greenApiHeaders(init?.auth, init?.headers),
    }
  );
}

export function greenApiError(
  code: string,
  message: string,
  status: number,
  auth?: GreenApiAuth
): NextResponse {
  return greenApiJson({ ok: false, error: { code, message } }, { status, auth });
}

export function greenApiOptions(): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: greenApiHeaders(),
  });
}
