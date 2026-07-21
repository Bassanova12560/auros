import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { computeGreenHubImpact } from "../lib/green/hub-impact";
import type { GreenRegistrySnapshot } from "../lib/green/green-registry";

describe("green/hub-impact", () => {
  it("returns zeros when registry is empty (no fake demo MWh)", () => {
    const registry: GreenRegistrySnapshot = {
      available: false,
      projects: [],
      experts: [],
    };
    const impact = computeGreenHubImpact(registry);
    assert.equal(impact.fromRegistry, false);
    assert.equal(impact.carbonSavedTco2, 0);
    assert.equal(impact.mwhTraced, 0);
  });

  it("aggregates from registry case count", () => {
    const registry: GreenRegistrySnapshot = {
      available: true,
      projects: [
        {
          id: "a",
          name: "Test",
          projectType: "solar",
          country: "FR",
          labelTier: "verified",
          certifiedAt: "2026-01-01",
          verifyToken: "t1",
          summaries: { fr: "x", en: "x", es: "x" },
        },
      ],
      experts: [],
    };
    const impact = computeGreenHubImpact(registry);
    assert.equal(impact.fromRegistry, true);
    assert.equal(impact.registryCaseCount, 1);
    assert.ok(impact.mwhTraced > 0);
    assert.ok(impact.carbonSavedTco2 > 0);
  });
});
