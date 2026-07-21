# Upstash Redis — rate limits durables (prod)

Sans Upstash, `checkRateLimitAsync` tombe en mémoire processus : **faible** sur Vercel (plusieurs instances / cold starts).

## Setup (5 min)

1. Créer un Redis gratuit : [console.upstash.com](https://console.upstash.com/)
2. Copier **REST URL** + **REST TOKEN**
3. Vercel → Project → Settings → Environment Variables (Production) :

```
UPSTASH_REDIS_REST_URL=https://….upstash.io
UPSTASH_REDIS_REST_TOKEN=…
```

4. Redeploy : `npx vercel deploy --prod`

## Vérif

```bash
npm run prod:check
```

Doit afficher `upstash` = ok.
