import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  agentIdSchema,
  consumeRateLimit,
  ethAddress,
  indexIdSchema,
  safeEqualString,
} from "../src/security.ts";

describe("agent-api security", () => {
  it("accepts valid eth addresses and rejects junk", () => {
    assert.ok(ethAddress.safeParse("0x70997970C51812dc3A010C7d01b50e0d17dc79C8").success);
    assert.equal(ethAddress.safeParse("0x123").success, false);
    assert.equal(ethAddress.safeParse("not-an-address").success, false);
  });

  it("rejects agent ids with injection characters", () => {
    assert.ok(agentIdSchema.safeParse("datacenter-paris-1").success);
    assert.equal(agentIdSchema.safeParse("bad\nid").success, false);
    assert.equal(agentIdSchema.safeParse("x".repeat(200)).success, false);
  });

  it("rejects path-like index ids", () => {
    assert.ok(indexIdSchema.safeParse("kwh-france").success);
    assert.equal(indexIdSchema.safeParse("../etc/passwd").success, false);
  });

  it("rate-limits after N hits", () => {
    const key = [`test-${Date.now()}`];
    for (let i = 0; i < 3; i++) {
      assert.equal(consumeRateLimit(key, 3, 60_000).ok, true);
    }
    assert.equal(consumeRateLimit(key, 3, 60_000).ok, false);
  });

  it("compares secrets in constant-ish time", () => {
    assert.equal(safeEqualString("abc", "abc"), true);
    assert.equal(safeEqualString("abc", "abd"), false);
    assert.equal(safeEqualString("a", "ab"), false);
  });
});
