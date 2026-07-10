# Déploiement Vercel — AUROS

**Checklist complète** : `docs/PROD-LAUNCH.md` · pré-vol : `npm run prod:check`

## 1. Pousser le code

```bash
git push origin main
```

### Auto-deploy GitHub (recommandé)

Si les pushes ne déclenchent plus de build Vercel :

```bash
npx vercel git connect https://github.com/Bassanova12560/auros.git
```

Vérifier dans **Vercel → Project → Settings → Git** : repo connecté, branche `main`, Production Branch = `main`.

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
npx vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
npx vercel env add CLERK_SECRET_KEY production
```

Puis **Redeploy** (obligatoire après changement de clés).

## 3. Clerk (production)

1. Clerk Dashboard → **Configure → Domains** : ajouter `getauros.com` (et `www.getauros.com` si utilisé).
2. **API Keys** : copier les clés **Production** (`pk_live_` / `sk_live_`) dans Vercel (section 2).
3. Vérifier : `npm run prod:check` ne doit plus afficher le warning `pk_test_`.

## 4. Supabase

Exécuter `supabase/migrations/000_all_combined.sql` dans le SQL Editor.

## 5. Redeploy

Deployments → Redeploy après ajout des variables.

## Checklist post-deploy

Voir section **6** de `docs/PROD-LAUNCH.md` (express, data room upload, e-mails, concierge).

```bash
BASE_URL=https://getauros.com npm run prod:check -- --http
```
