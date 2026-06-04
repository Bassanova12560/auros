import Link from "next/link";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { GREEN_BLOG_ARTICLES, greenBlogArticlePath } from "@/lib/green/blog/articles";
import { GREEN_BLOG_ROUTE, GREEN_ROUTE } from "@/lib/green/constants";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata = metadataFromPath(GREEN_BLOG_ROUTE);

export default function GreenBlogIndexPage() {
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_BLOG_ROUTE} />
      <ContentPageLayout
        eyebrow="AUROS Green · Blog"
        title="Articles & guides"
        intro="Contenus éducatifs sur RTMS, marketplace, label Verified et traçabilité énergétique — ton professionnel, statuts honnêtes."
      >
        <ul className="space-y-6">
          {GREEN_BLOG_ARTICLES.map((article) => (
            <li key={article.slug}>
              <article className="card-flat interactive-subtle px-5 py-6 md:px-8">
                <p className="font-mono text-[10px] tracking-wide text-white/35">
                  {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {" · "}
                  {article.readingTimeMinutes} min
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold text-white">
                  <Link
                    href={greenBlogArticlePath(article.slug)}
                    className="transition hover:text-green-royal-bright"
                  >
                    {article.title.replace(" | AUROS Green", "")}
                  </Link>
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50">
                  {article.excerpt}
                </p>
                <p className="mt-4">
                  <Link
                    href={greenBlogArticlePath(article.slug)}
                    className="font-mono text-[11px] tracking-wide text-white/50 transition hover:text-white/80"
                  >
                    Lire l&apos;article →
                  </Link>
                </p>
              </article>
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link
            href={GREEN_ROUTE}
            className="font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white/70"
          >
            ← Retour hub Green
          </Link>
        </p>
      </ContentPageLayout>
    </>
  );
}
