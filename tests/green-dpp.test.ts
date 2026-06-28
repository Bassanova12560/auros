import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { buildDppBridgeDocument } from "@/lib/green/dpp-bridge";
import { getGreenDppCopy } from "@/lib/green/dpp-i18n";
import { GREEN_DPP_ROUTE } from "@/lib/green/constants";
import { GREEN_HEALTH_PATHS } from "@/lib/green/green-health";

describe("green/dpp-bridge", () => {
  it("builds JSON-LD for known catalog id moss", () => {
    const doc = buildDppBridgeDocument("moss");
    assert.ok(doc);
    assert.equal(doc!.identifier, "moss");
    assert.ok(doc!.sustainabilityInformation.aurosGreenComposite >= 0);
    assert.ok(doc!["@type"].includes("Product"));
  });

  it("returns null for unknown id", () => {
    assert.equal(buildDppBridgeDocument("unknown-xyz"), null);
  });
});

describe("green/dpp-i18n", () => {
  for (const locale of ["fr", "en", "es"] as const) {
    it(`provides DPP page copy for ${locale}`, () => {
      const copy = getGreenDppCopy(locale);
      assert.ok(copy.title.length > 0);
      assert.equal(copy.features.length, 3);
    });
  }
});

describe("green/dpp/page", () => {
  it("registers route and interactive lookup", () => {
    assert.equal(GREEN_DPP_ROUTE, "/green/dpp");
    assert.ok(GREEN_HEALTH_PATHS.includes("/green/dpp"));
    const page = readFileSync("app/green/dpp/page.tsx", "utf8");
    assert.ok(page.includes("GreenDppView"));
    const ui = readFileSync("app/green/dpp/_components/DppBridgeLookup.tsx", "utf8");
    assert.ok(ui.includes("/api/green/dpp/"));
  });
});
