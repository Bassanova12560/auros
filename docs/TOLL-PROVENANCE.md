# Toll Data Provenance Ledger v0

**Surface :** `/green/toll/provenance` · `GET|POST /api/v1/toll/provenance`

Answer for auditors + AI citation: *where did this datapoint come from, who changed it, raw vs derived?*

## Product rules

- **Indicative** ledger — not an oracle / notarial replacement. HITL.
- File store `.data/toll-provenance.json` (cap ~2000 rows).
- Optional `attestationSourceId` links to Source Attestation Network (`/api/v1/toll/sources`).

## Record

| Field | Notes |
|-------|--------|
| `id` | `prov_…` |
| `assetDnaId` | Asset scope |
| `fieldKey` | e.g. `capacity_mwh` |
| `valueSummary` | Short citation text |
| `originSystem` | erp / sensor / manual / … |
| `actor?` | Who wrote it |
| `version` | Auto-increment per asset+field |
| `transformedFrom?` | Parent record id → **derived**; absent → **raw** |
| `createdAt` | ISO |
| `attestationSourceId?` | Optional `src_…` |

## Lib APIs (`lib/toll/provenance.ts`)

- `appendProvenanceRecord(…)`
- `listProvenanceForAsset(assetDnaId)`
- `getProvenanceChain(fieldKey, assetDnaId)` — latest → raw via `transformedFrom`

## HTTP

- **POST** — Bearer + **research** credits — append
- **GET** `?assetDnaId=` — list (policy credits)
- **GET** `?assetDnaId=&fieldKey=` — chain with `kind: raw|derived`

## Related

`AUROS-CASH-MACHINE-TOP20.md` #15 · Control Tower · Source Attestation.
