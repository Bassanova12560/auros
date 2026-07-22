# Toll Benchmark API v0

**Surface :** `POST /api/v1/toll/benchmark` · Control Tower module · Agent tool `get_benchmark`

Indicative RWA readiness / peer comparables for desks and IA — wraps the AUROS Green Index.

## Kinds

| `kind` | Output |
|--------|--------|
| `green_index` (default) | Top N entries + segments |
| `segment` | Segment averages (`segment` optional filter) |
| `peer_rank` | Rank / peers for `assetId` (unranked if absent) |

## Auth / metering

Bearer + **search** credits.

## Disclaimer

Not a market price, credit rating, or investment advice. HITL for institutional use.

## Related

`/api/green/index` · `/data/green-index` · Index Pack cash · `docs/AUROS-CASH-MACHINE-TOP20.md` #28
