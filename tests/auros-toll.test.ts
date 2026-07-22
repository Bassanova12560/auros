import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { mintAssetDna } from "@/lib/asset-dna";
import { appendProofStreamEvent } from "@/lib/proof-stream";
import { hashKey } from "@/lib/protocol/auth/keys";
import {
  assessWalletBehavioralRisk,
  buildIndicativeRightsModel,
  computeAurosTrustScore,
  dispatchTollAgentTool,
  enrollSourceAttestation,
  evaluateTollPolicy,
  getAurosMetadataSchema,
  resolveAurosAsset,
  searchAurosAssets,
  grantTollCredits,
  getTollBonusCredits,
  transferTollCredits,
  resolveTollCreditSubject,
  TOLL_CREDIT_COST,
  TOLL_MONTHLY_INCLUDED,
} from "@/lib/toll";
import {
  TOLL_LOOKUP_PACK_CREDITS,
  TOLL_LOOKUP_PACK_PRODUCT,
  isTollCashProduct,
} from "@/lib/toll/lifecycle-pricing";
import { parseTollCheckoutMetadata } from "@/lib/stripe/toll-checkout";

describe("auros-toll", () => {
  it("exposes metadata schema", () => {
    const schema = getAurosMetadataSchema();
    assert.equal(schema.$id, "auros.rwa.asset.v0");
    assert.ok(schema.required.includes("id"));
  });

  it("flags unknown assets as elevated risk", async () => {
    const r = await resolveAurosAsset({ q: "definitely-not-an-asset-xyz" });
    assert.equal(r.resolved, false);
    assert.equal(r.risk, "unknown_asset");
    assert.ok(r.trust.overall < 20);
  });

  it("resolves minted DNA and scores trust", async () => {
    const dna = await mintAssetDna({
      assetClass: "green_energy",
      displayName: "Toll Pilot Solar",
      jurisdiction: { country: "FR" },
      origin: { siteName: "Pilot Site", spvName: "Pilot SPV" },
      documents: [
        {
          role: "deed",
          title: "Title",
          issuedAt: "2026-01-01",
        },
      ],
      compliance: { listingTier: "referenced", labelTier: "pilot" },
      seedKey: `toll-test-${Date.now()}`,
    });
    appendProofStreamEvent({
      assetDnaId: dna.id,
      action: "dna.minted",
    });

    const r = await resolveAurosAsset({ q: dna.id });
    assert.equal(r.resolved, true);
    if (!r.resolved) return;
    assert.equal(r.dna.displayName, "Toll Pilot Solar");
    assert.ok(r.trust.overall >= 40);

    const policy = evaluateTollPolicy({
      dna: r.dna,
      events: [],
    });
    assert.ok(["allow", "review", "deny"].includes(policy.decision));

    const trustUnknown = computeAurosTrustScore({ dna: null });
    assert.equal(trustUnknown.band, "low");
  });

  it("searches DNA by name", async () => {
    const result = await searchAurosAssets({ q: "Toll Pilot", limit: 10 });
    assert.ok(result.hits.length >= 1);
    assert.ok(result.hits.some((h) => h.kind === "dna"));
  });

  it("dispatches agent list_tools", async () => {
    const out = await dispatchTollAgentTool({ tool: "list_tools" });
    assert.equal(out.ok, true);
    if (!out.ok) return;
    const tools = (out.result as { tools: string[] }).tools;
    assert.ok(tools.includes("resolve_asset"));
  });

  it("meters credit costs and grants lookup packs", () => {
    assert.equal(TOLL_CREDIT_COST.resolve, 1);
    assert.equal(TOLL_CREDIT_COST.research, 5);
    assert.ok(TOLL_MONTHLY_INCLUDED.anonymous >= 100);
    const subject = `test:${Date.now()}`;
    grantTollCredits({ subjectId: subject, lookups: TOLL_LOOKUP_PACK_CREDITS });
    assert.equal(getTollBonusCredits(subject).lookups, TOLL_LOOKUP_PACK_CREDITS);
    assert.ok(isTollCashProduct(TOLL_LOOKUP_PACK_PRODUCT));
    const meta = parseTollCheckoutMetadata({
      product: TOLL_LOOKUP_PACK_PRODUCT,
      email: "Ops@Bank.com",
      locale: "fr",
      company: "Bank",
      credit_subject: "email:ops@bank.com",
    });
    assert.ok(meta);
    assert.equal(meta!.email, "ops@bank.com");
  });

  it("grants and transfers under key: credit subjects", () => {
    const keyHash = hashKey(`auros_pk_test_toll_${Date.now()}`);
    const keySubject = `key:${keyHash}`;
    grantTollCredits({
      subjectId: keySubject,
      lookups: 100,
      events: 5,
    });
    assert.equal(getTollBonusCredits(keySubject).lookups, 100);
    assert.equal(getTollBonusCredits(keySubject).events, 5);

    const emailSubject = `email:ops-toll-${Date.now()}@bank.com`;
    grantTollCredits({ subjectId: emailSubject, lookups: 50, events: 2 });
    const moved = transferTollCredits({
      fromSubjectId: emailSubject,
      toSubjectId: keySubject,
    });
    assert.equal(moved.ok, true);
    if (!moved.ok) return;
    assert.equal(moved.transferred.lookups, 50);
    assert.equal(getTollBonusCredits(emailSubject).lookups, 0);
    assert.equal(getTollBonusCredits(keySubject).lookups, 150);

    const metaKey = parseTollCheckoutMetadata({
      product: TOLL_LOOKUP_PACK_PRODUCT,
      email: "ops@bank.com",
      locale: "fr",
      company: "Bank",
      credit_subject: keySubject,
    });
    assert.ok(metaKey);
    assert.equal(metaKey!.creditSubject, keySubject);

    const resolved = resolveTollCreditSubject({
      email: "ops@bank.com",
      apiKey: "auros_pk_live_examplekeyfortest1234567890",
    });
    assert.equal(resolved.ok, true);
    if (!resolved.ok) return;
    assert.ok(resolved.subject.startsWith("key:"));
    assert.equal(
      resolved.subject,
      `key:${hashKey("auros_pk_live_examplekeyfortest1234567890")}`
    );
  });

  it("models rights, wallet risk, and source attestation v0", () => {
    const rights = buildIndicativeRightsModel({
      assetDnaId: "dna_test",
      displayName: "Solar",
      revenueSharePct: 15,
    });
    assert.equal(rights.slices[0]?.kind, "revenue_share");
    assert.equal(rights.slices[0]?.share, 0.15);

    const high = assessWalletBehavioralRisk({ wallet: "0xab" });
    assert.equal(high.band, "high");
    assert.ok(high.flags.includes("unattributed_wallet"));

    const mid = assessWalletBehavioralRisk({
      wallet: "0xabc1234567890def",
      entityLabel: "Issuer SPV",
      role: "issuer",
    });
    assert.equal(mid.band, "medium");
    assert.equal(mid.links.length, 1);

    const src = enrollSourceAttestation({
      name: "Utility feed",
      kind: "utility",
      contactEmail: "ops@utility.test",
    });
    assert.equal(src.status, "pending");
    assert.ok(src.id.startsWith("src_"));
  });
});
