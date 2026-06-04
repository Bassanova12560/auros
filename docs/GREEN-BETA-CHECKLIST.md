# Checklist bêta Green

Utiliser l’URL de production (`NEXT_PUBLIC_SITE_URL`, ex. `https://auros-delta.vercel.app`) en préfixe des chemins ci-dessous.

## 5 URLs à tester (parcours minimal)

| # | Parcours | URL |
|---|----------|-----|
| 1 | Inscription acteur | `/green/register` |
| 2 | Marketplace | `/green/market` |
| 3 | Demande label | `/green/label` |
| 4 | Assistant RTMS | `/green/rtms-assistant` |
| 5 | Espace connecté | `/green/my` (Clerk requis) |

Pour chaque URL : chargement mobile + desktop, liens principaux, pas d’erreur console bloquante, formulaire soumis ou parcours abandonné documenté.

---

## 3 scripts persona (15–20 min chacun)

### Producteur

1. Ouvrir `/green/register` — choisir profil producteur / offreur.
2. Parcourir `/green/market` — trouver une fiche acteur ou offre.
3. Aller sur `/green/my` — vérifier annonces / alertes si compte test existant.
4. Noter : clarté des champs, géolocalisation, temps de soumission.

### Acheteur

1. `/green/market` — filtrer par zone ou type d’acteur.
2. Ouvrir une fiche offre ou acteur depuis la liste.
3. `/green/compare` si comparaison RWA / snapshots utilisée en démo.
4. Noter : pertinence des résultats, CTA contact / suite du parcours.

### Candidat label

1. `/green/label` — lire le parcours puis démarrer une demande (compte test).
2. `/green/rtms-assistant` — compléter ou simuler un scoring.
3. `/green/my` — suivre le statut de la candidature.
4. Noter : étapes confuses, pièces manquantes, emails reçus (si Resend actif).

---

## Feedback à collecter

- **Bloquant** : impossible de finir une action (erreur, page blanche, auth).
- **Friction** : champ incompris, trop d’étapes, lenteur perçue.
- **Valeur** : ce qui ferait revenir la semaine prochaine (alerte marché, label, PDF).
- **Device** : mobile / desktop + navigateur.
- **Capture** : screenshot + URL exacte + heure (optionnel : email du testeur).

Centraliser dans un fichier partagé ou issues GitHub avec le tag `green-beta`.

---

## Rappel hebdomadaire — données marché

Une fois par semaine (avant démo ou revue produit) :

```bash
npm run green:sync
```

Synchronise le bootstrap marché Green (`scripts/run-green-market-bootstrap.ts`). À lancer en local avec les variables Supabase du projet, ou via un job ops documenté.

---

## Smoke test automatisé (optionnel)

Avant une session bêta ou après déploiement :

```bash
npm run test:green
```

Couvre les sprints Green 2–18 (marché, label, exports, etc.). En cas d’échec : noter le fichier de test et le message d’erreur — ne pas bloquer la bêta manuelle si seul un cas edge automatisé casse.

---

## Prérequis ops (hors scope bêta UI)

À configurer sur Vercel **production** quand prêts (noms seulement) :

- `OPS_EMAIL` — destinataire du CSV label hebdo (sinon repli sur `RESEND_INTERNAL_EMAIL`).
- `GREEN_EXPORT_SIGNING_KEY` — signature HMAC des PDF registry (sinon repli sur `CRON_SECRET`).

Pas de redeploy nécessaire tant que ces variables ne sont pas ajoutées.
