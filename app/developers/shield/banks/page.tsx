import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { metadataFromPath } from "@/lib/seo/metadata";
import { SHIELD_SLA } from "@/lib/shield";

export const SHIELD_BANKS_ROUTE = "/developers/shield/banks";

export const metadata: Metadata = {
  ...metadataFromPath(SHIELD_BANKS_ROUTE),
  title: "Evidence Pack banque | AUROS Shield",
  description:
    "Joindre un Evidence Pack hash-only au dossier crédit / ESG — sans data room. Pack exemple + bank actions.",
};

export default function ShieldBanksPage() {
  return (
    <>
      <AiFirstPageJsonLd path={SHIELD_BANKS_ROUTE} />
      <FocusPageShell path={SHIELD_BANKS_ROUTE} width="3xl">
        <ContentPageLayout
          eyebrow="AUROS Shield · Banques"
          title="Joindre la preuve au dossier — pas la data room"
          intro="Quand chaque contrepartie a des RWA, risk/credit veulent un livrable scellé, vérifiable, sans ouvrir les fichiers bruts. C’est l’Evidence Pack."
          cta={{
            href: "/examples/shield-evidence-pack.example.json",
            label: "Télécharger le pack exemple",
          }}
        >
          <div className="space-y-10">
            <section className="space-y-3">
              <h2 className="font-display text-lg text-white">En 3 gestes</h2>
              <ol className="list-decimal space-y-2 pl-5 text-sm text-white/65">
                <li>L’émetteur exporte CFU (+ option <code>?shield=1</code>).</li>
                <li>
                  Premium : <code>POST /api/v1/shield/pack</code> → dossier hash-only.
                </li>
                <li>
                  La banque re-vérifie via{" "}
                  <code>POST /api/v1/shield/verify</code> — sans payload.
                </li>
              </ol>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg text-white">Bank actions</h2>
              <ul className="space-y-2 text-sm text-white/65">
                <li>Attacher le pack au dossier crédit / ESG</li>
                <li>Diff pack_hash entre éditions (monitoring continu)</li>
                <li>
                  Lire <code>generation_source</code> (nucléaire →{" "}
                  <Link href="/power" className="text-white/85 underline">
                    /power
                  </Link>
                  , hors Green Verified)
                </li>
                <li>Planifier reseal hybrid_pqc_ready (rétention 7–30 ans)</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg text-white">SLA indicatif</h2>
              <p className="text-sm text-white/55">
                Disponibilité verify {SHIELD_SLA.verify_availability_target} ·
                latence p99 cible {SHIELD_SLA.verify_latency_p99_ms_target} ms ·{" "}
                {SHIELD_SLA.note}
              </p>
            </section>

            <div className="flex flex-wrap gap-3">
              <PrimaryButton href="/developers/shield/banks/sample">
                Voir le modèle imprimable
              </PrimaryButton>
              <PrimaryButton href="/developers/shield">
                Essayer Shield
              </PrimaryButton>
              <PrimaryButton href="/developers/shield/case-study">
                Case study flotte → banque
              </PrimaryButton>
            </div>
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
