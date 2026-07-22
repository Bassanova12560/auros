import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { computeSupplierEsgScreen } from "@/lib/eau/supplier-esg-screen";
import { CONNECTOR_SPECS } from "@/lib/resilience/connectors";
import { RESOURCE_SIGNALS } from "@/lib/resilience/resource-signals";
import { buildGreenApiOpenApiSpec } from "@/lib/green/api/openapi";
import { VERTICAL_WELCOMES } from "@/lib/vertical-welcome/config";

describe("supplier esg screen", () => {
  it("penalizes absolute claims without URL", () => {
    const bad = computeSupplierEsgScreen({
      claim_text: "100% green cooling net-zero guaranteed CSRD ready",
      evidence_urls: [],
    });
    const good = computeSupplierEsgScreen({
      claim_text: "Cooling water reuse with ISO 14001 report",
      evidence_urls: ["https://example.com/esg-report.pdf"],
    });
    assert.ok(bad.score < good.score);
    assert.ok(bad.claim_flags.includes("no_evidence_url"));
  });
});

describe("next iteration surfaces", () => {
  it("has connectors and resource signals", () => {
    assert.ok(CONNECTOR_SPECS.length >= 4);
    assert.ok(RESOURCE_SIGNALS.length >= 3);
  });

  it("welcomes for suppliers and integrations", () => {
    assert.ok(VERTICAL_WELCOMES["/eau/suppliers"]);
    assert.ok(VERTICAL_WELCOMES["/integrations"]);
  });

  it("openapi 1.4 documents DNA portfolio paths", () => {
    const spec = buildGreenApiOpenApiSpec() as {
      info: { version: string };
      paths: Record<string, unknown>;
    };
    assert.equal(spec.info.version, "1.4.0");
    assert.ok(spec.paths["/api/green/eau/supplier-screen"]);
    assert.ok(spec.paths["/api/green/eau/resource-signals"]);
    assert.ok(spec.paths["/api/green/eau/connectors"]);
    assert.ok(spec.paths["/api/v1/asset-dna/{id}"]);
    assert.ok(spec.paths["/api/v1/asset-dna/{id}/stream"]);
    assert.ok(spec.paths["/api/v1/green/portfolio"]);
    assert.ok(spec.paths["/api/v1/green/portfolio/watchlist"]);
  });
});
