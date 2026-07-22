# Toll Event Certification — v0

**Surface :** `GET|POST /api/v1/toll/events` · `lib/toll/event-certification.ts`

Certify important lifecycle events as **queryable Proof Stream objects** (audit by query): maintenance, downtime, coupon paid, covenant breach, doc refresh, incident, other.

## Rules

- **Indicative only** — not a legal attestation; HITL for regulator packs.
- **No auto-badges.**
- Metered like Lifecycle Maintain: POST burns `lifecycle_event` credits via `appendBillableLifecycleEvent`.
- GET lists by `assetDnaId` (trail lookup credits).

## Example

```http
POST /api/v1/toll/events
Authorization: Bearer auros_pk_…
Content-Type: application/json

{
  "assetDnaId": "auros:dna:v1:ge:…",
  "kind": "maintenance",
  "occurredAt": "2026-07-22T10:00:00.000Z",
  "actor": "ops@issuer.test",
  "payload": { "ticket": "MNT-42" }
}
```

Response includes `eventId`, `certifiedAt`, `digest` (sha256), and `disclaimer`.

Voir `AUROS-CASH-MACHINE-TOP20.md` · Proof Stream · `/green/toll/tower`.
