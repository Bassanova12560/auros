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

### Après Sprint 9 (backlog Sprint 10)

- Compare : ajouter des offres depuis la fiche annonce
- Label : notifications e-mail statut candidature
- Registre : pages détail projet
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

- Create storage bucket `green-label-documents` (private) if not present.

