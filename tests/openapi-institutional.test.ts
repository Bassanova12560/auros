import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("auros-openapi institutional pack", () => {
  const yaml = readFileSync(
    join(process.cwd(), "public", "auros-openapi.yaml"),
    "utf8"
  );

  it("documents Watts and CFU export paths", () => {
    assert.match(yaml, /\/api\/v1\/watts\/reserve:/);
    assert.match(yaml, /\/api\/v1\/watts\/offers:/);
    assert.match(yaml, /\/api\/v1\/watts\/secondary:/);
    assert.match(yaml, /\/api\/v1\/chargeflow\/export:/);
    assert.match(yaml, /generation_source/);
    assert.match(yaml, /low_carbon_power/);
  });
});
