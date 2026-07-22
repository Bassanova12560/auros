# Toll Eligibility Router v0

**Surface :** `/green/toll/eligibility` · `POST /api/green/toll/eligibility-pilot` · `POST /api/v1/toll/eligibility` (Bearer + policy credits)

Décision indicative `allow | deny | review | allow_with_restrictions` via `routeEligibility` / `evaluateEligibility`.  
Compose Resolve + Policy + Wallet risk optionnel.

**AUROS n’auto-bloque aucun marché** — l’intégrateur enforce. Langage HITL dans les disclaimers. Pas de claim Verified / certification / brokerage.

## Opérations

`mint` · `buy` · `transfer` · `redeem` · `list`

## Règles v0 (extra + Policy)

| Rule | Effet |
|------|--------|
| Policy v0 | unknown · stale 90d · unmapped · jurisdiction · demo · low trust |
| `deny_us_restricted` | US investor + produit demo / frame restricted |
| `require_wallet_attribution` | Transfer sans wallet → deny ; wallet présent → restrictions HITL si attribution faible |
| `review_pep` | PEP → review |
| `restrict_unaccredited` | `accredited: false` → allow_with_restrictions |

Voir `AUROS-CASH-MACHINE-TOP20.md` · `TOLL-POLICY-PILOT.md` · `AUROS-AGENT-PROTOCOL-V0.md`.
