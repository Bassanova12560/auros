import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  buildCompareWizardHref,
  parseCompareProductIdsParam,
} from "@/lib/comparators";
import { metadataFromPath } from "@/lib/seo/metadata";

export const START_ROUTE = "/start";

export const metadata: Metadata = {
  ...metadataFromPath(START_ROUTE),
  title: "Commencer en 4 min | AUROS",
  description:
    "Une première victoire : parcours express dossier, score instantané, ou essai Shield sans compte.",
};

type PageProps = {
  searchParams: Promise<{ compare?: string }>;
};

export default async function StartPage({ searchParams }: PageProps) {
  const { compare } = await searchParams;
  const ids = parseCompareProductIdsParam(compare);
  const wizardHref = buildCompareWizardHref(ids);
  const hasShortlist = ids.length >= 2;

  return (
    <>
      <AiFirstPageJsonLd path={START_ROUTE} />
      <FocusPageShell path={START_ROUTE} width="3xl">
        <ContentPageLayout
          product="Démarrer"
          eyebrow="Première victoire"
          title="Choisissez une porte — 4 minutes"
          intro="Pas de parcours infini. Une action, un résultat. Vous pourrez approfondir ensuite."
        >
          {hasShortlist ? (
            <p className="mb-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-[11px] leading-relaxed text-white/55">
              Shortlist compare ({ids.length}) conservée pour le parcours
              dossier — données indicatives, sans promesse de rendement.
            </p>
          ) : null}

          <div className="space-y-4">
            <section className="rounded-xl border border-[color-mix(in_srgb,var(--auros-green-warm)_45%,transparent)] bg-[color-mix(in_srgb,var(--auros-green-warm)_10%,transparent)] px-5 py-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[color-mix(in_srgb,var(--auros-green-warm)_80%,white)]">
                Recommandé · non-pro
              </p>
              <h2 className="mt-2 font-display text-lg text-white">
                Parcours express dossier
              </h2>
              <p className="mt-2 text-sm text-white/55">
                8 écrans · réponses indicatives · sauvegarde auto · ~4 min
              </p>
              <div className="mt-4">
                <PrimaryButton href={wizardHref}>
                  Lancer l’express
                </PrimaryButton>
              </div>
            </section>

            <section className="rounded-xl border border-white/10 px-5 py-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Encore plus court
              </p>
              <h2 className="mt-2 font-display text-lg text-white">
                Score en une phrase
              </h2>
              <p className="mt-2 text-sm text-white/55">
                Résultat immédiat — sans compte. Puis dossier si ça matche.
              </p>
              <div className="mt-4">
                <Link
                  href="/estimate"
                  className="text-sm text-white underline-offset-2 hover:underline"
                >
                  Estimer mon actif →
                </Link>
              </div>
            </section>

            <section className="rounded-xl border border-white/10 px-5 py-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Pro · banque / flotte / API
              </p>
              <h2 className="mt-2 font-display text-lg text-white">
                Essayer Shield sans compte
              </h2>
              <p className="mt-2 text-sm text-white/55">
                Collez un export → preuve hash-only. Contrepartie vérifie sans
                data room.
              </p>
              <div className="mt-4">
                <Link
                  href="/developers/shield#essayer"
                  className="text-sm text-white underline-offset-2 hover:underline"
                >
                  Essayer Shield →
                </Link>
              </div>
            </section>
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
