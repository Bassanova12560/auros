# AUROS Watts Reserve

**Status:** hub produit + étapes 1–5 + SDK/MCP  
**Positioning:** AUROS réserve, prouve et tokenize les watts critiques.  
**Routes:**
- `/green/watts` — hub produit
- `/green/chargeflow/reserve` — buyer flow
- `/green/chargeflow/inventory` — producer inventory
- `/green/chargeflow/secondary` — secondary listings + RWA hook
- Docs Protocol : `/developers/docs/endpoint-watts-reserve`

**API:**
- Reserve · confirm · settle (+ `/demo*`)
- Offers · match · withdraw (+ `/demo*`)
- `POST/GET /api/v1/watts/secondary` · `…/:id/withdraw` · `…/:id/interest` · `/demo`

## Flow

1. Buyer **profile** → `pending_confirm` + `match_score`
2. Explicit **confirm** → mint CFU-E/F
3. Explicit **settle** → retire CFU
4. Producer **capacity inventory**
5. **Secondary listing** (indicative price) + optional `compare_ref_id` → `/compare`

## Secondary listing

- `indicative_price_eur` (required)
- optional `reservation_id` (confirmed/settled) — pulls CFU + profile
- or standalone `energy_kwh` / `capacity_kw` + `zone` (demo liquidity)
- optional `compare_ref_id` → `compare_url` for RWA prep
- `POST …/interest` — non-binding interest counter (no transfer)

## Guardrails

- No auto-mint / auto-retire / auto-reserve / auto-transfer
- Not a securities exchange, PPA, GO/REC, or investment advice
- No Tesla/Total partnership claims
- Premium auth on production; demo rate-limited

## Roadmap

| Step | Deliverable |
|------|-------------|
| 1–4 | Intent → confirm → settle → inventory |
| 5 | Secondary + RWA prep (this doc) |

## Example (demo)

```bash
curl -X POST https://getauros.com/api/v1/watts/secondary/demo \
  -H "Content-Type: application/json" \
  -d '{
    "indicative_price_eur": 1200,
    "energy_kwh": 100,
    "zone": { "country": "FR" },
    "firmness": "firm",
    "label": "Bundle demo",
    "compare_ref_id": "example-product-id"
  }'
```
