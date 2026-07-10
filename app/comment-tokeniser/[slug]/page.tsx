import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import {
  commentTokeniserPath,
  getAllCommentTokeniserLandings,
  getCommentTokeniserLanding,
  type CommentTokeniserSlug,
} from "@/lib/comment-tokeniser/landings";
import { metadataFromPath } from "@/lib/seo/metadata";

import { CommentTokeniserView } from "../_components/CommentTokeniserView";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllCommentTokeniserLandings().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const landing = getCommentTokeniserLanding(slug);
  if (!landing) return { title: "Not found | AUROS" };

  const path = commentTokeniserPath(landing.slug as CommentTokeniserSlug);
  return metadataFromPath(path);
}

export default async function CommentTokeniserLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const landing = getCommentTokeniserLanding(slug);
  if (!landing) notFound();

  const path = commentTokeniserPath(landing.slug as CommentTokeniserSlug);

  return (
    <FocusPageShell path={path} width="3xl" className="!px-0">
      <AiFirstPageJsonLd path={path} />
      <main className="page-main page-main--sticky">
        <CommentTokeniserView landing={landing} />
      </main>
    </FocusPageShell>
  );
}
