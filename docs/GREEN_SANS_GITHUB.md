# AUROS Green — sans GitHub ni DATABASE_URL

Vous n’avez **pas besoin de GitHub** pour que le site et les opérations Green tournent en production. Une seule commande locale après modification du code, plus des **crons Vercel** pour tout le reste.

Prérequis Vercel (une fois) : variable d’environnement **`CRON_SECRET`** sur le projet — Vercel envoie alors `Authorization: Bearer <CRON_SECRET>` sur chaque cron.

## Automatisation complète

### Ce qui tourne tout seul (Vercel Cron)

| Horaire (UTC) | Route | Rôle |
|---------------|-------|------|
| Tous les jours 06:30 | `/api/cron/green-health` | Smoke HTTP des pages Green clés (logs + 503 si KO) |
| Tous les jours 10:00 | `/api/cron/green-label-reminders` | Relances dossiers label incomplets |
| Lundi 07:00 | `/api/cron/green-label-export-weekly` | Export CSV hebdo vers ops (e-mail) |
| Dimanche 04:00 | `/api/admin/bootstrap-green-market?seedOnly=1` | Re-seed marché (sans migrations SQL lourdes) |

Autres crons du projet (hors Green pur) : jurisdiction 08:00, academy 09:00 — voir `vercel.json`.

Aucune action manuelle pour : relances label, export hebdo, seed hebdo marché, surveillance pages Green.

### Après chaque changement de code (une commande)

```powershell
cd C:\Users\adrie\auros
npm run green:deploy
```

Enchaîne : `test:green` → `build` → `vercel --prod --yes` → `green:sync` (seed Supabase via clés `.env.local`).

Équivalent tout-en-un avec contrôle santé :

```powershell
.\scripts\green-autopilot.ps1
```

Options :

- `-HealthOnly` — `npm run green:health` seulement  
- `-SyncOnly` — seed marché seulement  
- `-SkipDeploy` — sync + health sans redeploy  

Sous Linux/macOS :

```bash
chmod +x scripts/green-autopilot.sh
./scripts/green-autopilot.sh
```

### Vérifier la prod à la main

```powershell
npm run green:health
```

Teste : `/green/register`, `/green/market`, `/green/label`, `/green/compare`, `/green/rtms-assistant` (URL depuis `AUROS_PROD_URL`, `NEXT_PUBLIC_SITE_URL` ou prod par défaut).

### Planifier en local (sans GitHub)

**Windows — Planificateur de tâches**

1. Action : `powershell.exe -NoProfile -ExecutionPolicy Bypass -File C:\Users\adrie\auros\scripts\green-autopilot.ps1 -SkipDeploy`  
2. Déclencheur : hebdomadaire (ex. dimanche 05:00) si vous voulez un sync local en plus du cron Vercel.  
3. Répertoire de départ : `C:\Users\adrie\auros`  
4. Compte avec accès à `.env.local` (variables Supabase + optionnel `CRON_SECRET`).

**Linux/macOS — cron**

```cron
0 5 * * 0 cd /chemin/vers/auros && ./scripts/green-autopilot.sh --skip-deploy >> /tmp/green-autopilot.log 2>&1
```

Pour publier du code depuis une machine de build : remplacez `--skip-deploy` par l’appel complet (sans flag).

## Ce qui a été fait pour vous (référence)

- `npm run green:sync` — synchronise le marché vert via Supabase (pas besoin de `DATABASE_URL` si le script réussit).
- Crons prod avec `CRON_SECRET` (Bearer automatique côté Vercel).
- `npm run green:health` — smoke pages publiques.

## Pour mettre à jour le site (code déployé)

```powershell
npm run green:deploy
```

ou, sans tests ni seed :

```powershell
npx vercel --prod --yes
```

Aucun compte GitHub : Vercel CLI + session locale.

## Pour re-seeder le marché vert (données)

```powershell
npm run green:sync
```

Prérequis : `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SECRET_KEY` dans `.env.local`.

Message attendu : *« No SQL credentials — seeding via service role »* puis *« Green marketplace seed complete »*.

Optionnel (prod, même secret que les crons) :

```powershell
# CRON_SECRET lu depuis .env.local — ne le collez pas dans le chat
$secret = (Get-Content .env.local | Where-Object { $_ -match '^\s*CRON_SECRET\s*=' }) -replace '^\s*CRON_SECRET\s*=\s*','' -replace '^["'']|["'']$',''
Invoke-WebRequest -Uri "https://auros-delta.vercel.app/api/admin/bootstrap-green-market?seedOnly=1" -Method GET -Headers @{ Authorization = "Bearer $secret" } -UseBasicParsing
```

## GitHub (optionnel)

- Workflow `.github/workflows/green.yml` : CI + bootstrap si vous utilisez GitHub plus tard.
- **Non requis** pour prod, crons, seed ni deploy.

## DATABASE_URL

- **Optionnel** si `npm run green:sync` fonctionne avec URL Supabase + clé secrète.
- Migrations lourdes : déjà en prod ; cron hebdo `?seedOnly=1` ne fait que le seed.

## Vérifier que tout va bien

```powershell
npm run green:health
```

Ou navigateur : [https://auros-delta.vercel.app/green/market](https://auros-delta.vercel.app/green/market).

En cas de souci : `npm run green:sync`, puis bootstrap HTTP ci-dessus, puis `npm run green:deploy` si le code a changé.

---

*Résumé : gardez `.env.local` et `CRON_SECRET` sur Vercel ; une commande `green:deploy` après code ; le reste est cron + scripts autopilot.*
