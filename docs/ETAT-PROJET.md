# AUROS — état du projet

Voir aussi : `docs/PRODUIT-AUROS.md`, `docs/MODELE-ECONOMIQUE.md`, `docs/VISION-RETENU.md`, `docs/RWA-DATA-ROOM.md`.

## Stack
Next.js 16 · React 19 · Clerk · Supabase · Resend · Groq/Gemini/Mistral

## Produit livré
- Wizard 15 étapes + data room 15 documents (5 phases)
- **Upload fichiers** data room (PDF/images/DOCX, bucket `dossier-files`)
- Taux d’admission + matrice 8 plateformes RWA
- Studio tokenisation (réglementaire, tokenomics, roadmap, prestataires) — **FR/EN/ES**
- Dossier IA + PDF + partage + concierge
- Dossier `/dossier/[id]` + `?id=` · reprise wizard · export pack juridique `.md`
- Statuts : draft → generated → submitted → in_review / needs_info / approved
- Sync invité + soumission · emails · webhook `PARTNER_WEBHOOK_URL`
- Pages legal/privacy/terms/cookie i18n · PDF FR/EN/ES · footer & home i18n
- E-mails soumission localisés · `npm run ops:status` (solo, sans UI admin)
- Tests · CI
- **UX psychologie** : parcours en 4 parties, temps estimé, copy rassurante (`lib/wizard-journey-i18n.ts`), bandeau sérieux (`ProfessionalTrustBar`), règle agent `.cursor/rules/ux-psychology.mdc`
- **Data room** : panneau 3 priorités + liste 15 docs repliée (`lib/data-room-ease.ts`, `DataRoomEasePanel`)
- **E-mails** : wizard complete + concierge + lead score **FR/EN/ES** (`lib/emails/locale-templates.ts`)
- **Parcours express** : `/wizard?expert=1` · 8 écrans · défauts conformité indicatifs (`lib/wizard-expert-path.ts`)

## À faire (toi, hors code)

**Guide pas à pas** : `docs/PROD-LAUNCH.md` · `npm run prod:check`

1. SQL Supabase (`000_all_combined.sql` inclut **0004** fichiers + statuts)
2. Bucket Storage `dossier-files` (`docs/SUPABASE-STORAGE.md`)
3. Variables Vercel + redeploy (`docs/DEPLOY-VERCEL.md`)
4. Domaine Resend (emails clients)

## Simulation
- `AUROS_SIMULATION=true` — IA template, webhook log-only
- `/wizard?demo=1` — dossier démo prérempli
- `npm run simulate` · `GET /api/simulate?http=1`
- Voir `docs/SIMULATION.md`

## Commandes
```bash
npm run dev
npm run build
npm run simulate
npm run prod:check
npm test
node scripts/test-resend.mjs
```
