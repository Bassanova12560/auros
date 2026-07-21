# Asset DNA v1

**Status:** spec + library (`lib/asset-dna/`) — not yet a market-enforced ID.  
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

## Pricing (target)

| Moment | Product | Notes |
|--------|---------|--------|
| Birth | Enrollment fee | KYAsset + DNA mint |
| Life | Maintain subscription | docs / events / compliance refresh |
| Read | Volume API | banks, funds, exchanges |

## Roadmap wiring

1. **v1 (now):** schema + id helpers + this spec  
2. **Next:** attach DNA on Green register / registry publish  
3. **Then:** Proof Stream events keyed by DNA  
4. **Later:** OpenAPI read endpoints + Watt Ledger / Water Trust namespaces  

## API sketch (future)

```http
POST /api/v1/asset-dna
GET  /api/v1/asset-dna/{id}
GET  /api/v1/asset-dna/{id}/compliance
```

Auth: existing Green API keys / institutional licenses.

## Non-goals (v1)

- On-chain mint of DNA  
- Robot Economy firewall  
- Automatic Verified badge from DNA alone  

## Related

- RTMS methodology: `/green/standards`  
- Trust surface: `/green/trust`  
- Monetization: [`GREEN-MONETIZATION.md`](./GREEN-MONETIZATION.md)
