# Mise en production AUROS — checklist unique

Ordre recommandé (~45–90 min la première fois). Chaque étape renvoie à la doc détaillée.

## 0. Pré-vol local

```bash
npm install
npm run build
npm run prod:check
```

Avec smoke HTTP (dev ou URL Vercel) :

```bash
npm run prod:check -- --http
BASE_URL=https://votre-domaine.vercel.app npm run prod:check -- --http
```

Rapport : `scripts/prod-preflight-report.txt`

---

## 1. Supabase (base + fichiers)

| # | Action | Doc |
|---|--------|-----|
| 1.1 | SQL Editor → coller `supabase/migrations/000_all_combined.sql` → **Run** | `docs/SUPABASE-SETUP.md` |
| 1.1b | Puis migrations incrémentales **dans l'ordre** : `0029`–`0033` (partenaires, nurture, eau) | `docs/RELEASE-ECOSYSTEM.md` |
| 1.2 | Vérifier tables : `dossiers`, `dossier_files`, `leads`, `concierge_requests`, `partner_requests`, `dossier_shares` | Table Editor |
| 1.3 | Storage → bucket **`dossier-files`** (privé) | `docs/SUPABASE-STORAGE.md` |
| 1.4 | Copier URL + `anon` + `service_role` → `.env.local` puis Vercel | Project Settings → API |

Requête de contrôle (SQL Editor) :

```sql
select table_name from information_schema.tables
where table_schema = 'public'
  and table_name in ('dossiers','dossier_files','leads','concierge_requests');
```

---

## 2. Clerk (auth production)

| # | Action |
|---|--------|
| 2.1 | Projet Clerk **Production** (pas seulement Development) |
| 2.2 | Clés prod → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` |
| 2.3 | Domains : ajouter `https://votre-domaine` (Vercel + custom si applicable) |
| 2.4 | Redirect URLs : `/sign-in`, `/sign-up`, `/dashboard` autorisés |

Variables optionnelles utiles :

- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`

---

## 3. Resend (e-mails clients)

| # | Action |
|---|--------|
| 3.1 | Créer clé API → `RESEND_API_KEY` |
| 3.2 | **Avant domaine vérifié** : `RESEND_FROM_EMAIL=onboarding@resend.dev` (envoi limité au compte Resend) |
| 3.3 | **Prod sérieuse** : ajouter domaine (DNS SPF/DKIM) → `noreply@votredomaine.com` |
| 3.4 | `RESEND_INTERNAL_EMAIL` = votre boîte (concierge + alertes) |
| 3.5 | Test : `node --env-file=.env.local scripts/test-resend.mjs` |

E-mails localisés (FR/EN/ES) : wizard complete, concierge, lead score, soumission dossier.

---

## 4. IA (génération dossier)

| # | Action |
|---|--------|
| 4.1 | Au minimum **`GEMINI_API_KEY`** (gratuit / quota) — voir `docs/AI-COSTS.md` |
| 4.2 | Recommandé : `GROQ_API_KEY` + `MISTRAL_API_KEY` (fallback) |
| 4.3 | `AI_DAILY_GENERATION_CAP=200` (ajuster selon trafic) |
| 4.4 | **Production** : ne pas définir `AUROS_SIMULATION=true` |

---

## 5. Vercel (deploy)

| # | Action | Doc |
|---|--------|-----|
| 5.1 | Importer repo → Framework Next.js | `docs/DEPLOY-VERCEL.md` |
| 5.2 | Coller **toutes** les variables de `.env.example` (valeurs prod) | |
| 5.3 | `NEXT_PUBLIC_SITE_URL=https://votre-domaine` (sans slash final) | |
| 5.4 | Deploy → vérifier build vert | |
| 5.5 | Redeploy après chaque changement de variable | |

---

## 6. Checklist fonctionnelle (prod)

Cocher sur l’URL de production :

- [ ] Home → score rapide → e-mail (si consent)
- [ ] `/wizard` parcours complet + **express** (`/wizard?expert=1`)
- [ ] Génération dossier IA → `/dossier`
- [ ] Data room : liste repliée + 3 priorités + upload (compte connecté + dossier sauvegardé)
- [ ] Soumission dossier → e-mail utilisateur
- [ ] Connexion Clerk → dashboard → reprise dossier
- [ ] Partage lien dossier
- [ ] Concierge (si score/valeur éligibles)
- [ ] Pages legal / privacy / cookies
- [ ] **Écosystème Green / Eau** — voir `docs/GREEN-BETA-CHECKLIST.md` + `docs/EAU-PILOT.md`
- [ ] `/eau` + `/eau/embed` + `POST /api/eau/check`
- [ ] `/partners/portal` — lookup code partenaire test
- [ ] Green Label checkout 300 € (Stripe test puis live)
- [ ] Lead nurture cron (`CRON_SECRET` + migration `0032`)

Kit pilote partenaire :

```bash
PARTNER_CODE=VOTRE_CODE npm run partner:pilot-kit
```

---

## 7. Exploitation solo (sans UI admin)

```bash
npm run ops:status -- <dossier-uuid> in_review
```

Voir `docs/OPS-SOLO.md` — e-mail statut optionnel via script.

---

## 8. Écosystème partenaires & eau

| Doc | Usage |
|-----|--------|
| `docs/RELEASE-ECOSYSTEM.md` | Message release + checklist merge/deploy |
| `docs/PARTNER-PILOT.md` | Onboarding utilities / cabinets |
| `docs/EAU-PILOT.md` | Rail H₂O, APIs, embed |

```bash
npm run partner:pilot-kit          # PARTNER_CODE=... requis
npm run verify:integrations        # smoke intégrations optionnelles
```

---

## 9. Optionnel plus tard

| Variable | Usage |
|----------|--------|
| `PARTNER_WEBHOOK_URL` | Notification externe à la soumission |
| `PARTNER_WEBHOOK_SECRET` | Header `X-Auros-Secret` |
| `CRON_SECRET` | Crons Vercel (nurture, Green, protocol) |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Green Label + jurisdictions |
| `SENTRY_DSN` | Monitoring erreurs |

---

## Variables obligatoires (résumé)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SECRET_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_SITE_URL          # https en prod
GEMINI_API_KEY                # ou GROQ_API_KEY au minimum
RESEND_API_KEY
RESEND_FROM_EMAIL
RESEND_INTERNAL_EMAIL
CRON_SECRET                   # crons Vercel
STRIPE_SECRET_KEY             # Green Label + jurisdictions
STRIPE_WEBHOOK_SECRET
```

---

## Dépannage rapide

| Symptôme | Cause probable |
|----------|----------------|
| Upload data room échoue | Bucket `dossier-files` manquant |
| E-mails jamais reçus | Domaine Resend non vérifié / mauvaise `RESEND_FROM` |
| IA toujours template | `AUROS_SIMULATION=true` ou clés IA absentes |
| Clerk redirect loop | Domaine prod non ajouté dans Clerk |
| Liens e-mail cassés | `NEXT_PUBLIC_SITE_URL` encore en localhost |
| Portail partenaire vide | Migration `referred_by` manquante (`0029`/`0030`) |
| Nurture ne part pas | `CRON_SECRET` absent ou migration `0032` |
| Green Label échoue | `STRIPE_*` ou migration `0031` |
