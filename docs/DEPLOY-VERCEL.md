# Déploiement Vercel — AUROS

**Checklist complète** : `docs/PROD-LAUNCH.md` · pré-vol : `npm run prod:check`

## 1. Pousser le code

```bash
git push origin main
```

### Auto-deploy GitHub (recommandé)

Deux chemins — **A (natif)** préféré, **B (Actions)** si `vercel git connect` échoue.

#### A — Intégration Git Vercel (natif)

1. Ouvrir [Installer / configurer l’app Vercel sur GitHub](https://github.com/apps/vercel) → **Configure** → autoriser le repo `Bassanova12560/auros` (ou *All repositories*).
2. Dans [Vercel → auros → Settings → Git](https://vercel.com/adrienbalitrand-7929s-projects/auros/settings/git) : Connect `Bassanova12560/auros`, Production Branch = `main`.
3. CLI (après l’étape 1) :

```bash
npx vercel git connect https://github.com/Bassanova12560/auros.git
```

Si l’erreur *Failed to connect… access* revient : l’app GitHub n’a pas encore accès au repo — reprendre l’étape 1.

#### B — Fallback GitHub Actions

Workflow [`.github/workflows/deploy-vercel.yml`](../.github/workflows/deploy-vercel.yml) : push `main` → build + deploy prod.

Secrets GitHub (`Settings → Secrets and variables → Actions`) :

| Secret | Valeur |
|--------|--------|
| `VERCEL_TOKEN` | [Create Token](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | `team_IBN99LMW1bdclKpsNdqEo36J` |
| `VERCEL_PROJECT_ID` | `prj_Iwegxo1eUkr3qcZUhnQCYbqvWdPi` |

Puis *Actions → Deploy Vercel → Run workflow* pour tester.

Sinon déploiement manuel :

```bash
npx vercel --prod
```

## 2. Variables d'environnement (Settings → Environment Variables)

Copier **toutes** les valeurs de `.env.local` :

| Variable | Production |
|----------|------------|
| `GROQ_API_KEY` | ✓ |
| `GEMINI_API_KEY` | ✓ |
| `MISTRAL_API_KEY` | ✓ |
| `OPENROUTER_API_KEY` | optionnel — modèles `:free` (filet quota) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✓ **`pk_live_…`** (pas `pk_test_`) |
| `CLERK_SECRET_KEY` | ✓ **`sk_live_…`** (pas `sk_test_`) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_SUPABASE_URL` | ✓ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✓ |
| `SUPABASE_SECRET_KEY` | ✓ |
| `NEXT_PUBLIC_SITE_URL` | `https://getauros.com` |
| `RESEND_API_KEY` | ✓ |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` ou `noreply@votredomaine.com` |
| `RESEND_INTERNAL_EMAIL` | votre email |

Mettre à jour une variable en CLI :

```bash
npm run green:sync-clerk   # pk/sk + URLs depuis .env.local → Vercel prod + preview
npm run green:sync-stripe  # Stripe depuis .env.local → Vercel prod
```

Ou manuellement :

```bash
npx vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
npx vercel env add CLERK_SECRET_KEY production
```

**Instance dev + domaine custom** : si vous n'avez que `pk_test_`, ajoutez `https://getauros.com` dans Clerk → Configure → Allowed origins (ou `npm run green:sync-clerk` après PATCH API).

Puis **Redeploy** (obligatoire après changement de clés).

## 3. Clerk (production)

1. Clerk Dashboard → basculer sur l’instance **Production** (pas Development).
2. **Configure → Domains** : `getauros.com` + `www.getauros.com`.
3. **API Keys** : copier `pk_live_…` + `sk_live_…` dans `.env.local`.
4. Sync + redeploy :

```bash
npm run green:sync-clerk   # refuse pk_test_ → prod (sauf FORCE_CLERK_TEST_SYNC=1)
npx vercel --prod
```

5. Vérifier : `npm run prod:check` ne doit plus afficher le warning `pk_test_`.

**Instance dev + domaine custom (intérim)** : si vous n'avez que `pk_test_`, ajoutez `https://getauros.com` dans Clerk → Allowed origins. Ne pas resync vers Vercel sans `FORCE_CLERK_TEST_SYNC=1`.

## 4. Supabase

Exécuter `supabase/migrations/000_all_combined.sql` dans le SQL Editor.

## 5. Redeploy

Deployments → Redeploy après ajout des variables.

## Checklist post-deploy

Voir section **6** de `docs/PROD-LAUNCH.md` (express, data room upload, e-mails, concierge).

```bash
BASE_URL=https://getauros.com npm run prod:check -- --http
```
