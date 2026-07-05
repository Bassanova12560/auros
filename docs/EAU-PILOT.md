# Pilote eau / H₂O — déploiement rail hydrique AUROS

AUROS = **couche d'infrastructure obligatoire** avant tokenisation on-chain : scoring H₂O gratuit → Passeport Hydrique vérifiable → Green Label optionnel.

---

## Architecture funnel

```
Landing SEO (/comment-tokeniser/eau)
        ↓
Hub /eau (checker + narrative)
        ↓
Preview H₂O (gratuit, passport_required: true)
        ↓
Wizard Green (Passeport Hydrique dossier)
        ↓
Green Label 300 € (optionnel, Stripe)
```

**Embed partenaire :** `/eau/embed?partner=CODE` → même funnel avec attribution.

---

## Surfaces produit

| Route | Rôle |
|-------|------|
| `/eau` | Hub + checker intégré |
| `/comment-tokeniser/eau` | Landing SEO FR/EN/ES |
| `/eau/embed` | Widget iframe partenaire |
| `/eau/embed/docs` | Snippets iframe + JS + API |
| `/eau/verify/[previewId]` | Page unlock Passeport |

---

## APIs

### Public (sans auth)

```bash
# Catalog reference
GET /api/green/h2o/pilot-concession-france

# Readiness check (embed / headless)
POST /api/eau/check
Content-Type: application/json
{"text":"Concession eau potable 15 ans 2 Mm³/an SPV France"}
```

Toutes les réponses incluent `passport_required: true`.

### Premium (API key)

```bash
POST /api/v1/green/h2o/batch
Authorization: Bearer <API_KEY>
{"items":[{"id":"pilot-concession-france"}]}
```

Docs dev : `/developers/docs/endpoint-green-h2o`

SDK : `client.greenH2oScore(id)` · `client.greenH2oBatch(body)`  
MCP : `green_h2o_score` · `green_h2o_batch`

---

## postMessage (embed JS)

Source : `auros-embed`

| Type | Déclencheur |
|------|-------------|
| `auros:h2o:ready` | Mount widget |
| `auros:h2o:score` | Preview calculé |
| `auros:h2o:passport` | Clic CTA Passeport |

Implémentation : `lib/eau/embed-events.ts`

---

## CSP / iframe

`next.config.ts` autorise `frame-ancestors *` **uniquement** sur `/eau/embed/*`.

Les partenaires peuvent intégrer sans proxy — le widget redirige le top window vers le wizard AUROS au clic Passeport.

---

## Migration Supabase

```sql
-- 0033_green_water_infrastructure.sql
-- Étend green registry / label pour project_type = water
```

Appliquer après `0031` (label payment) et `0032` (lead nurture).

---

## Smoke test post-deploy

```bash
BASE_URL=https://getauros.com npm run prod:check -- --http
```

Ciblés :

```bash
curl -sS "$BASE_URL/api/green/h2o/pilot-concession-france" | jq '.passport_required'
# → true

curl -sS -X POST "$BASE_URL/api/eau/check" \
  -H "Content-Type: application/json" \
  -d '{"text":"Concession eau 2 Mm³/an France DNSH"}' | jq '.ok'
# → true
```

---

## SEO

Routes indexées : `/eau`, `/comment-tokeniser/eau`, `/eau/embed/docs`

Post-deploy :

```bash
npm run seo:submit
```

---

## Narratif commercial (utilities)

1. **Gratuit** — preview H₂O + readiness (lead gen)
2. **Passeport** — dossier structuré m³, concession, DNSH eau (monétisation wizard / data room)
3. **Label** — 300 € Green Label (signal investisseur)
4. **API batch** — due diligence fonds / utilities (quota premium)

Ne pas promettre liquidité ou déploiement on-chain — AUROS structure l'amont réglementaire.

---

## Voir aussi

- `docs/PARTNER-PILOT.md` — onboarding partenaire
- `docs/RELEASE-ECOSYSTEM.md` — release + checklist globale
- `lib/green/scoring/h2o-score.ts` — moteur scoring
