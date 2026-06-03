# AUROS Green — audit implementation (2026-06-02)



## Step 0 — Verification



| Audit ID | Claim | Actual state | Action |

|----------|-------|--------------|--------|

| BUG-002 | Register form missing | `GreenRegisterView` + `GreenActorRegisterForm` + `saveGreenMarketActorAction` present | None |

| BUG-003 | Label flow missing | `GreenLabelForm` + `saveGreenLabelAction`; optional PDF via `uploadGreenLabelDocumentAction` + migration `0019` | Shipped |

| BUG-001 | Map static / no filters | Leaflet `GreenMarketMap`; search + pagination | Mobile map UX shipped |

| BUG-005 | No rate limits | In-memory limiter on green actions | None |

| UX-01 | Market search | Client search on snapshot | None |

| UX-03 | Register/label SSR | Step indicators + success links | Shipped |

| P3 | Hub KPIs hardcoded | `GreenHubMarketKpis` uses `marketSnapshot` | None |

| Pagination | Offers table | 10 per page | None |

| BUG-004 | Clerk on Green | **Clerk only on `/green/my`** (`GreenMyView` + `getGreenMyDashboardAction` / alerts). Register, label, market forms are public with rate limits — not “protected by Clerk”. | Documented |



## Sprint 2 (UX) — shipped



- **Onboarding** — `GreenHubOnboarding` on hub (3 steps: RTMS, marketplace, register), collapsible `<details>`.

- **Mobile map** — responsive min-height, touch-friendly popups, larger fitBounds padding on mobile.

- **Register/label progress** — `GreenFormStepBar`; label 2 steps; register 1/1; success links to `/green/my` and `/green/market`.

- **Market empty state** — reset filters CTA + link to `/green/register`.

- **i18n** — FR/EN/ES for onboarding, empty state, form steps, compare CSV, label PDF.



## Sprint 3 (light) — shipped



- **Label documents** — optional PDF (5 MB) → `green_label_applications.document_path`; bucket `green-label-documents` (create in Supabase dashboard).

- **Compare** — `/green/compare` verified; client-side **Export CSV** when rows exist.

- **Standards** — quick-nav grid (market, registry, compare, label) above methodology panels.



## Sprint 4 (polish + SEO) — shipped 2026-06-02

- **i18n label** — `websitePlaceholder` FR/EN/ES on `/green/label`.
- **Map a11y** — `role="region"` + `aria-label` on Leaflet container.
- **SEO** — `/green/register` in AI-first catalog; sitemap priority for `/green/market` and `/green/register`.

## Sprint 4+ (deferred)

- NFT Green Proof, oracle, Uniswap pool, PricingCard boost, dark mode, full Clerk lockdown, Lighthouse CI.
- ~~RTMS Assistant **IA fine-tune** (Mistral/Gemini sur dossier) — au-delà du MVP rule-based.~~ → **Sprint 6** : IA indicative livrée (repli rule-based).



## Sprint 5 — shipped 2026-06-02

- **Compare PDF** — export PDF à côté du CSV sur `/green/compare` (`compare-pdf.tsx`, lazy load).
- **RTMS Assistant (bêta)** — `/green/rtms-assistant` : résumé + PDF optionnel, scoring rule-based, rate limit, disclaimer indicatif.
- **Hub** — lien « Pré-diagnostic RTMS » depuis la section méthodologie.

## Sprint 6 — shipped 2026-06-02

- **RTMS Assistant upgrade** — extraction texte PDF in-memory (`pdf-parse`, 5 Mo max) ; scoring rule-based enrichi (corpus résumé + PDF) ; analyse IA optionnelle (Gemini → Groq → Mistral) avec repli rule-based ; badge provider + insight ; max 3 priorités conservé.
- **Cross-links** — assistant RTMS depuis standards (quick-nav), place de marché, widget hub RTMS ; lien marché depuis résultats assistant.
- **i18n** — `quickNav.assistant`, `hub.widgets.rtms.assistantCta`, `market.rtmsAssistantCta` (FR/EN/ES).
- **Tests** — corpus PDF, validation fichier, provider IA (`npm run test:green`).

### Vercel env (IA RTMS)

Au moins une clé serveur (jamais `NEXT_PUBLIC_*`) :

| Variable | Usage |
|----------|--------|
| `GEMINI_API_KEY` | Provider prioritaire (défaut) |
| `GROQ_API_KEY` | Fallback |
| `MISTRAL_API_KEY` | Fallback |
| `AI_PROVIDER_ORDER` | Optionnel — ex. `gemini,groq,mistral` |

Sans clé IA : scoring rule-based amélioré uniquement (comportement valide).

## Sprint 7 — shipped 2026-06-02

- **Espace acteur (/green/my)** — candidatures label par e-mail Clerk ; statuts `pending` / `in_review` / `approved` / `rejected` ; liens mise à jour acteur (`/green/register`) et nouvelle annonce (`/green/market#offers`).
- **Suivi candidature label** — référence dossier après envoi ; consultation dans `/green/my#label-status` (même e-mail).
- **Place de marché** — filtres synchronisés dans l’URL (`?actor=&radius=&energy=&side=&q=`) ; **Copier le lien filtré** ; recherches enregistrées (localStorage, max 5).
- **Standards** — checklist RTMS interactive en **export CSV** (piliers + critères).
- **Registre** — bandeau stats (projets, Verified, pilotes, experts) ; recherche client sur les projets.
- **Tests** — `tests/green-sprint7.test.ts` (`npm run test:green`).

## Sprint 8 — shipped 2026-06-03

- **Pages détail annonce** — `/green/market/offer/[id]` : titre, énergie, vente/achat, prix, volume, lieu, acteur (lien + carte), description, dates ; 404 si introuvable ; i18n FR/EN/ES ; SEO + sitemap dynamique + entrée catalogue AI-first.
- **Place de marché** — lignes et hub « dernières annonces » liées vers la fiche ; **Copier le lien de l'annonce** sur la fiche.
- **Tests** — `tests/green-sprint8.test.ts` (routes, résolution id, catalogue, i18n).

## Sprint 9 — shipped 2026-06-03

- **Fiches acteur** — `/green/market/actor/[id]` : profil (type, capacité, prix, énergie, lieu), description, carte, annonces liées, contact mailto, copier le lien ; popup carte → fiche acteur ; i18n FR/EN/ES ; sitemap dynamique + catalogue AI-first.
- **Contact / intérêt sur annonce** — fiche annonce : bouton e-mail si contact acteur + formulaire « manifester un intérêt » (rate limit 5/h, notification interne + relais acteur si e-mail).
- **SEO entités** — JSON-LD `Offer` sur fiches annonce, `LocalBusiness` sur fiches acteur (en plus du catalogue AI-first).
- **Mobile polish** — espacements et typo responsive sur fiches annonce et acteur.
- **Tests** — `tests/green-sprint9.test.ts` (`npm run test:green`).

## Sprint 10 — shipped 2026-06-03

- **Compare depuis fiche annonce** — bouton « Ajouter au comparateur » sur `/green/market/offer/[id]` ; sélection persistée localStorage + URL `?offers=` (max 4) ; section annonces marketplace sur `/green/compare` ; i18n FR/EN/ES.
- **Notifications e-mail statut label** — e-mail candidat sur transition `pending → in_review` et `in_review → rejected` (Resend) ; API admin `/api/admin/green-label-status` ; boutons ops « Mettre en revue » / « Rejeter » ; une notification par transition (approved déjà couvert à la publication).
- **Registre — fiches projet** — `/green/registry/project/[id]` : nom, statut, lieu, description, niveau RTMS ; liens depuis la liste registre ; SEO + sitemap + catalogue AI-first.
- **Tests** — `tests/green-sprint10.test.ts` (`npm run test:green`).

## Sprint 11 — shipped 2026-06-03

- **Compare export CSV/PDF + annonces** — export CSV/PDF sur `/green/compare` inclut les annonces marketplace sélectionnées (localStorage + `?offers=`) ; colonnes acteur, énergie, côté, volume, prix, lieu, tier, date ; i18n FR/EN/ES.
- **Label — locale e-mail candidat** — colonne `preferred_locale` sur `green_label_applications` (migration `0020`) ; inférée depuis la locale site à la soumission ; e-mails reçu / statut / publication utilisent la locale candidat (FR/EN/ES).
- **Registre — filtre tier** — onglets Tous / Verified / Cas pilote sur `/green/registry` ; param URL `?tier=verified|pilot` ; i18n FR/EN/ES.
- **Tests** — `tests/green-sprint11.test.ts` (`npm run test:green`).

## Sprint 12 — shipped 2026-06-03

- **Registre — export CSV filtré** — bouton « Exporter CSV » sur `/green/registry` ; exporte les projets visibles (filtre `?tier=` + recherche client) ; i18n FR/EN/ES.
- **Compare — lien de partage public** — « Copier le lien de comparaison » sur `/green/compare` ; URL encode `?offers=` + `?countries=` (pays des annonces sélectionnées) ; pas de snapshot serveur (MVP URL).
- **Label — relance dossier incomplet** — e-mail candidat si PDF manquant ou champs requis absents après 24 h (cron `/api/cron/green-label-reminders`) ; max 1 relance par candidature (`reminder_sent_at`, migration `0021`) ; locale `preferred_locale` ; bouton ops « Relance dossier » dans `/green/admin`.
- **Tests** — `tests/green-sprint12.test.ts` (`npm run test:green`).

## Sprint 13 — shipped 2026-06-03

- **Registre — export PDF filtré** — bouton « Exporter PDF » à côté du CSV sur `/green/registry` ; mêmes projets visibles (`?tier=` + recherche) ; `registry-pdf.tsx` (@react-pdf/renderer) ; i18n FR/EN/ES.
- **Compare — filtre pays depuis URL** — `?countries=France,Portugal` restaure la sélection pays dans l’UI ; filtre la section registre du comparateur ; synchronisation URL + lien de partage.
- **Label — 2e relance après 7 jours** — si dossier toujours incomplet 7 jours après la 1re relance (`reminder_sent_at`), e-mail de rappel final ; max 2 relances (`second_reminder_sent_at`, migration `0022`) ; cron `/api/cron/green-label-reminders` ; locale `preferred_locale`.
- **Tests** — `tests/green-sprint13.test.ts` (`npm run test:green`).

## Sprint 14 — shipped 2026-06-03

- **Registre — export PDF enrichi** — métadonnées (projets, Verified, pilotes, experts) ; colonnes localisation, niveau RTMS, extrait description ; section experts certifiés ; `registry-pdf.tsx` ; i18n FR/EN/ES.
- **Compare — snapshot serveur** — `POST /api/green/compare-snapshot` (rate limit) ; table `green_compare_snapshots` (migration `0023`, TTL 30 j) ; `/green/compare/s/[id]` restaure pays + offres + lignes RWA ; bouton « Lien snapshot » ; repli URL params inchangé.
- **Label — stats relances ops** — tableau de bord sur `/green/admin` : incomplet sans relance, relance 1, relance 2, dossier complet ; `GET /api/admin/green-label-reminder-stats`.
- **Tests** — `tests/green-sprint14.test.ts` (`npm run test:green`).

## Sprint 15 — shipped 2026-06-03

- **Registre — export PDF watermark / ops** — filigrane « AUROS GREEN » discret ; pied de page « AUROS Green Registre — export {date} » ; bandeau ops `exportOpsNote` ; i18n FR/EN/ES.
- **Compare — sélection lignes RWA** — cases à cocher sur le tableau comparateur ; persistance `?rwa=` dans le lien de partage + payload snapshot ; restauration sur `/green/compare/s/[id]` ; i18n FR/EN/ES.
- **Label — export CSV ops** — bouton « Exporter CSV (toutes) » sur `/green/admin` ; `GET /api/admin/green-label-export` (CRON_SECRET) ; colonnes id, org, email, status, preferred_locale, relances, document_path (yes/no), created_at.
- **Tests** — `tests/green-sprint15.test.ts` (`npm run test:green`).

## Sprint 16 — shipped 2026-06-03

- **Registre — export PDF horodaté certifié** — pied de page « Export certifié AUROS — {ISO UTC} » + empreinte SHA256 des ids projets/experts exportés ; bandeau ops mis à jour ; i18n FR/EN/ES.
- **Compare — snapshot combiné pays + RWA + offres** — restauration complète sur `/green/compare/s/[id]` (pays, offres snapshot, lignes RWA) ; lien de partage encode les trois dimensions ; correctifs restauration initiale vs localStorage/URL.
- **Label — export CSV filtré ops** — filtre sur `/green/admin` (all, pending, in_review, approved, rejected, incomplete, reminded_1, reminded_2) ; `GET /api/admin/green-label-export?filter=` ; i18n FR/EN/ES.
- **Tests** — `tests/green-sprint16.test.ts` (`npm run test:green`).

## Sprint 17 — shipped 2026-06-03

- **Registre — export PDF signature serveur HMAC** — pied de page `sig={hmac}` via `GREEN_EXPORT_SIGNING_KEY` ou `CRON_SECRET` ; repli SHA256 seul sans clé ; `GET /api/green/sign-registry-export?hash=` + `GET /api/green/verify-registry-export?hash=&sig=` ; i18n FR/EN/ES.
- **Compare — page snapshot expiré / introuvable** — `/green/compare/s/[id]` affiche une page dédiée (pas 404 générique) avec CTA vers `/green/compare` si TTL dépassé ou id absent ; i18n FR/EN/ES.
- **Label — export CSV hebdomadaire ops (cron)** — `GET /api/cron/green-label-export-weekly` (lundi 07:00 UTC, `vercel.json`) ; CSV candidatures par e-mail Resend vers `OPS_EMAIL` ou `RESEND_INTERNAL_EMAIL` ; filtre `all` ou `incomplete` (`GREEN_LABEL_WEEKLY_EXPORT_FILTER`) ; auth `CRON_SECRET`.
- **Tests** — `tests/green-sprint17.test.ts` (`npm run test:green`).

## Sprint 18 — shipped 2026-06-03

- **Registre — vérification PDF côté UI** — panneau « Vérifier un export PDF » sur `/green/registry` ; hash + sig ou collage ligne d'intégrité ; appel `/api/green/verify-registry-export` ; préremplissage après export PDF ; i18n FR/EN/ES.
- **Compare — renouvellement TTL snapshot** — `POST /api/green/compare-snapshot/renew` ; bouton « Renouveler 30 j » sur snapshot actif et page expirée ; i18n FR/EN/ES.
- **Label — export CSV hebdo avec stats relances** — corps e-mail cron inclut tableau incomplet / relance 1 / relance 2 / complet (`getGreenLabelReminderStats`) ; `buildGreenLabelWeeklyExportEmailHtml`.
- **Tests** — `tests/green-sprint18.test.ts` (`npm run test:green`).

## Sprint 19 — shipped 2026-06-03

- **Compare — renouvellement auto si < 7 j avant expiration** — visite `/green/compare/s/[id]` prolonge silencieusement le TTL si fenêtre `GREEN_COMPARE_SNAPSHOT_AUTO_RENEW_DAYS` ; affichage date d'expiration sur snapshot actif.
- **Registre — préremplissage verify après export** — hash SHA256 + sig HMAC injectés dans le panneau verify post-export PDF.
- **Tests** — couverture i18n renew/expiry dans `tests/green-sprint18.test.ts`.

### Vercel env (Sprint 17)

| Variable | Usage |
|----------|--------|
| `GREEN_EXPORT_SIGNING_KEY` | Signature HMAC footer PDF registre (optionnel — repli `CRON_SECRET`) |
| `CRON_SECRET` | Auth cron + repli signature PDF |
| `OPS_EMAIL` | Destinataire export CSV hebdo label (repli `RESEND_INTERNAL_EMAIL`) |
| `RESEND_API_KEY` | Envoi e-mail export hebdo |
| `GREEN_LABEL_WEEKLY_EXPORT_FILTER` | Optionnel — `all` (défaut) ou `incomplete` |

### Après Sprint 19 (backlog Sprint 20)

- NFT, oracle, Uniswap, PricingCard boost, dark mode, Clerk sur tout `/green/*`, Lighthouse CI

### Après Sprint 17 (backlog Sprint 18 — traité)

- ~~Registre : vérification PDF côté UI (lien vers `/api/green/verify-registry-export`)~~ → Sprint 18
- ~~Compare : prolongation TTL snapshot ou renouvellement automatique~~ → Sprint 18 + 19
- ~~Label : export CSV hebdo avec résumé stats relances dans le corps e-mail~~ → Sprint 18
- NFT, oracle, Uniswap, PricingCard boost, dark mode, Clerk sur tout `/green/*`, Lighthouse CI

### Après Sprint 16 (backlog Sprint 17 — traité)

- ~~Registre : export PDF signature clé serveur (au-delà SHA256 indicatif)~~ → Sprint 17 (HMAC-SHA256)
- ~~Compare : snapshot expiré — page dédiée « lien expiré »~~ → Sprint 17
- ~~Label : export CSV planifié (cron ops)~~ → Sprint 17
- NFT, oracle, Uniswap, PricingCard boost, dark mode, Clerk sur tout `/green/*`, Lighthouse CI

### Après Sprint 15 (backlog Sprint 16 — traité)

- ~~Registre : signature PDF ops (clé serveur / horodatage signé)~~ → Sprint 16 (horodatage UTC + SHA256)
- ~~Compare : snapshot avec filtres pays + RWA combinés en une vue partagée~~ → Sprint 16
- ~~Label : export CSV filtré par statut / relance~~ → Sprint 16
- NFT, oracle, Uniswap, PricingCard boost, dark mode, Clerk sur tout `/green/*`, Lighthouse CI

### Après Sprint 14 (backlog Sprint 15 — traité)

- ~~Registre : export PDF signé / watermark ops~~ → Sprint 15
- ~~Compare : snapshot avec sélection lignes RWA côté UI~~ → Sprint 15
- ~~Label : export CSV candidatures pour ops~~ → Sprint 15
- NFT, oracle, Uniswap, PricingCard boost, dark mode, Clerk sur tout `/green/*`, Lighthouse CI

### Après Sprint 11 (backlog Sprint 12 — traité)

- ~~Registre : export CSV des projets filtrés~~ → Sprint 12
- ~~Compare : partage public du comparateur (lien signé ou snapshot)~~ → Sprint 12 (URL encoding MVP)
- ~~Label : relance e-mail candidat si dossier incomplet~~ → Sprint 12
- NFT, oracle, Uniswap, PricingCard boost, dark mode, Clerk sur tout `/green/*`, Lighthouse CI

### Après Sprint 10 (backlog Sprint 11 — traité)

- ~~Compare : export CSV/PDF incluant les annonces marketplace sélectionnées~~ → Sprint 11
- ~~Label : e-mail locale préférée candidat (si champ ajouté)~~ → Sprint 11
- ~~Registre : filtre par tier Verified / pilote~~ → Sprint 11
- NFT, oracle, Uniswap, PricingCard boost, dark mode, Clerk sur tout `/green/*`, Lighthouse CI

### Après Sprint 9 (backlog Sprint 10 — traité)

- ~~Compare : ajouter des offres depuis la fiche annonce~~ → Sprint 10
- ~~Label : notifications e-mail statut candidature~~ → Sprint 10
- ~~Registre : pages détail projet~~ → Sprint 10
- NFT, oracle, Uniswap, PricingCard boost, dark mode, Clerk sur tout `/green/*`, Lighthouse CI

### Après Sprint 8 (backlog — partiellement traité Sprint 9)

- ~~Actor profile pages~~ → Sprint 9
- ~~Contact/interested CTA on offer detail~~ → Sprint 9
- ~~Market: actor filter from map popup → detail~~ → Sprint 9 (popup → fiche acteur)
- ~~SEO: structured data JSON-LD for offers/actors~~ → Sprint 9
- ~~Mobile polish on offer detail + market~~ → Sprint 9 (fiches détail)



## État restant (honest inventory — 2026-06-03)

| Catégorie | Count | Détail |
|-----------|-------|--------|
| **Fait (Sprints 1–19)** | **~120+ livrables** | Step 0 audit + Sprints 2–19 (voir sections ci-dessus) |
| **Backlog actionnable MVP** | **0** | Tous les items Sprint 18–19 traités ; aucun P0–P3 audit ouvert |
| **Hors scope / monétisation / externe** | **7** | NFT SBT, oracle, Uniswap pool, PricingCard boost, dark mode, Clerk lockdown `/green/*`, Lighthouse CI |
| **TODO/FIXME code** | **0** | Aucun dans `app/green` ni `lib/green` |

**Verdict MVP fonctionnel :** le parcours Green (hub, marché, registre, compare, label, RTMS assistant, `/green/my`, admin ops) est complet pour une beta publique. Les 7 items restants sont des extensions produit / infra, pas des blockers MVP.

**Estimation sprints restants pour « MVP complet » :** **0 sprint** côté features MVP. Pour une V1 « premium » incluant monétisation et infra (Clerk global, Lighthouse CI, dark mode) : **3–5 sprints** selon priorités business — non requis pour lancer.

## Out of scope (unchanged)



NFT SBT, Uniswap, oracle, PricingCard, dark mode, full Clerk middleware on all `/green/*`.



## Deploy notes



- Run migration `0019_green_label_document.sql` on Supabase.
- Run migration `0020_green_label_preferred_locale.sql` on Supabase (or `npm run db:bootstrap:green-market`).
- Run migration `0021_green_label_reminder_sent_at.sql` on Supabase.
- Run migration `0022_green_label_second_reminder_sent_at.sql` on Supabase.

- Create storage bucket `green-label-documents` (private) if not present.

