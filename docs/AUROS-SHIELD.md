# AUROS Shield — facile à intégrer, Premium qui aide

## Réponse courte

**Oui, maintenant c’est facile** : curl, `instrumentFetch`, `withShieldTap` (Next), `expressShieldTap`, ou bouton console CFU.  
**Premium = Evidence Pack** + audit + reseal PQC — livrable banque/auditeur.

## Free — devenir le standard

| Intégration | Effort |
|-------------|--------|
| Essai UI `/developers/shield` | 0 |
| `POST /api/v1/shield/demo` | 0 clé |
| `POST /api/v1/shield/ingest` + body brut | 0 schéma |
| `instrumentFetch` / `withShieldTap` / `expressShieldTap` | 1 ligne |
| Webhook `shield.tap.created` | config |
| `npx auros-shield serve` | on-prem |
| Verify public | illimité |

Quota free : 100 ingest/mois. Payload **jamais** stocké.

## Premium — du lourd utile

`POST /api/v1/shield/pack` assemble CFU + taps + `generation_source` + SLA indicatif + `bank_actions`.

Aussi : `GET /api/v1/shield/audit`, `POST /api/v1/shield/reseal`, export CFU `?shield=1`.

## Surfaces

- `/developers/shield` — essai
- `/developers/shield/banks` — Evidence Pack banque
- `/developers/shield/dashboard` — quota
- `/developers/shield/agents` — snippets Cursor/Claude
- `/developers/shield/case-study` — flotte → banque
