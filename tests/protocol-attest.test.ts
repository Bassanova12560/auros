import assert from "node:assert/strict";
import { describe, it, before } from "node:test";

import {
  attestationContentSha256,
  buildAttestCanonical,
  isAttestContentHash,
  signAttestHash,
  stableStringify,
  verifyAttestSignature,
} from "../lib/protocol/attest";
import { generateDossierPayload } from "../lib/protocol/dossier/generate";

describe("protocol attest signing", () => {
  before(() => {
    if (!process.env.ATTEST_SIGNING_KEY && !process.env.CRON_SECRET) {
      process.env.ATTEST_SIGNING_KEY = "test-attest-signing-key-v1";
    }
  });

  it("signs and verifies content hash", () => {
    const hash = "a".repeat(64);
    const sig = signAttestHash(hash);
    assert.ok(sig);
    assert.equal(sig!.length, 64);
    assert.equal(verifyAttestSignature(hash, sig!), true);
    assert.equal(verifyAttestSignature(hash, "b".repeat(64)), false);
  });

  it("rejects malformed hashes", () => {
    assert.equal(isAttestContentHash("short"), false);
    assert.equal(signAttestHash("not-a-hash"), null);
  });

  it("stableStringify sorts object keys", () => {
    assert.equal(
      stableStringify({ b: 1, a: 2 }),
      '{"a":2,"b":1}'
    );
  });
});

describe("protocol attest canonical", () => {
  before(() => {
    if (!process.env.ATTEST_SIGNING_KEY && !process.env.CRON_SECRET) {
      process.env.ATTEST_SIGNING_KEY = "test-attest-signing-key-v1";
    }
  });

  it("produces stable sha256 for same dossier", async () => {
    const dossier = await generateDossierPayload("test_key_hash", {
      score: {
        description: "Entrepôt retail Luxembourg €2.5M SPV investisseurs professionnels",
        asset_type: "real_estate",
      },
      format: "json",
      locale: "fr",
      sections: ["executive_summary", "score_breakdown", "disclaimers"],
    });

    const hash1 = attestationContentSha256(dossier);
    const hash2 = attestationContentSha256(dossier);
    assert.equal(hash1, hash2);
    assert.equal(isAttestContentHash(hash1), true);

    const canonical = buildAttestCanonical(dossier);
    assert.equal(canonical.v, 1);
    assert.equal(canonical.dossier_id, dossier.id);
    assert.ok(typeof canonical.score === "number");

    const sig = signAttestHash(hash1);
    assert.ok(sig);
    assert.equal(verifyAttestSignature(hash1, sig!), true);
  });
});
