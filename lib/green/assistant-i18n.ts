import { localeCatalog, type Locale } from "@/lib/i18n";

export type GreenAssistantUi = {
  eyebrow: string;
  title: string;
  intro: string;
  roleLabel: string;
  assetLabel: string;
  regionLabel: string;
  regionPlaceholder: string;
  nextStepsTitle: string;
  copyMail: string;
  mailCopied: string;
  freemiumTitle: string;
  freemiumBullets: readonly [string, string];
  apiCta: string;
  pricingLink: string;
  navAssistant: string;
  fabEyebrow: string;
  fabTitle: string;
  fabAria: string;
  roles: {
    issuer: string;
    buyer: string;
    risk: string;
    rse: string;
  };
  assets: {
    solar: string;
    wind: string;
    dc: string;
    carbon: string;
    other: string;
  };
};

const FR: GreenAssistantUi = {
  eyebrow: "Green · Assistant gratuit",
  title: "Votre prochain pas, pas un discours",
  intro:
    "Profil → 3 questions adaptées → 3 actions concrètes. Analyses indicatives. Brouillon mail à copier (vous envoyez). Volume API / sièges : Green API Premium.",
  roleLabel: "Rôle",
  assetLabel: "Actif",
  regionLabel: "Région (opt.)",
  regionPlaceholder: "ex. France, Texas…",
  nextStepsTitle: "3 prochains pas",
  copyMail: "Copier un mail de prochaines étapes →",
  mailCopied: "Brouillon mail copié",
  freemiumTitle: "Gratuit pour aider · Premium pour scaler",
  freemiumBullets: [
    "— Chat + playbook perso + brouillon mail (vous envoyez)",
    "— Entreprises : quotas API, webhooks, sièges, SLA",
  ],
  apiCta: "Green API",
  pricingLink: "Tarifs →",
  navAssistant: "Assistant IA",
  fabEyebrow: "Aide IA",
  fabTitle: "Prochain pas Green",
  fabAria: "Ouvrir l’assistant Green IA",
  roles: {
    issuer: "Émetteur / producteur",
    buyer: "Acheteur corporate",
    risk: "Risk / counsel",
    rse: "RSE / reporting",
  },
  assets: {
    solar: "Solaire / PPA",
    wind: "Éolien",
    dc: "Data center / eau-énergie",
    carbon: "Carbone / crédit",
    other: "Autre RWA vert",
  },
};

const EN: GreenAssistantUi = {
  eyebrow: "Green · Free assistant",
  title: "Your next step, not a speech",
  intro:
    "Profile → 3 tailored questions → 3 concrete actions. Indicative only. Copy a mail draft (you send). API volume / seats: Green API Premium.",
  roleLabel: "Role",
  assetLabel: "Asset",
  regionLabel: "Region (opt.)",
  regionPlaceholder: "e.g. France, Texas…",
  nextStepsTitle: "3 next steps",
  copyMail: "Copy a next-steps email →",
  mailCopied: "Mail draft copied",
  freemiumTitle: "Free to help · Premium to scale",
  freemiumBullets: [
    "— Chat + personal playbook + mail draft (you send)",
    "— Enterprises: API quotas, webhooks, team seats, SLA",
  ],
  apiCta: "Green API",
  pricingLink: "Pricing →",
  navAssistant: "AI assistant",
  fabEyebrow: "AI help",
  fabTitle: "Green next step",
  fabAria: "Open the Green AI assistant",
  roles: {
    issuer: "Issuer / producer",
    buyer: "Corporate buyer",
    risk: "Risk / counsel",
    rse: "ESG / reporting",
  },
  assets: {
    solar: "Solar / PPA",
    wind: "Wind",
    dc: "Data center / water-energy",
    carbon: "Carbon / credit",
    other: "Other green RWA",
  },
};

const ES: GreenAssistantUi = {
  eyebrow: "Green · Asistente gratuito",
  title: "Su próximo paso, no un discurso",
  intro:
    "Perfil → 3 preguntas adaptadas → 3 acciones concretas. Indicativo. Borrador de correo para copiar (usted envía). Volumen API / asientos: Green API Premium.",
  roleLabel: "Rol",
  assetLabel: "Activo",
  regionLabel: "Región (opc.)",
  regionPlaceholder: "ej. Francia, Texas…",
  nextStepsTitle: "3 próximos pasos",
  copyMail: "Copiar un correo de próximos pasos →",
  mailCopied: "Borrador copiado",
  freemiumTitle: "Gratis para ayudar · Premium para escalar",
  freemiumBullets: [
    "— Chat + playbook personal + borrador de correo (usted envía)",
    "— Empresas: cuotas API, webhooks, asientos, SLA",
  ],
  apiCta: "Green API",
  pricingLink: "Precios →",
  navAssistant: "Asistente IA",
  fabEyebrow: "Ayuda IA",
  fabTitle: "Próximo paso Green",
  fabAria: "Abrir el asistente Green IA",
  roles: {
    issuer: "Emisor / productor",
    buyer: "Comprador corporativo",
    risk: "Risk / counsel",
    rse: "RSE / reporting",
  },
  assets: {
    solar: "Solar / PPA",
    wind: "Eólico",
    dc: "Data center / agua-energía",
    carbon: "Carbono / crédito",
    other: "Otro RWA verde",
  },
};

const AR: GreenAssistantUi = {
  eyebrow: "Green · مساعد مجاني",
  title: "خطوتك التالية، لا خطاب",
  intro:
    "ملف → 3 أسئلة مخصصة → 3 إجراءات. إرشادي فقط. انسخ مسودة بريد (أنت ترسل). حجم API / المقاعد: Green API Premium.",
  roleLabel: "الدور",
  assetLabel: "الأصل",
  regionLabel: "المنطقة (اختياري)",
  regionPlaceholder: "مثال: فرنسا، تكساس…",
  nextStepsTitle: "3 خطوات تالية",
  copyMail: "نسخ بريد بالخطوات التالية ←",
  mailCopied: "تم نسخ المسودة",
  freemiumTitle: "مجاني للمساعدة · Premium للتوسع",
  freemiumBullets: [
    "— دردشة + دليل شخصي + مسودة بريد (أنت ترسل)",
    "— للمؤسسات: حصص API وwebhooks ومقاعد وSLA",
  ],
  apiCta: "Green API",
  pricingLink: "الأسعار ←",
  navAssistant: "مساعد ذكي",
  fabEyebrow: "مساعدة ذكية",
  fabTitle: "خطوة Green التالية",
  fabAria: "فتح مساعد Green الذكي",
  roles: {
    issuer: "مُصدِر / منتج",
    buyer: "مشتري مؤسسي",
    risk: "مخاطر / مستشار",
    rse: "ESG / تقارير",
  },
  assets: {
    solar: "شمسي / PPA",
    wind: "رياح",
    dc: "مركز بيانات / ماء-طاقة",
    carbon: "كربون / ائتمان",
    other: "RWA أخضر آخر",
  },
};

const ZH: GreenAssistantUi = {
  eyebrow: "Green · 免费助手",
  title: "下一步行动，不是长篇大论",
  intro:
    "画像 → 3 个定制问题 → 3 个具体动作。仅供参考。复制邮件草稿（由您发送）。API 额度 / 席位：Green API Premium。",
  roleLabel: "角色",
  assetLabel: "资产",
  regionLabel: "地区（可选）",
  regionPlaceholder: "例如 法国、得州…",
  nextStepsTitle: "3 个下一步",
  copyMail: "复制下一步邮件 →",
  mailCopied: "邮件草稿已复制",
  freemiumTitle: "免费助你推进 · Premium 助你规模化",
  freemiumBullets: [
    "— 聊天 + 个性化手册 + 邮件草稿（由您发送）",
    "— 企业：API 配额、webhooks、席位、SLA",
  ],
  apiCta: "Green API",
  pricingLink: "定价 →",
  navAssistant: "AI 助手",
  fabEyebrow: "AI 帮助",
  fabTitle: "Green 下一步",
  fabAria: "打开 Green AI 助手",
  roles: {
    issuer: "发行人 / 生产商",
    buyer: "企业买方",
    risk: "风控 / 法务",
    rse: "ESG / 报告",
  },
  assets: {
    solar: "光伏 / PPA",
    wind: "风电",
    dc: "数据中心 / 水-能源",
    carbon: "碳 / 信用",
    other: "其他绿色 RWA",
  },
};

const UI = localeCatalog({ fr: FR, en: EN, es: ES, ar: AR, zh: ZH });

export function getGreenAssistantUi(locale: Locale): GreenAssistantUi {
  return UI[locale] ?? UI.fr;
}
