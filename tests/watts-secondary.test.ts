import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("watts-secondary", () => {
  it("creates a standalone secondary listing with compare url", async () => {
    const { insertWattSecondaryListing } = await import(
      "../lib/watts/secondary-store"
    );
    const { wattSecondaryPublic } = await import("../lib/watts/secondary");

    const created = await insertWattSecondaryListing({
      key_hash: "test-secondary",
      request: {
        indicative_price_eur: 1500,
        energy_kwh: 80,
        zone: { country: "FR" },
        firmness: "firm",
        label: "Test secondary",
        compare_ref_id: "prod_demo_watts",
      },
    });
    assert.ok(!("error" in created));
    if ("error" in created) return;
    assert.equal(created.status, "open");

    const pub = wattSecondaryPublic(created);
    assert.equal(pub.compare_url, "/compare?ids=prod_demo_watts");
    assert.ok(pub.rwa_hint.includes("RWA"));
  });

  it("lists from settled reservation and accepts interest", async () => {
    if (!process.env.ATTEST_SIGNING_KEY && !process.env.CRON_SECRET) {
      process.env.ATTEST_SIGNING_KEY = "test-watts-secondary-signing-key-v1";
    }
    const { matchWattProfile } = await import("../lib/watts/match");
    const { insertWattReservation } = await import("../lib/watts/store");
    const { confirmWattReservation } = await import("../lib/watts/confirm");
    const { settleWattReservation } = await import("../lib/watts/settle");
    const {
      insertWattSecondaryListing,
      expressWattSecondaryInterest,
      withdrawWattSecondaryListing,
    } = await import("../lib/watts/secondary-store");

    const profile = {
      window: {
        start: "2026-07-28T10:00:00.000Z",
        end: "2026-07-28T14:00:00.000Z",
      },
      energy_kwh: 22,
      zone: { country: "FR" },
      firmness: "firm" as const,
    };
    const matched = matchWattProfile(profile);
    assert.ok(matched.ok);
    if (!matched.ok) return;

    const row = await insertWattReservation({
      key_hash: "test-sec-res",
      profile,
      match_score: matched.match_score,
      match_reasons: matched.reasons,
      suggested_unit_kind: matched.suggested_unit_kind,
    });
    const confirmed = await confirmWattReservation({
      reservation: row,
      keyHash: "test-sec-res",
    });
    assert.equal(confirmed.ok, true);
    if (!confirmed.ok) return;

    const settled = await settleWattReservation({
      reservation: confirmed.reservation,
      keyHash: "test-sec-res",
      settle: { reason: "demo settle for secondary" },
    });
    assert.equal(settled.ok, true);
    if (!settled.ok) return;

    const listing = await insertWattSecondaryListing({
      key_hash: "test-sec-res",
      request: {
        reservation_id: settled.reservation.id,
        indicative_price_eur: 900,
        label: "From reservation",
      },
    });
    assert.ok(!("error" in listing));
    if ("error" in listing) return;
    assert.equal(listing.reservation_id, settled.reservation.id);
    assert.ok(listing.cfu_unit_id);

    const interested = await expressWattSecondaryInterest({ id: listing.id });
    assert.ok(!("error" in interested));
    if ("error" in interested) return;
    assert.equal(interested.interest_count, 1);

    const withdrawn = await withdrawWattSecondaryListing({
      id: listing.id,
      keyHash: "test-sec-res",
    });
    assert.ok(!("error" in withdrawn));
    if ("error" in withdrawn) return;
    assert.equal(withdrawn.status, "withdrawn");
  });

  it("rejects secondary schema without zone when no reservation", async () => {
    const { wattSecondaryListingRequestSchema } = await import(
      "../lib/watts/types"
    );
    const bad = wattSecondaryListingRequestSchema.safeParse({
      indicative_price_eur: 100,
      energy_kwh: 10,
    });
    assert.equal(bad.success, false);
  });
});
