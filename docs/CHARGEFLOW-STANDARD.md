# AUROS ChargeFlow Standard (CFU-E / CFU-W / CFU-F v0.2)

**Status:** public draft · institutional RWA prep  
**Live units:** CFU-E (kWh), CFU-W (m³), CFU-F (kW window)  
**Not in scope:** on-chain mint, Tesla API, live OCPI/SCADA

## Units

| Unit | Quantity | ID | HMAC | Pitch |
|------|----------|-----|------|-------|
| **CFU-E** | energy kWh | `cfu_e_*` | `auros-cfu-e:v1:` | `/green/chargeflow` |
| **CFU-W** | volume m³ | `cfu_w_*` | `auros-cfu-w:v1:` | `/eau/chargeflow` |
| **CFU-F** | capacity kW window | `cfu_f_*` | `auros-cfu-f:v1:` | `/green/chargeflow/flex` |

Commercial ICP flottes/CPO : `/green/chargeflow/fleets` (no Tesla partnership claims).

## Lifecycle

- Mint Premium · uniqueness on active `(kind, key, operator_key, external_ref)` · retire without re-signing
- List `GET /api/v1/chargeflow` · batch `POST …/batch` (E/W/F, max 50) · console `/green/chargeflow/console`
- Webhooks : `chargeflow.unit.minted` / `chargeflow.unit.retired` (Premium, same API key)
- Verify UI `/chargeflow/{id}` · OpenAPI `/auros-openapi.yaml`
- SDK : `@adrien1212balitrand/auros-protocol` (`createChargeflowE/W/F`, `listChargeflow`, `*Batch`, `retireChargeflow`, …)

## Disclaimer

Indicative off-chain registration. Not a security, certificate of origin, water title, or capacity-market product.
