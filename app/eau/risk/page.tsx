import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

import { WelhrRiskConsole } from "./_components/WelhrRiskConsole";

export const metadata: Metadata = {
  title: "Water Legal & Hydrological Risk | AUROS Eau",
  description:
    "Score indicatif WELHR : stress hydrique, litiges/moratoriums locaux, social license — due diligence avant tokenisation eau / data center / énergie.",
};

export default function EauWelhrRiskPage() {
  return (
    <FocusPageShell path="/eau/risk" width="3xl">
      <ContentPageLayout
        product="Eau"
        eyebrow="Due diligence · WELHR"
        title="Le filtre que les fonds vont exiger avant l’eau et les data centers"
        intro="Pas un token spéculatif. Un score de risque hydrique & legal local — stress de zone, signaux de litige / moratorium, social license — avant qu’un RWA lève des fonds. Indicatif ; counsel requis."
        cta={{ href: "#score", label: "Lancer un score" }}
      >
        <section className="space-y-3 text-sm leading-relaxed text-white/55">
          <p>
            Les autorités locales de l’eau bloquent déjà des campus IA. Plus de
            40&nbsp;% des data centers US touchent des zones à stress hydrique
            élevé. Les marketplaces RWA listent ; elles ne scorent pas cette
            bombe.
          </p>
          <p>
            WELHR v0 : bandes de stress curatées + signaux texte (moratorium,
            Clean Water Act, opposition locale, droits d’eau). La base litiges
            PACER / feeds WRI complets vient ensuite — le score et l’API sont
            prêts à greffer.
          </p>
        </section>

        <section id="score" className="mt-10">
          <WelhrRiskConsole />
        </section>

        <section className="mt-12 space-y-3">
          <h2 className="font-display text-lg text-white">API</h2>
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black px-4 py-3 font-mono text-[11px] text-white/65">
            {`POST /api/green/eau/legal-risk
{ "text": "…", "region": "Michigan", "asset_hint": "data_center" }`}
          </pre>
          <div className="flex flex-wrap gap-3 pt-2">
            <PrimaryButton href="/eau">Hub Eau</PrimaryButton>
            <PrimaryButton href="/rwa-gates" variant="ghost">
              5 portes RWA
            </PrimaryButton>
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
