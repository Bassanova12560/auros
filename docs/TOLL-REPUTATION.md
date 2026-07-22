# Toll Reality Reputation System v0

**Surface :** `/green/toll/reputation` · `GET|POST /api/v1/toll/reputation`

Operational reputation for issuers — data reliability, proof quality, incident responsiveness, document hygiene, correction stability. Ranking can lightly bias Search when `boostReputation` is set. Issuers improve the AUROS signal by enriching DNA, proofs, provenance, and attested sources (paid Toll credits).

## Product rules

- **Indicative** score — **not** a credit rating / certification / investment advice. HITL.
- Reuses Trust Score, Proof Stream, Provenance Ledger, Source Attestation.
- Metering: GET = **policy** credits · POST = **research** credits (Bearer).

## Dimensions (0–100)

| Dimension | Signals |
|-----------|---------|
| `dataReliability` | Trust blend, provenance density, attested sources, jurisdiction, market/registry links (cash-flow proxy) |
| `proofQuality` | Proof stream depth, content hashes, certified events, action variety |
| `incidentDiscipline` | Ops freshness, compliance review date, response-like events, market rejects |
| `documentHygiene` | Doc count, sealed hashes, expired docs |
| `correctionStability` | 30d correction cadence — healthy updates vs churn |

**Overall** weighted blend → band `low` / `medium` / `high`. `drivers[]` explain the score.

## Lib (`lib/toll/reputation.ts`)

```ts
computeRealityReputation({
  dna,
  events?,
  provenanceCount?,
  sourceCount?,
  nowIso?,
}) → { overall, dimensions, band, drivers, disclaimer }
```

## HTTP

- **GET** `?assetDnaId=` — resolve DNA + signals, compute (policy)
- **POST** `{ assetDnaId, provenanceCount?, sourceCount? }` — same; optional count overrides for issuer sims (research)

## Search bias (optional)

`searchAurosAssets({ q, limit, boostReputation?: true })` — light secondary sort on DNA hits only. Default **off** (tests unchanged).

## Related

`AUROS-CASH-MACHINE-TOP20.md` #20 · Control Tower · Trust Score · Provenance · Sources.
