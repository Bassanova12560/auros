# AUROS Watts Reserve

**Status:** étape 4 · inventaire capacité producteur  
**Positioning:** AUROS réserve, prouve et tokenize les watts critiques.  
**Routes:**
- `/green/chargeflow/reserve` — buyer flow
- `/green/chargeflow/inventory` — producer inventory

**API:**
- `POST/GET /api/v1/watts/reserve` · confirm · settle (+ `/demo*`)
- `POST/GET /api/v1/watts/offers` (Premium) · `GET/POST …/demo`
- `POST /api/v1/watts/offers/match` · `…/demo/match`
- `POST /api/v1/watts/offers/:id/withdraw`

## Flow

1. Buyer **profile** → `pending_confirm` + `match_score`
2. Explicit **confirm** → mint CFU-E/F with `attributes.reservation_id`
3. Explicit **settle** on delivery → retire CFU · `settled`
4. Producer **lists capacity windows** → open inventory; buyers can rank matches

## Capacity offer

- window (`start` / `end`, ≤ 7 days)
- `capacity_kw` (flex) **or** `energy_kwh` (firm)
- zone (`country`, optional `zone_id`)
- optional `carbon_intensity_gco2_kwh`, `label`, `producer_ref`
- status: `open` | `withdrawn`

## Offer matching (deterministic)

Buyer profile × open offers: base 40 + window overlap + country/zone + firmness + carbon + volume cover. No auto-reserve.

## Guardrails

- No auto-mint / auto-retire / auto-reserve from inventory
- Offers are indicative inventory — not binding PPAs / GO/REC
- No Tesla/Total partnership claims
- Premium auth on production; demo rate-limited

## Roadmap

| Step | Deliverable |
|------|-------------|
| 1 | Intent + match score |
| 2 | Confirm → mint CFU |
| 3 | Settle / retire on delivery |
| 4 | Producer capacity inventory (this doc) |
| 5 | Secondary + RWA |

## Example (demo)

```bash
# Publish capacity
curl -X POST https://getauros.com/api/v1/watts/offers/demo \
  -H "Content-Type: application/json" \
  -d '{
    "window": { "start": "2026-07-20T18:00:00.000Z", "end": "2026-07-20T22:00:00.000Z" },
    "capacity_kw": 50,
    "zone": { "country": "FR", "zone_id": "FR-IDF" },
    "carbon_intensity_gco2_kwh": 35,
    "firmness": "flex",
    "label": "Flex soir IDF"
  }'

# Match buyer profile against open inventory
curl -X POST https://getauros.com/api/v1/watts/offers/demo/match \
  -H "Content-Type: application/json" \
  -d '{
    "window": { "start": "2026-07-20T18:00:00.000Z", "end": "2026-07-20T21:00:00.000Z" },
    "capacity_kw": 20,
    "zone": { "country": "FR" },
    "carbon_intensity_max_gco2_kwh": 50,
    "firmness": "flex"
  }'
```
