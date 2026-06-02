# Simulation & démo AUROS

## Mode simulation (sans coût IA)

Dans `.env.local` :

```env
AUROS_SIMULATION=true
```

Effets :

- `POST /api/generate` renvoie un dossier **template** (`provider: simulation`), sans appel Gemini/Groq/Mistral.
- Webhook partenaire (`PARTNER_WEBHOOK_URL`) : **log console** uniquement.

## Démo wizard (navigateur)

```
http://localhost:3000/wizard?demo=1
```

Préremplit un dossier type « Villa Bordeaux 1,2 M€ » et place à l'étape 15 (récap).

## Agents de simulation (écosystème)

Le moteur `lib/simulation/ecosystem.ts` orchestre plusieurs **agents** qui vérifient l'écosystème AUROS :

| Agent | Fichier | Vérifie |
|-------|---------|---------|
| **wizard** | `agents/wizard.agent.ts` | Score, admission, compliance, studio, phases wizard |
| **jurisdictions** | `agents/jurisdictions.agent.ts` | Filtres, SEO landings, pricing, emails, génération Starter Kit + PDF |
| **comparators** | `agents/comparators.agent.ts` | Routes, i18n, filtres DefiLlama |
| **integrations** | `agents/integrations.agent.ts` | Supabase, Stripe, Resend, CRON secret |
| **http** | `agents/http.agent.ts` | Smoke HTTP (pages, sitemap, PDF, SEO samples) |

### Rapport automatisé

```bash
# Logique locale + intégrations (sans serveur)
npm run simulate

# + smoke HTTP (serveur local requis : npm run dev)
npm run simulate:http

# Production Vercel
npm run simulate:prod

# Sans probes DB/env
npm run simulate -- --no-integrations
```

Variables utiles :

```env
AUROS_SIMULATION=true      # active POST /api/generate en mode template
BASE_URL=http://localhost:3000
SIMULATE_HTTP=1            # équivalent --http
SIMULATE_NO_INTEGRATIONS=1 # équivalent --no-integrations
```

Écrit `scripts/simulate-report.txt`. Exit code `1` si un check **FAIL** (warnings seuls = OK).

### API JSON

Dev ou `AUROS_SIMULATION=true` en prod :

```
GET /api/simulate
GET /api/simulate?http=1
GET /api/simulate?integrations=0
GET /api/simulate?format=text
```

### CI

Les tests `tests/simulation-ecosystem.test.ts` couvrent les agents locaux (sans HTTP ni intégrations).

## Webhook soumission plateforme

```env
PARTNER_WEBHOOK_URL=https://hook.eu2.make.com/...
PARTNER_WEBHOOK_SECRET=optional-shared-secret
```

Déclenché après `submitDossierAction` (statut `submitted` + emails Resend).

Payload :

```json
{
  "event": "dossier.submitted",
  "dossierId": "uuid",
  "assetType": "Real estate",
  "score": 72,
  "admissionPercent": 68,
  "platform": "Centrifuge",
  "country": "France",
  "submittedAt": "2026-05-20T12:00:00.000Z"
}
```
