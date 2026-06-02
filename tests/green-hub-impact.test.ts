import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { computeGreenHubImpact, GREEN_HUB_IMPACT_DEMO } from "../lib/green/hub-impact";
import type { GreenRegistrySnapshot } from "../lib/green/green-registry";

describe("green/hub-impact", () => {
  it("uses demo figures when registry is empty", () => {
    const registry: GreenRegistrySnapshot = {
      available: false,
      projects: [],
      experts: [],
    };
    const impact = computeGreenHubImpact(registry);
    assert.equal(impact.fromRegistry, false);
    assert.equal(impact.carbonSavedTco2, GREEN_HUB_IMPACT_DEMO.carbonSavedTco2);
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
