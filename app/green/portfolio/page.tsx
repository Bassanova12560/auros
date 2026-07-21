import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_PORTFOLIO_ROUTE } from "@/lib/green";
import { getGreenPortfolioSnapshot } from "@/lib/green/portfolio-snapshot";
import { auditOgImage, mergeAuditOg } from "@/lib/seo/audit-og";

import { GreenPortfolioView } from "../_components/GreenPortfolioView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = mergeAuditOg(
  {
    title: "Portfolio Console | AUROS Green",
    description:
      "Vue institutionnelle Asset DNA + Proof Stream — registre et marché Green.",
    alternates: { canonical: GREEN_PORTFOLIO_ROUTE },
    openGraph: {
      title: "Portfolio Console | AUROS Green",
      url: absoluteUrl(GREEN_PORTFOLIO_ROUTE),
      type: "website",
    },
  },
  auditOgImage("/green/portfolio", "Portfolio+Console+%7C+AUROS+Green")
);

export default async function GreenPortfolioPage() {
  const snapshot = await getGreenPortfolioSnapshot(50);

  return (
    <>
      <AiFirstPageJsonLd path={GREEN_PORTFOLIO_ROUTE} />
      <GreenPortfolioView snapshot={snapshot} />
    </>
  );
}
