import type { Metadata } from "next";
import { Suspense } from "react";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";

import { JurisdictionEnterpriseProof } from "@/app/jurisdictions/_components/JurisdictionEnterpriseProof";
import { StarterKitOnePagerLink } from "@/app/jurisdictions/_components/StarterKitOnePagerLink";
import { JurisdictionAssetUseCases } from "@/app/jurisdictions/_components/JurisdictionAssetUseCases";
import { JurisdictionLegalMethodology } from "@/app/jurisdictions/_components/JurisdictionLegalMethodology";
import { JurisdictionRoiStrip } from "@/app/jurisdictions/_components/JurisdictionRoiStrip";
import { JurisdictionValueStack } from "@/app/jurisdictions/_components/JurisdictionValueStack";
import { JurisdictionFaq } from "@/app/jurisdictions/_components/JurisdictionFaq";
import { JurisdictionProviders } from "@/app/jurisdictions/_components/JurisdictionProviders";
import { MobilePageShell } from "@/app/_components/ui/MobilePageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { BezelCard } from "@/app/_components/ui/BezelCard";
import { absoluteUrl } from "@/lib/comparators/site";
import {
  JURISDICTIONS_ANCHORS,
  JURISDICTIONS_ROUTE,
  JURISDICTIONS_STARTER_KIT_ROUTE,
} from "@/lib/jurisdictions/constants";
import { getEnterpriseMessages } from "@/lib/jurisdictions/enterprise-messages";

export const metadata: Metadata = {
  title: "Starter Kit RWA — 5 000 € | AUROS",
  description:
    "Structure juridique, checklist réglementaire, calendrier et shortlist tech — livraison instantanée post-paiement. Phase 0 tokenisation B2B.",
  alternates: {
    canonical: JURISDICTIONS_STARTER_KIT_ROUTE,
  },
  openGraph: {
    title: "RWA Starter Kit | AUROS",
    description:
      "Jurisdiction decision + dossier preparation — portal and PDF, instant delivery.",
    url: absoluteUrl(JURISDICTIONS_STARTER_KIT_ROUTE),
    siteName: "AUROS",
    type: "website",
  },
};

export default function StarterKitPage() {
  const m = getEnterpriseMessages("fr").starterKitPage;

  return (
    <JurisdictionProviders>
      <AiFirstPageJsonLd path={JURISDICTIONS_STARTER_KIT_ROUTE} />
      <MobilePageShell width="6xl" stickyBottom>
          <header className="max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-300/80">
              {m.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
              {m.h1}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/55">
              {m.subtitle}
            </p>
            <p className="mt-6 font-display text-4xl text-white">{m.price}</p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-emerald-300/70">
              {m.valueHeadline}
            </p>
            <div className="mt-8 flex flex-wrap items-start gap-6">
              <div className="flex flex-wrap gap-3">
                <PrimaryButton href={`${JURISDICTIONS_ROUTE}${JURISDICTIONS_ANCHORS.guide}`}>
                  {m.ctaGuide}
                </PrimaryButton>
                <a
                  href={`${JURISDICTIONS_ROUTE}${JURISDICTIONS_ANCHORS.quote}`}
                  className="inline-flex items-center rounded-full border border-white/15 px-6 py-3 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
                >
                  {m.ctaPricing}
                </a>
              </div>
              <StarterKitOnePagerLink />
            </div>
          </header>

          <JurisdictionValueStack />
          <JurisdictionAssetUseCases />
          <JurisdictionLegalMethodology />
          <JurisdictionRoiStrip />

          <div className="mt-16 grid gap-5 lg:grid-cols-2">
            <BezelCard innerClassName="p-6 md:p-8" animate>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/70">
                {m.includedTitle}
              </h2>
              <ul className="mt-5 space-y-3">
                {m.included.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-white/70"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </BezelCard>

            <BezelCard innerClassName="p-6 md:p-8" animate>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                {m.excludedTitle}
              </h2>
              <ul className="mt-5 space-y-3">
                {m.excluded.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-white/45"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/20" />
                    {item}
                  </li>
                ))}
              </ul>
            </BezelCard>
          </div>

          <BezelCard className="mt-5" innerClassName="p-6 md:p-8" animate>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              {m.deliveryTitle}
            </h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-4">
              {m.deliverySteps.map((step, i) => (
                <li key={step} className="jurisdiction-path-step">
                  <span className="jurisdiction-path-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed text-white/60">{step}</p>
                </li>
              ))}
            </ol>
          </BezelCard>

          <Suspense fallback={null}>
            <JurisdictionEnterpriseProof />
            <JurisdictionFaq id="starter-faq" />
          </Suspense>
      </MobilePageShell>
    </JurisdictionProviders>
  );
}
