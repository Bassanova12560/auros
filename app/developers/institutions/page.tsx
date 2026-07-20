import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { metadataFromPath } from "@/lib/seo/metadata";

export const INSTITUTIONS_ROUTE = "/developers/institutions";

export const metadata: Metadata = {
  ...metadataFromPath(INSTITUTIONS_ROUTE),
};

const LINKS = [
  {
    href: "/api/v1/chargeflow/export",
    title: "Export CFU",
    detail: "GET /api/v1/chargeflow/export — JSON/CSV audit pack (Premium)",
  },
  {
    href: "/developers/docs/endpoint-watts-reserve",
    title: "Watts Reserve API",
    detail: "Booking → confirm CFU → settle — OpenAPI + docs Protocol",
  },
  {
    href: "/developers/docs/endpoint-chargeflow",
    title: "ChargeFlow CFU",
    detail: "Unités vérifiables E/W/F + verify public",
  },
  {
    href: "/developers/docs/endpoint-monitor",
    title: "Monitor + webhooks",
    detail: "Alertes score / dossier — feed institutionnel",
  },
  {
    href: "/data/licence",
    title: "Data licence",
    detail: "Indices Green / RWA pour réplication contrôlée",
  },
  {
    href: "/power",
    title: "Low-carbon Power",
    detail: "Nucléaire & bas-carbone — hors Green Verified",
  },
  {
    href: "/developers/shield",
    title: "AUROS Shield",
    detail: "Collez → preuve · Evidence Pack banque · ?shield=1 sur export CFU",
  },
  {
    href: "/developers/shield/banks",
    title: "Evidence Pack banques",
    detail: "Joindre la preuve au dossier crédit/ESG — sans data room",
  },
] as const;

export default function InstitutionsPage() {
  return (
    <>
      <AiFirstPageJsonLd path={INSTITUTIONS_ROUTE} />
      <FocusPageShell path={INSTITUTIONS_ROUTE} width="3xl">
        <ContentPageLayout
          eyebrow="AUROS Protocol · Institutions"
          title="API pour banques et équipes risque"
          intro="OpenAPI, export CFU, Monitor et Watts — pour intégrer AUROS dans un process credit/ESG sans claim d'agrément bancaire."
          cta={{ href: "/developers", label: "Hub développeurs" }}
        >
          <div className="space-y-10">
            <p className="text-sm leading-relaxed text-white/55">
              AUROS Protocol n&apos;est pas un CASP ni un conseil d&apos;investissement.
              Les CFU et scores sont des preuves / signaux indicatifs off-chain —
              validation counsel et politiques internes requises.
            </p>

            <ul className="space-y-4">
              {LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group block border-t border-white/[0.08] pt-4"
                  >
                    <p className="font-display text-base text-white group-hover:text-white/90">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-white/45">{item.detail}</p>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <PrimaryButton href="/auros-openapi.yaml">
                OpenAPI YAML
              </PrimaryButton>
              <PrimaryButton href="/developers#playground" variant="ghost">
                Playground
              </PrimaryButton>
            </div>
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
