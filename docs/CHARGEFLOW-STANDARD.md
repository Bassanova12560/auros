# AUROS ChargeFlow Standard (CFU-E / CFU-W v0.1)

**Status:** public draft · institutional RWA prep  
**Live units:** CFU-E (energy kWh), CFU-W (hydrological m³)  
**Not in scope:** on-chain mint (ERC-1155), Tesla API, live OCPI/OCPP/SCADA ingestion, CFU-F mint

## One-liner

AUROS ChargeFlow registers a **verifiable off-chain unit** for a charge session or water flow — machine-readable proof before any chain deployment.

AUROS does **not** claim meter custody, Tesla partnership, water-right title, or that a CFU is a security token.

## CFU-E (Energy)

| Field | Description |
|-------|-------------|
| `standard` | `AUROS-ChargeFlow-CFU-E` |
| `unit_id` | `cfu_e_<hex>` |
| `session.external_session_id` | Operator / CPO / fleet session id |
| `session.energy_kwh` | Delivered energy |
| HMAC prefix | `auros-cfu-e:v1:` |
| Companion | Watt Score (indicative) |

## CFU-W (Water)

| Field | Description |
|-------|-------------|
| `standard` | `AUROS-ChargeFlow-CFU-W` |
| `unit_id` | `cfu_w_<hex>` |
| `flow.external_flow_id` | Utility / concession flow id |
| `flow.volume_m3` | Volume |
| HMAC prefix | `auros-cfu-w:v1:` |
| Companion | H₂O Score (indicative) |

## Hashing

1. Canonical payload (sorted keys).
2. `content_hash = SHA-256(stableStringify(canonical))`.
3. `signature = HMAC-SHA256(secret, prefix + content_hash)`.

## Mint, uniqueness & retirement

- **Mint** : `POST /api/v1/chargeflow` (E) or `POST /api/v1/chargeflow/w` (W) — Protocol Premium.
- **Unicité active** : 409 si une unité `active` existe déjà pour `(unit_kind, key_hash, operator_key, external_ref)` — `operator_key = operator_id` ou, à défaut, `key_hash`.
- **Retirement** : `POST /api/v1/chargeflow/{id}/retire` — marque `status=retired` **sans** re-signer le hash de mint. Remint possible après retirement.
- Verify UI : `/chargeflow/{id}` (Active / Retired).

## Anti double-counting

- CFU units do **not** replace GO / REC / water titles.
- Watt / H₂O enrichment is **indicative AUROS scoring**, not certificate of origin.

## Roadmap

| Unit | Status |
|------|--------|
| **CFU-E** | live |
| **CFU-W** | live |
| **CFU-F** | documented only |

Proof-of-Flow Engine (ZK, twin anomalies, OPC UA/MQTT) — hooks only.

## API surfaces

- CFU-E: `/green/chargeflow` · `POST /api/v1/chargeflow`
- CFU-W: `/eau/chargeflow` · `POST /api/v1/chargeflow/w`
- OpenAPI: `/auros-openapi.yaml`

## Disclaimer

Indicative AUROS ChargeFlow registration. Not a legal opinion, regulatory approval, investment product, or partnership endorsement.
