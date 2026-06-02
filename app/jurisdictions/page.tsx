import type { Metadata } from "next";
import { Suspense } from "react";

import { JurisdictionConversionPath } from "@/app/jurisdictions/_components/JurisdictionConversionPath";
import { JurisdictionEnterpriseProof } from "@/app/jurisdictions/_components/JurisdictionEnterpriseProof";
import { JurisdictionFaq } from "@/app/jurisdictions/_components/JurisdictionFaq";
import { JurisdictionSetupCalculator } from "@/app/jurisdictions/_components/JurisdictionSetupCalculator";
import { JurisdictionTrustStrip } from "@/app/jurisdictions/_components/JurisdictionTrustStrip";
import { JurisdictionUrlPrefill } from "@/app/jurisdictions/_components/JurisdictionUrlPrefill";
import { JurisdictionLegalMethodology } from "@/app/jurisdictions/_components/JurisdictionLegalMethodology";
import { JurisdictionAssetUseCases } from "@/app/jurisdictions/_components/JurisdictionAssetUseCases";
import { StarterKitOnePagerLink } from "@/app/jurisdictions/_components/StarterKitOnePagerLink";
import { JurisdictionRoiStrip } from "@/app/jurisdictions/_components/JurisdictionRoiStrip";
import { JurisdictionValueStack } from "@/app/jurisdictions/_components/JurisdictionValueStack";
import { JurisdictionValueComparison } from "@/app/jurisdictions/_components/JurisdictionValueComparison";
import { JurisdictionProviders } from "@/app/jurisdictions/_components/JurisdictionProviders";
import { GuideSection } from "@/app/jurisdictions/_components/GuideSection";
import { JurisdictionComparator } from "@/app/jurisdictions/_components/JurisdictionComparator";
import { JurisdictionHero } from "@/app/jurisdictions/_components/JurisdictionHero";
import { JurisdictionPaymentBanner } from "@/app/jurisdictions/_components/JurisdictionPaymentBanner";
import { PricingSection } from "@/app/jurisdictions/_components/PricingSection";
import { MobilePageShell } from "@/app/_components/ui/MobilePageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { JURISDICTIONS_ROUTE } from "@/lib/jurisdictions";

export const metadata: Metadata = {
  title: "RWA Jurisdiction Comparator | AUROS",
  description:
    "Compare 8 tokenization jurisdictions — fees, timelines, licences, tax and KYC. B2B tool for real estate sponsors and asset owners.",
  alternates: {
    canonical: JURISDICTIONS_ROUTE,
  },
  openGraph: {
    title: "RWA Jurisdiction Comparator | AUROS",
    description:
      "Where to tokenize your asset? Compare Luxembourg, Dubai, Singapore, Switzerland and more.",
    url: absoluteUrl(JURISDICTIONS_ROUTE),
    siteName: "AUROS",
    type: "website",
  },
};

export default function JurisdictionsPage() {
  return (
    <JurisdictionProviders>
      <AiFirstPageJsonLd path={JURISDICTIONS_ROUTE} />
      <MobilePageShell width="6xl" stickyBottom>
          <Suspense fallback={null}>
            <JurisdictionPaymentBanner />
            <JurisdictionUrlPrefill />
          </Suspense>
          <JurisdictionHero />
          <JurisdictionTrustStrip />
          <JurisdictionConversionPath />
          <JurisdictionComparator />
          <GuideSection />
          <JurisdictionSetupCalculator />
          <JurisdictionValueStack />
          <JurisdictionAssetUseCases />
          <JurisdictionLegalMethodology />
          <JurisdictionRoiStrip />
          <JurisdictionValueComparison />
          <JurisdictionEnterpriseProof />
          <PricingSection />
          <StarterKitOnePagerLink className="mt-10 border-t border-white/[0.06] pt-10" />
          <JurisdictionFaq />
      </MobilePageShell>
    </JurisdictionProviders>
  );
}
