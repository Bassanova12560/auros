import { NextResponse } from "next/server";

import { getCompareHubPayload } from "@/lib/comparators/compare-hub";
import {
  buildScreenerSnapshot,
  buildShortlistSnapshot,
  PUBLIC_COMPARE_HOURLY_LIMIT,
} from "@/lib/comparators/api/snapshot";
import { parseCompareProductIdsParam } from "@/lib/comparators/compare-selection";
import type { RiskTier } from "@/lib/comparators/risk";
import type { ScreenerFilters, SourceType } from "@/lib/comparators/api/catalog";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

export const revalidate = 300;

function rateLimited(reset: number) {
  return NextResponse.json(
    {
      error: "rate_limited",
      message:
        "Public compare limit — use Premium POST /api/v1/compare (Bearer) or try later.",
      meta: {
        premium: "/api/v1/compare",
        docs: "/developers/docs/endpoint-compare",
        developers: "/developers",
        rapidapi: "/presence",
      },
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.max(1, reset - Math.floor(Date.now() / 1000))),
        "X-RateLimit-Limit": String(PUBLIC_COMPARE_HOURLY_LIMIT),
        "X-RateLimit-Remaining": "0",
      },
    }
  );
}

function parseFilters(url: URL): ScreenerFilters {
  const ids = parseCompareProductIdsParam(
    url.searchParams.get("ids") ?? url.searchParams.get("compare")
  );
  const risk = url.searchParams.get("risk_tier") as RiskTier | "all" | null;
  const source = url.searchParams.get("source") as SourceType | "all" | null;
  const yieldMin = url.searchParams.get("yield_min");
  const maxTicket = url.searchParams.get("max_ticket_usd");
  const limitRaw = url.searchParams.get("limit");
  return {
    ids: ids.length > 0 ? ids : undefined,
    risk_tier: risk === "conservative" || risk === "core" || risk === "advanced" || risk === "all"
      ? risk
      : "all",
    source: source === "live" || source === "manual" || source === "all" ? source : "all",
    jurisdiction: url.searchParams.get("jurisdiction") ?? undefined,
    yield_min: yieldMin != null ? Number(yieldMin) : undefined,
    max_ticket_usd: maxTicket != null ? Number(maxTicket) : undefined,
    green_only: url.searchParams.get("green_only") === "1" || url.searchParams.get("green_only") === "true",
    limit: limitRaw != null ? Number(limitRaw) : undefined,
  };
}

/**
 * Public Compare API v1 — screener (GET) or shortlist snapshot (GET ?mode=shortlist&ids=).
 * HMAC proof when ATTEST_SIGNING_KEY is set. Free IP quota → Premium /api/v1/compare.
 */
export async function GET(req: Request) {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(
    `public-compare:${ip}`,
    PUBLIC_COMPARE_HOURLY_LIMIT,
    3_600_000
  );
  if (!rate.allowed) return rateLimited(rate.reset);

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode");
  const payload = await getCompareHubPayload();
  const filters = parseFilters(url);

  const body =
    mode === "shortlist" && filters.ids?.length
      ? buildShortlistSnapshot(payload, filters.ids)
      : buildScreenerSnapshot(payload, filters);

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=300",
      "X-RateLimit-Limit": String(PUBLIC_COMPARE_HOURLY_LIMIT),
      "X-RateLimit-Remaining": String(rate.remaining),
      "X-AUROS-Compare-Schema": "auros.compare.snapshot.v1",
    },
  });
}

/** POST shortlist snapshot — body: { product_ids: string[] }. */
export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(
    `public-compare:${ip}`,
    PUBLIC_COMPARE_HOURLY_LIMIT,
    3_600_000
  );
  if (!rate.allowed) return rateLimited(rate.reset);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const obj = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const idsRaw = Array.isArray(obj.product_ids)
    ? obj.product_ids
    : Array.isArray(obj.productIds)
      ? obj.productIds
      : [];
  const ids = idsRaw.filter((id): id is string => typeof id === "string");
  if (ids.length < 1) {
    return NextResponse.json(
      { error: "product_ids_required", message: "Pass 1–4 product_ids for a shortlist snapshot" },
      { status: 400 }
    );
  }

  const payload = await getCompareHubPayload();
  const snapshot = buildShortlistSnapshot(payload, ids);
  return NextResponse.json(snapshot, {
    headers: {
      "Cache-Control": "no-store",
      "X-RateLimit-Limit": String(PUBLIC_COMPARE_HOURLY_LIMIT),
      "X-RateLimit-Remaining": String(rate.remaining),
      "X-AUROS-Compare-Schema": "auros.compare.snapshot.v1",
    },
  });
}
