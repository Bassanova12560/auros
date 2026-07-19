# AUROS ChargeFlow Standard (CFU-E v0)

**Status:** public draft · institutional RWA prep  
**Scope:** ChargeFlow Unit — Energy (CFU-E)  
**Not in scope (v0):** on-chain mint (ERC-1155), Tesla API, live OCPI/OCPP ingestion, CFU-F / CFU-W mint

## One-liner

AUROS ChargeFlow registers a **verifiable off-chain unit** for a charge session (kWh delivered + context). Platforms, fleets and financiers get a machine-readable proof before any chain deployment.

AUROS does **not** claim meter custody, Tesla partnership, or that a CFU-E is a security token.

## Why

Operators already have session logs. Finance and ESG need **granular, hashed, non-repudiable** flow units — not PDFs. ChargeFlow is the upstream standard that turns session JSON into a **Proof-of-Flow brick 0**.

## CFU-E (Energy Unit)

| Field | Description |
|-------|-------------|
| `standard` | `AUROS-ChargeFlow-CFU-E` |
| `unit_id` | `cfu_e_<hex>` |
| `session.external_session_id` | Operator / CPO / fleet session id |
| `session.energy_kwh` | Delivered energy |
| `session.started_at` / `ended_at` | ISO timestamps |
| `session.location` | Optional country, site_id, connector_id |
| `session.vehicle_ref` | Opaque id (no PII / no VIN plaintext) |
| `session.operator_id` | CPO / fleet code |
| `session.source_format` | `ocpi` \| `ocpp_summary` \| `csv` \| `json_custom` |
| `attributes.renewable_claim` | `none` \| `go` \| `rec` \| `ppa_matched` \| `unknown` |
| `auros.watt_*` | Indicative Watt Score companion (not meter truth) |

### Hashing

1. Build canonical payload (sorted keys, no key_hash / branding).
2. `content_hash = SHA-256(stableStringify(canonical))`.
3. `signature = HMAC-SHA256(secret, "auros-cfu-e:v1:" + content_hash)`.

Verify: `GET /api/v1/chargeflow/verify?id=cfu_e_…` or `?hash=&sig=`.

### Mint & retirement (off-chain)

- **Mint** = `POST /api/v1/chargeflow` (Protocol Premium) → register unit.
- **Retirement** (v0 semantic): once a CFU-E is cited in a financed product or ESG claim, mark `status=retired` in future API; do not re-use the same `external_session_id` + operator for a second active mint (v0: client responsibility; v1: server uniqueness).

### Anti double-counting

- CFU-E does **not** replace GO / REC / T-EAC certificates.
- If `renewable_claim` is set, disclose which instrument backs it; do not mint a second green claim for the same kWh without retirement rules.
- Watt enrichment is **indicative AUROS scoring**, not a certificate of origin.

## Roadmap units

| Unit | Meaning | Status |
|------|---------|--------|
| **CFU-E** | kWh charge session | **v0 live** |
| **CFU-F** | Flexibility (kW window) | Documented only |
| **CFU-W** | Hydrological m³ flow | Documented only (reuse H₂O Score) |

## Proof-of-Flow Engine (moat roadmap)

Not implemented in v0 — hooks for later:

1. **ZK selective disclosure** — prove energy/CO₂ thresholds without raw session dump.
2. **Digital twin + anomaly detection** — flag impossible kWh / duration before mint.
3. **Industrial connectors** — OPC UA / MQTT / OCPI feeders.

v0 mint + HMAC is brick 0 of that engine.

## API

- `POST /api/v1/chargeflow` — Premium
- `GET /api/v1/chargeflow/verify`
- `GET /api/v1/chargeflow/{id}`
- Public UI: `/green/chargeflow` · verify `/chargeflow/{id}`

## Disclaimer

Indicative AUROS ChargeFlow registration. Not a legal opinion, regulatory approval, investment product, or partnership endorsement of any CPO (including Tesla Supercharger-class networks).
