# Manager backlog — AUROS

Living priorities. Manager owns this; update when shipping or discovering debt.
Last review: 2026-07-22 (Cash machine top20 + remaining H1).

## P0 — risque / trust

| Item | Statut |
|------|--------|
| Repo GitHub **privé** | **Bloqué** — `gh auth login` puis visibility private |
| `ATTEST_SIGNING_KEY` prod | OK |
| Upstash rate limits | **Action user** — `docs/UPSTASH-SETUP.md` |

## P0 — Toll / machine à cash

| Item | Statut |
|------|--------|
| Plan 3 horizons + Top20/40 | OK — `AUROS-TOLL-MASTER-PLAN.md` · `AUROS-CASH-MACHINE-TOP20.md` |
| Resolve / Search / Research / Policy / Drift / Trail / Agent | OK |
| Metering + Lookup/Lifecycle packs | OK — `/green/toll` |
| Crédits → key hash self-serve | OK — checkout apiKey + `/api/green/toll/link` |
| Policy pilote banque | OK — `/green/toll/policy` |
| Audit Export | OK — `/api/v1/toll/audit-export` |
| Rights / Wallet / Sources v0 | OK |
| Event Certification v0 | OK — `/api/v1/toll/events` · `docs/TOLL-EVENT-CERTIFICATION.md` |
| Provenance Ledger v0 | OK — `/api/v1/toll/provenance` · `/green/toll/provenance` · `docs/TOLL-PROVENANCE.md` |
| Control Tower page | OK — `/green/toll/tower` (+ Eligibility / Events / Provenance / Exceptions) |
| Schema adoption guide | OK — `AUROS-SCHEMA-ADOPTION.md` |
| Eligibility Router v0 | OK — `/api/v1/toll/eligibility` · `/green/toll/eligibility` · `docs/TOLL-ELIGIBILITY.md` |
| Exception Management OS v0 | OK — `/api/v1/toll/exceptions` · `/green/toll/exceptions` · `docs/TOLL-EXCEPTIONS.md` |
| ZK / Red-team | Horizon 2–3 |

## P0 — Green cash / DNA / institutionnel

| Item | Statut |
|------|--------|
| Intro / Verified / API Premium | OK |
| DNA + Portfolio + Desk / SSO / air-gap | OK |
| P1+ Fast Track · Investors · Index · Readiness | OK |
| Attribution partenaires | OK |

## P1 — growth

| Item | Statut |
|------|--------|
| Funnel + express wizard + care HITL | OK |
| Coach post-score + mémoire Copilot consentie | OK |
| Liquidity waitlist | OK — `/liquidity` |

## Backlog i18n

| Item | Statut |
|------|--------|
| GreenMessages AR + ZH | Hors scope — fallback EN |
| Audit FR hardcodé | Progressif |

## Erreurs à ne plus refaire

- Fine-tune avant RAG/HITL mature
- Auto-send mails IA / intro sans revue ops
- Claims 35 % / sans clic / fake partners
- Broker / exécution deals énergie
