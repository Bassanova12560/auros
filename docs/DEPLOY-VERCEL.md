# Déploiement Vercel — AUROS

> **INTERNAL** — Prefer private repo. Do not paste project IDs, tokens, or env values into public issues / changelogs.

**Checklist complète** : `docs/PROD-LAUNCH.md` · pré-vol : `npm run prod:check`

## 1. Pousser le code

```bash
git push origin main
```

### Auto-deploy GitHub (recommandé)

#### A — Intégration Git Vercel (natif)

1. Installer / configurer l’[app Vercel sur GitHub](https://github.com/apps/vercel) → autoriser ce repo.  
2. Vercel → projet → Settings → Git : Connect le remote, Production Branch = `main`.  
3. Optionnel CLI : `npx vercel git connect <remote-url>`

#### B — Fallback GitHub Actions

Workflow [`.github/workflows/deploy-vercel.yml`](../.github/workflows/deploy-vercel.yml).

Configurer les secrets Actions depuis le dashboard Vercel / GitHub (**jamais** committer les IDs ou tokens) :

| Secret | Source |
|--------|--------|
| `VERCEL_TOKEN` | [Create Token](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel project settings / `vercel link` |
| `VERCEL_PROJECT_ID` | idem |

Déploiement manuel :

```bash
npx vercel --prod
```

## 2. Variables d'environnement

Copier depuis `.env.example` / `.env.local` vers Vercel → Environment Variables (Production).  
Ne pas coller de valeurs secrètes dans ce dépôt ni dans des tickets publics.

Sync helpers (machine de confiance uniquement) :

```bash
npm run green:sync-clerk
npm run green:sync-stripe
```

Puis **Redeploy** après changement de clés.

## 3. Clerk (production)

1. Instance **Production** (pas Development).  
2. Domains : domaine custom + www.  
3. Clés live dans env Vercel / `.env.local` — jamais dans git.  
4. `npm run green:sync-clerk` puis redeploy.  
5. `npm run prod:check` sans warning `pk_test_`.

## 4. Supabase

Exécuter les migrations opératrices (`supabase/migrations/…`) dans le SQL Editor.

## 5. Checklist post-deploy

Voir section **6** de `docs/PROD-LAUNCH.md`.

```bash
BASE_URL=https://getauros.com npm run prod:check -- --http
```
