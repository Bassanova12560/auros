# AUROS Watts Reserve

**Status:** étape 1 · reservation intents only  
**Positioning:** AUROS réserve, prouve et tokenize les watts critiques.  
**Routes:** `/green/chargeflow/reserve` (demo UI)  
**API:** `POST /api/v1/watts/reserve` (Premium) · `POST /api/v1/watts/reserve/demo` · `GET /api/v1/watts/reserve/:id`

## Step 1 — what it does

Buyer submits an energy **profile**:
- hourly window (`start` / `end`)
- `energy_kwh` (firm) **or** `capacity_kw` (flex)
- zone (`country`, optional `zone_id`)
- optional `carbon_intensity_max_gco2_kwh`
- `firmness`: `firm` | `flex`

AUROS returns:
- `reservation_id`
- `match_score` 0–100 + explicit `match_reasons`
- `status: pending_confirm`
- `suggested_unit_kind`: `e` (CFU-E) or `f` (CFU-F)

**No CFU is minted** in step 1.

## Matching (deterministic)

Base 50 + window window (+20) + country (+10) + zone_id (+5) + carbon cap (+10) + targets (+5 each). Cap 100. Invalid windows are rejected.

## Guardrails

- No auto-mint / auto-retire
- Not a GO/REC legal certificate or grid delivery guarantee
- No Tesla/Total partnership claims
- Premium auth on production reserve; demo is rate-limited

## Roadmap

| Step | Deliverable |
|------|-------------|
| 1 | Intent + match score (this doc) |
| 2 | Confirm → mint CFU linked to `reservation_id` |
| 3 | Settle / retire on delivery |
| 4 | Producer capacity inventory |
| 5 | Secondary + RWA |

## Example (demo)

```bash
curl -X POST https://getauros.com/api/v1/watts/reserve/demo \
  -H "Content-Type: application/json" \
  -d '{
    "window": { "start": "2026-07-20T18:00:00.000Z", "end": "2026-07-20T22:00:00.000Z" },
    "energy_kwh": 20,
    "zone": { "country": "FR", "zone_id": "FR-IDF" },
    "carbon_intensity_max_gco2_kwh": 50,
    "firmness": "firm"
  }'
```
