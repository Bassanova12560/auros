import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { listPublishedTrustPacks } from "@/lib/trust-packs/store";
import {
  TRUST_PACK_DISCLAIMER,
  TRUST_PACK_IDS,
  TRUST_PACK_META,
  TRUST_PACKS_ROUTE,
} from "@/lib/trust-packs/taxonomy";

import { PackGradeBadge, TrustPacksNav } from "./_components/PackUi";

export const metadata: Metadata = {
  title: "Asset Trust Packs | AUROS",
  description:
    "Écrans d’admission RWA multi-verticaux — eau/watts, capacity rights, immo, luxe, véhicules, bateaux, sport. Preuves sourcées.",
};

export const dynamic = "force-dynamic";

export default async function TrustPacksCatalogPage() {
  const { rows, error } = await listPublishedTrustPacks();

  return (
    <FocusPageShell path={TRUST_PACKS_ROUTE} width="3xl">
      <ContentPageLayout
        product="Trust"
        eyebrow="Asset Trust Packs"
        title="Admission multi-vertical"
        intro="Même rails que WETS / PQC : questions factuelles + preuves. Scarcity (eau, watts, capacity) et lifestyle (immo, luxe, auto, yacht, sport) — pas une marketplace."
        cta={{ href: `${TRUST_PACKS_ROUTE}/new`, label: "Nouvel assessment" }}
      >
        <TrustPacksNav />

        <section className="space-y-4">
          <h2 className="font-display text-lg text-white">Catalogue</h2>
          <ul className="space-y-4">
            {TRUST_PACK_IDS.map((id) => {
              const m = TRUST_PACK_META[id];
              return (
                <li
                  key={id}
                  className="border-t border-white/[0.08] pt-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-base text-white">
                      {m.label}
                    </h3>
                    <span className="font-mono text-[10px] uppercase text-white/35">
                      {m.family}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/55">{m.short}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Link
                      href={`${TRUST_PACKS_ROUTE}/new?pack=${id}`}
                      className="font-mono text-[11px] text-sky-300/80 hover:underline"
                    >
                      Scorer →
                    </Link>
                    {m.deepHref ? (
                      <Link
                        href={m.deepHref}
                        className="font-mono text-[11px] text-white/45 hover:underline"
                      >
                        {m.deepLabel} →
                      </Link>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-12 space-y-3">
          <h2 className="font-display text-lg text-white">
            Rapports publiés
          </h2>
          {error ? (
            <p className="text-sm text-amber-300/90">{error}</p>
          ) : null}
          {rows.length === 0 ? (
            <p className="text-sm text-white/45">Aucun rapport publié.</p>
          ) : (
            <ul className="space-y-3">
              {rows.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`${TRUST_PACKS_ROUTE}/report/${r.public_slug ?? r.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] py-4 hover:border-white/20"
                  >
                    <div>
                      <p className="font-display text-lg text-white">
                        {r.name}
                        {r.is_demo ? (
                          <span className="ml-2 font-mono text-[10px] uppercase text-amber-400/80">
                            demo
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase text-white/35">
                        {TRUST_PACK_META[r.pack_id].label}
                        {r.jurisdiction ? ` · ${r.jurisdiction}` : ""}
                      </p>
                    </div>
                    <PackGradeBadge grade={r.grade} score={r.final_score} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-10">
          <PrimaryButton href="/rwa-gates" variant="ghost">
            5 portes RWA
          </PrimaryButton>
        </div>
        <p className="mt-8 text-xs text-white/35">{TRUST_PACK_DISCLAIMER}</p>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
