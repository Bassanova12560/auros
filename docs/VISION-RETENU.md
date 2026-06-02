# Vision « usine de tokenisation » — ce qu’on retient pour AUROS

## Positionnement AUROS (aujourd’hui)

**AUROS = démocratisation du dossier RWA**, pas une usine de déploiement on-chain.

Studio de **préparation régulée** : qualification, data room, admission plateforme, cadre réglementaire indicatif, blueprint tokenomics, rétroplanning, prestataires — dossier IA + PDF.

**Business visé** : volume de dossiers qualifiés + **partenaires apporteurs** (% sur actifs/contrats amenés) + tunnels contenu — voir `docs/MODELE-ECONOMIQUE.md`.

Le deploy SC / KYC opérationnel reste **hors périmètre** sauf pivot explicite plus tard.

## Retenu et livré (dossier « Studio de tokenisation »)

| Bloc vision | Implémentation |
|-------------|----------------|
| 1. Parcours guidé wizard | Déjà en place (15 étapes) |
| Arbre réglementaire | `lib/studio/regulatory-path.ts` — MiCA/EU, UK, US hints |
| Instrument suggéré | equity / debt / fund / revenue share |
| Rétroplanning | `lib/studio/tokenization-roadmap.ts` — 5 phases, tâches liées aux 15 docs |
| 2. Automatisation juridique (début) | `lib/studio/document-blueprints.ts` — plans SPV, souscription, whitepaper, prospectus, clause jeton + pré-remplissage |
| 3. Smart contracts | **Blueprint** tokenomics + standard ERC-3643 / 3525 — pas de deploy |
| 4. Compliance-as-a-Service | Hooks listés + prestataires KYC « coming soon » |
| 5. Écosystème prestataires | `lib/studio/provider-directory.ts` + lien `/partners` |
| 6. Cycle de vie | Phase « lifecycle » dans le roadmap |
| 7–8. Multi-chain, sécurité, simulateur | **Phase 2** — documenté comme « à venir » dans l’UI |

## Plus tard (seulement si priorité business change)

- Pages SEO « comment tokeniser [actif] » + contenu automatisé
- Attribution partenaire + reporting commissions
- KYC intégré, deploy SC, oracle on-chain — **non retenu comme cœur actuel**

## Fichiers

- `lib/studio/*` — logique
- `app/dossier/_components/TokenizationStudio.tsx` — UI dossier
- `lib/studio-i18n.ts` — FR/EN
