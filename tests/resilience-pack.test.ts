import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { computeWelhrFromText } from "@/lib/eau/water-legal-risk";
import { compassModeFromParam, COMPASS_MODES } from "@/lib/resilience/compass";
import { DC_100MW_AUROS_STEPS } from "@/lib/resilience/dc-100mw-demo";
import {
  buildContinuityPlaybook,
  continuityPlaybookMarkdown,
} from "@/lib/wets/continuity-playbook";

describe("continuity playbook", () => {
  it("builds three scenarios from WELHR", () => {
    const welhr = computeWelhrFromText({
      text: "AI data center Michigan moratorium cooling",
      region: "Michigan",
      asset_hint: "data_center",
    });
    const pb = buildContinuityPlaybook({
      project_label: "Test",
      region: "Michigan",
      mw_it: 100,
      cooling: "tower",
      welhr,
    });
    assert.equal(pb.scenarios.length, 3);
    assert.ok(pb.executive_summary.includes("100"));
    const md = continuityPlaybookMarkdown(pb);
    assert.ok(md.includes("Playbook continuité"));
  });
});

describe("compass", () => {
  it("each mode has exactly 3 tiles", () => {
    for (const m of Object.values(COMPASS_MODES)) {
      assert.equal(m.tiles.length, 3, m.id);
    }
  });

  it("defaults unknown mode to water", () => {
    assert.equal(compassModeFromParam("nope"), "water");
    assert.equal(compassModeFromParam("budget"), "budget");
  });
});

describe("dc 100mw demo", () => {
  it("story has three AUROS steps", () => {
    assert.equal(DC_100MW_AUROS_STEPS.length, 3);
  });
});

describe("roi simulator", () => {
  it("returns savings for 100MW closed loop", async () => {
    const { simulateSustainableRoi } = await import("@/lib/resilience/roi-simulator");
    const r = simulateSustainableRoi({
      mw_it: 100,
      stress: "medium",
      water_eur_per_m3: 2,
      target_closed_loop: true,
    });
    assert.ok(r.pct_water_reduction > 50);
    assert.ok(r.savings_m3_year > 0);
  });
});

describe("resilience brief", () => {
  it("builds brief with 3 priorities max", async () => {
    const { computeWelhrFromText } = await import("@/lib/eau/water-legal-risk");
    const { buildResilienceBrief } = await import("@/lib/resilience/resilience-brief");
    const welhr = computeWelhrFromText({
      text: "data center Michigan moratorium",
      region: "Michigan",
      asset_hint: "data_center",
    });
    const b = buildResilienceBrief(welhr);
    assert.ok(b.priorities.length <= 3);
    assert.ok(b.resilience_score >= 0 && b.resilience_score <= 100);
  });
});
