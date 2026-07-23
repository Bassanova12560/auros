import { localeCatalog, type Locale } from "@/lib/i18n";

export type InvestorsSurface = {
  href: string;
  label: string;
  status: string;
};

export type InvestorsMessages = {
  product: string;
  eyebrow: string;
  title: string;
  intro: string;
  ctaDiligence: string;
  ctaLab: string;
  thesisTitle: string;
  thesis: readonly string[];
  surfacesTitle: string;
  surfacesIntro: string;
  surfaces: readonly InvestorsSurface[];
  twoProductsTitle: string;
  dossierLead: string;
  dossierMid: string;
  dossierTail: string;
  arlLead: string;
  arlTail: string;
  stackTitle: string;
  repoLabel: string;
  businessTitle: string;
  businessHypothesis: string;
  business: readonly string[];
  moatTitle: string;
  moat: readonly string[];
  risksTitle: string;
  risks: readonly string[];
  riskBuildersLead: string;
  askTitle: string;
  askBody: string;
  contactProduct: string;
  contactLegal: string;
  notOffer: string;
  greenDiligence: string;
};

const EN: InvestorsMessages = {
  product: "AUROS",
  eyebrow: "Investors",
  title: "The liquidity engine for tokenized resources",
  intro:
    "Meters in, tradable units out. Diligence without invented ARR, fake logos, or closed-round theater — Morpho/Ondo-style clarity, AUROS honesty.",
  ctaDiligence: "Request diligence pack",
  ctaLab: "Run the lab loop",
  thesisTitle: "Thesis",
  thesis: [
    "$RWA issuance is crowded; resource liquidity (kWh, water, compute-linked power) is not.",
    "AI data centers need programmatic hedges; solar sites need real-time monetization of surplus.",
    "ARL connects both with oracle-gated units + agent API under HITL settlement — no fake volume badges.",
  ],
  surfacesTitle: "Live product surfaces",
  surfacesIntro:
    "Exercise the shared lab ledger yourself. Spot sells akWh; wrapped WATT auto-redeems 1:1 before sell.",
  surfaces: [
    { href: "/resource-layer", label: "Vision", status: "Shipped marketing + roadmap" },
    { href: "/compare", label: "RWA comparator", status: "120+ products · live APY · multi-class" },
    { href: "/presence", label: "Market presence", status: "Green directories · submission-ready" },
    { href: "/lab", label: "Energy Lab", status: "Live lab ledger · mint" },
    { href: "/producer", label: "Producer", status: "Live · mint + wrap WATT" },
    { href: "/trade", label: "Trade", status: "Live spot · advanced = session toy" },
    { href: "/agent", label: "Agent", status: "Lab spot hedge (not a cleared forward)" },
    { href: "/market", label: "Market", status: "Labeled marks · not live volume" },
    { href: "/watt", label: "WATT", status: "Unit of account · lab wrap" },
    { href: "/earn", label: "Earn", status: "Preview · not a yield product" },
    { href: "/builders", label: "Builders", status: "Architecture · repo · testnet path" },
    { href: "/status", label: "Status", status: "Public probes · not an SLA" },
  ],
  twoProductsTitle: "Two products, one engine",
  dossierLead: "RWA dossier",
  dossierMid:
    "— admission score, data room, jurisdiction path for issuers. Market diligence via the",
  dossierTail: "(120+ products · live APY · risk classes).",
  arlLead: "Resource Layer (ARL)",
  arlTail: "— meter → mint → wrap → spot / agent hedges (lab today, pilots HITL).",
  stackTitle: "Stack",
  repoLabel: "Repo",
  businessTitle: "Business model",
  businessHypothesis: "Hypothesis · not guidance",
  business: [
    "Protocol fee on mint / settlement volume (pilot-tier bps)",
    "SaaS for agent-api + monitoring (enterprise)",
    "RFQ / liquidity partner rev-share after HITL pilots",
  ],
  moatTitle: "Moat",
  moat: [
    "Combined issuer + flow story (dossier + liquidity)",
    "Agent-first API with safety gates",
    "IoT + oracle path — not PDF-only RWAs",
  ],
  risksTitle: "Risks (honest)",
  risks: [
    "Regulatory variance by region",
    "Oracle / device trust",
    "Liquidity cold-start — mitigated via HITL RFQ, not fake volume",
  ],
  riskBuildersLead: "No third-party audit badge claimed yet — see",
  askTitle: "Ask / contact",
  askBody:
    "Seed extension / strategic conversations for protocol engineers, IoT, and MM partner onboarding. Use of funds narrative: Sepolia → mainnet pilot, security review, producer #1 — details on written request.",
  contactProduct: "— product & diligence",
  contactLegal: "— entity pack on written request",
  notOffer: "Not an offer to sell securities. Green listing diligence:",
  greenDiligence: "/green/investors",
};

const FR: InvestorsMessages = {
  product: "AUROS",
  eyebrow: "Investisseurs",
  title: "Le moteur de liquidité des ressources tokenisées",
  intro:
    "Compteurs en entrée, unités négociables en sortie. Diligence sans ARR inventé, logos fictifs ni théâtre de tour fermé — clarté façon Morpho/Ondo, honnêteté AUROS.",
  ctaDiligence: "Demander le pack diligence",
  ctaLab: "Lancer la boucle lab",
  thesisTitle: "Thèse",
  thesis: [
    "L’émission $RWA est saturée ; la liquidité des ressources (kWh, eau, énergie liée au compute) ne l’est pas.",
    "Les data centers IA ont besoin de couvertures programmatiques ; les sites solaires doivent monétiser le surplus en temps réel.",
    "ARL relie les deux avec des unités gated par oracle + API agent sous settlement HITL — pas de badges de volume fictifs.",
  ],
  surfacesTitle: "Surfaces produit live",
  surfacesIntro:
    "Exercez vous-même le ledger lab partagé. Le spot vend des akWh ; le WATT wrappé se rachète automatiquement 1:1 avant vente.",
  surfaces: [
    { href: "/resource-layer", label: "Vision", status: "Marketing + roadmap livrés" },
    { href: "/compare", label: "Comparateur RWA", status: "120+ produits · APY live · multi-classes" },
    { href: "/presence", label: "Présence marchés", status: "Directories green · dossiers prêts" },
    { href: "/lab", label: "Energy Lab", status: "Ledger lab live · mint" },
    { href: "/producer", label: "Producer", status: "Live · mint + wrap WATT" },
    { href: "/trade", label: "Trade", status: "Spot live · advanced = jouet de session" },
    { href: "/agent", label: "Agent", status: "Couverture spot lab (pas un forward clearé)" },
    { href: "/market", label: "Market", status: "Marques labellisées · pas de volume live" },
    { href: "/watt", label: "WATT", status: "Unité de compte · wrap lab" },
    { href: "/earn", label: "Earn", status: "Aperçu · pas un produit de yield" },
    { href: "/builders", label: "Builders", status: "Architecture · repo · chemin testnet" },
    { href: "/status", label: "Status", status: "Sondes publiques · pas un SLA" },
  ],
  twoProductsTitle: "Deux produits, un moteur",
  dossierLead: "Dossier RWA",
  dossierMid:
    "— score d’admission, data room, parcours juridiction pour émetteurs. Diligence marché via le",
  dossierTail: "(120+ produits · APY live · classes de risque).",
  arlLead: "Resource Layer (ARL)",
  arlTail: "— compteur → mint → wrap → spot / couvertures agent (lab aujourd’hui, pilotes HITL).",
  stackTitle: "Stack",
  repoLabel: "Repo",
  businessTitle: "Modèle économique",
  businessHypothesis: "Hypothèse · pas un guidance",
  business: [
    "Frais de protocole sur volume mint / settlement (bps niveau pilote)",
    "SaaS agent-api + monitoring (entreprise)",
    "Rev-share RFQ / partenaires liquidité après pilotes HITL",
  ],
  moatTitle: "Moat",
  moat: [
    "Histoire combinée émetteur + flux (dossier + liquidité)",
    "API agent-first avec garde-fous",
    "Chemin IoT + oracle — pas des RWA uniquement PDF",
  ],
  risksTitle: "Risques (honnêtes)",
  risks: [
    "Variance réglementaire selon la région",
    "Confiance oracle / appareils",
    "Cold-start liquidité — atténué via RFQ HITL, pas de volume fictif",
  ],
  riskBuildersLead: "Aucun badge d’audit tiers revendiqué pour l’instant — voir",
  askTitle: "Demande / contact",
  askBody:
    "Extension seed / conversations stratégiques pour ingénieurs protocole, IoT et onboarding partenaires MM. Narratif d’emploi des fonds : Sepolia → pilote mainnet, revue sécurité, producteur #1 — détails sur demande écrite.",
  contactProduct: "— produit & diligence",
  contactLegal: "— pack entité sur demande écrite",
  notOffer: "Ceci n’est pas une offre de titres. Diligence listing Green :",
  greenDiligence: "/green/investors",
};

const ES: InvestorsMessages = {
  product: "AUROS",
  eyebrow: "Inversores",
  title: "El motor de liquidez de recursos tokenizados",
  intro:
    "Contadores de entrada, unidades negociables de salida. Diligence sin ARR inventado, logos falsos ni teatro de ronda cerrada — claridad estilo Morpho/Ondo, honestidad AUROS.",
  ctaDiligence: "Solicitar pack de diligence",
  ctaLab: "Ejecutar el bucle lab",
  thesisTitle: "Tesis",
  thesis: [
    "La emisión $RWA está saturada; la liquidez de recursos (kWh, agua, energía ligada a compute) no.",
    "Los data centers de IA necesitan coberturas programáticas; los sitios solares necesitan monetizar el excedente en tiempo real.",
    "ARL conecta ambos con unidades gated por oráculo + API de agentes bajo settlement HITL — sin badges de volumen inventados.",
  ],
  surfacesTitle: "Superficies de producto en vivo",
  surfacesIntro:
    "Ejercita tú mismo el ledger lab compartido. El spot vende akWh; el WATT wrappeado se redime automáticamente 1:1 antes de vender.",
  surfaces: [
    { href: "/resource-layer", label: "Visión", status: "Marketing + roadmap publicados" },
    { href: "/compare", label: "Comparador RWA", status: "120+ productos · APY en vivo · multi-clase" },
    { href: "/presence", label: "Presencia en mercados", status: "Directorios green · listo para enviar" },
    { href: "/lab", label: "Energy Lab", status: "Ledger lab en vivo · mint" },
    { href: "/producer", label: "Producer", status: "En vivo · mint + wrap WATT" },
    { href: "/trade", label: "Trade", status: "Spot en vivo · advanced = juguete de sesión" },
    { href: "/agent", label: "Agent", status: "Cobertura spot lab (no es un forward clearing)" },
    { href: "/market", label: "Market", status: "Marcas etiquetadas · no volumen en vivo" },
    { href: "/watt", label: "WATT", status: "Unidad de cuenta · wrap lab" },
    { href: "/earn", label: "Earn", status: "Vista previa · no es un producto de yield" },
    { href: "/builders", label: "Builders", status: "Arquitectura · repo · ruta testnet" },
    { href: "/status", label: "Status", status: "Sondas públicas · no es un SLA" },
  ],
  twoProductsTitle: "Dos productos, un motor",
  dossierLead: "Expediente RWA",
  dossierMid:
    "— score de admisión, data room, ruta jurisdiccional para emisores. Diligence de mercado vía el",
  dossierTail: "(120+ productos · APY en vivo · clases de riesgo).",
  arlLead: "Resource Layer (ARL)",
  arlTail: "— contador → mint → wrap → spot / coberturas agent (lab hoy, pilotos HITL).",
  stackTitle: "Stack",
  repoLabel: "Repo",
  businessTitle: "Modelo de negocio",
  businessHypothesis: "Hipótesis · no es guidance",
  business: [
    "Comisión de protocolo sobre volumen mint / settlement (bps nivel piloto)",
    "SaaS agent-api + monitoring (empresa)",
    "Rev-share RFQ / partners de liquidez tras pilotos HITL",
  ],
  moatTitle: "Moat",
  moat: [
    "Historia combinada emisor + flujo (expediente + liquidez)",
    "API agent-first con barreras de seguridad",
    "Ruta IoT + oráculo — no solo RWA en PDF",
  ],
  risksTitle: "Riesgos (honestos)",
  risks: [
    "Varianza regulatoria por región",
    "Confianza en oráculo / dispositivos",
    "Cold-start de liquidez — mitigado vía RFQ HITL, no volumen falso",
  ],
  riskBuildersLead: "Aún no se reivindica badge de auditoría de terceros — ver",
  askTitle: "Ask / contacto",
  askBody:
    "Extensión seed / conversaciones estratégicas para ingenieros de protocolo, IoT y onboarding de partners MM. Narrativa de uso de fondos: Sepolia → piloto mainnet, revisión de seguridad, productor #1 — detalles bajo solicitud escrita.",
  contactProduct: "— producto y diligence",
  contactLegal: "— pack de entidad bajo solicitud escrita",
  notOffer: "No es una oferta de valores. Diligence de listing Green:",
  greenDiligence: "/green/investors",
};

const AR: InvestorsMessages = {
  product: "AUROS",
  eyebrow: "المستثمرون",
  title: "محرك السيولة للموارد المرمّزة",
  intro:
    "عدادات في المدخل، وحدات قابلة للتداول في المخرج. عناية واجبة بلا إيرادات مخترعة ولا شعارات زائفة ولا مسرح جولات مغلقة — وضوح بأسلوب Morpho/Ondo وصراحة AUROS.",
  ctaDiligence: "طلب حزمة العناية الواجبة",
  ctaLab: "تشغيل حلقة المختبر",
  thesisTitle: "الأطروحة",
  thesis: [
    "إصدار $RWA مزدحم؛ سيولة الموارد (كيلوواط ساعة، ماء، طاقة مرتبطة بالحوسبة) ليست كذلك.",
    "مراكز بيانات الذكاء الاصطناعي تحتاج تحوطات برمجية؛ مواقع الطاقة الشمسية تحتاج تسييل الفائض في الوقت الفعلي.",
    "يربط ARL الاثنين بوحدات مقيّدة بالأوراكل وواجهة وكلاء تحت تسوية HITL — بلا شارات حجم مزيفة.",
  ],
  surfacesTitle: "واجهات المنتج الحية",
  surfacesIntro:
    "جرّب دفتر المختبر المشترك بنفسك. البيع الفوري يبيع akWh؛ وWATT المغلف يُسترد تلقائياً 1:1 قبل البيع.",
  surfaces: [
    { href: "/resource-layer", label: "الرؤية", status: "تسويق وخارطة طريق منشوران" },
    { href: "/compare", label: "مقارن RWA", status: "أكثر من 120 منتجاً · عائد حي · فئات متعددة" },
    { href: "/presence", label: "الحضور في الأسواق", status: "أدلة خضراء · جاهز للإرسال" },
    { href: "/lab", label: "Energy Lab", status: "دفتر مختبر حي · سكّ" },
    { href: "/producer", label: "Producer", status: "حي · سكّ + تغليف WATT" },
    { href: "/trade", label: "Trade", status: "فوري حي · المتقدم = لعبة جلسة" },
    { href: "/agent", label: "Agent", status: "تحوط فوري مختبري (ليس آجلاً مقاصّاً)" },
    { href: "/market", label: "Market", status: "علامات مُصنَّفة · ليس حجماً حياً" },
    { href: "/watt", label: "WATT", status: "وحدة حساب · تغليف مختبر" },
    { href: "/earn", label: "Earn", status: "معاينة · ليس منتج عائد" },
    { href: "/builders", label: "Builders", status: "هندسة · مستودع · مسار testnet" },
    { href: "/status", label: "Status", status: "مجسات عامة · ليس اتفاقية مستوى خدمة" },
  ],
  twoProductsTitle: "منتجان، محرك واحد",
  dossierLead: "ملف RWA",
  dossierMid: "— درجة قبول، غرفة بيانات، مسار ولاية للمُصدرين. عناية سوقية عبر",
  dossierTail: "(أكثر من 120 منتجاً · عائد حي · فئات مخاطر).",
  arlLead: "Resource Layer (ARL)",
  arlTail: "— عداد → سكّ → تغليف → فوري / تحوطات وكيل (مختبر اليوم، تجارب HITL).",
  stackTitle: "المكدس التقني",
  repoLabel: "المستودع",
  businessTitle: "نموذج الأعمال",
  businessHypothesis: "فرضية · ليست إرشاداً",
  business: [
    "رسوم بروتوكول على حجم السكّ / التسوية (نقاط أساس بمستوى التجربة)",
    "SaaS لـ agent-api والمراقبة (مؤسسات)",
    "حصة إيراد RFQ / شركاء السيولة بعد تجارب HITL",
  ],
  moatTitle: "الميزة التنافسية",
  moat: [
    "قصة مُصدر وتدفق مجتمعة (ملف + سيولة)",
    "واجهة وكلاء أولاً مع بوابات أمان",
    "مسار IoT وأوراكل — وليس RWA بصيغة PDF فقط",
  ],
  risksTitle: "المخاطر (بصراحة)",
  risks: [
    "تباين تنظيمي حسب المنطقة",
    "ثقة الأوراكل / الأجهزة",
    "بداية باردة للسيولة — تُخفَّف عبر RFQ مع HITL، لا حجم مزيف",
  ],
  riskBuildersLead: "لا ندّعي شارة تدقيق طرف ثالث بعد — انظر",
  askTitle: "الطلب / التواصل",
  askBody:
    "تمديد بذرة / محادثات استراتيجية لمهندسي البروتوكول وIoT وإدماج شركاء صناعة السوق. سرد استخدام الأموال: Sepolia → تجربة mainnet، مراجعة أمنية، المنتج رقم 1 — التفاصيل بطلب كتابي.",
  contactProduct: "— المنتج والعناية الواجبة",
  contactLegal: "— حزمة الكيان بطلب كتابي",
  notOffer: "ليست عرضاً لبيع أوراق مالية. عناية إدراج Green:",
  greenDiligence: "/green/investors",
};

const ZH: InvestorsMessages = {
  product: "AUROS",
  eyebrow: "投资者",
  title: "代币化资源的流动性引擎",
  intro:
    "表计入、可交易单位出。尽调不编造 ARR、不做假 logo、不演封闭轮戏码——Morpho/Ondo 式清晰，AUROS 式诚实。",
  ctaDiligence: "索取尽调材料包",
  ctaLab: "运行实验室闭环",
  thesisTitle: "论点",
  thesis: [
    "$RWA 发行已拥挤；资源流动性（千瓦时、水、与算力相关的电力）尚未。",
    "AI 数据中心需要可编程对冲；光伏站点需要实时变现盈余。",
    "ARL 用预言机门控单位 + 代理 API，在 HITL 结算下连接两端——不做虚假成交量徽章。",
  ],
  surfacesTitle: "已上线产品面",
  surfacesIntro:
    "亲自操作共享实验室账本。现货卖出 akWh；包装后的 WATT 在卖出前按 1:1 自动赎回。",
  surfaces: [
    { href: "/resource-layer", label: "愿景", status: "营销与路线图已上线" },
    { href: "/compare", label: "RWA 对比器", status: "120+ 产品 · 实时 APY · 多类别" },
    { href: "/presence", label: "市场露出", status: "绿色名录 · 可提交" },
    { href: "/lab", label: "Energy Lab", status: "实时实验室账本 · 铸造" },
    { href: "/producer", label: "Producer", status: "已上线 · 铸造 + 包装 WATT" },
    { href: "/trade", label: "Trade", status: "实时现货 · 高级功能 = 会话玩具" },
    { href: "/agent", label: "Agent", status: "实验室现货对冲（非已清算远期）" },
    { href: "/market", label: "Market", status: "已标注报价 · 非实时成交量" },
    { href: "/watt", label: "WATT", status: "记账单位 · 实验室包装" },
    { href: "/earn", label: "Earn", status: "预览 · 非收益产品" },
    { href: "/builders", label: "Builders", status: "架构 · 仓库 · 测试网路径" },
    { href: "/status", label: "Status", status: "公开探针 · 非 SLA" },
  ],
  twoProductsTitle: "两个产品，一个引擎",
  dossierLead: "RWA 档案",
  dossierMid: "— 准入评分、资料室、发行人管辖路径。市场尽调通过",
  dossierTail: "（120+ 产品 · 实时 APY · 风险类别）。",
  arlLead: "Resource Layer（ARL）",
  arlTail: "— 表计 → 铸造 → 包装 → 现货 / 代理对冲（今日为实验室，试点走 HITL）。",
  stackTitle: "技术栈",
  repoLabel: "仓库",
  businessTitle: "商业模式",
  businessHypothesis: "假设 · 非指引",
  business: [
    "铸造 / 结算量的协议费（试点级基点）",
    "agent-api + 监控的企业 SaaS",
    "HITL 试点后的 RFQ / 流动性伙伴收入分成",
  ],
  moatTitle: "护城河",
  moat: [
    "发行人 + 流量合一叙事（档案 + 流动性）",
    "代理优先 API，带安全门控",
    "IoT + 预言机路径——不是仅 PDF 的 RWA",
  ],
  risksTitle: "风险（如实）",
  risks: [
    "各地区监管差异",
    "预言机 / 设备信任",
    "流动性冷启动——通过 HITL RFQ 缓解，不做假量",
  ],
  riskBuildersLead: "尚未声称第三方审计徽章——见",
  askTitle: "诉求 / 联系",
  askBody:
    "种子轮延期 / 面向协议工程师、IoT 与做市伙伴入驻的战略对话。资金用途叙事：Sepolia → 主网试点、安全审查、首个生产商——书面索取详情。",
  contactProduct: "— 产品与尽调",
  contactLegal: "— 实体材料包需书面申请",
  notOffer: "不构成证券销售要约。Green 上架尽调：",
  greenDiligence: "/green/investors",
};

const CATALOG = localeCatalog({ fr: FR, en: EN, es: ES, ar: AR, zh: ZH });

export function getInvestorsMessages(locale: Locale): InvestorsMessages {
  return CATALOG[locale] ?? CATALOG.en;
}
