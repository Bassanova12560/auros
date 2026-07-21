# Manager backlog — AUROS

Living priorities. Manager owns this; update when shipping or discovering debt.
Last review: 2026-07-21 (5 locales Assistant + Copilot).

## P0 — risque / trust

| Item | Statut |
|------|--------|
| Repo GitHub **privé** | **Bloqué** — `gh auth login` puis visibility private |
| `ATTEST_SIGNING_KEY` prod | OK |
| Upstash rate limits | **Action user** — `docs/UPSTASH-SETUP.md` |

## P1 — conversion

| Item | Statut |
|------|--------|
| Funnel `funnel_*` analytics | OK |
| CTAs → express `/wizard?expert=1` | OK (hero, final CTA, focus heroes, nav, header) |
| Care email drafts HITL | OK — `/ops/copilot` « Drafts care email » |
| Attribution partenaires pilotes | À venir (ops business) |

## P1+ — Growth AI (voir `docs/GROWTH-AI.md`)

| Phase | Contenu |
|-------|---------|
| **A (now)** | RAG + drafts + care HITL + Green playbook + FAB + funnel + **5 locales** Assistant/Copilot |
| **B** | Care lié dossiers réels ; coach post-score ; A/B subjects ; mémoire consentie |
| **C** | Fine-tune open-source **seulement** si dataset drafts approuvés + métrique claire |

## Backlog i18n

| Item | Statut |
|------|--------|
| GreenMessages AR + ZH complets | Hors scope — catalogue Green tombe encore sur EN |
| Audit FR hardcodé wizard / trust | À venir |

## Erreurs à ne plus refaire

- Fine-tune avant RAG/HITL mature
- Auto-send mails IA
- Claims 35 % / sans clic / fake partners
- Copilot / Assistant hardcodés `locale: "fr"`
