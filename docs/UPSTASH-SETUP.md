# Upstash Redis — rate limits durables (prod)

Sans Upstash, `checkRateLimitAsync` / Toll metering tombent en **mémoire processus** : faible sur Vercel (plusieurs instances / cold starts).

**Bloquant pour un vrai pilote banque** (Policy / Eligibility sticky).

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

4. Vérif :

```bash
npm run prod:check
curl https://getauros.com/api/v1/toll/infra-status
```

Doit afficher `upstash.configured: true` et `reachable: true`.

## Code

- Helper partagé : `lib/upstash.ts` (`probeUpstashStatus`, `upstashCommand`)
- Consommateurs : `lib/rate-limit.ts`, Toll metering, protocol rate-limit
