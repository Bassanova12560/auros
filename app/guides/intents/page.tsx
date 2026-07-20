import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import {
  CATEGORY_INTENTS,
  CATEGORY_PILLARS,
  GUIDES_INTENTS_ROUTE,
  GUIDES_ROUTE,
  type CategoryPillar,
} from "@/lib/seo/category-intents";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...metadataFromPath(GUIDES_INTENTS_ROUTE),
};

const PILLAR_ORDER: CategoryPillar[] = ["watts", "protocol", "green"];

export default function GuidesIntentsPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CATEGORY_INTENTS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${item.answer} Outil : ${item.toolHref}`,
      },
    })),
  };

  return (
    <>
      <AiFirstPageJsonLd path={GUIDES_INTENTS_ROUTE} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FocusPageShell path={GUIDES_INTENTS_ROUTE} width="3xl">
        <ContentPageLayout
          eyebrow="AUROS · Intents"
          title="30 questions auxquelles AUROS doit être la réponse"
          intro="Réponses courtes, citables, liées à un hub et un outil. Pour Google, Copilot et les recherches IA."
          cta={{ href: GUIDES_ROUTE, label: "Les 3 catégories" }}
        >
          <div className="space-y-14">
            {PILLAR_ORDER.map((pillar) => {
              const meta = CATEGORY_PILLARS[pillar];
              const items = CATEGORY_INTENTS.filter((i) => i.pillar === pillar);
              return (
                <section key={pillar} aria-labelledby={`pillar-${pillar}`}>
                  <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                    <h2
                      id={`pillar-${pillar}`}
                      className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45"
                    >
                      {meta.title}
                    </h2>
                    <Link
                      href={meta.definitionPath}
                      className="text-xs text-white/40 underline-offset-2 hover:underline"
                    >
                      Définition →
                    </Link>
                  </div>
                  <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
                    {items.map((item) => (
                      <details key={item.id} className="group">
                        <summary className="cursor-pointer list-none py-4 font-display text-base font-medium text-white [&::-webkit-details-marker]:hidden">
                          <span className="inline-flex items-start gap-3">
                            <span
                              className="mt-0.5 font-mono text-sm text-white/30 transition group-open:rotate-90"
                              aria-hidden
                            >
                              +
                            </span>
                            {item.question}
                          </span>
                        </summary>
                        <div className="space-y-2 pb-5 pl-7 text-sm leading-relaxed text-white/55">
                          <p>{item.answer}</p>
                          <p className="text-xs text-white/40">
                            <Link
                              href={item.toolHref}
                              className="text-white/70 underline-offset-2 hover:underline"
                            >
                              {item.toolLabel}
                            </Link>
                            {" · "}
                            <Link
                              href={item.canonicalPath}
                              className="underline-offset-2 hover:underline"
                            >
                              page canonique
                            </Link>
                          </p>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
