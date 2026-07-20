import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  WETS_CATEGORY_LABELS,
  WETS_DISCLAIMER,
  WETS_PQC_QUESTIONS,
} from "@/lib/wets/constants";
import { hasPqcEvidence, parsePqcEvidence } from "@/lib/wets/pqc-evidence";
import { computeProjectQuantumExposure } from "@/lib/wets/quantum-composite";
import { QUANTUM_PLAYBOOK_ROUTE } from "@/lib/wets/quantum-playbook";
import { resolveWetsShieldBridge } from "@/lib/wets/shield-bridge";
import {
  getWetsProject,
  getWetsProjectBySlug,
  listWetsCriteria,
} from "@/lib/wets/store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function resolvePublished(slug: string) {
  const bySlug = await getWetsProjectBySlug(slug);
  if (bySlug.project) return bySlug.project;
  const byId = await getWetsProject(slug);
  if (byId.project?.status === "published") return byId.project;
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await resolvePublished(slug);
  if (!project) return { title: "Quantum dossier | AUROS", robots: { index: false } };
  return {
    title: `${project.name} · Quantum dossier | AUROS`,
    description: `Recours post-quantique et exposition QEI pour ${project.name}`,
  };
}

export default async function QuantumDossierPage({ params }: Props) {
  const { slug } = await params;
  const project = await resolvePublished(slug);
  if (!project) notFound();

  const { criteria } = await listWetsCriteria(project.id);
  const pqcScore =
    criteria.find((c) => c.category === "post_quantum_legal_recourse")?.score ??
    0;
  const exposure = computeProjectQuantumExposure({
    category: project.category,
    pqcScore,
  });
  const evidence = parsePqcEvidence(project.pqc_evidence);
  const shield = await resolveWetsShieldBridge(project.shield_receipt_id);
  const reportHref = project.public_slug
    ? `/report/${project.public_slug}`
    : `/report/${project.id}`;

  return (
    <FocusPageShell path={`/trust/quantum/report/${slug}`} width="2xl">
      <ContentPageLayout
        product="Trust · Quantum"
        eyebrow="Dossier public"
        title={project.name}
        intro={`${WETS_CATEGORY_LABELS[project.category]}${
          project.jurisdiction ? ` · ${project.jurisdiction}` : ""
        } — 4 réponses recours + sources + exposition effective vs classe.`}
      >
        {project.is_demo ? (
          <p className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/[0.08] px-4 py-3 text-sm text-amber-100/90">
            Démo méthodologique — pas un endorsement.
          </p>
        ) : null}

        <section className="mb-10 space-y-2 rounded-xl border border-white/10 px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            Exposition effective
          </p>
          <p className="font-display text-3xl text-white">
            {exposure.effective_exposure}
            <span className="ml-2 font-mono text-base text-white/40">/10</span>
          </p>
          <p className="text-sm text-white/55">
            Base verticale {exposure.vertical.label}: {exposure.vertical_base} −
            delta recours {exposure.recourse_delta} (PQC {pqcScore}/10) ·{" "}
            {exposure.band}
          </p>
          <p className="text-sm text-white/45">{exposure.label}</p>
        </section>

        <section className="space-y-5">
          <h2 className="font-display text-lg text-white">4 questions</h2>
          <ol className="list-decimal space-y-4 pl-5">
            {WETS_PQC_QUESTIONS.map((q) => {
              const on = Boolean(project.pqc_checklist?.[q.id]);
              const ev = evidence[q.id];
              const sourced = hasPqcEvidence(ev);
              return (
                <li key={q.id} className="text-sm text-white/65">
                  <p>{q.q}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/35">
                    {on
                      ? sourced
                        ? "Affirmé + sourcé"
                        : "Affirmé sans preuve (ignoré au scoring)"
                      : "Non affirmé"}
                  </p>
                  {ev?.url ? (
                    <a
                      href={ev.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block truncate text-sky-300/70 hover:underline"
                    >
                      {ev.url}
                    </a>
                  ) : null}
                  {ev?.excerpt ? (
                    <p className="mt-1 text-xs italic text-white/45">
                      “{ev.excerpt}”
                    </p>
                  ) : null}
                  {ev?.receipt_id ? (
                    <p className="mt-1 font-mono text-[10px] text-violet-300/70">
                      shield:{ev.receipt_id}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {shield ? (
          <section className="mt-8 rounded-xl border border-violet-400/25 px-5 py-4 text-sm text-violet-100/85">
            <p className="font-mono text-[10px] uppercase text-violet-200/70">
              Shield
            </p>
            <p className="mt-2">{shield.label}</p>
            {shield.verify_url ? (
              <Link
                href={shield.verify_url}
                className="mt-2 inline-block font-mono text-[11px] text-sky-300/80 hover:underline"
              >
                Verify →
              </Link>
            ) : null}
          </section>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          <PrimaryButton href={reportHref}>Trust Score</PrimaryButton>
          <PrimaryButton href={QUANTUM_PLAYBOOK_ROUTE} variant="ghost">
            Playbook
          </PrimaryButton>
          <PrimaryButton href="/trust/quantum" variant="ghost">
            QEI
          </PrimaryButton>
          <PrimaryButton href="/developers/shield" variant="ghost">
            Reseal
          </PrimaryButton>
        </div>
        <p className="mt-8 text-xs text-white/35">{WETS_DISCLAIMER}</p>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
