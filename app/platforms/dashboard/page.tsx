import type { Metadata } from "next";

import { listPlatformInbox } from "@/lib/actions/platform-pipeline";
import { metadataFromPath } from "@/lib/seo/metadata";

import { PlatformInboxView } from "../_components/PlatformInboxView";

export const metadata: Metadata = metadataFromPath("/platforms/dashboard");

export const dynamic = "force-dynamic";

export default async function PlatformsDashboardPage() {
  const inbox = await listPlatformInbox();
  return (
    <PlatformInboxView
      partnerCode={inbox.partnerCode}
      rows={inbox.rows}
      error={inbox.error ?? null}
    />
  );
}
