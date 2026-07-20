import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import {
  WETS_CATEGORY_LABELS,
  WETS_CONSOLE_ROUTE,
} from "@/lib/wets/constants";
import {
  getWetsProject,
  listWetsCriteria,
  listWetsRiskEvents,
} from "@/lib/wets/store";

import { WetsNav } from "@/app/eau/trust/_components/WetsUi";
import { ProjectScoreEditor } from "./_components/ProjectScoreEditor";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { project } = await getWetsProject(id);
  return {
    title: project ? `${project.name} · WETS` : "Projet WETS",
    robots: { index: false, follow: false },
  };
}

export default async function WetsProjectDetailPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const { project } = await getWetsProject(id);
  if (!project || project.owner_user_id !== userId) notFound();

  const { criteria } = await listWetsCriteria(id);
  const { events } = await listWetsRiskEvents({
    region: project.jurisdiction ?? undefined,
    projectId: id,
  });

  return (
    <FocusPageShell path={`${WETS_CONSOLE_ROUTE}/projects/${id}`} width="3xl">
      <ContentPageLayout
        product="Eau · Trust"
        eyebrow={WETS_CATEGORY_LABELS[project.category]}
        title={project.name}
        intro={[
          project.ticker,
          project.jurisdiction,
          project.legal_structure,
        ]
          .filter(Boolean)
          .join(" · ")}
      >
        <WetsNav />
        {project.website_url ? (
          <p className="mb-6 text-sm">
            <a
              href={project.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-300/80 underline-offset-2 hover:underline"
            >
              {project.website_url}
            </a>
          </p>
        ) : null}
        <p className="mb-8 text-sm leading-relaxed text-white/55">
          {project.description}
        </p>

        <ProjectScoreEditor projectId={id} initial={criteria} />

        <section className="mt-12 border-t border-white/[0.08] pt-8">
          <h2 className="font-display text-lg text-white">Risk events liés</h2>
          {events.length === 0 ? (
            <p className="mt-2 text-sm text-white/45">
              Aucun événement —{" "}
              <Link
                href={`${WETS_CONSOLE_ROUTE}/risk-events`}
                className="underline-offset-2 hover:underline"
              >
                en ajouter
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {events.map((e) => (
                <li
                  key={e.id}
                  className="rounded-lg border border-white/8 px-3 py-3 text-sm text-white/65"
                >
                  <span className="font-mono text-[10px] uppercase text-amber-400/80">
                    {e.severity} · {e.event_type}
                  </span>
                  <p className="mt-1">
                    {e.region}
                    {e.event_date ? ` · ${e.event_date}` : ""}
                  </p>
                  <p className="mt-1 text-white/50">{e.description}</p>
                </li>
              ))}
            </ul>
          )}
          {project.status === "published" && project.public_slug ? (
            <p className="mt-6 text-sm">
              Rapport public :{" "}
              <Link
                href={`/report/${project.public_slug}`}
                className="text-emerald-300/90 underline-offset-2 hover:underline"
              >
                /report/{project.public_slug}
              </Link>
            </p>
          ) : null}
        </section>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
