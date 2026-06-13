import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { getAiFirstPageByPath } from "@/lib/ai-first";
import { buildPageJsonLd } from "@/lib/ai-first/json-ld";
import { GREEN_IMPACT_REPORT_ROUTE } from "@/lib/green/constants";
import { metadataFromPath } from "@/lib/seo/metadata";
import { withOgImage } from "@/lib/seo/og";

import { GreenImpactReportCta } from "@/app/green/_components/GreenImpactReportCta";

export const metadata: Metadata = withOgImage(
  metadataFromPath(GREEN_IMPACT_REPORT_ROUTE),
  GREEN_IMPACT_REPORT_ROUTE,
  "Rapport d'impact Green — PDF EU Taxonomy + RTMS"
);

const impactReportJsonLd = buildPageJsonLd(
  getAiFirstPageByPath(GREEN_IMPACT_REPORT_ROUTE)!
);

export default function GreenImpactReportPage() {
  return (
    <FocusPageShell path={GREEN_IMPACT_REPORT_ROUTE} width="3xl">
      {impactReportJsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
      <div className="space-y-8 py-8 md:py-12">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/70">
            AUROS Green
          </p>
          <h1 className="mt-4 text-2xl font-light text-white md:text-3xl">
            Rapport d&apos;impact Green
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">
            Synthèse PDF EU Taxonomy + RTMS depuis votre dossier — indicatif, prêt à partager en
            interne avec votre conseil ESG.
          </p>
        </div>
        <GreenImpactReportCta />
      </div>
    </FocusPageShell>
  );
}
