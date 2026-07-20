import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildAiFirstCatalog,
  buildLlmsTxt,
  getAiFirstPageByPath,
  getAllAiFirstPages,
  getIndexablePages,
  toPageExport,
} from "../lib/ai-first";

describe("ai-first/catalog", () => {
  it("includes core public URLs", () => {
    const paths = getAllAiFirstPages().map((p) => p.path);
    assert.ok(paths.includes("/"));
    assert.ok(paths.includes("/jurisdictions"));
    assert.ok(paths.includes("/jurisdictions/starter-kit"));
    assert.ok(paths.includes("/academy"));
    assert.ok(paths.includes("/academy/fondamentaux"));
    assert.ok(paths.includes("/bonds"));
  });

  it("resolves page by path", () => {
    const page = getAiFirstPageByPath("/jurisdictions");
    assert.ok(page);
    assert.equal(page!.id, "jurisdictions");
    assert.ok(page!.faq && page!.faq.length >= 3);
  });

  it("exports JSON-LD blocks per page", () => {
    const page = getAiFirstPageByPath("/jurisdictions/starter-kit");
    assert.ok(page);
    const exp = toPageExport(page!);
    assert.ok(exp.jsonLd.length >= 2);
  });

  it("builds catalog index shape", () => {
    const cat = buildAiFirstCatalog();
    assert.equal(typeof cat.version, "string");
    assert.ok(cat.discovery.llmsTxt.includes("llms.txt"));
    assert.ok(cat.discovery.ragSearch.includes("/ai-first/rag"));
    assert.ok(cat.pages.length >= 30);
  });

  it("includes Watts and ChargeFlow product hubs", () => {
    const paths = getAllAiFirstPages().map((p) => p.path);
    assert.ok(paths.includes("/green/watts"));
    assert.ok(paths.includes("/green/chargeflow"));
    assert.ok(paths.includes("/green/chargeflow/fleets"));
    assert.ok(paths.includes("/eau/chargeflow"));
    const watts = getAiFirstPageByPath("/green/watts");
    assert.ok(watts?.faq && watts.faq.length >= 4);
    const cf = getAiFirstPageByPath("/green/chargeflow");
    assert.ok(cf?.faq && cf.faq.length >= 4);
  });

  it("generates llms.txt with discovery links", () => {
    const txt = buildLlmsTxt(getAllAiFirstPages(), false);
    assert.match(txt, /# AUROS/);
    assert.match(txt, /ai-first\/index.json/);
    assert.match(txt, /ai-first\/rag/);
    assert.match(txt, /Primary products/);
    assert.match(txt, /AUROS Green/);
    assert.match(txt, /AUROS Watts/);
    assert.match(txt, /ChargeFlow/);
    assert.match(txt, /AUROS Protocol API/);
    assert.match(txt, /Citation policy/);
    assert.match(txt, /api\.getauros\.com/);
  });

  it("indexable pages cover sitemap entries", () => {
    const indexable = getIndexablePages();
    assert.ok(indexable.length >= 35);
    for (const core of ["/", "/about", "/jurisdictions", "/partners", "/privacy"]) {
      assert.ok(
        indexable.some((p) => p.path === core),
        `missing indexable ${core}`
      );
    }
  });

  it("seo landings have full jurisdiction facts", () => {
    const landing = getAiFirstPageByPath("/jurisdictions/luxembourg-real-estate");
    assert.ok(landing);
    assert.equal(landing!.contentType, "landing");
    assert.ok(landing!.facts.some((f) => f.key.includes("Luxembourg") && f.key.includes("régulateur")));
    assert.ok(landing!.facts.length >= 10);
  });
});
