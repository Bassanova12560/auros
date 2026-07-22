import type { Locale } from "@/lib/i18n";

export type NavHubItem = {
  href: string;
  title: string;
  description: string;
};

export type NavHubGroup = {
  id: "dossier" | "energy" | "protocol" | "ecosystem";
  label: string;
  blurb: string;
  items: NavHubItem[];
};

type HubCopy = {
  groups: NavHubGroup[];
  exploreAll: string;
  close: string;
  openMenu: string;
  primaryCta: string;
  secondaryCta: string;
};

const FR: HubCopy = {
  exploreAll: "Voir tout le hub",
  close: "Fermer",
  openMenu: "Menu AUROS",
  primaryCta: "Créer mon dossier",
  secondaryCta: "Essayer Shield",
  groups: [
    {
      id: "dossier",
      label: "Dossier RWA",
      blurb: "Préparer un actif sans être expert",
      items: [
        {
          href: "/start",
          title: "Commencer en 4 min",
          description: "Express, score ou Shield — une porte",
        },
        {
          href: "/wizard?expert=1",
          title: "Wizard tokenisation",
          description: "Data room, admission, studio",
        },
        {
          href: "/estimate",
          title: "Score rapide",
          description: "Une phrase · résultat immédiat",
        },
        {
          href: "/dashboard",
          title: "Mes dossiers",
          description: "Reprise, PDF, suivi",
        },
        {
          href: "/jurisdictions?from=nav",
          title: "Juridictions",
          description: "Cadre indicatif MiCA / UK / US",
        },
      ],
    },
    {
      id: "energy",
      label: "Énergie",
      blurb: "Green Verified · Power · eau · flottes",
      items: [
        {
          href: "/green",
          title: "AUROS Green",
          description: "Énergie locale & label Verified",
        },
        {
          href: "/resource-layer",
          title: "Resource Layer",
          description: "Tokeniser kWh · liquidité · agents",
        },
        {
          href: "/builders",
          title: "Builders ARL",
          description: "Architecture · repo · testnet",
        },
        {
          href: "/lab",
          title: "Energy Lab",
          description: "Simuler mint → revenu producteur",
        },
        {
          href: "/power",
          title: "Power (bas-carbone)",
          description: "Nucléaire & low-carbon — hors Green Verified",
        },
        {
          href: "/eau",
          title: "Eau / H₂O",
          description: "Infrastructure eau & passeport",
        },
        {
          href: "/green/chargeflow/console",
          title: "ChargeFlow CFU",
          description: "Unités E/W/F + Shield",
        },
        {
          href: "/green/api",
          title: "Green API",
          description: "Watt, CQS, Premium data",
        },
      ],
    },
    {
      id: "protocol",
      label: "Protocol & preuves",
      blurb: "Banques, API, contreparties",
      items: [
        {
          href: "/developers/shield",
          title: "AUROS Shield",
          description: "Collez → preuve · Evidence Pack",
        },
        {
          href: "/developers/institutions",
          title: "Institutions",
          description: "Export CFU, Monitor, Watts",
        },
        {
          href: "/developers",
          title: "Hub développeurs",
          description: "OpenAPI, clés, Monitor",
        },
        {
          href: "/copilot",
          title: "Copilot",
          description: "Assistant dossier / conformité",
        },
        {
          href: "/auros-openapi.yaml",
          title: "OpenAPI",
          description: "Spécification Protocol",
        },
      ],
    },
    {
      id: "ecosystem",
      label: "Écosystème",
      blurb: "Plateformes, formation, ressources",
      items: [
        {
          href: "/partners",
          title: "Plateformes & partenaires",
          description: "Issuer pipeline · dashboard",
        },
        {
          href: "/pilots",
          title: "Pilotes 30 jours",
          description: "Flotte · banque · plateforme",
        },
        {
          href: "/academy",
          title: "Academy",
          description: "Formation tokenisation",
        },
        {
          href: "/pricing",
          title: "Tarifs",
          description: "Green API · Monitor · packs",
        },
        {
          href: "/discover",
          title: "Découvrir",
          description: "Cartographie produit",
        },
        {
          href: "/liquidity",
          title: "Liquidity Bridge",
          description: "Liste d’attente (après issuer)",
        },
      ],
    },
  ],
};

const EN: HubCopy = {
  exploreAll: "Browse full hub",
  close: "Close",
  openMenu: "AUROS menu",
  primaryCta: "Create my dossier",
  secondaryCta: "Try Shield",
  groups: [
    {
      id: "dossier",
      label: "RWA dossier",
      blurb: "Prepare an asset without being an expert",
      items: [
        {
          href: "/start",
          title: "Start in 4 min",
          description: "Express, score or Shield — one door",
        },
        {
          href: "/wizard?expert=1",
          title: "Tokenization wizard",
          description: "Data room, admission, studio",
        },
        {
          href: "/estimate",
          title: "Quick score",
          description: "One sentence · instant result",
        },
        {
          href: "/dashboard",
          title: "My dossiers",
          description: "Resume, PDF, tracking",
        },
        {
          href: "/jurisdictions?from=nav",
          title: "Jurisdictions",
          description: "Indicative MiCA / UK / US frame",
        },
      ],
    },
    {
      id: "energy",
      label: "Energy",
      blurb: "Green Verified · Power · water · fleets",
      items: [
        {
          href: "/green",
          title: "AUROS Green",
          description: "Local energy & Verified label",
        },
        {
          href: "/resource-layer",
          title: "Resource Layer",
          description: "Tokenize kWh · liquidity · agents",
        },
        {
          href: "/builders",
          title: "ARL Builders",
          description: "Architecture · repo · testnet",
        },
        {
          href: "/lab",
          title: "Energy Lab",
          description: "Simulate mint → producer revenue",
        },
        {
          href: "/power",
          title: "Power (low-carbon)",
          description: "Nuclear & low-carbon — not Green Verified",
        },
        {
          href: "/eau",
          title: "Water / H₂O",
          description: "Water infrastructure & passport",
        },
        {
          href: "/green/chargeflow/console",
          title: "ChargeFlow CFU",
          description: "E/W/F units + Shield",
        },
        {
          href: "/green/api",
          title: "Green API",
          description: "Watt, CQS, Premium data",
        },
      ],
    },
    {
      id: "protocol",
      label: "Protocol & proofs",
      blurb: "Banks, APIs, counterparties",
      items: [
        {
          href: "/developers/shield",
          title: "AUROS Shield",
          description: "Paste → proof · Evidence Pack",
        },
        {
          href: "/developers/institutions",
          title: "Institutions",
          description: "CFU export, Monitor, Watts",
        },
        {
          href: "/developers",
          title: "Developers hub",
          description: "OpenAPI, keys, Monitor",
        },
        {
          href: "/copilot",
          title: "Copilot",
          description: "Dossier / compliance assistant",
        },
        {
          href: "/auros-openapi.yaml",
          title: "OpenAPI",
          description: "Protocol specification",
        },
      ],
    },
    {
      id: "ecosystem",
      label: "Ecosystem",
      blurb: "Platforms, training, resources",
      items: [
        {
          href: "/partners",
          title: "Platforms & partners",
          description: "Issuer pipeline · dashboard",
        },
        {
          href: "/pilots",
          title: "30-day pilots",
          description: "Fleet · bank · platform",
        },
        {
          href: "/academy",
          title: "Academy",
          description: "Tokenization training",
        },
        {
          href: "/pricing",
          title: "Pricing",
          description: "Green API · Monitor · packs",
        },
        {
          href: "/discover",
          title: "Discover",
          description: "Product map",
        },
        {
          href: "/liquidity",
          title: "Liquidity Bridge",
          description: "Waitlist (after issuer)",
        },
      ],
    },
  ],
};

const ES: HubCopy = {
  exploreAll: "Ver todo el hub",
  close: "Cerrar",
  openMenu: "Menú AUROS",
  primaryCta: "Crear mi expediente",
  secondaryCta: "Probar Shield",
  groups: [
    {
      id: "dossier",
      label: "Expediente RWA",
      blurb: "Preparar un activo sin ser experto",
      items: [
        {
          href: "/start",
          title: "Empezar en 4 min",
          description: "Express, score o Shield — una puerta",
        },
        {
          href: "/wizard?expert=1",
          title: "Wizard de tokenización",
          description: "Data room, admisión, estudio",
        },
        {
          href: "/estimate",
          title: "Score rápido",
          description: "Una frase · resultado al instante",
        },
        {
          href: "/dashboard",
          title: "Mis expedientes",
          description: "Reanudación, PDF, seguimiento",
        },
        {
          href: "/jurisdictions?from=nav",
          title: "Jurisdicciones",
          description: "Marco indicativo MiCA / UK / US",
        },
      ],
    },
    {
      id: "energy",
      label: "Energía",
      blurb: "Green Verified · Power · agua · flotas",
      items: [
        {
          href: "/green",
          title: "AUROS Green",
          description: "Energía local y label Verified",
        },
        {
          href: "/resource-layer",
          title: "Resource Layer",
          description: "Tokenizar kWh · liquidez · agentes",
        },
        {
          href: "/builders",
          title: "Builders ARL",
          description: "Arquitectura · repo · testnet",
        },
        {
          href: "/lab",
          title: "Energy Lab",
          description: "Simular mint → ingreso productor",
        },
        {
          href: "/power",
          title: "Power (bajo carbono)",
          description: "Nuclear y low-carbon — fuera de Green Verified",
        },
        {
          href: "/eau",
          title: "Agua / H₂O",
          description: "Infraestructura agua y pasaporte",
        },
        {
          href: "/green/chargeflow/console",
          title: "ChargeFlow CFU",
          description: "Unidades E/W/F + Shield",
        },
        {
          href: "/green/api",
          title: "Green API",
          description: "Watt, CQS, datos Premium",
        },
      ],
    },
    {
      id: "protocol",
      label: "Protocol y pruebas",
      blurb: "Bancos, API, contrapartes",
      items: [
        {
          href: "/developers/shield",
          title: "AUROS Shield",
          description: "Pegar → prueba · Evidence Pack",
        },
        {
          href: "/developers/institutions",
          title: "Instituciones",
          description: "Export CFU, Monitor, Watts",
        },
        {
          href: "/developers",
          title: "Hub desarrolladores",
          description: "OpenAPI, claves, Monitor",
        },
        {
          href: "/copilot",
          title: "Copilot",
          description: "Asistente expediente / compliance",
        },
        {
          href: "/auros-openapi.yaml",
          title: "OpenAPI",
          description: "Especificación Protocol",
        },
      ],
    },
    {
      id: "ecosystem",
      label: "Ecosistema",
      blurb: "Plataformas, formación, recursos",
      items: [
        {
          href: "/partners",
          title: "Plataformas y partners",
          description: "Issuer pipeline · dashboard",
        },
        {
          href: "/pilots",
          title: "Pilotos 30 días",
          description: "Flota · banco · plataforma",
        },
        {
          href: "/academy",
          title: "Academy",
          description: "Formación tokenización",
        },
        {
          href: "/pricing",
          title: "Precios",
          description: "Green API · Monitor · packs",
        },
        {
          href: "/discover",
          title: "Descubrir",
          description: "Mapa de producto",
        },
        {
          href: "/liquidity",
          title: "Liquidity Bridge",
          description: "Lista de espera (después issuer)",
        },
      ],
    },
  ],
};

const AR: HubCopy = {
  exploreAll: "عرض كامل المركز",
  close: "إغلاق",
  openMenu: "قائمة AUROS",
  primaryCta: "إنشاء ملفي",
  secondaryCta: "تجربة Shield",
  groups: [
    {
      id: "dossier",
      label: "ملف RWA",
      blurb: "جهّز أصلاً دون أن تكون خبيراً",
      items: [
        {
          href: "/start",
          title: "ابدأ في 4 دقائق",
          description: "Express أو نتيجة أو Shield — باب واحد",
        },
        {
          href: "/wizard?expert=1",
          title: "معالج التوكنة",
          description: "غرفة بيانات، قبول، استوديو",
        },
        {
          href: "/estimate",
          title: "نتيجة سريعة",
          description: "جملة واحدة · نتيجة فورية",
        },
        {
          href: "/dashboard",
          title: "ملفاتي",
          description: "استئناف، PDF، متابعة",
        },
        {
          href: "/jurisdictions?from=nav",
          title: "الاختصاصات",
          description: "إطار إرشادي MiCA / UK / US",
        },
      ],
    },
    {
      id: "energy",
      label: "الطاقة",
      blurb: "Green Verified · Power · ماء · أساطيل",
      items: [
        {
          href: "/green",
          title: "AUROS Green",
          description: "طاقة محلية وتسمية Verified",
        },
        {
          href: "/resource-layer",
          title: "Resource Layer",
          description: "ترميز kWh · سيولة · وكلاء",
        },
        {
          href: "/builders",
          title: "Builders ARL",
          description: "هندسة · مستودع · testnet",
        },
        {
          href: "/lab",
          title: "Energy Lab",
          description: "محاكاة mint → إيراد المنتج",
        },
        {
          href: "/power",
          title: "Power (منخفض الكربون)",
          description: "نووي ومنخفض الكربون — خارج Green Verified",
        },
        {
          href: "/eau",
          title: "ماء / H₂O",
          description: "بنية مائية وجواز سفر",
        },
        {
          href: "/green/chargeflow/console",
          title: "ChargeFlow CFU",
          description: "وحدات E/W/F + Shield",
        },
        {
          href: "/green/api",
          title: "Green API",
          description: "Watt، CQS، بيانات Premium",
        },
      ],
    },
    {
      id: "protocol",
      label: "البروتوكول والإثباتات",
      blurb: "بنوك، واجهات API، أطراف مقابلة",
      items: [
        {
          href: "/developers/shield",
          title: "AUROS Shield",
          description: "الصق → إثبات · Evidence Pack",
        },
        {
          href: "/developers/institutions",
          title: "المؤسسات",
          description: "تصدير CFU، Monitor، Watts",
        },
        {
          href: "/developers",
          title: "مركز المطوّرين",
          description: "OpenAPI، مفاتيح، Monitor",
        },
        {
          href: "/copilot",
          title: "Copilot",
          description: "مساعد ملف / امتثال",
        },
        {
          href: "/auros-openapi.yaml",
          title: "OpenAPI",
          description: "مواصفة البروتوكول",
        },
      ],
    },
    {
      id: "ecosystem",
      label: "النظام البيئي",
      blurb: "منصات، تدريب، موارد",
      items: [
        {
          href: "/partners",
          title: "المنصات والشركاء",
          description: "مسار المصدر · لوحة التحكم",
        },
        {
          href: "/pilots",
          title: "تجارب 30 يوماً",
          description: "أسطول · بنك · منصة",
        },
        {
          href: "/academy",
          title: "الأكاديمية",
          description: "تدريب على التوكنة",
        },
        {
          href: "/pricing",
          title: "الأسعار",
          description: "Green API · Monitor · حزم",
        },
        {
          href: "/discover",
          title: "اكتشف",
          description: "خريطة المنتج",
        },
        {
          href: "/liquidity",
          title: "Liquidity Bridge",
          description: "قائمة انتظار (بعد المصدر)",
        },
      ],
    },
  ],
};

const ZH: HubCopy = {
  exploreAll: "浏览完整中心",
  close: "关闭",
  openMenu: "AUROS 菜单",
  primaryCta: "创建我的档案",
  secondaryCta: "试用 Shield",
  groups: [
    {
      id: "dossier",
      label: "RWA 档案",
      blurb: "无需成为专家即可准备资产",
      items: [
        {
          href: "/start",
          title: "4 分钟开始",
          description: "Express、评分或 Shield — 一扇门",
        },
        {
          href: "/wizard?expert=1",
          title: "通证化向导",
          description: "资料室、准入、工作室",
        },
        {
          href: "/estimate",
          title: "快速评分",
          description: "一句话 · 即时结果",
        },
        {
          href: "/dashboard",
          title: "我的档案",
          description: "恢复、PDF、跟踪",
        },
        {
          href: "/jurisdictions?from=nav",
          title: "司法辖区",
          description: "参考 MiCA / UK / US 框架",
        },
      ],
    },
    {
      id: "energy",
      label: "能源",
      blurb: "Green Verified · Power · 水 · 车队",
      items: [
        {
          href: "/green",
          title: "AUROS Green",
          description: "本地能源与 Verified 标签",
        },
        {
          href: "/resource-layer",
          title: "Resource Layer",
          description: "代币化 kWh · 流动性 · 代理",
        },
        {
          href: "/builders",
          title: "ARL Builders",
          description: "架构 · 仓库 · testnet",
        },
        {
          href: "/lab",
          title: "Energy Lab",
          description: "模拟 mint → 生产商收入",
        },
        {
          href: "/power",
          title: "Power（低碳）",
          description: "核电与低碳 — 不属于 Green Verified",
        },
        {
          href: "/eau",
          title: "水 / H₂O",
          description: "水基础设施与护照",
        },
        {
          href: "/green/chargeflow/console",
          title: "ChargeFlow CFU",
          description: "E/W/F 单位 + Shield",
        },
        {
          href: "/green/api",
          title: "Green API",
          description: "Watt、CQS、Premium 数据",
        },
      ],
    },
    {
      id: "protocol",
      label: "协议与证明",
      blurb: "银行、API、对手方",
      items: [
        {
          href: "/developers/shield",
          title: "AUROS Shield",
          description: "粘贴 → 证明 · Evidence Pack",
        },
        {
          href: "/developers/institutions",
          title: "机构",
          description: "CFU 导出、Monitor、Watts",
        },
        {
          href: "/developers",
          title: "开发者中心",
          description: "OpenAPI、密钥、Monitor",
        },
        {
          href: "/copilot",
          title: "Copilot",
          description: "档案 / 合规助手",
        },
        {
          href: "/auros-openapi.yaml",
          title: "OpenAPI",
          description: "协议规范",
        },
      ],
    },
    {
      id: "ecosystem",
      label: "生态",
      blurb: "平台、培训、资源",
      items: [
        {
          href: "/partners",
          title: "平台与合作伙伴",
          description: "发行人管道 · 仪表盘",
        },
        {
          href: "/pilots",
          title: "30 天试点",
          description: "车队 · 银行 · 平台",
        },
        {
          href: "/academy",
          title: "学院",
          description: "通证化培训",
        },
        {
          href: "/pricing",
          title: "价格",
          description: "Green API · Monitor · 套餐",
        },
        {
          href: "/discover",
          title: "发现",
          description: "产品地图",
        },
        {
          href: "/liquidity",
          title: "Liquidity Bridge",
          description: "候补名单（发行人之后）",
        },
      ],
    },
  ],
};

export function getNavHub(locale: Locale): HubCopy {
  if (locale === "en") return EN;
  if (locale === "es") return ES;
  if (locale === "ar") return AR;
  if (locale === "zh") return ZH;
  return FR;
}
