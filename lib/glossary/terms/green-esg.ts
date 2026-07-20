import type { GlossaryTerm } from "../types";

export const GREEN_ESG_TERMS: GlossaryTerm[] = [
  {
    slug: "esg",
    title: "ESG",
    category: "green-esg",
    shortDefinition:
      "Environnement, Social et Gouvernance — critères extra-financiers d'évaluation des investissements.",
    extended:
      "L'ESG structure questionnaires, reporting et exclusions pour fonds et family offices. En RWA, il croise taxonomie UE, SFDR et preuves d'impact pour actifs verts. AUROS Green ajoute une couche documentaire RTMS spécifique à l'énergie tokenisée.",
    relatedTerms: ["sfdr", "taxonomie-europeenne", "finance-durable"],
    internalLinks: [
      { href: "/green", label: "Hub AUROS Green" },
      { href: "/trust", label: "Conformité AUROS" },
    ],
  },
  {
    slug: "sfdr",
    title: "SFDR",
    category: "green-esg",
    shortDefinition:
      "Règlement européen sur la publication d'informations en matière de durabilité dans le secteur financier.",
    extended:
      "Le SFDR classe produits et mandats (article 6, 8, 9) selon intégration ESG et objectifs durables. Un RWA vert commercialisé en UE doit clarifier sa classification et éviter le greenwashing. Les déclarations PAI concernent de nombreux acteurs institutionnels.",
    relatedTerms: ["esg", "taxonomie-europeenne", "greenwashing"],
    internalLinks: [{ href: "/green/faq", label: "FAQ Green" }],
  },
  {
    slug: "taxonomie-europeenne",
    title: "Taxonomie européenne",
    category: "green-esg",
    shortDefinition:
      "Classification UE des activités économiques considérées comme durables sur le plan environnemental.",
    extended:
      "La taxonomie définit critères techniques par secteur (énergie, bâtiment, transport…). Un projet RWA vert peut invoquer l'alignement taxonomique pour certains investisseurs. L'éligibilité requiert analyse substantielle — pas un label marketing automatique.",
    relatedTerms: ["sfdr", "green-bond", "finance-durable"],
    internalLinks: [
      { href: "/green/standards", label: "Standards Green" },
      { href: "/green/impact-report", label: "Rapport d'impact EU Taxonomy" },
    ],
  },
  {
    slug: "green-bond",
    title: "Green bond",
    category: "green-esg",
    shortDefinition:
      "Obligation dont les proceeds financent des projets à bénéfice environnemental défini.",
    extended:
      "Les green bonds suivent souvent les Green Bond Principles (ICMA) avec rapport d'impact. Tokeniser une obligation verte ajoute rails on-chain sans changer les exigences de use-of-proceeds. Le comparateur obligations AUROS inclut des références durables.",
    relatedTerms: ["finance-durable", "taxonomie-europeenne", "tokenisation-energie"],
    internalLinks: [{ href: "/bonds", label: "Comparateur obligations" }],
  },
  {
    slug: "credit-carbone",
    title: "Crédit carbone",
    category: "green-esg",
    shortDefinition:
      "Unité représentant une tonne de CO₂ évitée ou séquestrée, échangeable sur marchés volontaires ou régulés.",
    extended:
      "Les crédits carbone tokenisés posent des questions d'intégrité (additionnalité, permanence) et de double comptage. RTMS exige traçabilité Mesurable et Sain pour les projets AUROS Green. Pas d'équivalence automatique crédit token = compensation validée.",
    relatedTerms: ["rtms", "tokenisation-energie", "certificat-origine-rec"],
    internalLinks: [{ href: "/green/rtms-assistant", label: "Assistant RTMS" }],
  },
  {
    slug: "certificat-origine-rec",
    title: "Certificat d'origine (GO / REC)",
    category: "green-esg",
    shortDefinition:
      "Attestation qu'une quantité d'énergie provient d'une source renouvelable identifiée.",
    extended:
      "Les GO européens et REC nord-américains permettent aux entreprises de revendiquer consommation verte. Tokeniser des certificats exige éviter double vente et lier production mesurée. Pilier Transparent de RTMS couvre cette chaîne.",
    relatedTerms: ["ppa-power-purchase", "rtms", "tokenisation-energie"],
    internalLinks: [{ href: "/green/blog", label: "Articles PPA & traçabilité" }],
  },
  {
    slug: "ppa-power-purchase",
    title: "PPA (Power Purchase Agreement)",
    category: "green-esg",
    shortDefinition:
      "Contrat long terme d'achat d'électricité entre producteur renouvelable et acheteur.",
    extended:
      "Les PPA structurent revenus prévisibles pour parcs solaires ou éoliens — base fréquente de RWA énergie. Tokeniser un PPA expose flux, contrepartie et risques de curtailment. La data room doit inclure contrat, courbes et garanties.",
    relatedTerms: ["revenue-share-token", "tokenisation-energie", "rtms"],
    internalLinks: [
      { href: "/green", label: "AUROS Green" },
      { href: "/wizard?asset=renewable", label: "Wizard actif renouvelable" },
    ],
    faq: [
      {
        question: "Un PPA tokenisé garantit-il un rendement fixe ?",
        answer:
          "Non. Le PPA fixe des règles contractuelles, mais production, défaut acheteur et régulation modulent les flux réels. Toute projection reste indicative.",
      },
    ],
  },
  {
    slug: "investissement-impact",
    title: "Investissement à impact",
    category: "green-esg",
    shortDefinition:
      "Placement visant mesurablement un effet social ou environnemental avec rendement financier.",
    extended:
      "L'impact exige théorie du changement, indicateurs et reporting. En RWA vert, RTMS et label Verified structurent cette démarche côté AUROS Green. Distinction claire entre impact revendiqué et impact démontré.",
    relatedTerms: ["esg", "rtms", "finance-durable"],
    internalLinks: [{ href: "/green/label", label: "Label Green" }],
  },
  {
    slug: "rtms",
    title: "RTMS (Réel, Transparent, Mesurable, Sain)",
    category: "green-esg",
    shortDefinition:
      "Grille documentaire AUROS Green pour évaluer un actif énergétique tokenisé avant label.",
    extended:
      "RTMS structure la due diligence en quatre piliers actionnables — sans promesse de rendement ni agrément régulateur. Elle aide producteurs et analystes à préparer un dossier label ou marketplace. Résultat assistant RTMS indicatif, revue humaine pour Verified.",
    relatedTerms: ["credit-carbone", "ppa-power-purchase", "label-verified-green", "booking-engine-watts"],
    internalLinks: [
      { href: "/green/standards", label: "Grille complète" },
      { href: "/green/rtms-assistant", label: "Assistant RTMS" },
      { href: "/guides/green-rtms", label: "Définition RTMS" },
    ],
  },
  {
    slug: "double-materialite",
    title: "Double matérialité",
    category: "green-esg",
    shortDefinition:
      "Analyse de l'impact de l'entreprise sur le monde et de l'impact du monde sur l'entreprise.",
    extended:
      "La double matérialité est centrale dans CSRD et reporting européen. Les émetteurs RWA avec actifs physiques exposent risques climatiques et impacts locaux. Documenter ces deux faces renforce la crédibilité auprès d'investisseurs institutionnels.",
    relatedTerms: ["csrd", "tcfd", "risque-climatique"],
    internalLinks: [{ href: "/green/faq", label: "FAQ Green" }],
  },
  {
    slug: "csrd",
    title: "CSRD",
    category: "green-esg",
    shortDefinition:
      "Directive européenne élargissant l'obligation de reporting extra-financier pour grandes entreprises.",
    extended:
      "Le CSRD impose informations ESG auditées selon standards ESRS. Les contreparties RWA de grands groupes devront fournir données alignées. Anticiper collecte et qualité des données facilite distribution institutionnelle.",
    relatedTerms: ["double-materialite", "sfdr", "esg"],
    internalLinks: [
      { href: "/green/csrd-check", label: "CSRD Checker AUROS Green" },
      { href: "/trust", label: "Reporting & confiance" },
    ],
  },
  {
    slug: "tcfd",
    title: "TCFD / ISSB",
    category: "green-esg",
    shortDefinition:
      "Cadre de divulgation des risques et opportunités liés au climat pour les entreprises et investisseurs.",
    extended:
      "Les recommandations TCFD (désormais reprises par ISSB) structurent scénarios climatiques et gouvernance. Pour actifs immobiliers ou énergétiques tokenisés, l'analyse de transition et physique alimente le dossier investisseur. Indicateurs indicatifs, pas prévisions garanties.",
    relatedTerms: ["risque-climatique", "double-materialite", "esg"],
    internalLinks: [{ href: "/green", label: "Actifs verts" }],
  },
  {
    slug: "greenwashing",
    title: "Greenwashing",
    category: "green-esg",
    shortDefinition:
      "Communication trompeuse sur le caractère durable ou l'impact réel d'un produit financier.",
    extended:
      "Le greenwashing expose à sanctions AMF, ESMA et réputationnelles. AUROS prône transparence : statuts honnêtes (démo, pilote, Verified), hypothèses explicites, pas de promesse de rendement verte. RTMS et label Verified visent à réduire ce risque documentaire.",
    relatedTerms: ["sfdr", "rtms", "finance-durable"],
    internalLinks: [{ href: "/green/standards", label: "Standards RTMS" }],
  },
  {
    slug: "finance-durable",
    title: "Finance durable",
    category: "green-esg",
    shortDefinition:
      "Système financier intégrant critères environnementaux, sociaux et de gouvernance à long terme.",
    extended:
      "La finance durable combine taxonomie, SFDR, green bonds et produits structurés verts. La tokenisation peut améliorer traçabilité des flux si la documentation suit. AUROS positionne RWA et Green comme outils de préparation, pas de certification régulateur.",
    relatedTerms: ["esg", "taxonomie-europeenne", "green-bond"],
    internalLinks: [
      { href: "/green", label: "Écosystème Green" },
      { href: "/ressources", label: "Ressources AUROS" },
    ],
  },
  {
    slug: "tokenisation-energie",
    title: "Tokenisation énergétique",
    category: "green-esg",
    shortDefinition:
      "Représentation on-chain de droits sur production, PPA, certificats ou projets renouvelables.",
    extended:
      "La tokenisation énergie vise financement de parcs, liquidité sur créances PPA ou traçabilité REC. AUROS Green est dédié à ce segment avec marketplace, registre et label. L'ancrage contractuel et la mesure production priment sur le seul déploiement smart contract.",
    relatedTerms: ["ppa-power-purchase", "rtms", "rwa-real-world-asset", "tokenisation-eau"],
    internalLinks: [
      { href: "/green/market", label: "Marketplace Green" },
      { href: "/green/register", label: "Registre projets" },
      { href: "/comment-tokeniser/energie", label: "Guide tokeniser énergie" },
    ],
  },
  {
    slug: "tokenisation-eau",
    title: "Tokenisation hydrique",
    category: "green-esg",
    shortDefinition:
      "Représentation on-chain de droits d'eau, concessions, flux m³ ou infra dessalement / hydro.",
    extended:
      "La tokenisation eau combine contrats long terme sur volumes, reporting hydrique et critères Taxonomie (DNSH eau). AUROS structure le dossier RWA amont : wizard Green, Watt Score (hydro), rapport d'impact et Label Verified en option. Pas de promesse de liquidité secondaire ni d'agrément régulateur.",
    relatedTerms: ["tokenisation-energie", "rtms", "green-bond", "taxonomie-europeenne"],
    internalLinks: [
      { href: "/eau", label: "Passeport Hydrique AUROS" },
      { href: "/comment-tokeniser/eau", label: "Guide tokeniser l'eau" },
      { href: "/green/impact-report", label: "Rapport d'impact Green" },
      { href: "/green/label", label: "Label Green Verified" },
    ],
  },
  {
    slug: "risque-climatique",
    title: "Risque climatique",
    category: "green-esg",
    shortDefinition:
      "Exposition d'un actif aux effets du changement climatique (physique) et à la transition bas-carbone.",
    extended:
      "Immobilier côtier, agriculture et parcs énergétiques subissent stress tests climatiques croissants. Les investisseurs institutionnels exigent scénarios TCFD dans la data room. Tokeniser n'élimine pas ces risques — la documentation doit les exposer clairement.",
    relatedTerms: ["tcfd", "double-materialite", "esg"],
    internalLinks: [{ href: "/real-estate", label: "RWA immobilier" }],
  },
  {
    slug: "label-verified-green",
    title: "Label AUROS Green Verified",
    category: "green-esg",
    shortDefinition:
      "Statut accordé après revue documentaire AUROS d'un projet énergétique conforme à RTMS.",
    extended:
      "Verified distingue un projet revu humainement du simple dépôt marketplace ou score assistant RTMS. Ce n'est pas un agrément régulateur ni une notation de crédit. Le registre public liste les projets certifiés avec périmètre affiché honnêtement.",
    relatedTerms: ["rtms", "greenwashing", "tokenisation-energie", "booking-engine-watts"],
    internalLinks: [
      { href: "/green/label", label: "Candidater au label" },
      { href: "/green/registry", label: "Registre public" },
      { href: "/guides/green-rtms", label: "Définition RTMS" },
    ],
  },
  {
    slug: "booking-engine-watts",
    title: "Booking engine des watts",
    category: "green-esg",
    shortDefinition:
      "Système qui réserve un profil énergétique, matche la capacité, prouve via CFU et prépare le secondaire RWA — sans PPA ni marché réglementé.",
    extended:
      "AUROS Watts est l'implémentation de référence : matching déterministe, confirm → mint CFU, settle → retire, inventaire producteur et secondaire indicatif. Définition canonique : /guides/booking-engine-watts. Garde-fous : pas d'auto-mint ni auto-transfer.",
    relatedTerms: ["chargeflow-cfu", "rtms", "tokenisation-energie", "ppa-power-purchase"],
    internalLinks: [
      { href: "/guides/booking-engine-watts", label: "Définition complète" },
      { href: "/green/watts", label: "Hub AUROS Watts" },
      { href: "/guides/intents", label: "Intents Watts" },
    ],
    faq: [
      {
        question: "Booking engine des watts vs PPA ?",
        answer:
          "Un PPA est un contrat d'achat d'électricité long terme. Le booking engine réserve et prouve des fenêtres unitaires — couches différentes, souvent complémentaires.",
      },
    ],
  },
  {
    slug: "chargeflow-cfu",
    title: "CFU (ChargeFlow Unit)",
    category: "green-esg",
    shortDefinition:
      "Unité de charge vérifiable off-chain (CFU-E énergie, CFU-W hydrique, CFU-F flex) avec hash et page de vérification publique.",
    extended:
      "ChargeFlow standardise les CFU pour RWA/ESG. Mint et retire explicites. Compatible Supercharger-class sans claim de partnership Tesla. Définition : /guides/chargeflow-cfu.",
    relatedTerms: ["booking-engine-watts", "tokenisation-energie", "tokenisation-eau"],
    internalLinks: [
      { href: "/guides/chargeflow-cfu", label: "Définition CFU" },
      { href: "/green/chargeflow", label: "Demo ChargeFlow" },
    ],
  },
];
