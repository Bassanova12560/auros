import type { Metadata } from "next";

import { getRegistryStats } from "@/lib/academy/cert-registry";

import { AcademyRegistryView } from "../_components/AcademyRegistryView";

export const metadata: Metadata = {
  title: "Public registry | AUROS Academy",
  description:
    "Aggregate AUROS Academy certification stats and institution certificates — no personal names published.",
};

export default async function AcademyRegistryPage() {
  const stats = await getRegistryStats();
  return <AcademyRegistryView stats={stats} />;
}
