import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";

import { PortfolioWatchlistForm } from "@/app/green/_components/PortfolioWatchlistForm";
import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
  GreenSectionTitle,
} from "@/app/green/_components/green-ui";
import {
  GREEN_PORTFOLIO_ROUTE,
  GREEN_PORTFOLIO_SSO_ROUTE,
  GREEN_ROUTE,
} from "@/lib/green";
import { GREEN_API_DOCS_ROUTE } from "@/lib/green/api";
import { DNA_PREMIUM_PORTFOLIO_LIMIT } from "@/lib/green/dna-read-auth";
import {
  isInstitutionalEmailDomain,
  isInstitutionalOrgId,
  sessionTierBoost,
} from "@/lib/green/institutional-access";
import { getGreenPortfolioSnapshot } from "@/lib/green/portfolio-snapshot";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Desk institutionnel | AUROS Portfolio",
  robots: { index: false, follow: false },
};

export default async function GreenPortfolioDeskPage() {
  const session = await auth();
  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    null;
  const boost = sessionTierBoost({
    userId: session.userId,
    orgId: session.orgId,
    email,
  });
  const institutional =
    isInstitutionalOrgId(session.orgId) ||
    (email ? isInstitutionalEmailDomain(email) : false);

  const limit =
    boost === "enterprise" || boost === "premium"
      ? DNA_PREMIUM_PORTFOLIO_LIMIT
      : 50;
  const snapshot = await getGreenPortfolioSnapshot(limit);

  return (
    <div className="page-inner page-inner--6xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <GreenPageHeader
        eyebrow="Institutional desk"
        title="Espace connecté Portfolio"
        intro="Session Clerk — volumes DNA élargis, watchlist, pont SSO / on-prem. Indicatif, pas un portefeuille réglementé."
        compact
      />

      <GreenPanel className="mt-8">
        <div className="p-5 md:p-6">
          <GreenSectionTitle>Session</GreenSectionTitle>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                E-mail
              </dt>
              <dd className="mt-1 text-white/80">{email ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Accès volume
              </dt>
              <dd className="mt-1 font-mono text-[12px] text-emerald-300/90">
                {boost ?? "anonymous"}
                {institutional ? " · allowlist" : ""}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Asset DNA chargés
              </dt>
              <dd className="mt-1 tabular-nums text-white/80">
                {snapshot.totalDna} (limit {limit})
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Alertes
              </dt>
              <dd className="mt-1 tabular-nums text-white/80">
                {snapshot.alertCount}
              </dd>
            </div>
          </dl>
        </div>
      </GreenPanel>

      <GreenPanel className="mt-4">
        <PortfolioWatchlistForm
          assets={snapshot.assets.map((a) => ({
            assetDnaId: a.assetDnaId,
            displayName: a.displayName,
            country: a.country,
          }))}
          defaultEmail={email ?? undefined}
        />
      </GreenPanel>

      <GreenPanel className="mt-4">
        <div className="p-5 md:p-6">
          <GreenSectionTitle>SSO · on-prem</GreenSectionTitle>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
            SSO SAML/OIDC via Clerk Enterprise (IdP client). Domaines ou org IDs
            allowlistés montent au tier enterprise. Preuves hash-only on-prem :
            AUROS Shield — les clés restent chez vous.
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            <a
              href="mailto:hello@getauros.com?subject=AUROS%20SSO%20Enterprise"
              className="font-mono text-[11px] uppercase tracking-wider text-emerald-400/90 hover:text-emerald-300"
            >
              Demander SSO →
            </a>
            <Link
              href={GREEN_PORTFOLIO_SSO_ROUTE}
              className="font-mono text-[11px] uppercase tracking-wider text-emerald-400/90 hover:text-emerald-300"
            >
              Runbook SAML →
            </Link>
            <Link
              href="/green/portfolio/branding"
              className="font-mono text-[11px] uppercase tracking-wider text-emerald-400/90 hover:text-emerald-300"
            >
              Branding / IdP →
            </Link>
            <a
              href="/api/v1/green/portfolio/airgap?download=1"
              className="font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
            >
              Export air-gap →
            </a>
            <Link
              href="/developers/shield"
              className="font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
            >
              AUROS Shield →
            </Link>
            <Link
              href={GREEN_API_DOCS_ROUTE}
              className="font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
            >
              Green API Enterprise →
            </Link>
            <Link
              href="/embed/portfolio?partner=demo"
              className="font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
              target="_blank"
              rel="noopener noreferrer"
            >
              Widget embed →
            </Link>
          </div>
        </div>
      </GreenPanel>

      <GreenDisclaimer>
        Desk v0 — pas un conseil d’investissement. SSO contractuel et on-prem
        air-gap sur devis.
      </GreenDisclaimer>
      <GreenBackLink href={GREEN_PORTFOLIO_ROUTE}>
        ← Portfolio public
      </GreenBackLink>
      <div className="mt-2">
        <GreenBackLink href={GREEN_ROUTE}>← Hub Green</GreenBackLink>
      </div>
    </div>
  );
}
