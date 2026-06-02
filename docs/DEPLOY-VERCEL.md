# Déploiement Vercel — AUROS

**Checklist complète** : `docs/PROD-LAUNCH.md` · pré-vol : `npm run prod:check`

## 1. Pousser le code

```bash
git push origin main
```

## 2. Variables d'environnement (Settings → Environment Variables)

Copier **toutes** les valeurs de `.env.local` :

| Variable | Production |
|----------|------------|
| `GROQ_API_KEY` | ✓ |
| `GEMINI_API_KEY` | ✓ |
| `MISTRAL_API_KEY` | ✓ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✓ |
| `CLERK_SECRET_KEY` | ✓ |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_SUPABASE_URL` | ✓ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✓ |
| `SUPABASE_SECRET_KEY` | ✓ |
| `NEXT_PUBLIC_SITE_URL` | `https://auros-delta.vercel.app` (ou domaine custom) |
| `RESEND_API_KEY` | ✓ |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` ou `noreply@votredomaine.com` |
| `RESEND_INTERNAL_EMAIL` | votre email |

## 3. Clerk (production)

Dans Clerk Dashboard → Domains, ajouter l’URL Vercel de prod.

## 4. Supabase

Exécuter `supabase/migrations/000_all_combined.sql` dans le SQL Editor.

## 5. Redeploy

Deployments → Redeploy après ajout des variables.

## Checklist post-deploy

Voir section **6** de `docs/PROD-LAUNCH.md` (express, data room upload, e-mails, concierge).

```bash
BASE_URL=https://votre-domaine.vercel.app npm run prod:check:http
```
