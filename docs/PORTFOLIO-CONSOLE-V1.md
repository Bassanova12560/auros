# Portfolio Console v1

Institutional read surface for Green assets linked to [Asset DNA](./ASSET-DNA-V1.md) and [Proof Stream](./PROOF-STREAM-V0.md).

## Surfaces

| Surface | Path |
|---------|------|
| UI | `/green/portfolio` |
| API | `GET /api/v1/green/portfolio?limit=50` |

## What it shows

- Counts: DNA total, DNA with recent events, registry vs market sources  
- Heatmap of latest Proof Stream actions  
- Table: name, source, tier, last event, stream link  

## Limits

- Indicative aggregation — not a regulated portfolio or investment advice  
- Cap 100 DNA rows per request  
- Server-only snapshot (`lib/green/portfolio-snapshot.ts`) — never imported via Green client barrel  

## Next

Watchlists abonnables · digest e-mail cron · auth institutionnelle / on-prem.

## Alerts v0

Computed in snapshot (`lib/green/portfolio-alerts.ts`):

- `proof_stream_silent` / `proof_stream_stale` (>30d)  
- `listing_pending` · `demo_tier` · `document_expired`  

Backfill DNA seeds: `POST /api/admin/backfill-asset-dna` (Bearer `CRON_SECRET`).
