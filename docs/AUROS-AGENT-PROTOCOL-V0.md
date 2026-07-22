# AUROS Agent Protocol v0 — toll booth API

**Spec companion :** [`AUROS-TOLL-MASTER-PLAN.md`](./AUROS-TOLL-MASTER-PLAN.md)

Machine interface for banks, platforms, wallets, and AI agents. All responses are **indicative** — no auto-certification, no brokerage.

## Auth

| Endpoint class | Auth |
|----------------|------|
| `GET /api/v1/toll/schema` | Public |
| Resolve / Search / Trail / Drift / Trust (read) | Optional Bearer (higher volume with key) |
| Research / Policy / Agent | Bearer `auros_pk_*` required |

Keys: `POST /api/v1/keys`. Quotas: free 1k/mo · premium tiers via Green API Premium.

## Tools (Agent)

| Tool | HTTP | Purpose |
|------|------|---------|
| `resolve_asset` | `POST /api/v1/toll/resolve` | Canonical DNA or unknown-risk |
| `search_assets` | `POST /api/v1/toll/search` | Graph search |
| `research_asset` | `POST /api/v1/toll/research` | Structured pack + citations |
| `get_validation_trail` | `POST /api/v1/toll/trail` | Proof Stream |
| `get_policy_decision` | `POST /api/v1/toll/policy` | Rule evaluation |
| `get_drift` | `POST /api/v1/toll/drift` | Protection signals |
| `get_trust_score` | (inside resolve/research) | Confidence layer |
| `list_tools` | `POST /api/v1/toll/agent` | Discovery |

Unified: `POST /api/v1/toll/agent` body `{ "tool": "resolve_asset", "input": { ... } }`.

## Unknown asset risk

If resolve fails: `{ resolved: false, risk: "unknown_asset", recommendation: "do_not_treat_as_auros_canonical" }`.

## Embed

- iframe: `/embed/asset-dna?id=<dna>&theme=dark|light`
- script: `public/auros-resolve.js` + `data-auros-dna`

## Non-goals v0

- On-chain DNA  
- Auto-block of third-party trades  
- Automatic Verified badge  
