import type { Locale } from "@/lib/i18n";

export type GreenLabelReadyCopy = {
  loading: string;
  eyebrow: string;
  title: string;
  description: string;
  reference: (id: string) => string;
  backLink: string;
  errors: {
    sessionMissing: string;
    paymentUnconfirmed: string;
  };
};

const FR: GreenLabelReadyCopy = {
  loading: "Vérification du paiement…",
  eyebrow: "Label AUROS Green",
  title: "Paiement confirmé",
  description:
    "Votre revue documentaire RTMS (300 €) est enregistrée. Notre équipe revient vers vous sous 5 jours ouvrés.",
  reference: (id) => `Référence dossier : ${id.slice(0, 8)}…`,
  backLink: "Retour AUROS Green",
  errors: {
    sessionMissing: "Session de paiement introuvable.",
    paymentUnconfirmed: "Paiement non confirmé — contactez-nous si le débit apparaît.",
  },
};

const EN: GreenLabelReadyCopy = {
  ...FR,
  loading: "Verifying payment…",
  eyebrow: "AUROS Green Label",
  title: "Payment confirmed",
  description:
    "Your RTMS document review (€300) is recorded. Our team will respond within 5 business days.",
  reference: (id) => `Application reference: ${id.slice(0, 8)}…`,
  backLink: "Back to AUROS Green",
  errors: {
    sessionMissing: "Payment session not found.",
    paymentUnconfirmed: "Payment not confirmed — contact us if you were charged.",
  },
};

const ES: GreenLabelReadyCopy = {
  ...FR,
  loading: "Verificando pago…",
  eyebrow: "Label AUROS Green",
  title: "Pago confirmado",
  description:
    "Su revisión documental RTMS (300 €) está registrada. Respondemos en 5 días hábiles.",
  reference: (id) => `Referencia: ${id.slice(0, 8)}…`,
  backLink: "Volver a AUROS Green",
  errors: {
    sessionMissing: "Sesión de pago no encontrada.",
    paymentUnconfirmed: "Pago no confirmado — contáctenos si se realizó el cargo.",
  },
};

const CATALOG: Record<Locale, GreenLabelReadyCopy> = { fr: FR, en: EN, es: ES };

export function getGreenLabelReadyCopy(locale: Locale): GreenLabelReadyCopy {
  return CATALOG[locale] ?? FR;
}
