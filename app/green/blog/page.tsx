import Link from "next/link";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { GREEN_BLOG_ARTICLES, greenBlogArticlePath } from "@/lib/green/blog/articles";
import { GREEN_BLOG_ROUTE, GREEN_ROUTE } from "@/lib/green/constants";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata = metadataFromPath(GREEN_BLOG_ROUTE);

export default function GreenBlogIndexPage() {
  const [featured, ...rest] = GREEN_BLOG_ARTICLES;

  return (
    <>
      <AiFirstPageJsonLd path={GREEN_BLOG_ROUTE} />
      <ContentPageLayout
        eyebrow="AUROS Green · Blog"
        title="Articles & guides"
        intro="Contenus éducatifs sur RTMS, marketplace, label Verified et traçabilité énergétique — ton professionnel, statuts honnêtes."
      >
        {featured ? (
          <article className="card-flat interactive-subtle mb-10 border border-green-royal/20 bg-green-royal/[0.04] px-5 py-8 md:px-10 md:py-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-green-royal-bright">
              À la une
            </p>
            <p className="mt-3 font-mono text-[10px] tracking-wide text-white/35">
              {new Date(featured.publishedAt).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" · "}
              {featured.readingTimeMinutes} min
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-white md:text-3xl">
              <Link
                href={greenBlogArticlePath(featured.slug)}
                className="transition hover:text-green-royal-bright"
              >
                {featured.title.replace(" | AUROS Green", "")}
              </Link>
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/55">
              {featured.excerpt}
            </p>
            <p className="mt-6">
              <Link
                href={greenBlogArticlePath(featured.slug)}
                className="inline-flex min-h-[44px] items-center rounded-full border border-white/15 px-5 py-2.5 font-mono text-[11px] tracking-wide text-white/70 transition hover:border-white/30 hover:text-white"
              >
                Lire l&apos;article →
              </Link>
            </p>
          </article>
        ) : null}

        <ul className="space-y-6">
          {rest.map((article) => (
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
