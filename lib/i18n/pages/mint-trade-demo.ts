import { localeCatalog, type Locale } from "@/lib/i18n";

export type MintTradeDemoMessages = {
  ariaLabel: string;
  header: string;
  footer: string;
  steps: readonly { id: string; label: string; detail: string }[];
};

const EN: MintTradeDemoMessages = {
  ariaLabel: "Animated lab demo: meter to trade",
  header: "Animation · lab · not a live fill",
  footer:
    "Sequence repeats: attested production → mint → order → labeled demo fill. Run the real loop on /lab → /producer → /trade.",
  steps: [
    { id: "meter", label: "Meter signs", detail: "IoT ECDSA · 250 Wh" },
    { id: "mint", label: "Oracle mints", detail: "akWh → producer" },
    { id: "book", label: "Agent orders", detail: "Forward 2.4 MWh" },
    { id: "fill", label: "Market fills", detail: "HITL · demo settle" },
  ],
};

const FR: MintTradeDemoMessages = {
  ariaLabel: "Démo lab animée : compteur vers trade",
  header: "Animation · lab · pas un fill live",
  footer:
    "La séquence se répète : production attestée → mint → ordre → fill démo labellisé. Boucle réelle sur /lab → /producer → /trade.",
  steps: [
    { id: "meter", label: "Compteur signe", detail: "IoT ECDSA · 250 Wh" },
    { id: "mint", label: "Oracle mint", detail: "akWh → producer" },
    { id: "book", label: "Agent ordonne", detail: "Forward 2,4 MWh" },
    { id: "fill", label: "Marché fill", detail: "HITL · settle démo" },
  ],
};

const ES: MintTradeDemoMessages = {
  ariaLabel: "Demo lab animada: contador a trade",
  header: "Animación · lab · no es un fill en vivo",
  footer:
    "La secuencia se repite: producción atestada → mint → orden → fill demo etiquetado. Bucle real en /lab → /producer → /trade.",
  steps: [
    { id: "meter", label: "Contador firma", detail: "IoT ECDSA · 250 Wh" },
    { id: "mint", label: "Oráculo mintea", detail: "akWh → producer" },
    { id: "book", label: "Agent ordena", detail: "Forward 2,4 MWh" },
    { id: "fill", label: "Mercado ejecuta", detail: "HITL · settle demo" },
  ],
};

const AR: MintTradeDemoMessages = {
  ariaLabel: "عرض مختبر متحرك: من العداد إلى التداول",
  header: "حركة · مختبر · ليس تنفيذاً حياً",
  footer:
    "تتكرر السلسلة: إنتاج موثّق → سكّ → أمر → تنفيذ تجريبي مُصنَّف. الحلقة الحقيقية على /lab → /producer → /trade.",
  steps: [
    { id: "meter", label: "العداد يوقّع", detail: "IoT ECDSA · 250 Wh" },
    { id: "mint", label: "الأوراكل يسكّ", detail: "akWh → producer" },
    { id: "book", label: "الوكيل يطلب", detail: "آجل 2.4 MWh" },
    { id: "fill", label: "السوق ينفّذ", detail: "HITL · تسوية تجريبية" },
  ],
};

const ZH: MintTradeDemoMessages = {
  ariaLabel: "实验室动画演示：从表计到交易",
  header: "动画 · 实验室 · 非实时成交",
  footer:
    "序列循环：经证明产量 → 铸造 → 下单 → 已标注演示成交。真实闭环：/lab → /producer → /trade。",
  steps: [
    { id: "meter", label: "表计签名", detail: "IoT ECDSA · 250 Wh" },
    { id: "mint", label: "预言机铸造", detail: "akWh → producer" },
    { id: "book", label: "代理下单", detail: "远期 2.4 MWh" },
    { id: "fill", label: "市场成交", detail: "HITL · 演示结算" },
  ],
};

const CATALOG = localeCatalog({ fr: FR, en: EN, es: ES, ar: AR, zh: ZH });

export function getMintTradeDemoMessages(locale: Locale): MintTradeDemoMessages {
  return CATALOG[locale] ?? CATALOG.en;
}
