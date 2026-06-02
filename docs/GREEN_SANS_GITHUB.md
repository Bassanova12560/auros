# AUROS Green — sans GitHub ni DATABASE_URL

Vous n’avez **rien d’autre à faire** pour que le marché vert en production fonctionne : les étapes ci-dessous suffisent, avec les clés déjà présentes dans `.env.local`.

## Ce qui a été fait pour vous (référence)

- `npm run green:sync` — synchronise les données du marché vert via la clé secrète Supabase (pas besoin de `DATABASE_URL`).
- Appels bootstrap sur la prod (`https://auros-delta.vercel.app`) avec `CRON_SECRET` depuis `.env.local`.
- Vérification : `/green/market` répond **200**.

## Pour mettre à jour le site (code déployé)

Depuis le dossier du projet (`C:\Users\adrie\auros`) :

```powershell
npx vercel --prod --yes
```

Aucun compte GitHub ni clé SSH n’est requis pour publier : Vercel CLI utilise votre session locale.

## Pour re-seeder le marché vert (données)

```powershell
npm run green:sync
```

Prérequis : dans `.env.local`, `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SECRET_KEY` (déjà configurés chez vous).

Message attendu du type : *« No SQL credentials — seeding via service role »* puis *« Green marketplace seed complete »*. C’est normal : **pas besoin de `DATABASE_URL`** tant que ce script réussit.

Optionnel (prod, même secret que les crons) :

```powershell
# CRON_SECRET lu depuis .env.local — ne le collez pas dans le chat
$secret = (Get-Content .env.local | Where-Object { $_ -match '^\s*CRON_SECRET\s*=' }) -replace '^\s*CRON_SECRET\s*=\s*',''
Invoke-WebRequest -Uri "https://auros-delta.vercel.app/api/admin/bootstrap-green-market" -Method POST -Headers @{ Authorization = "Bearer $secret" } -UseBasicParsing
```

## GitHub (optionnel, plus tard)

- Utile pour l’historique et la CI, **pas** pour que le site tourne.
- Quand vous voudrez : **GitHub Desktop** (interface graphique), sans ligne de commande `git` ni SSH.

## DATABASE_URL

- **Optionnel** si `npm run green:sync` fonctionne avec uniquement l’URL publique Supabase + la clé secrète.
- Les migrations SQL lourdes ont déjà été appliquées côté prod ; le bootstrap HTTP complète le reste si besoin.

## Vérifier que tout va bien

Ouvrez dans le navigateur : [https://auros-delta.vercel.app/green/market](https://auros-delta.vercel.app/green/market) — la page doit s’afficher (HTTP 200).

En cas de souci : relancez `npm run green:sync`, puis l’appel bootstrap ci-dessus, puis `npx vercel --prod --yes` seulement si vous avez modifié du code localement.

---

*Résumé : vous n’avez pas à configurer SSH Git ni à coller un mot de passe Postgres dans un terminal — gardez `.env.local` tel quel et utilisez les trois commandes ci-dessus selon le besoin (seed / bootstrap / déploiement).*
