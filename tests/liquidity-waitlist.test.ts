import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  isLiquidityWaitlistRole,
  normalizeLiquidityWaitlistEmail,
  normalizeOptionalText,
  parseLiquidityWaitlistInput,
} from "@/lib/liquidity/waitlist";

describe("liquidity waitlist helpers", () => {
  it("normalizes and validates email", () => {
    assert.equal(normalizeLiquidityWaitlistEmail("  A@B.C  "), "a@b.c");
    assert.equal(normalizeLiquidityWaitlistEmail("not-an-email"), null);
    assert.equal(normalizeLiquidityWaitlistEmail(""), null);
    assert.equal(normalizeLiquidityWaitlistEmail(null), null);
    assert.equal(normalizeLiquidityWaitlistEmail("a".repeat(252) + "@b.c"), null);
  });

  it("recognizes roles", () => {
    assert.equal(isLiquidityWaitlistRole("issuer"), true);
    assert.equal(isLiquidityWaitlistRole("mm"), true);
    assert.equal(isLiquidityWaitlistRole("platform"), true);
    assert.equal(isLiquidityWaitlistRole("other"), true);
    assert.equal(isLiquidityWaitlistRole("broker"), false);
    assert.equal(isLiquidityWaitlistRole(""), false);
  });

  it("trims optional text", () => {
    assert.equal(normalizeOptionalText("  hello  ", 10), "hello");
    assert.equal(normalizeOptionalText("   ", 10), undefined);
    assert.equal(normalizeOptionalText(12, 10), undefined);
    assert.equal(normalizeOptionalText("abcdefghijKLM", 10), "abcdefghij");
  });

  it("parses a valid body", () => {
    const parsed = parseLiquidityWaitlistInput({
      email: " Ops@Example.com ",
      role: "platform",
      chain: "  ethereum  ",
      message: " small volumes ",
    });
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.deepEqual(parsed.data, {
      email: "ops@example.com",
      role: "platform",
      chain: "ethereum",
      message: "small volumes",
    });
  });

  it("rejects invalid email / role / body", () => {
    assert.equal(parseLiquidityWaitlistInput(null).ok, false);
    assert.equal(
      parseLiquidityWaitlistInput({ email: "x", role: "issuer" }).ok,
      false
    );
    const badRole = parseLiquidityWaitlistInput({
      email: "a@b.c",
      role: "broker",
    });
    assert.equal(badRole.ok, false);
    if (badRole.ok) return;
    assert.equal(badRole.error, "invalid_role");
  });
});
