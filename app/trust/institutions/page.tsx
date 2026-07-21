import type { Metadata } from "next";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  INSTITUTION_INDEX_DISCLAIMER,
  INSTITUTION_RWA_INDEX,
} from "@/lib/trust-packs/institutions";
import {
  TRUST_INSTITUTIONS_ROUTE,
  TRUST_PACKS_ROUTE,
} from "@/lib/trust-packs/taxonomy";

import { TrustPacksNav } from "../packs/_components/PackUi";

export const metadata: Metadata = {
  title: "Institutions & RWA | AUROS",
  description:
    "Snapshot indicatif — régulateurs, cadres et infrastructures qui intègrent ou préparent des rails RWA / tokenisation.",
};

const STATUS_CLASS = {
  live: "text-emerald-300/90",
  pilot: "text-sky-300/90",
  consulting: "text-amber-300/90",
  watching: "text-white/45",
} as const;

export default function InstitutionsRwaIndexPage() {
  return (
    <FocusPageShell path={TRUST_INSTITUTIONS_ROUTE} width="3xl">
      <ContentPageLayout
        product="Trust · Institutions"
        eyebrow="Index indicatif"
        title="Qui intègre les RWA"
        intro="Lois, régulateurs, CSD, hubs wealth — pas une liste officielle. Un radar pour risk desks : où les rails institutionnels bougent, et pourquoi AUROS pousse admit-on-verify."
        cta={{ href: "/developers/institutions", label: "Console institutions" }}
      >
        <TrustPacksNav />

        <ul className="space-y-5">
          {INSTITUTION_RWA_INDEX.map((e) => (
            <li key={e.id} className="border-t border-white/[0.08] pt-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-lg text-white">{e.name}</h2>
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {e.region} · {e.kind} ·{" "}
                  <span className={STATUS_CLASS[e.status]}>{e.status}</span>
                </p>
              </div>
              <p className="mt-2 text-sm text-white/70">{e.focus}</p>
              <p className="mt-2 text-sm text-white/45">{e.note}</p>
              {e.source_url ? (
                <a
                  href={e.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block font-mono text-[11px] text-sky-300/70 hover:underline"
                >
                  Source →
                </a>
              ) : null}
            </li>
          ))}
        </ul>

        <p className="mt-10 text-xs text-amber-200/70">
          {INSTITUTION_INDEX_DISCLAIMER}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <PrimaryButton href={TRUST_PACKS_ROUTE}>Trust Packs</PrimaryButton>
          <PrimaryButton href="/rwa-gates" variant="ghost">
            5 portes
          </PrimaryButton>
          <PrimaryButton href="/jurisdictions" variant="ghost">
            Juridictions
          </PrimaryButton>
        </div>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
