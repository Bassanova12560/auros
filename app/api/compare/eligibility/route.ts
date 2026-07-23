import { NextResponse } from "next/server";

import { getCompareHubPayload } from "@/lib/comparators/compare-hub";
import { buildEligibilityResponse } from "@/lib/comparators/api/eligibility";
import { parseCompareProductIdsParam, normalizeCompareProductIds } from "@/lib/comparators/compare-selection";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

const HOURLY = 40;

/**
 * Eligibility composite — compare × MiCA-oriented flags × jurisdiction × green/CSRD hints.
 * Indicative only — never legal advice, never invent APY.
 */
export async function GET(req: Request) {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(`compare-eligibility:${ip}`, HOURLY, 3_600_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "rate_limited", message: "Eligibility quota — retry later" },
      { status: 429 }
    );
  }

  const url = new URL(req.url);
  const ids = parseCompareProductIdsParam(
    url.searchParams.get("ids") ?? url.searchParams.get("compare")
  );
  if (ids.length < 1) {
    return NextResponse.json(
      {
        error: "ids_required",
        message: "Pass ?ids=id1,id2 (1–4) for eligibility composite",
        meta: { mica_checker: "/tools/mica-checker", not_legal_advice: true },
      },
      { status: 400 }
    );
  }

  const hub = await getCompareHubPayload();
  const body = buildEligibilityResponse(hub.products, ids, hub.fetchedAt);
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=300",
      "X-AUROS-Compare-Schema": "auros.compare.eligibility.v1",
      "X-RateLimit-Remaining": String(rate.remaining),
    },
  });
}

export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(`compare-eligibility:${ip}`, HOURLY, 3_600_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

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
  const ids = normalizeCompareProductIds(
    idsRaw.filter((id): id is string => typeof id === "string")
  );
  if (ids.length < 1) {
    return NextResponse.json({ error: "product_ids_required" }, { status: 400 });
  }

  const hub = await getCompareHubPayload();
  const result = buildEligibilityResponse(hub.products, ids, hub.fetchedAt);
  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "no-store",
      "X-AUROS-Compare-Schema": "auros.compare.eligibility.v1",
    },
  });
}
