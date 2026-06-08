import { enrichPage } from "../enrich";
import type { AiFirstPage } from "../types";
import {
  GREEN_BLOG_ROUTE,
  GREEN_FAQ_ROUTE,
  GREEN_HOW_IT_WORKS_ROUTE,
  GREEN_LABEL_ROUTE,
  GREEN_MARKET_ROUTE,
  GREEN_REGISTER_ROUTE,
  GREEN_ROUTE,
  GREEN_RTMS_ASSISTANT_ROUTE,
  GREEN_STANDARDS_ROUTE,
  AUROS_FAQ_ROUTE,
  AUROS_RESOURCES_ROUTE,
  AUROS_WIZARD_ROUTE,
} from "@/lib/green/constants";
import { GREEN_FAQ_ITEMS } from "@/lib/seo/content/green-faq";
import { MAIN_FAQ_ITEMS } from "@/lib/seo/content/main-faq";
import {
  GREEN_BLOG_ARTICLES,
  greenBlogArticlePath,
} from "@/lib/green/blog/articles";

export const mainFaqPage = enrichPage({
  id: "faq",
  path: AUROS_FAQ_ROUTE,
  title: "FAQ | AUROS — Tokenisation RWA",
  description:
    "Questions fréquentes sur AUROS : wizard gratuit, score admission, juridictions, Starter Kit, confidentialité RGPD et lien avec AUROS Green.",
  summary:
    "FAQ AUROS principale — wizard, dossier actif, comparateur juridictions, Starter Kit 5 000 €, RGPD, différences avec AUROS Green.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-04",
  keywords: [
    "FAQ AUROS",
    "tokenisation RWA questions",
    "wizard gratuit",
    "Starter Kit juridiction",
    "score admission",
  ],
  intents: [
    "AUROS est-il gratuit ?",
    "Différence wizard et Starter Kit",
    "Confidentialité données AUROS",
  ],
  audience: ["émetteurs B2B", "promoteurs", "CFO", "family office"],
  facts: [
    { key: "Wizard", value: "Gratuit — /wizard" },
    { key: "Starter Kit", value: "5 000 € HT — /jurisdictions/starter-kit" },
    { key: "Juridictions", value: "8 comparées" },
  ],
  faq: MAIN_FAQ_ITEMS,
  breadcrumbs: [],
  relatedPaths: ["/", AUROS_RESOURCES_ROUTE, "/how-it-works", "/wizard", GREEN_ROUTE],
});

export const resourcesPage = enrichPage({
  id: "ressources",
  path: AUROS_RESOURCES_ROUTE,
  title: "Ressources | Guides et FAQ AUROS",
  description:
    "Hub ressources AUROS : FAQ, guides tokenisation, comparateurs RWA, Academy et écosystème Green — contenus éducatifs FR/EN/ES.",
  summary:
    "Page hub liens vers FAQ AUROS, how-it-works, discover, trust, Academy, Green FAQ, blog Green et comparateurs live.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-04",
  keywords: [
    "ressources RWA",
    "guides tokenisation",
    "AUROS documentation",
    "apprendre tokenisation actifs réels",
  ],
  intents: ["Où trouver de l'aide AUROS", "Guides tokenisation RWA"],
  audience: ["émetteurs", "consultants", "investisseurs"],
  facts: [
    { key: "FAQ", value: AUROS_FAQ_ROUTE },
    { key: "Green blog", value: GREEN_BLOG_ROUTE },
    { key: "Machine-readable", value: "/llms.txt · /ai-first/index.json" },
  ],
  relatedPaths: [
    AUROS_FAQ_ROUTE,
    "/how-it-works",
    "/discover",
    "/trust",
    "/academy",
    GREEN_ROUTE,
    GREEN_FAQ_ROUTE,
    GREEN_BLOG_ROUTE,
  ],
});

export const howItWorksPage = enrichPage({
  id: "how-it-works",
  path: "/how-it-works",
  title: "Comment ça marche | AUROS",
  description:
    "Trois étapes jusqu'au dossier RWA : décrire l'actif, score & dossier IA, soumission à l'équipe AUROS.",
  summary:
    "Parcours AUROS en trois étapes — wizard 4 parties, score admission, data room 15 documents, studio réglementaire.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-04",
  keywords: ["comment tokeniser actif", "processus RWA AUROS", "wizard étapes"],
  intents: ["Comment fonctionne AUROS", "Étapes tokenisation"],
  audience: ["émetteurs", "promoteurs"],
  facts: [
    { key: "Étapes", value: "3 visibles — 4 parties wizard" },
    { key: "Durée", value: "~15 minutes indicatif" },
  ],
  relatedPaths: ["/wizard", "/estimate", AUROS_FAQ_ROUTE],
});

export const discoverPage = enrichPage({
  id: "discover",
  path: "/discover",
  title: "Découvrir AUROS | Plateforme RWA",
  description:
    "Univers d'actifs, conformité, livrables dossier — approfondissez AUROS avant de lancer votre wizard.",
  summary:
    "Page discover : univers actifs RWA, conformité MiCA, livrables dossier — profondeur avant wizard.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-04",
  keywords: ["découvrir AUROS", "plateforme RWA", "actifs tokenisables"],
  intents: ["Explorer AUROS avant de commencer"],
  audience: ["curieux", "émetteurs"],
  facts: [{ key: "CTA", value: "/wizard" }],
  relatedPaths: ["/", "/how-it-works", "/trust"],
});

export const trustPage = enrichPage({
  id: "trust",
  path: "/trust",
  title: "Confiance & conformité | AUROS",
  description:
    "MiCA, RGPD, KYC/AML — cadre réglementaire transparent, processus en 3 étapes et retours anonymisés pour la préparation de dossiers RWA.",
  summary:
    "Transparence réglementaire AUROS : MiCA, RGPD UE, KYC/AML, processus diagnostic → juridiction → revue humaine, analyses indicatives — counsel requis avant émission.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-09",
  keywords: ["MiCA RWA", "RGPD tokenisation", "conformité AUROS"],
  intents: ["AUROS est-il conforme MiCA", "Sécurité données RWA"],
  audience: ["compliance", "CFO", "investisseurs"],
  facts: [
    { key: "Hébergement", value: "UE" },
    { key: "Processus", value: "3 étapes — diagnostic, juridiction, revue" },
    { key: "Disclaimer", value: "Analyses indicatives — pas conseil juridique" },
  ],
  relatedPaths: ["/privacy", "/legal", "/jurisdictions", "/pricing"],
});

export const estimatePage = enrichPage({
  id: "estimate",
  path: "/estimate",
  title: "Score de préparation | AUROS",
  description:
    "Estimez en une phrase si votre actif est prêt pour la tokenisation — score indicatif instantané, sans compte.",
  summary:
    "Widget score readiness AUROS — une phrase, résultat indicatif immédiat, sans inscription.",
  contentType: "tool",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-04",
  keywords: ["score tokenisation", "readiness RWA", "test actif tokenisable"],
  intents: ["Mon actif est-il prêt à tokeniser"],
  audience: ["émetteurs", "curieux"],
  facts: [{ key: "Compte", value: "Non requis" }],
  relatedPaths: ["/wizard", "/how-it-works"],
});

export const pricingPage = enrichPage({
  id: "pricing",
  path: "/pricing",
  title: "Tarifs | AUROS — Gratuit, Starter Kit, Launch",
  description:
    "Trois offres AUROS : wizard et score gratuits, Starter Kit juridiction 5 000 €, accompagnement Launch sur devis.",
  summary:
    "Page tarifs AUROS — tier gratuit (wizard + score), Starter Kit 5 000 € (juridictions), Launch sur devis.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-08",
  keywords: [
    "tarifs AUROS",
    "Starter Kit prix",
    "wizard gratuit RWA",
    "tokenisation pricing",
  ],
  intents: ["Combien coûte AUROS", "Prix Starter Kit RWA"],
  audience: ["émetteurs", "CFO", "promoteurs"],
  facts: [
    { key: "Gratuit", value: "Wizard + score — /wizard" },
    { key: "Starter Kit", value: "5 000 € — /jurisdictions/starter-kit" },
    { key: "Launch", value: "Sur devis — /jurisdictions#quote-form" },
  ],
  relatedPaths: ["/wizard", "/jurisdictions", "/jurisdictions/starter-kit"],
  breadcrumbs: [{ name: "AUROS", path: "/" }],
});

export const greenFaqPage = enrichPage({
  id: "green-faq",
  path: GREEN_FAQ_ROUTE,
  title: "FAQ AUROS Green | RTMS, label, marketplace",
  description:
    "14 questions-réponses sur RTMS, label Verified, marketplace mondiale, registre et candidature producteur — AUROS Green.",
  summary:
    "FAQ AUROS Green complète : standard RTMS, label Verified, marketplace, producteurs vs stockeurs, assistant RTMS, Praticien.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-04",
  keywords: [
    "FAQ AUROS Green",
    "RTMS questions",
    "label Verified green",
    "marketplace énergie verte FAQ",
  ],
  intents: [
    "Comment obtenir label Green",
    "Différence producteur stockeur",
    "Assistant RTMS vs label",
  ],
  audience: ["producteurs", "investisseurs impact", "consultants ESG"],
  facts: [
    { key: "Grille", value: GREEN_STANDARDS_ROUTE },
    { key: "Label", value: GREEN_LABEL_ROUTE },
    { key: "Marketplace", value: GREEN_MARKET_ROUTE },
  ],
  faq: GREEN_FAQ_ITEMS,
  breadcrumbs: [{ name: "Green", path: GREEN_ROUTE }],
  relatedPaths: [
    GREEN_ROUTE,
    GREEN_STANDARDS_ROUTE,
    GREEN_LABEL_ROUTE,
    GREEN_BLOG_ROUTE,
    GREEN_RTMS_ASSISTANT_ROUTE,
  ],
});

export const greenHowItWorksPage = enrichPage({
  id: "green-comment-ca-marche",
  path: GREEN_HOW_IT_WORKS_ROUTE,
  title: "Comment ça marche | AUROS Green",
  description:
    "Parcours AUROS Green en 4 étapes : découvrir RTMS, référencer ou trouver un acteur, candidater au label, vérifier au registre.",
  summary:
    "Guide parcours AUROS Green — RTMS, marketplace, label Verified, registre public. Une action principale par étape.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-04",
  keywords: [
    "comment fonctionne AUROS Green",
    "parcours label green",
    "RTMS étapes",
  ],
  intents: ["Comment utiliser AUROS Green", "Parcours label vert"],
  audience: ["producteurs", "promoteurs solaire", "investisseurs"],
  facts: [
    { key: "Étape 1", value: "Comprendre RTMS — /green/standards" },
    { key: "Étape 2", value: "Marketplace — /green/market" },
    { key: "Étape 3", value: "Label — /green/label" },
    { key: "Étape 4", value: "Registre — /green/registry" },
  ],
  breadcrumbs: [{ name: "Green", path: GREEN_ROUTE }],
  relatedPaths: [
    GREEN_ROUTE,
    GREEN_REGISTER_ROUTE,
    GREEN_LABEL_ROUTE,
    GREEN_FAQ_ROUTE,
    `${AUROS_WIZARD_ROUTE}?asset=renewable`,
  ],
});

export const greenBlogIndexPage = enrichPage({
  id: "green-blog",
  path: GREEN_BLOG_ROUTE,
  title: "Blog AUROS Green | RTMS, marketplace, label",
  description:
    "Articles éducatifs AUROS Green : standard RTMS, producteurs vs stockeurs, label Verified, PPA et traçabilité, marketplace énergie.",
  summary:
    "Index blog AUROS Green — articles long format sur tokenisation énergie, RTMS, label et marketplace. FR primary, contenu cité par moteurs et IA.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-04",
  keywords: [
    "blog RWA vert",
    "articles tokenisation énergie",
    "RTMS blog",
    "AUROS Green contenu",
  ],
  intents: ["Apprendre tokenisation énergie verte", "Lire sur RTMS"],
  audience: ["producteurs", "analystes ESG", "promoteurs"],
  facts: GREEN_BLOG_ARTICLES.map((a) => ({
    key: a.title,
    value: greenBlogArticlePath(a.slug),
  })),
  breadcrumbs: [{ name: "Green", path: GREEN_ROUTE }],
  relatedPaths: [GREEN_ROUTE, GREEN_FAQ_ROUTE, GREEN_STANDARDS_ROUTE],
});

export function buildGreenBlogCatalogPages(): AiFirstPage[] {
  return GREEN_BLOG_ARTICLES.map((article) =>
    enrichPage({
      id: `green-blog-${article.slug}`,
      path: greenBlogArticlePath(article.slug),
      title: `${article.title} | AUROS Green`,
      description: article.description,
      summary: article.excerpt,
      contentType: "article",
      language: "multi",
      indexable: true,
      lastUpdated: article.modifiedAt,
      keywords: article.keywords,
      intents: [article.title],
      audience: ["producteurs", "investisseurs impact", "consultants ESG"],
      facts: [{ key: "Lecture", value: `${article.readingTimeMinutes} min` }],
      breadcrumbs: [
        { name: "Green", path: GREEN_ROUTE },
        { name: "Blog", path: GREEN_BLOG_ROUTE },
      ],
      article: {
        slug: article.slug,
        publishedAt: article.publishedAt,
        modifiedAt: article.modifiedAt,
        author: "AUROS Green",
        readingTimeMinutes: article.readingTimeMinutes,
      },
      relatedPaths: [
        GREEN_BLOG_ROUTE,
        GREEN_FAQ_ROUTE,
        GREEN_STANDARDS_ROUTE,
        article.cta.href,
      ],
    })
  );
}

export const contentPages: AiFirstPage[] = [
  mainFaqPage,
  resourcesPage,
  howItWorksPage,
  discoverPage,
  trustPage,
  estimatePage,
  pricingPage,
  greenFaqPage,
  greenHowItWorksPage,
  greenBlogIndexPage,
  ...buildGreenBlogCatalogPages(),
];
