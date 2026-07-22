# AUROS Agent Protocol v0 — toll booth API

**Spec companion :** [`AUROS-TOLL-MASTER-PLAN.md`](./AUROS-TOLL-MASTER-PLAN.md)

Machine interface for banks, platforms, wallets, and AI agents. All responses are **indicative** — no auto-certification, no brokerage.

## Auth

| Endpoint class | Auth | Credits |
|----------------|------|---------|
| `GET /api/v1/toll/schema` | Public | 0 |
| Resolve / Search / Trail / Drift | Optional Bearer | 1 each (anon 200/mo · free 2k · premium 25k + packs) |
| Research / Policy / Agent | Bearer required | 5 / 3 / 2 |
| Lifecycle event | Bearer | 1 event credit (bonus pack first) |

Paid packs: `/green/toll` — Lookup Pack 99 € (10k) · Lifecycle Maintain 149 €/mo (500 events).

**Credit subjects:** Bonus packs attach to a subject id — prefer `key:{sha256(api_key)}` so Bearer API usage sees paid credits; fallback `email:{normalized}`. Checkout accepts `apiKey` or `creditSubject` (never store the raw key in Stripe metadata). Self-serve link: `POST /api/green/toll/link` with `Authorization: Bearer <key>` and body `{ "fromEmail" }` moves balances from `email:…` → `key:…`.

Keys: `POST /api/v1/keys`. Upstash recommended for durable metering (`docs/UPSTASH-SETUP.md`).

## Tools (Agent)

| Tool | HTTP | Purpose |
|------|------|---------|
| `resolve_asset` | `POST /api/v1/toll/resolve` | Canonical DNA or unknown-risk |
| `search_assets` | `POST /api/v1/toll/search` | Graph search |
| `research_asset` | `POST /api/v1/toll/research` | Structured pack + citations |
| `get_validation_trail` | `POST /api/v1/toll/trail` | Proof Stream |
| `get_policy_decision` | `POST /api/v1/toll/policy` | Rule evaluation |
| `get_drift` | `POST /api/v1/toll/drift` | Protection signals |
| `route_eligibility` | `POST /api/v1/toll/eligibility` | Transactional gate |
| `assess_wallet_risk` | `POST /api/v1/toll/wallet-risk` | Attribution / behavioral flags |
| `get_reputation` | `POST /api/v1/toll/reputation` | Reality reputation |
| `run_red_team` | `POST /api/v1/toll/red-team` | Adversarial findings |
| `get_benchmark` | `POST /api/v1/toll/benchmark` | Green Index / peers |
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
