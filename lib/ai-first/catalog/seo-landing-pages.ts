import { JURISDICTIONS_ROUTE } from "@/lib/jurisdictions/constants";

import { JURISDICTIONS } from "@/lib/jurisdictions/data";

import {

  getAllSeoLandings,

  getSeoLandingCopy,

} from "@/lib/jurisdictions/seo-landings";

import { getJurisdictionMessages, jurisdictionLabel } from "@/lib/jurisdictions/i18n";



import {

  buildJurisdictionFacts,

  buildJurisdictionSummary,

} from "../jurisdiction-facts";

import { enrichPage } from "../enrich";

import type { AiFirstPage } from "../types";



export function buildSeoLandingPages(): AiFirstPage[] {

  const messages = getJurisdictionMessages("fr");



  return getAllSeoLandings().map((landing) => {

    const jurisdiction = JURISDICTIONS.find((j) => j.id === landing.jurisdictionId)!;

    const jurisdictionName = jurisdictionLabel(messages, landing.jurisdictionId);

    const assetLabel =

      messages.forms.projectTypes[landing.assetType] ?? landing.assetType;

    const copy = getSeoLandingCopy("fr", landing, jurisdictionName, assetLabel);

    const path = `${JURISDICTIONS_ROUTE}/${landing.slug}`;

    const jurisdictionFacts = buildJurisdictionFacts(jurisdiction, messages);



    return enrichPage({

      id: `seo-${landing.slug}`,

      path,

      title: copy.title,

      description: copy.description,

      summary: `${copy.intro} Juridiction : ${jurisdictionName}. Actif : ${assetLabel}. ${copy.bullets.join(" ")} Régulateur : ${messages.licenses[jurisdiction.licenseKey]}. Fiscalité : ${messages.tax[jurisdiction.taxKey]}.`,

      contentType: "landing",

      language: "multi",

      indexable: true,

      lastUpdated: "2026-05-29",

      keywords: [

        `${assetLabel} tokenization ${jurisdictionName}`,

        `RWA ${landing.jurisdictionId}`,

        landing.assetSlug,

        messages.licenses[jurisdiction.licenseKey],

        "jurisdiction",

        "Starter Kit",

      ],

      intents: [

        `Tokeniser ${assetLabel.toLowerCase()} en ${jurisdictionName} — coûts et délais ?`,

        `Réglementation ${assetLabel.toLowerCase()} ${jurisdictionName}`,

        `Fiscalité investisseur ${assetLabel.toLowerCase()} ${jurisdictionName}`,

      ],

      audience: ["émetteurs B2B", "promoteurs", "counsel RWA", "family office"],

      facts: [

        { key: "Juridiction", value: jurisdictionName },

        { key: "Actif", value: assetLabel },

        { key: "ID juridiction", value: landing.jurisdictionId },

        ...jurisdictionFacts,

      ],

      relatedPaths: [

        JURISDICTIONS_ROUTE,

        "/jurisdictions/starter-kit",

        "/wizard",

        `${JURISDICTIONS_ROUTE}/${landing.slug}`,

      ],

    });

  });

}



/** Compact jurisdiction rows for the hub catalog entry. */

export function buildJurisdictionHubFacts() {

  const messages = getJurisdictionMessages("fr");

  return JURISDICTIONS.map((j) => buildJurisdictionSummary(j, messages));

}



/** Full jurisdiction dataset for RAG / machine JSON on hub. */

export function buildAllJurisdictionFacts() {

  const messages = getJurisdictionMessages("fr");

  return JURISDICTIONS.flatMap((j) => buildJurisdictionFacts(j, messages));

}


