import type { CompareHubPayload, HubProduct } from "../compare-hub";
import {
  normalizeCompareProductIds,
  COMPARE_HUB_MAX,
} from "../compare-selection";
import { buildCompareHubShareUrl } from "../compare-selection";
import { SITE_URL } from "../site";
import { buildCompareProof, type CompareProof } from "./signing";
import {
  applyScreener,
  buildDriftNotes,
  toCompareApiProduct,
  type CompareApiProduct,
  type DriftNote,
  type ScreenerFilters,
} from "./catalog";
import { PROTOCOL_DOCS_ROUTE } from "@/lib/protocol/docs/paths";

export const PUBLIC_COMPARE_HOURLY_LIMIT = 60;

export type CompareSnapshotBody = {
  schema: "auros.compare.snapshot.v1";
  mode: "screener" | "shortlist";
  as_of: string;
  products: CompareApiProduct[];
  shortlist?: {
    product_ids: string[];
    share_url: string;
  };
  filters?: ScreenerFilters;
  drift: DriftNote[];
  meta: {
    indicative: true;
    never_invent_apy: true;
    total_catalog: number;
    returned: number;
    rate_limit_per_hour: number;
    premium: string;
    docs: string;
    developers: string;
    rapidapi: string;
  };
  proof: CompareProof;
};

function metaBlock(total: number, returned: number) {
  return {
    indicative: true as const,
    never_invent_apy: true as const,
    total_catalog: total,
    returned,
    rate_limit_per_hour: PUBLIC_COMPARE_HOURLY_LIMIT,
    premium: "/api/v1/compare",
    docs: `${PROTOCOL_DOCS_ROUTE}/endpoint-compare`,
    developers: "/developers",
    rapidapi: "/presence",
  };
}

/** Unsigned payload fields that enter the HMAC (excludes proof itself). */
function hashableSnapshot(parts: {
  schema: "auros.compare.snapshot.v1";
  mode: "screener" | "shortlist";
  as_of: string;
  products: CompareApiProduct[];
  shortlist?: CompareSnapshotBody["shortlist"];
  filters?: ScreenerFilters;
  drift: DriftNote[];
}) {
  return parts;
}

export function buildScreenerSnapshot(
  payload: CompareHubPayload,
  filters: ScreenerFilters = {}
): CompareSnapshotBody {
  const screened = applyScreener(payload.products, filters);
  const as_of = payload.fetchedAt;
  const products = screened.map((p) => toCompareApiProduct(p, as_of));
  const drift = buildDriftNotes({
    requestedIds: filters.ids,
    foundIds: products.map((p) => p.id),
    fetchedAt: as_of,
  });
  const core = hashableSnapshot({
    schema: "auros.compare.snapshot.v1",
    mode: "screener",
    as_of,
    products,
    filters,
    drift,
  });
  return {
    ...core,
    meta: metaBlock(payload.totalProducts, products.length),
    proof: buildCompareProof(core),
  };
}

export function buildShortlistSnapshot(
  payload: CompareHubPayload,
  productIds: string[]
): CompareSnapshotBody {
  const ids = normalizeCompareProductIds(productIds).slice(0, COMPARE_HUB_MAX);
  const byId = new Map(payload.products.map((p) => [p.row.id, p]));
  const ordered: HubProduct[] = [];
  for (const id of ids) {
    const hit = byId.get(id);
    if (hit) ordered.push(hit);
  }
  const as_of = payload.fetchedAt;
  const products = ordered.map((p) => toCompareApiProduct(p, as_of));
  const drift = buildDriftNotes({
    requestedIds: ids,
    foundIds: products.map((p) => p.id),
    fetchedAt: as_of,
  });
  const shortlist = {
    product_ids: ids,
    share_url: buildCompareHubShareUrl(ids, SITE_URL),
  };
  const core = hashableSnapshot({
    schema: "auros.compare.snapshot.v1",
    mode: "shortlist",
    as_of,
    products,
    shortlist,
    drift,
  });
  return {
    ...core,
    meta: metaBlock(payload.totalProducts, products.length),
    proof: buildCompareProof(core),
  };
}
