import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  tradeEngine,
  type MarketId,
} from "../lib/arl/trade-engine.ts";

/** Fresh market ids via forced marks on unused keys — engine is singleton; use unique flow. */
describe("lib/arl trade-engine", () => {
  it("opens closes perps and blocks bad leverage", () => {
    const id = "kwh-france" as MarketId;
    try {
      tradeEngine.closePerp(id);
    } catch {
      /* none */
    }
    tradeEngine.setMarkForced(id, 0.12);
    const opened = tradeEngine.openPerp({
      marketId: id,
      side: "long",
      margin: 1000,
      leverage: 5,
    });
    assert.equal(opened.fee, 5);
    tradeEngine.setMarkPrice(id, 0.126);
    const closed = tradeEngine.closePerp(id);
    assert.ok(closed.pnl > 0);
    assert.throws(() =>
      tradeEngine.openPerp({ marketId: id, side: "long", margin: 10, leverage: 11 }),
    );
  });

  it("spot and options guards", () => {
    const id = "flop" as MarketId;
    tradeEngine.setMarkForced(id, 1.25);
    const spot = tradeEngine.executeSpot({ marketId: id, side: "buy", amount: 10 });
    assert.ok(spot.fee > 0);
    assert.throws(() => tradeEngine.executeSpot({ marketId: id, side: "buy", amount: -1 }));

    const written = tradeEngine.writeOption({
      kind: "call",
      strike: 1.2,
      expiry: Math.floor(Date.now() / 1000) + 86400,
      premium: 20,
      margin: 200,
      size: 100,
      seller: "s1",
    });
    assert.throws(() => tradeEngine.buyOption(written.id, "s1"));
    const bought = tradeEngine.buyOption(written.id, "b1");
    assert.ok(bought.fee > 0);
  });

  it("circuit-breaker on mark", () => {
    const id = "kwh-texas" as MarketId;
    tradeEngine.setMarkForced(id, 0.08);
    assert.throws(() => tradeEngine.setMarkPrice(id, 0.2));
  });
});
