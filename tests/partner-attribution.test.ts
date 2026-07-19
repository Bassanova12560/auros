import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildPartnerWizardUrl,
  capturePartnerFromSearchParams,
  normalizePartnerCode,
  suggestPartnerCode,
} from "@/lib/partner-attribution";
import { summarizePartnerReferrals } from "@/lib/partners/referral-report";

describe("partner-attribution", () => {
  it("normalizes partner codes to uppercase alphanumeric", () => {
    assert.equal(normalizePartnerCode("cab-notaire-paris"), "CAB-NOTAIRE-PARIS");
    assert.equal(normalizePartnerCode("  foo_bar  "), "FOO_BAR");
    assert.equal(normalizePartnerCode("a"), null);
    assert.equal(normalizePartnerCode(""), null);
    assert.equal(normalizePartnerCode("x@#!"), null);
  });

  it("captures partner from search params", () => {
    const params = new URLSearchParams("partner=cab-lux");
    assert.equal(capturePartnerFromSearchParams(params), "CAB-LUX");
    assert.equal(
      capturePartnerFromSearchParams(new URLSearchParams("partner=x")),
      null
    );
  });

  it("builds wizard URL with partner query", () => {
    const url = buildPartnerWizardUrl("CAB-LUX", "https://getauros.com");
    assert.equal(url, "https://getauros.com/wizard?partner=CAB-LUX");
  });

  it("suggests code from company name", () => {
    assert.equal(suggestPartnerCode("Cab Notaire Paris"), "CAB-NOTAIRE-PARIS");
    assert.equal(suggestPartnerCode("!!"), "PARTNER");
    assert.ok((suggestPartnerCode("A".repeat(80))?.length ?? 0) <= 32);
  });
});

describe("partner stats summary", () => {
  it("aggregates leads and dossiers by code", () => {
    const summary = summarizePartnerReferrals([
      {
        recordType: "lead",
        id: "1",
        partnerCode: "CAB",
        email: "a@b.c",
        assetType: null,
        score: 70,
        status: null,
        source: "wizard",
        createdAt: "2026-07-01T00:00:00.000Z",
      },
      {
        recordType: "dossier",
        id: "2",
        partnerCode: "CAB",
        email: null,
        assetType: "real_estate",
        score: 72,
        status: "draft",
        source: null,
        createdAt: "2026-07-02T00:00:00.000Z",
      },
    ]);
    assert.equal(summary.length, 1);
    assert.equal(summary[0].partnerCode, "CAB");
    assert.equal(summary[0].leads, 1);
    assert.equal(summary[0].dossiers, 1);
    assert.equal(summary[0].total, 2);
  });
});
