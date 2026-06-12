import { NextResponse } from "next/server";

import {
  formatRateLimitHeaders,
  getRateLimitContext,
  runWithRateLimitContext,
} from "./rate-limit-context";

export type ProtocolRouteHandler<T = unknown> = (req: Request, ctx: T) => Promise<Response>;

/** Wrap a `/api/v1/*` route handler to append `X-Response-Time` on every response. */
export function protocolRoute<T = unknown>(
  handler: ProtocolRouteHandler<T>,
): ProtocolRouteHandler<T> {
  return async (req, ctx) => {
    return runWithRateLimitContext(async () => {
      const start = performance.now();
      const response = await handler(req, ctx);
      return withRateLimitHeaders(withResponseTime(response, start));
    });
  };
}

export function responseTimeMs(start: number): string {
  return `${Math.max(0, Math.round(performance.now() - start))}ms`;
}

export function withResponseTime(response: Response, start: number): Response {
  if (response.headers.has("X-Response-Time")) return response;
  const headers = new Headers(response.headers);
  headers.set("X-Response-Time", responseTimeMs(start));
  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function withRateLimitHeaders(response: Response): Response {
  const ctx = getRateLimitContext();
  if (!ctx || response.headers.has("X-RateLimit-Limit")) return response;
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(formatRateLimitHeaders(ctx))) {
    headers.set(key, value);
  }
  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
