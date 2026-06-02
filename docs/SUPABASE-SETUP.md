# Supabase — AUROS

## Installation (une fois)

1. Ouvrir [Supabase Dashboard](https://supabase.com/dashboard) → votre projet
2. **SQL Editor** → New query
3. Coller le contenu de `supabase/migrations/000_all_combined.sql`
4. **Run**

## Vérification

Dans **Table Editor**, vous devez voir :

- `dossiers`
- `leads` (avec colonne `consent`)
- `concierge_requests`
- `partner_requests`
- `dossier_shares`
- `academy_reminder_prefs`
- `academy_consumed_sessions`
- `academy_diploma_purchases`
- `academy_cert_registry`

## Migrations Academy (CLI)

```bash
npm run db:bootstrap:academy
```

Applique les migrations 0007–0010 (rappels, anti-replay, diplômes, registre). Nécessite `SUPABASE_ACCESS_TOKEN` ou `DATABASE_URL` dans `.env.local`.

## Clés API

Project Settings → API :

- `NEXT_PUBLIC_SUPABASE_URL` → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon public
- `SUPABASE_SECRET_KEY` → service_role (secret, serveur uniquement)

RLS est activé sans policies : tout passe par le serveur Next.js avec la clé secrète.
