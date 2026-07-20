import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  SHIELD_VERSION,
  buildCbom,
  sealLocal,
  verifyLocal,
} from "../lib/shield";

describe("AUROS Shield underlayer", () => {
  it("seals and verifies with local key", () => {
    const key = "test-shield-secret-do-not-use-in-prod";
    const seal = sealLocal(
      {
        kind: "audit",
        payload: JSON.stringify({ dossier: "demo", kwh: 12 }),
        profile: "hybrid_pqc_ready_v1",
        tenant_ref: "bank_demo",
      },
      key
    );
    assert.equal(seal.shield_version, SHIELD_VERSION);
    assert.equal(seal.classical.alg, "HMAC-SHA256");
    assert.equal(seal.pqc.status, "not_configured");
    const ok = verifyLocal(
      {
        kind: "audit",
        content_hash: seal.content_hash,
        signature: seal.signature,
        profile: "hybrid_pqc_ready_v1",
      },
      key
    );
    assert.equal(ok.valid, true);
    assert.equal(ok.classical_ok, true);
  });

  it("rejects wrong signature", () => {
    const key = "test-shield-secret-do-not-use-in-prod";
    const seal = sealLocal({ kind: "cfu_e", payload: "sess", content_hash: undefined }, key);
    const bad = verifyLocal(
      {
        kind: "cfu_e",
        content_hash: seal.content_hash,
        signature: "a".repeat(64),
      },
      key
    );
    assert.equal(bad.valid, false);
  });

  it("exports CBOM with PQC migration notes", () => {
    const cbom = buildCbom("on_prem");
    assert.ok(cbom.algorithms.some((a) => a.id === "HMAC-SHA256"));
    assert.ok(cbom.algorithms.some((a) => a.id === "ML-DSA-65"));
    assert.equal(cbom.migration.next_profile, "hybrid_pqc_ready_v1");
  });
});
