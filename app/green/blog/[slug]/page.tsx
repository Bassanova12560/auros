import Link from "next/link";
import { notFound } from "next/navigation";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import {
  getAllGreenBlogSlugs,
  getGreenBlogArticle,
  greenBlogArticlePath,
} from "@/lib/green/blog/articles";
import { GREEN_BLOG_ROUTE } from "@/lib/green/constants";
import { metadataFromPath } from "@/lib/seo/metadata";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllGreenBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getGreenBlogArticle(slug);
  if (!article) return { title: "Article | AUROS Green" };
  return metadataFromPath(greenBlogArticlePath(slug));
}

export default async function GreenBlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getGreenBlogArticle(slug);
  if (!article) notFound();

  const path = greenBlogArticlePath(slug);

  return (
    <>
      <AiFirstPageJsonLd path={path} />
      <ContentPageLayout
        eyebrow="AUROS Green · Blog"
        title={article.title.replace(" | AUROS Green", "")}
        intro={article.excerpt}
        cta={{ href: article.cta.href, label: article.cta.label }}
      >
        <p className="mb-8 font-mono text-[10px] tracking-wide text-white/35">
          Publié le{" "}
          {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" · Mis à jour "}
          {new Date(article.modifiedAt).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" · "}
          {article.readingTimeMinutes} min de lecture
        </p>
        <div className="space-y-10">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-xl font-semibold text-white/90">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-sm leading-relaxed text-white/55 md:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-10 flex flex-wrap gap-x-4 gap-y-2">
          <Link
            href={GREEN_BLOG_ROUTE}
            className="font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white/70"
          >
            ← Tous les articles
          </Link>
          <Link
            href="/green/faq"
            className="font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white/70"
          >
            FAQ Green
          </Link>
        </p>
      </ContentPageLayout>
    </>
  );
}
