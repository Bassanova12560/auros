import type { Messages } from "../types";

export const fr: Messages = {
  nav: {
    score: "Score",
    tokenize: "Tokeniser",
    dossiers: "Dossiers",
    jurisdictions: "Juridictions",
    partners: "Plateformes",
    login: "Connexion",
    start: "Démarrer",
    menu: "Menu",
  },
  breadcrumb: {
    ariaLabel: "Fil d'Ariane",
    green: "Green",
    compare: "Compare",
    academy: "Academy",
    partners: "Plateformes",
    pricing: "Tarifs",
  },
  hero: {
    eyebrow: "Real World Assets",
    title: "Tokeniser le monde réel.",
    subtitle:
      "Score, data room et studio réglementaire — préparez votre dossier avant toute plateforme RWA.",
    ctaPrimary: "Créer mon dossier",
    ctaEstimate: "Estimer d'abord",
    metricAssets: "Classes d'actifs",
    metricJurisdictions: "Juridictions",
    metricDossier: "Dossier moyen",
  },
  platforms: {
    caption: "Préparation de dossier RWA — sans comparateur de places",
  },
  score: {
    eyebrow: "Score",
    title: "Votre actif est-il prêt ?",
    subtitle: "Une phrase suffit. Résultat instantané, sans compte.",
    placeholder: "Ex. Villa 180 m² à Bordeaux, estimée 1,2 M€…",
    submit: "Calculer le score",
    emailPlaceholder: "Email (optionnel)",
    saveEmail: "Enregistrer",
    emailSaved: "Enregistré ✓",
    linkCopied: "Lien copié",
    linkFailed: "Échec",
    share: "Partager le score",
    reset: "Nouvelle estimation",
    calculate: "Calculer",
    shareBtn: "Partager",
    fullDossier: "Dossier complet",
    otherAsset: "Autre actif",
    disclaimer: "Score indicatif — ne constitue pas un conseil réglementé",
    indicativeNote:
      "Score indicatif basé sur les informations fournies. Ne constitue pas un conseil juridique ou financier.",
    emptyQuery: "Décrivez votre actif en une phrase pour calculer le score.",
    tierHigh: "Fort potentiel de tokenisation",
    tierMid: "Bon potentiel",
    tierLow: "Préparation recommandée",
    quickExamplesLabel: "3 exemples rapides",
    quickExamples: [
      "Appartement T3 Paris 15e, valeur 450 000 €",
      "Portefeuille art contemporain, 3 œuvres, 180 000 €",
      "Créance commerciale, PME Lyon, 250 000 €",
    ],
    inputHint: "~30 secondes · Sans compte · Résultat indicatif",
    exampleCard: {
      title: "Exemple de résultat",
      readiness: "Dossier prêt à 72%",
      maturity: "Maturité · 72% · dossier prêt",
      badgeLegal: "Legal ✓",
      badgeKyc: "KYC ✓",
      badgeMica: "MiCA ⚠",
      badgeDataRoom: "Data room ✓",
      disclaimer: "Exemple illustratif — votre score sera calculé en temps réel",
    },
  },
  regulatory: {
    eyebrow: "Conformité",
    title: "Cadre réglementaire transparent",
    subtitle:
      "AUROS fournit une analyse indicative — pas un conseil juridique ou financier.",
    kyc: "KYC / AML",
    kycDesc:
      "Parcours d'identification aligné sur les standards KYC/AML usuels en tokenisation.",
    jurisdictions: "Juridictions couvertes",
    jurisdictionsDesc:
      "Plus de 40 juridictions modélisées — analyse adaptée au pays de l'actif et aux cadres MiCA / locaux.",
    indicative: "Score indicatif",
    indicativeDesc:
      "Estimation de préparation — validation finale par vos conseils et l'équipe AUROS.",
    partners: "Accompagnement AUROS",
    partnersDesc:
      "Structuration du dossier et revue humaine — pas de place tierce imposée sans accord.",
    disclaimer:
      "Les résultats AUROS sont fournis à titre informatif uniquement et ne constituent pas un conseil en investissement, juridique ou fiscal.",
  },
  trustPage: {
    howWeWorkEyebrow: "Processus",
    howWeWorkTitle: "Comment nous travaillons",
    howWeWorkIntro:
      "Trois étapes concrètes — sans promesse d'agrément, sans intermédiaire imposé. Vous gardez vos conseils ; AUROS structure la préparation.",
    howWeWorkSteps: [
      {
        number: "01",
        title: "Diagnostic gratuit",
        description:
          "Wizard et score indicatif (~12 min) : vous décrivez l'actif, AUROS génère un dossier structuré et une première lecture de préparation.",
      },
      {
        number: "02",
        title: "Arbitrage juridiction",
        description:
          "Comparateur 8 juridictions ou Starter Kit 5 000 € : memo SPV + régulateur cible, livré sous 5 jours ouvrés — à valider avec votre counsel.",
      },
      {
        number: "03",
        title: "Revue humaine AUROS",
        description:
          "Soumission du dossier à l'équipe : complétude data room, cohérence réglementaire indicative, prochaines étapes — sans placement produit tiers.",
      },
    ],
    caseStudiesEyebrow: "Retours anonymisés",
    caseStudiesTitle: "Exemples de parcours",
    caseStudiesNote:
      "Témoignages illustratifs, secteurs et libellés modifiés — pas des références clients certifiées.",
    caseStudies: [
      {
        sector: "Immobilier · France",
        quote:
          "Le dossier PDF nous a permis d'aligner avocat et banque sur la même base en une semaine.",
        context: "Score 72 · comparateur Luxembourg vs France · counsel externe",
      },
      {
        sector: "Énergie renouvelable · UE",
        quote:
          "RTMS Green + wizard renouvelable : première structuration avant due diligence investisseur.",
        context: "Actif solaire · label en candidature · pas d'émission finalisée",
      },
    ],
    infrastructureTitle: "Infrastructure & données",
    infrastructureItems: [
      "Hébergement : Vercel Edge Network — datacenters UE",
      "Chiffrement en transit : TLS 1.3",
      "Chiffrement au repos : AES-256",
      "Durée de conservation : données supprimées sur demande, max 3 ans inactivité",
    ],
    faqTitle: "FAQ confidentialité & DPO",
    badges: ["MiCA-ready", "RGPD", "KYC/AML", "Hébergement UE", "TLS 1.3"],
    faq: [
      {
        question: "Qui a accès à mes données de dossier ?",
        answer:
          "L'équipe AUROS uniquement, dans le cadre de la revue de votre dossier. Aucune transmission à des tiers sans accord explicite.",
      },
      {
        question: "Mes données sont-elles vendues ou utilisées pour de la publicité ?",
        answer: "Non. AUROS ne vend pas de données et n'affiche pas de publicité.",
      },
      {
        question: "Où sont hébergées mes données ?",
        answer:
          "Sur Vercel Edge Network avec datacenters en Europe (Frankfurt, Paris). Aucun transfert hors UE sans base légale RGPD.",
      },
      {
        question: "Puis-je supprimer mon compte et mes données ?",
        answer:
          "Oui. Envoyez une demande à privacy@auros.app — suppression effective sous 30 jours.",
      },
      {
        question: "AUROS est-il soumis au RGPD ?",
        answer:
          "Oui. AUROS traite les données personnelles conformément au RGPD (Règlement UE 2016/679).",
      },
      {
        question: "Qui est le DPO d'AUROS ?",
        answer: "Le responsable de traitement est joignable à privacy@auros.app.",
      },
      {
        question: "Les résultats du score sont-ils confidentiels ?",
        answer:
          "Oui. Votre score et votre dossier sont privés par défaut. Vous contrôlez le partage via le lien de partage généré.",
      },
      {
        question: "Combien de temps mon dossier est-il conservé ?",
        answer:
          "Tant que votre compte est actif, plus 3 ans d'inactivité. Vous pouvez demander la suppression à tout moment.",
      },
    ],
  },
  socialProof: {
    eyebrow: "Preuves",
    title: "Propriétaires d'actifs & opérateurs",
    statDossiers: "2 400+",
    statDossiersLabel: "Dossiers générés (pilote)",
    statJurisdictions: "40+",
    statJurisdictionsLabel: "Juridictions modélisées",
    statTime: "~12 min",
    statTimeLabel: "Temps moyen dossier",
    statPlatforms: "5",
    statPlatformsLabel: "Phases data room",
    t1quote:
      "Score et dossier en une après-midi — sans aller-retour juridique en amont.",
    t1name: "Sofia M.",
    t1role: "Immobilier · Lyon",
    t2quote: "Le dossier structuré nous a fait gagner des semaines.",
    t2name: "James K.",
    t2role: "Crédit privé · Londres",
    t3quote: "Présentation claire pour nos LPs.",
    t3name: "Elena R.",
    t3role: "Art · Genève",
  },
  dossierPreview: {
    eyebrow: "Livrables",
    title: "Un studio de préparation — pas une maquette PDF",
    subtitle:
      "Après le wizard, vous accédez à un espace en ligne (thème sombre) : admission, studio réglementaire, data room, matching plateformes — puis export PDF si besoin.",
    disclaimer:
      "Schéma des sections réelles sur /dossier — le contenu et le score sont les vôtres, pas un exemple viticole figé.",
    ctaWizard: "Créer mon dossier",
    ctaDemo: "Voir un dossier démo",
    blocks: [
      {
        tag: "01",
        title: "Score & admission",
        description:
          "Score indicatif, % d'admission, 3 priorités max — sans liste de 15 manques.",
      },
      {
        tag: "02",
        title: "Studio tokenisation",
        description:
          "Parcours réglementaire, tokenomics, roadmap et prestataires — générés à partir de vos réponses.",
      },
      {
        tag: "03",
        title: "Data room (15 pièces)",
        description:
          "Priorités + upload progressif ; la liste complète reste repliée tant que vous n'en avez pas besoin.",
      },
      {
        tag: "04",
        title: "Demande à l'équipe",
        description:
          "Envoi à AUROS sous 48 h — sans comparateur de places ni logos tiers.",
      },
      {
        tag: "05",
        title: "Export & partage",
        description:
          "PDF bilingue, pack juridique .md, lien de partage — en complément de l'espace en ligne.",
      },
    ],
  },
  quickScore: {
    title: "Estimation rapide",
    close: "Fermer",
    stepAsset: "Type d'actif",
    stepValue: "Valeur estimée",
    stepCountry: "Pays de l'actif",
    next: "Suivant",
    back: "Retour",
    seeScore: "Voir le score",
    ctaFull: "Obtenir le dossier complet",
    prefillNote: "Le wizard sera prérempli avec vos 3 réponses.",
    resultStep: "Résultat",
  },
  stats: {
    scoreMax: "Score max (indicatif)",
    jurisdictions: "Juridictions",
    sections: "Sections dossier",
    avgTime: "Temps moyen",
  },
  trust: {
    mica: "MiCA",
    gdpr: "RGPD",
    kyc: "KYC / AML",
    jurisdictions: "juridictions",
  },
  tiers: {
    high: "Fort potentiel de tokenisation",
    mid: "Bon potentiel",
    low: "Préparation recommandée",
  },
  quickScoreExplain: {
    default:
      "Score indicatif basé sur le type d'actif, la valeur déclarée et la juridiction.",
    high:
      "Profil solide pour une tokenisation — dossier bien positionné pour une revue AUROS.",
    mid:
      "Bon potentiel — complétez le dossier (titres, conformité, revenus) pour maximiser l'éligibilité.",
    low:
      "Préparation recommandée — documentation et structure juridique à clarifier.",
  },
  story: {
    act1Title: "Vous détenez des actifs réels",
    act1Body:
      "Immobilier, art, métaux, véhicules — un patrimoine tangible que les marchés numériques peinent encore à lire.",
    act2Title: "Le monde digital ne les voit pas encore",
    act2Body:
      "Réglementation, illiquidité, documentation dispersée : la tokenisation exige un langage que peu d'actifs possèdent nativement.",
    act3Title: "AUROS traduit l'actif pour l'on-chain",
    act3Body:
      "Score, dossier institutionnel et feuille de route — en quelques minutes, sans promesse on-chain.",
  },
  progress: {
    title: "Préparation tokenisation",
    subtitle: "Complétez le dossier pour monter en score",
    itemAsset: "Type d'actif identifié",
    itemValue: "Valeur estimée",
    itemLocation: "Juridiction",
    itemDescription: "Description détaillée (20+ mots)",
    itemDocuments: "Documentation disponible",
    itemDossier: "Dossier complet généré",
  },
  scoreReveal: {
    tierHigh: "FORT POTENTIEL DE TOKENISATION",
    tierStrong: "BON POTENTIEL DE TOKENISATION",
    tierModerate: "POTENTIEL MODÉRÉ",
    tierPrep: "PRÉPARATION RECOMMANDÉE",
    microHigh: "Top 12 % des actifs de cette catégorie",
    microStrong: "Top 28 % des actifs de cette catégorie",
    microModerate: "Fourchette médiane pour cette classe d'actifs",
    microPrep: "Accompagnement structuration disponible",
  },
  howItWorks: {
    eyebrow: "Parcours",
    title: "Trois étapes jusqu'au dossier",
    step1Title: "Décrivez l'actif",
    step1Desc:
      "15 étapes guidées : type, valeur, structure, revenus, conformité. Chaque question est contextualisée pour votre classe d'actif — pas de jargon inutile.",
    step2Title: "Score & dossier IA",
    step2Desc:
      "Rapport institutionnel, studio réglementaire, export PDF. Le score de préparation et les priorités sont générés en temps réel à partir de vos réponses.",
    step3Title: "Soumission",
    step3Desc:
      "Envoi à l'équipe AUROS, MiCA, prochaines étapes concrètes. Vous recevez un retour sous 48h ouvrées avec les actions prioritaires pour avancer.",
    step1Duration: "~2 min",
    step2Duration: "~8 min",
    step3Duration: "Réponse sous 48h",
    screenshotPlaceholder: "Capture écran wizard",
    faqTitle: "Questions fréquentes",
    faq: [
      {
        question: "Dois-je préparer des documents avant de commencer ?",
        answer:
          "Non. Le wizard guide chaque étape. Les documents (titre, évaluation, KYC) sont demandés en fin de parcours, pas au départ.",
      },
      {
        question: "Que se passe-t-il si mon score est bas ?",
        answer:
          "AUROS fournit 3 priorités concrètes à corriger — pas une liste de 15 manques. Vous pouvez améliorer le dossier et recalculer.",
      },
      {
        question: "Ai-je besoin d'un avocat avant de remplir le dossier ?",
        answer:
          "Non. Le dossier AUROS est une préparation, pas un acte juridique. L'avocat intervient après, avec un brief déjà structuré (-40% d'heures facturables).",
      },
      {
        question: "Sous quel délai l'équipe AUROS répond-elle ?",
        answer:
          "Sous 48h ouvrées après soumission. Les Starter Kits juridictions sont livrés immédiatement après paiement.",
      },
      {
        question: "Le dossier m'engage-t-il à quelque chose ?",
        answer:
          "Non. Aucun engagement, aucun frais à ce stade. La décision de tokeniser reste entièrement la vôtre.",
      },
    ],
  },
  finalCta: {
    title: "Passez à la tokenisation avec un dossier prêt",
    subtitle: "Gratuit pour commencer. Score, dossier IA, export PDF.",
    wizard: "Lancer le wizard",
    score: "Tester le score",
  },
  greenPromo: {
    eyebrow: "AUROS Green",
    title: "Écosystème énergie verte & RWA tokenisé",
    subtitle:
      "Place de marché mondiale, standard RTMS, registre public et label Verified — statuts honnêtes, pas de greenwashing.",
    cta: "Hub écosystème",
    marketCta: "Place de marché",
    registerCta: "Vendre mon surplus",
  },
  assetUniverse: {
    eyebrow: "Univers RWA",
    title: "Chaque actif réel, prêt pour la tokenisation",
    subtitle:
      "Maturité du dossier, data room et studio réglementaire — déploiement on-chain en phase 2.",
    cards: [
      {
        title: "Immobilier",
        desc: "Résidentiel, commercial, fonciers tokenisables.",
        stat: "€2.4T",
        statLabel: "marché EU (indicatif)",
      },
      {
        title: "Art & collectibles",
        desc: "Œuvres, montres, vins.",
        stat: "48h",
        statLabel: "dossier type",
      },
      {
        title: "Crédit privé",
        desc: "Pools institutionnels structurés.",
        stat: "MiCA",
        statLabel: "cadre EU",
      },
      {
        title: "Métaux & énergie",
        desc: "Or, infrastructures productives.",
        stat: "12+",
        statLabel: "classes",
      },
    ],
  },
  footer: {
    tagline: "Intelligence de tokenisation pour actifs réels.",
    product: "Produit",
    legal: "Légal",
    terms: "CGU",
    privacy: "Confidentialité",
    legalNotice: "Mentions légales",
    rights: "AUROS · Tous droits réservés.",
    howItWorks: "Comment ça marche",
    discover: "Découvrir",
    trust: "Confiance",
    compareAll: "Comparer tous les rendements RWA",
    jurisdictionComparator: "Comparateur juridictions",
    stablecoins: "Stablecoins RWA",
    realEstate: "Immobilier RWA",
    bonds: "Obligations RWA",
    commodities: "Matières premières RWA",
    privateCredit: "Crédit privé RWA",
    academy: "AUROS Academy",
    green: "AUROS Green",
    faq: "FAQ",
    resources: "Ressources",
    about: "À propos",
    pricing: "Tarifs",
  },
};
