import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildPartnerWizardUrl,
  capturePartnerFromSearchParams,
  normalizePartnerCode,
} from "@/lib/partner-attribution";

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
    const url = buildPartnerWizardUrl("CAB-LUX", "https://auros-delta.vercel.app");
    assert.equal(url, "https://auros-delta.vercel.app/wizard?partner=CAB-LUX");
  });
});
