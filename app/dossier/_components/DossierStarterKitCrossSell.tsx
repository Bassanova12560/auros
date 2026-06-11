"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { track } from "@/lib/analytics";

type Props = {
  paidTier?: string;
};

function isProWizardTier(paidTier?: string): boolean {
  return paidTier === "pro" || paidTier === "wizard_pro";
}

export function DossierStarterKitCrossSell({ paidTier }: Props) {
  const { locale } = useLocale();

  if (!isProWizardTier(paidTier)) return null;

  const title =
    locale === "fr"
      ? "Starter Kit juridictions — 5 000 €"
      : locale === "es"
        ? "Starter Kit jurisdicciones — 5 000 €"
        : "Jurisdiction Starter Kit — €5,000";

  const body =
    locale === "fr"
      ? "Votre dossier Pro est prêt. Passez à la phase 0 : structure SPV, checklist réglementaire et shortlist tech — livraison immédiate après paiement."
      : locale === "es"
        ? "Su dossier Pro está listo. Avance a la fase 0: estructura SPV, checklist regulatorio y shortlist tech — entrega inmediata tras el pago."
        : "Your Pro dossier is ready. Move to phase 0: SPV structure, regulatory checklist and tech shortlist — instant delivery after payment.";

  const cta =
    locale === "fr"
      ? "Voir le Starter Kit →"
      : locale === "es"
        ? "Ver Starter Kit →"
        : "View Starter Kit →";

  return (
    <section className="mb-8 rounded-2xl border border-[color-mix(in_srgb,var(--auros-green-warm)_35%,white)] bg-[color-mix(in_srgb,var(--auros-green-warm)_8%,transparent)] px-5 py-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
        {locale === "fr" ? "Étape suivante" : locale === "es" ? "Siguiente paso" : "Next step"}
      </p>
      <h2 className="mt-2 font-display text-lg text-white">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/60">{body}</p>
      <Link
        href="/jurisdictions/starter-kit"
        onClick={() => track("dossier_starter_kit_crosssell")}
        className="mt-4 inline-block font-mono text-[11px] uppercase tracking-wider text-[var(--auros-green-warm)] hover:underline"
      >
        {cta}
      </Link>
    </section>
  );
}
