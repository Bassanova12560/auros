import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

import { LiquidityWaitlistForm } from "./_components/LiquidityWaitlistForm";

export const metadata: Metadata = {
  title: "Liquidity Bridge — liste d’attente | AUROS",
  description:
    "Pont de liquidité pour RWA déjà émis — after issuer pilots. Waitlist only — no MM execution.",
};

/**
 * Honest waitlist — Liquidity Bridge is intentionally after issuer pipeline.
 */
export default function LiquidityPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/liquidity" />
      <FocusPageShell path="/liquidity" width="2xl">
        <ContentPageLayout
          product="Liquidity"
          eyebrow="Waitlist"
          title="Liquidity Bridge — après les pilotes issuer"
          intro="Les petites plateformes manquent de liquidité après émission. AUROS orchestrera un pont RFQ avec partenaires MM — pas avant des dossiers prouvés, et jamais comme broker."
        >
          <div className="space-y-6 text-sm text-white/60">
            <p>
              Ordre stratégique : (1) émetteurs dossier-ready · (2) confiance
              plateforme · (3) pont liquidité / RFQ avec partenaires MM.
            </p>
            <p>
              Aujourd’hui :{" "}
              <Link href="/wizard" className="underline">
                préparer un dossier
              </Link>{" "}
              ou{" "}
              <Link href="/partners" className="underline">
                devenir partenaire plateforme
              </Link>
              .
            </p>
            <PrimaryButton href="/pilots">Voir les pilotes 30 jours</PrimaryButton>
            <LiquidityWaitlistForm />
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
