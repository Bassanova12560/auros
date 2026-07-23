import { NextResponse } from "next/server";

import { getCompareHubPayload } from "@/lib/comparators/compare-hub";
import {
  COMPARE_REPORT_MAX,
  COMPARE_REPORT_MIN,
} from "@/lib/comparators/compare-report";
import {
  compareReportPdfFilename,
  generateCompareReportPdf,
} from "@/lib/comparators/compare-report-pdf";
import { parseCompareProductIdsParam } from "@/lib/comparators/compare-selection";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const HOURLY_LIMIT = 20;

/**
 * Server-signed Compare Report PDF for a shortlist (2–4 products).
 * HMAC attestation when ATTEST_SIGNING_KEY is set — never invents APY.
 */
export async function GET(request: Request) {
  const ip = getRequestIp(request);
  const { allowed, remaining, reset } = await checkRateLimitAsync(
    `compare-report-pdf:${ip}`,
    HOURLY_LIMIT,
    3_600_000
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "rate_limited", meta: { limit_per_hour: HOURLY_LIMIT } },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(1, reset - Math.floor(Date.now() / 1000))
          ),
        },
      }
    );
  }

  const url = new URL(request.url);
  const ids = parseCompareProductIdsParam(
    url.searchParams.get("compare") ?? url.searchParams.get("ids")
  );
  if (ids.length < COMPARE_REPORT_MIN || ids.length > COMPARE_REPORT_MAX) {
    return NextResponse.json(
      {
        error: "invalid_selection",
        message: `Provide ${COMPARE_REPORT_MIN}–${COMPARE_REPORT_MAX} product ids`,
      },
      { status: 400 }
    );
  }

  const locale = (url.searchParams.get("locale") ?? "en").slice(0, 8);
  const hub = await getCompareHubPayload();
  const byId = new Map(hub.products.map((p) => [p.row.id, p]));
  const products = ids
    .map((id) => byId.get(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (products.length < COMPARE_REPORT_MIN) {
    return NextResponse.json(
      { error: "products_not_found", found: products.map((p) => p.row.id) },
      { status: 404 }
    );
  }

  try {
    const { blob, attestation } = await generateCompareReportPdf({
      products,
      asOf: hub.fetchedAt,
      locale,
    });
    const buf = Buffer.from(await blob.arrayBuffer());
    const filename = compareReportPdfFilename(ids);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "X-AUROS-Content-Hash": attestation.content_hash,
        "X-AUROS-Signed": attestation.signed ? "1" : "0",
        ...(attestation.signature
          ? { "X-AUROS-Signature": attestation.signature }
          : {}),
        "X-RateLimit-Remaining": String(remaining),
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch (err) {
    console.error("[compare-report-pdf]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "pdf_failed" },
      { status: 500 }
    );
  }
}
