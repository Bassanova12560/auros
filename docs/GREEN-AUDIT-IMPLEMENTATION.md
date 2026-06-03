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

### Après Sprint 12 (backlog Sprint 13)

- Registre : export PDF des projets filtrés
- Compare : filtre pays depuis param URL `?countries=`
- Label : relance automatique si dossier toujours incomplet après 7 jours
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



## Out of scope (unchanged)



NFT SBT, Uniswap, oracle, PricingCard, dark mode, full Clerk middleware on all `/green/*`.



## Deploy notes



- Run migration `0019_green_label_document.sql` on Supabase.
- Run migration `0020_green_label_preferred_locale.sql` on Supabase (or `npm run db:bootstrap:green-market`).
- Run migration `0021_green_label_reminder_sent_at.sql` on Supabase.

- Create storage bucket `green-label-documents` (private) if not present.

