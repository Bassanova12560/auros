# Manager backlog — AUROS

Living priorities. Manager owns this; update when shipping or discovering debt.
Last review: 2026-07-22 (Toll metering + lifecycle packs).

## P0 — risque / trust

| Item | Statut |
|------|--------|
| Repo GitHub **privé** | **Bloqué** — `gh auth login` puis visibility private |
| `ATTEST_SIGNING_KEY` prod | OK |
| Upstash rate limits | **Action user** — `docs/UPSTASH-SETUP.md` |

## P0 — Green cash (ICP producteurs)

| Item | Statut |
|------|--------|
| Doc `docs/GREEN-MONETIZATION.md` | OK |
| 3 portes hub/market | OK |
| Intro fee 149 € + HITL | OK |
| Listing Verified 299 € | OK |
| API Free / Premium / Enterprise UI | OK |

## P0 — DNA / Portfolio / institutionnel

| Item | Statut |
|------|--------|
| Asset DNA + Proof Stream + Portfolio | OK |
| Watchlists + digest + unsubscribe | OK |
| Desk Clerk + SSO runbook + air-gap | OK |
| Branding / IdP HITL + Shield import | OK |

## P0 — Toll / machine à cash (péage)

| Item | Statut |
|------|--------|
| Plan maître 3 horizons | OK — `docs/AUROS-TOLL-MASTER-PLAN.md` |
| Resolve + unknown risk | OK — `/api/v1/toll/resolve` |
| Search Graph | OK — `/api/v1/toll/search` |
| Research API | OK — `/api/v1/toll/research` |
| Policy Engine v0 | OK — `/api/v1/toll/policy` |
| Drift Detection | OK — `/api/v1/toll/drift` |
| Metadata Standard | OK — `/api/v1/toll/schema` |
| Validation Trail | OK — `/api/v1/toll/trail` |
| Agent Protocol + embed | OK — `/api/v1/toll/agent` · `/embed/asset-dna` |
| Lookup metering credits | OK — Upstash/memory + packs `/green/toll` |
| Lifecycle event fees | OK — `/api/v1/toll/lifecycle` + Maintain 149 €/mo |

## P1 — conversion

| Item | Statut |
|------|--------|
| Funnel `funnel_*` analytics | OK |
| CTAs → express `/wizard?expert=1` | OK |
| Care email drafts HITL | OK |
| Attribution partenaires pilotes | OK — `docs/PARTNER-PILOTS.md` |

## P1+ — cash / growth

| Item | Statut |
|------|--------|
| Fast Track 24h | OK — `/green/fast-track` |
| Investor room | OK — `/green/investors` |
| Indice Green packagé | OK — Index Pack `/data/licence` |
| Readiness MRR | OK — `/green/readiness` |
| Attribution partenaires pilotes | OK — `docs/PARTNER-PILOTS.md` |

## Backlog i18n

| Item | Statut |
|------|--------|
| GreenMessages AR + ZH complets | Hors scope — fallback EN |
| Audit FR hardcodé wizard / trust | Progressif — hors sprint cash |

## Erreurs à ne plus refaire

- Fine-tune avant RAG/HITL mature
- Auto-send mails IA / intro sans revue ops
- Claims 35 % / sans clic / fake partners
- Broker / exécution deals énergie
