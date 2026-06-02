import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("jurisdictions/lead-persistence", () => {
  it("exports insert helper module", async () => {
    const mod = await import("../lib/jurisdictions/lead-persistence");
    assert.equal(typeof mod.insertJurisdictionLead, "function");
  });
});
