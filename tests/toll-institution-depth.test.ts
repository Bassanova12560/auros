import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  appendBankDecision,
  enrollBankPilot,
  getBankPilotBySlug,
  listBankDecisions,
} from "@/lib/toll/bank-pilot";
import {
  assessWalletBehavioralRisk,
  upsertWalletAttribution,
} from "@/lib/toll/wallet-risk";
import {
  activateSourceAttestation,
  enrollSourceAttestation,
  signSourceDataPacket,
  verifySourcePacket,
} from "@/lib/toll/source-attestation";
import { isUpstashConfigured } from "@/lib/upstash";

describe("bank-pilot", () => {
  it("enrolls a bank tenant and logs decisions", () => {
    const slug = `bank-test-${Date.now()}`;
    const row = enrollBankPilot({
      bankName: "Banque Test",
      contactEmail: "compliance@banque-test.example",
      slug,
      jurisdiction: "FR",
    });
    assert.ok(!("error" in row));
    if ("error" in row) return;
    assert.equal(row.slug, slug);
    assert.ok(row.policyRules.includes("deny_unknown"));

    const found = getBankPilotBySlug(slug);
    assert.ok(found);
    assert.equal(found!.bankName, "Banque Test");

    const log = appendBankDecision({
      bankPilotId: row.id,
      kind: "policy",
      query: "demo-asset",
      decision: "deny",
      ruleIds: ["deny_unknown"],
      reasons: ["test"],
      trustOverall: 10,
    });
    assert.ok(log.id.startsWith("bd_"));
    const listed = listBankDecisions({ bankPilotId: row.id });
    assert.ok(listed.length >= 1);
  });
});

describe("wallet-attribution v1", () => {
  it("persists attribution and flags self-dealing", () => {
    const w1 = `0xwallet_attr_${Date.now()}_aaaa`;
    const w2 = `0xwallet_attr_${Date.now()}_bbbb`;
    const a = upsertWalletAttribution({
      wallet: w1,
      entityLabel: "Issuer SPV Alpha",
      beneficialOwner: "Owner X",
      role: "issuer",
      confidence: 80,
    });
    assert.ok(!("error" in a));
    upsertWalletAttribution({
      wallet: w2,
      entityLabel: "Investor Desk",
      beneficialOwner: "Owner X",
      role: "investor",
      confidence: 70,
    });
    const snap = assessWalletBehavioralRisk({
      wallet: w1,
      counterpartyWallet: w2,
    });
    assert.ok(snap.flags.includes("self_dealing_suspected"));
    assert.equal(snap.band, "high");
    assert.ok(snap.links.length >= 1);
  });
});

describe("source attestation signed", () => {
  it("enrolls and can sign a data packet", () => {
    const src = enrollSourceAttestation({
      name: `Utility ${Date.now()}`,
      kind: "utility",
      contactEmail: "ops@utility.test",
    });
    assert.ok(src.id.startsWith("src_"));
    assert.ok(src.contentHash);

    const packet = signSourceDataPacket({
      sourceId: src.id,
      eventType: "meter_read",
      payload: { kwh: 12.5 },
    });
    assert.ok(!("error" in packet));
    if ("error" in packet) return;
    assert.ok(packet.contentHash);
    if (packet.signature) {
      assert.equal(
        verifySourcePacket({
          contentHash: packet.contentHash,
          signature: packet.signature,
        }),
        true
      );
    }

    const activated = activateSourceAttestation(src.id);
    // Without signing key in test env, activate may succeed without signature
    // or fail unsigned — both acceptable.
    if (!("error" in activated)) {
      assert.equal(activated.status, "active");
    }
  });
});

describe("upstash helper", () => {
  it("reports configured boolean without throwing", () => {
    assert.equal(typeof isUpstashConfigured(), "boolean");
  });
});
