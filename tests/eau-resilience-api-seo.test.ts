import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildGreenApiOpenApiSpec } from "@/lib/green/api/openapi";
import { getAiFirstPageByPath } from "@/lib/ai-first/catalog";
import { CATEGORY_INTENTS } from "@/lib/seo/category-intents";

describe("eau resilience API openapi", () => {
  it("documents WELHR, playbook, ROI, brief, discovery", () => {
    const spec = buildGreenApiOpenApiSpec() as {
      paths: Record<string, unknown>;
      info: { version: string };
    };
    assert.equal(spec.info.version, "1.2.0");
    assert.ok(spec.paths["/api/green/eau/legal-risk"]);
    assert.ok(spec.paths["/api/green/eau/continuity-playbook"]);
    assert.ok(spec.paths["/api/green/eau/roi"]);
    assert.ok(spec.paths["/api/green/eau/resilience-brief"]);
    assert.ok(spec.paths["/api/green/eau/resilience"]);
  });
});

describe("resilience SEO catalog", () => {
  it("indexes resilience and h2o-rwa pages", () => {
    assert.ok(getAiFirstPageByPath("/resilience")?.indexable);
    assert.ok(getAiFirstPageByPath("/h2o-rwa")?.indexable);
    assert.ok(getAiFirstPageByPath("/demos/data-center-100mw")?.indexable);
  });

  it("owns H2O RWA and playbook intents", () => {
    const ids = CATEGORY_INTENTS.map((i) => i.id);
    assert.ok(ids.includes("g9b"));
    assert.ok(ids.includes("g9c"));
    assert.ok(ids.includes("g9d"));
  });
});
