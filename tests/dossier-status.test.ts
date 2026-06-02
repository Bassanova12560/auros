import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isSubmittedOrBeyond, normalizeDossierStatus } from "../lib/dossier-status";
import { runLocalSimulationChecks, summarizeChecks } from "../lib/simulation/run-checks";
import { isUuid } from "../lib/validation";

describe("dossier-status", () => {
  it("normalizes unknown to draft", () => {
    assert.equal(normalizeDossierStatus("bogus"), "draft");
  });

  it("detects submitted pipeline", () => {
    assert.equal(isSubmittedOrBeyond("submitted"), true);
    assert.equal(isSubmittedOrBeyond("draft"), false);
  });
});

describe("validation", () => {
  it("validates uuid", () => {
    assert.equal(isUuid("550e8400-e29b-41d4-a716-446655440000"), true);
  });
});

describe("simulation", () => {
  it("local checks pass", () => {
    const checks = runLocalSimulationChecks();
    const s = summarizeChecks(checks);
    assert.equal(s.ok, true);
  });
});
