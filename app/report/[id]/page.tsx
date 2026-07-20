import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  WETS_CATEGORY_LABELS,
  WETS_CRITERION_LABELS,
  WETS_DISCLAIMER,
  computeFinalScore,
  gradeFromFinalScore,
} from "@/lib/wets/constants";
import {
  getWetsProject,
  getWetsProjectBySlug,
  listWetsCriteria,
} from "@/lib/wets/store";

import { WetsGradeBadge } from "@/app/eau/trust/_components/WetsUi";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

async function resolveProject(idOrSlug: string) {
  const bySlug = await getWetsProjectBySlug(idOrSlug);
  if (bySlug.project) return bySlug.project;
  const byId = await getWetsProject(idOrSlug);
  if (byId.project?.status === "published") return byId.project;
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await resolveProject(id);
  if (!project) {
    return { title: "Report not found | AUROS", robots: { index: false } };
  }
  return {
    title: `${project.name} · Trust Score | AUROS`,
    description: `AUROS Water/Energy Trust Score for ${project.name}`,
    openGraph: {
      title: `${project.name} — AUROS Trust Score`,
      description: project.description?.slice(0, 160) ?? "Water/Energy Trust Score",
    },
  };
}

export default async function PublicWetsReportPage({ params }: Props) {
  const { id } = await params;
  const project = await resolveProject(id);
  if (!project) notFound();

  const { criteria } = await listWetsCriteria(project.id);
  const score = computeFinalScore(criteria);
  const grade = gradeFromFinalScore(score);

  return (
    <FocusPageShell path={`/report/${id}`} width="2xl">
      <article className="space-y-8">
        <header className="space-y-4 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
            AUROS Water/Energy Trust Score
          </p>
          <h1 className="font-display text-3xl text-white md:text-4xl">
            {project.name}
            {project.ticker ? (
              <span className="ml-2 font-mono text-xl text-white/40">
                {project.ticker}
              </span>
            ) : null}
          </h1>
          <div className="flex justify-center">
            <WetsGradeBadge grade={grade} score={score} size="lg" />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-white/35">
            {WETS_CATEGORY_LABELS[project.category]}
            {project.jurisdiction ? ` · ${project.jurisdiction}` : ""}
          </p>
        </header>

        {project.description ? (
          <p className="text-center text-sm leading-relaxed text-white/60">
            {project.description}
          </p>
        ) : null}

        <section className="space-y-5">
          <h2 className="font-display text-lg text-white">Breakdown</h2>
          {criteria.map((c) => (
            <div
              key={c.category}
              className="border-t border-white/[0.08] pt-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-base text-white">
                  {WETS_CRITERION_LABELS[c.category]}
                </h3>
                <span className="font-mono text-sm text-white/70">
                  {c.score}/10 · w{c.weight}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {c.justification}
              </p>
              {c.sources.length > 0 ? (
                <ul className="mt-2 space-y-1 font-mono text-[10px] text-white/35">
                  {c.sources.map((s) => (
                    <li key={s} className="truncate">
                      {s}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </section>

        <p className="text-center text-xs leading-relaxed text-white/35">
          {WETS_DISCLAIMER}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <PrimaryButton href="/partners?intent=wets#contact">
            Equity-for-scoring
          </PrimaryButton>
          <PrimaryButton href="/eau/trust" variant="ghost">
            Console WETS
          </PrimaryButton>
          <Link
            href="/eau/risk"
            className="inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
          >
            WELHR rapide →
          </Link>
        </div>
      </article>
    </FocusPageShell>
  );
}
