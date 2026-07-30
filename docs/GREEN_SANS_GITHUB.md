# AUROS Green — ops without GitHub

> **INTERNAL / OPERATOR DOC** — Do not republish cron schedules, admin paths, or auth header recipes in public channels, changelogs, or LinkedIn. Prefer private repo visibility for this file.

You do **not** need GitHub for the site and Green operations to run in production. Deploy with Vercel CLI from a trusted machine; keep secrets only in Vercel / `.env.local`.

## After each code change

```powershell
cd C:\Users\adrie\auros
npm run green:deploy
```

Runs: `test:green` → `build` → `vercel --prod` → `green:sync` (Supabase seed via local env).

All-in-one with health check:

```powershell
.\scripts\green-autopilot.ps1
```

Options: `-HealthOnly` · `-SyncOnly` · `-SkipDeploy`

Linux/macOS: `./scripts/green-autopilot.sh`

## Verify production (public pages)

```powershell
npm run green:health
```

Smoke-tests public Green pages (URL from `AUROS_PROD_URL`, `NEXT_PUBLIC_SITE_URL`, or prod default). Browser check: [https://getauros.com/green/market](https://getauros.com/green/market).

## Re-seed green market data

```powershell
npm run green:sync
```

Requires Supabase URL + service role in `.env.local`. Never paste secrets into chat or tickets.

## Scheduled work

Production scheduling and operator bootstrap use **authenticated internal tooling** configured in the host (Vercel). Do **not** document route maps, Bearer recipes, or secret names in public READMEs.

## GitHub (optional)

CI workflows under `.github/workflows/` are optional. Not required for prod deploy or seed.

## DATABASE_URL

Optional if `npm run green:sync` succeeds with Supabase URL + secret key. Heavy migrations are applied separately by operators.

---

*Keep `.env.local` out of git. Secrets only on Vercel / local env.*
