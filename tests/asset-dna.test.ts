import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildAssetDnaId,
  createAssetDnaRecord,
  isValidAssetDnaId,
  parseAssetDnaId,
} from "@/lib/asset-dna";

describe("asset-dna", () => {
  it("builds and validates DNA ids", () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    const id = buildAssetDnaId("green_energy", uuid);
    assert.equal(id, `auros:dna:v1:ge:${uuid}`);
    assert.equal(isValidAssetDnaId(id), true);
    const parsed = parseAssetDnaId(id);
    assert.ok(parsed);
    assert.equal(parsed!.classShort, "ge");
  });

  it("creates a canonical record", () => {
    const record = createAssetDnaRecord({
      assetClass: "water_rights",
      displayName: "Basin pilot",
      jurisdiction: { country: "fr", region: "Occitanie" },
    });
    assert.equal(record.specVersion, "1.0.0");
    assert.equal(record.jurisdiction.country, "FR");
    assert.equal(isValidAssetDnaId(record.id), true);
    assert.ok(record.id.includes(":wr:"));
  });
});
