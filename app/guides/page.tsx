import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  CATEGORY_PILLARS,
  GUIDES_INTENTS_ROUTE,
  GUIDES_ROUTE,
} from "@/lib/seo/category-intents";
import { CATEGORY_GUIDES } from "@/lib/seo/category-guides";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...metadataFromPath(GUIDES_ROUTE),
};

export default function GuidesHubPage() {
  return (
    <>
      <AiFirstPageJsonLd path={GUIDES_ROUTE} />
      <FocusPageShell path={GUIDES_ROUTE} width="3xl">
        <ContentPageLayout
          eyebrow="AUROS · Catégories"
          title="Trois catégories que nous définissons"
          intro="Pour être la réponse par défaut — pas un mot-clé générique. Une définition canonique, des intents citables, un outil."
          cta={{ href: GUIDES_INTENTS_ROUTE, label: "Voir les 30 intents" }}
        >
          <div className="space-y-10">
            {(Object.keys(CATEGORY_PILLARS) as Array<keyof typeof CATEGORY_PILLARS>).map(
              (key) => {
                const p = CATEGORY_PILLARS[key];
                const guide = CATEGORY_GUIDES.find((g) => g.path === p.definitionPath);
                return (
                  <section
                    key={key}
                    className="border-t border-white/[0.08] pt-6"
                  >
                    <h2 className="font-display text-xl font-medium text-white">
                      {p.title}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
                      {p.tagline}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <PrimaryButton href={p.definitionPath}>
                        {guide ? "Lire la définition" : "Définition"}
                      </PrimaryButton>
                      <PrimaryButton href={p.hub} variant="ghost">
                        Hub produit
                      </PrimaryButton>
                    </div>
                  </section>
                );
              }
            )}

            <p className="text-xs leading-relaxed text-white/35">
              Machine-readable :{" "}
              <Link href="/llms.txt" className="underline-offset-2 hover:underline">
                llms.txt
              </Link>
              {" · "}
              <Link
                href="/ai-first/index.json"
                className="underline-offset-2 hover:underline"
              >
                catalogue AI
              </Link>
              {" · "}
              <Link
                href={GUIDES_INTENTS_ROUTE}
                className="underline-offset-2 hover:underline"
              >
                30 intents
              </Link>
              .
            </p>
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
