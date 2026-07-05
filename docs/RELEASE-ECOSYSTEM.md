# Release écosystème AUROS — message & checklist déploiement

> Branche : `cursor/ecosystem-consolidation-18e0` · PR [#7](https://github.com/Bassanova12560/auros/pull/7)  
> Cible prod : `https://getauros.com` (ou `NEXT_PUBLIC_SITE_URL` canonique)

---

## Message de release (copier-coller)

**Titre :** AUROS Écosystème — Portail partenaires, Green Label 300 €, nurturing leads, rail H₂O

**Résumé :**

Cette release consolide le funnel RWA Green et positionne AUROS comme **infrastructure obligatoire** avant toute tokenisation hydrique :

- **Portail partenaires** (`/partners/portal`) — stats leads/dossiers, liens wizard, widget H₂O, commission indicative
- **Green Label Stripe** — checkout 300 €, webhook, traçabilité `paid_at`
- **Lead nurturing** — cron quotidien, e-mails J+1 / J+3, routing wizard Green pour eau & énergie
- **Rail H₂O** — hub `/eau`, landing SEO `/comment-tokeniser/eau`, API publique + batch premium, embed iframe/JS avec `postMessage`
- **SDK & MCP** — `greenH2oScore` / `greenH2oBatch`

**Positionnement eau :** preview H₂O gratuit → `passport_required: true` sur toutes les réponses API → Passeport Hydrique vérifiable uniquement via le wizard AUROS (+ Green Label optionnel).

**Migrations Supabase (ordre strict) :**

1. `0031_green_label_payment.sql`
2. `0032_leads_nurture.sql`
3. `0033_green_water_infrastructure.sql`
4. `0034_ecosystem_functional.sql` — partner codes, embed events, waitlists, label bucket

Or automated (Bearer `CRON_SECRET`):

```bash
curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
  https://getauros.com/api/admin/bootstrap-ecosystem
```

**Tests :** 557 passent · `npm run prod:check -- --http` après deploy

---

## Checklist déploiement (45–60 min)

### A. Avant merge

- [ ] Review PR #7
- [ ] `npm test` vert en local
- [ ] `npm run build` vert
- [ ] Fermer PRs draft #3–#6 (supersédées)

### B. Merge & Vercel

- [ ] Merger PR #7 → `main`
- [ ] Vercel redeploy automatique (ou `npm run green:deploy` si workflow Green)
- [ ] Vérifier build vert sur le commit merge

### C. Supabase

Exécuter dans SQL Editor **dans l'ordre** (si pas déjà appliquées) :

```sql
-- 0031 → paid_at Green Label
-- 0032 → locale, nurture_step, last_nurture_at sur leads
-- 0033 → type water sur registry / label
```

Contrôle rapide :

```sql
select column_name from information_schema.columns
where table_name = 'leads' and column_name in ('nurture_step', 'locale');

select column_name from information_schema.columns
where table_name = 'green_label_applications' and column_name = 'paid_at';
```

Tables partenaires (attribution) — migration `0029` / `0030` si absentes :

```sql
select column_name from information_schema.columns
where table_name in ('leads','dossiers') and column_name = 'referred_by';
```

### D. Variables d'environnement Vercel

| Variable | Obligatoire | Usage |
|----------|-------------|-------|
| `NEXT_PUBLIC_SITE_URL` | Oui | `https://getauros.com` sans slash |
| `CRON_SECRET` | Oui | Crons Vercel (nurture, Green, protocol) |
| `STRIPE_SECRET_KEY` | Oui | Green Label 300 € |
| `STRIPE_WEBHOOK_SECRET` | Oui | `/api/webhooks/stripe` |
| `RESEND_*` | Oui | Nurturing + transactional |
| `PARTNER_WEBHOOK_URL` | Optionnel | Notification soumission dossier |
| `PARTNER_WEBHOOK_SECRET` | Optionnel | Header `X-Auros-Secret` |

Voir `.env.example` pour la liste complète.

### E. Smoke test production

```bash
BASE_URL=https://getauros.com npm run prod:check -- --http
```

Manuel :

- [ ] `/eau` — checker + CTA Passeport
- [ ] `/eau/embed?partner=TEST` — widget iframe
- [ ] `/eau/embed/docs` — snippets iframe + JS
- [ ] `/comment-tokeniser/eau` — landing SEO
- [ ] `/partners/portal` — lookup code test
- [ ] `GET /api/green/h2o/pilot-concession-france` → 200 + `passport_required: true`
- [ ] `POST /api/eau/check` avec texte hydrique → 200
- [ ] Green Label checkout test (mode Stripe test si staging)

### F. SEO post-deploy

```bash
npm run seo:submit
```

Puis Google Search Console → soumettre sitemap.

### G. Pilote utilities (premier partenaire)

```bash
PARTNER_CODE=UTILITIES_FR npm run partner:pilot-kit
PARTNER_CODE=UTILITIES_FR npm run partner:pilot-kit -- --write
```

Docs détaillées : `docs/PARTNER-PILOT.md`, `docs/EAU-PILOT.md`

---

## Rollback

1. Revert merge commit sur `main`
2. Redeploy Vercel
3. Migrations Supabase : **ne pas** rollback sans backup (colonnes additive-only)

---

## Liens utiles

| Doc | Contenu |
|-----|---------|
| `docs/PROD-LAUNCH.md` | Checklist prod générale |
| `docs/PARTNER-PILOT.md` | Onboarding partenaire |
| `docs/EAU-PILOT.md` | Déploiement rail H₂O |
| `docs/GREEN-BETA-CHECKLIST.md` | QA Green |
| `app/eau/embed/docs` | Intégration widget (live) |
