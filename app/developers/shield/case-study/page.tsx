import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

export const metadata: Metadata = {
  title: "Case study — Flotte EV → CFU → Shield → banque | AUROS",
  description:
    "Parcours concret : sessions de charge, CFU ChargeFlow, Proof Tap Shield, Evidence Pack pour le dossier crédit.",
};

export default function ShieldCaseStudyPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/developers/shield/case-study" />
      <FocusPageShell path="/developers/shield/case-study" width="3xl">
        <ContentPageLayout
          eyebrow="Case study · 1 page"
          title="Flotte EV → CFU → Shield → banque"
          intro="Une flotte électrifie ses dépôts. La banque veut une preuve continue — pas un ZIP de CSV."
        >
          <div className="space-y-8 text-sm leading-relaxed text-white/65">
            <section className="space-y-2">
              <h2 className="font-display text-lg text-white">1. Opérateur</h2>
              <p>
                Mint CFU-E via ChargeFlow (sessions kWh). Option{" "}
                <code className="text-white/80">generation_source</code> si mix /
                nucléaire (surface{" "}
                <Link href="/power" className="underline">
                  /power
                </Link>
                ).
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="font-display text-lg text-white">2. Export + tap</h2>
              <p>
                <code className="text-white/80">
                  GET /api/v1/chargeflow/export?shield=1
                </code>{" "}
                — portfolio + preuve Shield (payload jeté). Ou bouton Shield dans
                la console CFU.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="font-display text-lg text-white">3. Banque</h2>
              <p>
                Premium Evidence Pack → annexé au dossier crédit/ESG. Re-verify
                public. Diff pack_hash chaque trimestre. Reseal PQC planifié.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="font-display text-lg text-white">Résultat</h2>
              <p>
                Preuve contrepartie sans data room. Intégration côté flotte : une
                ligne middleware ou un query param.
              </p>
            </section>
            <div className="flex flex-wrap gap-3 pt-2">
              <PrimaryButton href="/developers/shield/banks">
                Pack banques
              </PrimaryButton>
              <PrimaryButton href="/green/chargeflow/console">
                Console CFU
              </PrimaryButton>
              <PrimaryButton href="/developers/shield/agents">
                Snippets agents
              </PrimaryButton>
            </div>
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
