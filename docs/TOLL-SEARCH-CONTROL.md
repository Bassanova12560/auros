# Toll Search Control Plane v0

**Surface :** `/green/toll/search-control` · `POST|GET /api/v1/toll/search-control`

Not just search for humans — a **control plane**: audience-aware ranking, visibility tiers, indicative permission levels, audit of who searched what, monetized via search credits.

## Product rules

- **Indicative ACL** — not enterprise IAM / DLP. HITL.
- Audit log is **operational**, not legal evidence.
- File store `.data/toll-search-audit.json` (cap ~2000 rows).

## Audiences

| Audience | Permission | Default visibility |
|----------|------------|--------------------|
| `ai` | open | public |
| `bank` | restricted | partial |
| `trading` | restricted | private |
| `audit` | confidential | private |
| `regulator` | confidential | private |

## Visibility (hit tags, indicative)

| Kind | Visibility | Permission required |
|------|------------|---------------------|
| `dna` | public | open |
| `market_actor` | partial | restricted |
| `market_offer` | private | confidential |

Requested visibility is **clamped** to what the audience may access (e.g. `ai` + `private` → `public`).

## Ranking

Audience-specific kind weights (e.g. trading boosts offers; regulator / audit boost DNA). Hits sorted by score descending after ACL filter.

## Lib APIs (`lib/toll/search-control.ts`)

- `searchWithControlPlane({ q, audience, visibility?, actorId?, limit? })`
- `listSearchAudit({ actorId?, limit? })`
- Helpers: `applyControlPlaneRanking`, `permissionForAudience`, `clampVisibilityForAudience`, …

## HTTP

- **POST** `{ q, audience, visibility?, actorId?, limit? }` — Bearer + **search** credits — ranked hits + `auditId`
- **GET** `?actorId=&limit=` — Bearer + search credits — indicative audit list

## Related

`AUROS-CASH-MACHINE-TOP20.md` catalogue **#26** · Search Graph (#6) · Control Tower.
