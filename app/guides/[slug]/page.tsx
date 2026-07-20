import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ContentFaqList,
  ContentPageLayout,
} from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import {
  getAllCategoryGuideSlugs,
  getCategoryGuide,
} from "@/lib/seo/category-guides";
import { GUIDES_INTENTS_ROUTE, GUIDES_ROUTE } from "@/lib/seo/category-intents";
import { metadataFromPath } from "@/lib/seo/metadata";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllCategoryGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getCategoryGuide(slug);
  if (!guide) return { title: "Guide | AUROS" };
  return metadataFromPath(guide.path);
}

export default async function CategoryGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getCategoryGuide(slug);
  if (!guide) notFound();

  return (
    <>
      <AiFirstPageJsonLd path={guide.path} />
      <FocusPageShell path={guide.path} width="3xl">
        <ContentPageLayout
          eyebrow="AUROS · Définition de catégorie"
          title={guide.title.replace(/\s*\|\s*.*$/, "")}
          intro={guide.intro}
          cta={guide.cta}
        >
          <div className="space-y-10">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-lg font-medium text-white">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p) => (
                  <p
                    key={p.slice(0, 48)}
                    className="mt-3 text-sm leading-relaxed text-white/55"
                  >
                    {p}
                  </p>
                ))}
              </section>
            ))}

            <section>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                FAQ
              </h2>
              <div className="mt-4">
                <ContentFaqList items={guide.faq} />
              </div>
            </section>

            <p className="text-xs text-white/35">
              <Link
                href={GUIDES_ROUTE}
                className="underline-offset-2 hover:underline"
              >
                ← Guides
              </Link>
              {" · "}
              <Link
                href={GUIDES_INTENTS_ROUTE}
                className="underline-offset-2 hover:underline"
              >
                intents
              </Link>
            </p>
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
