import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { WELHR_WELCOME_PATH } from "@/lib/vertical-welcome/config";

import { WelhrRiskConsole } from "../_components/WelhrRiskConsole";

export const metadata: Metadata = {
  title: "Score WELHR | AUROS Eau",
  description: "Lancer un score Water/Energy Legal & Hydrological Risk.",
  robots: { index: false, follow: false },
};

export default function EauWelhrScorePage() {
  return (
    <FocusPageShell path="/eau/risk/score" width="3xl">
      <ContentPageLayout
        product="Eau"
        eyebrow="WELHR · Outil"
        title="Score legal & hydrologique"
        intro="Région + contexte texte — indicatif ; counsel requis."
      >
        <WelhrRiskConsole />

        <section className="mt-12 space-y-3">
          <h2 className="font-display text-lg text-white">API</h2>
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black px-4 py-3 font-mono text-[11px] text-white/65">
            {`POST /api/green/eau/legal-risk
{ "text": "…", "region": "Michigan", "asset_hint": "data_center" }`}
          </pre>
          <div className="flex flex-wrap gap-3 pt-2">
            <PrimaryButton href={WELHR_WELCOME_PATH} variant="ghost">
              Accueil WELHR
            </PrimaryButton>
            <PrimaryButton href="/eau">Hub Eau</PrimaryButton>
            <Link
              href="/verify"
              className="inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
            >
              Verify →
            </Link>
          </div>
        </section>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
