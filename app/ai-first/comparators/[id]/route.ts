import {
  getArtRows,
  getBondRows,
  getCommodityRows,
  getImmobilierRows,
  getPrivateCreditRows,
  getPrivateEquityRows,
  getStablecoinRows,
} from "@/lib/comparators";
import { getAiFirstPageById, toPageExport } from "@/lib/ai-first";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

export const revalidate = 3600;

const LOADERS: Record<
  string,
  () => Promise<{ rows: unknown[]; fetchedAt: string; source: string }>
> = {
  stablecoins: getStablecoinRows,
  "real-estate": getImmobilierRows,
  bonds: getBondRows,
  commodities: getCommodityRows,
  "private-credit": getPrivateCreditRows,
  "private-equity": getPrivateEquityRows,
  art: getArtRows,
  compare: async () => {
    const { getCompareHubPayload } = await import("@/lib/comparators/compare-hub");
    const payload = await getCompareHubPayload();
    return {
      rows: payload.products.map((p) => p.row),
      fetchedAt: payload.fetchedAt,
      source: "hub",
    };
  },
};

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const ip = getRequestIp(request);
  const rate = await checkRateLimitAsync(
    `ai-first-comparators:${ip}`,
    120,
    3_600_000
  );
  if (!rate.allowed) {
    return Response.json(
      {
        error: "rate_limited",
        message: "Too many requests — use GET /api/compare or Premium /api/v1/compare",
        meta: {
          public: "/api/compare",
          premium: "/api/v1/compare",
          docs: "/developers/docs/endpoint-compare",
        },
      },
      { status: 429 }
    );
  }

  const { id } = await context.params;
  const pageId = `comparator-${id}`;
  const page = getAiFirstPageById(pageId);
  const loader = LOADERS[id];

  if (!page || !loader) {
    return Response.json({ error: "not_found", id }, { status: 404 });
  }

  const live = await loader();
  const exportPage = toPageExport(page);

  return Response.json(
    {
      ...exportPage,
      live: {
        fetchedAt: live.fetchedAt,
        source: live.source,
        rowCount: live.rows.length,
        rows: live.rows.slice(0, 50),
      },
      meta: {
        public_compare: "/api/compare",
        premium: "/api/v1/compare",
        eligibility: "/api/compare/eligibility",
      },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "X-RateLimit-Remaining": String(rate.remaining),
      },
    }
  );
}
