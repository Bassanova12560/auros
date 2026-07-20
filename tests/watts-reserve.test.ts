import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("watts-reserve", () => {
  it("matches firm profile with carbon and zone", async () => {
    const { matchWattProfile } = await import("../lib/watts/match");
    const start = new Date("2026-07-20T18:00:00.000Z");
    const end = new Date("2026-07-20T22:00:00.000Z");
    const result = matchWattProfile({
      window: { start: start.toISOString(), end: end.toISOString() },
      energy_kwh: 20,
      zone: { country: "FR", zone_id: "FR-IDF" },
      carbon_intensity_max_gco2_kwh: 50,
      firmness: "firm",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.suggested_unit_kind, "e");
    assert.ok(result.match_score >= 80);
    assert.ok(result.reasons.some((r) => r.code === "valid_window"));
    assert.ok(result.reasons.some((r) => r.code === "carbon_cap"));
  });

  it("suggests CFU-F for flex capacity", async () => {
    const { matchWattProfile } = await import("../lib/watts/match");
    const result = matchWattProfile({
      window: {
        start: "2026-07-20T10:00:00.000Z",
        end: "2026-07-20T13:00:00.000Z",
      },
      capacity_kw: 5,
      zone: { country: "DE" },
      firmness: "flex",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.suggested_unit_kind, "f");
    assert.ok(result.reasons.some((r) => r.code === "unknown_carbon"));
  });

  it("rejects inverted window", async () => {
    const { matchWattProfile } = await import("../lib/watts/match");
    const result = matchWattProfile({
      window: {
        start: "2026-07-20T22:00:00.000Z",
        end: "2026-07-20T18:00:00.000Z",
      },
      energy_kwh: 10,
      zone: { country: "FR" },
      firmness: "firm",
    });
    assert.equal(result.ok, false);
  });

  it("stores reservation intent in memory fallback", async () => {
    const { matchWattProfile } = await import("../lib/watts/match");
    const { insertWattReservation, getWattReservation } = await import(
      "../lib/watts/store"
    );
    const profile = {
      window: {
        start: "2026-07-21T08:00:00.000Z",
        end: "2026-07-21T12:00:00.000Z",
      },
      energy_kwh: 12,
      zone: { country: "FR" },
      carbon_intensity_max_gco2_kwh: 40,
      firmness: "firm" as const,
    };
    const matched = matchWattProfile(profile);
    assert.ok(matched.ok);
    if (!matched.ok) return;
    const row = await insertWattReservation({
      key_hash: "test-key",
      profile,
      match_score: matched.match_score,
      match_reasons: matched.reasons,
      suggested_unit_kind: matched.suggested_unit_kind,
    });
    assert.equal(row.status, "pending_confirm");
    const fetched = await getWattReservation(row.id);
    assert.ok(fetched);
    assert.equal(fetched?.id, row.id);
  });

  it("validates schema firmness rules", async () => {
    const { wattReserveRequestSchema } = await import("../lib/watts/types");
    const bad = wattReserveRequestSchema.safeParse({
      window: {
        start: "2026-07-20T10:00:00.000Z",
        end: "2026-07-20T12:00:00.000Z",
      },
      zone: { country: "FR" },
      firmness: "flex",
    });
    assert.equal(bad.success, false);

    const ok = wattReserveRequestSchema.safeParse({
      window: {
        start: "2026-07-20T10:00:00.000Z",
        end: "2026-07-20T12:00:00.000Z",
      },
      capacity_kw: 3,
      zone: { country: "FR" },
      firmness: "flex",
    });
    assert.equal(ok.success, true);
  });

  it("confirm mints CFU-E linked to reservation_id", async () => {
    if (!process.env.ATTEST_SIGNING_KEY && !process.env.CRON_SECRET) {
      process.env.ATTEST_SIGNING_KEY = "test-watts-reserve-signing-key-v1";
    }
    const { matchWattProfile } = await import("../lib/watts/match");
    const { insertWattReservation } = await import("../lib/watts/store");
    const { confirmWattReservation } = await import("../lib/watts/confirm");

    const profile = {
      window: {
        start: "2026-07-22T08:00:00.000Z",
        end: "2026-07-22T12:00:00.000Z",
      },
      energy_kwh: 15,
      zone: { country: "FR", zone_id: "FR-IDF" },
      carbon_intensity_max_gco2_kwh: 45,
      firmness: "firm" as const,
    };
    const matched = matchWattProfile(profile);
    assert.ok(matched.ok);
    if (!matched.ok) return;

    const row = await insertWattReservation({
      key_hash: "test-watts-confirm",
      profile,
      match_score: matched.match_score,
      match_reasons: matched.reasons,
      suggested_unit_kind: matched.suggested_unit_kind,
    });

    const result = await confirmWattReservation({
      reservation: row,
      keyHash: "test-watts-confirm",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.reservation.status, "confirmed");
    assert.ok(result.reservation.cfu_unit_id);
    assert.equal(result.unit.unit_kind, "e");
    assert.ok(result.unit.verify_url);

    const again = await confirmWattReservation({
      reservation: result.reservation,
      keyHash: "test-watts-confirm",
    });
    assert.equal(again.ok, false);
    if (again.ok) return;
    assert.equal(again.status, 409);
  });

  it("confirm mints CFU-F for flex profile", async () => {
    if (!process.env.ATTEST_SIGNING_KEY && !process.env.CRON_SECRET) {
      process.env.ATTEST_SIGNING_KEY = "test-watts-reserve-signing-key-v1";
    }
    const { matchWattProfile } = await import("../lib/watts/match");
    const { insertWattReservation } = await import("../lib/watts/store");
    const { confirmWattReservation } = await import("../lib/watts/confirm");

    const profile = {
      window: {
        start: "2026-07-22T14:00:00.000Z",
        end: "2026-07-22T18:00:00.000Z",
      },
      capacity_kw: 8,
      zone: { country: "DE" },
      firmness: "flex" as const,
    };
    const matched = matchWattProfile(profile);
    assert.ok(matched.ok);
    if (!matched.ok) return;
    assert.equal(matched.suggested_unit_kind, "f");

    const row = await insertWattReservation({
      key_hash: "test-watts-confirm-f",
      profile,
      match_score: matched.match_score,
      match_reasons: matched.reasons,
      suggested_unit_kind: matched.suggested_unit_kind,
    });

    const result = await confirmWattReservation({
      reservation: row,
      keyHash: "test-watts-confirm-f",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.unit.unit_kind, "f");
    assert.equal(result.reservation.status, "confirmed");
  });
});
