import { localeCatalog, type Locale } from "@/lib/i18n";

export type WhyBenefit = { who: string; why: string };

export type WhyMessages = {
  product: string;
  eyebrow: string;
  title: string;
  intro: string;
  whyUsTitle: string;
  benefits: readonly WhyBenefit[];
  scenarioEyebrow: string;
  scenarioTitle: string;
  scenarioBody: string;
  ctaLab: string;
  howTitle: string;
  howSteps: readonly string[];
};

const EN: WhyMessages = {
  product: "AUROS",
  eyebrow: "Why Auros",
  title: "One liquidity engine. Critical resources.",
  intro:
    "Benefit first — then how it works. We build institutional markets for digital assets and the settlement layer for tokenized energy, water, and compute.",
  whyUsTitle: "Why us",
  benefits: [
    {
      who: "Institution / exchange",
      why: "Risk-disciplined liquidity and labeled demos — no fake “trusted by” theater.",
    },
    {
      who: "Energy / water producer",
      why: "Sell metered production as units with a clear path: mint → wrap → spot — HITL for real settlement.",
    },
    {
      who: "Developer / AI agent",
      why: "Protocol + agent API + lab wallet you can exercise today without connecting MetaMask.",
    },
  ],
  scenarioEyebrow: "Illustrative scenario · not a client case · not a guaranteed outcome",
  scenarioTitle: "Solar farm · 10 MW · projection",
  scenarioBody:
    "A 10 MW solar site that today sells surplus via opaque OTC quotes can, in the Auros lab path, mint attested kWh → wrap to WATT → offer spot to a data-center agent. The economic story is shorter discovery and labeled settlement — not a promise of −12% costs. Real savings depend on offtake, grid fees, and counsel.",
  ctaLab: "Run the Energy Lab",
  howTitle: "How it works (short)",
  howSteps: [
    "Meter / oracle attests production",
    "Resource units mint into a lab or pilot wallet",
    "Optional wrap to WATT (1:1 energy unit of account)",
    "Spot / agent hedges settle with caps — humans approve paid paths",
  ],
};

const FR: WhyMessages = {
  product: "AUROS",
  eyebrow: "Pourquoi Auros",
  title: "Un moteur de liquidité. Des ressources critiques.",
  intro:
    "Le bénéfice d’abord — puis le fonctionnement. Nous construisons des marchés institutionnels pour les actifs numériques et la couche de settlement pour l’énergie, l’eau et le compute tokenisés.",
  whyUsTitle: "Pourquoi nous",
  benefits: [
    {
      who: "Institution / exchange",
      why: "Liquidité disciplinée par le risque et démos labellisées — pas de théâtre « trusted by » fictif.",
    },
    {
      who: "Producteur énergie / eau",
      why: "Vendez la production mesurée en unités avec un chemin clair : mint → wrap → spot — HITL pour le settlement réel.",
    },
    {
      who: "Développeur / agent IA",
      why: "Protocole + API agent + lab wallet que vous pouvez exercer aujourd’hui sans MetaMask.",
    },
  ],
  scenarioEyebrow: "Scénario illustratif · pas un cas client · pas un résultat garanti",
  scenarioTitle: "Ferme solaire · 10 MW · projection",
  scenarioBody:
    "Un site solaire de 10 MW qui vend aujourd’hui son surplus via des cotations OTC opaques peut, sur le chemin lab Auros, minter des kWh attestés → wrap en WATT → offrir du spot à un agent data center. L’histoire économique, c’est une découverte plus courte et un settlement labellisé — pas une promesse de −12 % de coûts. Les économies réelles dépendent de l’offtake, des frais réseau et du counsel.",
  ctaLab: "Lancer l’Energy Lab",
  howTitle: "Comment ça marche (court)",
  howSteps: [
    "Compteur / oracle atteste la production",
    "Les unités de ressource sont mintées dans un wallet lab ou pilote",
    "Wrap optionnel en WATT (unité de compte énergie 1:1)",
    "Spot / couvertures agent se règlent avec des plafonds — des humains approuvent les chemins payants",
  ],
};

const ES: WhyMessages = {
  product: "AUROS",
  eyebrow: "Por qué Auros",
  title: "Un motor de liquidez. Recursos críticos.",
  intro:
    "Primero el beneficio — luego cómo funciona. Construimos mercados institucionales para activos digitales y la capa de settlement para energía, agua y compute tokenizados.",
  whyUsTitle: "Por qué nosotros",
  benefits: [
    {
      who: "Institución / exchange",
      why: "Liquidez disciplinada por riesgo y demos etiquetadas — sin teatro falso de “trusted by”.",
    },
    {
      who: "Productor de energía / agua",
      why: "Venda producción medida como unidades con un camino claro: mint → wrap → spot — HITL para settlement real.",
    },
    {
      who: "Desarrollador / agente IA",
      why: "Protocolo + API de agentes + lab wallet que puedes ejercitar hoy sin conectar MetaMask.",
    },
  ],
  scenarioEyebrow: "Escenario ilustrativo · no es un caso de cliente · no es un resultado garantizado",
  scenarioTitle: "Planta solar · 10 MW · proyección",
  scenarioBody:
    "Una planta solar de 10 MW que hoy vende el excedente vía cotizaciones OTC opacas puede, en el camino lab de Auros, mintear kWh atestados → wrap a WATT → ofrecer spot a un agente de data center. La historia económica es descubrimiento más corto y settlement etiquetado — no una promesa de −12% de costes. El ahorro real depende del offtake, tarifas de red y counsel.",
  ctaLab: "Ejecutar el Energy Lab",
  howTitle: "Cómo funciona (breve)",
  howSteps: [
    "Contador / oráculo atestigua la producción",
    "Las unidades de recurso se mintean en un wallet lab o piloto",
    "Wrap opcional a WATT (unidad de cuenta energética 1:1)",
    "Spot / coberturas agent se liquidan con caps — humanos aprueban rutas de pago",
  ],
};

const AR: WhyMessages = {
  product: "AUROS",
  eyebrow: "لماذا Auros",
  title: "محرك سيولة واحد. موارد حرجة.",
  intro:
    "الفائدة أولاً — ثم آلية العمل. نبني أسواقاً مؤسساتية للأصول الرقمية وطبقة تسوية للطاقة والماء والحوسبة المرمّزة.",
  whyUsTitle: "لماذا نحن",
  benefits: [
    {
      who: "مؤسسة / منصة تداول",
      why: "سيولة منضبطة بالمخاطر وعروض توضيحية مُصنَّفة — بلا مسرح «موثوق به» مزيف.",
    },
    {
      who: "منتج طاقة / ماء",
      why: "بع الإنتاج المقاس كوحدات بمسار واضح: سكّ → تغليف → فوري — مع HITL للتسوية الحقيقية.",
    },
    {
      who: "مطوّر / وكيل ذكاء اصطناعي",
      why: "بروتوكول + واجهة وكلاء + محفظة مختبر يمكنك تجربتها اليوم دون ربط MetaMask.",
    },
  ],
  scenarioEyebrow: "سيناريو توضيحي · ليس حالة عميل · ليس نتيجة مضمونة",
  scenarioTitle: "مزرعة شمسية · 10 ميغاواط · إسقاط",
  scenarioBody:
    "موقع شمسي بقدرة 10 ميغاواط يبيع اليوم الفائض عبر عروض OTC غامضة يمكنه، في مسار مختبر Auros، سكّ كيلوواط ساعة موثّق → تغليف إلى WATT → عرض فوري لوكيل مركز بيانات. القصة الاقتصادية هي اكتشاف أقصر وتسوية مُصنَّفة — وليست وعداً بخفض التكاليف بنسبة 12٪. التوفير الحقيقي يعتمد على الشراء والطاقة الشبكية والمستشار القانوني.",
  ctaLab: "تشغيل Energy Lab",
  howTitle: "كيف يعمل (باختصار)",
  howSteps: [
    "العداد / الأوراكل يوثّق الإنتاج",
    "تُسك وحدات الموارد في محفظة مختبر أو تجريبية",
    "تغليف اختياري إلى WATT (وحدة حساب طاقة 1:1)",
    "الفوري / تحوطات الوكيل تُسوَّى بحدود — بشر يوافقون على المسارات المدفوعة",
  ],
};

const ZH: WhyMessages = {
  product: "AUROS",
  eyebrow: "为何选择 Auros",
  title: "一个流动性引擎。关键资源。",
  intro:
    "先讲收益，再讲机制。我们为数字资产构建机构级市场，并为代币化能源、水与算力提供结算层。",
  whyUsTitle: "为何是我们",
  benefits: [
    {
      who: "机构 / 交易所",
      why: "风险纪律下的流动性与已标注演示——不做虚假 “trusted by” 戏码。",
    },
    {
      who: "能源 / 水生产商",
      why: "将计量产量作为单位出售，路径清晰：铸造 → 包装 → 现货——真实结算走 HITL。",
    },
    {
      who: "开发者 / AI 代理",
      why: "协议 + 代理 API + 实验室钱包，今天即可操作，无需连接 MetaMask。",
    },
  ],
  scenarioEyebrow: "示意场景 · 非客户案例 · 非承诺结果",
  scenarioTitle: "光伏电站 · 10 MW · 推演",
  scenarioBody:
    "一座如今靠不透明 OTC 报价出售盈余的 10 MW 光伏电站，可在 Auros 实验室路径中铸造经证明的千瓦时 → 包装为 WATT → 向数据中心代理报出现货。经济叙事是更短的发现与已标注结算——并非承诺成本下降 12%。真实节省取决于购电、电网费用与法律顾问。",
  ctaLab: "运行 Energy Lab",
  howTitle: "工作原理（简述）",
  howSteps: [
    "表计 / 预言机证明产量",
    "资源单位铸造到实验室或试点钱包",
    "可选包装为 WATT（1:1 能源记账单位）",
    "现货 / 代理对冲在限额内结算——人类批准付费路径",
  ],
};

const CATALOG = localeCatalog({ fr: FR, en: EN, es: ES, ar: AR, zh: ZH });

export function getWhyMessages(locale: Locale): WhyMessages {
  return CATALOG[locale] ?? CATALOG.en;
}
