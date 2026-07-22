import { blogArticlePath } from "./paths";

export type BlogSection = {
  heading: string;
  paragraphs: string[];
  /** Max 3 internal links per section (UX) */
  links?: { href: string; label: string }[];
};

export type BlogCtaBlock = {
  afterSection: number;
  title: string;
  links: { href: string; label: string }[];
};

export type BlogArticle = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  modifiedAt: string;
  readingTimeMinutes: number;
  keywords: string[];
  sections: BlogSection[];
  faq: { question: string; answer: string }[];
  cta: { href: string; label: string };
  ctaBlocks?: BlogCtaBlock[];
};

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "real-estate-tokenization-europe",
    title: "Tokenisation immobilière en Europe : guide complet",
    description:
      "Guide complet tokenisation immobilière en UE : cadre MiCA, SPV, juridictions (Luxembourg, France), coûts, rendements et parcours émetteur. Contenu éducatif indicatif — counsel requis avant émission.",
    excerpt:
      "Pourquoi et comment tokeniser un actif immobilier en Europe en 2026 : régulation MiCA, structures SPV, arbitrage juridictionnel, coûts indicatifs et parcours émetteur — sans promesse de rendement ni conseil juridique.",
    publishedAt: "2026-06-11",
    modifiedAt: "2026-06-11",
    readingTimeMinutes: 18,
    keywords: [
      "tokenisation immobilière Europe",
      "real estate tokenization EU",
      "MiCA immobilier",
      "SPV tokenisation",
      "RWA immobilier",
      "fractionnalisation immobilière blockchain",
      "Luxembourg RWA",
    ],
    cta: { href: "/wizard", label: "Structurer mon dossier immobilier" },
    ctaBlocks: [
      {
        afterSection: 1,
        title: "Vérifier votre exposition MiCA",
        links: [
          { href: "/tools/mica-checker", label: "Test MiCA indicatif" },
          { href: "/glossary/mica", label: "Définition MiCA" },
          { href: "/trust", label: "Confiance & conformité" },
        ],
      },
      {
        afterSection: 4,
        title: "Estimer coût et juridiction",
        links: [
          { href: "/tools/cost-estimator", label: "Estimateur de coût" },
          { href: "/tools/jurisdiction-picker", label: "Sélecteur juridiction" },
          { href: "/jurisdictions", label: "Comparateur juridictions" },
        ],
      },
      {
        afterSection: 5,
        title: "Comparer le marché immobilier tokenisé",
        links: [
          { href: "/real-estate", label: "Comparateur immobilier" },
          { href: "/tools/yield-calculator", label: "Calculateur rendement" },
          { href: "/compare", label: "Hub comparateur RWA" },
        ],
      },
    ],
    sections: [
      {
        heading: "Pourquoi tokeniser un actif immobilier en Europe ?",
        paragraphs: [
          "La tokenisation immobilière consiste à matérialiser des droits économiques sur un bien réel — immeuble de rapport, résidence gérée, foncière commerciale — via des jetons on-chain adossés à une structure juridique off-chain. En Europe, l'intérêt n'est pas le buzz blockchain : c'est l'accès à de nouveaux investisseurs, la fractionnalisation du ticket d'entrée et une chaîne documentaire plus traçable pour les family offices et fonds.",
          "Contrairement à une vente classique de parts de SCPI ou à un club deal fermé, un RWA immobilier peut viser une liquidité secondaire encadrée, des règles de transfert programmées on-chain et une data room alignée sur les attentes MiCA et droit des valeurs mobilières. Le potentiel est réel — mais la structuration prime sur la technologie.",
          "Les promoteurs européens cherchent surtout trois leviers : diversifier les sources de financement sans diluer le contrôle opérationnel, abaisser le ticket minimum pour des investisseurs qualifiés ou professionnels, et préparer un registre d'actionnaires compatible avec des audits récurrents. Aucun de ces objectifs ne dispense d'une qualification juridique préalable.",
          "Ce guide est éducatif et indicatif. Il ne constitue pas un conseil juridique, fiscal ou financier. Avant toute offre au public ou placement privé, un counsel spécialisé dans votre juridiction et la qualification du jeton est indispensable.",
        ],
        links: [
          { href: "/discover", label: "Découvrir les actifs RWA" },
          { href: "/how-it-works", label: "Comment fonctionne AUROS" },
        ],
      },
      {
        heading: "Cadre réglementaire : MiCA et droit national",
        paragraphs: [
          "Le règlement MiCA (Markets in Crypto-Assets, UE 2023/1114) harmonise une partie du cadre européen pour les crypto-actifs : whitepaper, gouvernance émetteur, agrément des prestataires (CASP). Pour un RWA immobilier, MiCA ne remplace pas le droit des valeurs mobilières national : un jeton représentant des parts économiques peut relever simultanément de MiCA, d'un prospectus ou d'une exemption de placement privé selon le pays et le profil investisseur visé.",
          "La double qualification est fréquente. Un token présenté comme « utilitaire » peut être requalifié security token si les droits économiques dominent — dividendes issus des loyers, plus-value à la cession, gouvernance économique. L'AMF en France, la CSSF au Luxembourg ou la BaFin en Allemagne appliquent chacune une doctrine propre. Ne présumez jamais une échappatoire réglementaire sur la base du seul standard technique ERC-3643 ou ERC-20.",
          "Les obligations documentaires convergent vers la transparence : description de l'actif sous-jacent, risques (vacance, taux, change, exécution travaux), chaîne de détention (SPV, registre), mécanisme de distribution des flux et limitations de transfert. Le whitepaper MiCA et le prospectus financier peuvent coexister — leur périmètre doit être coordonné par votre counsel.",
          "La période transitoire MiCA pour les acteurs historiques ne garantit pas un « droit acquis » illimité sur des modèles non conformes. Les émetteurs immobiliers nouveaux ont intérêt à structurer dès le départ une data room de 15 pièces indicatives (contrats, KYC, audits, smart contracts) plutôt que de rattraper la conformité après commercialisation.",
          "AUROS positionne explicitement ses analyses comme indicatives : le wizard et les outils Pilier 1 aident à prioriser la préparation, pas à valider une offre. La revue humaine et le counsel externe restent le garde-fou institutionnel.",
        ],
        links: [
          { href: "/glossary/mica", label: "Glossaire MiCA" },
          { href: "/glossary/whitepaper-mica", label: "Whitepaper MiCA" },
          { href: "/glossary/security-token", label: "Security token" },
        ],
      },
      {
        heading: "Structures juridiques : SPV, fractionnalisation et fonds",
        paragraphs: [
          "La SPV (Special Purpose Vehicle) est la brique centrale de la plupart des tokenisations immobilières européennes. Elle détient le titre de propriété ou le bail emphytéotique, contracte la dette éventuelle et émet les droits économiques que les jetons représentent. L'isolation du bilan protège l'émetteur promoteur et clarifie le périmètre d'audit pour les investisseurs.",
          "La fractionnalisation peut prendre plusieurs formes : parts sociales de SPV tokenisées en ERC-20 ou ERC-3643, parts de fonds (SICAV part II, FCP, RAIF au Luxembourg) avec un jeton comme droit de créance sur la part, ou encore co-investissement via une holding intermédiaire. Le choix impacte fiscalité, délais d'agrément et coûts récurrents de tenue de registre.",
          "ERC-3643 (ex T-REX) est souvent retenu pour les security tokens institutionnels car il intègre whitelist, restrictions de transfert et identité on-chain — prérequis pour des investisseurs professionnels soumis à KYC/AML. ERC-20 seul reste possible avec des modules compliance off-chain, mais la gouvernance des transferts est plus fragile sans contrôle on-chain natif.",
          "Les wrappers « fonds » conviennent aux portefeuilles multi-actifs (résidences étudiantes, logistique urbaine) où la diversification est le message commercial. Ils allongent le calendrier (agrément gestionnaire, dépositaire) mais rassurent certains distributeurs. Un immeuble unique peut rester en SPV dédiée avec gouvernance simplifiée — à valider selon ticket cible et pays de distribution.",
          "Quelle que soit la structure, alignez tokenomics et documentation légale : droits de vote, waterfall de distribution (loyers nets, réserve travaux, remboursement dette), clauses de sortie et lock-up doivent être identiques dans le pacte d'associés, le prospectus ou whitepaper et le smart contract.",
        ],
        links: [
          { href: "/glossary/spv", label: "Définition SPV" },
          { href: "/glossary/erc-3643", label: "ERC-3643 (T-REX)" },
          { href: "/glossary/propriete-fractionnee", label: "Propriété fractionnée" },
        ],
      },
      {
        heading: "Arbitrage juridictionnel : Luxembourg, France et alternatives",
        paragraphs: [
          "Le choix de juridiction SPV et d'agrément régulateur conditionne délais, coûts et crédibilité auprès des investisseurs. L'UE offre un passeport partiel via MiCA pour les crypto-actifs et via le prospectus pour les titres financiers — mais la structuration initiale reste nationale.",
          "Le Luxembourg attire les véhicules d'investissement institutionnels : écosystème CSSF mature, RAIF et SCS familiers aux fonds, prestataires custody et administrateurs habitués aux RWA. Les délais varient selon le périmètre CASP et la complexité du véhicule — comptez souvent plusieurs mois pour un modèle régulé complet, hors phase de préparation documentaire.",
          "La France convient lorsque l'actif et les investisseurs cibles sont majoritairement français : doctrine AMF connue, marché retail encadré pour les placements collectifs, réseau de notaires et fiscalité immobilière maîtrisée localement. Un token distribué en France peut nécessiter analyse PSI / PSAN / CASP selon le modèle — ne pas confondre immobilier physique et intermédiation crypto.",
          "D'autres juridictions UE (Allemagne, Pays-Bas, Espagne) et hubs hors UE (DIFC, VARA) apparaissent dans les comparatifs lorsque l'émetteur vise un marché export ou une holding intermédiaire. Il n'existe pas de « meilleure » juridiction universelle : seulement un fit avec actif, investisseurs, fiscalité et calendrier.",
          "Le comparateur AUROS couvre huit juridictions avec paramètres indicatifs — régulateur, délais moyens, coûts d'entrée, friendliness RWA. Le Starter Kit phase 0 (5 000 € HT) produit un memo juridiction personnalisé distinct du wizard gratuit orienté actif.",
        ],
        links: [
          { href: "/blog/tokenisation-rwa-luxembourg", label: "Guide Luxembourg RWA" },
          { href: "/jurisdictions/luxembourg-real-estate", label: "Fiche Luxembourg immo" },
          { href: "/glossary/cssf-luxembourg", label: "CSSF Luxembourg" },
        ],
      },
      {
        heading: "Coûts et calendrier indicatifs",
        paragraphs: [
          "Une tokenisation immobilière sérieuse en Europe se budgete en quatre blocs : structuration juridique (SPV, pactes, qualification), conformité réglementaire (prospectus ou exemption, dossier CASP si applicable), implémentation technique (smart contracts, custody, registre) et commercialisation (KYC, plateforme, marketing encadré). Les ordres de grandeur varient du simple au triple selon juridiction et profil investisseur.",
          "La phase juridique inclut due diligence titre foncier, audits environnementaux si commercial, et rédaction des documents d'offre. Pour un immeuble unique en placement privé auprès d'investisseurs qualifiés, certains émetteurs démarrent avec un budget structuration inférieur à une offre publique retail — sans pour autant échapper aux obligations KYC/AML.",
          "La couche technique couvre audit smart contract, déploiement permissionné, intégration identité on-chain et tests de transfert restreint. Les coûts récurrents comprennent tenue registre, reporting investisseurs, custody et éventuels frais de plateforme secondaire.",
          "Le calendrier réaliste s'étale souvent sur 4 à 12 mois entre décision stratégique et première souscription, selon complexité réglementaire et disponibilité des pièces data room. Le wizard AUROS estime une préparation dossier actif en ~15 minutes ; la structuration juridique complète n'est pas compressible à cette échelle.",
          "Utilisez l'estimateur de coût et le sélecteur de juridiction pour cadrer un premier budget indicatif — puis validez avec vos conseils. Les chiffres AUROS ne sont pas des devis fermes.",
        ],
        links: [
          { href: "/tools/cost-estimator", label: "Estimateur de coût" },
          { href: "/tools/jurisdiction-picker", label: "Sélecteur juridiction" },
          { href: "/jurisdictions/starter-kit", label: "Starter Kit juridiction" },
        ],
      },
      {
        heading: "Rendements, marché et données comparables",
        paragraphs: [
          "Les rendements affichés sur le marché du RWA immobilier tokenisé — souvent exprimés en APY ou rendement locatif net — doivent être lus avec les hypothèses complètes : taux d'occupation, frais de gestion, fiscalité locale, change si actif transfrontalier, et risque de liquidité secondaire. Un rendement élevé n'est pas un signal de qualité sans transparence sur l'actif sous-jacent.",
          "Le comparateur AUROS agrège des produits immobiliers tokenisés publics avec TVL indicatif, ticket minimum, blockchain et statut réglementaire déclaré. Les données sont éducatives et peuvent laguer la réalité on-chain — croisez toujours avec les documents d'émission officiels.",
          "La liquidité reste le point sensible : marchés secondaires permissionnés existent mais le volume est inégal selon les émetteurs. Les lock-up contractuels et restrictions ERC-3643 limitent les sorties précipitées — ce qui protège le pool d'investisseurs mais réduit la promesse de « liquidité crypto » au sens retail.",
          "Les family offices comparent souvent tokenisation et véhicules traditionnels (SCPI, OPCI, club deals) sur trois axes : transparence documentaire, délai de mise en marché et coût total de structuration. Le jeton gagne sur la traçabilité programmée ; les fonds classiques gardent parfois l'avantage distributeur en retail régulé.",
          "Le calculateur de rendement AUROS permet de simuler un scénario indicatif (montant, horizon, hypothèse de rendement) sans se substituer à un business plan locatif.",
        ],
        links: [
          { href: "/real-estate", label: "Comparateur immobilier RWA" },
          { href: "/compare", label: "Hub comparateur" },
          { href: "/tools/yield-calculator", label: "Calculateur rendement" },
        ],
      },
      {
        heading: "Parcours émetteur : de l'idée à la souscription",
        paragraphs: [
          "Nous recommandons quatre moments — pas quinze micro-étapes visibles — pour garder une charge cognitive maîtrisée : (1) cadrage actif et objectifs financement, (2) stratégie juridiction et structure, (3) conformité documentaire, (4) récapitulatif et décision go/no-go.",
          "Étape 1 — Actif : localisation, état locatif, dette existante, horizon de détention. Le wizard AUROS capture ces éléments et produit un score d'admission indicatif plus une checklist data room priorisée (3 pièces urgentes visibles, 15 au total repliées).",
          "Étape 2 — Stratégie : choix SPV vs fonds, profil investisseurs cibles, blockchain permissionnée. Le sélecteur juridiction affine une shortlist ; le Starter Kit peut produire un memo arbitrage si le sujet est bloquant.",
          "Étape 3 — Conformité : qualification jeton, whitepaper MiCA, prospectus ou exemption, KYC/AML, audit smart contract. Le test MiCA oriente les lacunes avant de mobiliser le counsel.",
          "Étape 4 — Récap : calendrier, budget indicatif, prochaines signatures. La soumission dossier à l'équipe AUROS déclenche une revue humaine — pas d'émission automatique. Vous conservez la main sur le rythme ; un dossier incomplet n'est pas une faute, c'est un état normal en phase exploratoire.",
        ],
        links: [
          { href: "/wizard", label: "Lancer le wizard" },
          { href: "/tools/mica-checker", label: "Test MiCA" },
          { href: "/estimate", label: "Score de préparation" },
        ],
      },
    ],
    faq: [
      {
        question: "La tokenisation immobilière est-elle légale en Europe ?",
        answer:
          "Oui dans un cadre structuré — qualification du jeton, respect MiCA le cas échéant, droit des valeurs mobilières national, KYC/AML. L'illégalité vient des offres non documentées ou des promesses de rendement non conformes. Counsel requis avant toute commercialisation.",
      },
      {
        question: "MiCA s'applique-t-il à un immeuble tokenisé ?",
        answer:
          "Potentiellement, si le jeton est un crypto-actif au sens du règlement. Souvent MiCA coexiste avec le droit financier local. Le test MiCA AUROS donne une orientation indicative ; seul un avis juridique confirme le périmètre.",
      },
      {
        question: "Faut-il obligatoirement une SPV ?",
        answer:
          "Pas dans tous les modèles, mais la SPV reste la norme pour isoler l'actif et lier jeton et droits économiques. Alternatives : fonds régulé, trust (common law). Le choix dépend de la juridiction et des investisseurs cibles.",
      },
      {
        question: "Quelle blockchain pour un RWA immobilier européen ?",
        answer:
          "Souvent une chaîne compatible EVM permissionnée ou publique avec contrôles de transfert (ERC-3643). Les critères institutionnels incluent custody, audits et identité on-chain — pas seulement les frais de gas.",
      },
      {
        question: "Quel ticket minimum pour les investisseurs ?",
        answer:
          "Variable : de quelques milliers d'euros en placement privé qualifié à des tickets plus élevés selon structure et plateforme. La fractionnalisation abaisse le seuil mais ne supprime pas les critères d'éligibilité.",
      },
      {
        question: "Combien de temps pour tokeniser un immeuble ?",
        answer:
          "Indicativement 4 à 12 mois de la décision à la première souscription, selon juridiction, audits et complétude data room. La préparation exploratoire via wizard peut se faire en une session courte.",
      },
      {
        question: "Le comparateur AUROS recommande-t-il des investissements ?",
        answer:
          "Non — données éducatives et sources publiques. Aucune recommandation d'achat. Les émetteurs utilisent le comparateur pour se positionner ; les investisseurs doivent lire les documents officiels d'émission.",
      },
      {
        question: "Quelle différence entre wizard gratuit et Starter Kit juridiction ?",
        answer:
          "Le wizard (/wizard) produit un dossier actif avec score et data room. Le Starter Kit (/jurisdictions/starter-kit, 5 000 € HT) livre un memo juridiction personnalisé — arbitrage SPV, régulateur, calendrier. Les deux sont complémentaires.",
      },
    ],
  },
  {
    slug: "tokenisation-rwa-luxembourg",
    title: "Tokenisation RWA au Luxembourg : guide CSSF, RAIF et MiCA",
    description:
      "Guide complet tokenisation RWA Luxembourg : CSSF, RAIF/SCS, SPV immobilier, passeport MiCA, coûts indicatifs et parcours émetteur. Contenu éducatif — counsel requis avant émission.",
    excerpt:
      "Pourquoi le Grand-Duché reste un hub institutionnel pour les RWA en 2026 : CSSF, véhicules RAIF et SCS, SPV immobilier, passeport MiCA et arbitrage avec le reste de l'UE — sans promesse de rendement ni conseil juridique.",
    publishedAt: "2026-06-11",
    modifiedAt: "2026-06-11",
    readingTimeMinutes: 17,
    keywords: [
      "tokenisation RWA Luxembourg",
      "Luxembourg RWA hub",
      "CSSF tokenisation",
      "RAIF Luxembourg",
      "SCS tokenisation",
      "SPV immobilier Luxembourg",
      "MiCA passeport Luxembourg",
      "real world assets Luxembourg",
    ],
    cta: { href: "/jurisdictions/luxembourg-real-estate", label: "Fiche juridiction Luxembourg" },
    ctaBlocks: [
      {
        afterSection: 1,
        title: "Contexte européen immobilier",
        links: [
          { href: "/blog/real-estate-tokenization-europe", label: "Guide immobilier Europe" },
          { href: "/real-estate", label: "Comparateur immobilier" },
          { href: "/compare", label: "Hub comparateur RWA" },
        ],
      },
      {
        afterSection: 3,
        title: "Qualification MiCA et structures",
        links: [
          { href: "/tools/mica-checker", label: "Test MiCA indicatif" },
          { href: "/glossary/mica", label: "Définition MiCA" },
          { href: "/glossary/spv", label: "Définition SPV" },
        ],
      },
      {
        afterSection: 5,
        title: "Budget et shortlist juridiction",
        links: [
          { href: "/tools/cost-estimator", label: "Estimateur de coût" },
          { href: "/tools/jurisdiction-picker", label: "Sélecteur juridiction" },
          { href: "/jurisdictions", label: "Comparateur 8 juridictions" },
        ],
      },
    ],
    sections: [
      {
        heading: "Pourquoi le Luxembourg comme hub RWA en 2026 ?",
        paragraphs: [
          "Le Luxembourg n'est pas une juridiction « crypto-friendly » au sens retail : c'est un centre financier institutionnel où se croisent fonds d'investissement, banques dépositaires, administrateurs de titres et, depuis MiCA, prestataires agréés sur crypto-actifs. Pour un émetteur RWA — immobilier, crédit privé, obligations tokenisées — le Grand-Duché offre une chaîne de prestataires habitués aux véhicules SPV, aux registres d'actionnaires transfrontaliers et aux audits récurrents exigés par les family offices.",
          "La densité de l'écosystème réduit le temps de traduction entre counsel, dépositaire et implémenteur technique. Un promoteur français ou allemand peut conserver l'actif dans son pays tout en structurant la détention économique via une SPV luxembourgeoise — modèle fréquent en immobilier institutionnel. Le choix n'est pas automatique : fiscalité, profil investisseur et calendrier peuvent orienter vers la France, l'Irlande ou un hub hors UE. Mais lorsque la crédibilité « fonds EU » prime, Luxembourg figure systématiquement dans la shortlist.",
          "En 2026, MiCA harmonise une partie du cadre européen pour les crypto-actifs tandis que le droit des valeurs mobilières national continue de qualifier les jetons adossés à des actifs réels. Le Luxembourg applique ces deux couches via la CSSF (Commission de Surveillance du Secteur Financier). Les émetteurs sérieux anticipent cette double lecture dès la phase exploratoire — pas après commercialisation.",
          "Le Grand-Duché abrite aussi une concentration de prestataires de services aux fonds : dépositaires, centralisateur de parts, auditeurs Big Four et cabinets spécialisés en droit financier européen. Cette profondeur de marché réduit les frictions lorsque l'émetteur doit synchroniser counsel luxembourgeois, gestionnaire d'actifs et intégrateur blockchain — un avantage difficile à répliquer dans des juridictions plus récentes sur la tokenisation.",
          "Ce guide complète le panorama européen publié sur AUROS : il approfondit le Grand-Duché sans remplacer un memo juridiction personnalisé. Contenu éducatif indicatif : validation par counsel qualifié requise avant toute émission, prospectus ou placement privé.",
        ],
        links: [
          { href: "/blog/real-estate-tokenization-europe", label: "Tokenisation immo Europe" },
          { href: "/jurisdictions/luxembourg-real-estate", label: "Luxembourg immobilier" },
          { href: "/how-it-works", label: "Comment fonctionne AUROS" },
        ],
      },
      {
        heading: "CSSF : rôle, CASP et dialogue régulateur",
        paragraphs: [
          "La CSSF supervise banques, fonds d'investissement, PSF (prestataires de services financiers) et, sous MiCA, les CASP (Crypto-Asset Service Providers). Pour un projet RWA, l'interaction CSSF dépend du périmètre : émission pure de jetons, custody institutionnelle, plateforme de négociation permissionnée ou gestion d'un véhicule collectif. Chaque brique peut déclencher des obligations d'agrément ou de notification distinctes.",
          "Contrairement à une approche « sandbox » permissive, la CSSF attend des dossiers structurés : gouvernance, plan AML/KYC, description technique des contrôles de transfert, chaîne de custody on-chain et off-chain. Les délais varient selon complexité — plusieurs mois pour un CASP complet ne sont pas exceptionnels. La préparation documentaire amont (data room, whitepaper MiCA, description SPV) conditionne la fluidité du dialogue.",
          "Les émetteurs immobiliers institutionnels comparent souvent CSSF et AMF (France) ou BaFin (Allemagne) sur trois critères : prévisibilité des retours écrits, acceptation des modèles SPV + token permissionné, et compatibilité avec des investisseurs professionnels UE. Aucun régulateur ne garantit un aval sur la base d'un smart contract seul — la qualification juridique du jeton reste centrale.",
          "La CSSF publie régulièrement des communications sur les crypto-actifs et attend une gouvernance claire au niveau du conseil d'administration : responsable conformité identifié, politique de conflits d'intérêts, procédures de signalement. Pour un family office émetteur, cette exigence de substance renforce la crédibilité auprès des co-investisseurs — même si elle alourdit la gouvernance initiale.",
          "AUROS ne substitue pas un interlocuteur régulateur. Le test MiCA et le wizard dossier actif aident à repérer les lacunes documentaires avant mobilisation du counsel luxembourgeois. Le Starter Kit juridiction (5 000 € HT) peut produire un memo arbitrage Luxembourg vs alternatives lorsque la décision est bloquante.",
        ],
        links: [
          { href: "/glossary/cssf-luxembourg", label: "Glossaire CSSF" },
          { href: "/glossary/casp", label: "Prestataire CASP" },
          { href: "/tools/mica-checker", label: "Test MiCA" },
        ],
      },
      {
        heading: "RAIF, SCS et SPV immobilier luxembourgeois",
        paragraphs: [
          "Trois structures dominent les montages RWA luxembourgeois. La SPV (société ad hoc, souvent SARL ou SA) détient directement l'actif immobilier ou les titres sous-jacents et émet les droits économiques tokenisés. Elle convient à un immeuble unique, un portefeuille restreint ou une opération club deal où la gouvernance doit rester lisible.",
          "Le RAIF (Reserved Alternative Investment Fund) est un fonds alternatif réservé à des investisseurs avertis, sans agrément product-level de la CSSF mais sous supervision du AIFM (Alternative Investment Fund Manager). Il attire les portefeuilles multi-actifs (logistique, résidentiel étudiant, crédit) et les distributeurs habitués aux parts de fonds. Le jeton peut représenter une part de RAIF ou une créance sur celle-ci — alignement counsel indispensable entre statuts, prospectus et tokenomics.",
          "La SCS (Société en Commandite Simple) est prisée pour sa transparence fiscale en cascade et sa flexibilité entre commandités et commanditaires. En immobilier tokenisé, on la retrouve comme couche de détention intermédiaire ou véhicule de co-investissement. La complexité croît avec le nombre de couches — chaque niveau doit être documenté pour la due diligence investisseur.",
          "Quelle que soit l'enveloppe, l'ancrage off-chain prime : registre des associés, pacte d'actionnaires, waterfall de distribution (loyers nets, réserve travaux, dette senior), clauses de sortie et lock-up. ERC-3643 ou modules compliance équivalents traduisent ces règles on-chain via whitelist et restrictions de transfert. Incohérence entre contrat social et smart contract = risque réglementaire et contentieux.",
          "Le choix RAIF vs SPV dépend aussi du calendrier de commercialisation : un RAIF exige la mise en place d'un AIFM agréé et d'un dépositaire — étapes qui ajoutent des mois mais rassurent les plateformes de distribution institutionnelle. Une SPV directe convient mieux à un club deal fermé ou à une première opération test avant montée en charge vers un véhicule collectif.",
          "Pour un premier cadrage, croisez le glossaire SPV AUROS, la fiche juridiction Luxembourg et le guide immobilier Europe — puis validez la structure avec un cabinet local.",
        ],
        links: [
          { href: "/glossary/spv", label: "Définition SPV" },
          { href: "/glossary/erc-3643", label: "ERC-3643 (T-REX)" },
          { href: "/glossary/propriete-fractionnee", label: "Propriété fractionnée" },
        ],
      },
      {
        heading: "MiCA, passeport européen et distribution transfrontalière",
        paragraphs: [
          "MiCA (Règlement UE 2023/1114) crée un marché unique partiel pour les crypto-actifs : whitepaper, gouvernance émetteur, agrément CASP avec possibilité de passeport vers d'autres États membres. Un émetteur établi au Luxembourg peut, sous conditions, commercialiser des jetons qualifiés crypto-actifs dans l'UE via notification — distinct du passeport prospectus pour titres financiers.",
          "La double qualification reste la norme pour les RWA : un token représentant des flux locatifs ou des parts économiques peut relever simultanément de MiCA et du droit luxembourgeois des valeurs mobilières. Le whitepaper MiCA ne remplace pas un prospectus ou une exemption de placement privé lorsque le jeton est requalifié security token. Coordination counsel obligatoire entre les deux filières documentaires.",
          "Le passeport européen MiCA profite surtout aux CASP (custody, exchange institutionnel) et aux émetteurs de crypto-actifs purs. Pour l'immobilier tokenisé distribué à des professionnels dans plusieurs pays UE, le scénario réaliste combine : véhicule luxembourgeois, documentation harmonisée, KYC/AML par investisseur et restrictions de transfert programmées. La « reverse solicitation » n'est pas un contournement général — chaque cas exige traçabilité.",
          "Les périodes transitoires MiCA pour acteurs historiques ne dispensent pas les nouveaux émetteurs RWA d'une structuration conforme dès le départ. Anticiper la data room (15 pièces indicatives AUROS) accélère le dialogue CSSF et rassure les investisseurs institutionnels.",
          "En pratique, un émetteur luxembourgeois visant des investisseurs allemands ou français doit vérifier les règles de commercialisation transfrontalière dans chaque pays de résidence — le passeport MiCA ou prospectus ne supprime pas les contraintes de marketing local ni les seuils d'investisseurs qualifiés. Documenter la stratégie de distribution pays par pays fait partie du memo counsel, pas de la seule couche technique.",
        ],
        links: [
          { href: "/glossary/mica", label: "Glossaire MiCA" },
          { href: "/glossary/passporting-europeen", label: "Passeport européen" },
          { href: "/glossary/whitepaper-mica", label: "Whitepaper MiCA" },
        ],
      },
      {
        heading: "Coûts, délais et écosystème prestataires",
        paragraphs: [
          "Structurer un RWA au Luxembourg se décompose en blocs indicatifs : constitution véhicule (SPV, SCS ou RAIF), due diligence actif (titre foncier, environnement, locatif), dossier réglementaire (qualification jeton, whitepaper MiCA, prospectus ou exemption), implémentation technique (smart contracts audités, custody, registre) et commercialisation (KYC, plateforme, reporting). Les ordres de grandeur doublent ou triplent si agrément CASP complet ou fonds multi-actifs.",
          "La phase juridique luxembourgeoise bénéficie d'un marché compétitif de counsel, administrateurs et dépositaires — mais les honoraires restent indexés sur l'institutionnel. Un placement privé auprès d'investisseurs qualifiés coûte moins qu'une offre retail passportée ; il exige néanmoins AML/KYC rigoureux et traçabilité des transferts.",
          "Les délais réalistes s'étalent souvent sur 6 à 12 mois entre décision stratégique et première souscription pour un modèle régulé complet, hors disponibilité des pièces data room. La constitution SPV simple peut être plus rapide ; l'entrée en relation CSSF pour CASP ou montage RAIF allonge le calendrier.",
          "Utilisez l'estimateur de coût AUROS et le sélecteur juridiction pour comparer Luxembourg avec DIFC, France ou Singapour selon vos curseurs délai/coût/fiscalité. Les chiffres affichés sont éducatifs — pas des devis fermes. Le comparateur juridictions détaille huit hubs avec paramètres indicatifs.",
          "Les coûts récurrents post-émission — tenue registre, reporting investisseurs, audits annuels, frais dépositaire — représentent souvent 15 à 25 % du budget total sur cinq ans. Les sous-estimer affaiblit la crédibilité du business plan auprès des co-investisseurs. Intégrez-les dès la phase exploratoire dans l'estimateur et validez avec votre counsel.",
        ],
        links: [
          { href: "/tools/cost-estimator", label: "Estimateur de coût" },
          { href: "/tools/jurisdiction-picker", label: "Sélecteur juridiction" },
          { href: "/jurisdictions/starter-kit", label: "Starter Kit juridiction" },
        ],
      },
      {
        heading: "Immobilier tokenisé : modèles et retours d'expérience",
        paragraphs: [
          "L'immobilier reste le cas d'usage RWA le plus visible au Luxembourg : immeubles de bureaux en zone EU, résidences gérées, foncières logistiques. Le modèle dominant : SPV luxembourgeoise propriétaire du bien, émission de parts tokenisées (ERC-3643 fréquent) à des investisseurs professionnels, distribution des loyers nets selon un waterfall contractuel. La fractionnalisation abaisse le ticket sans ouvrir pour autant le retail non averti.",
          "Les family offices comparent ce montage aux SCPI, OPCI ou club deals classiques. Le jeton apporte traçabilité des transferts, registre aligné KYC et possibilité de marché secondaire permissionné — la liquidité réelle reste variable et ne doit pas être sur-promue. Lock-up et clauses de préemption protègent le pool mais limitent la « liquidité crypto » au sens retail.",
          "Le comparateur immobilier AUROS agrège des produits tokenisés publics avec TVL indicatif, blockchain et statut réglementaire déclaré. Croisez toujours avec les documents d'émission officiels. Le calculateur de rendement permet des simulations indicatives — pas un substitut au business plan locatif.",
          "Si votre actif est en France ou en Allemagne, le Luxembourg peut héberger le véhicule de détention économique tandis que l'exploitation reste locale — montage fréquent mais fiscalité et substance exigent analyse transfrontalière. Le guide Europe AUROS couvre ces arbitrages dans une vision pan-européenne.",
          "Les obligations tokenisées et le crédit privé suivent des logiques proches : SPV ou fonds luxembourgeois détenant le portefeuille, jetons représentant des créances ou parts, même exigence d'alignement registre off-chain et restrictions on-chain. Le hub comparateur AUROS (/compare) recense aussi ces segments au-delà de l'immobilier pur.",
        ],
        links: [
          { href: "/real-estate", label: "Comparateur immobilier RWA" },
          { href: "/compare", label: "Hub comparateur" },
          { href: "/tools/yield-calculator", label: "Calculateur rendement" },
        ],
      },
      {
        heading: "Parcours émetteur Luxembourg en quatre moments",
        paragraphs: [
          "Pour limiter la charge cognitive — principe UX AUROS — nous découpons le parcours en quatre moments, pas quinze micro-étapes visibles : (1) cadrage actif et objectifs, (2) stratégie véhicule et juridiction, (3) conformité documentaire CSSF/MiCA, (4) récapitulatif go/no-go.",
          "Moment 1 — Actif : localisation du bien, état locatif, dette, horizon de détention. Le wizard AUROS (/wizard) produit un score d'admission indicatif et une data room priorisée (3 pièces urgentes visibles, 15 au total repliées). Un dossier incomplet est normal en exploration — pas une faute.",
          "Moment 2 — Stratégie : SPV vs RAIF vs SCS, profil investisseurs, blockchain permissionnée. Le sélecteur juridiction affine une shortlist ; la fiche Luxembourg immobilier condense régulateur, délais et coûts indicatifs. Le Starter Kit livre un memo personnalisé si l'arbitrage bloque.",
          "Moment 3 — Conformité : qualification jeton, whitepaper MiCA, prospectus ou exemption, KYC/AML, audit smart contract. Le test MiCA oriente les lacunes. La CSSF ou le counsel valident le périmètre — AUROS ne certifie pas la conformité.",
          "Moment 4 — Récap : budget indicatif, calendrier, prochaines signatures. La soumission dossier déclenche une revue humaine AUROS — pas d'émission automatique. Vous gardez la main sur le rythme ; ~15 minutes suffisent pour une première passe wizard, la structuration complète reste affaire de mois.",
        ],
        links: [
          { href: "/wizard", label: "Lancer le wizard" },
          { href: "/jurisdictions/luxembourg-real-estate", label: "Fiche Luxembourg" },
          { href: "/estimate", label: "Score de préparation" },
        ],
      },
    ],
    faq: [
      {
        question: "Pourquoi choisir le Luxembourg pour tokeniser un RWA ?",
        answer:
          "Écosystème institutionnel mature (CSSF, dépositaires, AIFM), véhicules RAIF/SCS/SPV reconnus des investisseurs EU, et expérience croissante MiCA/CASP. Pas de solution universelle — comparez avec France, Irlande ou DIFC selon actif et investisseurs. Counsel requis.",
      },
      {
        question: "Quelle différence entre RAIF, SCS et SPV au Luxembourg ?",
        answer:
          "SPV : société ad hoc pour un actif ou portefeuille ciblé. RAIF : fonds alternatif réservé, adapté multi-actifs via AIFM. SCS : souvent couche fiscale/gouvernance flexible. Le jeton doit refléter exactement les droits statutaires — alignment counsel indispensable.",
      },
      {
        question: "La CSSF agrée-t-elle tous les jetons RWA ?",
        answer:
          "Non automatiquement. Selon le modèle, agrément CASP, supervision AIFM ou simple émission sous exemptions peut s'appliquer. La qualification du jeton (MiCA vs titre financier) détermine le périmètre. Dossier structuré et counsel local requis.",
      },
      {
        question: "MiCA permet-il de distribuer un RWA luxembourgeois dans toute l'UE ?",
        answer:
          "Partiellement : le passeport MiCA couvre les crypto-actifs et CASP agréés selon conditions. Les security tokens relèvent aussi du droit des valeurs mobilières et prospectus. Pas de passeport automatique sans analyse — coordination whitepaper MiCA et prospectus fréquente.",
      },
      {
        question: "Combien coûte une tokenisation immobilière au Luxembourg ?",
        answer:
          "Variable selon véhicule, agrément et profil investisseur — de dizaines de milliers à plusieurs centaines de milliers d'euros pour un modèle institutionnel complet. L'estimateur AUROS donne un ordre de grandeur indicatif ; devis counsel pour chiffrage ferme.",
      },
      {
        question: "Quel délai pour un montage Luxembourg CSSF + SPV immo ?",
        answer:
          "Indicativement 6 à 12 mois pour un modèle régulé complet, plus rapide pour SPV placement privé sans CASP. Dépend des audits, complétude data room et dialogue régulateur. Le wizard permet une préparation exploratoire en une session courte.",
      },
      {
        question: "Le Luxembourg convient-il aux petits promoteurs immobiliers ?",
        answer:
          "Souvent orienté institutionnel : coûts et exigences documentaires peuvent écraser un petit actif unique. Comparez France ou Gibraltar pour ticket réduit. Le sélecteur juridiction AUROS pondère délai, coût et fiscalité — pas une recommandation juridique.",
      },
      {
        question: "Comment AUROS aide-t-il sur un projet Luxembourg ?",
        answer:
          "Wizard dossier actif gratuit, comparateur juridictions, test MiCA, estimateur coût, comparateur immobilier et Starter Kit memo (5 000 € HT). Analyses indicatives — revue humaine et counsel externe restent le garde-fou avant émission.",
      },
    ],
  },
  {
    slug: "mica-guide-emetteurs-rwa",
    title: "MiCA pour émetteurs RWA : guide pratique 2026",
    description:
      "Guide MiCA pour émetteurs RWA en Europe : périmètre crypto-actif vs titre financier, whitepaper, CASP, périodes transitoires et checklist documentaire. Contenu éducatif — counsel requis.",
    excerpt:
      "Comment lire MiCA quand vous tokenisez un actif réel en 2026 : double qualification, whitepaper, CASP, passeport partiel et pièges fréquents — sans promesse réglementaire ni conseil juridique.",
    publishedAt: "2026-06-12",
    modifiedAt: "2026-06-12",
    readingTimeMinutes: 16,
    keywords: [
      "MiCA RWA",
      "MiCA émetteur",
      "whitepaper MiCA",
      "CASP tokenisation",
      "crypto-actif Europe",
      "régulation tokenisation",
      "MiCA security token",
      "passeport MiCA",
    ],
    cta: { href: "/tools/mica-checker", label: "Tester mon exposition MiCA" },
    ctaBlocks: [
      {
        afterSection: 1,
        title: "Définitions et outils",
        links: [
          { href: "/glossary/mica", label: "Glossaire MiCA" },
          { href: "/glossary/whitepaper-mica", label: "Whitepaper MiCA" },
          { href: "/glossary/casp", label: "Prestataire CASP" },
        ],
      },
      {
        afterSection: 3,
        title: "Structuration et juridictions",
        links: [
          { href: "/wizard", label: "Wizard dossier actif" },
          { href: "/tools/jurisdiction-picker", label: "Sélecteur juridiction" },
          { href: "/jurisdictions", label: "Comparateur 8 hubs" },
        ],
      },
      {
        afterSection: 5,
        title: "Marché et conformité continue",
        links: [
          { href: "/compare", label: "Hub comparateur RWA" },
          { href: "/trust", label: "Confiance & conformité" },
          { href: "/developers", label: "API AUROS Protocol" },
        ],
      },
    ],
    sections: [
      {
        heading: "MiCA en une phrase — et pourquoi les RWA sont un cas limite",
        paragraphs: [
          "Le règlement MiCA (Markets in Crypto-Assets, UE 2023/1114) harmonise l'émission et le service sur certains crypto-actifs dans l'Union européenne : whitepaper, gouvernance émetteur, agrément des prestataires (CASP). Pour un émetteur RWA — immobilier, crédit privé, obligations adossées à des actifs réels — MiCA n'est qu'une couche : le droit des valeurs mobilières national peut primer dès que le jeton représente des droits économiques assimilables à des titres.",
          "Le cas limite typique : un token ERC-3643 distribuant des loyers nets à des investisseurs professionnels. Est-ce un crypto-actif « autre » sous MiCA ? Un security token soumis à prospectus ou exemption ? Les deux ? La réponse dépend du contenu économique du jeton, pas du label marketing « RWA » ou « utility ».",
          "Les émetteurs sérieux traitent MiCA comme un filtre obligatoire — pas comme une case à cocher finale. Un whitepaper MiCA mal aligné avec le pacte d'associés ou le prospectus financier crée plus de risque qu'aucun whitepaper : incohérence documentaire = signal rouge pour régulateur et investisseurs.",
          "Ce guide est éducatif et indicatif. Il ne constitue pas un avis juridique. Avant toute émission, un counsel spécialisé MiCA et droit financier local est indispensable.",
        ],
        links: [
          { href: "/blog/real-estate-tokenization-europe", label: "Tokenisation immo Europe" },
          { href: "/how-it-works", label: "Comment fonctionne AUROS" },
        ],
      },
      {
        heading: "Arbre de qualification : crypto-actif, titre financier, les deux",
        paragraphs: [
          "Étape 1 — Exclure les catégories MiCA sans ambiguïté : les jetons qui sont déjà des instruments financiers au sens de MiFID II (actions, obligations classiques tokenisées sans couche crypto spécifique) relèvent du droit des marchés financiers, pas du livre crypto-actifs MiCA. Étape 2 — Identifier les e-money tokens et ART (asset-referenced tokens) : rares en RWA pur mais à exclure explicitement dans la note counsel.",
          "Étape 3 — Crypto-actif « autre » (other crypto-asset) : jetons sans droits sur l'émetteur type equity, sans référence à un panier d'actifs. Beaucoup de RWA tentent cette qualification — le régulateur regarde les flux économiques réels. Étape 4 — Requalification security : si dividendes, plus-value ou gouvernance économique dominent, le prospectus ou placement privé entre en jeu.",
          "La double qualification n'est pas une erreur de structuration si elle est assumée et documentée : whitepaper MiCA + note d'information ou prospectus coordonnés, CASP pour custody/exchange si applicable, exemptions de placement privé tracées pays par pays.",
          "Le test MiCA AUROS (/tools/mica-checker) oriente les lacunes documentaires avant mobilisation du counsel. Il ne certifie pas la conformité — il priorise la préparation.",
        ],
        links: [
          { href: "/tools/mica-checker", label: "Test MiCA indicatif" },
          { href: "/glossary/security-token", label: "Security token" },
          { href: "/glossary/emt-e-money-token", label: "E-money token" },
        ],
      },
      {
        heading: "Whitepaper MiCA : contenu, responsabilité et coordination",
        paragraphs: [
          "Le whitepaper MiCA pour un crypto-actif « autre » doit décrire : l'émetteur, le projet, les risques (y compris technologiques et réglementaires), les droits attachés au jeton, la technologie blockchain, et les informations sur l'offre. La responsabilité de l'émetteur est engagée — les allégations doivent être vérifiables et cohérentes avec les contrats off-chain.",
          "Pour un RWA, les sections critiques sont la description de l'actif sous-jacent (titre foncier, créances, garanties), la chaîne de détention SPV/fonds, le mécanisme de distribution des flux, les restrictions de transfert et le traitement des défauts (vacance, défaut emprunteur). Omettre la vacance locative sur un immeuble tokenisé est une faille classique.",
          "Coordination counsel : le whitepaper MiCA ne doit pas contredire le pacte d'associés, le prospectus ou la note d'information. Un glossaire interne alignant les termes « token », « part », « droit économique » évite les écarts entre équipes juridique et technique.",
          "Les émetteurs institutionnels archivent version datée, hash du document on-chain si pertinent, et journal des modifications — pratique attendue en due diligence investisseur même si MiCA n'exige pas formellement un registre blockchain du whitepaper.",
        ],
        links: [
          { href: "/glossary/whitepaper-mica", label: "Définition whitepaper MiCA" },
          { href: "/glossary/spv", label: "Définition SPV" },
          { href: "/wizard", label: "Wizard data room" },
        ],
      },
      {
        heading: "CASP : quand l'agrément entre en jeu",
        paragraphs: [
          "Un CASP (Crypto-Asset Service Provider) agréé MiCA peut custody, exchange, transfer, conseil — selon l'annexe du règlement. Un émetteur RWA pur qui ne détient pas les fonds des investisseurs et ne tient pas de plateforme de négociation peut ne pas être CASP — mais dès qu'il custody des clés investisseurs ou opère un marché secondaire, le périmètre change.",
          "Les modèles fréquents : émetteur non-CASP + custody institutionnelle chez un CASP tiers ; plateforme de distribution partenaire CASP ; smart contract avec restrictions ERC-3643 gérées par un agent de transfert. Chaque maillon doit être identifié dans le dossier régulateur.",
          "Le passeport MiCA permet à un CASP agréé dans un État membre de notifier ses services dans d'autres États — utile pour une distribution transfrontalière de services crypto, distincte du passeport prospectus pour titres financiers.",
          "Anticiper le CASP en phase exploratoire évite de reconcevoir l'architecture après audit smart contract. Le sélecteur juridiction AUROS pondère la maturité CASP par hub — indicatif seulement.",
        ],
        links: [
          { href: "/glossary/casp", label: "Glossaire CASP" },
          { href: "/glossary/passporting-europeen", label: "Passeport européen" },
          { href: "/jurisdictions/luxembourg-real-estate", label: "Luxembourg RWA" },
        ],
      },
      {
        heading: "Périodes transitoires et calendrier 2026",
        paragraphs: [
          "MiCA s'applique par vagues : stablecoins (ART/EMT) en premier, crypto-actifs autres et CASP selon calendrier publié par la Commission et les NCAs nationales. Les acteurs historiques PSAN (France) ou équivalents bénéficient de périodes transitoires — pas un blanc-seing permanent sur des modèles non conformes.",
          "Les nouveaux émetteurs RWA en 2026 doivent structurer dès le départ comme si MiCA et droit financier s'appliquaient pleinement : data room complète, whitepaper, qualification jeton, KYC/AML. Attendre la fin d'une transition est un pari réglementaire, pas une stratégie.",
          "Calendrier indicatif émetteur : mois 1–2 cadrage et qualification counsel ; mois 2–4 documentation (whitepaper, contrats, audits) ; mois 4–8 implémentation technique et dialogue régulateur si CASP ; mois 6–12 commercialisation encadrée. Le wizard AUROS compresse la phase exploratoire, pas le dialogue CSSF/AMF.",
          "Surveillez les Q&A ESMA et communications nationales — la doctrine évolue sur les RWA hybrides. Abonnez-vous aux mises à jour de votre counsel, pas aux résumés Twitter.",
        ],
        links: [
          { href: "/tools/cost-estimator", label: "Estimateur de coût" },
          { href: "/blog/tokenisation-rwa-luxembourg", label: "Guide Luxembourg" },
          { href: "/estimate", label: "Score de préparation" },
        ],
      },
      {
        heading: "Checklist documentaire émetteur (15 pièces indicatives)",
        paragraphs: [
          "AUROS recommande une data room minimale avant tout dialogue institutionnel : (1) description actif et due diligence titre, (2) structure juridique et organigramme SPV/fonds, (3) qualification jeton et note counsel, (4) whitepaper MiCA ou équivalent, (5) prospectus/exemption si security, (6) pacte d'associés / statuts, (7) politique AML/KYC, (8) audit smart contract, (9) architecture custody, (10) registre actionnaires off-chain, (11) description restrictions transfert on-chain, (12) waterfall de distribution, (13) scénarios de stress (vacance, défaut), (14) assurances et garanties, (15) plan de communication investisseurs.",
          "Le wizard gratuit priorise 3 pièces urgentes visibles — les 12 autres restent accessibles sans submerger l'écran. Un dossier incomplet en exploration est normal ; un dossier incomplet à la commercialisation ne l'est pas.",
          "L'API AUROS Protocol (/developers) permet d'intégrer score MiCA indicatif et checklist dans vos outils internes — quota gratuit 100 req/mois, SDK npm `@adrien1212balitrand/auros-protocol`.",
          "La revue humaine AUROS sur soumission dossier ne remplace pas le counsel — elle accélère la priorisation avant facturation conseil externe.",
        ],
        links: [
          { href: "/developers", label: "Portail développeurs" },
          { href: "/developers/docs/quickstart", label: "Quickstart API" },
          { href: "/trust", label: "Confiance AUROS" },
        ],
      },
      {
        heading: "Erreurs fréquentes et comment les éviter",
        paragraphs: [
          "Erreur 1 — Appeler « utility token » un jeton avec droits de cash-flow : requalification et sanctions. Erreur 2 — Whitepaper générique copié-collé sans actif sous-jacent décrit. Erreur 3 — Oublier le pays de résidence de chaque investisseur cible (reverse solicitation mal documentée). Erreur 4 — Smart contract non aligné avec pacte (transfert libre alors que préemption contractuelle). Erreur 5 — Sous-estimer les coûts récurrents CASP/custody/reporting.",
          "Erreur 6 — Promettre une liquidité secondaire « crypto » sans marché réel ni market maker. Erreur 7 — Ignorer MiCA parce que « on est en placement privé » — le placement privé est une exemption procédurale, pas une exemption substantielle sur AML et qualification.",
          "Les outils Pilier 1 AUROS (test MiCA, estimateur, sélecteur juridiction) existent pour réduire ces angles morts en phase amont — pas pour signer à votre place.",
          "En cas de doute, arrêtez la commercialisation, pas la documentation. Un retard de marché coûte moins qu'une offre non conforme.",
        ],
        links: [
          { href: "/tools/mica-checker", label: "Test MiCA" },
          { href: "/compare", label: "Comparateur marché RWA" },
          { href: "/wizard/pro", label: "Wizard Pro" },
        ],
      },
    ],
    faq: [
      {
        question: "MiCA s'applique-t-il à tous les jetons RWA ?",
        answer:
          "Non automatiquement. Selon qualification, un RWA peut relever de MiCA, du droit des valeurs mobilières, des deux, ou d'exemptions spécifiques. Analyse counsel obligatoire.",
      },
      {
        question: "Faut-il un whitepaper MiCA pour un placement privé ?",
        answer:
          "Potentiellement oui si le jeton est un crypto-actif « autre » sous MiCA — le placement privé n'exempte pas toujours des obligations d'information MiCA. Coordination avec exemption prospectus si security token.",
      },
      {
        question: "Un émetteur immobilier est-il forcément CASP ?",
        answer:
          "Non si émission pure sans custody ni plateforme de négociation. Dès custody client ou exchange, agrément ou partenariat CASP requis.",
      },
      {
        question: "Quelle différence entre passeport MiCA et passeport prospectus ?",
        answer:
          "MiCA passeport concerne crypto-actifs et services CASP. Prospectus concerne titres financiers. Un RWA hybride peut nécessiter les deux analyses.",
      },
      {
        question: "Le test MiCA AUROS suffit-il avant émission ?",
        answer:
          "Non — outil indicatif de préparation. Seul un avis juridique qualifié valide le périmètre réglementaire.",
      },
      {
        question: "Les PSAN français sont-ils automatiquement conformes MiCA ?",
        answer:
          "Non — périodes transitoires limitées. Vérifiez le calendrier AMF et le mapping vers statut CASP.",
      },
      {
        question: "Comment intégrer le scoring MiCA dans notre stack ?",
        answer:
          "API AUROS Protocol POST /api/v1/score ou SDK npm. 100 req/mois gratuites. Docs sur /developers.",
      },
      {
        question: "Où trouver des exemples de RWA conformes en Europe ?",
        answer:
          "Le comparateur /compare agrège des produits publics avec statut déclaré — croisez toujours avec documents officiels d'émission.",
      },
    ],
  },
  {
    slug: "marche-rwa-europe-2026",
    title: "Marché RWA en Europe 2026 : panorama et tendances",
    description:
      "Panorama du marché RWA européen en 2026 : segments (obligations, immobilier, crédit privé, stablecoins), TVL indicatif, régulation MiCA, acteurs et feuille de route émetteur. Données éducatives.",
    excerpt:
      "Où en est le marché des real world assets en Europe en 2026 ? Segments, régulation, liquidité, acteurs institutionnels et feuille de route émetteur — données indicatives, pas conseil d'investissement.",
    publishedAt: "2026-06-12",
    modifiedAt: "2026-06-12",
    readingTimeMinutes: 15,
    keywords: [
      "marché RWA Europe",
      "real world assets Europe 2026",
      "tokenisation Europe",
      "RWA TVL",
      "obligations tokenisées",
      "stablecoins treasury",
      "crédit privé tokenisé",
      "tendances RWA",
    ],
    cta: { href: "/compare", label: "Explorer le comparateur RWA" },
    ctaBlocks: [
      {
        afterSection: 1,
        title: "Segments et données live",
        links: [
          { href: "/bonds", label: "Obligations tokenisées" },
          { href: "/real-estate", label: "Immobilier RWA" },
          { href: "/data/rwa-index", label: "Indice RWA AUROS" },
        ],
      },
      {
        afterSection: 3,
        title: "Régulation et structuration",
        links: [
          { href: "/blog/mica-guide-emetteurs-rwa", label: "Guide MiCA émetteurs" },
          { href: "/tools/mica-checker", label: "Test MiCA" },
          { href: "/jurisdictions", label: "8 juridictions comparées" },
        ],
      },
      {
        afterSection: 5,
        title: "Passer à l'action",
        links: [
          { href: "/wizard", label: "Wizard émetteur" },
          { href: "/tools/yield-calculator", label: "Calculateur rendement" },
          { href: "/discover", label: "Découvrir les actifs RWA" },
        ],
      },
    ],
    sections: [
      {
        heading: "Pourquoi parler de « marché RWA » en Europe en 2026 ?",
        paragraphs: [
          "Les real world assets (RWA) désignent des droits économiques on-chain adossés à des actifs off-chain : dette souveraine et corporate tokenisée, créances privées, immobilier, matières premières, parts de fonds. En 2026, l'Europe n'est plus en phase purement expérimentale : des émetteurs institutionnels, banques et fintechs publient des produits avec TVL mesurable, documentation MiCA ou prospectus, et pipelines multi-actifs.",
          "Le moteur n'est pas la spéculation retail : ce sont les taux, la recherche de rendement treasury régulé, la tokenisation de parts de fonds existants et la pression réglementaire (MiCA, DORA, AML renforcé) qui poussent à des structures auditables. Le comparateur AUROS (/compare) agrège 120+ produits dédupliqués avec APY/TVL live via DeFiLlama et catalogue manuel.",
          "Ce panorama est éducatif. Les chiffres TVL/APY évoluent hourly — vérifiez les sources primaires. Aucune recommandation d'investissement.",
          "Trois lecteurs cibles : l'émetteur qui se positionne, l'investisseur professionnel qui cartographie l'offre, et l'intégrateur fintech qui branche l'API AUROS Protocol pour enrichir ses dashboards.",
        ],
        links: [
          { href: "/compare", label: "Hub comparateur" },
          { href: "/data/state-of-rwa-issuers", label: "État des émetteurs" },
          { href: "/how-it-works", label: "Comment fonctionne AUROS" },
        ],
      },
      {
        heading: "Segments dominants : obligations, stablecoins treasury, crédit, immobilier",
        paragraphs: [
          "Obligations et bons du Trésor tokenisés : segment le plus liquide en TVL agrégée — produits adossés à dette souveraine US/EU ou corporate investment grade. Attrait treasury des entreprises et DAOs cherchant rendement on-chain avec émetteurs connus. Voir /bonds pour le comparateur dédié.",
          "Stablecoins et cash equivalents régulés : segment en croissance post-MiCA pour les EMT — moins « RWA exotique » mais socle de liquidité pour les marchés tokenisés. Le hub /compare les classe avec les produits yield-bearing.",
          "Crédit privé tokenisé : fonds et plateformes digitalisant des créances SME, trade finance, dette structurée. Tickets institutionnels, due diligence crédit classique. Segment /private-credit sur AUROS.",
          "Immobilier tokenisé : plus visible médiatiquement, TVL plus fragmentée — immeubles uniques, résidences gérées, logistique. Liquidité secondaire inégale. Le guide immobilier Europe (/blog/real-estate-tokenization-europe) détaille les structures.",
          "Matières premières (or, agricole) : niche mais utile pour diversification ; souvent des wrappers régulés plutôt que spot on-chain pur.",
        ],
        links: [
          { href: "/bonds", label: "Comparateur obligations" },
          { href: "/private-credit", label: "Crédit privé" },
          { href: "/commodities", label: "Matières premières" },
        ],
      },
      {
        heading: "Cartographie géographique : hubs et passeports",
        paragraphs: [
          "Luxembourg, France, Allemagne, Irlande et Pays-Bas concentrent l'essentiel des véhicules régulés UE — CSSF, AMF, BaFin, CBI. Les émetteurs choisissent selon investisseurs cibles, fiscalité et profondeur prestataires (dépositaire, AIFM, CASP).",
          "Hors UE mais présents dans les comparatifs : DIFC (Dubaï), Singapour, Suisse — souvent pour actifs export ou investisseurs non-UE. Le passeport MiCA ne couvre pas ces hubs ; les montages transfrontaliers exigent analyse pays par pays.",
          "Le comparateur juridictions AUROS couvre huit hubs avec paramètres indicatifs délai/coût/friendliness RWA. Le Starter Kit (5 000 € HT) livre un memo personnalisé si l'arbitrage bloque.",
          "Tendance 2026 : émetteurs multi-juridictionnels avec documentation harmonisée UE + annexes locales — pas un seul PDF unique pour tous les pays.",
        ],
        links: [
          { href: "/jurisdictions", label: "Comparateur juridictions" },
          { href: "/blog/tokenisation-rwa-luxembourg", label: "Hub Luxembourg" },
          { href: "/tools/jurisdiction-picker", label: "Sélecteur juridiction" },
        ],
      },
      {
        heading: "Régulation : MiCA, DORA et attentes investisseurs",
        paragraphs: [
          "MiCA structure l'émission crypto et les CASP — voir notre guide émetteurs (/blog/mica-guide-emetteurs-rwa). DORA renforce la résilience numérique des entités financières — pertinent si vous dépendez de custody tiers ou cloud critique.",
          "Les investisseurs institutionnels demandent : audit smart contract, identité on-chain (ERC-3643 ou équivalent), registre off-chain aligné, reporting périodique et politique de conflits d'intérêts. La transparence TVL/APY sans hypothèses cachées devient un standard de crédibilité.",
          "Les promesses de rendement fixes sans réserve de risque sont un signal d'alerte régulateur — le marché mature affiche des fourchettes, stress scenarios et historique de défaut si applicable.",
          "AUROS positionne tout contenu comme indicatif — le hub compare des données publiques, le wizard aide à structurer, l'API score oriente la préparation MiCA.",
        ],
        links: [
          { href: "/blog/mica-guide-emetteurs-rwa", label: "Guide MiCA" },
          { href: "/glossary/mica", label: "Glossaire MiCA" },
          { href: "/trust", label: "Confiance AUROS" },
        ],
      },
      {
        heading: "Liquidité, rendement et ce que les chiffres ne disent pas",
        paragraphs: [
          "TVL agrégée masque la concentration : quelques protocoles dominent les courbes. APY élevé peut refléter prime de risque crédit, durée lock-up ou incentives temporaires — lisez toujours la documentation d'émission.",
          "Liquidité secondaire : marchés permissionnés existent (ATS, plateformes émetteurs) mais volumes faibles vs crypto spot. Lock-up et whitelist ERC-3643 protègent le pool mais limitent la sortie rapide.",
          "Le calculateur rendement AUROS (/tools/yield-calculator) simule des scénarios indicatifs. L'indice RWA (/data/rwa-index) suit des métriques agrégées éducatives — pas un benchmark investissable.",
          "Pour les émetteurs : positionnez-vous honnêtement vs obligations tokenisées et fonds traditionnels sur transparence et délai de mise en marché, pas sur une liquidité miracle.",
        ],
        links: [
          { href: "/tools/yield-calculator", label: "Calculateur rendement" },
          { href: "/data/rwa-index", label: "Indice RWA" },
          { href: "/real-estate", label: "Immobilier tokenisé" },
        ],
      },
      {
        heading: "Acteurs et écosystème : qui fait quoi",
        paragraphs: [
          "Émetteurs : banques, néobanques, fonds alternatifs, promoteurs immobiliers institutionnels. Plateformes : agrégateurs yield, marketplaces permissionnées. Infrastructure : custody, tokenisation (ERC-3643), oracles, KYC on-chain.",
          "AUROS se positionne comme couche intelligence et admission : comparateur ouvert, wizard émetteur, API Protocol pour scoring et checklist — pas custody, pas placement, pas conseil investissement.",
          "Les données DeFiLlama alimentent le hub compare hourly ; le catalogue manuel AUROS couvre les produits pas encore indexés. Objectif : vue unifiée éducative pour l'écosystème européen.",
          "Intégrateurs : SDK `@adrien1212balitrand/auros-protocol`, OpenAPI `/auros-openapi.yaml`, catalogue machine-readable `/ai-first/index.json`.",
        ],
        links: [
          { href: "/developers", label: "Portail développeurs" },
          { href: "/ai-first/index.json", label: "Catalogue AI-first" },
          { href: "/compare", label: "Comparateur live" },
        ],
      },
      {
        heading: "Feuille de route émetteur 2026 en quatre moments",
        paragraphs: [
          "Moment 1 — Cartographier le marché : segment cible, benchmarks rendement/liquidité via /compare, identification investisseurs type. Moment 2 — Qualifier régulation : MiCA, prospectus, CASP — test MiCA et counsel.",
          "Moment 3 — Structurer : juridiction, SPV/fonds, tech stack, data room 15 pièces. Wizard AUROS en ~15 minutes pour une première passe. Moment 4 — Industrialiser : audits, distribution, reporting récurrent.",
          "Les émetteurs qui réussissent en 2026 partagent un trait : documentation avant marketing. Les retards viennent plus souvent de pièces manquantes que de technologie blockchain.",
          "Prochaine étape concrète : lancer le wizard (/wizard) ou explorer le hub (/compare) selon votre profil émetteur vs analyste marché.",
        ],
        links: [
          { href: "/wizard", label: "Wizard émetteur" },
          { href: "/estimate", label: "Score préparation" },
          { href: "/jurisdictions/starter-kit", label: "Starter Kit juridiction" },
        ],
      },
    ],
    faq: [
      {
        question: "Quelle taille de marché RWA en Europe en 2026 ?",
        answer:
          "Les estimations varient selon périmètre (on-chain seul vs AUM off-chain tokenisé). Le comparateur AUROS suit 120+ produits publics avec TVL live — consultez /compare et /data/rwa-index pour des ordres de grandeur indicatifs.",
      },
      {
        question: "Quel segment RWA est le plus liquide ?",
        answer:
          "Indicativement obligations/treasury tokenisées et stablecoins yield-bearing régulés. Immobilier plus fragmenté. Vérifiez volumes secondaires réels par produit.",
      },
      {
        question: "L'Europe est-elle en retard vs États-Unis sur les RWA ?",
        answer:
          "L'UE privilégie cadres régulés (MiCA, prospectus) — délais plus longs mais crédibilité institutionnelle. Arbitrage selon investisseurs cibles, pas un classement absolu.",
      },
      {
        question: "Comment suivre l'évolution du marché ?",
        answer:
          "Hub /compare (hourly), indice /data/rwa-index, blog AUROS et API products pour intégrateurs.",
      },
      {
        question: "AUROS recommande-t-il des produits RWA ?",
        answer:
          "Non — comparateur éducatif et outils émetteur. Pas de conseil investissement.",
      },
      {
        question: "Quels prérequis pour émettre un RWA en UE ?",
        answer:
          "Qualification jeton, structure juridique, documentation MiCA/prospectus, KYC/AML, audits — voir wizard et guide MiCA émetteurs.",
      },
      {
        question: "Le rendement affiché sur /compare est-il garanti ?",
        answer:
          "Non — APY indicatifs sources DeFiLlama et émetteurs, peuvent varier. Lisez les documents officiels.",
      },
      {
        question: "Comment citer les données AUROS ?",
        answer:
          "Source getauros.com/compare avec date de consultation. API disponible sous quota gratuit pour usage structuré.",
      },
    ],
  },
  {
    slug: "future-of-energy-trading-on-chain",
    title: "The Future of Energy Trading is On-Chain",
    description:
      "Why metered renewables, AI load, and oracle-gated resource tokens change energy trading — and what must stay off-chain.",
    excerpt:
      "Energy markets are still spreadsheets and phone calls at the edge of the grid. On-chain resource units can align producers, data centers, and liquidity — if we tokenize meters, not marketing.",
    publishedAt: "2026-07-22",
    modifiedAt: "2026-07-22",
    readingTimeMinutes: 9,
    keywords: [
      "energy trading blockchain",
      "tokenized kWh",
      "RWA energy",
      "AUROS Resource Layer",
      "renewable PPA on-chain",
      "AI data center power",
    ],
    cta: { href: "/resource-layer", label: "Explore Auros Resource Layer" },
    ctaBlocks: [
      {
        afterSection: 1,
        title: "Preview dashboards",
        links: [
          { href: "/producer", label: "Producer console" },
          { href: "/agent", label: "Agent console" },
          { href: "/market", label: "Resource market" },
        ],
      },
    ],
    sections: [
      {
        heading: "The gap between tokenized assets and tokenized flows",
        paragraphs: [
          "Real-world asset tokenization solved part of the story: cap tables, transfer restrictions, and investor-facing documents can live on-chain. But the economic life of many RWAs — especially energy-linked instruments — is still settled in legacy markets. The electron does not ride inside the JWT.",
          "On-chain energy trading, in a useful sense, means representing metered production and consumption as fungible resource units with clear mint and burn rules, then letting liquidity pools and agent APIs price those units in real time. That is a different problem from tokenizing a fund share in a solar SPV.",
          "AUROS Resource Layer (ARL) targets the flow layer: kWh (and related resources) as ERC-20 units gated by oracles, not promises in a PDF.",
        ],
        links: [
          { href: "/resource-layer", label: "ARL vision" },
          { href: "/how-it-works", label: "How AUROS works" },
        ],
      },
      {
        heading: "Why AI load makes timing matter",
        paragraphs: [
          "Data centers and inference clusters are reshaping load profiles: sharp ramps, geographic arbitrage, and hedge desks that think in megawatt-hours, not annual PPAs alone. Agents that forecast consumption need a machine-readable way to lock forward energy — without pretending the grid is fully decentralized.",
          "A practical stack combines predicted load, open forward orders, and a hedge ratio dashboard — exactly the surfaces in the ARL agent preview. Automation proposes; humans approve settlement where regulation and grid operators require it.",
        ],
        links: [{ href: "/agent", label: "Agent dashboard demo" }],
      },
      {
        heading: "Producers need liquidity, not another portal",
        paragraphs: [
          "Solar and storage operators already juggle inverters, export limits, and imbalance charges. Tokenizing surplus should feel like a revenue line, not a science project. Oracle-gated mint from verified meters, visible token balance, and a withdraw path with human gates beats opaque OTC quotes.",
          "The producer preview shows devices, production curves, and minted AKWH — mock data today, same UX targets for pilots.",
        ],
        links: [{ href: "/producer", label: "Producer dashboard demo" }],
      },
      {
        heading: "Regional markets and honest liquidity labels",
        paragraphs: [
          "Energy is local. A kWh in France and a kWh in Texas share a unit name but not the same constraints. Resource marketplaces must expose region, depth, and indicative price — and never badge demo liquidity as “verified.”",
          "ARL’s market preview lists regional instruments (kWh France, kWh Texas, water California) with volume and liquidity tiers as educational placeholders.",
        ],
        links: [{ href: "/market", label: "Marketplace demo" }],
      },
      {
        heading: "What stays off-chain",
        paragraphs: [
          "Grid compliance, balancing responsibility, and physical delivery remain with licensed operators and counsel. Smart contracts coordinate claims on metered reality; they do not replace the wire.",
          "Readers building issuers should still run the AUROS wizard for dossier readiness; ARL is complementary infrastructure for resource liquidity after — or alongside — structured issuance.",
        ],
        links: [
          { href: "/wizard", label: "Issuer wizard" },
          { href: "/resource-layer/faq", label: "ARL FAQ" },
        ],
      },
    ],
    faq: [
      {
        question: "Is on-chain energy trading live on AUROS?",
        answer:
          "Preview UIs and protocol contracts exist for development; production settlement depends on pilot geography and HITL processes. See /resource-layer/faq.",
      },
      {
        question: "Does AUROS guarantee renewable origin on-chain?",
        answer:
          "No. Guarantees of origin and grid programs remain off-chain attestations feeding oracles — not marketing badges in a demo UI.",
      },
      {
        question: "Where is the technical spec?",
        answer: "docs/WHITEPAPER.md and ARL-README.md at the repository root.",
      },
    ],
  },
];

export function getAllBlogSlugs(): string[] {
  return BLOG_ARTICLES.map((a) => a.slug);
}

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug);
}

export { blogArticlePath };
