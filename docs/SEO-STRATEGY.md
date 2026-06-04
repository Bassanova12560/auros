# Stratégie SEO AUROS — juin 2026

## Architecture

- **Source de vérité** : catalogue `lib/ai-first/catalog/` — chaque page indexable a un enregistrement `AiFirstPage` (title, description, keywords, FAQ, JSON-LD).
- **Metadata Next.js** : helper `lib/seo/metadata.ts` → `metadataFromPath()` / `buildPageMetadata()`.
- **JSON-LD** : `lib/ai-first/json-ld.ts` — Organization + WebSite (global head), WebPage, FAQPage, Article, BreadcrumbList, Course, Product par page.
- **Découverte IA** : `/llms.txt`, `/ai-first/index.json`, `/ai-first/rag`, `robots.ts` avec allow bots IA étendu.

## Pages contenu ajoutées

| Route | Schema | Cible keywords |
|-------|--------|----------------|
| `/faq` | FAQPage | FAQ AUROS, wizard gratuit, Starter Kit |
| `/ressources` | WebPage + Breadcrumb | hub guides RWA |
| `/green/faq` | FAQPage | RTMS, label Verified, marketplace |
| `/green/comment-ca-marche` | WebPage | parcours Green |
| `/green/blog` | WebPage | blog RWA vert |
| `/green/blog/[slug]` ×5 | Article + Breadcrumb | RTMS, PPA, producteurs, label, marketplace |

## Sitemap

- Entrées statiques via `getIndexablePages()` + dynamiques marketplace/registre + slugs blog.
- Priorités élevées : `/`, comparateurs, `/green`, `/green/market`, blog Green.

## Règles éditoriales

- Ton rassurant (UX-PSYCHOLOGY.md), une action principale par page.
- Pas de keyword stuffing, dates réalistes 2025–2026.
- Liens internes : register, market, label, rtms-assistant, wizard.

## Maintenance

1. Nouvelle page → entrée catalogue + `metadataFromPath` + lien footer/ressources si pertinent.
2. Nouvel article blog → `lib/green/blog/articles.ts` + rebuild (generateStaticParams auto).
3. `npm run seo:submit` après déploiement majeur.
