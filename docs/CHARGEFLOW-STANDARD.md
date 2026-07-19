# AUROS ChargeFlow Standard (CFU-E / CFU-W / CFU-F v0.2)

**Status:** public draft · institutional RWA prep  
**Live units:** CFU-E (kWh), CFU-W (m³), CFU-F (kW window)  
**Not in scope (later):** ZK selective disclosure, on-chain ERC-1155, official Tesla/Total partnership claims.

**Partner connectors:** `GET /api/v1/chargeflow/partners` · `POST …/partners/sync` (sandbox fixtures or live credentials) — Tesla Fleet / TotalEnergies OCPI / generic OCPI format-compatible.

**npm:** publish after `npm login` — `npm run protocol:publish-sdk` and `cd packages/auros-mcp && npm publish --access public`.

## Units

| Unit | Quantity | ID | HMAC | Pitch |
|------|----------|-----|------|-------|
| **CFU-E** | energy kWh | `cfu_e_*` | `auros-cfu-e:v1:` | `/green/chargeflow` |
| **CFU-W** | volume m³ | `cfu_w_*` | `auros-cfu-w:v1:` | `/eau/chargeflow` |
| **CFU-F** | capacity kW window | `cfu_f_*` | `auros-cfu-f:v1:` | `/green/chargeflow/flex` |

Commercial ICP flottes/CPO : `/green/chargeflow/fleets` (format-compatible Supercharger-class / CPO — no official partnership claims).  
Offline OCPI/CSV stub : `POST /api/v1/chargeflow/from-ocpi`.  
Partner sync : `POST /api/v1/chargeflow/partners/sync` (sandbox + live-ready).

## Lifecycle

- Mint Premium · uniqueness on active `(kind, key, operator_key, external_ref)` · retire without re-signing
- List `GET /api/v1/chargeflow` · batch `POST …/batch` (E/W/F, max 50) · console `/green/chargeflow/console`
- Webhooks : `chargeflow.unit.minted` / `chargeflow.unit.retired` (Premium, same API key)
- Verify UI `/chargeflow/{id}` · OpenAPI `/auros-openapi.yaml`
- SDK : `@adrien1212balitrand/auros-protocol` (`createChargeflowE/W/F`, `listChargeflow`, `*Batch`, `createChargeflowFromOcpi`, `retireChargeflow`, …)

## Disclaimer

Indicative off-chain registration. Not a security, certificate of origin, water title, or capacity-market product.
