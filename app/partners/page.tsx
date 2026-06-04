import type { Metadata } from "next";

import { metadataFromPath } from "@/lib/seo/metadata";

import { PartnersPageContent } from "./_components/PartnersPageContent";

export const metadata: Metadata = metadataFromPath("/partners");

export default function PartnersPage() {
  return <PartnersPageContent />;
}
