import { localeCatalog, type Locale } from "@/lib/i18n";
import type { CopilotPageContext } from "@/lib/copilot/types";

export type CopilotUi = {
  defaultEyebrow: string;
  defaultTitle: string;
  defaultIntro: string;
  emptyHint: string;
  loading: string;
  messageLabel: string;
  placeholder: string;
  send: string;
  errorStatus: (status: number) => string;
  networkError: string;
  proposedRwa: string;
  addToCompare: string;
  /** Device session memory — not marketing consent. */
  memoryConsent: string;
  banners: {
    watts: string;
    chargeflow: string;
    green: string;
    rtms: string;
    jurisdictionWithId: (id: string) => string;
    jurisdiction: string;
    compareWithIds: (ids: string) => string;
    compare: string;
  };
};

const FR: CopilotUi = {
  defaultEyebrow: "Copilot",
  defaultTitle: "Assistant AUROS",
  defaultIntro:
    "Posez une question sur le comparateur RWA, Green, les juridictions, le Protocol ou ChargeFlow. Réponses sourcées — indicatif uniquement, pas de conseil juridique.",
  emptyHint: "Choisissez une suggestion ou tapez votre question.",
  loading: "Chargement Copilot…",
  messageLabel: "Message",
  placeholder: "Votre question…",
  send: "Envoyer",
  errorStatus: (s) => `Erreur ${s}`,
  networkError: "Erreur réseau",
  proposedRwa: "RWA proposés",
  addToCompare: "Ajouter au comparateur →",
  memoryConsent:
    "Mémoriser cette conversation sur cet appareil (session uniquement) — aucun e-mail automatique.",
  banners: {
    watts: "Contexte : Watts Reserve",
    chargeflow: "Contexte : ChargeFlow",
    green: "Contexte : AUROS Green",
    rtms: "Contexte : RTMS",
    jurisdictionWithId: (id) => `Contexte : juridiction · ${id}`,
    jurisdiction: "Contexte : juridictions",
    compareWithIds: (ids) => `Contexte : compare · ${ids}`,
    compare: "Contexte : comparateur RWA",
  },
};

const EN: CopilotUi = {
  defaultEyebrow: "Copilot",
  defaultTitle: "AUROS assistant",
  defaultIntro:
    "Ask about the RWA comparator, Green, jurisdictions, Protocol or ChargeFlow. Sourced answers — indicative only, not legal advice.",
  emptyHint: "Pick a suggestion or type your question.",
  loading: "Loading Copilot…",
  messageLabel: "Message",
  placeholder: "Your question…",
  send: "Send",
  errorStatus: (s) => `Error ${s}`,
  networkError: "Network error",
  proposedRwa: "Suggested RWA",
  addToCompare: "Add to comparator →",
  memoryConsent:
    "Remember this chat on this device (session only) — no automatic emails.",
  banners: {
    watts: "Context: Watts Reserve",
    chargeflow: "Context: ChargeFlow",
    green: "Context: AUROS Green",
    rtms: "Context: RTMS",
    jurisdictionWithId: (id) => `Context: jurisdiction · ${id}`,
    jurisdiction: "Context: jurisdictions",
    compareWithIds: (ids) => `Context: compare · ${ids}`,
    compare: "Context: RWA comparator",
  },
};

const ES: CopilotUi = {
  defaultEyebrow: "Copilot",
  defaultTitle: "Asistente AUROS",
  defaultIntro:
    "Pregunte sobre el comparador RWA, Green, jurisdicciones, Protocol o ChargeFlow. Respuestas con fuentes — solo indicativo, no consejo jurídico.",
  emptyHint: "Elija una sugerencia o escriba su pregunta.",
  loading: "Cargando Copilot…",
  messageLabel: "Mensaje",
  placeholder: "Su pregunta…",
  send: "Enviar",
  errorStatus: (s) => `Error ${s}`,
  networkError: "Error de red",
  proposedRwa: "RWA propuestos",
  addToCompare: "Añadir al comparador →",
  memoryConsent:
    "Recordar este chat en este dispositivo (solo sesión) — sin correos automáticos.",
  banners: {
    watts: "Contexto: Watts Reserve",
    chargeflow: "Contexto: ChargeFlow",
    green: "Contexto: AUROS Green",
    rtms: "Contexto: RTMS",
    jurisdictionWithId: (id) => `Contexto: jurisdicción · ${id}`,
    jurisdiction: "Contexto: jurisdicciones",
    compareWithIds: (ids) => `Contexto: compare · ${ids}`,
    compare: "Contexto: comparador RWA",
  },
};

const AR: CopilotUi = {
  defaultEyebrow: "Copilot",
  defaultTitle: "مساعد AUROS",
  defaultIntro:
    "اسأل عن مقارن RWA أو Green أو الولايات القضائية أو Protocol أو ChargeFlow. إجابات بمصادر — إرشادية فقط، ليست استشارة قانونية.",
  emptyHint: "اختر اقتراحاً أو اكتب سؤالك.",
  loading: "جارٍ تحميل Copilot…",
  messageLabel: "رسالة",
  placeholder: "سؤالك…",
  send: "إرسال",
  errorStatus: (s) => `خطأ ${s}`,
  networkError: "خطأ في الشبكة",
  proposedRwa: "RWA مقترحة",
  addToCompare: "إضافة إلى المقارن ←",
  memoryConsent:
    "حفظ هذه المحادثة على هذا الجهاز (للجلسة فقط) — بدون رسائل بريد تلقائية.",
  banners: {
    watts: "السياق: Watts Reserve",
    chargeflow: "السياق: ChargeFlow",
    green: "السياق: AUROS Green",
    rtms: "السياق: RTMS",
    jurisdictionWithId: (id) => `السياق: ولاية · ${id}`,
    jurisdiction: "السياق: ولايات قضائية",
    compareWithIds: (ids) => `السياق: مقارنة · ${ids}`,
    compare: "السياق: مقارن RWA",
  },
};

const ZH: CopilotUi = {
  defaultEyebrow: "Copilot",
  defaultTitle: "AUROS 助手",
  defaultIntro:
    "可询问 RWA 比较器、Green、司法辖区、Protocol 或 ChargeFlow。有来源的回答——仅供参考，非法律建议。",
  emptyHint: "选择建议或输入问题。",
  loading: "正在加载 Copilot…",
  messageLabel: "消息",
  placeholder: "您的问题…",
  send: "发送",
  errorStatus: (s) => `错误 ${s}`,
  networkError: "网络错误",
  proposedRwa: "建议的 RWA",
  addToCompare: "加入比较器 →",
  memoryConsent: "在此设备记住本次对话（仅会话）— 不会自动发邮件。",
  banners: {
    watts: "上下文：Watts Reserve",
    chargeflow: "上下文：ChargeFlow",
    green: "上下文：AUROS Green",
    rtms: "上下文：RTMS",
    jurisdictionWithId: (id) => `上下文：辖区 · ${id}`,
    jurisdiction: "上下文：辖区",
    compareWithIds: (ids) => `上下文：比较 · ${ids}`,
    compare: "上下文：RWA 比较器",
  },
};

const UI = localeCatalog({ fr: FR, en: EN, es: ES, ar: AR, zh: ZH });

export function getCopilotUi(locale: Locale): CopilotUi {
  return UI[locale] ?? UI.fr;
}

export function copilotBannerLabel(
  ctx: CopilotPageContext,
  locale: Locale
): string | null {
  const b = getCopilotUi(locale).banners;
  if (ctx.surface === "watts") return b.watts;
  if (ctx.surface === "chargeflow") return b.chargeflow;
  if (ctx.surface === "green") return b.green;
  if (ctx.surface === "rtms") return b.rtms;
  if (ctx.jurisdiction_id) return b.jurisdictionWithId(ctx.jurisdiction_id);
  if (ctx.surface === "jurisdiction") return b.jurisdiction;
  if (ctx.surface === "compare" && ctx.product_ids?.length) {
    return b.compareWithIds(ctx.product_ids.join(", "));
  }
  if (ctx.surface === "compare") return b.compare;
  return null;
}

type SuggestionPack = Record<
  string,
  readonly [string, string, string] | ((ctx: CopilotPageContext) => string[])
>;

const SUG_FR: SuggestionPack = {
  watts: [
    "Qu’est-ce qu’AUROS Watts ?",
    "Différence firm vs flex (CFU-E / CFU-F) ?",
    "Comment passer de réservation à listing secondaire ?",
  ],
  chargeflow: [
    "Qu’est-ce que ChargeFlow CFU-E ?",
    "Différence CFU-E / CFU-W / CFU-F ?",
    "Comment fonctionne la console opérateurs ?",
  ],
  green: [
    "Explique CQS et Watt Score",
    "Comment préparer un dossier RTMS ?",
    "Différence label Green et marketplace",
  ],
  rtms: [
    "Que manque-t-il pour le label Green Verified ?",
    "Priorise 3 écarts RTMS sur mon brief",
    "Prochaines étapes standards + label",
  ],
  jurisdiction_id: (ctx) => [
    `Pourquoi considérer ${ctx.jurisdiction_id} pour un RWA ?`,
    `Coûts et délais indicatifs pour ${ctx.jurisdiction_id}`,
    "Comparer les top juridictions AUROS",
  ],
  compare_ids: (ctx) => [
    `Compare ${ctx.product_ids!.slice(0, 2).join(" et ")}`,
    "Propose 1–2 RWA à ajouter à la comparaison",
    "Quels risques / liquidité pour cette sélection ?",
  ],
  compare: [
    "Propose des RWA à comparer (stablecoins)",
    "Top stablecoins APY sur le comparateur",
    "Comment lire TVL et liquidité ?",
  ],
  generic: [
    "Propose des RWA à comparer",
    "Explique ChargeFlow CFU-E",
    "Explique CQS et Watt Score",
  ],
};

const SUG_EN: SuggestionPack = {
  watts: [
    "What is AUROS Watts?",
    "Firm vs flex (CFU-E / CFU-F)?",
    "From reservation to secondary listing?",
  ],
  chargeflow: [
    "What is ChargeFlow CFU-E?",
    "CFU-E / CFU-W / CFU-F differences?",
    "How does the operator console work?",
  ],
  green: [
    "Explain CQS and Watt Score",
    "How to prepare an RTMS file?",
    "Green label vs marketplace",
  ],
  rtms: [
    "What’s missing for Green Verified?",
    "Prioritize 3 RTMS gaps on my brief",
    "Next steps: standards + label",
  ],
  jurisdiction_id: (ctx) => [
    `Why consider ${ctx.jurisdiction_id} for an RWA?`,
    `Indicative costs and timelines for ${ctx.jurisdiction_id}`,
    "Compare top AUROS jurisdictions",
  ],
  compare_ids: (ctx) => [
    `Compare ${ctx.product_ids!.slice(0, 2).join(" and ")}`,
    "Suggest 1–2 RWA to add to the comparison",
    "Risks / liquidity for this selection?",
  ],
  compare: [
    "Suggest RWA to compare (stablecoins)",
    "Top stablecoin APYs on the comparator",
    "How to read TVL and liquidity?",
  ],
  generic: [
    "Suggest RWA to compare",
    "Explain ChargeFlow CFU-E",
    "Explain CQS and Watt Score",
  ],
};

const SUG_ES: SuggestionPack = {
  watts: [
    "¿Qué es AUROS Watts?",
    "¿Diferencia firm vs flex (CFU-E / CFU-F)?",
    "¿De reserva a listing secundario?",
  ],
  chargeflow: [
    "¿Qué es ChargeFlow CFU-E?",
    "¿Diferencia CFU-E / CFU-W / CFU-F?",
    "¿Cómo funciona la consola de operadores?",
  ],
  green: [
    "Explica CQS y Watt Score",
    "¿Cómo preparar un expediente RTMS?",
    "Sello Green vs marketplace",
  ],
  rtms: [
    "¿Qué falta para Green Verified?",
    "Prioriza 3 gaps RTMS en mi brief",
    "Próximos pasos: estándares + sello",
  ],
  jurisdiction_id: (ctx) => [
    `¿Por qué considerar ${ctx.jurisdiction_id} para un RWA?`,
    `Costes y plazos indicativos para ${ctx.jurisdiction_id}`,
    "Comparar las top jurisdicciones AUROS",
  ],
  compare_ids: (ctx) => [
    `Compara ${ctx.product_ids!.slice(0, 2).join(" y ")}`,
    "Propón 1–2 RWA para añadir a la comparación",
    "¿Riesgos / liquidez de esta selección?",
  ],
  compare: [
    "Propón RWA a comparar (stablecoins)",
    "Top APY stablecoins en el comparador",
    "¿Cómo leer TVL y liquidez?",
  ],
  generic: [
    "Propón RWA a comparar",
    "Explica ChargeFlow CFU-E",
    "Explica CQS y Watt Score",
  ],
};

const SUG_AR: SuggestionPack = {
  watts: [
    "ما هو AUROS Watts؟",
    "الفرق firm مقابل flex (CFU-E / CFU-F)؟",
    "من الحجز إلى الإدراج الثانوي؟",
  ],
  chargeflow: [
    "ما هو ChargeFlow CFU-E؟",
    "الفرق CFU-E / CFU-W / CFU-F؟",
    "كيف تعمل وحدة تحكم المشغّلين؟",
  ],
  green: [
    "اشرح CQS وWatt Score",
    "كيف أجهّز ملف RTMS؟",
    "شارة Green مقابل السوق",
  ],
  rtms: [
    "ما الناقص لـ Green Verified؟",
    "رتّب 3 فجوات RTMS في موجزي",
    "الخطوات التالية: معايير + شارة",
  ],
  jurisdiction_id: (ctx) => [
    `لماذا أختار ${ctx.jurisdiction_id} لـ RWA؟`,
    `تكاليف ومدد إرشادية لـ ${ctx.jurisdiction_id}`,
    "قارن أبرز ولايات AUROS",
  ],
  compare_ids: (ctx) => [
    `قارن ${ctx.product_ids!.slice(0, 2).join(" و ")}`,
    "اقترح 1–2 RWA لإضافتها للمقارنة",
    "مخاطر / سيولة هذا الاختيار؟",
  ],
  compare: [
    "اقترح RWA للمقارنة (عملات مستقرة)",
    "أعلى APY للعملات المستقرة في المقارن",
    "كيف أقرأ TVL والسيولة؟",
  ],
  generic: [
    "اقترح RWA للمقارنة",
    "اشرح ChargeFlow CFU-E",
    "اشرح CQS وWatt Score",
  ],
};

const SUG_ZH: SuggestionPack = {
  watts: [
    "什么是 AUROS Watts？",
    "firm 与 flex（CFU-E / CFU-F）有何区别？",
    "如何从预留到二级挂牌？",
  ],
  chargeflow: [
    "什么是 ChargeFlow CFU-E？",
    "CFU-E / CFU-W / CFU-F 有何区别？",
    "运营控制台如何工作？",
  ],
  green: [
    "解释 CQS 与 Watt Score",
    "如何准备 RTMS 材料？",
    "Green 标签与市场的区别",
  ],
  rtms: [
    "Green Verified 还缺什么？",
    "根据我的简报排出 3 个 RTMS 缺口",
    "下一步：标准 + 标签",
  ],
  jurisdiction_id: (ctx) => [
    `为何考虑 ${ctx.jurisdiction_id} 做 RWA？`,
    `${ctx.jurisdiction_id} 的参考成本与周期`,
    "比较 AUROS 主要辖区",
  ],
  compare_ids: (ctx) => [
    `比较 ${ctx.product_ids!.slice(0, 2).join(" 与 ")}`,
    "建议再加 1–2 个 RWA 到比较",
    "该选择的风险 / 流动性？",
  ],
  compare: [
    "建议可比较的 RWA（稳定币）",
    "比较器上稳定币 APY 靠前者",
    "如何阅读 TVL 与流动性？",
  ],
  generic: [
    "建议可比较的 RWA",
    "解释 ChargeFlow CFU-E",
    "解释 CQS 与 Watt Score",
  ],
};

const SUG = localeCatalog({
  fr: SUG_FR,
  en: SUG_EN,
  es: SUG_ES,
  ar: SUG_AR,
  zh: SUG_ZH,
});

export function suggestionsForContext(
  ctx: CopilotPageContext,
  locale: Locale = "fr"
): string[] {
  return localizedSuggestionsForContext(ctx, locale);
}

export function localizedSuggestionsForContext(
  ctx: CopilotPageContext,
  locale: Locale = "fr"
): string[] {
  const pack = SUG[locale] ?? SUG.fr;
  const resolve = (key: string): string[] => {
    const v = pack[key];
    if (!v) return [...(pack.generic as readonly [string, string, string])];
    if (typeof v === "function") return v(ctx).slice(0, 3);
    return [...v];
  };

  if (ctx.surface === "watts") return resolve("watts");
  if (ctx.surface === "chargeflow") return resolve("chargeflow");
  if (ctx.surface === "green") return resolve("green");
  if (ctx.surface === "rtms") return resolve("rtms");
  if (ctx.surface === "jurisdiction" && ctx.jurisdiction_id) {
    return resolve("jurisdiction_id");
  }
  if (ctx.surface === "compare" && ctx.product_ids && ctx.product_ids.length >= 2) {
    return resolve("compare_ids");
  }
  if (ctx.surface === "compare") return resolve("compare");
  return resolve("generic");
}
