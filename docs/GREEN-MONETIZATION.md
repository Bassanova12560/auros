# Green monetization — RWA operating system (P0)

**ICP P0 : producteurs / opérateurs d’énergie** (inventaire = moat).  
API / plateformes = wedge parallèle. Fonds = après inventaire verified.

## Principe

Relier score + registre + marché + API + preuves en **couches de capture** — pas 50 pages de plus.  
Matching data / intro fee seulement — **pas de broker**, pas d’exécution de trade.

## Produits live (P0)

| Offre | Prix | Surface |
|-------|------|---------|
| Intro fee « mise en relation » | **149 €** one-shot | Fiche offre Market → Stripe → ops HITL |
| Listing Verified (featured) | **299 €** one-shot | Market `#listing-plans` → Stripe → **En revue** → ops HITL (actorId optionnel) |
| Green API Free | 0 € | Clé `POST /api/v1/keys`, quotas anon |
| Green API Premium | **299 €/mo** | `/green/api#premium` (déjà live) |
| Green API Enterprise | Sur devis | `hello@getauros.com` |

## Produits live (P1+)

Voir [`GREEN-P1-CASH.md`](./GREEN-P1-CASH.md) :

| Offre | Prix | Surface |
|-------|------|---------|
| Fast Track 24h | **499 €** | `/green/fast-track` |
| Investor Room | **199 €** / 30 j | `/green/investors` |
| Index Pack | **99 €/mo** | `/data/licence` |
| Readiness MRR | **149 €/mo** | `/green/readiness` |

## Crédibilité (prérequis cash)

- Méthodologie RTMS publique : `/green/standards` (poids, docs, refus, limites, tiers)
- Trust Green : `/green/trust` (5 blocs + compteurs réels)
- Tiers marché : Illustration / Pilote / Verified + filtre `?tier=verified`
- Pas de MWh/tCO₂ inventés si registre vide

## Asset DNA (vision)

Spec v1 : [`ASSET-DNA-V1.md`](./ASSET-DNA-V1.md) · lib `lib/asset-dna/` — **mint live** on register + label publish.  
Proof Stream v0 : [`PROOF-STREAM-V0.md`](./PROOF-STREAM-V0.md) · `GET /api/v1/asset-dna/{id}/stream`.  
Portfolio Console v1 : [`PORTFOLIO-CONSOLE-V1.md`](./PORTFOLIO-CONSOLE-V1.md) · `/green/portfolio`.

## Funnel producteur

Publier → Prouver (RTMS) → Structurer (wizard) → Match (intro fee / verified).

## Anti-patterns

- Claims financés inventés  
- Auto-match sans revue humaine ops  
- Confondre intro fee et conseil réglementé  
- Badge Verified automatique au paiement  

## Suite (P1+)

**P1 cash shippé** — Fast Track · Investor Room · Index Pack · Readiness MRR (`docs/GREEN-P1-CASH.md`).  
Attribution partenaires pilotes : **done** (`docs/PARTNER-PILOTS.md`).  
White-label / DNA / Portfolio institutionnel : **done**.  
**Toll / Agent Protocol v0** : Resolve · Search · Research · Policy · Drift · Schema · Trail · Embed (`docs/AUROS-TOLL-MASTER-PLAN.md`).  
**Metering live** : crédits lookup + Lifecycle Maintain — `/green/toll` · `POST /api/v1/toll/lifecycle`.  
**Cash machine** : Top20/40 + Audit / Rights / Wallet / Sources / Provenance / Tower (`docs/AUROS-CASH-MACHINE-TOP20.md`).  
Suite : Eligibility Router GA (v0 shippé) · Upstash prod (user) · pilotes banque.
