import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { mintAssetDna } from "@/lib/asset-dna";
import { listProofStreamEvents } from "@/lib/proof-stream";
import {
  CERTIFIED_EVENT_KINDS,
  EVENT_CERTIFICATION_DISCLAIMER,
  certifyBillableLifecycleEvent,
  certifyLifecycleEvent,
  isCertifiedEventKind,
  listCertifiedLifecycleEvents,
} from "@/lib/toll/event-certification";
import { grantTollCredits } from "@/lib/toll/metering";

describe("toll-event-certification", () => {
  it("exposes certified kinds and validates them", () => {
    assert.ok(CERTIFIED_EVENT_KINDS.includes("maintenance"));
    assert.ok(CERTIFIED_EVENT_KINDS.includes("coupon_paid"));
    assert.ok(isCertifiedEventKind("downtime"));
    assert.equal(isCertifiedEventKind("not_a_kind"), false);
  });

  it("rejects invalid Asset DNA ids", () => {
    const bad = certifyLifecycleEvent({
      assetDnaId: "not-a-dna",
      kind: "maintenance",
    });
    assert.equal(bad.ok, false);
    if (bad.ok) return;
    assert.equal(bad.error, "invalid_id");
  });

  it("certifies a lifecycle event onto the Proof Stream", async () => {
    const dna = await mintAssetDna({
      assetClass: "green_energy",
      displayName: "Event Cert Pilot",
      jurisdiction: { country: "FR" },
      origin: { siteName: "Cert Site", spvName: "Cert SPV" },
      documents: [
        { role: "deed", title: "Title", issuedAt: "2026-01-01" },
      ],
      compliance: { listingTier: "referenced", labelTier: "pilot" },
      seedKey: `event-cert-${Date.now()}`,
    });

    const result = certifyLifecycleEvent({
      assetDnaId: dna.id,
      kind: "maintenance",
      occurredAt: "2026-07-01T12:00:00.000Z",
      actor: "ops@issuer.test",
      payload: { ticket: "MNT-1" },
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;

    const c = result.certification;
    assert.ok(c.eventId.startsWith("ps_"));
    assert.equal(c.kind, "maintenance");
    assert.equal(c.assetDnaId, dna.id);
    assert.ok(c.digest && c.digest.length === 64);
    assert.equal(c.disclaimer, EVENT_CERTIFICATION_DISCLAIMER);
    assert.match(c.disclaimer, /indicative/i);
    assert.match(c.disclaimer, /not a legal attestation/i);

    const stream = listProofStreamEvents(dna.id, 20);
    assert.ok(stream.some((e) => e.action === "event.certified"));
    const row = stream.find((e) => e.id === c.eventId);
    assert.ok(row);
    assert.equal(row!.meta?.kind, "maintenance");
    assert.equal(row!.meta?.layer, "event_certification");
    assert.equal(row!.meta?.indicative, true);

    const listed = listCertifiedLifecycleEvents(dna.id, 10);
    assert.equal(listed.ok, true);
    if (!listed.ok) return;
    assert.ok(listed.events.some((e) => e.eventId === c.eventId));
  });

  it("bills via lifecycle event credits when subject provided", async () => {
    const dna = await mintAssetDna({
      assetClass: "energy_infra",
      displayName: "Billable Cert",
      jurisdiction: { country: "DE" },
      origin: { siteName: "Bill Site", spvName: "Bill SPV" },
      documents: [
        { role: "deed", title: "Title", issuedAt: "2026-02-01" },
      ],
      compliance: { listingTier: "referenced", labelTier: "pilot" },
      seedKey: `event-cert-bill-${Date.now()}`,
    });

    const subjectId = `test:event-cert:${Date.now()}`;
    grantTollCredits({ subjectId, events: 3 });

    const billed = await certifyBillableLifecycleEvent({
      subject: { id: subjectId, tier: "free" },
      assetDnaId: dna.id,
      kind: "coupon_paid",
      payload: { amount: 100 },
    });
    assert.equal(billed.ok, true);
    if (!billed.ok) return;
    assert.equal(billed.certification.kind, "coupon_paid");
    assert.ok(typeof billed.meterRemaining === "number");
  });
});
