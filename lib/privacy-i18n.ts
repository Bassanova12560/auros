import type { Locale } from "@/lib/i18n";

export type PrivacyMessages = {
  tag: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; body: string }>;
  contact: string;
  updated: string;
  home: string;
};

const FR: PrivacyMessages = {
  tag: "Légal",
  title: "Politique de confidentialité",
  intro:
    "AUROS traite des données personnelles lorsque vous utilisez notre plateforme de préparation à la tokenisation. Ce document décrit ce que nous collectons, pourquoi, et vos droits RGPD.",
  sections: [
    {
      title: "Données collectées",
      body: "Descriptions d'actifs, coordonnées (nom, e-mail), réponses au wizard, dossiers IA générés, identifiants de compte via Clerk.",
    },
    {
      title: "Cookies",
      body: "Vercel Analytics (métriques anonymes) si vous acceptez le bandeau. Pas de cookies publicitaires. Clerk utilise des cookies essentiels pour l'authentification.",
    },
    {
      title: "Conservation",
      body: "Liens de partage : 30 jours. Dossiers compte : jusqu'à suppression par vous. Leads marketing : tant que le consentement est actif.",
    },
    {
      title: "Vos droits (RGPD)",
      body: "Accès, rectification, effacement (dashboard ou contact), retrait du consentement marketing, réclamation auprès de votre autorité de contrôle.",
    },
    {
      title: "Sous-traitants",
      body: "Supabase (base de données), Clerk (auth), Vercel (hébergement), Resend (e-mails transactionnels).",
    },
  ],
  contact: "privacy@auros.app",
  updated: "Dernière mise à jour : mai 2026",
  home: "← Accueil",
};

const EN: PrivacyMessages = {
  tag: "Legal",
  title: "Privacy policy",
  intro:
    'AUROS ("we") processes personal data when you use our tokenization readiness platform. This policy describes what we collect, why, and your GDPR rights.',
  sections: [
    {
      title: "Data we collect",
      body: "Asset descriptions, contact details, wizard answers, AI-generated dossiers, and account identifiers via Clerk.",
    },
    {
      title: "Cookies",
      body: "Vercel Analytics only if you accept our banner. No advertising cookies. Clerk sets essential auth cookies.",
    },
    {
      title: "Retention",
      body: "Share links: 30 days. Account dossiers: until you delete them. Marketing leads: while consent is active.",
    },
    {
      title: "Your rights (GDPR)",
      body: "Access, rectification, erasure, withdraw marketing consent, lodge a complaint with your supervisory authority.",
    },
    {
      title: "Processors",
      body: "Supabase, Clerk, Vercel, Resend.",
    },
  ],
  contact: "privacy@auros.app",
  updated: "Last updated: May 2026",
  home: "← Home",
};

const ES: PrivacyMessages = {
  tag: "Legal",
  title: "Política de privacidad",
  intro:
    "AUROS trata datos personales cuando utiliza nuestra plataforma de preparación para tokenización. Describe qué recogemos, por qué y sus derechos RGPD.",
  sections: [
    {
      title: "Datos que recogemos",
      body: "Descripciones de activos, contacto, respuestas del wizard, dossiers IA e identificadores de cuenta vía Clerk.",
    },
    {
      title: "Cookies",
      body: "Vercel Analytics solo si acepta el banner. Sin cookies publicitarias. Clerk usa cookies esenciales de sesión.",
    },
    {
      title: "Conservación",
      body: "Enlaces compartidos: 30 días. Dossiers de cuenta: hasta que los elimine. Leads: mientras el consentimiento esté activo.",
    },
    {
      title: "Sus derechos (RGPD)",
      body: "Acceso, rectificación, supresión, retirar consentimiento, reclamación ante la autoridad de control.",
    },
    {
      title: "Encargados",
      body: "Supabase, Clerk, Vercel, Resend.",
    },
  ],
  contact: "privacy@auros.app",
  updated: "Última actualización: mayo 2026",
  home: "← Inicio",
};

export function getPrivacyMessages(locale: Locale): PrivacyMessages {
  const map = { fr: FR, en: EN, es: ES };
  return map[locale] ?? FR;
}
