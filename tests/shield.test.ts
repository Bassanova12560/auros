import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  SHIELD_FREE_TAP_MONTHLY,
  SHIELD_VERSION,
  createCloudTapReceipt,
  sealLocal,
  shieldTapLimit,
  tapLocal,
  toPublicVerify,
  verifyCloudAnchor,
  verifyLocal,
  verifyLocalTap,
} from "../lib/shield";

describe("AUROS Shield freemium tap", () => {
  it("local tap discards payload semantics", () => {
    const key = "test-local-tap-key";
    const tap = tapLocal({ body: "secret-cfu-export-payload", signingKey: key });
    assert.equal(tap.payload_retained, false);
    assert.equal(tap.content_hash.length, 64);
    assert.ok(verifyLocalTap(tap.content_hash, tap.signature, key));
  });

  it("freemium limits", () => {
    assert.equal(shieldTapLimit("free"), SHIELD_FREE_TAP_MONTHLY);
    assert.ok(shieldTapLimit("premium") > SHIELD_FREE_TAP_MONTHLY);
  });

  it("cloud tap receipt is publicly verifiable when signing key set", () => {
    process.env.ATTEST_SIGNING_KEY = "test-cloud-anchor-key";
    const result = createCloudTapReceipt({
      body: "dossier-bytes",
      plan: "free",
      label: "demo",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.receipt.payload_retained, false);
    assert.equal(result.receipt.shield_version, SHIELD_VERSION);
    assert.ok(
      verifyCloudAnchor(
        result.receipt.content_hash,
        result.receipt.cloud_signature
      )
    );
    const pub = toPublicVerify(result.receipt);
    assert.equal(pub.valid, true);
  });

  it("classical seal still works", () => {
    const seal = sealLocal(
      { kind: "audit", payload: "x" },
      "test-local-tap-key"
    );
    assert.equal(
      verifyLocal(
        {
          kind: "audit",
          content_hash: seal.content_hash,
          signature: seal.signature,
        },
        "test-local-tap-key"
      ).valid,
      true
    );
  });

  it("evidence pack builds with empty portfolio", async () => {
    process.env.ATTEST_SIGNING_KEY = "test-cloud-anchor-key";
    const { buildEvidencePack } = await import("../lib/shield/evidence-pack");
    const result = await buildEvidencePack({
      keyHash: "test_key_hash_no_units",
      label: "demo pack",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.pack.payload_retained, false);
    assert.ok(result.pack.bank_actions.length >= 3);
    assert.equal(result.pack.pack_hash.length, 64);
  });
});
