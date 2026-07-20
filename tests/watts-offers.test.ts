import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("watts-offers", () => {
  it("stores and lists capacity offers", async () => {
    const { insertWattCapacityOffer, listWattCapacityOffers } = await import(
      "../lib/watts/offers-store"
    );
    const created = await insertWattCapacityOffer({
      key_hash: "test-offers",
      request: {
        window: {
          start: "2026-07-24T16:00:00.000Z",
          end: "2026-07-24T20:00:00.000Z",
        },
        capacity_kw: 40,
        zone: { country: "FR", zone_id: "FR-IDF" },
        carbon_intensity_gco2_kwh: 30,
        firmness: "flex",
        label: "Test flex IDF",
        producer_ref: "prod_test",
      },
    });
    assert.ok(!("error" in created));
    if ("error" in created) return;
    assert.equal(created.status, "open");

    const listed = await listWattCapacityOffers({
      status: "open",
      country: "FR",
      key_hash: "test-offers",
    });
    assert.ok(listed.some((o) => o.id === created.id));
  });

  it("ranks overlapping offers higher", async () => {
    const { insertWattCapacityOffer } = await import(
      "../lib/watts/offers-store"
    );
    const { rankOffersForProfile } = await import("../lib/watts/match-offer");

    const good = await insertWattCapacityOffer({
      key_hash: "test-rank",
      request: {
        window: {
          start: "2026-07-25T18:00:00.000Z",
          end: "2026-07-25T22:00:00.000Z",
        },
        capacity_kw: 50,
        zone: { country: "FR", zone_id: "FR-IDF" },
        carbon_intensity_gco2_kwh: 25,
        firmness: "flex",
        label: "Good overlap",
      },
    });
    assert.ok(!("error" in good));
    if ("error" in good) return;

    const far = await insertWattCapacityOffer({
      key_hash: "test-rank",
      request: {
        window: {
          start: "2026-07-26T10:00:00.000Z",
          end: "2026-07-26T12:00:00.000Z",
        },
        capacity_kw: 50,
        zone: { country: "DE" },
        firmness: "flex",
        label: "No overlap",
      },
    });
    assert.ok(!("error" in far));
    if ("error" in far) return;

    const ranked = rankOffersForProfile(
      {
        window: {
          start: "2026-07-25T18:00:00.000Z",
          end: "2026-07-25T21:00:00.000Z",
        },
        capacity_kw: 20,
        zone: { country: "FR", zone_id: "FR-IDF" },
        carbon_intensity_max_gco2_kwh: 50,
        firmness: "flex",
      },
      [good, far],
      10
    );

    assert.ok(ranked.length >= 1);
    assert.equal(ranked[0]?.offer.id, good.id);
    assert.ok((ranked[0]?.match_score ?? 0) >= 70);
    assert.ok(!ranked.some((r) => r.offer.id === far.id));
  });

  it("withdraws an open offer", async () => {
    const {
      insertWattCapacityOffer,
      withdrawWattCapacityOffer,
    } = await import("../lib/watts/offers-store");
    const created = await insertWattCapacityOffer({
      key_hash: "test-withdraw",
      request: {
        window: {
          start: "2026-07-27T08:00:00.000Z",
          end: "2026-07-27T10:00:00.000Z",
        },
        energy_kwh: 100,
        zone: { country: "FR" },
        firmness: "firm",
      },
    });
    assert.ok(!("error" in created));
    if ("error" in created) return;

    const withdrawn = await withdrawWattCapacityOffer({
      id: created.id,
      keyHash: "test-withdraw",
    });
    assert.ok(!("error" in withdrawn));
    if ("error" in withdrawn) return;
    assert.equal(withdrawn.status, "withdrawn");
  });

  it("validates flex requires capacity_kw", async () => {
    const { wattCapacityOfferRequestSchema } = await import(
      "../lib/watts/types"
    );
    const bad = wattCapacityOfferRequestSchema.safeParse({
      window: {
        start: "2026-07-20T10:00:00.000Z",
        end: "2026-07-20T12:00:00.000Z",
      },
      zone: { country: "FR" },
      firmness: "flex",
    });
    assert.equal(bad.success, false);
  });
});
