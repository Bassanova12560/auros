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
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
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
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    }
  );
}
