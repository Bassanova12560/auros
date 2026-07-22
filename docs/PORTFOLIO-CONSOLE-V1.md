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

## Alerts v0

Computed in snapshot (`lib/green/portfolio-alerts.ts`):

- `proof_stream_silent` / `proof_stream_stale` (>30d)  
- `listing_pending` · `demo_tier` · `document_expired`  

Backfill DNA seeds: `POST /api/admin/backfill-asset-dna` (Bearer `CRON_SECRET`).

## Watchlists + digest

| Surface | Path |
|---------|------|
| Subscribe | `POST /api/v1/green/portfolio/watchlist` `{ email, assetDnaIds?, locale? }` |
| Unsubscribe | `/green/portfolio/unsubscribe?token=…` (one-click in digest footer) |
| Cron | `GET /api/cron/portfolio-watchlist-digest` (daily 13:00 UTC) |
| Storage | `.data/portfolio-watchlists.json` + `green_portfolio_watchlists` |

| White-label KPIs | `/embed/portfolio` | iframe (`frame-ancestors *`) |
| Spec | [`INSTITUTIONAL-AUTH-V0.md`](./INSTITUTIONAL-AUTH-V0.md) | SSO / on-prem path |

Empty `assetDnaIds` = watch full portfolio snapshot. Max 20 selected IDs. Digest skips if fingerprint unchanged within 20h.

## Volume gates (API)

| Surface | Anon | Free key | Premium+ |
|---------|------|----------|----------|
| `GET /api/v1/green/portfolio?limit=` | 20 | 50 | 100 |
| `GET /api/v1/asset-dna/{id}/stream?limit=` | 20 | 50 | 100 |

Single DNA record reads stay public (IP rate limit). Response includes `meta.tier` / `meta.capped`.

## Next

Tenant self-serve branding UI · IdP metadata upload HITL · offline Shield importer CLI.
