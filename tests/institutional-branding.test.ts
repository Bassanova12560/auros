import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  embedIframeSnippet,
  isSafeBrandHex,
  listInstitutionalBrands,
  normalizePartnerId,
  resolveInstitutionalBrand,
} from "@/lib/green/institutional-branding";
import {
  listSsoTenants,
  resolveSsoTenant,
  SSO_RUNBOOK_STEPS,
} from "@/lib/green/institutional-sso";
import {
  AIRGAP_PACK_VERSION,
  buildPortfolioAirgapPack,
} from "@/lib/green/portfolio-airgap";
import type { GreenPortfolioSnapshot } from "@/lib/green/portfolio-types";

describe("institutional-branding", () => {
  it("validates hex and resolves demo partner", () => {
    assert.equal(isSafeBrandHex("#0B3D2E"), true);
    assert.equal(isSafeBrandHex("red"), false);
    assert.equal(normalizePartnerId("Acme Bank!"), "acmebank");
    const demo = resolveInstitutionalBrand("demo", listInstitutionalBrands(""));
    assert.ok(demo);
    assert.equal(demo!.partnerId, "demo");
    assert.match(
      embedIframeSnippet({
        origin: "https://getauros.com",
        partnerId: "demo",
      }),
      /embed\/portfolio\?partner=demo/
    );
  });

  it("parses brands JSON from env shape", () => {
    const brands = listInstitutionalBrands(
      JSON.stringify([
        {
          partnerId: "acme",
          companyName: "Acme",
          primaryColor: "#112233",
          hideAurosBranding: true,
        },
      ])
    );
    assert.equal(brands.length, 1);
    assert.equal(brands[0]!.hideAurosBranding, true);
  });
});

describe("institutional-sso", () => {
  it("has runbook and parses tenants", () => {
    assert.ok(SSO_RUNBOOK_STEPS.length >= 5);
    const tenants = listSsoTenants(
      JSON.stringify([
        {
          tenantId: "acme",
          displayName: "Acme",
          idpProtocol: "saml",
          status: "live",
          domains: ["acme.bank"],
        },
      ])
    );
    assert.equal(tenants.length, 1);
    assert.equal(resolveSsoTenant("acme", tenants)?.status, "live");
  });
});

describe("portfolio-airgap", () => {
  it("builds stable hashed pack", () => {
    const snap: GreenPortfolioSnapshot = {
      generatedAt: "2026-07-22T00:00:00.000Z",
      totalDna: 1,
      withRecentEvents: 0,
      bySource: { registry: 0, market: 1, dnaOnly: 0 },
      byLastAction: {},
      assets: [
        {
          assetDnaId: "auros:dna:v1:ge:test",
          displayName: "Test",
          assetClass: "green_energy",
          country: "FR",
          source: "market",
          eventCount: 0,
          recentEvents: [],
        },
      ],
      alerts: [],
      alertCount: 0,
    };
    const a = buildPortfolioAirgapPack(snap);
    const b = buildPortfolioAirgapPack(snap);
    assert.equal(a.version, AIRGAP_PACK_VERSION);
    assert.equal(a.contentHash, b.contentHash);
    assert.equal(a.contentHash.length, 64);
    assert.equal(a.assets.length, 1);
  });
});
