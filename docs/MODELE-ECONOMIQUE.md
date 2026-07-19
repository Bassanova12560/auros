# AUROS — Modèle économique & feuille de route business

## Positionnement retenu (north star)

**Démocratiser la préparation d’un dossier RWA** — pas devenir une usine de déploiement smart contract.

AUROS aide un porteur (ou son conseil) à :

- comprendre s’il est crédible pour une plateforme ;
- structurer une data room 15 pièces ;
- obtenir un dossier indicatif (score, admission, studio, PDF).

Le déploiement on-chain, le KYC opérationnel et l’émission restent chez **plateformes + conseils + auditeurs** — AUROS amont.

---

## Revenus — aujourd’hui vs demain

| Horizon | Source | Statut produit |
|---------|--------|----------------|
| **Maintenant** | Valeur gratuite / lead gen → concierge, revue, confiance | En place (wizard, dossier, emails) |
| **Court terme** | Prestation humaine AUROS (revue dossier, accompagnement) | Partiel (`concierge`, soumission) |
| **Moyen terme** | **Partenaires apporteurs** (% sur actif ou contrat amené) | **À construire** (voir ci-dessous) |
| **Moyen terme** | Contenu SEO + pages « Comment tokeniser [actif] » | Roadmap marketing |
| **Long terme** | Automatisation contenu (guides, comparatifs plateformes) | Roadmap produit |
| **Hors scope volontaire** | Deploy SC, KYC intégré, marché secondaire | Phase 2+ seulement si pivot explicite |

---

## Plateformes RWA (petites structures) — double valeur

Problème **#1** : pas assez d’émetteurs qualifiés → **AUROS issuer pipeline** (produit actuel).  
Problème **#2** : tokens illiquides après émission → **Liquidity Bridge** (market making / pont — produit futur, distinct).

Pitch détaillé : `docs/PROPOSITION-PLATEFORMES.md`

Revenus possibles côté plateforme : fee par dossier accepté, rev share onboarding, puis fees/spread sur module liquidité.

---

## Partenaires apporteurs (% sur actif amené)

### Qui peut apporter

- Cabinets (notaire, avocats affaires, fiscaliste)
- Family offices / CGP
- Promoteurs, agents immobiliers premium
- Intégrateurs Web3 / conseil tokenisation
- Plateformes RWA (co-marketing)

### Ce qu’ils apportent

Un **dossier qualifié** : actif identifié, valeur, pays, data room entamée, plateforme cible, contact décideur.

### Ce qu’AUROS leur reverse (à contractualiser hors produit d’abord)

Exemples de grilles (à valider juridiquement) :

- **% du mandat** de structuration / onboarding plateforme ;
- **% de la valeur d’actif** tokenisée (plafonné, paliers) ;
- **Forfait par dossier** soumis + bonus si `approved` côté plateforme.

> Important : les % se négocient en **contrat de partenariat / apport d’affaires** (France : statut commercial, facturation, RGPD, transparence vis-à-vis du client final). Le produit ne remplace pas l’avocat fiscal.

### Implémentation produit (phases)

| Phase | Fonction | Effort | Statut |
|-------|----------|--------|--------|
| **A — Manuel** | Formulaire `/partners` + tableau Supabase + suivi Excel | Déjà partiel (`partner_requests`) | Live |
| **B — Attribution** | `?partner=CODE` → `referred_by` sur `dossiers` / `leads` + export admin CSV | Dev moyen | **Live** |
| **C — Portail partenaire (MVP)** | Registre `partners`, activation ops, `/partners/dashboard` (lien + stats, commission `estimated`) | Dev moyen | **Live (MVP)** |
| **D — Paiement** | Export compta / Stripe / virement trimestriel | Ops + juridique | À venir |

**Ops** : `POST /api/admin/partners/activate` (Bearer `CRON_SECRET`) — `{ id|email, code, clerk_user_id? }`.

**Recommandation** : activer 2–3 partenaires pilotes via le dashboard, mesurer le volume avant payouts (phase D).

---

## Tunnel de vente (croissance)

### Déjà en place

- Score rapide → wizard prérempli
- Partage score viral (`ref=SCORE`)
- Parcours express `/wizard?expert=1`
- Page `/partners`

### À ajouter progressivement

1. **Pages actif** (SEO + ads)  
   Ex. `/comment-tokeniser/immobilier`, `/art`, `/fonds`  
   → CTA unique : « Créer mon dossier » + prefill actif.

2. **Automatisation contenu**  
   Articles / FAQ générés à partir des mêmes briques que le studio (MiCA, data room, plateformes) — relecture humaine.

3. **Email nurturing**  
   Lead score → rappel wizard → dossier incomplet → soumission.

---

## Messages clés (site & partenaires)

**Porteur d’actif**  
> « Préparez un dossier RWA crédible en une session guidée — sans être expert blockchain. »

**Partenaire apporteur**  
> « Amenez vos clients : AUROS structure le dossier ; vous participez à la réussite de la tokenisation selon notre grille partenaire. »

**Ce qu’on ne dit pas**  
> « Nous déployons votre token pour vous. »

---

## Priorités alignées avec cette vision

1. **Prod** — Supabase, Storage, Vercel, Resend, Clerk live (`docs/PROD-LAUNCH.md`)
2. **Trafic qualifié** — 1–2 landing actif + contenu
3. **Pilote partenaires** — 3 contrats cadre + attribution manuelle
4. **Produit B+C** — attribution `referred_by` + portail `/partners/dashboard` (MVP)
5. Plus tard : contenu auto, payouts Stripe

Voir aussi : `docs/PRODUIT-AUROS.md`, `docs/VISION-RETENU.md`.
