import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

export const metadata: Metadata = {
  title: "Liquidity Bridge — liste d’attente | AUROS",
  description:
    "Pont de liquidité pour RWA déjà émis — après pilotes issuer. Pas encore en production.",
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
          eyebrow="Produit futur"
          title="Liquidity Bridge — pas encore"
          intro="Les petites plateformes manquent de liquidité après émission. AUROS le fera — après des dossiers issuer prouvés, pas avant."
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
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
