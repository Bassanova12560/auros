import type { Metadata } from "next";
import Link from "next/link";

import { VerticalWelcomePage } from "@/app/_components/VerticalWelcomePage";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  RESILIENCE_DISCLAIMER,
  RESILIENCE_ROUTE,
  RESILIENCE_STATS,
} from "@/lib/resilience/resilience-hub";
import { ESG_CLAIM_DISCLAIMER, ESG_CLAIM_LINKS } from "@/lib/trust-packs/esg-claims";
import { VERTICAL_WELCOMES } from "@/lib/vertical-welcome/config";

export const metadata: Metadata = {
  title: "Résilience actifs · eau & énergie | AUROS",
  description:
    "Tour de contrôle indicatif — WELHR, playbook continuité, WETS, verify. RWA face au stress hydrique et énergétique.",
  keywords: ["résilience infrastructure", "RWA eau", "data center water", "AUROS"],
};

export default function ResilienceHubPage() {
  const welcome = VERTICAL_WELCOMES[RESILIENCE_ROUTE];
  if (!welcome) return null;

  return (
    <>
      <VerticalWelcomePage config={welcome} />
      <div className="mx-auto max-w-3xl px-4 pb-20 md:px-6">
        <section className="border-t border-white/10 pt-12">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            Contexte macro (sourcé)
          </p>
          <ul className="mt-6 space-y-6">
            {RESILIENCE_STATS.map((s) => (
              <li key={s.id} className="border-t border-white/[0.08] pt-5 first:border-t-0">
                <h2 className="font-display text-lg text-white">{s.label}</h2>
                <p className="mt-2 text-sm text-white/65">{s.value}</p>
                <a
                  href={s.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block font-mono text-[11px] text-sky-300/70 hover:underline"
                >
                  {s.source_label} →
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-xs text-white/35">{RESILIENCE_DISCLAIMER}</p>
        </section>

        <section className="mt-12 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-6">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            Claims ESG / CSRD
          </p>
          <p className="mt-3 text-sm text-white/55">{ESG_CLAIM_DISCLAIMER}</p>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {ESG_CLAIM_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="font-mono text-[11px] text-white/45 hover:text-white/75"
                >
                  {l.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <PrimaryButton href="/demos/data-center-100mw">Démo 100 MW + ROI</PrimaryButton>
          <PrimaryButton href="/compass/dashboard?mode=water" variant="ghost">
            Compass
          </PrimaryButton>
        </div>
      </div>
    </>
  );
}
