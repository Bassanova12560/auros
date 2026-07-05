import type { Locale } from "@/lib/i18n";

import type { PartnerPilotKit } from "./pilot-kit";

export type PilotOutreachOptions = {
  contactName?: string;
  companyName?: string;
  locale?: Locale;
};

type OutreachCopy = {
  subject: (company: string, code: string) => string;
  greeting: (name: string) => string;
  intro: string;
  bullets: string[];
  ctaLabel: string;
  closing: string;
  signature: string;
};

const COPY: Record<Locale, OutreachCopy> = {
  fr: {
    subject: (company, code) =>
      `AUROS × ${company} — pilote widget H₂O & code partenaire ${code}`,
    greeting: (name) => `Bonjour ${name},`,
    intro:
      "Comme convenu, voici votre kit pilote AUROS pour le rail hydrique : preview H₂O gratuit, Passeport Hydrique vérifiable et attribution automatique via votre code partenaire.",
    bullets: [
      "Widget intégrable sur votre site (iframe ou JS + postMessage)",
      "Preview H₂O gratuit — le Passeport vérifiable passe par AUROS",
      "Tableau de bord leads/dossiers sur le portail partenaire",
      "Commission indicative selon grille contractuelle",
    ],
    ctaLabel: "Ouvrir le widget pilote",
    closing:
      "Prochaine étape suggérée : intégrer le snippet iframe sur une page test, puis valider l'attribution avec un lead de test. Je reste disponible pour un call de 20 min si besoin.",
    signature: "L'équipe AUROS",
  },
  en: {
    subject: (company, code) =>
      `AUROS × ${company} — H₂O widget pilot & partner code ${code}`,
    greeting: (name) => `Hi ${name},`,
    intro:
      "As discussed, here is your AUROS hydrological pilot kit: free H₂O preview, verifiable Hydrological Passport, and automatic attribution via your partner code.",
    bullets: [
      "Embeddable widget (iframe or JS + postMessage)",
      "Free H₂O preview — verifiable Passport flows through AUROS",
      "Partner portal for leads and dossiers",
      "Indicative commission per signed agreement",
    ],
    ctaLabel: "Open pilot widget",
    closing:
      "Suggested next step: embed the iframe on a test page, then confirm attribution with a test lead. Happy to jump on a 20-min call if useful.",
    signature: "The AUROS team",
  },
  es: {
    subject: (company, code) =>
      `AUROS × ${company} — piloto widget H₂O y código ${code}`,
    greeting: (name) => `Hola ${name},`,
    intro:
      "Como acordamos, aquí está su kit piloto AUROS para el rail hídrico: preview H₂O gratuito, Pasaporte Hídrico verificable y atribución automática con su código partner.",
    bullets: [
      "Widget integrable (iframe o JS + postMessage)",
      "Preview H₂O gratuito — el Pasaporte verificable pasa por AUROS",
      "Portal partner para leads y dossiers",
      "Comisión indicativa según acuerdo firmado",
    ],
    ctaLabel: "Abrir widget piloto",
    closing:
      "Siguiente paso sugerido: integrar el iframe en una página de prueba y validar la atribución con un lead test.",
    signature: "El equipo AUROS",
  },
};

export type PartnerPilotOutreach = {
  subject: string;
  bodyPlain: string;
  bodyHtml: string;
};

export function buildPartnerPilotOutreach(
  kit: PartnerPilotKit,
  options: PilotOutreachOptions = {},
): PartnerPilotOutreach {
  const locale = options.locale ?? "fr";
  const copy = COPY[locale] ?? COPY.fr;
  const company = options.companyName?.trim() || "votre organisation";
  const name = options.contactName?.trim() || (locale === "en" ? "there" : "à vous");

  const subject = copy.subject(company, kit.partnerCode);
  const bulletLines = copy.bullets.map((b) => `• ${b}`).join("\n");

  const linksBlock = [
    `${locale === "en" ? "Widget" : "Widget"}: ${kit.embedUrl}`,
    `${locale === "en" ? "Integration docs" : "Docs intégration"}: ${kit.embedDocsUrl}`,
    `${locale === "en" ? "Partner portal" : "Portail partenaire"}: ${kit.portalUrl}`,
    `${locale === "en" ? "Water guide" : "Guide eau"}: ${kit.eauGuideUrl}`,
    `${locale === "en" ? "Partner code" : "Code partenaire"}: ${kit.partnerCode}`,
  ].join("\n");

  const bodyPlain = [
    copy.greeting(name),
    "",
    copy.intro,
    "",
    bulletLines,
    "",
    `${copy.ctaLabel}: ${kit.embedUrl}`,
    "",
    linksBlock,
    "",
    copy.closing,
    "",
    copy.signature,
  ].join("\n");

  const bulletHtml = copy.bullets
    .map((b) => `<li style="margin:6px 0;">${b}</li>`)
    .join("");

  const bodyHtml = `<p>${copy.greeting(name)}</p>
<p>${copy.intro}</p>
<ul style="padding-left:20px;margin:16px 0;">${bulletHtml}</ul>
<p><a href="${kit.embedUrl}" style="color:#dc2626;font-weight:600;">${copy.ctaLabel} →</a></p>
<p style="font-size:13px;color:#7a7a82;line-height:1.6;">
  <a href="${kit.embedDocsUrl}">${locale === "en" ? "Docs" : "Docs"}</a> ·
  <a href="${kit.portalUrl}">${locale === "en" ? "Portal" : "Portail"}</a> ·
  <a href="${kit.eauGuideUrl}">${locale === "en" ? "Guide" : "Guide"}</a><br/>
  <strong>${kit.partnerCode}</strong>
</p>
<p>${copy.closing}</p>
<p>— ${copy.signature}</p>`;

  return { subject, bodyPlain, bodyHtml };
}

export function formatPartnerPilotOutreachEmail(outreach: PartnerPilotOutreach): string {
  return [
    `Subject: ${outreach.subject}`,
    "",
    outreach.bodyPlain,
  ].join("\n");
}
