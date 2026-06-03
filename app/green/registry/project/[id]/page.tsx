import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { getGreenRegistryProjectById, greenProjectSummary } from "@/lib/green/green-registry";
import { greenRegistryProjectPath, normalizeGreenRegistryProjectId } from "@/lib/green/registry-routes";

import { GreenRegistryProjectDetailView } from "../../../_components/GreenRegistryProjectDetailView";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getGreenRegistryProjectById(normalizeGreenRegistryProjectId(id));

  if (!project) {
    return {
      title: "Projet introuvable | AUROS Green",
      robots: { index: false, follow: false },
    };
  }

  const path = greenRegistryProjectPath(project.id);
  const description = greenProjectSummary(project, "fr").slice(0, 160);

  return {
    title: `${project.name} | Registre AUROS Green`,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: project.name,
      description,
      url: absoluteUrl(path),
      type: "article",
    },
  };
}

export default async function GreenRegistryProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getGreenRegistryProjectById(normalizeGreenRegistryProjectId(id));

  if (!project) notFound();

  const path = greenRegistryProjectPath(project.id);

  return (
    <>
      <AiFirstPageJsonLd path={path} />
      <GreenRegistryProjectDetailView project={project} />
    </>
  );
}
