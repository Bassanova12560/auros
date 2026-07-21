import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { questionsForPack } from "@/lib/trust-packs/definitions";
import { hasEvidence } from "@/lib/trust-packs/score";
import { getTrustPackAssessment } from "@/lib/trust-packs/store";
import {
  TRUST_PACK_META,
  TRUST_PACKS_ROUTE,
} from "@/lib/trust-packs/taxonomy";

import { PackGradeBadge, TrustPacksNav } from "../_components/PackUi";
import { PublishPackButton } from "./_components/PublishPackButton";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { assessment } = await getTrustPackAssessment(id);
  return {
    title: assessment ? `${assessment.name} · Pack` : "Pack",
    robots: { index: false, follow: false },
  };
}

export default async function TrustPackDetailPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const { assessment } = await getTrustPackAssessment(id);
  if (!assessment || assessment.owner_user_id !== userId) notFound();

  const questions = questionsForPack(assessment.pack_id);
  const meta = TRUST_PACK_META[assessment.pack_id];

  return (
    <FocusPageShell path={`${TRUST_PACKS_ROUTE}/${id}`} width="2xl">
      <ContentPageLayout
        product="Trust · Packs"
        eyebrow={meta.label}
        title={assessment.name}
        intro={[assessment.jurisdiction, assessment.status]
          .filter(Boolean)
          .join(" · ")}
      >
        <TrustPacksNav />
        <div className="mb-8">
          <PackGradeBadge
            grade={assessment.grade}
            score={assessment.final_score}
          />
        </div>
        {assessment.description ? (
          <p className="mb-8 text-sm text-white/55">{assessment.description}</p>
        ) : null}

        <ul className="space-y-4">
          {questions.map((q) => {
            const on = Boolean(assessment.checklist[q.id]);
            const ev = assessment.evidence[q.id];
            const sourced = hasEvidence(ev);
            return (
              <li key={q.id} className="border-t border-white/[0.08] pt-4">
                <p className="text-sm text-white/70">{q.q}</p>
                <p className="mt-1 font-mono text-[10px] uppercase text-white/35">
                  {on ? (sourced ? "sourced" : "unsourced") : "no"} · w{q.weight}
                </p>
                {ev?.url ? (
                  <a
                    href={ev.url}
                    className="mt-1 block truncate text-sky-300/70 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ev.url}
                  </a>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          {assessment.status === "draft" ? (
            <PublishPackButton id={assessment.id} />
          ) : (
            <PrimaryButton
              href={`${TRUST_PACKS_ROUTE}/report/${assessment.public_slug}`}
            >
              Rapport public
            </PrimaryButton>
          )}
          <PrimaryButton href={TRUST_PACKS_ROUTE} variant="ghost">
            Catalogue
          </PrimaryButton>
        </div>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
