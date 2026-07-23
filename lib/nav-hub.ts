import type { Locale } from "@/lib/i18n";

export type NavHubItem = {
  href: string;
  title: string;
  description: string;
};

export type NavHubGroup = {
  id: "dossier" | "energy" | "protocol" | "ecosystem" | "company";
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
  primaryCta: "Ouvrir Energy Lab",
  secondaryCta: "Créer mon dossier",
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
      blurb: "ARL · Green · producteurs · marché",
      items: [
        {
          href: "/resource-layer",
          title: "Resource Layer",
          description: "Tokeniser kWh · liquidité · agents",
        },
        {
          href: "/lab",
          title: "Energy Lab",
          description: "Simuler mint → revenu producteur",
        },
        {
          href: "/producer",
          title: "Producer",
          description: "Mint · wrap WATT · console",
        },
        {
          href: "/trade",
          title: "Trade",
          description: "Spot · perps · options (lab)",
        },
        {
          href: "/agent",
          title: "Agent",
          description: "Console agents / data centers",
        },
        {
          href: "/market",
          title: "Market",
          description: "Marketplace ressources (démo)",
        },
        {
          href: "/builders",
          title: "Builders ARL",
          description: "Architecture · repo · testnet",
        },
        {
          href: "/watt",
          title: "WATT",
          description: "Energy unit of account (lab)",
        },
        {
          href: "/earn",
          title: "Earn",
          description: "LP / capital preview",
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
    {
      id: "company",
      label: "Entreprise",
      blurb: "Pourquoi AUROS · investisseurs · presse",
      items: [
        {
          href: "/why",
          title: "Pourquoi AUROS",
          description: "Bénéfice d’abord — liquidité ressources",
        },
        {
          href: "/about",
          title: "À propos",
          description: "Mission et posture",
        },
        {
          href: "/investors",
          title: "Investisseurs",
          description: "Desk diligence — sans claims inventés",
        },
        {
          href: "/press",
          title: "Presse",
          description: "Kit média minimal",
        },
        {
          href: "/careers",
          title: "Carrières",
          description: "Rôles ouverts ARL",
        },
        {
          href: "/status",
          title: "Status",
          description: "Sondes protocol & lab",
        },
        {
          href: "/blog",
          title: "Blog",
          description: "Guides tokenisation RWA",
        },
      ],
    },
  ],
};

const EN: HubCopy = {
  exploreAll: "Browse full hub",
  close: "Close",
  openMenu: "AUROS menu",
  primaryCta: "Open Energy Lab",
  secondaryCta: "Create dossier",
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
      blurb: "ARL · Green · producers · market",
      items: [
        {
          href: "/resource-layer",
          title: "Resource Layer",
          description: "Tokenize kWh · liquidity · agents",
        },
        {
          href: "/lab",
          title: "Energy Lab",
          description: "Simulate mint → producer revenue",
        },
        {
          href: "/producer",
          title: "Producer",
          description: "Mint · wrap WATT · console",
        },
        {
          href: "/trade",
          title: "Trade",
          description: "Spot · perps · options (lab)",
        },
        {
          href: "/agent",
          title: "Agent",
          description: "AI / data-center agent console",
        },
        {
          href: "/market",
          title: "Market",
          description: "Resource marketplace (demo)",
        },
        {
          href: "/builders",
          title: "ARL Builders",
          description: "Architecture · repo · testnet",
        },
        {
          href: "/watt",
          title: "WATT",
          description: "Energy unit of account (lab)",
        },
        {
          href: "/earn",
          title: "Earn",
          description: "LP / capital preview",
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
    {
      id: "company",
      label: "Company",
      blurb: "Why AUROS · investors · press",
      items: [
        {
          href: "/why",
          title: "Why AUROS",
          description: "Benefit-first — resource liquidity",
        },
        {
          href: "/about",
          title: "About",
          description: "Mission and posture",
        },
        {
          href: "/investors",
          title: "Investors",
          description: "Diligence desk — no invented claims",
        },
        {
          href: "/press",
          title: "Press",
          description: "Minimal media kit",
        },
        {
          href: "/careers",
          title: "Careers",
          description: "Open ARL roles",
        },
        {
          href: "/status",
          title: "Status",
          description: "Protocol & lab probes",
        },
        {
          href: "/blog",
          title: "Blog",
          description: "RWA tokenization guides",
        },
      ],
    },
  ],
};

const ES: HubCopy = {
  exploreAll: "Ver todo el hub",
  close: "Cerrar",
  openMenu: "Menú AUROS",
  primaryCta: "Abrir Energy Lab",
  secondaryCta: "Crear expediente",
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
      blurb: "ARL · Green · productores · mercado",
      items: [
        {
          href: "/resource-layer",
          title: "Resource Layer",
          description: "Tokenizar kWh · liquidez · agentes",
        },
        {
          href: "/lab",
          title: "Energy Lab",
          description: "Simular mint → ingreso productor",
        },
        {
          href: "/producer",
          title: "Producer",
          description: "Mint · wrap WATT · consola",
        },
        {
          href: "/trade",
          title: "Trade",
          description: "Spot · perps · opciones (lab)",
        },
        {
          href: "/agent",
          title: "Agent",
          description: "Consola agentes / data centers",
        },
        {
          href: "/market",
          title: "Market",
          description: "Marketplace de recursos (demo)",
        },
        {
          href: "/builders",
          title: "Builders ARL",
          description: "Arquitectura · repo · testnet",
        },
        {
          href: "/watt",
          title: "WATT",
          description: "Energy unit of account (lab)",
        },
        {
          href: "/earn",
          title: "Earn",
          description: "LP / capital preview",
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
    {
      id: "company",
      label: "Empresa",
      blurb: "Por qué AUROS · inversores · prensa",
      items: [
        {
          href: "/why",
          title: "Por qué AUROS",
          description: "Beneficio primero — liquidez de recursos",
        },
        {
          href: "/about",
          title: "Acerca de",
          description: "Misión y postura",
        },
        {
          href: "/investors",
          title: "Inversores",
          description: "Desk de diligencia — sin claims inventados",
        },
        {
          href: "/press",
          title: "Prensa",
          description: "Kit de medios mínimo",
        },
        {
          href: "/careers",
          title: "Carreras",
          description: "Roles abiertos ARL",
        },
        {
          href: "/status",
          title: "Status",
          description: "Sondas de protocol y lab",
        },
        {
          href: "/blog",
          title: "Blog",
          description: "Guías de tokenización RWA",
        },
      ],
    },
  ],
};

const AR: HubCopy = {
  exploreAll: "عرض كامل المركز",
  close: "إغلاق",
  openMenu: "قائمة AUROS",
  primaryCta: "Energy Lab",
  secondaryCta: "إنشاء ملفي",
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
      blurb: "ARL · Green · منتجون · سوق",
      items: [
        {
          href: "/resource-layer",
          title: "Resource Layer",
          description: "ترميز kWh · سيولة · وكلاء",
        },
        {
          href: "/lab",
          title: "Energy Lab",
          description: "محاكاة mint → إيراد المنتج",
        },
        {
          href: "/producer",
          title: "Producer",
          description: "Mint · wrap WATT · لوحة",
        },
        {
          href: "/trade",
          title: "Trade",
          description: "Spot · perps · خيارات (lab)",
        },
        {
          href: "/agent",
          title: "Agent",
          description: "لوحة وكلاء / مراكز بيانات",
        },
        {
          href: "/market",
          title: "Market",
          description: "سوق الموارد (تجريبي)",
        },
        {
          href: "/builders",
          title: "Builders ARL",
          description: "هندسة · مستودع · testnet",
        },
        {
          href: "/watt",
          title: "WATT",
          description: "Energy unit of account (lab)",
        },
        {
          href: "/earn",
          title: "Earn",
          description: "LP / capital preview",
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
    {
      id: "company",
      label: "الشركة",
      blurb: "لماذا AUROS · مستثمرون · صحافة",
      items: [
        {
          href: "/why",
          title: "لماذا AUROS",
          description: "الفائدة أولاً — سيولة الموارد",
        },
        {
          href: "/about",
          title: "من نحن",
          description: "المهمة والموقف",
        },
        {
          href: "/investors",
          title: "المستثمرون",
          description: "مكتب العناية — بلا ادعاءات مختلقة",
        },
        {
          href: "/press",
          title: "الصحافة",
          description: "حقيبة إعلامية بسيطة",
        },
        {
          href: "/careers",
          title: "الوظائف",
          description: "أدوار ARL مفتوحة",
        },
        {
          href: "/status",
          title: "Status",
          description: "فحوصات البروتوكول والمختبر",
        },
        {
          href: "/blog",
          title: "المدونة",
          description: "أدلة توكنة RWA",
        },
      ],
    },
  ],
};

const ZH: HubCopy = {
  exploreAll: "浏览完整中心",
  close: "关闭",
  openMenu: "AUROS 菜单",
  primaryCta: "打开 Energy Lab",
  secondaryCta: "创建档案",
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
      blurb: "ARL · Green · 生产商 · 市场",
      items: [
        {
          href: "/resource-layer",
          title: "Resource Layer",
          description: "代币化 kWh · 流动性 · 代理",
        },
        {
          href: "/lab",
          title: "Energy Lab",
          description: "模拟 mint → 生产商收入",
        },
        {
          href: "/producer",
          title: "Producer",
          description: "Mint · wrap WATT · 控制台",
        },
        {
          href: "/trade",
          title: "Trade",
          description: "Spot · perps · 期权（lab）",
        },
        {
          href: "/agent",
          title: "Agent",
          description: "AI / 数据中心代理控制台",
        },
        {
          href: "/market",
          title: "Market",
          description: "资源市场（演示）",
        },
        {
          href: "/builders",
          title: "ARL Builders",
          description: "架构 · 仓库 · testnet",
        },
        {
          href: "/watt",
          title: "WATT",
          description: "Energy unit of account (lab)",
        },
        {
          href: "/earn",
          title: "Earn",
          description: "LP / capital preview",
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
    {
      id: "company",
      label: "公司",
      blurb: "为何 AUROS · 投资者 · 媒体",
      items: [
        {
          href: "/why",
          title: "为何 AUROS",
          description: "收益优先 — 资源流动性",
        },
        {
          href: "/about",
          title: "关于",
          description: "使命与立场",
        },
        {
          href: "/investors",
          title: "投资者",
          description: "尽职调查台 — 无虚构主张",
        },
        {
          href: "/press",
          title: "媒体",
          description: "精简媒体包",
        },
        {
          href: "/careers",
          title: "招聘",
          description: "ARL 开放岗位",
        },
        {
          href: "/status",
          title: "Status",
          description: "协议与实验室探针",
        },
        {
          href: "/blog",
          title: "博客",
          description: "RWA 通证化指南",
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
