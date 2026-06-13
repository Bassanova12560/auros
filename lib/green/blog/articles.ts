export type GreenBlogSection = {
  heading: string;
  paragraphs: string[];
};

export type GreenBlogArticle = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  modifiedAt: string;
  readingTimeMinutes: number;
  keywords: string[];
  sections: GreenBlogSection[];
  cta: { href: string; label: string };
};

export const GREEN_BLOG_ARTICLES: GreenBlogArticle[] = [
  {
    slug: "quest-ce-que-rtms",
    title: "Qu'est-ce que RTMS ? La grille AUROS Green expliquée",
    description:
      "RTMS — Réel, Transparent, Mesurable, Sain : comprendre la grille de référence AUROS Green pour évaluer un actif énergétique tokenisé avant label.",
    excerpt:
      "RTMS structure la due diligence documentaire d'un RWA vert en quatre piliers actionnables — sans promesse de rendement ni agrément régulateur.",
    publishedAt: "2025-11-12",
    modifiedAt: "2026-03-18",
    readingTimeMinutes: 9,
    keywords: [
      "RTMS",
      "standard énergie verte",
      "RWA vert",
      "tokenisation renouvelable",
      "AUROS Green",
    ],
    cta: { href: "/green/standards", label: "Lire la grille RTMS complète" },
    sections: [
      {
        heading: "Pourquoi une grille dédiée aux RWA verts ?",
        paragraphs: [
          "La tokenisation d'actifs énergétiques — production solaire, certificats REC, crédits carbone, PPA — attire investisseurs impact et promoteurs. Pourtant, le marché manque souvent de critères communs : un token peut exister on-chain sans preuve off-chain reproductible.",
          "RTMS (Réel, Transparent, Mesurable, Sain) est la réponse AUROS Green : une grille documentaire éducative, pas un agrément régulateur. Elle aide porteurs et analystes à poser les bonnes questions avant label ou investissement.",
        ],
      },
      {
        heading: "Pilier 1 — Réel",
        paragraphs: [
          "Un actif RTMS doit exister hors blockchain : centrale, contrat PPA, installation mesurée ou programme carbone avec périmètre géographique clair. Les preuves attendues incluent contrats, factures, certificats d'origine ou rapports d'audit tiers lorsque disponibles.",
          "Les actifs purement synthétiques ou les promesses futures sans installation opérationnelle ne satisfont pas ce pilier. AUROS Green distingue honnêtement démo, pilote et Verified au registre.",
        ],
      },
      {
        heading: "Pilier 2 — Transparent",
        paragraphs: [
          "La traçabilité documentaire est centrale : qui produit, qui consomme, quelles commissions, quels intermédiaires. Un dossier RTMS expose la chaîne de valeur sans zone d'ombre volontaire.",
          "Pour un PPA tokenisé, cela signifie identifier l'offtaker, la durée contractuelle, les clauses de résiliation et la méthode d'allocation énergétique. Voir aussi notre article sur les PPA et la traçabilité.",
        ],
      },
      {
        heading: "Pilier 3 — Mesurable",
        paragraphs: [
          "Les métriques doivent être reproductibles : MWh produits, tCO₂ évitées, rendement indicatif avec hypothèses explicites. AUROS Green refuse les chiffres marketing sans source.",
          "L'assistant RTMS préliminaire (/green/rtms-assistant) aide à auto-évaluer ce pilier avant candidature label — résultat indicatif, revue humaine obligatoire pour Verified.",
        ],
      },
      {
        heading: "Pilier 4 — Sain",
        paragraphs: [
          "« Sain » couvre la structure juridique et les risques assumés : SPV, garanties, conformité locale, limitations du token (utility vs security). Aucune dissimulation des risques réglementaires ou opérationnels.",
          "RTMS ne certifie pas la « santé financière » au sens rendement — seulement que les risques sont documentés et compréhensibles par un investisseur informé.",
        ],
      },
      {
        heading: "RTMS vs label Verified",
        paragraphs: [
          "Respecter RTMS sur le papier ne suffit pas : le label Auros Green Verified exige une revue documentaire AUROS. Le comparateur (/green/compare) liste des références marché éducatives avec statuts honnêtes — certified uniquement après registre.",
          "Prochaine étape : parcourez /green/standards, testez l'assistant RTMS, puis candidatez sur /green/label si votre dossier est mûr.",
        ],
      },
    ],
  },
  {
    slug: "producteur-vs-stockeur",
    title: "Producteur vs stockeur : rôles et synergies sur AUROS Green",
    description:
      "Comprendre la différence entre producteurs et stockeurs d'énergie sur la marketplace AUROS Green — et comment ils se complètent dans un écosystème local.",
    excerpt:
      "Producteurs génèrent, stockeurs absorbent les excédents : deux profils complémentaires sur la carte mondiale AUROS Green.",
    publishedAt: "2025-12-03",
    modifiedAt: "2026-02-14",
    readingTimeMinutes: 8,
    keywords: [
      "producteur solaire",
      "stockage BESS",
      "marketplace énergie verte",
      "excédent solaire",
      "AUROS Green",
    ],
    cta: { href: "/green/register", label: "Référencer mon acteur" },
    sections: [
      {
        heading: "Deux rôles, un même écosystème",
        paragraphs: [
          "Sur AUROS Green, la marketplace mondiale (/green/market) cartographie quatre types d'acteurs. Les producteurs et les stockeurs forment le couple le plus recherché pour équilibrer production intermittente et demande locale.",
          "Un producteur photovoltaïque ou éolien injecte des MWh sur le réseau ou en autoconsommation. Un stockeur (BESS — Battery Energy Storage System) capte l'excédent pour le restituer aux heures de pointe ou lors de déficit réseau.",
        ],
      },
      {
        heading: "Profil producteur",
        paragraphs: [
          "Centrales solaires toiture ou au sol, parcs éoliens, micro-hydro : le producteur publie capacité installée, localisation et surplus disponible. Les annonces vente indiquent volume (MWh), prix indicatif au kWh et fenêtre de disponibilité.",
          "Les producteurs certifiés RTMS affichent le badge Verified sur leur fiche acteur (/green/market/actor). Les profils « referenced » ont passé la modération AUROS sans label complet.",
        ],
      },
      {
        heading: "Profil stockeur",
        paragraphs: [
          "Le stockeur ne produit pas : il offre une capacité en MWh ou en puissance (MW). Utile pour industriels cherchant à lisser leur consommation ou pour collectivités pilotant des micro-réseaux.",
          "La page /green/storers liste les acteurs stockage filtrables depuis la carte. Le géocodage ville+pays permet de trouver une capacité dans un rayon configurable.",
        ],
      },
      {
        heading: "Synergies producteur ↔ stockeur",
        paragraphs: [
          "Sans stockage, le surplus solaire midday peut être valorisé difficilement. Un producteur et un stockeur voisins peuvent structurer un échange local — hors obligation de tokenisation, mais compatible avec un PPA ou un RWA vert documenté RTMS.",
          "AUROS Green ne facilite pas le contrat juridique entre parties : la marketplace est un annuaire géolocalisé avec contact direct. Pour structurer juridiquement, le wizard actif renouvelable (/wizard?asset=renewable) reste le point d'entrée AUROS.",
        ],
      },
      {
        heading: "Consommateurs et rechargeurs",
        paragraphs: [
          "Les consommateurs (/green/consumers) publient une demande d'achat — sites industriels, campus, flottes. Les rechargeurs VE (/green/chargers) complètent la chaîne mobilité électrique.",
          "Quatre profils, une carte : filtrez par type, pays et rayon depuis /green/market.",
        ],
      },
      {
        heading: "Comment apparaître sur la carte",
        paragraphs: [
          "Formulaire /green/register : type d'acteur, ville, pays, email contact, description. Modération 48 h. Statut démo masqué automatiquement lorsque suffisamment d'acteurs referenced existent en zone.",
          "Pour le label Verified au-delà de la simple fiche : candidature /green/label avec dossier RTMS complet.",
        ],
      },
    ],
  },
  {
    slug: "label-verified-green",
    title: "Label Auros Green Verified : parcours, critères et limites",
    description:
      "Tout savoir sur le label Auros Green Verified — candidature, revue RTMS, registre public et ce que le label ne garantit pas.",
    excerpt:
      "Le label Verified atteste une revue documentaire RTMS — pas un audit sur site ni une promesse de rendement.",
    publishedAt: "2026-01-08",
    modifiedAt: "2026-05-22",
    readingTimeMinutes: 10,
    keywords: [
      "Auros Green Verified",
      "label RWA vert",
      "certification RTMS",
      "registre green",
      "tokenisation énergie",
    ],
    cta: { href: "/green/label", label: "Candidater au label" },
    sections: [
      {
        heading: "À quoi sert le label ?",
        paragraphs: [
          "Auros Green Verified distingue les projets ayant passé une revue documentaire RTMS sur /green/label. Le badge apparaît au registre public (/green/registry) avec lien de vérification (/green/verify).",
          "Objectif : transparence pour investisseurs impact, presse et partenaires — pas substitution à une due diligence financière complète.",
        ],
      },
      {
        heading: "Types de projets éligibles",
        paragraphs: [
          "Solaire, éolien, REC (Renewable Energy Certificates), crédits carbone, PPA, ou autre RWA vert décrit précisément. Le formulaire demande périmètre géographique, capacité, documents probants et contact responsable.",
          "Les projets en phase purement conceptuelle sans actif réel ne sont pas éligibles Verified — ils peuvent rester des références éducatives au comparateur avec statut « reference ».",
        ],
      },
      {
        heading: "Déroulement de la revue",
        paragraphs: [
          "1. Soumission candidature in-app. 2. Contrôle complétude RTMS (Réel, Transparent, Mesurable, Sain). 3. Retour sous cinq jours ouvrés (objectif). 4. Publication registre si validé.",
          "En cas de lacunes, AUROS liste les points à compléter — resoumission sans pénalité. L'assistant RTMS (/green/rtms-assistant) permet un pré-diagnostic avant envoi.",
        ],
      },
      {
        heading: "Ce que le label couvre",
        paragraphs: [
          "Cohérence documentaire RTMS, traçabilité des métriques annoncées, structure juridique décrite, risques explicités. Vérification publique via token registre.",
          "Le label Phase 1 est documentaire — pas d'audit sur site, pas de mesure live continue, pas de garantie de performance énergétique ou financière.",
        ],
      },
      {
        heading: "Ce que le label ne couvre pas",
        paragraphs: [
          "Pas d'agrément AMF, SEC, FCA ou autre régulateur. Pas de conseil en investissement. Pas de certification ISO ou équivalent automatique. Pas de rating crédit.",
          "Investisseurs : croisez toujours le registre AUROS avec votre propre due diligence et counsel local.",
        ],
      },
      {
        heading: "Cas pilote vs Verified",
        paragraphs: [
          "Le registre publie aussi des cas pilote RTMS — méthodologie transparente, statut distinct du Verified. Le comparateur (/green/compare) affiche des statuts honnêtes : certified, in_review, reference, not_labeled.",
          "Confusion interdite : aucune ligne comparateur n'affiche « certified » sans entrée registre Verified correspondante.",
        ],
      },
      {
        heading: "Après obtention du label",
        paragraphs: [
          "Fiche registre public, badge marketplace si acteur référencé, lien verify partageable. Renouvellement et mise à jour documentaire prévus en roadmap — date de certification visible sur la fiche projet.",
          "Pour les entreprises en scope CSRD, complétez le CSRD Checker (/green/csrd-check) puis commandez un Impact Report PDF (/green/impact-report) EU Taxonomy + RTMS depuis votre dossier.",
          "Experts Praticien Green (/green/praticien) peuvent accompagner la préparation dossier — examen RTMS beta disponible.",
        ],
      },
    ],
  },
  {
    slug: "ppa-et-tracabilite",
    title: "PPA et traçabilité énergétique : exigences RTMS",
    description:
      "Power Purchase Agreement tokenisé : comment RTMS encadre la traçabilité production-consommation et les preuves documentaires attendues.",
    excerpt:
      "Un PPA tokenisé doit prouver qui produit, qui achète et comment l'énergie est allouée — pilier Transparent de RTMS.",
    publishedAt: "2026-02-20",
    modifiedAt: "2026-04-10",
    readingTimeMinutes: 11,
    keywords: [
      "PPA tokenisé",
      "traçabilité énergie",
      "power purchase agreement",
      "REC blockchain",
      "RTMS transparent",
    ],
    cta: { href: "/green/rtms-assistant", label: "Tester l'assistant RTMS" },
    sections: [
      {
        heading: "PPA : rappel utile",
        paragraphs: [
          "Un Power Purchase Agreement lie un producteur d'énergie renouvelable à un acheteur (offtaker) sur une durée définie, à prix fixe ou indexé. Tokeniser un PPA consiste à représenter on-chain tout ou partie des flux contractuels — droits, cash-flows ou certificats associés.",
          "La complexité n'est pas technologique seulement : sans traçabilité off-chain, le token perd son ancrage « Réel » RTMS.",
        ],
      },
      {
        heading: "Traçabilité production",
        paragraphs: [
          "Preuves attendues : contrat PPA signé, identité producteur (SPV ou utility), localisation installation, courbes de production historiques ou prévisionnelles sourcées, compteurs certifiés si disponibles.",
          "Pour le solaire distribué : factures injection réseau, certificats d'origine, contrats autoconsommation collective le cas échéant.",
        ],
      },
      {
        heading: "Traçabilité allocation",
        paragraphs: [
          "Qui consomme réellement l'énergie contractée ? L'offtaker corporate doit être identifié — pas de « consommateur anonyme » dans un dossier Verified.",
          "Les mécanismes de matching hourly (24/7 clean energy) gagnent en exigence : RTMS demande que la méthode soit documentée, même si le projet vise du matching annuel simplifié en Phase 1.",
        ],
      },
      {
        heading: "Token on-chain vs réalité off-chain",
        paragraphs: [
          "Le smart contract ou le registre token doit référencer explicitement le contrat PPA (hash document, identifiant registre, oracle métier si utilisé). Les oracles ne remplacent pas les preuves contractuelles de base.",
          "AUROS Green n'émet pas de tokens : la grille RTMS évalue la cohérence dossier avant label, pas l'audit code smart contract.",
        ],
      },
      {
        heading: "REC et double comptage",
        paragraphs: [
          "Un PPA corporate est souvent couplé à des REC. RTMS exige de clarifier si les certificats sont inclus, réservés au producteur ou transférés à l'offtaker — risque majeur de double comptage carbone.",
          "Documentez la chaîne REC de bout en bout. En cas d'ambiguïté, la revue label demande clarification avant Verified.",
        ],
      },
      {
        heading: "Checklist candidature label PPA",
        paragraphs: [
          "Contrat PPA + annexes, identités parties, cartographie installation, historique MWh 12 mois minimum si opérationnel, politique REC, structure token (utility/security — disclaimer counsel), risques réglementaires pays d'émission.",
          "Utilisez /green/label pour soumettre et /green/rtms-assistant pour pré-valider le pilier Transparent.",
        ],
      },
      {
        heading: "Aller plus loin",
        paragraphs: [
          "Article connexe : Qu'est-ce que RTMS (/green/blog/quest-ce-que-rtms). Guide surplus (/green/tokenize-surplus). Wizard actif renouvelable (/wizard?asset=renewable) pour dossier admission AUROS principal.",
        ],
      },
    ],
  },
  {
    slug: "marketplace-energie-verte",
    title: "Marketplace énergie verte AUROS : mode d'emploi",
    description:
      "Carte mondiale, filtres, annonces et statuts — comment utiliser la marketplace AUROS Green pour trouver ou publier un acteur énergie.",
    excerpt:
      "Carte Leaflet 25+ pays, annonces MVP, statuts honnêtes — le guide pratique de /green/market.",
    publishedAt: "2026-03-05",
    modifiedAt: "2026-05-30",
    readingTimeMinutes: 7,
    keywords: [
      "marketplace énergie verte",
      "carte producteurs solaire",
      "AUROS Green market",
      "énergie locale",
      "annonce solaire",
    ],
    cta: { href: "/green/market", label: "Ouvrir la marketplace" },
    sections: [
      {
        heading: "Vision de la marketplace",
        paragraphs: [
          "AUROS Green marketplace (/green/market) est un annuaire géolocalisé mondial : producteurs, stockeurs, rechargeurs VE et consommateurs publiés sur une carte Leaflet interactive. Objectif Phase MVP : rendre visible l'énergie locale tokenisable ou échangeable — sans prétendre couvrir tout le marché mondial.",
          "25+ pays pilotes avec acteurs seed éducatifs et fiches referenced soumises via /green/register.",
        ],
      },
      {
        heading: "Navigation carte et filtres",
        paragraphs: [
          "Zoomez sur une région, filtrez par type d'acteur, pays, ville et rayon (km). La recherche géocode via Nominatim avec repli sur le registre interne si échec.",
          "Cliquez un marqueur pour la fiche acteur (/green/market/actor/{id}) ou une annonce (/green/market/offer/{id}). Retour carte avec acteur focalisé via paramètre URL.",
        ],
      },
      {
        heading: "Annonces vente et achat",
        paragraphs: [
          "Chaque annonce précise côté (vente/achat), énergie (solaire, éolien…), volume MWh, prix indicatif €/kWh, acteur lié et tier (demo, referenced, verified).",
          "Les prix sont indicatifs MVP — pas cotation officielle. Contact direct via email acteur ou formulaire intérêt selon fiche.",
        ],
      },
      {
        heading: "Statuts honnêtes",
        paragraphs: [
          "Demo : données seed éducatives, masquées progressivement quand la zone atteint assez d'acteurs referenced. Referenced : modération AUROS passée. Verified : dossier RTMS label validé.",
          "Aucun badge Verified sans registre correspondant — transparence core AUROS Green.",
        ],
      },
      {
        heading: "Publier sa fiche",
        paragraphs: [
          "Formulaire /green/register : choisissez type, décrivez capacité, ville+pays, contact. Délai modération 48 h ouvrées. Après publication, ajoutez des annonces depuis votre espace /green/my (MVP localStorage + sync registre).",
          "Label Verified optionnel ensuite via /green/label pour crédibiliser le dossier auprès d'investisseurs.",
        ],
      },
      {
        heading: "Limites MVP",
        paragraphs: [
          "Pas de matching automatique, pas d'escrow, pas de règlement on-chain intégré. AUROS Green connecte — les parties contractent en dehors. Pour structuration token RWA, utilisez le wizard AUROS (/wizard?asset=renewable).",
          "Questions fréquentes : /green/faq. Standard RTMS : /green/standards.",
        ],
      },
    ],
  },
];

export function getGreenBlogArticle(slug: string): GreenBlogArticle | undefined {
  return GREEN_BLOG_ARTICLES.find((a) => a.slug === slug);
}

export function getAllGreenBlogSlugs(): string[] {
  return GREEN_BLOG_ARTICLES.map((a) => a.slug);
}

export function greenBlogArticlePath(slug: string): string {
  return `/green/blog/${slug}`;
}
