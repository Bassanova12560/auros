import { resolveCatalogLocale, type CatalogMap, type Locale } from "@/lib/i18n";

export type GreenImpactReportCopy = {
  page: {
    title: string;
    subtitle: string;
  };
  cta: {
    eyebrow: string;
    description: string;
    orderStandard: string;
    orderInstitutional: string;
    redirecting: string;
    paymentNote: string;
    compactDescription: string;
    pdfStandard: string;
    institutional: string;
    wizardHint: string;
    wizardLink: string;
    errors: {
      emailRequired: string;
      stripeUnavailable: string;
      checkoutFailed: string;
      network: string;
    };
  };
  ready: {
    eyebrow: string;
    title: string;
    description: string;
    download: string;
    redownload: string;
    generating: string;
    backLink: string;
    loading: string;
    errors: {
      sessionMissing: string;
      paymentUnconfirmed: string;
      generationFailed: string;
      network: string;
    };
  };
  checkoutCancelled: {
    message: string;
    retryLink: string;
  };
};

const FR: GreenImpactReportCopy = {
  page: {
    title: "Rapport d'impact Green",
    subtitle:
      "Synthèse PDF EU Taxonomy + RTMS depuis votre dossier — indicatif, prêt à partager en interne avec votre conseil ESG.",
  },
  cta: {
    eyebrow: "Rapport d'impact Green",
    description:
      "Synthèse PDF EU Taxonomy + RTMS depuis votre dossier — indicatif, prêt à partager en interne.",
    orderStandard: "Commander · 49 €",
    orderInstitutional: "Institutionnel · 199 €",
    redirecting: "Redirection…",
    paymentNote: "Paiement sécurisé Stripe · téléchargement immédiat après validation.",
    compactDescription:
      "Rapport PDF institutionnel — EU Taxonomy + RTMS, prêt à partager.",
    pdfStandard: "PDF · 49 €",
    institutional: "Version institutionnelle · 199 €",
    wizardHint: "pour enrichir le rapport.",
    wizardLink: "Complétez le wizard Green",
    errors: {
      emailRequired: "Indiquez votre e-mail dans le wizard pour commander le rapport.",
      stripeUnavailable: "Paiement temporairement indisponible — réessayez plus tard.",
      checkoutFailed: "Impossible de lancer le paiement.",
      network: "Erreur réseau — réessayez.",
    },
  },
  ready: {
    eyebrow: "AUROS Green · Impact Report",
    title: "Paiement confirmé",
    description:
      "Votre rapport d'impact est prêt. Téléchargez le PDF EU Taxonomy + RTMS — indicatif, à valider avec votre conseil ESG.",
    download: "Télécharger le PDF",
    redownload: "Retélécharger le PDF",
    generating: "Génération…",
    backLink: "Retour AUROS Green",
    loading: "Chargement…",
    errors: {
      sessionMissing: "Session de paiement introuvable.",
      paymentUnconfirmed: "Paiement non confirmé — contactez support@getauros.com.",
      generationFailed: "Génération du PDF impossible.",
      network: "Erreur réseau — réessayez.",
    },
  },
  checkoutCancelled: {
    message:
      "Paiement du rapport d'impact annulé — votre dossier wizard est intact. Vous pouvez réessayer quand vous voulez.",
    retryLink: "Reprendre le rapport d'impact →",
  },
};

const EN: GreenImpactReportCopy = {
  page: {
    title: "Green Impact Report",
    subtitle:
      "EU Taxonomy + RTMS PDF summary from your dossier — indicative, ready to share internally with your ESG counsel.",
  },
  cta: {
    eyebrow: "Green Impact Report",
    description:
      "EU Taxonomy + RTMS PDF summary from your dossier — indicative, ready to share internally.",
    orderStandard: "Order · €49",
    orderInstitutional: "Institutional · €199",
    redirecting: "Redirecting…",
    paymentNote: "Secure Stripe payment · instant download after checkout.",
    compactDescription:
      "Institutional PDF report — EU Taxonomy + RTMS, ready to share.",
    pdfStandard: "PDF · €49",
    institutional: "Institutional edition · €199",
    wizardHint: "to enrich the report.",
    wizardLink: "Complete the Green wizard",
    errors: {
      emailRequired: "Enter your email in the wizard to order the report.",
      stripeUnavailable: "Payment temporarily unavailable — try again later.",
      checkoutFailed: "Could not start checkout.",
      network: "Network error — try again.",
    },
  },
  ready: {
    eyebrow: "AUROS Green · Impact Report",
    title: "Payment confirmed",
    description:
      "Your impact report is ready. Download the EU Taxonomy + RTMS PDF — indicative, validate with your ESG counsel.",
    download: "Download PDF",
    redownload: "Download PDF again",
    generating: "Generating…",
    backLink: "Back to AUROS Green",
    loading: "Loading…",
    errors: {
      sessionMissing: "Payment session not found.",
      paymentUnconfirmed: "Payment not confirmed — contact support@getauros.com.",
      generationFailed: "Could not generate PDF.",
      network: "Network error — try again.",
    },
  },
  checkoutCancelled: {
    message:
      "Impact report payment cancelled — your wizard dossier is unchanged. You can try again anytime.",
    retryLink: "Back to Impact Report →",
  },
};

const ES: GreenImpactReportCopy = {
  page: {
    title: "Informe de impacto Green",
    subtitle:
      "Resumen PDF EU Taxonomy + RTMS desde su dossier — indicativo, listo para compartir internamente con su counsel ESG.",
  },
  cta: {
    eyebrow: "Informe de impacto Green",
    description:
      "Resumen PDF EU Taxonomy + RTMS desde su dossier — indicativo, listo para compartir internamente.",
    orderStandard: "Pedir · 49 €",
    orderInstitutional: "Institucional · 199 €",
    redirecting: "Redirigiendo…",
    paymentNote: "Pago seguro Stripe · descarga inmediata tras la validación.",
    compactDescription:
      "Informe PDF institucional — EU Taxonomy + RTMS, listo para compartir.",
    pdfStandard: "PDF · 49 €",
    institutional: "Edición institucional · 199 €",
    wizardHint: "para enriquecer el informe.",
    wizardLink: "Complete el wizard Green",
    errors: {
      emailRequired: "Indique su e-mail en el wizard para pedir el informe.",
      stripeUnavailable: "Pago temporalmente no disponible — reintente más tarde.",
      checkoutFailed: "No se pudo iniciar el pago.",
      network: "Error de red — reintente.",
    },
  },
  ready: {
    eyebrow: "AUROS Green · Impact Report",
    title: "Pago confirmado",
    description:
      "Su informe de impacto está listo. Descargue el PDF EU Taxonomy + RTMS — indicativo, valide con su counsel ESG.",
    download: "Descargar PDF",
    redownload: "Volver a descargar PDF",
    generating: "Generando…",
    backLink: "Volver a AUROS Green",
    loading: "Cargando…",
    errors: {
      sessionMissing: "Sesión de pago no encontrada.",
      paymentUnconfirmed: "Pago no confirmado — contacte support@getauros.com.",
      generationFailed: "No se pudo generar el PDF.",
      network: "Error de red — reintente.",
    },
  },
  checkoutCancelled: {
    message:
      "Pago del informe de impacto cancelado — su dossier wizard no ha cambiado. Puede reintentar cuando quiera.",
    retryLink: "Volver al informe de impacto →",
  },
};

const COPY: CatalogMap< GreenImpactReportCopy> = { fr: FR, en: EN, es: ES };

export function getGreenImpactReportCopy(locale: Locale): GreenImpactReportCopy {
  return COPY[resolveCatalogLocale(locale)] ?? FR;
}
