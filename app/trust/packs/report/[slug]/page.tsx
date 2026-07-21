import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { questionsForPack } from "@/lib/trust-packs/definitions";
import { hasEvidence } from "@/lib/trust-packs/score";
import {
  getTrustPackAssessment,
  getTrustPackBySlug,
} from "@/lib/trust-packs/store";
import {
  TRUST_PACK_DISCLAIMER,
  TRUST_PACK_META,
  TRUST_PACKS_ROUTE,
} from "@/lib/trust-packs/taxonomy";

import { PackGradeBadge } from "../../_components/PackUi";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function resolve(slug: string) {
  const bySlug = await getTrustPackBySlug(slug);
  if (bySlug.assessment) return bySlug.assessment;
  const byId = await getTrustPackAssessment(slug);
  if (byId.assessment?.status === "published") return byId.assessment;
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await resolve(slug);
  if (!a) return { title: "Pack not found", robots: { index: false } };
  return {
    title: `${a.name} · Trust Pack | AUROS`,
    description: `AUROS Asset Trust Pack — ${TRUST_PACK_META[a.pack_id].label}`,
  };
}

export default async function TrustPackPublicReportPage({ params }: Props) {
  const { slug } = await params;
  const a = await resolve(slug);
  if (!a) notFound();

  const meta = TRUST_PACK_META[a.pack_id];
  const questions = questionsForPack(a.pack_id);

  return (
    <FocusPageShell path={`${TRUST_PACKS_ROUTE}/report/${slug}`} width="2xl">
      <article className="space-y-8">
        {a.is_demo ? (
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/[0.08] px-4 py-3 text-center text-sm text-amber-100/90">
            Démo méthodologique — pas un endorsement.
          </p>
        ) : null}

        <header className="space-y-4 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
            AUROS Asset Trust Pack
          </p>
          <h1 className="font-display text-3xl text-white md:text-4xl">
            {a.name}
          </h1>
          <div className="flex justify-center">
            <PackGradeBadge grade={a.grade} score={a.final_score} />
          </div>
          <p className="font-mono text-[11px] uppercase text-white/35">
            {meta.label}
            {a.jurisdiction ? ` · ${a.jurisdiction}` : ""}
          </p>
        </header>

        {a.description ? (
          <p className="text-center text-sm text-white/60">{a.description}</p>
        ) : null}

        <section className="space-y-4">
          <h2 className="font-display text-lg text-white">Checklist</h2>
          {questions.map((q) => {
            const on = Boolean(a.checklist[q.id]);
            const ev = a.evidence[q.id];
            const sourced = hasEvidence(ev);
            return (
              <div key={q.id} className="border-t border-white/[0.08] pt-4">
                <p className="text-sm text-white/70">{q.q}</p>
                <p className="mt-1 font-mono text-[10px] uppercase text-white/35">
                  {on ? (sourced ? "sourced" : "unsourced") : "no"}
                </p>
                {ev?.url ? (
                  <a
                    href={ev.url}
                    className="mt-1 block truncate font-mono text-[11px] text-sky-300/70 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ev.url}
                  </a>
                ) : null}
                {ev?.excerpt ? (
                  <p className="mt-1 text-xs italic text-white/45">
                    “{ev.excerpt}”
                  </p>
                ) : null}
              </div>
            );
          })}
        </section>

        <p className="text-center text-xs text-white/35">{TRUST_PACK_DISCLAIMER}</p>

        <div className="flex flex-wrap justify-center gap-3">
          <PrimaryButton href={TRUST_PACKS_ROUTE}>Tous les packs</PrimaryButton>
          <PrimaryButton href="/verify" variant="ghost">
            Verify
          </PrimaryButton>
          <PrimaryButton href="/developers/shield" variant="ghost">
            Shield
          </PrimaryButton>
          <PrimaryButton href="/partners?intent=trust-pack#contact" variant="ghost">
            Equity-for-scoring
          </PrimaryButton>
        </div>
      </article>
    </FocusPageShell>
  );
}
