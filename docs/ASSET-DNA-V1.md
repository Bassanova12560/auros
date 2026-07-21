# Asset DNA v1

**Status:** wired on Green register + registry publish · Proof Stream v0 live (local + Supabase when migrated).  
**Goal:** become the canonical identity for real-world assets before tokenization (energy, water, infra, fleets, compute).

## Identifier

```
auros:dna:v1:<classShort>:<uuid>
```

| classShort | assetClass |
|------------|------------|
| `ge` | green_energy |
| `wr` | water_rights |
| `ei` | energy_infra |
| `fe` | fleet_ev |
| `cp` | compute |
| `ot` | other |

Example: `auros:dna:v1:ge:550e8400-e29b-41d4-a716-446655440000`

## Record (canonical fields)

| Field | Role |
|-------|------|
| `id` | Public DNA |
| `assetClass` | Taxonomy |
| `displayName` | Human label |
| `jurisdiction` | country (+ region / frame) |
| `origin` | operator / SPV / site / coords |
| `documents[]` | refs + optional content hash |
| `compliance` | RTMS readiness, label / listing tiers |
| `links` | registry / market / dossier IDs |
| `createdAt` / `updatedAt` | ISO timestamps |

See TypeScript: [`lib/asset-dna/types.ts`](../lib/asset-dna/types.ts).

## Wiring (live)

| Moment | Behaviour |
|--------|-----------|
| `/green/register` | Mint DNA (`green_energy`), store `asset_dna_id` on `green_market_assets`, emit `dna.minted` + `market.submitted` |
| Market approve/reject | Emit `market.approved` / `market.rejected` |
| Label publish | Mint DNA from project type, store on `green_registry_projects` + application, emit `dna.minted` + `registry.published` |
| UI | DNA badge + Proof Stream link on actor + registry project pages |

Migration: [`0054_asset_dna_proof_stream.sql`](../supabase/migrations/0054_asset_dna_proof_stream.sql)  
(graceful fallback if column not yet applied — DNA still minted locally).

## Proof Stream v0

Append-only journal keyed by DNA (`lib/proof-stream/`):

- Actions: `dna.minted`, `market.submitted`, `market.approved`, `market.rejected`, `registry.published`, …
- Persistence: `.data/proof-stream.json` + `proof_stream_events` (Supabase)

## API (public read)

```http
GET /api/v1/asset-dna/{id}
GET /api/v1/asset-dna/{id}/stream?limit=50
```

## Pricing (target)

| Moment | Product | Notes |
|--------|---------|--------|
| Birth | Enrollment fee | KYAsset + DNA mint |
| Life | Maintain subscription | docs / events / compliance refresh |
| Read | Volume API | banks, funds, exchanges |

## Roadmap

1. schema + id helpers — done  
2. attach DNA on Green register / registry publish — done  
3. Proof Stream v0 — done  
4. Portfolio Console v1 — done (`/green/portfolio`)  
5. **Next:** OpenAPI auth quotas · DNA on existing seeds · alert digests  

## Non-goals (v1)

- On-chain mint of DNA  
- Robot Economy firewall  
- Automatic Verified badge from DNA alone  

## Related

- RTMS methodology: `/green/standards`  
- Trust surface: `/green/trust`  
- Proof Stream: [`PROOF-STREAM-V0.md`](./PROOF-STREAM-V0.md)  
- Monetization: [`GREEN-MONETIZATION.md`](./GREEN-MONETIZATION.md)
