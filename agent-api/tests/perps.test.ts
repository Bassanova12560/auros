import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  closePerp,
  getPerpMarket,
  openPerp,
  setMarkPrice,
  setMarkPriceForced,
} from "../src/perps.ts";

describe("perps mock engine", () => {
  it("opens and closes a long with protocol fee", () => {
    const indexId = `kwh-france-${Date.now()}`;
    setMarkPriceForced(indexId, 0.12);
    const opened = openPerp({
      indexId,
      agentId: "agent-1",
      side: "long",
      margin: 1000,
      leverage: 5,
    });
    assert.equal(opened.fee, 5); // 0.1% of 5000
    setMarkPrice(indexId, 0.132);
    const closed = closePerp(indexId, "agent-1");
    assert.ok(closed.pnl > 0);
    assert.ok(closed.protocolFees >= 10); // open + close fees
    assert.equal(getPerpMarket(indexId).openPositions, 0);
  });

  it("rejects leverage > 10", () => {
    assert.throws(() =>
      openPerp({
        indexId: `lev-${Date.now()}`,
        agentId: "a",
        side: "short",
        margin: 10,
        leverage: 11,
      }),
    );
  });

  it("rejects non-positive margin and circuit-breaker jumps", () => {
    const indexId = `cb-${Date.now()}`;
    setMarkPriceForced(indexId, 0.12);
    assert.throws(() =>
      openPerp({ indexId, agentId: "x", side: "long", margin: 0, leverage: 2 }),
    );
    assert.throws(() => setMarkPrice(indexId, 0.3)); // >50%
  });

  it("rejects second open for same agent", () => {
    const indexId = `dup-${Date.now()}`;
    setMarkPriceForced(indexId, 0.1);
    openPerp({ indexId, agentId: "same", side: "long", margin: 100, leverage: 2 });
    assert.throws(() =>
      openPerp({ indexId, agentId: "same", side: "short", margin: 50, leverage: 2 }),
    );
  });
});
