import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  CONTINUITY_DISCLAIMER,
  CONTINUITY_PLAYBOOKS,
  CONTINUITY_SCENARIO_KINDS,
  assessContinuityReadiness,
  enrollContinuityPlan,
  getContinuityPlaybook,
  isContinuityScenarioKind,
  listContinuityPlans,
  normalizeOptionalText,
  parseAssessContinuityInput,
  parseEnrollContinuityInput,
} from "@/lib/toll/continuity";

describe("toll continuity helpers", () => {
  it("recognizes scenario kinds + playbook templates", () => {
    assert.equal(isContinuityScenarioKind("source_outage"), true);
    assert.equal(isContinuityScenarioKind("operator_loss"), true);
    assert.equal(isContinuityScenarioKind("wallet_compromise"), true);
    assert.equal(isContinuityScenarioKind("servicer_change"), true);
    assert.equal(isContinuityScenarioKind("vendor_death"), true);
    assert.equal(isContinuityScenarioKind("broker"), false);
    assert.equal(CONTINUITY_SCENARIO_KINDS.length, 5);

    for (const s of CONTINUITY_SCENARIO_KINDS) {
      const pb = getContinuityPlaybook(s);
      assert.equal(pb.scenario, s);
      assert.ok(pb.checklist.length >= 3);
      assert.equal(CONTINUITY_PLAYBOOKS[s].title, pb.title);
    }
  });

  it("trims optional text", () => {
    assert.equal(normalizeOptionalText("  hello  ", 10), "hello");
    assert.equal(normalizeOptionalText("   ", 10), undefined);
    assert.equal(normalizeOptionalText(12, 10), undefined);
  });

  it("parses enroll + assess bodies", () => {
    const enroll = parseEnrollContinuityInput({
      assetDnaId: "  auros:dna:v1:demo  ",
      scenario: "wallet_compromise",
      checklistDone: ["freeze_path", "bogus", "freeze_path", "notify_list"],
      contactEmail: "Ops@Institution.TEST",
      notes: " counsel ready ",
    });
    assert.equal(enroll.ok, true);
    if (!enroll.ok) return;
    assert.equal(enroll.data.assetDnaId, "auros:dna:v1:demo");
    assert.equal(enroll.data.scenario, "wallet_compromise");
    assert.deepEqual(enroll.data.checklistDone, [
      "freeze_path",
      "notify_list",
    ]);
    assert.equal(enroll.data.contactEmail, "ops@institution.test");

    assert.equal(parseEnrollContinuityInput(null).ok, false);
    assert.equal(
      parseEnrollContinuityInput({
        assetDnaId: "x",
        scenario: "nope",
      }).ok,
      false
    );

    const assess = parseAssessContinuityInput({
      assetDnaId: "auros:dna:v1:demo",
      scenarios: ["source_outage", "vendor_death"],
    });
    assert.equal(assess.ok, true);
    if (!assess.ok) return;
    assert.deepEqual(assess.data.scenarios, [
      "source_outage",
      "vendor_death",
    ]);

    assert.equal(
      parseAssessContinuityInput({
        assetDnaId: "x",
        scenarios: ["broker"],
      }).ok,
      false
    );
  });

  it("enrolls plans and scores readiness with gaps", () => {
    const assetDnaId = `auros:dna:v1:cont_${Date.now()}`;

    const empty = assessContinuityReadiness({ assetDnaId });
    assert.equal(empty.readinessScore, 0);
    assert.equal(empty.covered.length, 0);
    assert.equal(empty.gaps.length, 5);
    assert.equal(empty.disclaimer, CONTINUITY_DISCLAIMER);
    assert.ok(empty.gaps.every((g) => g.reason === "no_plan"));

    const fullChecklist = CONTINUITY_PLAYBOOKS.source_outage.checklist.map(
      (c) => c.id
    );
    const plan = enrollContinuityPlan({
      assetDnaId,
      scenario: "source_outage",
      checklistDone: fullChecklist,
      notes: "HITL template only",
    });
    assert.ok(plan.id.startsWith("cont_"));
    assert.equal(plan.status, "enrolled");
    assert.equal(plan.checklistDone.length, fullChecklist.length);

    const partial = enrollContinuityPlan({
      assetDnaId,
      scenario: "operator_loss",
      checklistDone: ["deputy"],
    });
    assert.equal(partial.checklistDone.length, 1);

    const listed = listContinuityPlans({ assetDnaId, limit: 10 });
    assert.ok(listed.length >= 2);

    const ready = assessContinuityReadiness({
      assetDnaId,
      scenarios: ["source_outage", "operator_loss", "vendor_death"],
    });
    assert.equal(ready.covered.length, 2);
    assert.ok(ready.covered.includes("source_outage"));
    assert.ok(ready.covered.includes("operator_loss"));
    assert.ok(ready.readinessScore > 0 && ready.readinessScore < 100);

    const sourceGap = ready.gaps.find((g) => g.scenario === "source_outage");
    assert.equal(sourceGap, undefined);

    const opGap = ready.gaps.find((g) => g.scenario === "operator_loss");
    assert.ok(opGap);
    assert.equal(opGap?.reason, "incomplete_checklist");
    assert.ok((opGap?.missingChecklist.length ?? 0) >= 1);

    const vendorGap = ready.gaps.find((g) => g.scenario === "vendor_death");
    assert.equal(vendorGap?.reason, "no_plan");
  });
});
