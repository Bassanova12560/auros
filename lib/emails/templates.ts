import type { Locale } from "@/lib/i18n";
import {
  localizedConciergeUserEmail,
  localizedLeadScoreEmail,
  localizedStatusEmail,
  localizedSubmitUserEmail,
  localizedWizardCompleteEmail,
  localizedAcademyReminderJ14,
  localizedAcademyReminderJ3,
  localizedAcademyRenewalSuccess,
  localizedAcademyRemindersSubscribed,
  type StatusEmailKind,
} from "./locale-templates";
import { siteOrigin } from "./constants";

const BRAND_BG = "#030303";
const BRAND_TEXT = "#f5f5f7";
const BRAND_MUTED = "#7a7a82";
const CTA_RED = "#dc2626";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(content: string, footerExtra?: string): string {
  const origin = siteOrigin();
  const privacy = `${origin}/privacy`;
  const footer =
    footerExtra ??
    `AUROS · <a href="${privacy}" style="color:${BRAND_MUTED};">Privacy</a> · <a href="${privacy}" style="color:${BRAND_MUTED};">Unsubscribe</a>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;padding:0;background:${BRAND_BG};font-family:ui-sans-serif,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_BG};padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#080808;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px 28px;">
        <tr><td style="padding-bottom:24px;">
          <span style="font-size:11px;letter-spacing:0.35em;font-weight:600;color:${BRAND_TEXT};">AUROS</span>
        </td></tr>
        <tr><td style="color:${BRAND_TEXT};font-size:15px;line-height:1.6;">
          ${content}
        </td></tr>
        <tr><td style="padding-top:32px;font-size:10px;color:${BRAND_MUTED};letter-spacing:0.08em;">
          ${footer}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function cta(href: string, label: string): string {
  const url = escapeHtml(href);
  return `<p style="margin:28px 0 8px;">
    <a href="${url}" style="display:inline-block;background:${CTA_RED};color:#ffffff;font-weight:600;font-size:14px;text-decoration:none;padding:14px 28px;border-radius:999px;">
      ${escapeHtml(label)}
    </a>
  </p>`;
}

// --- Template 1: WIZARD_COMPLETE ---

export type WizardCompleteEmailData = {
  firstName: string;
  score: number;
  tierLabel: string;
  assetType: string;
  city: string;
  country: string;
  dossierUrl?: string;
  locale?: Locale;
};

export function wizardCompleteEmail(data: WizardCompleteEmailData) {
  const locale = data.locale ?? "fr";
  const loc = localizedWizardCompleteEmail(data, locale);
  const dossierUrl = data.dossierUrl ?? `${siteOrigin()}/dossier`;
  const html = layout(
    loc.htmlBody +
      (loc.ctaLabel ? cta(dossierUrl, loc.ctaLabel) : "")
  );
  return { subject: loc.subject, html };
}

// --- Template 2: CONCIERGE_USER ---

export type ConciergeUserEmailData = {
  name: string;
  email: string;
  assetType: string;
  city?: string;
  country?: string;
  valueEur?: number;
  score?: number;
  locale?: Locale;
};

export function conciergeUserEmail(data: ConciergeUserEmailData) {
  const locale = data.locale ?? "fr";
  const loc = localizedConciergeUserEmail(data, locale);
  const html = layout(loc.htmlBody);
  return { subject: loc.subject, html };
}

// --- Template 3: CONCIERGE_INTERNAL ---

export type ConciergeInternalEmailData = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  assetType: string;
  valueEur?: number;
  score?: number;
  dossierUrl?: string;
};

export function conciergeInternalEmail(data: ConciergeInternalEmailData) {
  const subject = `New concierge request — ${data.assetType || "Asset"} · ${
    typeof data.valueEur === "number"
      ? `${Math.round(data.valueEur).toLocaleString("en-US")}€`
      : "—"
  }`;

  const rows = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone || "—"],
    ["Asset type", data.assetType || "—"],
    ["Score", typeof data.score === "number" ? `${data.score}/100` : "—"],
    [
      "Value (EUR)",
      typeof data.valueEur === "number"
        ? data.valueEur.toLocaleString("en-US")
        : "—",
    ],
    ["Message", data.message || "—"],
    [
      "Dossier",
      data.dossierUrl
        ? `<a href="${escapeHtml(data.dossierUrl)}" style="color:${BRAND_TEXT};">Open dossier</a>`
        : "—",
    ],
  ];

  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;color:${BRAND_MUTED};vertical-align:top;">${escapeHtml(k)}</td><td style="padding:8px 0;color:${BRAND_TEXT};">${typeof v === "string" && v.startsWith("<a") ? v : escapeHtml(String(v))}</td></tr>`
    )
    .join("");

  const html = layout(
    `<h1 style="margin:0 0 16px;font-size:20px;font-weight:600;">New concierge request</h1>
    <table style="width:100%;border-collapse:collapse;">${table}</table>`,
    "AUROS internal notification"
  );

  return { subject, html };
}

// --- Template 4: PARTNER_USER ---

export type PartnerUserEmailData = {
  company: string;
  contactName: string;
  platformType: string;
  volume: string;
};

export function partnerUserEmail(data: PartnerUserEmailData) {
  const company = escapeHtml(data.company);

  const html = layout(`
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;">Thank you, ${company}</h1>
    <p style="margin:0 0 20px;color:${BRAND_MUTED};">
      Our team will contact you within 24 hours regarding your partnership request.
    </p>
    <div style="padding:16px;background:rgba(255,255,255,0.04);border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
      <p style="margin:0 0 8px;"><strong>Contact:</strong> ${escapeHtml(data.contactName)}</p>
      <p style="margin:0 0 8px;"><strong>Platform type:</strong> ${escapeHtml(data.platformType)}</p>
      <p style="margin:0;"><strong>Monthly volume:</strong> ${escapeHtml(data.volume)}</p>
    </div>
  `);

  return {
    subject: "AUROS partnership request received",
    html,
  };
}

// --- Template 5: PARTNER_INTERNAL ---

export type PartnerInternalEmailData = {
  company: string;
  contactName: string;
  email: string;
  platformType: string;
  volume: string;
  message?: string;
};

export function partnerInternalEmail(data: PartnerInternalEmailData) {
  const subject = `New partner request — ${data.company} · ${data.volume}`;

  const rows = [
    ["Company", data.company],
    ["Contact", data.contactName],
    ["Email", data.email],
    ["Platform type", data.platformType],
    ["Volume", data.volume],
    ["Message", data.message || "—"],
  ];

  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;color:${BRAND_MUTED};">${escapeHtml(k)}</td><td style="padding:8px 0;color:${BRAND_TEXT};">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  const html = layout(
    `<h1 style="margin:0 0 16px;font-size:20px;font-weight:600;">New partner request</h1>
    <table style="width:100%;">${table}</table>`,
    "AUROS internal notification"
  );

  return { subject, html };
}

// --- Template 6: LEAD_SCORE ---

export type LeadScoreEmailData = {
  score: number;
  tierLabel: string;
  assetType: string;
  locale?: Locale;
};

export function leadScoreEmail(data: LeadScoreEmailData) {
  const locale = data.locale ?? "fr";
  const loc = localizedLeadScoreEmail(data, locale);
  const wizardUrl = `${siteOrigin()}/wizard`;
  const html = layout(
    loc.htmlBody + (loc.ctaLabel ? cta(wizardUrl, loc.ctaLabel) : "")
  );
  return { subject: loc.subject, html };
}

// --- Platform review request ---

export type SubmitDossierEmailData = {
  dossierId: string;
  assetType: string;
  score: number;
  admissionPercent: number;
  platform: string;
  email?: string;
  firstName?: string;
  country?: string;
  locale?: Locale;
};

export function submitDossierUserEmail(
  data: SubmitDossierEmailData,
  locale: Locale = data.locale ?? "fr"
) {
  const loc = localizedSubmitUserEmail(data, locale);
  const html = layout(
    loc.htmlBody + cta(`${siteOrigin()}/dossier?id=${encodeURIComponent(data.dossierId)}`, loc.ctaLabel)
  );
  return { subject: loc.subject, html };
}

export function dossierStatusUserEmail(
  kind: StatusEmailKind,
  locale: Locale,
  firstName: string,
  assetType: string
) {
  const { subject, body } = localizedStatusEmail(kind, locale, firstName, assetType);
  const html = layout(`<p style="margin:0;color:${BRAND_MUTED};">${body}</p>`);
  return { subject, html };
}

export function submitDossierInternalEmail(data: SubmitDossierEmailData) {
  const subject = `[AUROS] Platform review · ${data.assetType} · ${data.score}/100`;
  const rows: [string, string][] = [
    ["Dossier ID", data.dossierId],
    ["Asset", data.assetType],
    ["Score", String(data.score)],
    ["Admission %", String(data.admissionPercent)],
    ["AUROS path", data.platform || "—"],
    ["Contact", data.email || "—"],
    ["Country", data.country || "—"],
  ];
  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;color:${BRAND_MUTED};">${escapeHtml(k)}</td><td style="padding:8px 0;">${escapeHtml(v)}</td></tr>`
    )
    .join("");
  const html = layout(
    `<h1 style="margin:0 0 16px;font-size:20px;">New AUROS review request</h1><table>${table}</table>`,
    "AUROS internal"
  );
  return { subject, html };
}

// --- Jurisdiction comparator ---

export type JurisdictionGuideUserEmailData = {
  firstName: string;
  brief: string;
  locale?: Locale;
  checkoutUrl?: string;
};

export function jurisdictionGuideUserEmail(data: JurisdictionGuideUserEmailData) {
  const subject =
    data.locale === "en"
      ? "Your RWA jurisdiction brief — AUROS"
      : data.locale === "es"
        ? "Su briefing jurisdiccional RWA — AUROS"
        : "Votre brief juridictions RWA — AUROS";

  const wizardCta =
    data.locale === "en"
      ? "Prepare my dossier"
      : data.locale === "es"
        ? "Preparar mi expediente"
        : "Préparer mon dossier";

  const payCta =
    data.locale === "en"
      ? "Start Starter Kit — €5,000"
      : data.locale === "es"
        ? "Starter Kit — 5 000 €"
        : "Starter Kit — 5 000 €";

  const html = layout(`
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;">${escapeHtml(data.firstName)},</h1>
    <p style="margin:0 0 20px;color:${BRAND_MUTED};white-space:pre-wrap;">${escapeHtml(data.brief)}</p>
    ${data.checkoutUrl ? cta(data.checkoutUrl, payCta) : ""}
    ${cta(`${siteOrigin()}/wizard`, wizardCta)}
  `);

  return { subject, html };
}

export type JurisdictionGuideInternalEmailData = {
  firstName: string;
  email: string;
  projectType: string;
  jurisdictionIds: string[];
  brief: string;
  provider: string;
  leadScore?: number;
  leadTier?: string;
};

export function jurisdictionGuideInternalEmail(
  data: JurisdictionGuideInternalEmailData
) {
  const subject = `[AUROS] Guide juridictions · ${data.email}`;
  const html = layout(
    `<h1 style="margin:0 0 16px;font-size:20px;">Jurisdiction guide lead</h1>
    <p><strong>Name:</strong> ${escapeHtml(data.firstName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Project:</strong> ${escapeHtml(data.projectType)}</p>
    <p><strong>Jurisdictions:</strong> ${escapeHtml(data.jurisdictionIds.join(", "))}</p>
    <p><strong>AI:</strong> ${escapeHtml(data.provider)}</p>
    ${data.leadTier ? `<p><strong>Score:</strong> ${data.leadScore ?? 0} (${escapeHtml(data.leadTier)})</p>` : ""}
    <pre style="white-space:pre-wrap;color:${BRAND_MUTED};font-size:13px;">${escapeHtml(data.brief)}</pre>`,
    "AUROS internal"
  );
  return { subject, html };
}

export type JurisdictionQuoteUserEmailData = {
  name: string;
  locale?: Locale;
  quote?: string;
  checkoutUrl?: string;
};

export function jurisdictionQuoteUserEmail(data: JurisdictionQuoteUserEmailData) {
  const subject =
    data.locale === "en"
      ? "Your RWA tokenization proposal — AUROS"
      : data.locale === "es"
        ? "Su propuesta de tokenización RWA — AUROS"
        : "Votre proposition tokenisation RWA — AUROS";

  const payCta =
    data.locale === "en"
      ? "Pay Starter Kit — €5,000"
      : data.locale === "es"
        ? "Pagar Starter Kit — 5 000 €"
        : "Régler le Starter Kit — 5 000 €";

  const html = layout(
    `<p style="margin:0 0 12px;font-size:18px;font-weight:600;">${escapeHtml(data.name)},</p>
    ${data.quote ? `<p style="margin:0 0 20px;color:${BRAND_MUTED};white-space:pre-wrap;">${escapeHtml(data.quote)}</p>` : ""}
    ${data.checkoutUrl ? cta(data.checkoutUrl, payCta) : ""}`
  );
  return { subject, html };
}

export type JurisdictionQuoteInternalEmailData = {
  name: string;
  email: string;
  projectType: string;
  projectValue: string;
  jurisdictionId: string;
  message?: string;
  leadScore?: number;
  leadTier?: string;
  quote?: string;
};

export function jurisdictionQuoteInternalEmail(
  data: JurisdictionQuoteInternalEmailData
) {
  const subject = `[AUROS] Devis juridictions · ${data.email}${data.leadTier === "hot" ? " 🔥" : ""}`;
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Asset type", data.projectType],
    ["Value", data.projectValue],
    ["Jurisdiction", data.jurisdictionId],
    ["Score", data.leadTier ? `${data.leadScore ?? 0} (${data.leadTier})` : "—"],
    ["Message", data.message || "—"],
  ];
  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;color:${BRAND_MUTED};">${escapeHtml(k)}</td><td style="padding:8px 0;">${escapeHtml(v)}</td></tr>`
    )
    .join("");
  const html = layout(
    `<h1 style="margin:0 0 16px;font-size:20px;">Jurisdiction quote lead</h1><table>${table}</table>
    ${data.quote ? `<pre style="margin-top:16px;white-space:pre-wrap;color:${BRAND_MUTED};font-size:13px;">${escapeHtml(data.quote)}</pre>` : ""}`,
    "AUROS internal"
  );
  return { subject, html };
}

export type JurisdictionNurtureEmailData = {
  firstName: string;
  locale?: Locale;
  checkoutUrl?: string;
  step: 1 | 2;
};

export function jurisdictionNurtureEmail(data: JurisdictionNurtureEmailData) {
  const isFinal = data.step === 2;
  const subject =
    data.locale === "en"
      ? isFinal
        ? "Last step before tokenizing — AUROS"
        : "Your jurisdiction shortlist is waiting — AUROS"
      : data.locale === "es"
        ? isFinal
          ? "Último paso antes de tokenizar — AUROS"
          : "Su shortlist jurisdiccional le espera — AUROS"
        : isFinal
          ? "Dernière étape avant de tokeniser — AUROS"
          : "Votre shortlist juridictions vous attend — AUROS";

  const body =
    data.locale === "en"
      ? isFinal
        ? "Projects that move in the first 72 hours close 3× faster. Secure your Starter Kit now or reply to this email."
        : "You compared jurisdictions — the next move is structure + tech. Starter Kit includes legal framing and a vetted provider intro."
      : data.locale === "es"
        ? isFinal
          ? "Los proyectos que avanzan en 72 h cierran 3× más rápido. Asegure su Starter Kit o responda a este email."
          : "Ya comparó jurisdicciones — el siguiente paso es estructura + tech. El Starter Kit incluye encuadre jurídico e intro a proveedor."
        : isFinal
          ? "Les projets qui avancent sous 72 h closent 3× plus vite. Sécurisez votre Starter Kit ou répondez à cet email."
          : "Vous avez comparé les juridictions — prochaine étape : structure + tech. Le Starter Kit inclut le cadrage juridique et une intro prestataire.";

  const payCta =
    data.locale === "en"
      ? "Starter Kit — €5,000"
      : data.locale === "es"
        ? "Starter Kit — 5 000 €"
        : "Starter Kit — 5 000 €";

  const html = layout(`
    <p style="margin:0 0 12px;">${escapeHtml(data.firstName)},</p>
    <p style="margin:0 0 20px;color:${BRAND_MUTED};">${body}</p>
    ${data.checkoutUrl ? cta(data.checkoutUrl, payCta) : ""}
  `);
  return { subject, html };
}

export type JurisdictionPaymentEmailData = {
  firstName: string;
  tier: string;
  locale?: Locale;
  pendingDelivery?: boolean;
  portalUrl?: string;
};

export function jurisdictionPaymentUserEmail(data: JurisdictionPaymentEmailData) {
  const subject =
    data.locale === "en"
      ? "Payment confirmed — AUROS Starter Kit"
      : data.locale === "es"
        ? "Pago confirmado — AUROS Starter Kit"
        : "Paiement confirmé — AUROS Starter Kit";

  const body = data.portalUrl
    ? data.locale === "en"
      ? "Thank you. Your Starter Kit is ready — structure, regulatory checklist, tech shortlist and next steps."
      : data.locale === "es"
        ? "Gracias. Su Starter Kit está listo: estructura, checklist regulatorio, proveedores tech y próximos pasos."
        : "Merci. Votre Starter Kit est prêt — structure, checklist réglementaire, shortlist tech et prochaines étapes."
    : data.pendingDelivery
      ? data.locale === "en"
        ? "Payment received. Your Starter Kit is being generated — you will receive a second email within a few minutes."
        : data.locale === "es"
          ? "Pago recibido. Su Starter Kit se está generando — recibirá un segundo email en unos minutos."
          : "Paiement reçu. Votre Starter Kit est en cours de génération — vous recevrez un second email sous quelques minutes."
      : data.locale === "en"
        ? "Thank you. Our team will contact you within one business day to kick off your tokenization project."
        : data.locale === "es"
          ? "Gracias. Nuestro equipo le contactará en un día laborable para iniciar su proyecto."
          : "Merci. Notre équipe vous contacte sous un jour ouvré pour lancer votre projet.";

  const html = layout(
    `<p style="margin:0 0 12px;font-size:18px;font-weight:600;">${escapeHtml(data.firstName)},</p>
    <p style="margin:0 0 8px;color:${BRAND_MUTED};">${body}</p>
    <p style="margin:0;color:${BRAND_MUTED};font-size:13px;">Pack: ${escapeHtml(data.tier)}</p>
    ${data.portalUrl ? cta(data.portalUrl, data.locale === "en" ? "Open my Starter Kit" : data.locale === "es" ? "Abrir mi Starter Kit" : "Ouvrir mon Starter Kit") : ""}`
  );
  return { subject, html };
}

export type JurisdictionPaymentInternalEmailData = {
  firstName: string;
  email: string;
  tier: string;
  sessionId: string;
  amountCents?: number;
  portalUrl?: string;
  deliveryOk?: boolean;
};

export function jurisdictionPaymentInternalEmail(
  data: JurisdictionPaymentInternalEmailData
) {
  const amount =
    data.amountCents != null
      ? `€${(data.amountCents / 100).toLocaleString("fr-FR")}`
      : "—";
  const subject = `[AUROS] 💰 Paiement juridictions · ${data.email}`;
  const deliveryLine = data.deliveryOk
    ? "Starter Kit: delivered automatically ✅"
    : "Starter Kit: delivery FAILED — check logs";
  const html = layout(
    `<h1 style="margin:0 0 16px;font-size:20px;">Jurisdiction payment</h1>
    <p><strong>Name:</strong> ${escapeHtml(data.firstName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Pack:</strong> ${escapeHtml(data.tier)}</p>
    <p><strong>Amount:</strong> ${escapeHtml(amount)}</p>
    <p><strong>Session:</strong> ${escapeHtml(data.sessionId)}</p>
    <p><strong>Delivery:</strong> ${escapeHtml(deliveryLine)}</p>
    ${data.portalUrl ? `<p><strong>Portal:</strong> <a href="${escapeHtml(data.portalUrl)}" style="color:${BRAND_TEXT};">${escapeHtml(data.portalUrl)}</a></p>` : ""}`,
    "AUROS internal — no action required if delivery OK"
  );
  return { subject, html };
}

export type StarterKitDeliveryEmailData = {
  firstName: string;
  locale?: Locale;
  portalUrl: string;
  paidTier: string;
};

export type StarterKitTechIntroEmailData = {
  firstName: string;
  locale?: Locale;
  portalUrl: string;
  providers: { name: string; fit: string }[];
};

export function starterKitTechIntroEmail(data: StarterKitTechIntroEmailData) {
  const subject =
    data.locale === "en"
      ? "Your RWA tech shortlist — AUROS intro"
      : data.locale === "es"
        ? "Su shortlist tech RWA — intro AUROS"
        : "Votre shortlist tech RWA — intro AUROS";

  const intro =
    data.locale === "en"
      ? "Based on your Starter Kit, here are the vetted RWA tech providers matched to your project. AUROS coordinates a warm intro after you confirm interest from your portal."
      : data.locale === "es"
        ? "Según su Starter Kit, proveedores tech RWA verificados. AUROS coordina la intro tras confirmar interés en su portal."
        : "D'après votre Starter Kit, voici les prestataires tech RWA vérifiés. AUROS coordonne l'intro après confirmation depuis votre portail.";

  const list = data.providers
    .map(
      (p) =>
        `<li style="margin-bottom:8px;"><strong>${escapeHtml(p.name)}</strong><br/><span style="color:${BRAND_MUTED};font-size:13px;">${escapeHtml(p.fit)}</span></li>`
    )
    .join("");

  const ctaLabel =
    data.locale === "en"
      ? "View full shortlist"
      : data.locale === "es"
        ? "Ver shortlist completa"
        : "Voir la shortlist complète";

  const html = layout(
    `<p style="margin:0 0 12px;font-size:18px;font-weight:600;">${escapeHtml(data.firstName)},</p>
    <p style="margin:0 0 16px;color:${BRAND_MUTED};">${intro}</p>
    <ul style="margin:0 0 16px;padding-left:18px;color:${BRAND_TEXT};">${list}</ul>
    ${cta(data.portalUrl, ctaLabel)}
    <p style="margin:16px 0 0;color:${BRAND_MUTED};font-size:12px;">Reply to this email to request an intro to your preferred provider.</p>`
  );
  return { subject, html };
}

export function starterKitDeliveryEmail(data: StarterKitDeliveryEmailData) {
  const subject =
    data.locale === "en"
      ? "Your AUROS Starter Kit is ready"
      : data.locale === "es"
        ? "Su Starter Kit AUROS está listo"
        : "Votre Starter Kit AUROS est prêt";

  const intro =
    data.locale === "en"
      ? "Your payment is confirmed. Your personalized Starter Kit includes legal structure, regulatory checklist, timeline, and vetted tech provider shortlist."
      : data.locale === "es"
        ? "Pago confirmado. Su Starter Kit incluye estructura jurídica, checklist regulatorio, cronograma y proveedores tech."
        : "Paiement confirmé. Votre Starter Kit inclut structure juridique, checklist réglementaire, calendrier et shortlist tech.";

  const ctaLabel =
    data.locale === "en"
      ? "Open my Starter Kit"
      : data.locale === "es"
        ? "Abrir mi Starter Kit"
        : "Ouvrir mon Starter Kit";

  const html = layout(
    `<p style="margin:0 0 12px;font-size:18px;font-weight:600;">${escapeHtml(data.firstName)},</p>
    <p style="margin:0 0 16px;color:${BRAND_MUTED};">${intro}</p>
    <p style="margin:0 0 8px;color:${BRAND_MUTED};font-size:13px;">${escapeHtml(data.paidTier)}</p>
    ${cta(data.portalUrl, ctaLabel)}
    <p style="margin:16px 0 0;color:${BRAND_MUTED};font-size:12px;">PDF download available on your portal. Indicative analysis — not legal advice.</p>`
  );
  return { subject, html };
}

// --- AUROS Academy reminders ---

export type AcademyReminderEmailData = {
  firstName: string;
  expiresAt: string;
  verifyUrl: string;
  renewUrl: string;
  unsubscribeUrl: string;
  locale?: Locale;
};

function academyReminderFooter(unsubscribeUrl: string, locale: Locale): string {
  const label =
    locale === "fr"
      ? "Se désinscrire des rappels"
      : locale === "es"
        ? "Cancelar recordatorios"
        : "Unsubscribe from reminders";
  return `AUROS Academy · <a href="${escapeHtml(unsubscribeUrl)}" style="color:${BRAND_MUTED};">${label}</a>`;
}

export function academyReminderJ14Email(data: AcademyReminderEmailData) {
  const locale = data.locale ?? "fr";
  const loc = localizedAcademyReminderJ14(data, locale);
  const verifyLabel =
    locale === "fr" ? "Page verify" : locale === "es" ? "Página verify" : "Verify page";
  const html = layout(
    loc.htmlBody +
      cta(data.renewUrl, loc.ctaLabel ?? "Renew") +
      `<p style="margin:8px 0 0;"><a href="${escapeHtml(data.verifyUrl)}" style="color:${BRAND_MUTED};font-size:13px;">${verifyLabel}</a></p>`,
    academyReminderFooter(data.unsubscribeUrl, locale)
  );
  return { subject: loc.subject, html };
}

export function academyReminderJ3Email(data: AcademyReminderEmailData) {
  const locale = data.locale ?? "fr";
  const loc = localizedAcademyReminderJ3(data, locale);
  const html = layout(
    loc.htmlBody +
      cta(data.renewUrl, loc.ctaLabel ?? "Renew") +
      `<p style="margin:8px 0 0;"><a href="${escapeHtml(data.verifyUrl)}" style="color:${BRAND_MUTED};font-size:13px;">Verify</a></p>`,
    academyReminderFooter(data.unsubscribeUrl, locale)
  );
  return { subject: loc.subject, html };
}

export type AcademyRenewalSuccessEmailData = AcademyReminderEmailData & {
  renewalGeneration: number;
};

export function academyRenewalSuccessEmail(data: AcademyRenewalSuccessEmailData) {
  const locale = data.locale ?? "fr";
  const loc = localizedAcademyRenewalSuccess(data, locale);
  const html = layout(
    loc.htmlBody + cta(data.verifyUrl, loc.ctaLabel ?? "Verify"),
    academyReminderFooter(data.unsubscribeUrl, locale)
  );
  return { subject: loc.subject, html };
}

export function academyRemindersSubscribedEmail(data: AcademyReminderEmailData) {
  const locale = data.locale ?? "fr";
  const loc = localizedAcademyRemindersSubscribed(data, locale);
  const html = layout(
    loc.htmlBody + cta(data.verifyUrl, loc.ctaLabel ?? "Verify"),
    academyReminderFooter(data.unsubscribeUrl, locale)
  );
  return { subject: loc.subject, html };
}

// --- AUROS Green marketplace & label ---

export type GreenMarketReceivedEmailData = {
  name: string;
  kind: "actor" | "offer";
  city?: string;
  country?: string;
  locale?: Locale;
};

function greenMarketLocationLine(city?: string, country?: string): string {
  const c = city?.trim();
  const co = country?.trim();
  if (c && co) return ` · ${escapeHtml(c)}, ${escapeHtml(co)}`;
  if (c) return ` · ${escapeHtml(c)}`;
  if (co) return ` · ${escapeHtml(co)}`;
  return "";
}

export function greenMarketReceivedEmail(data: GreenMarketReceivedEmailData) {
  const locale = data.locale ?? "fr";
  const location = greenMarketLocationLine(data.city, data.country);
  const copy = {
    fr: {
      subject: "AUROS Green — fiche reçue",
      greet: "Bonjour,",
      line:
        data.kind === "actor"
          ? `Nous avons bien reçu votre fiche acteur <strong>${escapeHtml(data.name)}</strong>${location}.`
          : `Nous avons bien reçu votre annonce <strong>${escapeHtml(data.name)}</strong>${location}.`,
      sla: "Revue AUROS sous 48 h ouvrées — publication sur la carte si validée.",
      cta: "Place de marché Green",
    },
    en: {
      subject: "AUROS Green — listing received",
      greet: "Hi,",
      line:
        data.kind === "actor"
          ? `We received your actor profile <strong>${escapeHtml(data.name)}</strong>${location}.`
          : `We received your listing <strong>${escapeHtml(data.name)}</strong>${location}.`,
      sla: "AUROS review within 48 business hours — map publication if approved.",
      cta: "Green marketplace",
    },
    es: {
      subject: "AUROS Green — ficha recibida",
      greet: "Hola,",
      line:
        data.kind === "actor"
          ? `Hemos recibido su ficha de actor <strong>${escapeHtml(data.name)}</strong>${location}.`
          : `Hemos recibido su anuncio <strong>${escapeHtml(data.name)}</strong>${location}.`,
      sla: "Revisión AUROS en 48 h laborables — publicación en el mapa si se valida.",
      cta: "Marketplace Green",
    },
  }[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

  const html = layout(
    `<p style="margin:0 0 16px;">${copy.greet}</p>
    <p style="margin:0 0 16px;color:${BRAND_MUTED};">${copy.line}</p>
    <p style="margin:0;color:${BRAND_MUTED};">${copy.sla}</p>` +
      cta(`${siteOrigin()}/green/market`, copy.cta)
  );
  return { subject: copy.subject, html };
}

export type GreenMarketApprovedEmailData = {
  name: string;
  kind: "actor" | "offer";
  locale?: Locale;
};

export function greenMarketApprovedEmail(data: GreenMarketApprovedEmailData) {
  const locale = data.locale ?? "fr";
  const copy = {
    fr: {
      subject: "AUROS Green — publié sur la carte",
      line:
        data.kind === "actor"
          ? `Votre fiche acteur <strong>${escapeHtml(data.name)}</strong> est maintenant visible sur la place de marché AUROS Green.`
          : `Votre annonce <strong>${escapeHtml(data.name)}</strong> est maintenant visible sur la place de marché AUROS Green.`,
      cta: "Voir la carte",
    },
    en: {
      subject: "AUROS Green — live on the map",
      line:
        data.kind === "actor"
          ? `Your actor profile <strong>${escapeHtml(data.name)}</strong> is now visible on the AUROS Green marketplace.`
          : `Your listing <strong>${escapeHtml(data.name)}</strong> is now visible on the AUROS Green marketplace.`,
      cta: "View map",
    },
    es: {
      subject: "AUROS Green — publicado en el mapa",
      line:
        data.kind === "actor"
          ? `Su ficha de actor <strong>${escapeHtml(data.name)}</strong> ya es visible en el marketplace AUROS Green.`
          : `Su anuncio <strong>${escapeHtml(data.name)}</strong> ya es visible en el marketplace AUROS Green.`,
      cta: "Ver mapa",
    },
  }[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

  const html = layout(
    `<p style="margin:0 0 20px;color:${BRAND_MUTED};">${copy.line}</p>` +
      cta(`${siteOrigin()}/green/market`, copy.cta)
  );
  return { subject: copy.subject, html };
}

export type GreenMarketInternalEmailData = {
  kind: "actor" | "offer";
  name: string;
  city: string;
  country?: string;
  email: string;
  id: string;
  table: "green_market_assets" | "green_market_offers";
};

export function greenMarketInternalEmail(data: GreenMarketInternalEmailData) {
  const subject = `[Green] Pending ${data.kind}: ${data.name}`;
  const location =
    data.country?.trim() && data.city.trim()
      ? `${data.city.trim()}, ${data.country.trim()}`
      : data.city.trim() || data.country?.trim() || "—";
  const html = layout(
    `<h1 style="margin:0 0 16px;font-size:18px;">Green marketplace — modération</h1>
    <table style="width:100%;font-size:13px;color:${BRAND_MUTED};">
      <tr><td style="padding:4px 0;">Type</td><td>${escapeHtml(data.kind)}</td></tr>
      <tr><td style="padding:4px 0;">Nom</td><td>${escapeHtml(data.name)}</td></tr>
      <tr><td style="padding:4px 0;">Lieu</td><td>${escapeHtml(location)}</td></tr>
      <tr><td style="padding:4px 0;">Email</td><td>${escapeHtml(data.email)}</td></tr>
      <tr><td style="padding:4px 0;">Table</td><td>${escapeHtml(data.table)}</td></tr>
      <tr><td style="padding:4px 0;">ID</td><td>${escapeHtml(data.id)}</td></tr>
    </table>`,
    "AUROS internal · Green marketplace"
  );
  return { subject, html };
}

export type GreenLabelReceivedEmailData = {
  contactName: string;
  projectName: string;
  locale?: Locale;
};

export function greenLabelReceivedEmail(data: GreenLabelReceivedEmailData) {
  const locale = data.locale ?? "fr";
  const name = escapeHtml(data.contactName || "—");
  const project = escapeHtml(data.projectName);
  const copy = {
    fr: {
      subject: "AUROS Green — candidature label reçue",
      greet: `Bonjour ${name},`,
      line: `Nous avons bien reçu votre candidature au label AUROS Green Verified pour <strong>${project}</strong>.`,
      sla: "Revue documentaire sous 5 jours ouvrés — nous revenons vers vous avec les prochaines étapes.",
      cta: "Standards RTMS",
    },
    en: {
      subject: "AUROS Green — label application received",
      greet: `Hi ${name},`,
      line: `We received your AUROS Green Verified label application for <strong>${project}</strong>.`,
      sla: "Document review within 5 business days — we will follow up with next steps.",
      cta: "RTMS standards",
    },
    es: {
      subject: "AUROS Green — solicitud de label recibida",
      greet: `Hola ${name},`,
      line: `Hemos recibido su candidatura al label AUROS Green Verified para <strong>${project}</strong>.`,
      sla: "Revisión documental en 5 días hábiles — le contactaremos con los próximos pasos.",
      cta: "Estándares RTMS",
    },
  }[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

  const html = layout(
    `<p style="margin:0 0 16px;">${copy.greet}</p>
    <p style="margin:0 0 16px;color:${BRAND_MUTED};">${copy.line}</p>
    <p style="margin:0;color:${BRAND_MUTED};">${copy.sla}</p>` +
      cta(`${siteOrigin()}/green/standards`, copy.cta)
  );
  return { subject: copy.subject, html };
}

export type GreenLabelApprovedEmailData = {
  contactName: string;
  projectName: string;
  verifyUrl: string;
  registryUrl: string;
  locale?: Locale;
};

export function greenLabelApprovedEmail(data: GreenLabelApprovedEmailData) {
  const locale = data.locale ?? "fr";
  const name = escapeHtml(data.contactName || "—");
  const project = escapeHtml(data.projectName);
  const copy = {
    fr: {
      subject: "AUROS Green Verified — projet publié",
      line: `Félicitations ${name} — <strong>${project}</strong> est inscrit au registre public AUROS Green Verified.`,
      ctaVerify: "Page verify",
      ctaRegistry: "Registre public",
    },
    en: {
      subject: "AUROS Green Verified — project published",
      line: `Congratulations ${name} — <strong>${project}</strong> is listed on the public AUROS Green Verified registry.`,
      ctaVerify: "Verify page",
      ctaRegistry: "Public registry",
    },
    es: {
      subject: "AUROS Green Verified — proyecto publicado",
      line: `Enhorabuena ${name} — <strong>${project}</strong> figura en el registro público AUROS Green Verified.`,
      ctaVerify: "Página verify",
      ctaRegistry: "Registro público",
    },
  }[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

  const html = layout(
    `<p style="margin:0 0 20px;color:${BRAND_MUTED};">${copy.line}</p>` +
      cta(data.verifyUrl, copy.ctaVerify) +
      `<p style="margin:8px 0 0;"><a href="${escapeHtml(data.registryUrl)}" style="color:${BRAND_MUTED};font-size:13px;">${copy.ctaRegistry}</a></p>`
  );
  return { subject: copy.subject, html };
}

export type GreenLabelStatusEmailKind = "in_review" | "rejected";

export type GreenLabelStatusEmailData = {
  contactName: string;
  projectName: string;
  myUrl: string;
  locale?: Locale;
};

export function greenLabelStatusEmail(
  kind: GreenLabelStatusEmailKind,
  data: GreenLabelStatusEmailData
) {
  const locale = data.locale ?? "fr";
  const name = escapeHtml(data.contactName || "—");
  const project = escapeHtml(data.projectName);
  const copyByKind = {
    in_review: {
      fr: {
        subject: "AUROS Green — candidature label en revue",
        greet: `Bonjour ${name},`,
        line: `Votre candidature au label AUROS Green Verified pour <strong>${project}</strong> est passée en revue documentaire.`,
        next: "Nous revenons vers vous sous 5 jours ouvrés avec la suite du dossier.",
        cta: "Suivre ma candidature",
      },
      en: {
        subject: "AUROS Green — label application under review",
        greet: `Hi ${name},`,
        line: `Your AUROS Green Verified label application for <strong>${project}</strong> is now under document review.`,
        next: "We will follow up within 5 business days with next steps.",
        cta: "Track my application",
      },
      es: {
        subject: "AUROS Green — candidatura label en revisión",
        greet: `Hola ${name},`,
        line: `Su candidatura al label AUROS Green Verified para <strong>${project}</strong> está en revisión documental.`,
        next: "Le contactaremos en 5 días hábiles con los próximos pasos.",
        cta: "Seguir mi candidatura",
      },
    },
    rejected: {
      fr: {
        subject: "AUROS Green — candidature label non retenue",
        greet: `Bonjour ${name},`,
        line: `Après revue, votre candidature au label AUROS Green Verified pour <strong>${project}</strong> n'a pas été retenue à ce stade.`,
        next: "Vous pouvez consulter les standards RTMS et soumettre une nouvelle candidature après mise à jour du dossier.",
        cta: "Standards RTMS",
      },
      en: {
        subject: "AUROS Green — label application not retained",
        greet: `Hi ${name},`,
        line: `After review, your AUROS Green Verified label application for <strong>${project}</strong> was not retained at this stage.`,
        next: "You may review RTMS standards and submit a new application after updating your dossier.",
        cta: "RTMS standards",
      },
      es: {
        subject: "AUROS Green — candidatura label no retenida",
        greet: `Hola ${name},`,
        line: `Tras la revisión, su candidatura al label AUROS Green Verified para <strong>${project}</strong> no fue retenida en esta etapa.`,
        next: "Puede consultar los estándares RTMS y presentar una nueva candidatura tras actualizar el dossier.",
        cta: "Estándares RTMS",
      },
    },
  } as const;

  const loc = locale === "fr" ? "fr" : locale === "es" ? "es" : "en";
  const copy = copyByKind[kind][loc];
  const ctaUrl =
    kind === "in_review"
      ? data.myUrl
      : `${siteOrigin()}/green/standards`;

  const html = layout(
    `<p style="margin:0 0 16px;">${copy.greet}</p>
    <p style="margin:0 0 16px;color:${BRAND_MUTED};">${copy.line}</p>
    <p style="margin:0 0 20px;color:${BRAND_MUTED};">${copy.next}</p>` +
      cta(ctaUrl, copy.cta)
  );
  return { subject: copy.subject, html };
}

export type GreenLabelIncompleteReminderEmailData = {
  contactName: string;
  projectName: string;
  missingDocument: boolean;
  labelUrl: string;
  myUrl: string;
  locale?: Locale;
};

export function greenLabelIncompleteReminderEmail(
  data: GreenLabelIncompleteReminderEmailData
) {
  const locale = data.locale ?? "fr";
  const name = escapeHtml(data.contactName || "—");
  const project = escapeHtml(data.projectName);
  const copy = {
    fr: {
      subject: "AUROS Green — complétez votre dossier label",
      greet: `Bonjour ${name},`,
      line: `Votre candidature au label AUROS Green Verified pour <strong>${project}</strong> est incomplète.`,
      missingDoc:
        "Il manque la pièce jointe PDF (dossier RTMS ou documentation projet).",
      missingFields: "Certaines informations obligatoires sont manquantes.",
      next: "Complétez votre dossier pour accélérer la revue documentaire.",
      ctaLabel: "Compléter le dossier",
      ctaMy: "Suivre ma candidature",
    },
    en: {
      subject: "AUROS Green — complete your label dossier",
      greet: `Hi ${name},`,
      line: `Your AUROS Green Verified label application for <strong>${project}</strong> is incomplete.`,
      missingDoc:
        "The PDF attachment is missing (RTMS dossier or project documentation).",
      missingFields: "Some required information is missing.",
      next: "Complete your dossier to speed up document review.",
      ctaLabel: "Complete dossier",
      ctaMy: "Track my application",
    },
    es: {
      subject: "AUROS Green — complete su dossier label",
      greet: `Hola ${name},`,
      line: `Su candidatura al label AUROS Green Verified para <strong>${project}</strong> está incompleta.`,
      missingDoc:
        "Falta el PDF adjunto (dossier RTMS o documentación del proyecto).",
      missingFields: "Faltan datos obligatorios.",
      next: "Complete el dossier para acelerar la revisión documental.",
      ctaLabel: "Completar dossier",
      ctaMy: "Seguir mi candidatura",
    },
  }[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

  const missingLine = data.missingDocument ? copy.missingDoc : copy.missingFields;

  const html = layout(
    `<p style="margin:0 0 16px;">${copy.greet}</p>
    <p style="margin:0 0 16px;color:${BRAND_MUTED};">${copy.line}</p>
    <p style="margin:0 0 16px;color:${BRAND_MUTED};">${missingLine}</p>
    <p style="margin:0 0 20px;color:${BRAND_MUTED};">${copy.next}</p>` +
      cta(data.labelUrl, copy.ctaLabel) +
      `<p style="margin:12px 0 0;"><a href="${escapeHtml(data.myUrl)}" style="color:${BRAND_MUTED};font-size:13px;">${copy.ctaMy}</a></p>`
  );
  return { subject: copy.subject, html };
}

export function greenLabelIncompleteSecondReminderEmail(
  data: GreenLabelIncompleteReminderEmailData
) {
  const locale = data.locale ?? "fr";
  const name = escapeHtml(data.contactName || "—");
  const project = escapeHtml(data.projectName);
  const copy = {
    fr: {
      subject: "AUROS Green — rappel : dossier label à compléter",
      greet: `Bonjour ${name},`,
      line: `Il y a une semaine, nous vous avions signalé que votre candidature label pour <strong>${project}</strong> est toujours incomplète.`,
      missingDoc:
        "Le PDF (dossier RTMS ou documentation) est toujours manquant.",
      missingFields: "Des informations obligatoires sont toujours manquantes.",
      next: "Dernière relance automatique — complétez le dossier pour lancer la revue.",
      ctaLabel: "Compléter le dossier",
      ctaMy: "Suivre ma candidature",
    },
    en: {
      subject: "AUROS Green — reminder: complete your label dossier",
      greet: `Hi ${name},`,
      line: `One week ago we noted that your label application for <strong>${project}</strong> is still incomplete.`,
      missingDoc: "The PDF attachment is still missing.",
      missingFields: "Required information is still missing.",
      next: "Final automatic reminder — complete your dossier to start review.",
      ctaLabel: "Complete dossier",
      ctaMy: "Track my application",
    },
    es: {
      subject: "AUROS Green — recordatorio: complete su dossier label",
      greet: `Hola ${name},`,
      line: `Hace una semana le indicamos que su candidatura label para <strong>${project}</strong> sigue incompleta.`,
      missingDoc: "El PDF adjunto sigue faltando.",
      missingFields: "Siguen faltando datos obligatorios.",
      next: "Último recordatorio automático — complete el dossier para iniciar la revisión.",
      ctaLabel: "Completar dossier",
      ctaMy: "Seguir mi candidatura",
    },
  }[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

  const missingLine = data.missingDocument ? copy.missingDoc : copy.missingFields;

  const html = layout(
    `<p style="margin:0 0 16px;">${copy.greet}</p>
    <p style="margin:0 0 16px;color:${BRAND_MUTED};">${copy.line}</p>
    <p style="margin:0 0 16px;color:${BRAND_MUTED};">${missingLine}</p>
    <p style="margin:0 0 20px;color:${BRAND_MUTED};">${copy.next}</p>` +
      cta(data.labelUrl, copy.ctaLabel) +
      `<p style="margin:12px 0 0;"><a href="${escapeHtml(data.myUrl)}" style="color:${BRAND_MUTED};font-size:13px;">${copy.ctaMy}</a></p>`
  );
  return { subject: copy.subject, html };
}

export type GreenLabelInternalEmailData = {
  projectName: string;
  email: string;
  projectType: string;
  id: string;
};

export function greenLabelInternalEmail(data: GreenLabelInternalEmailData) {
  const subject = `[Green] Label application: ${data.projectName}`;
  const html = layout(
    `<h1 style="margin:0 0 16px;font-size:18px;">Green label — candidature</h1>
    <table style="width:100%;font-size:13px;color:${BRAND_MUTED};">
      <tr><td style="padding:4px 0;">Projet</td><td>${escapeHtml(data.projectName)}</td></tr>
      <tr><td style="padding:4px 0;">Type</td><td>${escapeHtml(data.projectType)}</td></tr>
      <tr><td style="padding:4px 0;">Email</td><td>${escapeHtml(data.email)}</td></tr>
      <tr><td style="padding:4px 0;">ID</td><td>${escapeHtml(data.id)}</td></tr>
    </table>`,
    "AUROS internal · Green label"
  );
  return { subject, html };
}

export type GreenMarketAlertEmailData = {
  alertCity: string;
  actorName: string;
  actorCity: string;
  actorType: string;
  marketUrl?: string;
  locale?: Locale;
};

export function greenMarketAlertEmail(data: GreenMarketAlertEmailData) {
  const locale = data.locale ?? "fr";
  const marketUrl = data.marketUrl ?? `${siteOrigin()}/green/market`;
  const copy = {
    fr: {
      subject: "AUROS Green — nouvel acteur près de vous",
      line: `Un acteur <strong>${escapeHtml(data.actorType)}</strong> vient d'être publié : <strong>${escapeHtml(data.actorName)}</strong> (${escapeHtml(data.actorCity)}), dans votre zone d'alerte autour de ${escapeHtml(data.alertCity)}.`,
      cta: "Voir la carte",
    },
    en: {
      subject: "AUROS Green — new actor near you",
      line: `A <strong>${escapeHtml(data.actorType)}</strong> profile was published: <strong>${escapeHtml(data.actorName)}</strong> (${escapeHtml(data.actorCity)}), within your alert zone around ${escapeHtml(data.alertCity)}.`,
      cta: "View map",
    },
    es: {
      subject: "AUROS Green — nuevo actor cerca de usted",
      line: `Se publicó un actor <strong>${escapeHtml(data.actorType)}</strong>: <strong>${escapeHtml(data.actorName)}</strong> (${escapeHtml(data.actorCity)}), en su zona de alerta cerca de ${escapeHtml(data.alertCity)}.`,
      cta: "Ver mapa",
    },
  }[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

  const html = layout(
    `<p style="margin:0 0 20px;color:${BRAND_MUTED};">${copy.line}</p>` +
      cta(marketUrl, copy.cta)
  );
  return { subject: copy.subject, html };
}

export type GreenOfferInterestEmailData = {
  offerId: string;
  offerTitle: string;
  actorName: string;
  visitorName: string;
  visitorEmail: string;
  message: string;
  locale?: Locale;
};

export function greenOfferInterestInternalEmail(data: GreenOfferInterestEmailData) {
  const subject = `[Green] Intérêt annonce: ${data.offerTitle}`;
  const html = layout(
    `<h1 style="margin:0 0 16px;font-size:18px;">Green marketplace — intérêt annonce</h1>
    <table style="width:100%;font-size:13px;color:${BRAND_MUTED};">
      <tr><td style="padding:4px 0;">Annonce</td><td>${escapeHtml(data.offerTitle)}</td></tr>
      <tr><td style="padding:4px 0;">ID</td><td>${escapeHtml(data.offerId)}</td></tr>
      <tr><td style="padding:4px 0;">Acteur</td><td>${escapeHtml(data.actorName)}</td></tr>
      <tr><td style="padding:4px 0;">Visiteur</td><td>${escapeHtml(data.visitorName)}</td></tr>
      <tr><td style="padding:4px 0;">Email</td><td>${escapeHtml(data.visitorEmail)}</td></tr>
      <tr><td style="padding:4px 0;">Message</td><td>${escapeHtml(data.message)}</td></tr>
    </table>`,
    "AUROS internal · Green marketplace"
  );
  return { subject, html };
}

export function greenOfferInterestActorEmail(data: GreenOfferInterestEmailData) {
  const locale = data.locale ?? "fr";
  const copy = {
    fr: {
      subject: `AUROS Green — intérêt pour votre annonce`,
      line: `<strong>${escapeHtml(data.visitorName)}</strong> (${escapeHtml(data.visitorEmail)}) a manifesté un intérêt pour votre annonce <strong>${escapeHtml(data.offerTitle)}</strong> sur AUROS Green.`,
      msg: data.message !== "—" ? `Message : ${escapeHtml(data.message)}` : "",
    },
    en: {
      subject: `AUROS Green — interest in your listing`,
      line: `<strong>${escapeHtml(data.visitorName)}</strong> (${escapeHtml(data.visitorEmail)}) expressed interest in your listing <strong>${escapeHtml(data.offerTitle)}</strong> on AUROS Green.`,
      msg: data.message !== "—" ? `Message: ${escapeHtml(data.message)}` : "",
    },
    es: {
      subject: `AUROS Green — interés por su anuncio`,
      line: `<strong>${escapeHtml(data.visitorName)}</strong> (${escapeHtml(data.visitorEmail)}) manifestó interés por su anuncio <strong>${escapeHtml(data.offerTitle)}</strong> en AUROS Green.`,
      msg: data.message !== "—" ? `Mensaje: ${escapeHtml(data.message)}` : "",
    },
  }[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

  const html = layout(
    `<p style="margin:0 0 16px;color:${BRAND_MUTED};">${copy.line}</p>` +
      (copy.msg ? `<p style="margin:0;color:${BRAND_MUTED};">${copy.msg}</p>` : "")
  );
  return { subject: copy.subject, html };
}

// --- Wizard Pro payment ---

export type WizardProPaymentEmailData = {
  firstName: string;
  tier: string;
  locale?: Locale;
  wizardUrl: string;
};

export function wizardProPaymentUserEmail(data: WizardProPaymentEmailData) {
  const locale = data.locale ?? "fr";
  const subject =
    locale === "en"
      ? "Payment confirmed — AUROS Pro wizard"
      : locale === "es"
        ? "Pago confirmado — Wizard Pro AUROS"
        : "Paiement confirmé — Wizard Pro AUROS";

  const body =
    locale === "en"
      ? "Thank you. Your institutional wizard is unlocked — complete the 19-step dossier and receive your full analysis."
      : locale === "es"
        ? "Gracias. Su wizard institucional está desbloqueado — complete el dossier en 19 pasos y reciba su análisis completo."
        : "Merci. Votre wizard institutionnel est débloqué — complétez le dossier en 19 étapes et recevez votre analyse complète.";

  const ctaLabel =
    locale === "en"
      ? "Open Pro wizard"
      : locale === "es"
        ? "Abrir wizard Pro"
        : "Ouvrir le wizard Pro";

  const html = layout(
    `<p style="margin:0 0 12px;font-size:18px;font-weight:600;">${escapeHtml(data.firstName)},</p>
    <p style="margin:0 0 8px;color:${BRAND_MUTED};">${body}</p>
    <p style="margin:0;color:${BRAND_MUTED};font-size:13px;">Pack: ${escapeHtml(data.tier)}</p>
    ${cta(data.wizardUrl, ctaLabel)}`
  );
  return { subject, html };
}

export type WizardProPaymentInternalEmailData = {
  firstName: string;
  email: string;
  tier: string;
  sessionId: string;
  amountCents?: number;
  wizardUrl: string;
};

export function wizardProPaymentInternalEmail(
  data: WizardProPaymentInternalEmailData
) {
  const amount =
    data.amountCents != null
      ? `€${(data.amountCents / 100).toLocaleString("fr-FR")}`
      : "—";
  const subject = `[AUROS] 💰 Wizard Pro · ${data.email}`;
  const html = layout(
    `<h1 style="margin:0 0 16px;font-size:20px;">Wizard Pro payment</h1>
    <p><strong>Name:</strong> ${escapeHtml(data.firstName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Pack:</strong> ${escapeHtml(data.tier)}</p>
    <p><strong>Amount:</strong> ${escapeHtml(amount)}</p>
    <p><strong>Session:</strong> ${escapeHtml(data.sessionId)}</p>
    <p><strong>Wizard:</strong> <a href="${escapeHtml(data.wizardUrl)}" style="color:${BRAND_TEXT};">${escapeHtml(data.wizardUrl)}</a></p>`,
    "AUROS internal — wizard Pro unlocked"
  );
  return { subject, html };
}

// --- Wizard resume reminder (48h) ---

export type WizardResumeReminderEmailData = {
  locale?: Locale;
  resumeUrl: string;
  tier?: string;
};

export function wizardResumeReminderEmail(data: WizardResumeReminderEmailData) {
  const locale = data.locale ?? "fr";
  const subject =
    locale === "en"
      ? "Your AUROS analysis is waiting"
      : locale === "es"
        ? "Su análisis AUROS le espera"
        : "Votre analyse AUROS vous attend";

  const body =
    locale === "en"
      ? "You unlocked the Pro wizard — pick up where you left off and complete your institutional dossier."
      : locale === "es"
        ? "Desbloqueó el wizard Pro — retome donde lo dejó y complete su dossier institucional."
        : "Vous avez débloqué le wizard Pro — reprenez là où vous vous étiez arrêté et complétez votre dossier institutionnel.";

  const ctaLabel =
    locale === "en"
      ? "Resume wizard"
      : locale === "es"
        ? "Reanudar wizard"
        : "Reprendre le wizard";

  const html = layout(
    `<p style="margin:0 0 12px;font-size:18px;font-weight:600;">${escapeHtml(subject)}</p>
    <p style="margin:0 0 8px;color:${BRAND_MUTED};">${body}</p>
    ${data.tier ? `<p style="margin:0;color:${BRAND_MUTED};font-size:13px;">Pack: ${escapeHtml(data.tier)}</p>` : ""}
    ${cta(data.resumeUrl, ctaLabel)}`
  );
  return { subject, html };
}

// --- Lead score nurture (score_widget → wizard) ---

export type LeadNurtureEmailData = {
  locale?: Locale;
  step: 1 | 2;
  wizardUrl: string;
  score?: number | null;
  assetType?: string | null;
};

export function leadNurtureEmail(data: LeadNurtureEmailData) {
  const locale = data.locale ?? "fr";
  const isFinal = data.step === 2;
  const asset = data.assetType?.trim()
    ? escapeHtml(data.assetType.trim())
    : null;
  const scoreLine =
    typeof data.score === "number" && Number.isFinite(data.score)
      ? locale === "en"
        ? `Your indicative score: <strong>${data.score}/100</strong>.`
        : locale === "es"
          ? `Su puntuación indicativa: <strong>${data.score}/100</strong>.`
          : `Votre score indicatif : <strong>${data.score}/100</strong>.`
      : null;

  const subject =
    locale === "en"
      ? isFinal
        ? "Last step — structure your RWA dossier"
        : "Your AUROS score is ready — next: the wizard"
      : locale === "es"
        ? isFinal
          ? "Último paso — estructure su dossier RWA"
          : "Su puntuación AUROS está lista — siguiente: el wizard"
        : isFinal
          ? "Dernière étape — structurez votre dossier RWA"
          : "Votre score AUROS est prêt — prochaine étape : le wizard";

  const body =
    locale === "en"
      ? isFinal
        ? "Projects that complete the guided dossier in the first week move 3× faster toward platform admission. ~12 min guided or ~6 min express."
        : "You received an indicative score — the next move is a structured dossier in four parts: asset, strategy, compliance, summary."
      : locale === "es"
        ? isFinal
          ? "Los proyectos que completan el dossier guiado en la primera semana avanzan 3× más rápido hacia la admisión en plataforma. ~12 min guiado o ~6 min express."
          : "Recibió una puntuación indicativa — el siguiente paso es un dossier estructurado en cuatro partes: activo, estrategia, conformidad, resumen."
        : isFinal
          ? "Les projets qui complètent le dossier guidé dans la première semaine avancent 3× plus vite vers l'admission plateforme. ~12 min guidé ou ~6 min express."
          : "Vous avez reçu un score indicatif — prochaine étape : un dossier structuré en 4 parties (actif, stratégie, conformité, récap).";

  const ctaLabel =
    locale === "en"
      ? isFinal
        ? "Complete my dossier"
        : "Start the wizard"
      : locale === "es"
        ? isFinal
          ? "Completar mi dossier"
          : "Iniciar el wizard"
        : isFinal
          ? "Compléter mon dossier"
          : "Démarrer le wizard";

  const html = layout(`
    <p style="margin:0 0 12px;font-size:18px;font-weight:600;">${escapeHtml(subject)}</p>
    <p style="margin:0 0 12px;color:${BRAND_MUTED};">${body}</p>
    ${scoreLine ? `<p style="margin:0 0 8px;color:${BRAND_TEXT};">${scoreLine}</p>` : ""}
    ${asset ? `<p style="margin:0 0 16px;color:${BRAND_MUTED};">${locale === "en" ? "Asset" : locale === "es" ? "Activo" : "Actif"} : <strong>${asset}</strong></p>` : ""}
    ${cta(data.wizardUrl, ctaLabel)}`
  );
  return { subject, html };
}
