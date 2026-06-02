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

- NFT Green Proof, oracle, Uniswap pool, PricingCard boost, dark mode, full Clerk lockdown, Lighthouse CI, RTMS Assistant IA.



## Out of scope (unchanged)



NFT SBT, Uniswap, oracle, PricingCard, dark mode, full Clerk middleware on all `/green/*`.



## Deploy notes



- Run migration `0019_green_label_document.sql` on Supabase.

- Create storage bucket `green-label-documents` (private) if not present.

