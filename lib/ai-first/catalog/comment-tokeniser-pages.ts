import { COMMENT_TOKENISER_ROUTE } from "@/lib/comment-tokeniser/constants";
import {
  commentTokeniserPath,
  getAllCommentTokeniserLandings,
  getCommentTokeniserCopy,
  type CommentTokeniserSlug,
} from "@/lib/comment-tokeniser/landings";

import { enrichPage } from "../enrich";
import type { AiFirstPage } from "../types";

export function buildCommentTokeniserHubPage(): AiFirstPage {
  const landings = getAllCommentTokeniserLandings();
  return enrichPage({
    id: "comment-tokeniser-hub",
    path: COMMENT_TOKENISER_ROUTE,
    title: "Comment tokeniser mon actif | Guides AUROS",
    description:
      "Guides indicatifs par type d'actif — immobilier, art, fonds. Préparez un dossier RWA crédible en 4 parties avec le wizard AUROS gratuit.",
    summary:
      "Hub SEO AUROS — comment tokeniser immobilier, art ou fonds en Europe. Chaque guide mène au wizard avec préremplissage actif.",
    contentType: "guide",
    language: "multi",
    indexable: true,
    lastUpdated: "2026-07-05",
    keywords: [
      "comment tokeniser actif",
      "tokenisation immobilier guide",
      "tokeniser oeuvre art",
      "tokeniser fonds RWA",
    ],
    intents: [
      "Comment tokeniser mon immeuble",
      "Comment tokeniser une collection d'art",
      "Comment tokeniser un fonds d'investissement",
    ],
    audience: ["promoteurs", "family office", "émetteurs RWA", "counsel"],
    facts: landings.map((l) => ({
      key: getCommentTokeniserCopy(l.slug, "fr").h1,
      value: commentTokeniserPath(l.slug),
    })),
    relatedPaths: [
      "/wizard",
      "/estimate",
      "/jurisdictions",
      "/how-it-works",
      "/blog",
      ...landings.map((l) => commentTokeniserPath(l.slug)),
    ],
  });
}

export function buildCommentTokeniserLandingPages(): AiFirstPage[] {
  return getAllCommentTokeniserLandings().map((landing) => {
    const copy = getCommentTokeniserCopy(landing.slug as CommentTokeniserSlug, "fr");
    const path = commentTokeniserPath(landing.slug as CommentTokeniserSlug);

    return enrichPage({
      id: `comment-tokeniser-${landing.slug}`,
      path,
      title: copy.title,
      description: copy.description,
      summary: `${copy.intro} ${copy.priorities.join(" ")}`,
      contentType: "landing",
      language: "multi",
      indexable: true,
      lastUpdated: "2026-07-05",
      keywords: [
        `comment tokeniser ${landing.slug}`,
        "tokenisation RWA",
        "wizard dossier AUROS",
        landing.wizardAssetType,
      ],
      intents: [copy.h1, "Préparer dossier tokenisation EU"],
      audience: ["promoteurs", "émetteurs", "counsel", "family office"],
      facts: [
        { key: "Actif wizard", value: landing.wizardAssetType },
        { key: "Valeur indicative", value: `€${landing.defaultValueEur.toLocaleString("fr")}` },
        { key: "Pays défaut", value: landing.defaultCountry },
        ...copy.priorities.map((p, i) => ({ key: `Priorité ${i + 1}`, value: p })),
      ],
      relatedPaths: [
        COMMENT_TOKENISER_ROUTE,
        "/wizard",
        "/estimate",
        "/jurisdictions",
        "/how-it-works",
        path,
      ],
    });
  });
}
