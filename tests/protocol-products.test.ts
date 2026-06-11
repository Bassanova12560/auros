import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ProductItem } from "../lib/protocol/schemas/products";
import {
  matchesProductQuery,
  sortProtocolProducts,
} from "../lib/protocol/products/adapter";

const FIXTURE: ProductItem[] = [
  {
    id: "a",
    name: "Alpha RE",
    platform: "RealT",
    category: "real_estate",
    apy: 8.5,
    tvl_usd: 1_000_000,
    chains: ["Ethereum"],
    jurisdiction: "US",
    affiliate_url: "https://example.com/a",
    min_investment_usd: 50,
    live: true,
  },
  {
    id: "b",
    name: "Beta Bond",
    platform: "Backed",
    category: "bonds",
    apy: 4.2,
    tvl_usd: 5_000_000,
    chains: ["Ethereum", "Polygon"],
    jurisdiction: "Switzerland",
    affiliate_url: "https://example.com/b",
    min_investment_usd: 1000,
    live: true,
  },
  {
    id: "c",
    name: "Gamma Credit",
    platform: "Maple",
    category: "private_credit",
    apy: 11,
    tvl_usd: 500_000,
    chains: ["Ethereum"],
    jurisdiction: "EU",
    affiliate_url: "https://example.com/c",
    min_investment_usd: 500,
    live: true,
  },
];

describe("protocol/products", () => {
  it("filters by category", () => {
    const filtered = FIXTURE.filter((p) =>
      matchesProductQuery(p, { category: "real_estate", page: 1, limit: 20, sort: "apy" })
    );
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0]?.id, "a");
  });

  it("filters by yield_min and chain", () => {
    const filtered = FIXTURE.filter((p) =>
      matchesProductQuery(p, {
        category: "all",
        yield_min: 10,
        chain: "ethereum",
        page: 1,
        limit: 20,
        sort: "apy",
      })
    );
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0]?.id, "c");
  });

  it("sorts by apy descending", () => {
    const sorted = sortProtocolProducts(FIXTURE, "apy");
    assert.equal(sorted[0]?.id, "c");
    assert.equal(sorted[2]?.id, "b");
  });
});
