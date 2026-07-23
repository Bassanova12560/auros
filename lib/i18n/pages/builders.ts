import { localeCatalog, type Locale } from "@/lib/i18n";

export type BuildersStackRow = { layer: string; items: string };

export type BuildersBadgeMessages = {
  eyebrow: string;
  intro: string;
  claimedTitle: string;
  nextEmail: string;
  nextLabBefore: string;
  nextLabAfter: string;
  nextGithub: string;
  registerWaitlist: string;
  handleLabel: string;
  handlePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailInvalid: string;
  walletLabel: string;
  walletPlaceholder: string;
  walletInvalid: string;
  errorHandle: string;
  errorEmail: string;
  errorWallet: string;
  claimBtn: string;
  preview: string;
  linkedWallet: string;
  labAccount: string;
  openLab: string;
};

export type BuildersMessages = {
  product: string;
  eyebrow: string;
  title: string;
  intro: string;
  ctaTestnet: string;
  ctaRepo: string;
  ctaLab: string;
  ctaTrade: string;
  ctaStatus: string;
  demoTitle: string;
  demoIntro: string;
  demoLab: string;
  demoProducer: string;
  demoTradeBefore: string;
  demoTradeOr: string;
  demoTradeAfter: string;
  demoLiveChecks: string;
  demoCaps: string;
  motionTitle: string;
  motionBody: string;
  archTitle: string;
  archBody: string;
  stack: readonly BuildersStackRow[];
  sourceTitle: string;
  securityEyebrow: string;
  securityBodyBefore: string;
  securityStrong: string;
  securityBodyAfter: string;
  securityRead: string;
  repoNote: string;
  linkVision: string;
  linkWatt: string;
  linkLab: string;
  linkStatus: string;
  linkWhitepaper: string;
  nodeTitle: string;
  nodeIntro: string;
  nodeAccessNote: string;
  economyTitle: string;
  economyBody: string;
  badgeSectionTitle: string;
  accessTitle: string;
  accessBody: string;
  accessCta: string;
  accessFooter: string;
  badge: BuildersBadgeMessages;
};

const BADGE_EN: BuildersBadgeMessages = {
  eyebrow: "Early Resource Builder · lab badge",
  intro:
    "Claim a local builder code now. On-chain NFT mint is a later testnet step — this is not a Verified certificate and has no financial value.",
  claimedTitle: "Claimed · next steps",
  nextEmail: "Email your code to the waitlist (button below)",
  nextLabBefore: "Open",
  nextLabAfter: "and mint into your lab wallet",
  nextGithub: "Read protocol notes on GitHub after access approval",
  registerWaitlist: "Register code for waitlist →",
  handleLabel: "GitHub / handle",
  handlePlaceholder: "your-handle",
  emailLabel: "Email (optional)",
  emailPlaceholder: "you@company.com",
  emailInvalid: "Enter a valid email (name@domain.tld)",
  walletLabel: "Ethereum address (optional · testnet rewards)",
  walletPlaceholder: "0x…",
  walletInvalid: "Wallet must be 0x + 40 hex characters",
  errorHandle: "Handle must be at least 2 characters",
  errorEmail: "Email format invalid — use name@domain.tld",
  errorWallet: "Optional wallet must be a 0x… address (40 hex chars)",
  claimBtn: "Claim lab badge",
  preview: "Preview",
  linkedWallet: "Linked lab wallet",
  labAccount: "Lab account",
  openLab: "open /lab",
};

const EN: BuildersMessages = {
  product: "Resource Layer",
  eyebrow: "Builders",
  title: "Explore the protocol",
  intro:
    "Architecture, motion proof, source, and early access — for engineers who need substance before a pitch deck.",
  ctaTestnet: "Request testnet access",
  ctaRepo: "Open repository",
  ctaLab: "Energy Lab",
  ctaTrade: "Open trade terminal",
  ctaStatus: "System status",
  demoTitle: "5-minute site demo",
  demoIntro: "No clone required. Run the labeled loop on getauros.com — same lab ledger across pages.",
  demoLab: "— mint akWh into your browser lab wallet",
  demoProducer: "— wrap akWh → WATT 1:1",
  demoTradeBefore: "— settle spot (or",
  demoTradeOr: "for a lab hedge buy)",
  demoTradeAfter: "",
  demoLiveChecks: "Live checks:",
  demoCaps: "caps & HITL on paid paths",
  motionTitle: "Product in motion",
  motionBody:
    "No staged partnership video — a live loop of the path your code will implement: meter → mint → agent order → labeled fill.",
  archTitle: "Architecture",
  archBody:
    "One path from meter to market. Settlement and paid paths stay human-gated; demos never wear Verified badges.",
  stack: [
    { layer: "Devices", items: "Meters · inverters · OEM firmware" },
    { layer: "IoT bridge", items: "MQTT → ECDSA Proof-of-Resource → oracle mint" },
    {
      layer: "Protocol",
      items: "ResourceToken · Oracle · EnergyFutures · Options · Lending · Insurance",
    },
    {
      layer: "Agent API",
      items:
        "Spot / forward / perps / options · rate-limited · operator-keyed (agent-api). Site lab wallet is open demo with IP rate limits.",
    },
    {
      layer: "Surfaces",
      items: "/trade · /producer · /agent · /market · /lab (demos labeled)",
    },
  ],
  sourceTitle: "Read the source",
  securityEyebrow: "Security posture",
  securityBodyBefore: "Hardhat suites + caps/circuit-breakers shipped in-repo.",
  securityStrong: "No third-party audit badge claimed",
  securityBodyAfter: "— external audit is on the roadmap before mainnet collateral. Read",
  securityRead: "ARL-SECURITY.md",
  repoNote: "— monorepo (protocol / agent-api / iot-bridge / app)",
  linkVision: "Vision",
  linkWatt: "WATT",
  linkLab: "Energy Lab",
  linkStatus: "Status",
  linkWhitepaper: "Whitepaper",
  nodeTitle: "Run a Resource Node (preview)",
  nodeIntro:
    "Commands below match the public monorepo layout. MQTT credentials and production keys ship after testnet approval (HITL).",
  nodeAccessNote: "Access granted after testnet approval · no silent mainnet keys",
  economyTitle: "Machine economy — concrete",
  economyBody:
    "Imagine an EV or a rack of GPUs buying kWh automatically overnight via the agent API: forecast load → forward order → oracle-backed settlement when meters clear — humans still approve paid and compliance-sensitive steps.",
  badgeSectionTitle: "Early Builder badge",
  accessTitle: "Request access",
  accessBody:
    "Tell us who you are (producer, OEM, agent builder, researcher), which stack you already run, and whether you need MQTT credentials, a Hardhat fork, or API keys.",
  accessCta: "Apply for testnet access",
  accessFooter: "resources@getauros.com · HITL review · no fake volume",
  badge: BADGE_EN,
};

const BADGE_FR: BuildersBadgeMessages = {
  eyebrow: "Early Resource Builder · badge lab",
  intro:
    "Réclamez un code builder local maintenant. Le mint NFT on-chain est une étape testnet ultérieure — ce n’est pas un certificat Verified et n’a aucune valeur financière.",
  claimedTitle: "Réclamé · prochaines étapes",
  nextEmail: "Envoyez votre code à la waitlist (bouton ci-dessous)",
  nextLabBefore: "Ouvrez",
  nextLabAfter: "et mintez dans votre lab wallet",
  nextGithub: "Lisez les notes protocole sur GitHub après approbation d’accès",
  registerWaitlist: "Enregistrer le code pour la waitlist →",
  handleLabel: "GitHub / handle",
  handlePlaceholder: "votre-handle",
  emailLabel: "E-mail (optionnel)",
  emailPlaceholder: "vous@entreprise.com",
  emailInvalid: "Saisissez un e-mail valide (nom@domaine.tld)",
  walletLabel: "Adresse Ethereum (optionnel · récompenses testnet)",
  walletPlaceholder: "0x…",
  walletInvalid: "Le wallet doit être 0x + 40 caractères hex",
  errorHandle: "Le handle doit faire au moins 2 caractères",
  errorEmail: "Format e-mail invalide — utilisez nom@domaine.tld",
  errorWallet: "Le wallet optionnel doit être une adresse 0x… (40 hex)",
  claimBtn: "Réclamer le badge lab",
  preview: "Aperçu",
  linkedWallet: "Lab wallet lié",
  labAccount: "Compte lab",
  openLab: "ouvrir /lab",
};

const FR: BuildersMessages = {
  product: "Resource Layer",
  eyebrow: "Builders",
  title: "Explorer le protocole",
  intro:
    "Architecture, preuve en motion, source et early access — pour les ingénieurs qui veulent de la substance avant un pitch deck.",
  ctaTestnet: "Demander l’accès testnet",
  ctaRepo: "Ouvrir le dépôt",
  ctaLab: "Energy Lab",
  ctaTrade: "Ouvrir le terminal trade",
  ctaStatus: "Statut système",
  demoTitle: "Démo site en 5 minutes",
  demoIntro:
    "Pas besoin de cloner. Lancez la boucle labellisée sur getauros.com — même ledger lab sur toutes les pages.",
  demoLab: "— mintez des akWh dans votre lab wallet navigateur",
  demoProducer: "— wrap akWh → WATT 1:1",
  demoTradeBefore: "— réglez le spot (ou",
  demoTradeOr: "pour un hedge lab)",
  demoTradeAfter: "",
  demoLiveChecks: "Checks live :",
  demoCaps: "plafonds & HITL sur les chemins payants",
  motionTitle: "Produit en motion",
  motionBody:
    "Pas de vidéo partenariat mise en scène — une boucle live du chemin que votre code implémentera : compteur → mint → ordre agent → fill labellisé.",
  archTitle: "Architecture",
  archBody:
    "Un chemin du compteur au marché. Settlement et chemins payants restent gated humainement ; les démos ne portent jamais de badges Verified.",
  stack: [
    { layer: "Devices", items: "Compteurs · onduleurs · firmware OEM" },
    { layer: "IoT bridge", items: "MQTT → ECDSA Proof-of-Resource → oracle mint" },
    {
      layer: "Protocol",
      items: "ResourceToken · Oracle · EnergyFutures · Options · Lending · Insurance",
    },
    {
      layer: "Agent API",
      items:
        "Spot / forward / perps / options · rate-limité · clé opérateur (agent-api). Le lab wallet site est une démo ouverte avec rate limits IP.",
    },
    {
      layer: "Surfaces",
      items: "/trade · /producer · /agent · /market · /lab (démos labellisées)",
    },
  ],
  sourceTitle: "Lire le source",
  securityEyebrow: "Posture sécurité",
  securityBodyBefore: "Suites Hardhat + plafonds/coupe-circuits livrés dans le repo.",
  securityStrong: "Aucun badge d’audit tiers revendiqué",
  securityBodyAfter:
    "— l’audit externe est sur la roadmap avant collatéral mainnet. Lisez",
  securityRead: "ARL-SECURITY.md",
  repoNote: "— monorepo (protocol / agent-api / iot-bridge / app)",
  linkVision: "Vision",
  linkWatt: "WATT",
  linkLab: "Energy Lab",
  linkStatus: "Status",
  linkWhitepaper: "Whitepaper",
  nodeTitle: "Lancer un Resource Node (aperçu)",
  nodeIntro:
    "Les commandes ci-dessous correspondent au layout du monorepo public. Identifiants MQTT et clés prod après approbation testnet (HITL).",
  nodeAccessNote: "Accès après approbation testnet · pas de clés mainnet silencieuses",
  economyTitle: "Économie machine — concret",
  economyBody:
    "Imaginez un VE ou un rack de GPU achetant des kWh automatiquement la nuit via l’API agent : forecast de charge → ordre forward → settlement adossé oracle quand les compteurs clearent — des humains approuvent toujours les étapes payantes et sensibles conformité.",
  badgeSectionTitle: "Badge Early Builder",
  accessTitle: "Demander l’accès",
  accessBody:
    "Dites-nous qui vous êtes (producteur, OEM, builder d’agents, chercheur), quel stack vous tournez déjà, et si vous avez besoin d’identifiants MQTT, d’un fork Hardhat ou de clés API.",
  accessCta: "Postuler pour l’accès testnet",
  accessFooter: "resources@getauros.com · revue HITL · pas de volume fictif",
  badge: BADGE_FR,
};

const BADGE_ES: BuildersBadgeMessages = {
  eyebrow: "Early Resource Builder · badge lab",
  intro:
    "Reclama un código builder local ahora. El mint NFT on-chain es un paso testnet posterior — esto no es un certificado Verified y no tiene valor financiero.",
  claimedTitle: "Reclamado · siguientes pasos",
  nextEmail: "Envía tu código a la waitlist (botón abajo)",
  nextLabBefore: "Abre",
  nextLabAfter: "y mintea en tu lab wallet",
  nextGithub: "Lee las notas de protocolo en GitHub tras la aprobación de acceso",
  registerWaitlist: "Registrar código en la waitlist →",
  handleLabel: "GitHub / handle",
  handlePlaceholder: "tu-handle",
  emailLabel: "Email (opcional)",
  emailPlaceholder: "tu@empresa.com",
  emailInvalid: "Introduce un email válido (nombre@dominio.tld)",
  walletLabel: "Dirección Ethereum (opcional · recompensas testnet)",
  walletPlaceholder: "0x…",
  walletInvalid: "El wallet debe ser 0x + 40 caracteres hex",
  errorHandle: "El handle debe tener al menos 2 caracteres",
  errorEmail: "Formato de email inválido — usa nombre@dominio.tld",
  errorWallet: "El wallet opcional debe ser una dirección 0x… (40 hex)",
  claimBtn: "Reclamar badge lab",
  preview: "Vista previa",
  linkedWallet: "Lab wallet vinculado",
  labAccount: "Cuenta lab",
  openLab: "abrir /lab",
};

const ES: BuildersMessages = {
  product: "Resource Layer",
  eyebrow: "Builders",
  title: "Explorar el protocolo",
  intro:
    "Arquitectura, prueba en motion, fuente y early access — para ingenieros que necesitan sustancia antes de un pitch deck.",
  ctaTestnet: "Solicitar acceso testnet",
  ctaRepo: "Abrir repositorio",
  ctaLab: "Energy Lab",
  ctaTrade: "Abrir terminal de trade",
  ctaStatus: "Estado del sistema",
  demoTitle: "Demo del sitio en 5 minutos",
  demoIntro:
    "No hace falta clonar. Ejecuta el bucle etiquetado en getauros.com — mismo ledger lab en todas las páginas.",
  demoLab: "— mintea akWh en tu lab wallet del navegador",
  demoProducer: "— wrap akWh → WATT 1:1",
  demoTradeBefore: "— liquida spot (o",
  demoTradeOr: "para una cobertura lab)",
  demoTradeAfter: "",
  demoLiveChecks: "Checks en vivo:",
  demoCaps: "caps y HITL en rutas de pago",
  motionTitle: "Producto en motion",
  motionBody:
    "Sin vídeo de partnership escenificado — un bucle en vivo del camino que tu código implementará: contador → mint → orden agent → fill etiquetado.",
  archTitle: "Arquitectura",
  archBody:
    "Un camino del contador al mercado. Settlement y rutas de pago siguen gated por humanos; las demos nunca llevan badges Verified.",
  stack: [
    { layer: "Devices", items: "Contadores · inversores · firmware OEM" },
    { layer: "IoT bridge", items: "MQTT → ECDSA Proof-of-Resource → oracle mint" },
    {
      layer: "Protocol",
      items: "ResourceToken · Oracle · EnergyFutures · Options · Lending · Insurance",
    },
    {
      layer: "Agent API",
      items:
        "Spot / forward / perps / options · rate-limited · clave de operador (agent-api). El lab wallet del sitio es demo abierta con rate limits IP.",
    },
    {
      layer: "Surfaces",
      items: "/trade · /producer · /agent · /market · /lab (demos etiquetadas)",
    },
  ],
  sourceTitle: "Leer el código",
  securityEyebrow: "Postura de seguridad",
  securityBodyBefore: "Suites Hardhat + caps/circuit-breakers entregados en el repo.",
  securityStrong: "No se reivindica badge de auditoría de terceros",
  securityBodyAfter:
    "— la auditoría externa está en el roadmap antes de colateral mainnet. Lee",
  securityRead: "ARL-SECURITY.md",
  repoNote: "— monorepo (protocol / agent-api / iot-bridge / app)",
  linkVision: "Visión",
  linkWatt: "WATT",
  linkLab: "Energy Lab",
  linkStatus: "Status",
  linkWhitepaper: "Whitepaper",
  nodeTitle: "Ejecutar un Resource Node (vista previa)",
  nodeIntro:
    "Los comandos abajo coinciden con el layout del monorepo público. Credenciales MQTT y claves de producción tras aprobación testnet (HITL).",
  nodeAccessNote: "Acceso tras aprobación testnet · sin claves mainnet silenciosas",
  economyTitle: "Economía de máquinas — concreto",
  economyBody:
    "Imagina un EV o un rack de GPUs comprando kWh automáticamente de noche vía la API agent: forecast de carga → orden forward → settlement respaldado por oráculo cuando los contadores clearan — humanos siguen aprobando pasos de pago y compliance.",
  badgeSectionTitle: "Badge Early Builder",
  accessTitle: "Solicitar acceso",
  accessBody:
    "Dinos quién eres (productor, OEM, builder de agentes, investigador), qué stack ya corres, y si necesitas credenciales MQTT, un fork Hardhat o claves API.",
  accessCta: "Solicitar acceso testnet",
  accessFooter: "resources@getauros.com · revisión HITL · sin volumen falso",
  badge: BADGE_ES,
};

const BADGE_AR: BuildersBadgeMessages = {
  eyebrow: "Early Resource Builder · شارة مختبر",
  intro:
    "اطلب رمز بنّاء محلي الآن. سكّ NFT على السلسلة خطوة testnet لاحقة — هذه ليست شهادة Verified ولا قيمة مالية لها.",
  claimedTitle: "تم الطلب · الخطوات التالية",
  nextEmail: "أرسل رمزك إلى قائمة الانتظار (الزر أدناه)",
  nextLabBefore: "افتح",
  nextLabAfter: "واسكّ في محفظة المختبر",
  nextGithub: "اقرأ ملاحظات البروتوكول على GitHub بعد الموافقة على الوصول",
  registerWaitlist: "تسجيل الرمز في قائمة الانتظار ←",
  handleLabel: "GitHub / المعرّف",
  handlePlaceholder: "معرّفك",
  emailLabel: "البريد (اختياري)",
  emailPlaceholder: "you@company.com",
  emailInvalid: "أدخل بريداً صالحاً (name@domain.tld)",
  walletLabel: "عنوان Ethereum (اختياري · مكافآت testnet)",
  walletPlaceholder: "0x…",
  walletInvalid: "يجب أن تكون المحفظة 0x + 40 حرفاً سداسياً",
  errorHandle: "يجب أن يكون المعرّف حرفين على الأقل",
  errorEmail: "صيغة البريد غير صالحة — استخدم name@domain.tld",
  errorWallet: "المحفظة الاختيارية يجب أن تكون عنوان 0x… (40 hex)",
  claimBtn: "طلب شارة المختبر",
  preview: "معاينة",
  linkedWallet: "محفظة مختبر مرتبطة",
  labAccount: "حساب المختبر",
  openLab: "فتح /lab",
};

const AR: BuildersMessages = {
  product: "Resource Layer",
  eyebrow: "المطوّرون",
  title: "استكشف البروتوكول",
  intro:
    "هندسة، إثبات بالحركة، مصدر ووصول مبكر — للمهندسين الذين يحتاجون جوهراً قبل عرض تقديمي.",
  ctaTestnet: "طلب وصول testnet",
  ctaRepo: "فتح المستودع",
  ctaLab: "Energy Lab",
  ctaTrade: "فتح طرفية التداول",
  ctaStatus: "حالة النظام",
  demoTitle: "عرض توضيحي للموقع في 5 دقائق",
  demoIntro:
    "لا حاجة للاستنساخ. شغّل الحلقة المُصنَّفة على getauros.com — نفس دفتر المختبر عبر الصفحات.",
  demoLab: "— اسكّ akWh في محفظة المختبر بالمتصفح",
  demoProducer: "— غلّف akWh → WATT 1:1",
  demoTradeBefore: "— سوّ الفوري (أو",
  demoTradeOr: "لشراء تحوط مختبري)",
  demoTradeAfter: "",
  demoLiveChecks: "فحوصات حية:",
  demoCaps: "حدود وHITL على المسارات المدفوعة",
  motionTitle: "المنتج بالحركة",
  motionBody:
    "لا فيديو شراكة مسرحي — حلقة حية للمسار الذي سينفّذه كودك: عداد → سكّ → أمر وكيل → تنفيذ مُصنَّف.",
  archTitle: "الهندسة",
  archBody:
    "مسار واحد من العداد إلى السوق. التسوية والمسارات المدفوعة تبقى ببوابات بشرية؛ العروض لا ترتدي شارات Verified.",
  stack: [
    { layer: "الأجهزة", items: "عدادات · عواكس · برمجيات OEM" },
    { layer: "جسر IoT", items: "MQTT → ECDSA Proof-of-Resource → سكّ أوراكل" },
    {
      layer: "البروتوكول",
      items: "ResourceToken · Oracle · EnergyFutures · Options · Lending · Insurance",
    },
    {
      layer: "واجهة الوكلاء",
      items:
        "فوري / آجل / دائم / خيارات · محدود المعدل · بمفتاح مشغّل (agent-api). محفظة مختبر الموقع عرض مفتوح بحدود IP.",
    },
    {
      layer: "الواجهات",
      items: "/trade · /producer · /agent · /market · /lab (عروض مُصنَّفة)",
    },
  ],
  sourceTitle: "اقرأ المصدر",
  securityEyebrow: "وضعية الأمن",
  securityBodyBefore: "مجموعات Hardhat + حدود/قواطع دوائر مُسلَّمة في المستودع.",
  securityStrong: "لا ندّعي شارة تدقيق طرف ثالث",
  securityBodyAfter: "— التدقيق الخارجي على خارطة الطريق قبل ضمانات mainnet. اقرأ",
  securityRead: "ARL-SECURITY.md",
  repoNote: "— monorepo (protocol / agent-api / iot-bridge / app)",
  linkVision: "الرؤية",
  linkWatt: "WATT",
  linkLab: "Energy Lab",
  linkStatus: "الحالة",
  linkWhitepaper: "الورقة البيضاء",
  nodeTitle: "تشغيل Resource Node (معاينة)",
  nodeIntro:
    "الأوامر أدناه تطابق تخطيط monorepo العام. بيانات MQTT ومفاتيح الإنتاج بعد موافقة testnet (HITL).",
  nodeAccessNote: "يُمنح الوصول بعد موافقة testnet · لا مفاتيح mainnet صامتة",
  economyTitle: "اقتصاد الآلات — ملموس",
  economyBody:
    "تخيّل سيارة كهربائية أو رف GPU يشتري كيلوواط ساعة تلقائياً ليلاً عبر واجهة الوكلاء: توقّع الحمل → أمر آجل → تسوية مدعومة بأوراكل عند تصفية العدادات — بشر ما زالوا يوافقون على الخطوات المدفوعة والحساسة للامتثال.",
  badgeSectionTitle: "شارة Early Builder",
  accessTitle: "طلب الوصول",
  accessBody:
    "أخبرنا من أنت (منتج، OEM، بنّاء وكلاء، باحث)، أي مكدس تشغّله، وهل تحتاج بيانات MQTT أو شوكة Hardhat أو مفاتيح API.",
  accessCta: "التقديم لوصول testnet",
  accessFooter: "resources@getauros.com · مراجعة HITL · بلا حجم مزيف",
  badge: BADGE_AR,
};

const BADGE_ZH: BuildersBadgeMessages = {
  eyebrow: "Early Resource Builder · 实验室徽章",
  intro:
    "立即领取本地 builder 码。链上 NFT 铸造是后续测试网步骤——这不是 Verified 证书，也无金融价值。",
  claimedTitle: "已领取 · 下一步",
  nextEmail: "将代码发至候补名单（下方按钮）",
  nextLabBefore: "打开",
  nextLabAfter: "并铸造到你的实验室钱包",
  nextGithub: "访问获批后在 GitHub 阅读协议说明",
  registerWaitlist: "登记代码加入候补 →",
  handleLabel: "GitHub / 句柄",
  handlePlaceholder: "your-handle",
  emailLabel: "邮箱（可选）",
  emailPlaceholder: "you@company.com",
  emailInvalid: "请输入有效邮箱（name@domain.tld）",
  walletLabel: "以太坊地址（可选 · 测试网奖励）",
  walletPlaceholder: "0x…",
  walletInvalid: "钱包必须是 0x + 40 位十六进制",
  errorHandle: "句柄至少 2 个字符",
  errorEmail: "邮箱格式无效 — 使用 name@domain.tld",
  errorWallet: "可选钱包必须是 0x… 地址（40 hex）",
  claimBtn: "领取实验室徽章",
  preview: "预览",
  linkedWallet: "已关联实验室钱包",
  labAccount: "实验室账户",
  openLab: "打开 /lab",
};

const ZH: BuildersMessages = {
  product: "Resource Layer",
  eyebrow: "Builders",
  title: "探索协议",
  intro: "架构、动态证明、源码与早期访问——给需要实质内容、而非先看 pitch deck 的工程师。",
  ctaTestnet: "申请测试网访问",
  ctaRepo: "打开仓库",
  ctaLab: "Energy Lab",
  ctaTrade: "打开交易终端",
  ctaStatus: "系统状态",
  demoTitle: "5 分钟站点演示",
  demoIntro: "无需克隆。在 getauros.com 运行已标注闭环——各页共用同一实验室账本。",
  demoLab: "— 向浏览器实验室钱包铸造 akWh",
  demoProducer: "— 包装 akWh → WATT 1:1",
  demoTradeBefore: "— 结算现货（或",
  demoTradeOr: "做实验室对冲买入）",
  demoTradeAfter: "",
  demoLiveChecks: "实时检查：",
  demoCaps: "付费路径上的限额与 HITL",
  motionTitle: "动态中的产品",
  motionBody:
    "没有摆拍的合作视频——一条你的代码将实现的实时闭环：表计 → 铸造 → 代理下单 → 已标注成交。",
  archTitle: "架构",
  archBody:
    "从表计到市场的一条路径。结算与付费路径保持人工门控；演示从不佩戴 Verified 徽章。",
  stack: [
    { layer: "设备", items: "表计 · 逆变器 · OEM 固件" },
    { layer: "IoT 桥", items: "MQTT → ECDSA Proof-of-Resource → 预言机铸造" },
    {
      layer: "协议",
      items: "ResourceToken · Oracle · EnergyFutures · Options · Lending · Insurance",
    },
    {
      layer: "代理 API",
      items:
        "现货 / 远期 / 永续 / 期权 · 限速 · 运营方密钥（agent-api）。站点实验室钱包为开放演示，带 IP 限速。",
    },
    {
      layer: "界面",
      items: "/trade · /producer · /agent · /market · /lab（演示已标注）",
    },
  ],
  sourceTitle: "阅读源码",
  securityEyebrow: "安全姿态",
  securityBodyBefore: "Hardhat 套件 + 限额/断路器已在仓库交付。",
  securityStrong: "未声称第三方审计徽章",
  securityBodyAfter: "— 主网抵押前外部审计在路线图上。请阅读",
  securityRead: "ARL-SECURITY.md",
  repoNote: "— monorepo（protocol / agent-api / iot-bridge / app）",
  linkVision: "愿景",
  linkWatt: "WATT",
  linkLab: "Energy Lab",
  linkStatus: "状态",
  linkWhitepaper: "白皮书",
  nodeTitle: "运行 Resource Node（预览）",
  nodeIntro:
    "以下命令与公开 monorepo 布局一致。MQTT 凭证与生产密钥在测试网获批后发放（HITL）。",
  nodeAccessNote: "测试网获批后开放访问 · 无静默主网密钥",
  economyTitle: "机器经济——具体场景",
  economyBody:
    "想象一辆电动车或一架 GPU 机柜通过代理 API 夜间自动购买千瓦时：负荷预测 → 远期下单 → 表计清算后由预言机支撑结算——人类仍批准付费与合规敏感步骤。",
  badgeSectionTitle: "Early Builder 徽章",
  accessTitle: "申请访问",
  accessBody:
    "告诉我们你是谁（生产商、OEM、代理构建者、研究者）、已运行的技术栈，以及是否需要 MQTT 凭证、Hardhat fork 或 API 密钥。",
  accessCta: "申请测试网访问",
  accessFooter: "resources@getauros.com · HITL 审核 · 不做假量",
  badge: BADGE_ZH,
};

const CATALOG = localeCatalog({ fr: FR, en: EN, es: ES, ar: AR, zh: ZH });

export function getBuildersMessages(locale: Locale): BuildersMessages {
  return CATALOG[locale] ?? CATALOG.en;
}
