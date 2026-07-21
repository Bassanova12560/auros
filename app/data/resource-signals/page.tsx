import type { Metadata } from "next";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  RESOURCE_SIGNALS,
  RESOURCE_SIGNALS_AS_OF,
  RESOURCE_SIGNALS_DISCLAIMER,
  RESOURCE_SIGNALS_ROUTE,
} from "@/lib/resilience/resource-signals";

export const metadata: Metadata = {
  title: "Signaux ressources · spot & minerais | AUROS",
  description:
    "Bandes indicatives électricité EU, lithium, cobalt, stress hydrique — pas un feed de trading.",
};

export default function ResourceSignalsPage() {
  return (
    <FocusPageShell path={RESOURCE_SIGNALS_ROUTE} width="3xl">
      <ContentPageLayout
        product="Data · Resilience"
        eyebrow={`Snapshot ${RESOURCE_SIGNALS_AS_OF}`}
        title="Signaux ressources"
        intro="Ordres de grandeur pour stress-tester playbooks et capacity — pas des prix exécutables."
        cta={{
          href: "/api/green/eau/resource-signals",
          label: "GET JSON API",
        }}
      >
        <ul className="space-y-6">
          {RESOURCE_SIGNALS.map((s) => (
            <li key={s.id} className="border-t border-white/[0.08] pt-5">
              <h2 className="font-display text-lg text-white">{s.label}</h2>
              <p className="mt-2 font-mono text-sm text-emerald-300/90">
                {s.band} {s.unit}
              </p>
              <p className="mt-2 text-sm text-white/55">{s.note}</p>
              <p className="mt-2 text-xs text-white/40">{s.relevance}</p>
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
        <p className="mt-10 text-xs text-white/35">{RESOURCE_SIGNALS_DISCLAIMER}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <PrimaryButton href="/resilience">Hub résilience</PrimaryButton>
          <PrimaryButton href="/eau/suppliers" variant="ghost">
            Supplier screen
          </PrimaryButton>
          <PrimaryButton href="/eau/continuity" variant="ghost">
            Playbook
          </PrimaryButton>
        </div>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
