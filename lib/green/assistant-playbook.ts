/**
 * Personalized Green assistant playbook — max 3 next steps / suggestions (UX).
 * All user-facing strings follow locale (fr/en/es/ar/zh).
 */

import { getGreenAssistantUi } from "@/lib/green/assistant-i18n";
import {
  GREEN_COMPARE_ROUTE,
  GREEN_CSRD_CHECK_ROUTE,
  GREEN_LABEL_ROUTE,
  GREEN_RTMS_ASSISTANT_ROUTE,
  GREEN_STANDARDS_ROUTE,
} from "@/lib/green/constants";
import { localeCatalog, type Locale } from "@/lib/i18n";
import { WIZARD_EXPRESS_HREF } from "@/lib/wizard-routes";

export type GreenAssistantProfile = {
  role: string;
  asset: string;
  region: string;
};

export type GreenNextStep = {
  label: string;
  href: string;
  why: string;
};

const EAU_TRUST = "/eau/trust";
const EAU_CONTINUITY = "/eau/continuity";

type StepCopy = { label: string; why: string };
type Pack = {
  suggestions: Record<string, readonly [string, string, string]>;
  fallbacks: {
    buyer: readonly [string, string, string];
    risk: readonly [string, string, string];
    rse: readonly [string, string, string];
    dc: readonly [string, string, string];
    default: readonly [string, string, string];
  };
  steps: {
    dc: readonly [StepCopy, StepCopy, StepCopy];
    buyer: readonly [StepCopy, StepCopy, StepCopy];
    risk: readonly [StepCopy, StepCopy, StepCopy];
    rse: readonly [StepCopy, StepCopy, StepCopy];
    issuer: readonly [StepCopy, StepCopy, StepCopy];
  };
  mail: {
    subjectLine: (role: string, asset: string) => string;
    hello: string;
    body: (role: string, asset: string, region: string) => string;
    disclaimer: string;
    closing: string;
    regionPrefix: string;
  };
};

function withRegion(template: string, region: string): string {
  const r = region.trim();
  if (!r) return template.replace("{reg}", "");
  return template.replace("{reg}", ` (${r})`);
}

const FR: Pack = {
  suggestions: {
    "issuer:solar": [
      "Comment préparer un dossier RTMS pour un actif solaire{reg} ?",
      "Quelles preuves pour le label Green Verified ?",
      "Quel prochain pas avant le wizard express ?",
    ],
    "issuer:wind": [
      "Checklist RTMS pour un parc éolien{reg} ?",
      "Différence standards RTMS et label Verified ?",
      "Comment comparer mon dossier sur Green Compare ?",
    ],
    "issuer:dc": [
      "Comment lier eau et énergie pour un data center (WELHR) ?",
      "Quel score / preuve montrer à un acheteur corporate ?",
      "Par où commencer : trust eau ou RTMS énergie ?",
    ],
    "issuer:carbon": [
      "Comment lire CQS / qualité carbone sur AUROS Green ?",
      "Lien entre crédit carbone et label Green ?",
      "Prochain pas pour documenter un projet carbone ?",
    ],
    "buyer:solar": [
      "Que vérifier avant d’acheter un PPA / actif solaire tokenisé{reg} ?",
      "Comment comparer deux offres Green ?",
      "Où voir les preuves verify / registry ?",
    ],
    "buyer:dc": [
      "Comment évaluer la résilience eau-énergie d’un data center ?",
      "Quel brief montrer à mon risk desk ?",
      "Différence continuity playbook et score WELHR ?",
    ],
    "risk:solar": [
      "Quels disclaimers et preuves RTMS sont indicatifs seulement ?",
      "Comment auditer un export registry Green ?",
      "Liens utiles verify / Evidence Pack ?",
    ],
    "risk:dc": [
      "Cadre legal-risk eau pour un site data center ?",
      "Comment lire un continuity playbook AUROS ?",
      "Quelles preuves ne pas inventer (APY, partenaires) ?",
    ],
    "rse:solar": [
      "Comment préparer un check CSRD / impact report Green ?",
      "Que documenter pour un reporting RSE énergie ?",
      "Prochain pas Academy / standards RTMS ?",
    ],
    "rse:carbon": [
      "Comment expliquer CQS à mon comité RSE ?",
      "Impact report Green : à quoi ça sert ?",
      "Lien Nature Score / carbone ?",
    ],
  },
  fallbacks: {
    buyer: [
      "Comment comparer des offres Green en 3 critères ?",
      "Où vérifier un score ou un export registry ?",
      "Quel prochain pas pour un achat{reg} ?",
    ],
    risk: [
      "Quelles preuves AUROS sont vérifiables (verify) ?",
      "Comment lire un brief RTMS indicatif ?",
      "Risques à éviter : claims non sourcés ?",
    ],
    rse: [
      "CSRD check Green : par où commencer ?",
      "Différence label et marketplace ?",
      "Que mettre dans un reporting impact ?",
    ],
    dc: [
      "Parcours eau-énergie pour data center ?",
      "WELHR vs RTMS : lequel d’abord ?",
      "Prochain pas trust / continuity ?",
    ],
    default: [
      "Comment préparer un dossier RTMS ?",
      "Différence label Green et marketplace",
      "Quel prochain pas pour mon projet énergie ?",
    ],
  },
  steps: {
    dc: [
      { label: "Water Energy Trust", why: "Détecter le risque eau-énergie (indicatif)" },
      { label: "Continuity playbook", why: "Décider un plan résilience" },
      { label: "Pré-diag RTMS", why: "Si volet énergie renouvelable aussi" },
    ],
    buyer: [
      { label: "Comparer", why: "Lire les offres côte à côte" },
      { label: "Registry", why: "Voir projets / preuves listés" },
      { label: "Wizard express", why: "Structurer un besoin d’achat" },
    ],
    risk: [
      { label: "Standards RTMS", why: "Cadre Real / Transparent / Measurable / Sound" },
      { label: "Pré-diag RTMS", why: "Brief indicatif avant revue humaine" },
      { label: "Verify", why: "Contrôler une preuve exportée" },
    ],
    rse: [
      { label: "CSRD check", why: "Repères reporting (indicatif)" },
      { label: "Impact report", why: "Packer un récit impact" },
      { label: "Standards RTMS", why: "Aligner le langage preuves" },
    ],
    issuer: [
      { label: "Pré-diag RTMS", why: "3 priorités avant dossier complet" },
      { label: "Label Green", why: "Comprendre le parcours Verified" },
      { label: "Wizard express", why: "~parcours guidé émetteur" },
    ],
  },
  mail: {
    subjectLine: (role, asset) => `Objet : Prochaines étapes AUROS Green (${role} · ${asset})`,
    hello: "Bonjour,",
    body: (role, asset, region) =>
      `Suite à mon profil sur l’assistant Green AUROS (${role}, ${asset}${region}), voici 3 prochains pas indicatifs — à valider de mon côté :`,
    disclaimer:
      "Les analyses AUROS sont indicatives (pas de conseil juridique / financier). Je reste disponible pour affiner.",
    closing: "Cordialement",
    regionPrefix: " · région : ",
  },
};

const EN: Pack = {
  suggestions: {
    "issuer:solar": [
      "How do I prepare an RTMS file for a solar asset{reg}?",
      "What evidence for Green Verified label?",
      "What’s the next step before express wizard?",
    ],
    "issuer:wind": [
      "RTMS checklist for a wind farm{reg}?",
      "RTMS standards vs Verified label?",
      "How do I compare my file on Green Compare?",
    ],
    "issuer:dc": [
      "How to link water and energy for a data center (WELHR)?",
      "What score / proof to show a corporate buyer?",
      "Where to start: water trust or energy RTMS?",
    ],
    "issuer:carbon": [
      "How to read CQS / carbon quality on AUROS Green?",
      "Link between carbon credit and Green label?",
      "Next step to document a carbon project?",
    ],
    "buyer:solar": [
      "What to check before buying a tokenized solar / PPA{reg}?",
      "How to compare two Green offers?",
      "Where to see verify / registry proofs?",
    ],
    "buyer:dc": [
      "How to assess water-energy resilience of a data center?",
      "What brief to show my risk desk?",
      "Continuity playbook vs WELHR score?",
    ],
    "risk:solar": [
      "Which RTMS disclaimers / proofs are indicative only?",
      "How to audit a Green registry export?",
      "Useful verify / Evidence Pack links?",
    ],
    "risk:dc": [
      "Water legal-risk frame for a data center site?",
      "How to read an AUROS continuity playbook?",
      "What proofs not to invent (APY, partners)?",
    ],
    "rse:solar": [
      "How to prepare a Green CSRD / impact report check?",
      "What to document for energy ESG reporting?",
      "Next step Academy / RTMS standards?",
    ],
    "rse:carbon": [
      "How to explain CQS to my ESG committee?",
      "What is a Green impact report for?",
      "Nature Score / carbon link?",
    ],
  },
  fallbacks: {
    buyer: [
      "How to compare Green offers on 3 criteria?",
      "Where to verify a score or registry export?",
      "Next step for a purchase{reg}?",
    ],
    risk: [
      "Which AUROS proofs are verifiable (verify)?",
      "How to read an indicative RTMS brief?",
      "Risks to avoid: unsourced claims?",
    ],
    rse: [
      "Green CSRD check: where to start?",
      "Label vs marketplace?",
      "What to put in an impact report?",
    ],
    dc: [
      "Water-energy path for a data center?",
      "WELHR vs RTMS: which first?",
      "Next step trust / continuity?",
    ],
    default: [
      "How to prepare an RTMS file?",
      "Green label vs marketplace",
      "Next step for my energy project?",
    ],
  },
  steps: {
    dc: [
      { label: "Water Energy Trust", why: "Detect water-energy risk (indicative)" },
      { label: "Continuity playbook", why: "Decide a resilience plan" },
      { label: "RTMS pre-check", why: "If renewables apply too" },
    ],
    buyer: [
      { label: "Compare", why: "Read offers side by side" },
      { label: "Registry", why: "See listed projects / proofs" },
      { label: "Express wizard", why: "Structure a buy need" },
    ],
    risk: [
      { label: "RTMS standards", why: "Real / Transparent / Measurable / Sound" },
      { label: "RTMS pre-check", why: "Indicative brief before human review" },
      { label: "Verify", why: "Check an exported proof" },
    ],
    rse: [
      { label: "CSRD check", why: "Reporting landmarks (indicative)" },
      { label: "Impact report", why: "Package an impact narrative" },
      { label: "RTMS standards", why: "Align proof language" },
    ],
    issuer: [
      { label: "RTMS pre-check", why: "3 priorities before a full file" },
      { label: "Green label", why: "Understand the Verified path" },
      { label: "Express wizard", why: "~guided issuer path" },
    ],
  },
  mail: {
    subjectLine: (role, asset) => `Subject: AUROS Green next steps (${role} · ${asset})`,
    hello: "Hello,",
    body: (role, asset, region) =>
      `Following my profile on the AUROS Green assistant (${role}, ${asset}${region}), here are 3 indicative next steps — for me to validate:`,
    disclaimer:
      "AUROS analyses are indicative (not legal / financial advice). Happy to refine.",
    closing: "Best regards",
    regionPrefix: " · region: ",
  },
};

const ES: Pack = {
  suggestions: {
    "issuer:solar": [
      "¿Cómo preparar un expediente RTMS para un activo solar{reg}?",
      "¿Qué pruebas para el sello Green Verified?",
      "¿Siguiente paso antes del wizard express?",
    ],
    "issuer:wind": [
      "¿Checklist RTMS para un parque eólico{reg}?",
      "¿Diferencia estándares RTMS y sello Verified?",
      "¿Cómo comparar mi expediente en Green Compare?",
    ],
    "issuer:dc": [
      "¿Cómo vincular agua y energía para un data center (WELHR)?",
      "¿Qué score / prueba mostrar a un comprador corporativo?",
      "¿Por dónde empezar: trust agua o RTMS energía?",
    ],
    "issuer:carbon": [
      "¿Cómo leer CQS / calidad de carbono en AUROS Green?",
      "¿Vínculo entre crédito de carbono y sello Green?",
      "¿Siguiente paso para documentar un proyecto de carbono?",
    ],
    "buyer:solar": [
      "¿Qué verificar antes de comprar un PPA / solar tokenizado{reg}?",
      "¿Cómo comparar dos ofertas Green?",
      "¿Dónde ver pruebas verify / registry?",
    ],
    "buyer:dc": [
      "¿Cómo evaluar la resiliencia agua-energía de un data center?",
      "¿Qué brief mostrar a mi risk desk?",
      "¿Playbook de continuidad vs score WELHR?",
    ],
    "risk:solar": [
      "¿Qué disclaimers / pruebas RTMS son solo indicativos?",
      "¿Cómo auditar un export del registry Green?",
      "¿Enlaces útiles verify / Evidence Pack?",
    ],
    "risk:dc": [
      "¿Marco legal-risk del agua para un data center?",
      "¿Cómo leer un continuity playbook AUROS?",
      "¿Qué pruebas no inventar (APY, socios)?",
    ],
    "rse:solar": [
      "¿Cómo preparar un check CSRD / impact report Green?",
      "¿Qué documentar para reporting RSE energía?",
      "¿Siguiente paso Academy / estándares RTMS?",
    ],
    "rse:carbon": [
      "¿Cómo explicar CQS a mi comité RSE?",
      "¿Para qué sirve un impact report Green?",
      "¿Vínculo Nature Score / carbono?",
    ],
  },
  fallbacks: {
    buyer: [
      "¿Cómo comparar ofertas Green en 3 criterios?",
      "¿Dónde verificar un score o export registry?",
      "¿Siguiente paso para una compra{reg}?",
    ],
    risk: [
      "¿Qué pruebas AUROS son verificables (verify)?",
      "¿Cómo leer un brief RTMS indicativo?",
      "¿Riesgos a evitar: claims sin fuente?",
    ],
    rse: [
      "CSRD check Green: ¿por dónde empezar?",
      "¿Sello vs marketplace?",
      "¿Qué incluir en un reporting de impacto?",
    ],
    dc: [
      "¿Ruta agua-energía para data center?",
      "¿WELHR vs RTMS: cuál primero?",
      "¿Siguiente paso trust / continuity?",
    ],
    default: [
      "¿Cómo preparar un expediente RTMS?",
      "Sello Green vs marketplace",
      "¿Siguiente paso para mi proyecto energético?",
    ],
  },
  steps: {
    dc: [
      { label: "Water Energy Trust", why: "Detectar riesgo agua-energía (indicativo)" },
      { label: "Continuity playbook", why: "Decidir un plan de resiliencia" },
      { label: "Pre-diag RTMS", why: "Si también hay renovables" },
    ],
    buyer: [
      { label: "Comparar", why: "Leer ofertas lado a lado" },
      { label: "Registry", why: "Ver proyectos / pruebas listados" },
      { label: "Wizard express", why: "Estructurar una necesidad de compra" },
    ],
    risk: [
      { label: "Estándares RTMS", why: "Real / Transparent / Measurable / Sound" },
      { label: "Pre-diag RTMS", why: "Brief indicativo antes de revisión humana" },
      { label: "Verify", why: "Controlar una prueba exportada" },
    ],
    rse: [
      { label: "CSRD check", why: "Referencias de reporting (indicativo)" },
      { label: "Impact report", why: "Empaquetar un relato de impacto" },
      { label: "Estándares RTMS", why: "Alinear el lenguaje de pruebas" },
    ],
    issuer: [
      { label: "Pre-diag RTMS", why: "3 prioridades antes del expediente completo" },
      { label: "Sello Green", why: "Entender el recorrido Verified" },
      { label: "Wizard express", why: "~ruta guiada emisor" },
    ],
  },
  mail: {
    subjectLine: (role, asset) => `Asunto: Próximos pasos AUROS Green (${role} · ${asset})`,
    hello: "Hola,",
    body: (role, asset, region) =>
      `Tras mi perfil en el asistente Green AUROS (${role}, ${asset}${region}), aquí van 3 próximos pasos indicativos — a validar por mi parte:`,
    disclaimer:
      "Los análisis AUROS son indicativos (no consejo jurídico / financiero). Quedo disponible para afinar.",
    closing: "Saludos",
    regionPrefix: " · región: ",
  },
};

const AR: Pack = {
  suggestions: {
    "issuer:solar": [
      "كيف أجهّز ملف RTMS لأصل شمسي{reg}؟",
      "ما الأدلة لشارة Green Verified؟",
      "ما الخطوة التالية قبل معالج Express؟",
    ],
    "issuer:wind": [
      "قائمة RTMS لمزرعة رياح{reg}؟",
      "معايير RTMS مقابل شارة Verified؟",
      "كيف أقارن ملفي على Green Compare؟",
    ],
    "issuer:dc": [
      "كيف أربط الماء والطاقة لمركز بيانات (WELHR)؟",
      "أي درجة / دليل أعرضه لمشترٍ مؤسسي؟",
      "من أين أبدأ: ثقة الماء أم RTMS الطاقة؟",
    ],
    "issuer:carbon": [
      "كيف أقرأ CQS / جودة الكربون على AUROS Green؟",
      "العلاقة بين ائتمان الكربون وشارة Green؟",
      "الخطوة التالية لتوثيق مشروع كربون؟",
    ],
    "buyer:solar": [
      "ماذا أتحقق قبل شراء PPA / شمسي مُرمَّز{reg}؟",
      "كيف أقارن عرضَي Green؟",
      "أين أرى أدلة verify / السجل؟",
    ],
    "buyer:dc": [
      "كيف أقيّم مرونة الماء-الطاقة لمركز بيانات؟",
      "أي موجز أعرضه لمكتب المخاطر؟",
      "دليل الاستمرارية مقابل درجة WELHR؟",
    ],
    "risk:solar": [
      "أي تحفظات / أدلة RTMS إرشادية فقط؟",
      "كيف أدقق تصدير سجل Green؟",
      "روابط مفيدة verify / Evidence Pack؟",
    ],
    "risk:dc": [
      "إطار المخاطر القانونية للمياه لمركز بيانات؟",
      "كيف أقرأ دليل استمرارية AUROS؟",
      "ما الأدلة التي لا تُختلق (APY، شركاء)؟",
    ],
    "rse:solar": [
      "كيف أجهّز فحص CSRD / تقرير أثر Green؟",
      "ماذا أوثّق لتقارير ESG للطاقة؟",
      "الخطوة التالية Academy / معايير RTMS؟",
    ],
    "rse:carbon": [
      "كيف أشرح CQS للجنة ESG؟",
      "لماذا تقرير أثر Green؟",
      "رابط Nature Score / الكربون؟",
    ],
  },
  fallbacks: {
    buyer: [
      "كيف أقارن عروض Green بـ 3 معايير؟",
      "أين أتحقق من درجة أو تصدير سجل؟",
      "الخطوة التالية لشراء{reg}؟",
    ],
    risk: [
      "أي أدلة AUROS قابلة للتحقق (verify)؟",
      "كيف أقرأ موجز RTMS إرشادي؟",
      "مخاطر يجب تجنبها: ادعاءات بلا مصدر؟",
    ],
    rse: [
      "فحص CSRD Green: من أين أبدأ؟",
      "الشارة مقابل السوق؟",
      "ماذا أضع في تقرير الأثر؟",
    ],
    dc: [
      "مسار ماء-طاقة لمركز بيانات؟",
      "WELHR مقابل RTMS: أيهما أولاً؟",
      "الخطوة التالية trust / continuity؟",
    ],
    default: [
      "كيف أجهّز ملف RTMS؟",
      "شارة Green مقابل السوق",
      "الخطوة التالية لمشروعي الطاقوي؟",
    ],
  },
  steps: {
    dc: [
      { label: "Water Energy Trust", why: "اكتشاف مخاطر الماء-الطاقة (إرشادي)" },
      { label: "Continuity playbook", why: "قرار خطة مرونة" },
      { label: "فحص RTMS أولي", why: "إن وُجدت طاقة متجددة أيضاً" },
    ],
    buyer: [
      { label: "مقارنة", why: "قراءة العروض جنباً إلى جنب" },
      { label: "Registry", why: "عرض المشاريع / الأدلة المدرجة" },
      { label: "معالج Express", why: "هيكلة حاجة شراء" },
    ],
    risk: [
      { label: "معايير RTMS", why: "Real / Transparent / Measurable / Sound" },
      { label: "فحص RTMS أولي", why: "موجز إرشادي قبل مراجعة بشرية" },
      { label: "Verify", why: "التحقق من دليل مُصدَّر" },
    ],
    rse: [
      { label: "فحص CSRD", why: "معالم تقارير (إرشادي)" },
      { label: "تقرير أثر", why: "تجميع سرد الأثر" },
      { label: "معايير RTMS", why: "مواءمة لغة الأدلة" },
    ],
    issuer: [
      { label: "فحص RTMS أولي", why: "3 أولويات قبل الملف الكامل" },
      { label: "شارة Green", why: "فهم مسار Verified" },
      { label: "معالج Express", why: "~مسار مُصدِر موجّه" },
    ],
  },
  mail: {
    subjectLine: (role, asset) => `الموضوع: خطوات AUROS Green التالية (${role} · ${asset})`,
    hello: "مرحباً،",
    body: (role, asset, region) =>
      `بعد ملفي على مساعد AUROS Green (${role}، ${asset}${region})، إليك 3 خطوات إرشادية — لأتحقق منها:`,
    disclaimer:
      "تحليلات AUROS إرشادية (ليست استشارة قانونية / مالية). يسعدني التوضيح.",
    closing: "مع التحية",
    regionPrefix: " · المنطقة: ",
  },
};

const ZH: Pack = {
  suggestions: {
    "issuer:solar": [
      "如何为光伏资产准备 RTMS 材料{reg}？",
      "Green Verified 标签需要哪些证据？",
      "进入快捷向导前的下一步？",
    ],
    "issuer:wind": [
      "风电场 RTMS 清单{reg}？",
      "RTMS 标准与 Verified 标签的区别？",
      "如何在 Green Compare 上比较材料？",
    ],
    "issuer:dc": [
      "如何把数据中心的水与能源关联（WELHR）？",
      "向企业买方展示什么分数 / 证明？",
      "从哪里开始：水信任还是能源 RTMS？",
    ],
    "issuer:carbon": [
      "如何在 AUROS Green 上阅读 CQS / 碳质量？",
      "碳信用与 Green 标签的关系？",
      "记录碳项目的下一步？",
    ],
    "buyer:solar": [
      "购买代币化光伏 / PPA 前要核查什么{reg}？",
      "如何比较两个 Green 报价？",
      "在哪里查看 verify / 登记证明？",
    ],
    "buyer:dc": [
      "如何评估数据中心的水-能源韧性？",
      "向风控台展示什么简报？",
      "连续性手册与 WELHR 分数？",
    ],
    "risk:solar": [
      "哪些 RTMS 免责 / 证据仅为参考？",
      "如何审计 Green 登记导出？",
      "有用的 verify / Evidence Pack 链接？",
    ],
    "risk:dc": [
      "数据中心站点的水法律风险框架？",
      "如何阅读 AUROS 连续性手册？",
      "哪些证据不可编造（APY、合作伙伴）？",
    ],
    "rse:solar": [
      "如何准备 Green CSRD / 影响报告检查？",
      "能源 ESG 报告应记录什么？",
      "下一步 Academy / RTMS 标准？",
    ],
    "rse:carbon": [
      "如何向 ESG 委员会解释 CQS？",
      "Green 影响报告有何用途？",
      "Nature Score / 碳的关系？",
    ],
  },
  fallbacks: {
    buyer: [
      "如何用 3 个标准比较 Green 报价？",
      "在哪里核验分数或登记导出？",
      "采购的下一步{reg}？",
    ],
    risk: [
      "哪些 AUROS 证据可核验（verify）？",
      "如何阅读参考性 RTMS 简报？",
      "应避免的风险：无来源声明？",
    ],
    rse: [
      "Green CSRD 检查：从哪开始？",
      "标签与市场的区别？",
      "影响报告应写什么？",
    ],
    dc: [
      "数据中心的水-能源路径？",
      "WELHR 与 RTMS：先做哪个？",
      "下一步 trust / continuity？",
    ],
    default: [
      "如何准备 RTMS 材料？",
      "Green 标签与市场",
      "我的能源项目下一步？",
    ],
  },
  steps: {
    dc: [
      { label: "Water Energy Trust", why: "识别水-能源风险（参考性）" },
      { label: "Continuity playbook", why: "决定韧性方案" },
      { label: "RTMS 预检", why: "若也涉及可再生能源" },
    ],
    buyer: [
      { label: "比较", why: "并排阅读报价" },
      { label: "Registry", why: "查看已列项目 / 证据" },
      { label: "快捷向导", why: "梳理采购需求" },
    ],
    risk: [
      { label: "RTMS 标准", why: "Real / Transparent / Measurable / Sound" },
      { label: "RTMS 预检", why: "人工复核前的参考简报" },
      { label: "Verify", why: "核验已导出证明" },
    ],
    rse: [
      { label: "CSRD 检查", why: "报告参考点（参考性）" },
      { label: "影响报告", why: "打包影响叙事" },
      { label: "RTMS 标准", why: "对齐证据用语" },
    ],
    issuer: [
      { label: "RTMS 预检", why: "完整材料前的 3 项优先" },
      { label: "Green 标签", why: "理解 Verified 路径" },
      { label: "快捷向导", why: "~发行人引导路径" },
    ],
  },
  mail: {
    subjectLine: (role, asset) => `主题：AUROS Green 下一步（${role} · ${asset}）`,
    hello: "您好，",
    body: (role, asset, region) =>
      `根据我在 AUROS Green 助手上的画像（${role}、${asset}${region}），以下是 3 个参考性下一步——由我确认：`,
    disclaimer: "AUROS 分析仅供参考（非法律 / 财务建议）。欢迎进一步细化。",
    closing: "此致",
    regionPrefix: " · 地区：",
  },
};

const PACKS = localeCatalog({ fr: FR, en: EN, es: ES, ar: AR, zh: ZH });

function pack(locale: Locale): Pack {
  return PACKS[locale] ?? PACKS.fr;
}

function mapSteps(
  copies: readonly [StepCopy, StepCopy, StepCopy],
  hrefs: readonly [string, string, string]
): GreenNextStep[] {
  return copies.map((c, i) => ({
    label: c.label,
    why: c.why,
    href: hrefs[i]!,
  }));
}

/** Max 3 chat starter questions, tailored to role × asset × locale. */
export function greenAssistantSuggestions(
  p: GreenAssistantProfile,
  locale: Locale = "fr"
): string[] {
  const pck = pack(locale);
  const key = `${p.role}:${p.asset}`;
  const hit = pck.suggestions[key];
  if (hit) {
    return hit.map((s) => withRegion(s, p.region)).slice(0, 3);
  }
  if (p.role === "buyer") {
    return pck.fallbacks.buyer.map((s) => withRegion(s, p.region));
  }
  if (p.role === "risk") {
    return [...pck.fallbacks.risk];
  }
  if (p.role === "rse") {
    return [...pck.fallbacks.rse];
  }
  if (p.asset === "dc") {
    return [...pck.fallbacks.dc];
  }
  return [...pck.fallbacks.default];
}

/** Max 3 actionable CTAs — one job each. */
export function greenAssistantNextSteps(
  p: GreenAssistantProfile,
  locale: Locale = "fr"
): GreenNextStep[] {
  const pck = pack(locale);
  if (p.asset === "dc") {
    return mapSteps(pck.steps.dc, [
      EAU_TRUST,
      EAU_CONTINUITY,
      GREEN_RTMS_ASSISTANT_ROUTE,
    ]);
  }
  if (p.role === "buyer") {
    return mapSteps(pck.steps.buyer, [
      GREEN_COMPARE_ROUTE,
      "/green/registry",
      WIZARD_EXPRESS_HREF,
    ]);
  }
  if (p.role === "risk") {
    return mapSteps(pck.steps.risk, [
      GREEN_STANDARDS_ROUTE,
      GREEN_RTMS_ASSISTANT_ROUTE,
      "/verify",
    ]);
  }
  if (p.role === "rse") {
    return mapSteps(pck.steps.rse, [
      GREEN_CSRD_CHECK_ROUTE,
      "/green/impact-report",
      GREEN_STANDARDS_ROUTE,
    ]);
  }
  return mapSteps(pck.steps.issuer, [
    GREEN_RTMS_ASSISTANT_ROUTE,
    GREEN_LABEL_ROUTE,
    WIZARD_EXPRESS_HREF,
  ]);
}

function roleAssetLabels(
  p: GreenAssistantProfile,
  locale: Locale
): { role: string; asset: string } {
  const ui = getGreenAssistantUi(locale);
  const role =
    p.role === "buyer"
      ? ui.roles.buyer
      : p.role === "risk"
        ? ui.roles.risk
        : p.role === "rse"
          ? ui.roles.rse
          : ui.roles.issuer;
  const asset =
    p.asset === "solar"
      ? ui.assets.solar
      : p.asset === "wind"
        ? ui.assets.wind
        : p.asset === "dc"
          ? ui.assets.dc
          : p.asset === "carbon"
            ? ui.assets.carbon
            : ui.assets.other;
  return { role, asset };
}

/** HITL: user copies; ops may refine later. Never auto-send. */
export function greenAssistantMailDraft(
  p: GreenAssistantProfile,
  locale: Locale = "fr"
): string {
  const pck = pack(locale);
  const steps = greenAssistantNextSteps(p, locale);
  const { role, asset } = roleAssetLabels(p, locale);
  const region = p.region.trim()
    ? `${pck.mail.regionPrefix}${p.region.trim()}`
    : "";

  const lines = steps
    .map((s, i) => {
      const url = s.href.startsWith("http")
        ? s.href
        : `https://getauros.com${s.href}`;
      return `${i + 1}. ${s.label} — ${s.why}\n   ${url}`;
    })
    .join("\n");

  return `${pck.mail.subjectLine(role, asset)}

${pck.mail.hello}

${pck.mail.body(role, asset, region)}

${lines}

${pck.mail.disclaimer}

${pck.mail.closing}`;
}

export function greenAssistantRoleAssetLabels(
  p: GreenAssistantProfile,
  locale: Locale
): { role: string; asset: string } {
  return roleAssetLabels(p, locale);
}
