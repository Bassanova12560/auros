import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { metadataFromPath } from "@/lib/seo/metadata";
import { SHIELD_SLA } from "@/lib/shield";

import { InstitutionChecklistPanel } from "../shield/_components/InstitutionChecklistPanel";
import { ShieldAuditTrailPanel } from "../shield/_components/ShieldAuditTrailPanel";
import { ShieldEvidencePackPanel } from "../shield/_components/ShieldEvidencePackPanel";
import { ShieldVerifyResealPanel } from "../shield/_components/ShieldVerifyResealPanel";

export const INSTITUTIONS_ROUTE = "/developers/institutions";

export const metadata: Metadata = {
  ...metadataFromPath(INSTITUTIONS_ROUTE),
  title: "Console institutions | AUROS Protocol",
  description:
    "Evidence Pack, verify/reseal, checklist MiCA et trail continu pour banques et équipes risque — preuves hash-only, sans data room.",
};

const SECONDARY = [
  {
    href: "/api/v1/chargeflow/export",
    title: "Export CFU",
    detail: "JSON/CSV audit pack (Premium)",
  },
  {
    href: "/developers/docs/endpoint-monitor",
    title: "Monitor + webhooks",
    detail: "Alertes score / dossier — feed institutionnel",
  },
  {
    href: "/power",
    title: "Low-carbon Power",
    detail: "Nucléaire & bas-carbone — hors Green Verified",
  },
  {
    href: "/data/licence",
    title: "Data licence",
    detail: "Indices Green / RWA pour réplication contrôlée",
  },
] as const;

export default function InstitutionsPage() {
  return (
    <>
      <AiFirstPageJsonLd path={INSTITUTIONS_ROUTE} />
      <FocusPageShell path={INSTITUTIONS_ROUTE} width="3xl">
        <ContentPageLayout
          product="Institutions"
          eyebrow="Protocol · Risk desk"
          title="Console pour banques et institutions"
          intro="Trois gestes risk-ready : joindre un Evidence Pack, vérifier / resealer une preuve, générer une checklist. SLA indicatif — pas un agrément bancaire."
          cta={{ href: "#evidence-pack", label: "Evidence Pack" }}
        >
          <div className="space-y-10">
            <p className="text-sm leading-relaxed text-white/55">
              AUROS Protocol n&apos;est pas un CASP ni un conseil
              d&apos;investissement. CFU, scores et packs sont des preuves /
              signaux indicatifs off-chain — counsel et politiques internes
              requis. Cible ops :{" "}
              <code className="text-white/70">
                {SHIELD_SLA.verify_availability_target}
              </code>{" "}
              verify · p99{" "}
              <code className="text-white/70">
                {SHIELD_SLA.verify_latency_p99_ms_target} ms
              </code>
              . {SHIELD_SLA.note}
            </p>

            <ol className="list-decimal space-y-2 pl-5 text-sm text-white/65">
              <li>Émetteur : mint CFU / Shield taps → Evidence Pack HTML.</li>
              <li>
                Banque : re-verify receipt (gratuit) — sans payload.
              </li>
              <li>
                Continu : diff <code>pack_hash</code> entre éditions + reseal
                PQC schedule.
              </li>
            </ol>

            <div id="evidence-pack" className="space-y-6">
              <ShieldEvidencePackPanel />
              <ShieldVerifyResealPanel />
              <ShieldAuditTrailPanel />
              <InstitutionChecklistPanel />
            </div>

            <section className="space-y-4">
              <h2 className="font-display text-lg text-white">Aussi utile</h2>
              <ul className="space-y-3">
                {SECONDARY.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group block border-t border-white/[0.08] pt-3"
                    >
                      <p className="font-display text-base text-white group-hover:text-white/90">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-white/45">{item.detail}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <div className="flex flex-wrap gap-3">
              <PrimaryButton href="/auros-openapi.yaml">
                OpenAPI YAML
              </PrimaryButton>
              <PrimaryButton href="/developers/shield/banks" variant="ghost">
                Pack banques
              </PrimaryButton>
              <PrimaryButton href="/status" variant="ghost">
                Status
              </PrimaryButton>
            </div>
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
