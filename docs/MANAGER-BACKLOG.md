# Manager backlog — AUROS

Living priorities. Manager owns this; update when shipping or discovering debt.
Last review: 2026-07-24 (compare wedges: alerts moves · entity · CQS · RapidAPI · PDF).

## P0 — risque / trust

| Item | Statut |
|------|--------|
| `ATTEST_SIGNING_KEY` prod | OK |
| Lab soft cookie (`ARL_LAB_SIGNING_KEY`) | Code OK — **Action user** : confirmer clé **dédiée** sur Vercel Production (pas seulement fallback `CRON_SECRET`) + redeploy |
| Ops gate (`OPS_SESSION_SECRET`) | Code OK — **Action user** : idem Vercel Production + tester `/ops/login` → cookie · `/ops/copilot` 404 sans session |

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
| Reality Reputation v0 | OK — `/api/v1/toll/reputation` · `/green/toll/reputation` · `docs/TOLL-REPUTATION.md` |
| Control Tower page | OK — `/green/toll/tower` (+ Bank pilot / Eligibility / …) |
| Bank Policy/Eligibility pilot | OK — `/green/toll/bank` · `/api/v1/toll/bank-pilot` · `docs/TOLL-BANK-PILOT.md` |
| Wallet attribution v1 | OK — persist + self-dealing / reassignment flags |
| Source attestation signed v1 | OK — HMAC enroll + sign_packet / activate |
| Infra status (Upstash probe) | OK — `/api/v1/toll/infra-status` |
| Schema adoption guide | OK — `AUROS-SCHEMA-ADOPTION.md` |
| Eligibility Router v0 | OK — `/api/v1/toll/eligibility` · `/green/toll/eligibility` · `docs/TOLL-ELIGIBILITY.md` |
| Exception Management OS v0 | OK — `/api/v1/toll/exceptions` · `/green/toll/exceptions` · `docs/TOLL-EXCEPTIONS.md` |
| Recovery & Continuity v0 | OK — `/api/v1/toll/continuity` · `/green/toll/continuity` · `docs/TOLL-CONTINUITY.md` |
| Search Control Plane v0 | OK — `/api/v1/toll/search-control` · `/green/toll/search-control` · `docs/TOLL-SEARCH-CONTROL.md` |
| ZK selective disclosure stub v0 | OK — `/api/v1/toll/zk-disclosure` · `/green/toll/zk` · `docs/TOLL-ZK-DISCLOSURE.md` |
| Red-Team Asset Layer v0 | OK — `/api/v1/toll/red-team` · `/green/toll/red-team` · `docs/TOLL-RED-TEAM.md` |
| Benchmark API v0 | OK — `/api/v1/toll/benchmark` · Agent `get_benchmark` · `docs/TOLL-BENCHMARK.md` |
| Agent Protocol cash tools | OK — eligibility / wallet / reputation / red-team / benchmark |
| Suite tests vitest→node | OK — funnel-events · security-hardening |

## P0 — ops (action user)

| Item | Statut |
|------|--------|
| Repo GitHub **privé** | **Bloqué** — `gh auth login` puis `gh repo edit --visibility private` |
| Upstash rate limits | **Action user** — `docs/UPSTASH-SETUP.md` (Vercel env) |
| Listings green `/presence` | **Action user** — soumettre dossiers prêts (DeFiLlama RWA, RWA.xyz, ClimateTechList) ; pas de badge « Listed on » avant confirmation |

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
| Présence marchés green-first | Page OK — `/presence` + payloads ; **suivants** : outreach Readi / KnowESG |
| Tunnel conversion trust | OK — compare → `/start` dossier + voie Green/CSRD (max 3 CTAs), claims indicatifs, `/green/compare` next-step |
| Comparator RWA #1 push | **In progress** — classes equity/art, filtres hub, SEO, DeFiLlama BUIDL/USYC/ACRED/HLSCOPE ; gap : TVL art/infra encore mince |
| **Compare monetization pack** | **OK 2026-07-23** — Report `/compare/report` · desk mailto ≥2 · Sponsored badge (config vide) · CSV · alerts waitlist+webhook HTTPS · Green/CSRD soft |
| **Compare API differentiation** | **OK 2026-07-23** — `GET/POST /api/compare` signed snapshot (`auros-compare:v1:`) · screener · eligibility · verify · rate-limit · docs endpoint-compare |
| **Compare next wedges** | **OK 2026-07-24** — Live APY/TVL moves (`auros.compare.alerts.move.v1` + cron) · entity_id/issuer_key · CQS/CSRD soft-join Green · RapidAPI compare endpoints · signed report PDF |

### Deferred / thin

- Entity graph: aliases + `entity_id` shipped ; full multi-chain token address graph still thin
- CQS only when Green carbon profile maps (toucan/klima/moss/flowcarbon…) — no invention
- Serverless: watcher/snapshot file persist may be ephemeral on Vercel — best-effort (same as waitlist)

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
