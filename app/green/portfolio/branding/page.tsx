import Link from "next/link";

import { InstitutionalTenantForms } from "@/app/green/_components/InstitutionalTenantForms";
import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
} from "@/app/green/_components/green-ui";
import {
  GREEN_PORTFOLIO_DESK_ROUTE,
  GREEN_PORTFOLIO_ROUTE,
  GREEN_PORTFOLIO_SSO_ROUTE,
  GREEN_ROUTE,
} from "@/lib/green";

export const metadata = {
  title: "Branding & IdP | AUROS Portfolio",
  description:
    "Demande white-label et métadonnées SSO SAML/OIDC — activation HITL ops.",
  robots: { index: true, follow: true },
};

export default function GreenPortfolioBrandingPage() {
  return (
    <div className="page-inner page-inner--4xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <GreenPageHeader
        eyebrow="Self-serve · HITL"
        title="Branding & métadonnées IdP"
        intro="Soumettez votre charte embed et vos métadonnées SAML/OIDC. Activation manuelle ops — pas d’auto-publish en prod."
        compact
      />

      <GreenPanel className="mt-8">
        <InstitutionalTenantForms />
      </GreenPanel>

      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href={GREEN_PORTFOLIO_SSO_ROUTE}
          className="font-mono text-[11px] uppercase tracking-wider text-emerald-400/90 hover:text-emerald-300"
        >
          Runbook SSO →
        </Link>
        <Link
          href={GREEN_PORTFOLIO_DESK_ROUTE}
          className="font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
        >
          Desk →
        </Link>
      </div>

      <GreenDisclaimer>
        HITL uniquement — AUROS n’applique pas branding ni IdP sans revue humaine.
      </GreenDisclaimer>
      <GreenBackLink href={GREEN_PORTFOLIO_ROUTE}>← Portfolio</GreenBackLink>
      <div className="mt-2">
        <GreenBackLink href={GREEN_ROUTE}>← Hub Green</GreenBackLink>
      </div>
    </div>
  );
}
