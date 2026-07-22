# Partner pilots — attribution Green P1+

## Objectif

Activer 2–3 apporteurs pilotes avec liens trackés `?partner=CODE` sur wizard **et** cash Green (Fast Track · Investor Room · Index Pack · Readiness).

## Produit live

| Surface | Comportement |
|---------|--------------|
| `?partner=CODE` | Persisté `localStorage` (`auros_partner_code`) |
| Checkout Green P1 | Metadata Stripe `partner_code` → HITL mail + store `.data/partner-paid-referrals.json` |
| `/partners/dashboard` | Liens wizard + 4 offres cash ; stats leads / dossiers / paiements |
| Export CSV | Leads + dossiers + paiements Green (estimé, hors payout) |

## Ops — activer un pilote

1. Demande `/partners` → compte `pending`
2. Activer via outil ops interne (auth) — code unique
3. Partner ouvre `/partners/dashboard` → copie les liens
4. Mesurer volume 30 j avant phase D payouts (`docs/MODELE-ECONOMIQUE.md`)

## Règles

- Commission **estimée** uniquement — pas d’auto-payout Stripe
- Pas de claim volume inventé
- Contrats cadre hors produit (juridique)
