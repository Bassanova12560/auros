# AUROS Watts Reserve

**Status:** étape 3 · intent → confirm → settle/retire  
**Positioning:** AUROS réserve, prouve et tokenize les watts critiques.  
**Routes:** `/green/chargeflow/reserve` (demo UI)  
**API:**
- `POST /api/v1/watts/reserve` (Premium) · `POST …/demo`
- `GET /api/v1/watts/reserve/:id`
- `POST /api/v1/watts/reserve/:id/confirm` (Premium) · `POST …/demo/confirm`
- `POST /api/v1/watts/reserve/:id/settle` (Premium) · `POST …/demo/settle`

## Flow

1. Buyer submits an energy **profile** → `pending_confirm` + `match_score`
2. Explicit **confirm** → mint CFU-E (firm) or CFU-F (flex) with `attributes.reservation_id`
3. Explicit **settle** on delivery → retire linked CFU · status `settled`

## Profile

- hourly window (`start` / `end`)
- `energy_kwh` (firm) **or** `capacity_kw` (flex)
- zone (`country`, optional `zone_id`)
- optional `carbon_intensity_max_gco2_kwh`
- `firmness`: `firm` | `flex`

## Settle body (optional fields)

- `delivery_ref` — session / meter / ops reference
- `delivered_at` — ISO timestamp (defaults to now)
- `energy_kwh_delivered` / `capacity_kw_delivered`
- `reason` — free-text note (included in CFU retire reason)

## Matching (deterministic)

Base 50 + valid window (+20) + country (+10) + zone_id (+5) + carbon cap (+10) + targets (+5 each). Cap 100. Invalid windows are rejected.

## Guardrails

- No auto-mint / auto-retire — confirm and settle are explicit POSTs
- Not a GO/REC legal certificate or grid delivery guarantee
- No Tesla/Total partnership claims
- Premium auth on production; demo is rate-limited

## Roadmap

| Step | Deliverable |
|------|-------------|
| 1 | Intent + match score |
| 2 | Confirm → mint CFU linked to `reservation_id` |
| 3 | Settle / retire on delivery (this doc) |
| 4 | Producer capacity inventory |
| 5 | Secondary + RWA |

## Example (demo)

```bash
# 1) Intent
curl -X POST https://getauros.com/api/v1/watts/reserve/demo \
  -H "Content-Type: application/json" \
  -d '{
    "window": { "start": "2026-07-20T18:00:00.000Z", "end": "2026-07-20T22:00:00.000Z" },
    "energy_kwh": 20,
    "zone": { "country": "FR", "zone_id": "FR-IDF" },
    "carbon_intensity_max_gco2_kwh": 50,
    "firmness": "firm"
  }'

# 2) Confirm → mint CFU
curl -X POST https://getauros.com/api/v1/watts/reserve/demo/confirm \
  -H "Content-Type: application/json" \
  -d '{ "reservation_id": "<uuid from step 1>" }'

# 3) Settle → retire CFU
curl -X POST https://getauros.com/api/v1/watts/reserve/demo/settle \
  -H "Content-Type: application/json" \
  -d '{
    "reservation_id": "<uuid from step 1>",
    "delivery_ref": "sess_fleet_42",
    "energy_kwh_delivered": 19.4,
    "reason": "Session completed"
  }'
```
