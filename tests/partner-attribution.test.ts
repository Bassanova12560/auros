import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildPartnerPilotLinks,
  buildPartnerWizardUrl,
  capturePartnerFromSearchParams,
  normalizePartnerCode,
  suggestPartnerCode,
} from "@/lib/partner-attribution";
import { summarizePartnerReferrals } from "@/lib/partners/referral-report";
import {
  listPartnerPaidReferrals,
  recordPartnerPaidReferral,
} from "@/lib/partners/paid-referrals";

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

  it("builds pilot deep-links for green cash", () => {
    const links = buildPartnerPilotLinks("CAB-LUX", "https://getauros.com");
    assert.equal(links.length, 5);
    assert.ok(links.some((l) => l.href.includes("/green/fast-track?partner=CAB-LUX")));
    assert.ok(links.some((l) => l.href.includes("/data/licence?partner=CAB-LUX")));
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

describe("partner paid referrals", () => {
  it("records and lists green P1 paid attributions", () => {
    const sessionId = `cs_test_${Date.now()}`;
    const row = recordPartnerPaidReferral({
      partnerCode: "PILOT-A",
      product: "green_fast_track",
      email: "Buyer@Example.com",
      company: "Buyer Co",
      sessionId,
    });
    assert.ok(row);
    assert.equal(row!.partnerCode, "PILOT-A");
    assert.equal(row!.email, "buyer@example.com");
    const listed = listPartnerPaidReferrals("pilot-a");
    assert.ok(listed.some((r) => r.sessionId === sessionId));
    assert.equal(
      recordPartnerPaidReferral({
        partnerCode: "PILOT-A",
        product: "green_fast_track",
        email: "buyer@example.com",
        sessionId,
      })?.id,
      row!.id
    );
  });
});
