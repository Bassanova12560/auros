import type { Locale } from "@/lib/i18n";
import { siteOrigin } from "./constants";
import type { SubmitDossierEmailData } from "./templates";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type LocalizedSubmit = { subject: string; htmlBody: string; ctaLabel: string };

export function localizedSubmitUserEmail(
  data: SubmitDossierEmailData,
  locale: Locale
): LocalizedSubmit {
  const name =
    data.firstName ||
    (locale === "fr" ? "à vous" : locale === "es" ? "a usted" : "there");
  const asset = data.assetType;
  const platform = data.platform || "—";
  const url = `${siteOrigin()}/dossier`;

  const copy = {
    fr: {
      subject: "AUROS — demande de revue enregistrée",
      greet: `Bonjour ${name},`,
      line1: `Nous avons bien reçu votre demande de revue AUROS pour <strong>${asset}</strong>.`,
      line2: `Score : <strong>${data.score}/100</strong> · Admission : <strong>${data.admissionPercent}%</strong>`,
      line3: `Parcours AUROS : ${platform}`,
      sla: "Nous revenons vers vous sous 48 h ouvrées avec les prochaines étapes.",
      cta: "Voir le dossier",
    },
    en: {
      subject: "AUROS — review request received",
      greet: `Hi ${name},`,
      line1: `We received your AUROS review request for <strong>${asset}</strong>.`,
      line2: `Score: <strong>${data.score}/100</strong> · Admission: <strong>${data.admissionPercent}%</strong>`,
      line3: `AUROS path: ${platform}`,
      sla: "We will get back to you within 48 business hours with next steps.",
      cta: "View dossier",
    },
    es: {
      subject: "AUROS — solicitud de revisión registrada",
      greet: `Hola ${name},`,
      line1: `Hemos recibido su solicitud de revisión AUROS para <strong>${asset}</strong>.`,
      line2: `Puntuación: <strong>${data.score}/100</strong> · Admisión: <strong>${data.admissionPercent}%</strong>`,
      line3: `Recorrido AUROS: ${platform}`,
      sla: "Le responderemos en 48 horas laborables con los próximos pasos.",
      cta: "Ver dossier",
    },
  }[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

  return {
    subject: copy.subject,
    ctaLabel: copy.cta,
    htmlBody: `
    <p style="margin:0 0 16px;">${copy.greet}</p>
    <p style="margin:0 0 16px;color:#7a7a82;">${copy.line1}</p>
    <p style="margin:0 0 8px;">${copy.line2}</p>
    <p style="margin:0 0 20px;color:#7a7a82;">${copy.line3}</p>
    <p style="margin:0;color:#7a7a82;">${copy.sla}</p>
  `,
  };
}

export type StatusEmailKind = "in_review" | "needs_info" | "approved";

export function localizedStatusEmail(
  kind: StatusEmailKind,
  locale: Locale,
  firstName: string,
  assetType: string
): { subject: string; body: string } {
  const n = firstName || "—";
  const a = assetType;
  const table: Record<Locale, Record<StatusEmailKind, { subject: string; body: string }>> = {
    fr: {
      in_review: {
        subject: "AUROS — dossier en revue",
        body: `Bonjour ${n}, votre dossier <strong>${a}</strong> est en cours d'analyse par l'équipe AUROS.`,
      },
      needs_info: {
        subject: "AUROS — compléments demandés",
        body: `Bonjour ${n}, nous avons besoin de pièces ou clarifications pour <strong>${a}</strong>. Répondez à cet e-mail ou complétez la data room sur votre dossier.`,
      },
      approved: {
        subject: "AUROS — dossier validé",
        body: `Bonjour ${n}, votre préparation pour <strong>${a}</strong> est validée côté AUROS. Notre équipe vous contacte pour la suite.`,
      },
    },
    en: {
      in_review: {
        subject: "AUROS — dossier under review",
        body: `Hi ${n}, your dossier for <strong>${a}</strong> is being reviewed by AUROS.`,
      },
      needs_info: {
        subject: "AUROS — more information needed",
        body: `Hi ${n}, we need additional documents or clarifications for <strong>${a}</strong>. Reply to this email or update your data room.`,
      },
      approved: {
        subject: "AUROS — dossier cleared",
        body: `Hi ${n}, your preparation for <strong>${a}</strong> is approved by AUROS. Our team will contact you on next steps.`,
      },
    },
    es: {
      in_review: {
        subject: "AUROS — expediente en revisión",
        body: `Hola ${n}, su expediente <strong>${a}</strong> está en revisión por AUROS.`,
      },
      needs_info: {
        subject: "AUROS — información adicional",
        body: `Hola ${n}, necesitamos documentos o aclaraciones para <strong>${a}</strong>. Responda a este correo o complete la data room.`,
      },
      approved: {
        subject: "AUROS — listo para la plataforma",
        body: `Hola ${n}, su preparación para <strong>${a}</strong> está validada por AUROS. Puede continuar con la plataforma objetivo.`,
      },
    },
  };
  return table[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"][kind];
}

export type LocalizedEmailBlock = {
  subject: string;
  htmlBody: string;
  ctaLabel?: string;
};

export type WizardCompleteEmailInput = {
  firstName: string;
  score: number;
  tierLabel: string;
  assetType: string;
  city: string;
  country: string;
  dossierUrl?: string;
};

export function localizedWizardCompleteEmail(
  data: WizardCompleteEmailInput,
  locale: Locale
): LocalizedEmailBlock {
  const name = escapeHtml(
    data.firstName ||
      (locale === "fr" ? "vous" : locale === "es" ? "usted" : "there")
  );
  const location = escapeHtml(
    [data.city, data.country].filter(Boolean).join(", ") || "—"
  );
  const asset = escapeHtml(data.assetType);
  const tier = escapeHtml(data.tierLabel);

  const copy = {
    fr: {
      subject: "Votre dossier AUROS est prêt",
      title: `Bonjour ${name}, votre synthèse est prête`,
      intro:
        "Nous avons structuré vos réponses en dossier indicatif. Ce n'est pas un conseil juridique ni une émission — c'est votre base pour la data room et la revue AUROS.",
      scoreLine: `Score indicatif : <strong>${data.score}/100</strong> · ${tier}`,
      assetLine: `Actif : <strong>${asset}</strong> · ${location}`,
      next:
        "Complétez la data room à votre rythme (3 priorités max affichées). Rien n'est bloquant pour consulter le rapport.",
      retention: "Lien actif environ 30 jours.",
      cta: "Voir mon dossier",
    },
    en: {
      subject: "Your AUROS dossier is ready",
      title: `Hi ${name}, your summary is ready`,
      intro:
        "We structured your answers into an indicative dossier. This is not legal advice or issuance — it's your base for the data room and AUROS review.",
      scoreLine: `Indicative score: <strong>${data.score}/100</strong> · ${tier}`,
      assetLine: `Asset: <strong>${asset}</strong> · ${location}`,
      next:
        "Complete the data room at your pace (up to 3 priorities shown). Nothing blocks you from reading the report.",
      retention: "Link active for about 30 days.",
      cta: "View my dossier",
    },
    es: {
      subject: "Su dossier AUROS está listo",
      title: `Hola ${name}, su síntesis está lista`,
      intro:
        "Hemos estructurado sus respuestas en un dossier indicativo. No es asesoramiento legal ni emisión — es su base para la data room y plataformas.",
      scoreLine: `Puntuación indicativa: <strong>${data.score}/100</strong> · ${tier}`,
      assetLine: `Activo: <strong>${asset}</strong> · ${location}`,
      next:
        "Complete la data room a su ritmo (máximo 3 prioridades). Nada le impide leer el informe.",
      retention: "Enlace activo unos 30 días.",
      cta: "Ver mi dossier",
    },
  }[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

  return {
    subject: copy.subject,
    ctaLabel: copy.cta,
    htmlBody: `
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;">${copy.title}</h1>
    <p style="margin:0 0 16px;color:#7a7a82;">${copy.intro}</p>
    <p style="margin:0 0 8px;">${copy.scoreLine}</p>
    <p style="margin:0 0 16px;color:#7a7a82;">${copy.assetLine}</p>
    <p style="margin:0 0 20px;color:#7a7a82;">${copy.next}</p>
    <p style="margin:0;font-size:12px;color:#7a7a82;">${copy.retention}</p>
  `,
  };
}

export type ConciergeUserEmailInput = {
  name: string;
  assetType: string;
  city?: string;
  country?: string;
  valueEur?: number;
  score?: number;
};

export function localizedConciergeUserEmail(
  data: ConciergeUserEmailInput,
  locale: Locale
): LocalizedEmailBlock {
  const name = escapeHtml(
    data.name || (locale === "fr" ? "vous" : locale === "es" ? "usted" : "there")
  );
  const asset = escapeHtml(data.assetType || "—");
  const loc = escapeHtml([data.city, data.country].filter(Boolean).join(", "));
  const value =
    typeof data.valueEur === "number"
      ? `${Math.round(data.valueEur).toLocaleString(locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-US")} €`
      : null;

  const copy = {
    fr: {
      subject: "Demande concierge reçue — AUROS",
      title: `Merci ${name}`,
      intro:
        "Un spécialiste AUROS vous recontacte sous <strong>48 h ouvrées</strong>. Aucun engagement — nous clarifions vos prochaines étapes réglementaires.",
      asset: `Actif : <strong>${asset}</strong>`,
      locLabel: "Localisation",
      sla: "En attendant, votre dossier en ligne reste modifiable (data room, score indicatif).",
    },
    en: {
      subject: "Concierge request received — AUROS",
      title: `Thank you, ${name}`,
      intro:
        "An AUROS specialist will reach out within <strong>48 business hours</strong>. No commitment — we clarify your regulatory next steps.",
      asset: `Asset: <strong>${asset}</strong>`,
      locLabel: "Location",
      sla: "Meanwhile, your online dossier stays editable (data room, indicative score).",
    },
    es: {
      subject: "Solicitud concierge recibida — AUROS",
      title: `Gracias, ${name}`,
      intro:
        "Un especialista AUROS le contactará en <strong>48 horas laborables</strong>. Sin compromiso — aclaramos los siguientes pasos regulatorios.",
      asset: `Activo: <strong>${asset}</strong>`,
      locLabel: "Ubicación",
      sla: "Mientras tanto, su dossier en línea sigue siendo editable (data room, puntuación indicativa).",
    },
  }[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

  const details = [
    copy.asset,
    loc ? `${copy.locLabel} : ${loc}` : null,
    value
      ? locale === "fr"
        ? `Valeur estimée : ${value}`
        : locale === "es"
          ? `Valor estimado: ${value}`
          : `Estimated value: ${value}`
      : null,
    typeof data.score === "number"
      ? locale === "fr"
        ? `Score : ${data.score}/100`
        : locale === "es"
          ? `Puntuación: ${data.score}/100`
          : `Score: ${data.score}/100`
      : null,
  ]
    .filter(Boolean)
    .map((line) => `<p style="margin:0 0 8px;color:#7a7a82;">${line}</p>`)
    .join("");

  return {
    subject: copy.subject,
    htmlBody: `
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;">${copy.title}</h1>
    <p style="margin:0 0 16px;color:#7a7a82;">${copy.intro}</p>
    <div style="margin:0 0 16px;padding:16px;background:rgba(255,255,255,0.04);border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
      ${details}
    </div>
    <p style="margin:0;color:#7a7a82;">${copy.sla}</p>
  `,
  };
}

export type LeadScoreEmailInput = {
  score: number;
  tierLabel: string;
  assetType: string;
};

export function localizedLeadScoreEmail(
  data: LeadScoreEmailInput,
  locale: Locale
): LocalizedEmailBlock {
  const asset = escapeHtml(data.assetType || "—");
  const tier = escapeHtml(data.tierLabel);

  const copy = {
    fr: {
      subject: `Votre actif : ${data.score}/100 sur AUROS (indicatif)`,
      kicker: "Score indicatif AUROS",
      line: "Ce score oriente la préparation — il ne remplace pas une due diligence.",
      asset: `Actif détecté : <strong>${asset}</strong>`,
      cta: "Structurer mon dossier",
      foot: "Parcours guidé ~12 min ou express ~6 min.",
    },
    en: {
      subject: `Your asset scored ${data.score}/100 on AUROS (indicative)`,
      kicker: "Indicative AUROS score",
      line: "This score guides preparation — it does not replace due diligence.",
      asset: `Asset detected: <strong>${asset}</strong>`,
      cta: "Structure my dossier",
      foot: "Guided path ~12 min or express ~6 min.",
    },
    es: {
      subject: `Su activo: ${data.score}/100 en AUROS (indicativo)`,
      kicker: "Puntuación indicativa AUROS",
      line: "Orienta la preparación — no sustituye la due diligence.",
      asset: `Activo detectado: <strong>${asset}</strong>`,
      cta: "Estructurar mi dossier",
      foot: "Recorrido guiado ~12 min o express ~6 min.",
    },
  }[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

  return {
    subject: copy.subject,
    ctaLabel: copy.cta,
    htmlBody: `
    <p style="margin:0 0 8px;font-size:13px;color:#7a7a82;text-transform:uppercase;letter-spacing:0.12em;">${copy.kicker}</p>
    <p style="margin:0;font-size:48px;font-weight:700;line-height:1;">${data.score}<span style="font-size:20px;color:#7a7a82;">/100</span></p>
    <p style="margin:12px 0 20px;color:#7a7a82;">${tier}</p>
    <p style="margin:0 0 8px;color:#f5f5f7;">${copy.asset}</p>
    <p style="margin:0 0 20px;color:#7a7a82;">${copy.line}</p>
    <p style="margin:0;font-size:12px;color:#7a7a82;">${copy.foot}</p>
  `,
  };
}

// --- AUROS Academy reminders (opt-in, non obligatoire) ---

export type AcademyReminderEmailInput = {
  firstName: string;
  expiresAt: string;
  verifyUrl: string;
  renewUrl: string;
  unsubscribeUrl: string;
};

function formatAcademyDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function localizedAcademyReminderJ14(
  data: AcademyReminderEmailInput,
  locale: Locale
): LocalizedEmailBlock {
  const name = escapeHtml(data.firstName || (locale === "fr" ? "à vous" : "there"));
  const date = escapeHtml(formatAcademyDate(data.expiresAt, locale));

  const copy = {
    fr: {
      subject: "AUROS Academy — micro-màj disponible (optionnel)",
      body: `Bonjour ${name}, votre attestation Fondamentaux RWA reste <strong>valide et vérifiable</strong> jusqu'au ${date}.`,
      detail:
        "Le cadre RWA évolue — si vous le souhaitez, un micro-parcours gratuit (~5 min) permet de prolonger la date de validité. <strong>C'est optionnel</strong> : votre lien public continue de fonctionner dans tous les cas.",
    },
    en: {
      subject: "AUROS Academy — optional refresh available",
      body: `Hi ${name}, your RWA Fundamentals attestation remains <strong>valid and verifiable</strong> until ${date}.`,
      detail:
        "RWA regulation evolves — if you wish, a free micro-path (~5 min) can extend validity. <strong>Entirely optional</strong>: your public verify link always works.",
    },
    es: {
      subject: "AUROS Academy — actualización opcional disponible",
      body: `Hola ${name}, su attestation sigue <strong>válida y verificable</strong> hasta el ${date}.`,
      detail:
        "El marco RWA evoluciona — si lo desea, un micro-recorrido gratuito (~5 min) puede extender la validez. <strong>Opcional</strong>: su enlace público sigue funcionando.",
    },
  }[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

  return {
    subject: copy.subject,
    ctaLabel: locale === "fr" ? "Mettre à jour quand je veux" : locale === "es" ? "Actualizar cuando quiera" : "Refresh when I want",
    htmlBody: `
    <p style="margin:0 0 16px;">${copy.body}</p>
    <p style="margin:0 0 20px;color:#7a7a82;">${copy.detail}</p>
    <p style="margin:0;font-size:12px;color:#7a7a82;">AUROS Academy · formation indicative, non agréée État.</p>
  `,
  };
}

export function localizedAcademyReminderJ3(
  data: AcademyReminderEmailInput,
  locale: Locale
): LocalizedEmailBlock {
  const name = escapeHtml(data.firstName || (locale === "fr" ? "à vous" : "there"));
  const date = escapeHtml(formatAcademyDate(data.expiresAt, locale));

  const copy = {
    fr: {
      subject: "AUROS Academy — rappel amical (optionnel)",
      body: `Bonjour ${name}, rappel discret : votre attestation reste vérifiable jusqu'au ${date}.`,
      detail:
        "Dans quelques jours, le statut passera à « renouvellement recommandé » sur votre page verify — sans impact sur le lien. Micro-màj ~5 min si vous souhaitez rester à jour. Aucune obligation.",
    },
    en: {
      subject: "AUROS Academy — friendly reminder (optional)",
      body: `Hi ${name}, a gentle note: your attestation stays verifiable until ${date}.`,
      detail:
        "Soon the verify page will show “renewal recommended” — the link still works. Optional ~5 min refresh. No obligation.",
    },
    es: {
      subject: "AUROS Academy — recordatorio amable (opcional)",
      body: `Hola ${name}, su attestation sigue verificable hasta el ${date}.`,
      detail:
        "Pronto la página mostrará « renovación recomendada » — el enlace sigue activo. Micro-actualización ~5 min. Sin obligación.",
    },
  }[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

  return {
    subject: copy.subject,
    ctaLabel: locale === "fr" ? "Micro-màj optionnelle" : locale === "es" ? "Actualización opcional" : "Optional refresh",
    htmlBody: `
    <p style="margin:0 0 16px;">${copy.body}</p>
    <p style="margin:0 0 20px;color:#7a7a82;">${copy.detail}</p>
  `,
  };
}

export type AcademyRenewalSuccessEmailInput = AcademyReminderEmailInput & {
  renewalGeneration: number;
};

export function localizedAcademyRenewalSuccess(
  data: AcademyRenewalSuccessEmailInput,
  locale: Locale
): LocalizedEmailBlock {
  const name = escapeHtml(data.firstName || (locale === "fr" ? "à vous" : "there"));
  const date = escapeHtml(formatAcademyDate(data.expiresAt, locale));

  const copy = {
    fr: {
      subject: "AUROS Academy — attestation mise à jour",
      body: `Bonjour ${name}, votre attestation a été <strong>mise à jour</strong> (génération ${data.renewalGeneration}).`,
      detail: `Même ID, nouvelle validité jusqu'au ${date}. Votre page verify reflète le statut actif.`,
      cta: "Partager ma page verify",
    },
    en: {
      subject: "AUROS Academy — attestation updated",
      body: `Hi ${name}, your attestation was <strong>updated</strong> (generation ${data.renewalGeneration}).`,
      detail: `Same ID, new validity until ${date}.`,
      cta: "Share verify page",
    },
    es: {
      subject: "AUROS Academy — attestation actualizada",
      body: `Hola ${name}, su attestation fue <strong>actualizada</strong> (generación ${data.renewalGeneration}).`,
      detail: `Mismo ID, validez hasta el ${date}.`,
      cta: "Compartir verify",
    },
  }[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

  return {
    subject: copy.subject,
    ctaLabel: copy.cta,
    htmlBody: `
    <p style="margin:0 0 16px;">${copy.body}</p>
    <p style="margin:0 0 20px;color:#7a7a82;">${copy.detail}</p>
  `,
  };
}

export function localizedAcademyRemindersSubscribed(
  data: AcademyReminderEmailInput,
  locale: Locale
): LocalizedEmailBlock {
  const name = escapeHtml(data.firstName || (locale === "fr" ? "à vous" : "there"));
  const date = escapeHtml(formatAcademyDate(data.expiresAt, locale));

  const copy = {
    fr: {
      subject: "AUROS Academy — rappels amicaux activés",
      body: `Bonjour ${name}, nous vous enverrons au plus <strong>2 e-mails optionnels</strong> avant le ${date} (~14 j et ~3 j).`,
      detail:
        "Aucune obligation de renouveler. Désinscription en un clic à tout moment. Votre attestation reste vérifiable même sans renouvellement.",
      cta: "Voir ma page verify",
    },
    en: {
      subject: "AUROS Academy — friendly reminders enabled",
      body: `Hi ${name}, we'll send at most <strong>2 optional emails</strong> before ${date}.`,
      detail: "No renewal obligation. Unsubscribe anytime.",
      cta: "View verify page",
    },
    es: {
      subject: "AUROS Academy — recordatorios activados",
      body: `Hola ${name}, enviaremos como máximo <strong>2 correos opcionales</strong> antes del ${date}.`,
      detail: "Sin obligación de renovar. Baja en un clic.",
      cta: "Ver verify",
    },
  }[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

  return {
    subject: copy.subject,
    ctaLabel: copy.cta,
    htmlBody: `
    <p style="margin:0 0 16px;">${copy.body}</p>
    <p style="margin:0 0 20px;color:#7a7a82;">${copy.detail}</p>
  `,
  };
}
