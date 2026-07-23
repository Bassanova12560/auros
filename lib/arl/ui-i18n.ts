import { localeCatalog, type Locale } from "@/lib/i18n";

export type NextLink = {
  href: string;
  label: string;
  hint?: string;
};

export type ArlUiCopy = {
  strip: {
    nextStepsAria: string;
    alsoNearby: string;
  };
  wallet: {
    eyebrow: string;
    title: string;
    body: string;
    copyId: string;
    copied: string;
    refresh: string;
    tipEur: string;
    tipAkWh: string;
    tipWatt: string;
    tipH2o: string;
    tipFlop: string;
    steps: {
      produce: { label: string; hint: string };
      convert: { label: string; hint: string };
      sell: { label: string; hint: string };
    };
    journeyAria: string;
  };
  disclaimer: string;
  homeSolutions: {
    eyebrow: string;
    title: string;
    intro: string;
    dossierHint: string;
    dossierCta: string;
    compareHint: string;
    compareCta: string;
    doors: Array<{ who: string; plain: string; cta: string; href: string }>;
  };
  hero: {
    or: string;
    talk: string;
    pickPath: string;
    dossier: string;
    compare: string;
    footnote: string;
  };
  banner: {
    eyebrow: string;
    title: string;
    bodyBefore: string;
    bodyAfter: string;
    links: Array<{ href: string; label: string }>;
  };
  preview: {
    eyebrow: string;
    badge: string;
    steps: Array<{ n: string; title: string; hint: string }>;
    cta: string;
  };
  neighbors: {
    afterLab: { primary: NextLink; secondary: NextLink[]; neighbors: NextLink[] };
    afterProducer: { primary: NextLink; secondary: NextLink[]; neighbors: NextLink[] };
    afterTrade: { primary: NextLink; secondary: NextLink[]; neighbors: NextLink[] };
    afterAgent: { primary: NextLink; secondary: NextLink[]; neighbors: NextLink[] };
    afterCompare: { primary: NextLink; secondary: NextLink[]; neighbors: NextLink[] };
    company: { primary: NextLink; secondary: NextLink[]; neighbors: NextLink[] };
    vision: { primary: NextLink; secondary: NextLink[]; neighbors: NextLink[] };
  };
};

const FR: ArlUiCopy = {
  strip: {
    nextStepsAria: "Étapes suivantes",
    alsoNearby: "Aussi à proximité",
  },
  wallet: {
    eyebrow: "Lab wallet · pas MetaMask · pas mainnet",
    title: "Ton compte ressource",
    body: "Même portefeuille sur Lab, Producer et Trade. Mint akWh → wrap WATT optionnel → vente spot (vend akWh ; WATT auto-redeem 1:1).",
    copyId: "Copier ID",
    copied: "Copié",
    refresh: "Actualiser",
    tipEur: "Cash lab pour trader",
    tipAkWh: "Énergie mintée",
    tipWatt: "Wrap 1:1 vs vault",
    tipH2o: "Eau",
    tipFlop: "Compute",
    steps: {
      produce: { label: "Produire", hint: "Mint akWh" },
      convert: { label: "Convertir", hint: "Wrap → WATT 1:1" },
      sell: { label: "Vendre", hint: "Spot (akWh · auto-redeem)" },
    },
    journeyAria: "Parcours lab",
  },
  disclaimer:
    "Lab ledger live (mint akWh, wrap WATT 1:1, spot avec auto-redeem). Pas mainnet, pas d’offre publique — retraits et settlement prod restent HITL.",
  homeSolutions: {
    eyebrow: "Choisis ton chemin",
    title: "Tu es là pour quoi ?",
    intro: "Un moteur de liquidité. Trois portes. Pas de jargon — le chemin qui match ton métier.",
    dossierHint: "Tu prépares un dossier RWA classique (immo, art, créances) ?",
    dossierCta: "Démarrer la readiness (~4 min)",
    compareHint: "Tu veux lire le marché avant de structurer ?",
    compareCta: "Ouvrir le comparateur RWA",
    doors: [
      {
        who: "Exchanges & actifs digitaux",
        plain:
          "Liquidité profonde, discipline de risque 24/7, APIs venue-ready pour les tokens qui ont besoin de vrais marchés.",
        cta: "Ouvrir le marketplace",
        href: "/market",
      },
      {
        who: "Producteurs énergie & eau",
        plain:
          "Transforme la production mesurée en unités vendables — chemins buyers plus courts, démos labellisées d’abord.",
        cta: "Ouvrir Energy Lab",
        href: "/lab",
      },
      {
        who: "Développeurs & agents IA",
        plain:
          "Build sur le Resource Layer : surfaces protocole, agent API, et un lab wallet partagé.",
        cta: "Builders / testnet",
        href: "/builders",
      },
    ],
  },
  hero: {
    or: "Ou",
    talk: "parler à l’équipe",
    pickPath: "choisir mon profil",
    dossier: "dossier RWA",
    compare: "comparateur marché",
    footnote:
      "Un moteur : liquidité institutionnelle pour actifs numériques, et règlement pour l’énergie, l’eau et le compute tokenisés. Lab wallet partagé — pas de MetaMask.",
  },
  banner: {
    eyebrow: "Même moteur · prochaine frontière",
    title: "Énergie, eau et compute tokenisés suivent la même discipline de liquidité.",
    bodyBefore: "Production mesurée → lab wallet → spot. Propulsé par",
    bodyAfter: "(preview — pas d’offre publique). Démos labellisées ; settlement HITL.",
    links: [
      { href: "/resource-layer", label: "Pourquoi les ressources" },
      { href: "/watt", label: "WATT" },
      { href: "/lab", label: "Lab" },
      { href: "/trade", label: "Trade" },
    ],
  },
  preview: {
    eyebrow: "Lab wallet · aperçu",
    badge: "Sans MetaMask",
    steps: [
      { n: "1", title: "Produire", hint: "Mint akWh · /lab" },
      { n: "2", title: "Convertir", hint: "Wrap → WATT · /producer" },
      { n: "3", title: "Vendre", hint: "Spot · /trade" },
    ],
    cta: "Commencer dans Energy Lab →",
  },
  neighbors: {
    afterLab: {
      primary: { href: "/producer", label: "Suite · Wrap sur Producer" },
      secondary: [{ href: "/resource-layer", label: "Vision", hint: "pourquoi ARL" }],
      neighbors: [
        { href: "/watt", label: "WATT" },
        { href: "/builders", label: "Builders" },
        { href: "/trade", label: "Trade" },
      ],
    },
    afterProducer: {
      primary: { href: "/trade?market=kwh-france&side=sell", label: "Suite · Vendre sur Trade" },
      secondary: [{ href: "/watt", label: "Unité WATT" }],
      neighbors: [
        { href: "/lab", label: "Lab" },
        { href: "/earn", label: "Earn" },
        { href: "/market", label: "Market" },
      ],
    },
    afterTrade: {
      primary: { href: "/agent", label: "Option · Hedge agent" },
      secondary: [{ href: "/earn", label: "Aperçu Earn" }],
      neighbors: [
        { href: "/market", label: "Market" },
        { href: "/builders", label: "Builders" },
        { href: "/status", label: "Status" },
      ],
    },
    afterAgent: {
      primary: { href: "/trade", label: "Retour Trade" },
      secondary: [{ href: "/builders", label: "Chemin Agent API" }],
      neighbors: [
        { href: "/producer", label: "Producer" },
        { href: "/market", label: "Market" },
        { href: "/investors", label: "Investisseurs" },
      ],
    },
    afterCompare: {
      primary: { href: "/start", label: "Démarrer mon dossier (~4 min)" },
      secondary: [
        { href: "/green", label: "Voie Green", hint: "eau & énergie" },
        { href: "/green/csrd-check", label: "Check CSRD" },
      ],
      neighbors: [],
    },
    company: {
      primary: { href: "/lab", label: "Lancer la boucle lab" },
      secondary: [
        {
          href: "mailto:resources@getauros.com?subject=AUROS%20diligence",
          label: "Nous écrire",
        },
      ],
      neighbors: [
        { href: "/investors", label: "Investisseurs" },
        { href: "/compare", label: "Comparateur RWA" },
        { href: "/press", label: "Press" },
        { href: "/careers", label: "Carrières" },
        { href: "/status", label: "Status" },
        { href: "/why", label: "Pourquoi" },
      ],
    },
    vision: {
      primary: { href: "/lab", label: "Ouvrir Energy Lab" },
      secondary: [{ href: "/builders", label: "Builders" }],
      neighbors: [
        { href: "/why", label: "Pourquoi" },
        { href: "/compare", label: "Comparateur RWA" },
        { href: "/watt", label: "WATT" },
        { href: "/investors", label: "Investisseurs" },
      ],
    },
  },
};

const EN: ArlUiCopy = {
  strip: {
    nextStepsAria: "Next steps",
    alsoNearby: "Also nearby",
  },
  wallet: {
    eyebrow: "Lab wallet · not MetaMask · not mainnet",
    title: "Your resource account",
    body: "Same wallet on Lab, Producer, and Trade. Mint akWh → optional wrap to WATT → spot sell (sells akWh; wrapped WATT auto-redeems 1:1).",
    copyId: "Copy ID",
    copied: "Copied",
    refresh: "Refresh",
    tipEur: "Lab cash for spot",
    tipAkWh: "Minted energy",
    tipWatt: "1:1 vault wrap",
    tipH2o: "Water",
    tipFlop: "Compute",
    steps: {
      produce: { label: "Produce", hint: "Mint akWh" },
      convert: { label: "Convert", hint: "Wrap → WATT 1:1" },
      sell: { label: "Sell", hint: "Spot (akWh · auto-redeem)" },
    },
    journeyAria: "Lab journey",
  },
  disclaimer:
    "Lab ledger is live (mint akWh, wrap WATT 1:1, spot sell with auto-redeem). Not mainnet, not a public sale — withdrawals and production settlement still require human approval (HITL).",
  homeSolutions: {
    eyebrow: "Pick your path",
    title: "Who are you here for?",
    intro: "One liquidity engine. Three doors. No jargon maze — choose the path that matches your job.",
    dossierHint: "Preparing a classic RWA dossier (real estate, art, receivables)?",
    dossierCta: "Start readiness in ~4 min",
    compareHint: "Want to read the market before you structure?",
    compareCta: "Open the RWA comparator",
    doors: [
      {
        who: "Exchanges & digital assets",
        plain:
          "Deep liquidity, 24/7 risk discipline, and venue-ready APIs for tokens that need real markets.",
        cta: "Open marketplace",
        href: "/market",
      },
      {
        who: "Energy & water producers",
        plain:
          "Turn metered production into units you can sell — faster paths to buyers, labeled demos first.",
        cta: "Open Energy Lab",
        href: "/lab",
      },
      {
        who: "Developers & AI agents",
        plain: "Build on the Resource Layer: protocol surfaces, agent API, and a shared lab wallet.",
        cta: "Builders / testnet",
        href: "/builders",
      },
    ],
  },
  hero: {
    or: "Or",
    talk: "talk to the team",
    pickPath: "pick your path",
    dossier: "RWA dossier",
    compare: "market comparator",
    footnote:
      "One engine: institutional liquidity for digital assets, and settlement for tokenized energy, water, and compute. Shared lab wallet — no MetaMask.",
  },
  banner: {
    eyebrow: "Same engine · next frontier",
    title: "Tokenized energy, water, and compute use the same liquidity discipline.",
    bodyBefore: "Metered production → lab wallet → spot. Powered by",
    bodyAfter: "(preview — not a public sale). Demos labeled; settlement stays HITL.",
    links: [
      { href: "/resource-layer", label: "Why resources" },
      { href: "/watt", label: "WATT" },
      { href: "/lab", label: "Lab" },
      { href: "/trade", label: "Trade" },
    ],
  },
  preview: {
    eyebrow: "Lab wallet · preview",
    badge: "No MetaMask",
    steps: [
      { n: "1", title: "Produce", hint: "Mint akWh · /lab" },
      { n: "2", title: "Convert", hint: "Wrap → WATT · /producer" },
      { n: "3", title: "Sell", hint: "Spot settle · /trade" },
    ],
    cta: "Start in Energy Lab →",
  },
  neighbors: {
    afterLab: {
      primary: { href: "/producer", label: "Next · Wrap on Producer" },
      secondary: [{ href: "/resource-layer", label: "Vision", hint: "why ARL" }],
      neighbors: [
        { href: "/watt", label: "WATT" },
        { href: "/builders", label: "Builders" },
        { href: "/trade", label: "Trade" },
      ],
    },
    afterProducer: {
      primary: { href: "/trade?market=kwh-france&side=sell", label: "Next · Sell on Trade" },
      secondary: [{ href: "/watt", label: "WATT unit" }],
      neighbors: [
        { href: "/lab", label: "Lab" },
        { href: "/earn", label: "Earn" },
        { href: "/market", label: "Market" },
      ],
    },
    afterTrade: {
      primary: { href: "/agent", label: "Optional · Agent hedge" },
      secondary: [{ href: "/earn", label: "Earn preview" }],
      neighbors: [
        { href: "/market", label: "Market" },
        { href: "/builders", label: "Builders" },
        { href: "/status", label: "Status" },
      ],
    },
    afterAgent: {
      primary: { href: "/trade", label: "Back to Trade" },
      secondary: [{ href: "/builders", label: "Agent API path" }],
      neighbors: [
        { href: "/producer", label: "Producer" },
        { href: "/market", label: "Market" },
        { href: "/investors", label: "Investors" },
      ],
    },
    afterCompare: {
      primary: { href: "/start", label: "Start my dossier (~4 min)" },
      secondary: [
        { href: "/green", label: "Green path", hint: "water & energy" },
        { href: "/green/csrd-check", label: "CSRD check" },
      ],
      neighbors: [],
    },
    company: {
      primary: { href: "/lab", label: "Run the lab loop" },
      secondary: [
        {
          href: "mailto:resources@getauros.com?subject=AUROS%20diligence",
          label: "Talk to us",
        },
      ],
      neighbors: [
        { href: "/investors", label: "Investors" },
        { href: "/compare", label: "RWA comparator" },
        { href: "/press", label: "Press" },
        { href: "/careers", label: "Careers" },
        { href: "/status", label: "Status" },
        { href: "/why", label: "Why" },
      ],
    },
    vision: {
      primary: { href: "/lab", label: "Open Energy Lab" },
      secondary: [{ href: "/builders", label: "Builders" }],
      neighbors: [
        { href: "/why", label: "Why" },
        { href: "/compare", label: "RWA comparator" },
        { href: "/watt", label: "WATT" },
        { href: "/investors", label: "Investors" },
      ],
    },
  },
};

const ES: ArlUiCopy = {
  strip: {
    nextStepsAria: "Siguientes pasos",
    alsoNearby: "También cerca",
  },
  wallet: {
    eyebrow: "Lab wallet · no MetaMask · no mainnet",
    title: "Tu cuenta de recursos",
    body: "Misma cartera en Lab, Producer y Trade. Mint akWh → wrap WATT opcional → venta spot (vende akWh; WATT se canjea 1:1).",
    copyId: "Copiar ID",
    copied: "Copiado",
    refresh: "Actualizar",
    tipEur: "Cash lab para spot",
    tipAkWh: "Energía minteada",
    tipWatt: "Wrap 1:1 vault",
    tipH2o: "Agua",
    tipFlop: "Compute",
    steps: {
      produce: { label: "Producir", hint: "Mint akWh" },
      convert: { label: "Convertir", hint: "Wrap → WATT 1:1" },
      sell: { label: "Vender", hint: "Spot (akWh · auto-redeem)" },
    },
    journeyAria: "Recorrido lab",
  },
  disclaimer:
    "Lab ledger en vivo (mint akWh, wrap WATT 1:1, spot con auto-redeem). No mainnet, no oferta pública — retiros y settlement de producción siguen siendo HITL.",
  homeSolutions: {
    eyebrow: "Elige tu camino",
    title: "¿Para quién estás aquí?",
    intro: "Un motor de liquidez. Tres puertas. Sin jerga — elige el camino de tu rol.",
    dossierHint: "¿Preparas un dossier RWA clásico (inmueble, arte, créditos)?",
    dossierCta: "Empezar readiness (~4 min)",
    compareHint: "¿Quieres leer el mercado antes de estructurar?",
    compareCta: "Abrir el comparador RWA",
    doors: [
      {
        who: "Exchanges y activos digitales",
        plain:
          "Liquidez profunda, disciplina de riesgo 24/7 y APIs listas para venues que necesitan mercados reales.",
        cta: "Abrir marketplace",
        href: "/market",
      },
      {
        who: "Productores de energía y agua",
        plain:
          "Convierte producción medida en unidades vendibles — caminos más cortos a compradores, demos etiquetadas primero.",
        cta: "Abrir Energy Lab",
        href: "/lab",
      },
      {
        who: "Developers y agentes IA",
        plain:
          "Construye sobre Resource Layer: protocolo, agent API y lab wallet compartido.",
        cta: "Builders / testnet",
        href: "/builders",
      },
    ],
  },
  hero: {
    or: "O",
    talk: "hablar con el equipo",
    pickPath: "elegir mi perfil",
    dossier: "dossier RWA",
    compare: "comparador de mercado",
    footnote:
      "Un motor: liquidez institucional para activos digitales, y settlement para energía, agua y compute tokenizados. Lab wallet compartido — sin MetaMask.",
  },
  banner: {
    eyebrow: "Mismo motor · siguiente frontera",
    title: "Energía, agua y compute tokenizados siguen la misma disciplina de liquidez.",
    bodyBefore: "Producción medida → lab wallet → spot. Impulsado por",
    bodyAfter: "(preview — no oferta pública). Demos etiquetadas; settlement HITL.",
    links: [
      { href: "/resource-layer", label: "Por qué recursos" },
      { href: "/watt", label: "WATT" },
      { href: "/lab", label: "Lab" },
      { href: "/trade", label: "Trade" },
    ],
  },
  preview: {
    eyebrow: "Lab wallet · vista previa",
    badge: "Sin MetaMask",
    steps: [
      { n: "1", title: "Producir", hint: "Mint akWh · /lab" },
      { n: "2", title: "Convertir", hint: "Wrap → WATT · /producer" },
      { n: "3", title: "Vender", hint: "Spot · /trade" },
    ],
    cta: "Empezar en Energy Lab →",
  },
  neighbors: {
    afterLab: {
      primary: { href: "/producer", label: "Siguiente · Wrap en Producer" },
      secondary: [{ href: "/resource-layer", label: "Visión", hint: "por qué ARL" }],
      neighbors: [
        { href: "/watt", label: "WATT" },
        { href: "/builders", label: "Builders" },
        { href: "/trade", label: "Trade" },
      ],
    },
    afterProducer: {
      primary: { href: "/trade?market=kwh-france&side=sell", label: "Siguiente · Vender en Trade" },
      secondary: [{ href: "/watt", label: "Unidad WATT" }],
      neighbors: [
        { href: "/lab", label: "Lab" },
        { href: "/earn", label: "Earn" },
        { href: "/market", label: "Market" },
      ],
    },
    afterTrade: {
      primary: { href: "/agent", label: "Opcional · Hedge agent" },
      secondary: [{ href: "/earn", label: "Vista Earn" }],
      neighbors: [
        { href: "/market", label: "Market" },
        { href: "/builders", label: "Builders" },
        { href: "/status", label: "Status" },
      ],
    },
    afterAgent: {
      primary: { href: "/trade", label: "Volver a Trade" },
      secondary: [{ href: "/builders", label: "Ruta Agent API" }],
      neighbors: [
        { href: "/producer", label: "Producer" },
        { href: "/market", label: "Market" },
        { href: "/investors", label: "Inversores" },
      ],
    },
    afterCompare: {
      primary: { href: "/start", label: "Empezar mi expediente (~4 min)" },
      secondary: [
        { href: "/green", label: "Vía Green", hint: "agua y energía" },
        { href: "/green/csrd-check", label: "Check CSRD" },
      ],
      neighbors: [],
    },
    company: {
      primary: { href: "/lab", label: "Lanzar el loop lab" },
      secondary: [
        {
          href: "mailto:resources@getauros.com?subject=AUROS%20diligence",
          label: "Escríbenos",
        },
      ],
      neighbors: [
        { href: "/investors", label: "Inversores" },
        { href: "/compare", label: "Comparador RWA" },
        { href: "/press", label: "Press" },
        { href: "/careers", label: "Carreras" },
        { href: "/status", label: "Status" },
        { href: "/why", label: "Por qué" },
      ],
    },
    vision: {
      primary: { href: "/lab", label: "Abrir Energy Lab" },
      secondary: [{ href: "/builders", label: "Builders" }],
      neighbors: [
        { href: "/why", label: "Por qué" },
        { href: "/compare", label: "Comparador RWA" },
        { href: "/watt", label: "WATT" },
        { href: "/investors", label: "Inversores" },
      ],
    },
  },
};

const AR: ArlUiCopy = {
  strip: {
    nextStepsAria: "الخطوات التالية",
    alsoNearby: "أيضاً بالقرب",
  },
  wallet: {
    eyebrow: "محفظة Lab · ليست MetaMask · ليست mainnet",
    title: "حساب الموارد الخاص بك",
    body: "نفس المحفظة على Lab وProducer وTrade. سكّ akWh ← تغليف WATT اختياري ← بيع فوري (يبيع akWh؛ WATT المغلف يُسترد تلقائياً 1:1).",
    copyId: "نسخ المعرّف",
    copied: "تم النسخ",
    refresh: "تحديث",
    tipEur: "نقد Lab للتداول الفوري",
    tipAkWh: "طاقة مسكوكة",
    tipWatt: "تغليف خزنة 1:1",
    tipH2o: "ماء",
    tipFlop: "حوسبة",
    steps: {
      produce: { label: "إنتاج", hint: "سكّ akWh" },
      convert: { label: "تحويل", hint: "تغليف ← WATT 1:1" },
      sell: { label: "بيع", hint: "فوري (akWh · استرداد تلقائي)" },
    },
    journeyAria: "مسار Lab",
  },
  disclaimer:
    "دفتر Lab يعمل مباشرة (سكّ akWh، تغليف WATT 1:1، بيع فوري مع استرداد تلقائي). ليست mainnet وليست طرحاً عاماً — السحوبات وتسوية الإنتاج ما زالت تتطلب موافقة بشرية (HITL).",
  homeSolutions: {
    eyebrow: "اختر مسارك",
    title: "لمن أنت هنا؟",
    intro: "محرك سيولة واحد. ثلاثة أبواب. بلا متاهة مصطلحات — اختر المسار الذي يطابق دورك.",
    dossierHint: "تُعدّ ملفاً كلاسيكياً لـ RWA (عقار، فن، مستحقات)؟",
    dossierCta: "ابدأ الجاهزية خلال ~4 دقائق",
    compareHint: "أتريد قراءة السوق قبل الهيكلة؟",
    compareCta: "فتح مقارن RWA",
    doors: [
      {
        who: "البورصات والأصول الرقمية",
        plain:
          "سيولة عميقة، انضباط مخاطر على مدار الساعة، وواجهات API جاهزة للمنصات التي تحتاج أسواقاً حقيقية.",
        cta: "فتح السوق",
        href: "/market",
      },
      {
        who: "منتجو الطاقة والمياه",
        plain:
          "حوّل الإنتاج المقاس إلى وحدات قابلة للبيع — مسارات أقصر إلى المشترين، عروض توضيحية مُسمّاة أولاً.",
        cta: "فتح Energy Lab",
        href: "/lab",
      },
      {
        who: "المطوّرون ووكلاء الذكاء الاصطناعي",
        plain:
          "ابنِ على Resource Layer: أسطح البروتوكول، واجهة Agent API، ومحفظة Lab مشتركة.",
        cta: "Builders / testnet",
        href: "/builders",
      },
    ],
  },
  hero: {
    or: "أو",
    talk: "التحدث مع الفريق",
    pickPath: "اختيار مساري",
    dossier: "ملف RWA",
    compare: "مقارن السوق",
    footnote:
      "محرك واحد: سيولة مؤسسية للأصول الرقمية، وتسوية للطاقة والمياه والحوسبة المرمّزة. محفظة Lab مشتركة — بلا MetaMask.",
  },
  banner: {
    eyebrow: "نفس المحرك · الحدود التالية",
    title: "الطاقة والمياه والحوسبة المرمّزة تتبع نفس انضباط السيولة.",
    bodyBefore: "إنتاج مقاس ← محفظة Lab ← فوري. مدعوم بـ",
    bodyAfter: "(معاينة — ليست طرحاً عاماً). عروض توضيحية مُسمّاة؛ التسوية تبقى HITL.",
    links: [
      { href: "/resource-layer", label: "لماذا الموارد" },
      { href: "/watt", label: "WATT" },
      { href: "/lab", label: "Lab" },
      { href: "/trade", label: "Trade" },
    ],
  },
  preview: {
    eyebrow: "محفظة Lab · معاينة",
    badge: "بدون MetaMask",
    steps: [
      { n: "1", title: "إنتاج", hint: "سكّ akWh · /lab" },
      { n: "2", title: "تحويل", hint: "تغليف ← WATT · /producer" },
      { n: "3", title: "بيع", hint: "تسوية فورية · /trade" },
    ],
    cta: "ابدأ في Energy Lab ←",
  },
  neighbors: {
    afterLab: {
      primary: { href: "/producer", label: "التالي · التغليف على Producer" },
      secondary: [{ href: "/resource-layer", label: "الرؤية", hint: "لماذا ARL" }],
      neighbors: [
        { href: "/watt", label: "WATT" },
        { href: "/builders", label: "Builders" },
        { href: "/trade", label: "Trade" },
      ],
    },
    afterProducer: {
      primary: { href: "/trade?market=kwh-france&side=sell", label: "التالي · البيع على Trade" },
      secondary: [{ href: "/watt", label: "وحدة WATT" }],
      neighbors: [
        { href: "/lab", label: "Lab" },
        { href: "/earn", label: "Earn" },
        { href: "/market", label: "Market" },
      ],
    },
    afterTrade: {
      primary: { href: "/agent", label: "اختياري · تحوّط الوكيل" },
      secondary: [{ href: "/earn", label: "معاينة Earn" }],
      neighbors: [
        { href: "/market", label: "Market" },
        { href: "/builders", label: "Builders" },
        { href: "/status", label: "Status" },
      ],
    },
    afterAgent: {
      primary: { href: "/trade", label: "العودة إلى Trade" },
      secondary: [{ href: "/builders", label: "مسار Agent API" }],
      neighbors: [
        { href: "/producer", label: "Producer" },
        { href: "/market", label: "Market" },
        { href: "/investors", label: "المستثمرون" },
      ],
    },
    afterCompare: {
      primary: { href: "/start", label: "ابدأ ملفي (~4 دقائق)" },
      secondary: [
        { href: "/green", label: "مسار Green", hint: "ماء وطاقة" },
        { href: "/green/csrd-check", label: "فحص CSRD" },
      ],
      neighbors: [],
    },
    company: {
      primary: { href: "/lab", label: "تشغيل حلقة Lab" },
      secondary: [
        {
          href: "mailto:resources@getauros.com?subject=AUROS%20diligence",
          label: "تواصل معنا",
        },
      ],
      neighbors: [
        { href: "/investors", label: "المستثمرون" },
        { href: "/compare", label: "مقارن RWA" },
        { href: "/press", label: "الصحافة" },
        { href: "/careers", label: "الوظائف" },
        { href: "/status", label: "Status" },
        { href: "/why", label: "لماذا" },
      ],
    },
    vision: {
      primary: { href: "/lab", label: "فتح Energy Lab" },
      secondary: [{ href: "/builders", label: "Builders" }],
      neighbors: [
        { href: "/why", label: "لماذا" },
        { href: "/compare", label: "مقارن RWA" },
        { href: "/watt", label: "WATT" },
        { href: "/investors", label: "المستثمرون" },
      ],
    },
  },
};

const ZH: ArlUiCopy = {
  strip: {
    nextStepsAria: "下一步",
    alsoNearby: "附近也有",
  },
  wallet: {
    eyebrow: "Lab 钱包 · 非 MetaMask · 非主网",
    title: "您的资源账户",
    body: "在 Lab、Producer 与 Trade 使用同一钱包。铸造 akWh → 可选 wrap 为 WATT → 现货卖出（卖出 akWh；已 wrap 的 WATT 按 1:1 自动赎回）。",
    copyId: "复制 ID",
    copied: "已复制",
    refresh: "刷新",
    tipEur: "Lab 现金用于现货",
    tipAkWh: "已铸造能源",
    tipWatt: "金库 1:1 wrap",
    tipH2o: "水",
    tipFlop: "算力",
    steps: {
      produce: { label: "生产", hint: "铸造 akWh" },
      convert: { label: "转换", hint: "Wrap → WATT 1:1" },
      sell: { label: "出售", hint: "现货（akWh · 自动赎回）" },
    },
    journeyAria: "Lab 流程",
  },
  disclaimer:
    "Lab 账本已上线（铸造 akWh、wrap WATT 1:1、现货卖出并自动赎回）。非主网、非公开发售——提现与生产结算仍需人工审批（HITL）。",
  homeSolutions: {
    eyebrow: "选择您的路径",
    title: "您为谁而来？",
    intro: "一个流动性引擎。三扇门。没有术语迷宫——选择匹配您职责的路径。",
    dossierHint: "正在准备经典 RWA 档案（不动产、艺术品、应收账款）？",
    dossierCta: "约 4 分钟开始就绪评估",
    compareHint: "想在结构化之前先了解市场？",
    compareCta: "打开 RWA 对比器",
    doors: [
      {
        who: "交易所与数字资产",
        plain:
          "深厚流动性、全天候风险纪律，以及面向需要真实市场的代币的场馆级 API。",
        cta: "打开市场",
        href: "/market",
      },
      {
        who: "能源与水生产商",
        plain:
          "将计量产量转化为可售单位——更快触达买方，优先使用标注演示。",
        cta: "打开 Energy Lab",
        href: "/lab",
      },
      {
        who: "开发者与 AI 代理",
        plain: "基于 Resource Layer 构建：协议接口、Agent API，以及共享 Lab 钱包。",
        cta: "Builders / testnet",
        href: "/builders",
      },
    ],
  },
  hero: {
    or: "或",
    talk: "与团队沟通",
    pickPath: "选择我的路径",
    dossier: "RWA 档案",
    compare: "市场对比器",
    footnote:
      "一个引擎：为数字资产提供机构级流动性，并为代币化能源、水与算力提供结算。共享 Lab 钱包——无需 MetaMask。",
  },
  banner: {
    eyebrow: "同一引擎 · 下一前沿",
    title: "代币化能源、水与算力遵循同一套流动性纪律。",
    bodyBefore: "计量产量 → Lab 钱包 → 现货。由",
    bodyAfter: "驱动（预览——非公开发售）。演示已标注；结算保持 HITL。",
    links: [
      { href: "/resource-layer", label: "为何选择资源" },
      { href: "/watt", label: "WATT" },
      { href: "/lab", label: "Lab" },
      { href: "/trade", label: "Trade" },
    ],
  },
  preview: {
    eyebrow: "Lab 钱包 · 预览",
    badge: "无需 MetaMask",
    steps: [
      { n: "1", title: "生产", hint: "铸造 akWh · /lab" },
      { n: "2", title: "转换", hint: "Wrap → WATT · /producer" },
      { n: "3", title: "出售", hint: "现货结算 · /trade" },
    ],
    cta: "在 Energy Lab 开始 →",
  },
  neighbors: {
    afterLab: {
      primary: { href: "/producer", label: "下一步 · 在 Producer 上 Wrap" },
      secondary: [{ href: "/resource-layer", label: "愿景", hint: "为何选择 ARL" }],
      neighbors: [
        { href: "/watt", label: "WATT" },
        { href: "/builders", label: "Builders" },
        { href: "/trade", label: "Trade" },
      ],
    },
    afterProducer: {
      primary: { href: "/trade?market=kwh-france&side=sell", label: "下一步 · 在 Trade 出售" },
      secondary: [{ href: "/watt", label: "WATT 单位" }],
      neighbors: [
        { href: "/lab", label: "Lab" },
        { href: "/earn", label: "Earn" },
        { href: "/market", label: "Market" },
      ],
    },
    afterTrade: {
      primary: { href: "/agent", label: "可选 · 代理对冲" },
      secondary: [{ href: "/earn", label: "Earn 预览" }],
      neighbors: [
        { href: "/market", label: "Market" },
        { href: "/builders", label: "Builders" },
        { href: "/status", label: "Status" },
      ],
    },
    afterAgent: {
      primary: { href: "/trade", label: "返回 Trade" },
      secondary: [{ href: "/builders", label: "Agent API 路径" }],
      neighbors: [
        { href: "/producer", label: "Producer" },
        { href: "/market", label: "Market" },
        { href: "/investors", label: "投资者" },
      ],
    },
    afterCompare: {
      primary: { href: "/start", label: "开始我的档案（约 4 分钟）" },
      secondary: [
        { href: "/green", label: "Green 路径", hint: "水与能源" },
        { href: "/green/csrd-check", label: "CSRD 检测" },
      ],
      neighbors: [],
    },
    company: {
      primary: { href: "/lab", label: "运行 Lab 闭环" },
      secondary: [
        {
          href: "mailto:resources@getauros.com?subject=AUROS%20diligence",
          label: "联系我们",
        },
      ],
      neighbors: [
        { href: "/investors", label: "投资者" },
        { href: "/compare", label: "RWA 对比器" },
        { href: "/press", label: "媒体" },
        { href: "/careers", label: "招聘" },
        { href: "/status", label: "Status" },
        { href: "/why", label: "为何" },
      ],
    },
    vision: {
      primary: { href: "/lab", label: "打开 Energy Lab" },
      secondary: [{ href: "/builders", label: "Builders" }],
      neighbors: [
        { href: "/why", label: "为何" },
        { href: "/compare", label: "RWA 对比器" },
        { href: "/watt", label: "WATT" },
        { href: "/investors", label: "投资者" },
      ],
    },
  },
};

const CATALOG = localeCatalog({ fr: FR, en: EN, es: ES, ar: AR, zh: ZH });

export function getArlUi(locale: Locale): ArlUiCopy {
  return CATALOG[locale] ?? CATALOG.fr;
}

export type EcosystemPreset = keyof ArlUiCopy["neighbors"];

export function getEcosystemPreset(locale: Locale, key: EcosystemPreset) {
  return getArlUi(locale).neighbors[key];
}
