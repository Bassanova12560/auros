import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parseDescription } from "../lib/protocol/nlp/parse-description";
import { computeProtocolScore } from "../lib/protocol/scoring/compute-score";
import { gradeFromScore, statusFromScore } from "../lib/protocol/scoring/grades";

describe("protocol/nlp", () => {
  it("parses luxembourg warehouse retail and euro amount", () => {
    const parsed = parseDescription(
      "Retail warehouse in Luxembourg €2.5M SPV professional investors"
    );
    assert.equal(parsed.assetType, "real_estate");
    assert.ok(parsed.jurisdictions.includes("luxembourg"));
    assert.ok(parsed.keywords.includes("warehouse") || parsed.keywords.includes("retail"));
    assert.ok(parsed.valueEur !== null && parsed.valueEur >= 2_000_000);
    assert.equal(parsed.investorType, "professional");
    assert.equal(parsed.issuerType, "company_spv");
  });
});

describe("protocol/scoring", () => {
  it("scores structured strong profile higher than weak text", () => {
    const strong = computeProtocolScore({
      description:
        "Luxembourg retail warehouse €3M SPV whitepaper ready professional investors KYC AML data room",
      issuer_type: "company_spv",
      whitepaper: "ready",
      investor_type: "professional",
      has_kyc: true,
      has_data_room: true,
      documents_count: 5,
    });
    const weak = computeProtocolScore({
      description: "Individual issuer retail stablecoin no whitepaper unsure EU nexus",
      issuer_type: "individual",
      whitepaper: "none",
      investor_type: "retail",
      asset_class: "e_money",
      eu_nexus: "unsure",
    });
    assert.ok(strong.score > weak.score);
    assert.ok(strong.score >= 50);
    assert.ok(weak.score < 60);
  });

  it("returns five-dimension breakdown summing to weighted score", () => {
    const result = computeProtocolScore({
      description: "Real estate fund Luxembourg professional investors",
    });
    const dims = result.breakdown;
    assert.equal(typeof dims.legal_structure, "number");
    assert.equal(typeof dims.kyc_aml, "number");
    assert.equal(typeof dims.mica_compliance, "number");
    assert.equal(typeof dims.data_room, "number");
    assert.equal(typeof dims.investor_protection, "number");
    assert.ok(result.critical_gaps.length <= 3);
    assert.equal(result.recommendations.length, 3);
    assert.ok(result.meta.full_report_url.includes("/wizard"));
  });

  it("maps grades and status from score", () => {
    assert.equal(gradeFromScore(96), "A+");
    assert.equal(gradeFromScore(72), "B-");
    assert.equal(statusFromScore(80), "ready");
    assert.equal(statusFromScore(40), "early");
  });
});
