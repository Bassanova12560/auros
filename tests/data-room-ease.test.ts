import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { computeDataRoomEase } from "../lib/data-room-ease";

describe("data-room-ease", () => {
  it("returns at most 3 priorities by weight", () => {
    const s = computeDataRoomEase([], "fr");
    assert.equal(s.priorities.length, 3);
    assert.equal(s.priorities[0]?.id, "proof_of_ownership");
    assert.equal(s.priorities[1]?.id, "valuation_report");
  });

  it("marks complete tone when most docs held", () => {
    const all = [
      "proof_of_ownership",
      "valuation_report",
      "due_diligence_report",
      "spv_documents",
      "legal_opinion",
      "tax_memo",
      "whitepaper",
      "tokenomics",
      "smart_contract_audit",
      "prospectus",
      "risk_disclosure",
      "kyc_aml_policy",
      "custody_audit_agreements",
      "financial_reporting_plan",
      "insurance_guarantees",
    ];
    const s = computeDataRoomEase(all, "en");
    assert.equal(s.tone, "complete");
    assert.equal(s.priorities.length, 0);
    assert.equal(s.percent, 100);
  });
});
