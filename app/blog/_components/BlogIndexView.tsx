"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import {
  BLOG_ARTICLES,
  blogArticlePath,
  type BlogArticle,
} from "@/lib/blog";
import { AUROS_RESOURCES_ROUTE } from "@/lib/green/constants";

type Pillar = "all" | "rwa" | "energy";

function formatArticleDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function articlePillar(article: BlogArticle): "rwa" | "energy" {
  const blob = `${article.slug} ${article.keywords.join(" ")} ${article.title}`.toLowerCase();
  if (
    /energy|kwh|watt|arl|resource.?layer|on-chain energy|power market|hedge/.test(blob) ||
    article.slug.includes("energy") ||
    article.slug.includes("risk-engine")
  ) {
    return "energy";
  }
  return "rwa";
}

function ArticleCard({
  article,
  featured,
}: {
  article: BlogArticle;
  featured?: boolean;
}) {
  const pillar = articlePillar(article);
  return (
    <article
      className={
        featured
          ? "card-flat interactive-subtle mb-10 border border-white/[0.1] px-5 py-8 md:px-10 md:py-10"
          : "card-flat interactive-subtle px-5 py-6 md:px-8"
      }
    >
      <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-white/35">
        {featured ? <span className="text-white/45">Featured</span> : null}
        <span className={pillar === "energy" ? "text-amber-200/70" : "text-white/35"}>
          {pillar === "energy" ? "Energy / ARL" : "RWA dossier"}
        </span>
        <span>·</span>
        <span className="normal-case tracking-wide">
          {formatArticleDate(article.publishedAt)} · {article.readingTimeMinutes} min
        </span>
      </div>
      <h2
        className={`mt-3 font-display font-semibold text-white ${
          featured ? "text-2xl md:text-3xl" : "text-xl"
        }`}
      >
        <Link href={blogArticlePath(article.slug)} className="transition hover:text-white/80">
          {article.title}
        </Link>
      </h2>
      <p
        className={`mt-3 max-w-2xl leading-relaxed text-white/50 ${
          featured ? "text-base text-white/55" : "text-sm"
        }`}
      >
        {article.excerpt}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={blogArticlePath(article.slug)}
          className="inline-flex min-h-[44px] items-center rounded-full border border-white/15 px-5 py-2.5 font-mono text-[11px] tracking-wide text-white/70 transition hover:border-white/30 hover:text-white"
        >
          Read
        </Link>
        {pillar === "energy" ? (
          <Link
            href="/lab"
            className="inline-flex min-h-[44px] items-center rounded-full border border-amber-500/30 px-5 py-2.5 font-mono text-[11px] tracking-wide text-amber-100/80 transition hover:border-amber-400/50 hover:text-white"
          >
            Open Energy Lab
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export function BlogIndexView() {
  const [pillar, setPillar] = useState<Pillar>("all");

  const filtered = useMemo(() => {
    if (pillar === "all") return BLOG_ARTICLES;
    return BLOG_ARTICLES.filter((a) => articlePillar(a) === pillar);
  }, [pillar]);

  const [featured, ...rest] = filtered;

  return (
    <ContentPageLayout
      eyebrow="Resources · Blog"
      title="Guides — RWA & Resource Layer"
      intro="Long-form education for issuers and builders. Filter by pillar. Energy essays link into the live lab loop — no fake case-study percentages."
      cta={{ href: "/lab", label: "Open Energy Lab" }}
    >
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Blog pillar">
        {(
          [
            { id: "all", label: "All" },
            { id: "rwa", label: "RWA dossier" },
            { id: "energy", label: "Energy / ARL" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={pillar === tab.id}
            onClick={() => setPillar(tab.id)}
            className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition ${
              pillar === tab.id
                ? "border-white/40 bg-white/10 text-white"
                : "border-white/10 text-white/45 hover:border-white/25 hover:text-white/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {featured ? <ArticleCard article={featured} featured /> : null}

      {rest.length > 0 ? (
        <ul className="space-y-6">
          {rest.map((article) => (
            <li key={article.slug}>
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      ) : null}

      {filtered.length === 0 ? (
        <p className="text-sm text-white/50">No articles in this pillar yet.</p>
      ) : null}

      <aside className="mt-12 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-5">
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          After reading
        </p>
        <p className="mt-2 text-sm text-white/55">
          Exercise the shared lab ledger, or open the diligence desk for investors.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 font-mono text-[11px]">
          <Link href="/lab" className="underline-offset-2 hover:underline">
            /lab
          </Link>
          <Link href="/investors" className="underline-offset-2 hover:underline">
            /investors
          </Link>
          <Link href="/builders" className="underline-offset-2 hover:underline">
            /builders
          </Link>
          <Link href={AUROS_RESOURCES_ROUTE} className="underline-offset-2 hover:underline">
            Resources hub
          </Link>
        </div>
      </aside>
    </ContentPageLayout>
  );
}
