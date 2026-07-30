# Upstash Redis — rate limits durables + compare alert store (prod)

Sans Upstash, `checkRateLimitAsync` / Toll metering tombent en **mémoire processus** : faible sur Vercel (plusieurs instances / cold starts).

Compare alert watchers / APY snapshots (`/api/compare-alerts-waitlist`, cron compare-apy-alerts) utilisent aussi Upstash quand configuré ; sinon fichier `.data` (souvent **éphémère** sur serverless).

**Bloquant pour un vrai pilote banque** (Policy / Eligibility sticky) et pour des alertes compare durables.

## Setup (5 min)

1. Créer un Redis gratuit : [console.upstash.com](https://console.upstash.com/)
2. Copier **REST URL** + **REST TOKEN**
3. Vercel → Project → Settings → Environment Variables (Production) :

```
UPSTASH_REDIS_REST_URL=https://….upstash.io
UPSTASH_REDIS_REST_TOKEN=…
```

Ou CLI :

```bash
npx vercel env add UPSTASH_REDIS_REST_URL production
npx vercel env add UPSTASH_REDIS_REST_TOKEN production
npx vercel deploy --prod
```

4. Vérif (opérateur, machine de confiance) :

```bash
npm run prod:check
```

Confirmer via les outils internes authentifiés que Redis est configuré et joignable — **ne pas** publier d’URLs de probe ni de recettes curl.

## Code

- Helper partagé : `lib/upstash.ts` (`probeUpstashStatus`, `upstashCommand`)
- Consommateurs : `lib/rate-limit.ts`, Toll metering, protocol rate-limit, `lib/comparators/alerts-durable-store.ts`
