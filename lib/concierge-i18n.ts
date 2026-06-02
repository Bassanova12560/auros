import type { Locale } from "@/lib/i18n";

export type ConciergeMessages = {
  eyebrow: string;
  title: string;
  subtitle: string;
  benefits: [string, string, string];
  success: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  submit: string;
  submitting: string;
  footer: string;
};

const FR: ConciergeMessages = {
  eyebrow: "AUROS Concierge",
  title: "Votre actif est éligible à un accompagnement personnalisé",
  subtitle:
    "Les actifs au-delà de 500 000 € avec un fort potentiel de tokenisation bénéficient d'un suivi dédié.",
  benefits: [
    "Revue personnalisée du dossier sous 48 h",
    "Mise en relation directe avec les décideurs plateforme",
    "Accompagnement de bout en bout pour la soumission",
  ],
  success:
    "✓ Demande reçue. Un spécialiste AUROS vous contactera sous 48 heures.",
  name: "Nom complet",
  email: "E-mail",
  phone: "Téléphone",
  message: "Précisez votre projet…",
  submit: "Demander une revue concierge →",
  submitting: "Envoi…",
  footer: "Sans engagement. Service gratuit.",
};

const EN: ConciergeMessages = {
  eyebrow: "AUROS Concierge",
  title: "Your asset qualifies for personal review",
  subtitle:
    "Assets above €500,000 with strong tokenization potential receive dedicated support.",
  benefits: [
    "Personal dossier review within 48 hours",
    "Direct introduction to platform decision-makers",
    "End-to-end submission support",
  ],
  success:
    "✓ Request received. An AUROS specialist will contact you within 48 hours.",
  name: "Full name",
  email: "Email",
  phone: "Phone number",
  message: "Tell us more about your project…",
  submit: "Request concierge review →",
  submitting: "Sending…",
  footer: "No commitment required. Free service.",
};

const ES: ConciergeMessages = {
  ...EN,
  title: "Su activo califica para una revisión personalizada",
  subtitle:
    "Activos superiores a 500 000 € con alto potencial de tokenización reciben atención dedicada.",
  benefits: [
    "Revisión personalizada del dossier en 48 h",
    "Introducción directa a responsables de plataforma",
    "Acompañamiento integral en la presentación",
  ],
  success:
    "✓ Solicitud recibida. Un especialista AUROS le contactará en 48 horas.",
  name: "Nombre completo",
  email: "Correo",
  phone: "Teléfono",
  message: "Cuéntenos más sobre su proyecto…",
  submit: "Solicitar revisión concierge →",
  submitting: "Enviando…",
  footer: "Sin compromiso. Servicio gratuito.",
};

const CATALOG: Record<Locale, ConciergeMessages> = { fr: FR, en: EN, es: ES };

export function getConciergeMessages(locale: Locale): ConciergeMessages {
  return CATALOG[locale] ?? FR;
}
