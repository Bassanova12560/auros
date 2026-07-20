import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { RWA_GATES, RWA_GATES_ROUTE } from "@/lib/rwa-gates";

export const metadata: Metadata = {
  title: "5 portes RWA | AUROS",
  description:
    "Les preuves qu’un RWA sérieux doit passer pour se démarquer des marketplaces — sceau, pack banque, twin, impact, verify embarqué.",
};

export default function RwaGatesPage() {
  return (
    <FocusPageShell path={RWA_GATES_ROUTE} width="3xl">
      <ContentPageLayout
        product="Protocol"
        eyebrow="Différenciation RWA"
        title="Cinq portes que les plateformes listing n’ouvrent pas"
        intro="AUROS n’est pas une marketplace de tokens. Ce sont les preuves que banques et plateformes peuvent exiger — hash-only, continues, embarquables — pour qu’un RWA se démarque."
        cta={{ href: "/verify", label: "Vérifier une preuve" }}
      >
        <ol className="mt-2 space-y-8">
          {RWA_GATES.map((gate) => (
            <li
              key={gate.id}
              id={gate.id}
              className="border-t border-white/[0.08] pt-8 first:border-t-0 first:pt-0"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                Porte {gate.step} · {gate.id}
              </p>
              <h2 className="mt-2 font-display text-xl text-white md:text-2xl">
                {gate.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                <span className="text-white/40">Contrepartie obtient — </span>
                {gate.counterpartyGets}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/45">
                <span className="text-white/35">Écart marché — </span>
                {gate.whyCompetitorsMiss}
              </p>
              {gate.apiHint ? (
                <p className="mt-3 font-mono text-[11px] text-white/30">
                  {gate.apiHint}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3">
                <PrimaryButton href={gate.primaryHref}>
                  {gate.primaryLabel}
                </PrimaryButton>
                {gate.secondaryHref && gate.secondaryLabel ? (
                  <Link
                    href={gate.secondaryHref}
                    className="inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
                  >
                    {gate.secondaryLabel} →
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ol>

        <section className="mt-14 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-5">
          <h2 className="font-display text-lg text-white">
            Pour plateformes & risk desks
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
            Exigez ces portes à l’admission. L’émetteur apporte les preuves ; vous
            vérifiez en seconds — sans custody AUROS.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <PrimaryButton href="/platforms">Hub plateformes</PrimaryButton>
            <PrimaryButton href="/developers/institutions" variant="ghost">
              Console institutions
            </PrimaryButton>
            <Link
              href="/trust"
              className="inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
            >
              Trust →
            </Link>
          </div>
        </section>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
