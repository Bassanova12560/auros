import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  WETS_CATEGORY_LABELS,
  WETS_CRITERION_LABELS,
  WETS_DISCLAIMER,
  WETS_PQC_QUESTIONS,
  computeFinalScore,
  gradeFromFinalScore,
} from "@/lib/wets/constants";
import { quantumBadgeFromCriteria } from "@/lib/wets/energy-fields";
import { hasPqcEvidence, parsePqcEvidence } from "@/lib/wets/pqc-evidence";
import { computeProjectQuantumExposure } from "@/lib/wets/quantum-composite";
import { resolveWetsShieldBridge } from "@/lib/wets/shield-bridge";
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
  const quantum = quantumBadgeFromCriteria(criteria);
  const pqcScore =
    criteria.find((c) => c.category === "post_quantum_legal_recourse")?.score ??
    0;
  const exposure = computeProjectQuantumExposure({
    category: project.category,
    pqcScore,
  });
  const shield = await resolveWetsShieldBridge(project.shield_receipt_id);
  const evidence = parsePqcEvidence(project.pqc_evidence);
  const quantumHref = project.public_slug
    ? `/trust/quantum/report/${project.public_slug}`
    : `/trust/quantum/report/${project.id}`;

  return (
    <FocusPageShell path={`/report/${id}`} width="2xl">
      <article className="space-y-8">
        {project.is_demo ? (
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/[0.08] px-4 py-3 text-center text-sm text-amber-100/90">
            Démo méthodologique AUROS — pas un endorsement d’émetteur ni une
            note de crédit.
          </p>
        ) : null}

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
          <p
            className={`mx-auto max-w-md rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider ${
              quantum.score >= 6.5
                ? "border-violet-400/40 text-violet-200/90"
                : quantum.score >= 4
                  ? "border-amber-400/40 text-amber-200/90"
                  : "border-white/15 text-white/45"
            }`}
          >
            {quantum.label} · {quantum.score}/10
          </p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-white/35">
            {WETS_CATEGORY_LABELS[project.category]}
            {project.jurisdiction ? ` · ${project.jurisdiction}` : ""}
            {project.behind_the_meter ? " · BTM" : ""}
          </p>
          <p className="mx-auto max-w-lg text-sm text-white/55">
            QEI classe {exposure.vertical_base}/10 → effective{" "}
            <span className="text-white/80">{exposure.effective_exposure}/10</span>{" "}
            (−{exposure.recourse_delta} recours) · {exposure.band}
          </p>
        </header>

        {shield ? (
          <section className="rounded-xl border border-violet-400/25 bg-violet-500/[0.06] px-5 py-4 text-center text-sm text-violet-100/85">
            <p className="font-mono text-[10px] uppercase tracking-wider text-violet-200/70">
              Shield bridge
            </p>
            <p className="mt-2">{shield.label}</p>
            <p className="mt-1 font-mono text-[11px] text-white/40">
              retention ≥{shield.retention_years_min}y
              {shield.profile ? ` · ${shield.profile}` : ""}
            </p>
            {shield.verify_url ? (
              <Link
                href={shield.verify_url}
                className="mt-2 inline-block font-mono text-[11px] text-sky-300/80 hover:underline"
              >
                Verify receipt →
              </Link>
            ) : null}
          </section>
        ) : null}

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

        <section className="space-y-3 border-t border-white/[0.08] pt-6">
          <h2 className="font-display text-lg text-white">PQC evidence</h2>
          <ul className="space-y-2 text-sm text-white/55">
            {WETS_PQC_QUESTIONS.map((q) => {
              const on = Boolean(project.pqc_checklist?.[q.id]);
              const ev = evidence[q.id];
              const sourced = hasPqcEvidence(ev);
              return (
                <li key={q.id}>
                  <span className="font-mono text-[10px] uppercase text-white/35">
                    {on ? (sourced ? "sourced" : "unsourced") : "no"} · {q.id}
                  </span>
                  {ev?.url ? (
                    <a
                      href={ev.url}
                      className="ml-2 text-sky-300/70 hover:underline"
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
        </section>

        <p className="text-center text-xs leading-relaxed text-white/35">
          {WETS_DISCLAIMER}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <PrimaryButton href={quantumHref}>Dossier quantum</PrimaryButton>
          <PrimaryButton href="/partners?intent=wets#contact" variant="ghost">
            Equity-for-scoring
          </PrimaryButton>
          <PrimaryButton href="/eau/trust/reports" variant="ghost">
            Tous les rapports
          </PrimaryButton>
          <PrimaryButton href="/trust/quantum/playbook" variant="ghost">
            Playbook clauses
          </PrimaryButton>
          <PrimaryButton href="/developers/shield" variant="ghost">
            Shield reseal
          </PrimaryButton>
        </div>
      </article>
    </FocusPageShell>
  );
}
