import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { metadataFromPath } from "@/lib/seo/metadata";
import { SHIELD_SLA } from "@/lib/shield";

import { ShieldAuditTrailPanel } from "../_components/ShieldAuditTrailPanel";
import { ShieldEvidencePackPanel } from "../_components/ShieldEvidencePackPanel";
import { ShieldVerifyResealPanel } from "../_components/ShieldVerifyResealPanel";

export const SHIELD_BANKS_ROUTE = "/developers/shield/banks";

export const metadata: Metadata = {
  ...metadataFromPath(SHIELD_BANKS_ROUTE),
  title: "Evidence Pack banque | AUROS Shield",
  description:
    "Joindre un Evidence Pack hash-only au dossier crédit / ESG — verify, reseal PQC, trail continu. Sans data room.",
};

export default function ShieldBanksPage() {
  return (
    <>
      <AiFirstPageJsonLd path={SHIELD_BANKS_ROUTE} />
      <FocusPageShell path={SHIELD_BANKS_ROUTE} width="3xl">
        <ContentPageLayout
          eyebrow="AUROS Shield · Banques"
          title="Joindre la preuve au dossier — pas la data room"
          intro="Risk/credit veulent un livrable scellé, vérifiable, sans ouvrir les fichiers bruts. Evidence Pack + verify + trail d’éditions."
          cta={{
            href: "#evidence-pack",
            label: "Générer un pack",
          }}
        >
          <div className="space-y-10">
            <section className="space-y-3">
              <h2 className="font-display text-lg text-white">En 3 gestes</h2>
              <ol className="list-decimal space-y-2 pl-5 text-sm text-white/65">
                <li>Mint / importez des CFU (console ChargeFlow ou API).</li>
                <li>
                  Premium : Evidence Pack HTML ci-dessous (print → PDF).
                </li>
                <li>
                  Banque :{" "}
                  <code>POST /api/v1/shield/verify</code> — sans payload. Diff
                  pack_hash entre éditions.
                </li>
              </ol>
            </section>

            <div id="evidence-pack" className="space-y-6">
              <ShieldEvidencePackPanel />
              <ShieldVerifyResealPanel />
              <ShieldAuditTrailPanel />
            </div>

            <section className="space-y-3">
              <h2 className="font-display text-lg text-white">Bank actions</h2>
              <ul className="space-y-2 text-sm text-white/65">
                <li>Attacher le pack au dossier crédit / ESG</li>
                <li>Diff pack_hash entre éditions (trail ci-dessus)</li>
                <li>
                  Lire <code>generation_source</code> (nucléaire →{" "}
                  <Link href="/power" className="text-white/85 underline">
                    /power
                  </Link>
                  , hors Green Verified)
                </li>
                <li>
                  Planifier reseal <code>hybrid_pqc_ready</code> (rétention{" "}
                  {SHIELD_SLA.receipt_retention_years_min}–30 ans)
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg text-white">SLA indicatif</h2>
              <p className="text-sm text-white/55">
                Disponibilité verify {SHIELD_SLA.verify_availability_target} ·
                latence p99 cible {SHIELD_SLA.verify_latency_p99_ms_target} ms ·{" "}
                {SHIELD_SLA.note}
              </p>
              <p className="text-sm text-white/45">
                Uptime mesuré :{" "}
                <Link href="/status" className="underline underline-offset-2">
                  /status
                </Link>
                .
              </p>
            </section>

            <div className="flex flex-wrap gap-3">
              <PrimaryButton href="/developers/institutions">
                Console institutions
              </PrimaryButton>
              <PrimaryButton
                href="/examples/shield-evidence-pack.example.json"
                variant="ghost"
              >
                Pack exemple JSON
              </PrimaryButton>
              <PrimaryButton href="/green/chargeflow/console" variant="ghost">
                Console CFU
              </PrimaryButton>
            </div>
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
