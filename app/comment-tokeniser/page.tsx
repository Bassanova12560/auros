import type { Metadata } from "next";
import Link from "next/link";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { COMMENT_TOKENISER_ROUTE } from "@/lib/comment-tokeniser/constants";
import {
  commentTokeniserPath,
  getAllCommentTokeniserLandings,
  getCommentTokeniserCopy,
} from "@/lib/comment-tokeniser/landings";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata: Metadata = metadataFromPath(COMMENT_TOKENISER_ROUTE);

export default function CommentTokeniserHubPage() {
  const landings = getAllCommentTokeniserLandings();

  return (
    <FocusPageShell path={COMMENT_TOKENISER_ROUTE} width="3xl">
      <AiFirstPageJsonLd path={COMMENT_TOKENISER_ROUTE} />
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">AUROS</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white">
        Comment tokeniser mon actif
      </h1>
      <p className="mt-4 text-lg text-white/55">
        Guides indicatifs par classe d&apos;actif — chaque parcours préremplit le wizard dossier
        AUROS (immobilier, art, fonds, obligations, crédit privé, énergie et eau). Indicatif uniquement,
        sans engagement.
      </p>
      <ul className="mt-10 space-y-4">
        {landings.map((landing) => {
          const copy = getCommentTokeniserCopy(landing.slug, "fr");
          const href = commentTokeniserPath(landing.slug);
          return (
            <li key={landing.slug}>
              <Link
                href={href}
                className="block rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-5 transition hover:border-white/20"
              >
                <p className="font-display text-xl text-white">{copy.h1}</p>
                <p className="mt-2 text-sm text-white/50">{copy.description}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </FocusPageShell>
  );
}
