import Link from "next/link";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
  GreenSectionTitle,
} from "@/app/green/_components/green-ui";
import { absoluteUrl } from "@/lib/comparators/site";
import {
  GREEN_PORTFOLIO_DESK_ROUTE,
  GREEN_PORTFOLIO_ROUTE,
  GREEN_ROUTE,
} from "@/lib/green";
import { embedIframeSnippet } from "@/lib/green/institutional-branding";
import {
  listSsoTenants,
  SSO_RUNBOOK_STEPS,
} from "@/lib/green/institutional-sso";

export const metadata = {
  title: "SSO SAML · tenants | AUROS",
  description:
    "Runbook SSO SAML/OIDC par tenant — Clerk Enterprise, allowlist, desk Portfolio.",
  robots: { index: true, follow: true },
};

export default function GreenPortfolioSsoPage() {
  const tenants = listSsoTenants();
  const origin = absoluteUrl("");
  const iframe = embedIframeSnippet({
    origin,
    partnerId: "demo",
    theme: "dark",
  });

  return (
    <div className="page-inner page-inner--4xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <GreenPageHeader
        eyebrow="Enterprise SSO"
        title="SAML / OIDC par tenant"
        intro="AUROS ne broute pas votre IdP — Clerk Enterprise + allowlist domaines/org. Desk connecté et pack air-gap pour salles offline."
        compact
      />

      <GreenPanel className="mt-8">
        <div className="p-5 md:p-6">
          <GreenSectionTitle>Runbook (5 étapes)</GreenSectionTitle>
          <ol className="mt-4 space-y-3">
            {SSO_RUNBOOK_STEPS.map((step, i) => (
              <li key={step.id} className="flex gap-3 text-sm text-white/75">
                <span className="font-mono text-[10px] text-emerald-400/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{step.titleFr}</span>
              </li>
            ))}
          </ol>
        </div>
      </GreenPanel>

      <GreenPanel className="mt-4">
        <div className="p-5 md:p-6">
          <GreenSectionTitle>Tenants configurés</GreenSectionTitle>
          {tenants.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-500">
              Aucun tenant dans{" "}
              <code className="text-white/60">AUROS_SSO_TENANTS</code> — contactez{" "}
              <a
                href="mailto:hello@getauros.com?subject=AUROS%20SSO%20tenant"
                className="text-emerald-400/90 hover:text-emerald-300"
              >
                hello@getauros.com
              </a>{" "}
              pour activer SAML.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {tenants.map((t) => (
                <li
                  key={t.tenantId}
                  className="border border-white/10 bg-black/40 px-3 py-2 text-sm"
                >
                  <p className="font-medium text-white/90">{t.displayName}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-white/40">
                    {t.tenantId} · {t.idpProtocol.toUpperCase()} · {t.status}
                    {t.domains.length ? ` · ${t.domains.join(", ")}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </GreenPanel>

      <GreenPanel className="mt-4">
        <div className="p-5 md:p-6">
          <GreenSectionTitle>White-label embed</GreenSectionTitle>
          <p className="mt-3 text-sm text-neutral-400">
            Branding via{" "}
            <code className="text-white/60">AUROS_INSTITUTIONAL_BRANDS</code> — demo
            partner <code className="text-white/60">demo</code>.
          </p>
          <pre className="mt-4 overflow-x-auto border border-white/10 bg-black/50 p-3 font-mono text-[11px] leading-relaxed text-emerald-200/80">
            {iframe}
          </pre>
          <div className="mt-5 flex flex-wrap gap-4">
            <Link
              href="/green/portfolio/branding"
              className="font-mono text-[11px] uppercase tracking-wider text-emerald-400/90 hover:text-emerald-300"
            >
              Branding / IdP →
            </Link>
            <Link
              href={GREEN_PORTFOLIO_DESK_ROUTE}
              className="font-mono text-[11px] uppercase tracking-wider text-emerald-400/90 hover:text-emerald-300"
            >
              Desk institutionnel →
            </Link>
            <Link
              href="/api/v1/green/portfolio/airgap?download=1"
              className="font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
            >
              Export air-gap (auth) →
            </Link>
            <Link
              href="/developers/shield"
              className="font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
            >
              Shield on-prem →
            </Link>
          </div>
        </div>
      </GreenPanel>

      <GreenDisclaimer>
        SSO contractuel — pas un conseil réglementaire. Les clés de preuve restent
        chez le client (Shield).
      </GreenDisclaimer>
      <GreenBackLink href={GREEN_PORTFOLIO_ROUTE}>← Portfolio</GreenBackLink>
      <div className="mt-2">
        <GreenBackLink href={GREEN_ROUTE}>← Hub Green</GreenBackLink>
      </div>
    </div>
  );
}
