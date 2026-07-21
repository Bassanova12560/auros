import type { Metadata } from "next";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  DC_100MW_ASSUMPTIONS,
  DC_100MW_AUROS_STEPS,
  DC_100MW_DEMO_ROUTE,
  DC_100MW_DISCLAIMER,
  DC_100MW_METRICS,
  DC_100MW_PROFILE,
} from "@/lib/resilience/dc-100mw-demo";
import { COMPASS_WELCOME_ROUTE } from "@/lib/resilience/compass";
import { CONTINUITY_WELCOME_ROUTE } from "@/lib/wets/continuity-playbook";

export const metadata: Metadata = {
  title: "Data center 100 MW · étude de cas | AUROS",
  description:
    "Démo marketing fictive — économies d’eau et coûts indicatifs, WELHR/WETS, playbook continuité. Pas un audit.",
  keywords: ["data center water", "RWA eau", "100 MW", "refroidissement", "AUROS"],
};

export default function DataCenter100MwDemoPage() {
  return (
    <FocusPageShell path={DC_100MW_DEMO_ROUTE} width="3xl">
      <ContentPageLayout
        product="Resilience · Démo"
        eyebrow="Étude de cas fictive"
        title={DC_100MW_PROFILE.name}
        intro={`${DC_100MW_PROFILE.region} · COD ${DC_100MW_PROFILE.cod}. ${DC_100MW_PROFILE.cooling_baseline} → ${DC_100MW_PROFILE.cooling_target}.`}
        cta={{ href: CONTINUITY_WELCOME_ROUTE, label: "Playbook continuité" }}
      >
        <section aria-label="Métriques avant/après" className="space-y-4">
          {DC_100MW_METRICS.map((m) => (
            <div key={m.label} className="border-t border-white/[0.08] pt-5 first:border-t-0">
              <h2 className="font-display text-lg text-white">{m.label}</h2>
              <div className="mt-3 flex flex-wrap gap-6 font-mono text-sm">
                <p>
                  <span className="text-white/35">Avant </span>
                  <span className="text-white/75">{m.before}</span>
                </p>
                <p>
                  <span className="text-white/35">Après </span>
                  <span className="text-emerald-300/90">{m.after}</span>
                </p>
              </div>
              {m.note ? <p className="mt-2 text-xs text-white/45">{m.note}</p> : null}
            </div>
          ))}
        </section>

        <section className="mt-12">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            Parcours AUROS
          </p>
          <ol className="mt-4 space-y-4">
            {DC_100MW_AUROS_STEPS.map((s) => (
              <li key={s.step} className="flex gap-4">
                <span className="font-mono text-sm text-cyan-300/60">{s.step}</span>
                <div>
                  <h3 className="font-display text-base text-white">{s.title}</h3>
                  <p className="mt-1 text-sm text-white/55">{s.body}</p>
                  <PrimaryButton href={s.href} variant="ghost">
                    En savoir plus →
                  </PrimaryButton>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-6">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            Hypothèses
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-xs text-white/45">
            {DC_100MW_ASSUMPTIONS.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <PrimaryButton href={COMPASS_WELCOME_ROUTE}>Auros Compass</PrimaryButton>
          <PrimaryButton href="/h2o-rwa" variant="ghost">
            H₂O RWA
          </PrimaryButton>
          <PrimaryButton href="/eau/trust" variant="ghost">
            WETS
          </PrimaryButton>
        </div>

        <p className="mt-10 text-xs leading-relaxed text-white/35">{DC_100MW_DISCLAIMER}</p>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
