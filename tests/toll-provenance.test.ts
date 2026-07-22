import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  appendProvenanceRecord,
  getProvenanceChain,
  isDerivedProvenance,
  listProvenanceForAsset,
} from "@/lib/toll/provenance";

describe("toll-provenance", () => {
  it("appends raw then derived and walks the chain", () => {
    const assetDnaId = `dna_prov_test_${Date.now()}`;
    const fieldKey = "capacity_mwh";

    const raw = appendProvenanceRecord({
      assetDnaId,
      fieldKey,
      valueSummary: "12.4 from meter",
      originSystem: "sensor",
      actor: "ops@utility.test",
    });
    assert.ok(raw.id.startsWith("prov_"));
    assert.equal(raw.version, 1);
    assert.equal(isDerivedProvenance(raw), false);
    assert.equal(raw.transformedFrom, undefined);

    const derived = appendProvenanceRecord({
      assetDnaId,
      fieldKey,
      valueSummary: "12.4 normalized MWh",
      originSystem: "auros_normalize",
      actor: "system",
      transformedFrom: raw.id,
      attestationSourceId: "src_demo",
    });
    assert.equal(derived.version, 2);
    assert.equal(derived.transformedFrom, raw.id);
    assert.equal(isDerivedProvenance(derived), true);
    assert.equal(derived.attestationSourceId, "src_demo");

    const listed = listProvenanceForAsset(assetDnaId);
    assert.ok(listed.length >= 2);
    assert.ok(listed.every((r) => r.assetDnaId === assetDnaId));

    const chain = getProvenanceChain(fieldKey, assetDnaId);
    assert.equal(chain.length, 2);
    assert.equal(chain[0]?.id, derived.id);
    assert.equal(chain[1]?.id, raw.id);
    assert.equal(isDerivedProvenance(chain[0]!), true);
    assert.equal(isDerivedProvenance(chain[1]!), false);
  });

  it("ignores transformedFrom pointing at another asset", () => {
    const a = `dna_prov_a_${Date.now()}`;
    const b = `dna_prov_b_${Date.now()}`;
    const parent = appendProvenanceRecord({
      assetDnaId: a,
      fieldKey: "mrr",
      valueSummary: "100",
      originSystem: "erp",
    });
    const orphan = appendProvenanceRecord({
      assetDnaId: b,
      fieldKey: "mrr",
      valueSummary: "100 copy",
      originSystem: "manual",
      transformedFrom: parent.id,
    });
    assert.equal(orphan.transformedFrom, undefined);
    assert.equal(isDerivedProvenance(orphan), false);
  });
});
