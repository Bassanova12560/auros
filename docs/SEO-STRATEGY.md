# Stratégie SEO / GEO AUROS — juillet 2026

## Objectif

Maximiser la découvrabilité **Google** et **recherche IA** (ChatGPT, Claude, Perplexity, Gemini, Copilot) pour chaque surface produit : RWA core, Green, Watts, ChargeFlow, Eau, Protocol, Copilot, Data.

## Architecture (source de vérité)

| Couche | Rôle | Emplacement |
|--------|------|-------------|
| Catalogue AI-first | title, description, keywords, FAQ, facts | `lib/ai-first/catalog/` |
| Metadata Next | title/desc/OG/robots | `lib/seo/metadata.ts` → `metadataFromPath` |
| JSON-LD | Organization, WebSite, WebPage, FAQPage, Article, Course, Product, SoftwareApplication | `lib/ai-first/json-ld.ts` |
| Découverte IA | llms.txt, ai.txt, index.json, RAG, humans.txt | `/llms.txt`, `/ai.txt`, `/ai-first/*` |
| Sitemap | toutes pages indexables + market/registry/blog/glossary | `app/sitemap.ts` |
| Robots | allow bots Google + bots IA 2026 | `app/robots.ts` |
| IndexNow | ping Bing/Yandex après deploy | `npm run seo:submit` |

## Surfaces produit (hubs à citer)

- `/` · `/jurisdictions` · `/wizard` · `/academy` · `/compare`
- `/green` · `/green/faq` · `/green/watts` · `/green/chargeflow` · `/eau`
- `/developers` · `/copilot` · `/data/terminal` · `/faq`

Chaque hub a : entrée catalogue + `AiFirstPageJsonLd` + FAQ citables (HTML + FAQPage schema).

## GEO (réponses IA)

1. **llms.txt / llms-full.txt** — produits, garde-fous, policy de citation.
2. **ai.txt** — déclaration explicite des sources préférées.
3. **RAG** `/ai-first/rag?q=` — SearchAction WebSite pointe aussi ici.
4. **page.json** — citation page par page.
5. **FAQ** — questions naturelles alignées sur les intents utilisateurs.

## Google

1. Sitemap soumis GSC + Bing Webmaster.
2. FAQ visibles (pas seulement JSON-LD).
3. Blog Green long-tail (ex. `auros-watts-booking-engine`).
4. Canonical propre ; hreflang limité à `fr` + `x-default` (locale cookie, même URL).
5. Pas de soft-404 : pages vides → CTA, pas de contenu fantôme.

## Règles éditoriales

- Ton rassurant (`docs/UX-PSYCHOLOGY.md`) ; max 3 priorités visibles.
- Pas de keyword stuffing ; dates 2025–2026.
- Ne jamais inventer : partnerships Tesla/Total, GO/REC, marché réglementé, auto-mint.
- Liens internes : hub produit → FAQ → docs API → Copilot.

## Maintenance

1. Nouvelle page publique → catalogue `AiFirstPage` (FAQ 3–6 Q) + `metadataFromPath` + `AiFirstPageJsonLd`.
2. Nouvel article → `lib/green/blog/articles.ts` ou `lib/blog`.
3. Après deploy majeur → `npm run seo:submit`.
4. Vérifier `/llms.txt` et `/ai-first/index.json` en prod.
