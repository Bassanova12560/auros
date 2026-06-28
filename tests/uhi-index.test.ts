import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildUhiIndexPayload } from "@/lib/uhi-index/compute";
import { uhiIndexToCsv } from "@/lib/uhi-index/csv";
import { UHI_INDEX_TOP_N } from "@/lib/uhi-index/types";
import {
  getAllGreenBlogSlugs,
  getGreenBlogArticle,
} from "@/lib/green/blog/articles";

describe("uhi-index/compute", () => {
  it("builds payload with energy entries from green catalog", () => {
    const payload = buildUhiIndexPayload({
      editionIso: "2026-06-01",
      generatedAt: "2026-06-27T12:00:00.000Z",
    });
    assert.equal(payload.editionIso, "2026-06-01");
    assert.ok(payload.entries.length >= 1);
    assert.ok(payload.entries.length <= UHI_INDEX_TOP_N);
    assert.ok(payload.catalogCount >= payload.entries.length);
    assert.ok(payload.segments.length >= 1);
  });

  it("includes performance metrics on early editions", () => {
    const payload = buildUhiIndexPayload({ editionIso: "2026-06-01" });
    assert.ok(payload.indexPerformance.month_pct != null);
    assert.ok(payload.indexPerformance.ytd_pct != null);
  });

  it("exports CSV with UHI columns", () => {
    const payload = buildUhiIndexPayload({ editionIso: "2026-06-01" });
    const csv = uhiIndexToCsv(payload, {
      rank: "rank",
      name: "name",
      segment: "segment",
      uhi: "uhi_score",
      watt: "watt_score",
      taxonomy: "taxonomy_score",
      yield: "yield_pct",
      mom: "mom_pct",
      source: "source_url",
    });
    assert.match(csv, /^rank,name,segment/);
    assert.ok(csv.split("\n").length >= payload.entries.length);
  });
});

describe("green/strategy-blog-articles", () => {
  it("registers strategy and press articles", () => {
    const slugs = getAllGreenBlogSlugs();
    for (const slug of [
      "credits-carbone-icvcm-2027",
      "dpp-marche-rwa-plus-grand",
      "auros-green-index-premier-numero",
      "green-api-standard-ouvert-2026",
    ]) {
      assert.ok(slugs.includes(slug), slug);
      const article = getGreenBlogArticle(slug);
      assert.ok(article);
      assert.ok(article!.sections.length >= 3);
      assert.ok(article!.cta.href.startsWith("/"));
    }
  });
});
