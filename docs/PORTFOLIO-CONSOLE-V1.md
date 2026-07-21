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

Watchlists, alert digests, institutional auth / on-prem.
