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
Persistance prod : tables Supabase `shield_receipts` / `shield_tap_usage` / `shield_audit` (migration 0046).

## Premium — du lourd utile

`POST /api/v1/shield/pack` (+ `?format=html` imprimable PDF) assemble CFU + taps + `generation_source` + SLA indicatif + `bank_actions`.

Aussi : `GET /api/v1/shield/audit`, `POST /api/v1/shield/reseal`, export CFU `?shield=1`.

## Surfaces

- `/start` — première victoire 4 min
- `/developers/shield` — essai
- `/developers/shield/banks` — Evidence Pack banque
- `/developers/shield/dashboard` — quota
- `/pilots` — flotte · banque · plateforme
- `/liquidity` — waitlist (après issuer)
