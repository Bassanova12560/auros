import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { questionsForPack } from "@/lib/trust-packs/definitions";
import {
  TRUST_CAPACITY_ROUTE,
  TRUST_PACKS_ROUTE,
} from "@/lib/trust-packs/taxonomy";

import { TrustPacksNav } from "../packs/_components/PackUi";

export const metadata: Metadata = {
  title: "Capacity Rights | AUROS",
  description:
    "Droits de capacité RWA — MW, file d’interconnexion, cooling, allocations. L’objet qu’on ne soupçonne pas, au cœur eau+watts.",
};

export default function CapacityRightsHubPage() {
  const qs = questionsForPack("capacity_rights");

  return (
    <FocusPageShell path={TRUST_CAPACITY_ROUTE} width="3xl">
      <ContentPageLayout
        product="Trust · Scarcity"
        eyebrow="Futur non soupçonné"
        title="Capacity rights"
        intro="Pas seulement un token immo. Des droits de MW, de froid, de file réseau, d’allocation — ce que les data centers et utilities achètent vraiment. AUROS score la crédibilité du droit, pas le pitch."
        cta={{
          href: `${TRUST_PACKS_ROUTE}/new?pack=capacity_rights`,
          label: "Scorer un capacity pack",
        }}
      >
        <TrustPacksNav />

        <section className="space-y-3 text-sm leading-relaxed text-white/55">
          <p>
            Eau et watts convergent ici : sans COD crédible et sans instrument
            opposable, la « capacité papier » est le nouveau greenwashing
            énergétique.
          </p>
          <p>
            Le pack Capacity Rights reprend la même discipline que WETS
            (preuves sourcées) et se branche sur Shield / verify pour
            l’admission plateforme.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg text-white">6 questions</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-white/65">
            {qs.map((q) => (
              <li key={q.id}>{q.q}</li>
            ))}
          </ol>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <PrimaryButton href="/eau/trust">WETS eau/énergie</PrimaryButton>
          <PrimaryButton href="/power" variant="ghost">
            Hub Power
          </PrimaryButton>
          <PrimaryButton href="/trust/quantum" variant="ghost">
            Quantum index
          </PrimaryButton>
          <Link
            href={TRUST_PACKS_ROUTE}
            className="inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
          >
            Tous les packs →
          </Link>
        </div>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
