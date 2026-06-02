import type { Metadata } from "next";

import { notFound } from "next/navigation";

import {
  getGreenRegistryExpertByToken,
  getGreenRegistryProjectByToken,
} from "@/lib/green/green-registry";

import { GreenVerifyView } from "../../_components/GreenVerifyView";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const project = await getGreenRegistryProjectByToken(decodeURIComponent(token));

  if (!project) {
    return { title: "Verification | AUROS Green", robots: { index: false } };
  }

  return {
    title: `${project.name} | AUROS Green`,
    description: `AUROS Green label verification — ${project.name}.`,
    robots: { index: false, follow: false },
  };
}

export default async function GreenVerifyPage({ params }: PageProps) {
  const { token } = await params;
  const decoded = decodeURIComponent(token);
  const [project, expert] = await Promise.all([
    getGreenRegistryProjectByToken(decoded),
    getGreenRegistryExpertByToken(decoded),
  ]);

  if (!project && !expert) notFound();

  return <GreenVerifyView project={project} expert={expert} />;
}

export function generateStaticParams() {
  return [];
}
